var Web3 = require("web3");
var SolidityEvent = require("web3/lib/web3/event.js");

(function() {
  // Planned for future features, logging, etc.
  function Provider(provider) {
    this.provider = provider;
  }

  Provider.prototype.send = function() {
    this.provider.send.apply(this.provider, arguments);
  };

  Provider.prototype.sendAsync = function() {
    this.provider.sendAsync.apply(this.provider, arguments);
  };

  var BigNumber = (new Web3()).toBigNumber(0).constructor;

  var Utils = {
    is_object: function(val) {
      return typeof val == "object" && !Array.isArray(val);
    },
    is_big_number: function(val) {
      if (typeof val != "object") return false;

      // Instanceof won't work because we have multiple versions of Web3.
      try {
        new BigNumber(val);
        return true;
      } catch (e) {
        return false;
      }
    },
    merge: function() {
      var merged = {};
      var args = Array.prototype.slice.call(arguments);

      for (var i = 0; i < args.length; i++) {
        var object = args[i];
        var keys = Object.keys(object);
        for (var j = 0; j < keys.length; j++) {
          var key = keys[j];
          var value = object[key];
          merged[key] = value;
        }
      }

      return merged;
    },
    promisifyFunction: function(fn, C) {
      var self = this;
      return function() {
        var instance = this;

        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {
          var callback = function(error, result) {
            if (error != null) {
              reject(error);
            } else {
              accept(result);
            }
          };
          args.push(tx_params, callback);
          fn.apply(instance.contract, args);
        });
      };
    },
    synchronizeFunction: function(fn, instance, C) {
      var self = this;
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var tx_params = {};
        var last_arg = args[args.length - 1];

        // It's only tx_params if it's an object and not a BigNumber.
        if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
          tx_params = args.pop();
        }

        tx_params = Utils.merge(C.class_defaults, tx_params);

        return new Promise(function(accept, reject) {

          var decodeLogs = function(logs) {
            return logs.map(function(log) {
              var logABI = C.events[log.topics[0]];

              if (logABI == null) {
                return null;
              }

              var decoder = new SolidityEvent(null, logABI, instance.address);
              return decoder.decode(log);
            }).filter(function(log) {
              return log != null;
            });
          };

          var callback = function(error, tx) {
            if (error != null) {
              reject(error);
              return;
            }

            var timeout = C.synchronization_timeout || 240000;
            var start = new Date().getTime();

            var make_attempt = function() {
              C.web3.eth.getTransactionReceipt(tx, function(err, receipt) {
                if (err) return reject(err);

                if (receipt != null) {
                  // If they've opted into next gen, return more information.
                  if (C.next_gen == true) {
                    return accept({
                      tx: tx,
                      receipt: receipt,
                      logs: decodeLogs(receipt.logs)
                    });
                  } else {
                    return accept(tx);
                  }
                }

                if (timeout > 0 && new Date().getTime() - start > timeout) {
                  return reject(new Error("Transaction " + tx + " wasn't processed in " + (timeout / 1000) + " seconds!"));
                }

                setTimeout(make_attempt, 1000);
              });
            };

            make_attempt();
          };

          args.push(tx_params, callback);
          fn.apply(self, args);
        });
      };
    }
  };

  function instantiate(instance, contract) {
    instance.contract = contract;
    var constructor = instance.constructor;

    // Provision our functions.
    for (var i = 0; i < instance.abi.length; i++) {
      var item = instance.abi[i];
      if (item.type == "function") {
        if (item.constant == true) {
          instance[item.name] = Utils.promisifyFunction(contract[item.name], constructor);
        } else {
          instance[item.name] = Utils.synchronizeFunction(contract[item.name], instance, constructor);
        }

        instance[item.name].call = Utils.promisifyFunction(contract[item.name].call, constructor);
        instance[item.name].sendTransaction = Utils.promisifyFunction(contract[item.name].sendTransaction, constructor);
        instance[item.name].request = contract[item.name].request;
        instance[item.name].estimateGas = Utils.promisifyFunction(contract[item.name].estimateGas, constructor);
      }

      if (item.type == "event") {
        instance[item.name] = contract[item.name];
      }
    }

    instance.allEvents = contract.allEvents;
    instance.address = contract.address;
    instance.transactionHash = contract.transactionHash;
  };

  // Use inheritance to create a clone of this contract,
  // and copy over contract's static functions.
  function mutate(fn) {
    var temp = function Clone() { return fn.apply(this, arguments); };

    Object.keys(fn).forEach(function(key) {
      temp[key] = fn[key];
    });

    temp.prototype = Object.create(fn.prototype);
    bootstrap(temp);
    return temp;
  };

  function bootstrap(fn) {
    fn.web3 = new Web3();
    fn.class_defaults  = fn.prototype.defaults || {};

    // Set the network iniitally to make default data available and re-use code.
    // Then remove the saved network id so the network will be auto-detected on first use.
    fn.setNetwork("default");
    fn.network_id = null;
    return fn;
  };

  // Accepts a contract object created with web3.eth.contract.
  // Optionally, if called without `new`, accepts a network_id and will
  // create a new version of the contract abstraction with that network_id set.
  function Contract() {
    if (this instanceof Contract) {
      instantiate(this, arguments[0]);
    } else {
      var C = mutate(Contract);
      var network_id = arguments.length > 0 ? arguments[0] : "default";
      C.setNetwork(network_id);
      return C;
    }
  };

  Contract.currentProvider = null;

  Contract.setProvider = function(provider) {
    var wrapped = new Provider(provider);
    this.web3.setProvider(wrapped);
    this.currentProvider = provider;
  };

  Contract.new = function() {
    if (this.currentProvider == null) {
      throw new Error("DateTime error: Please call setProvider() first before calling new().");
    }

    var args = Array.prototype.slice.call(arguments);

    if (!this.unlinked_binary) {
      throw new Error("DateTime error: contract binary not set. Can't deploy new instance.");
    }

    var regex = /__[^_]+_+/g;
    var unlinked_libraries = this.binary.match(regex);

    if (unlinked_libraries != null) {
      unlinked_libraries = unlinked_libraries.map(function(name) {
        // Remove underscores
        return name.replace(/_/g, "");
      }).sort().filter(function(name, index, arr) {
        // Remove duplicates
        if (index + 1 >= arr.length) {
          return true;
        }

        return name != arr[index + 1];
      }).join(", ");

      throw new Error("DateTime contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of DateTime: " + unlinked_libraries);
    }

    var self = this;

    return new Promise(function(accept, reject) {
      var contract_class = self.web3.eth.contract(self.abi);
      var tx_params = {};
      var last_arg = args[args.length - 1];

      // It's only tx_params if it's an object and not a BigNumber.
      if (Utils.is_object(last_arg) && !Utils.is_big_number(last_arg)) {
        tx_params = args.pop();
      }

      tx_params = Utils.merge(self.class_defaults, tx_params);

      if (tx_params.data == null) {
        tx_params.data = self.binary;
      }

      // web3 0.9.0 and above calls new twice this callback twice.
      // Why, I have no idea...
      var intermediary = function(err, web3_instance) {
        if (err != null) {
          reject(err);
          return;
        }

        if (err == null && web3_instance != null && web3_instance.address != null) {
          accept(new self(web3_instance));
        }
      };

      args.push(tx_params, intermediary);
      contract_class.new.apply(contract_class, args);
    });
  };

  Contract.at = function(address) {
    if (address == null || typeof address != "string" || address.length != 42) {
      throw new Error("Invalid address passed to DateTime.at(): " + address);
    }

    var contract_class = this.web3.eth.contract(this.abi);
    var contract = contract_class.at(address);

    return new this(contract);
  };

  Contract.deployed = function() {
    if (!this.address) {
      throw new Error("Cannot find deployed address: DateTime not deployed or address not set.");
    }

    return this.at(this.address);
  };

  Contract.defaults = function(class_defaults) {
    if (this.class_defaults == null) {
      this.class_defaults = {};
    }

    if (class_defaults == null) {
      class_defaults = {};
    }

    var self = this;
    Object.keys(class_defaults).forEach(function(key) {
      var value = class_defaults[key];
      self.class_defaults[key] = value;
    });

    return this.class_defaults;
  };

  Contract.extend = function() {
    var args = Array.prototype.slice.call(arguments);

    for (var i = 0; i < arguments.length; i++) {
      var object = arguments[i];
      var keys = Object.keys(object);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        var value = object[key];
        this.prototype[key] = value;
      }
    }
  };

  Contract.all_networks = {
  "default": {
    "abi": [
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getHour",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getWeekday",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "year",
            "type": "uint16"
          },
          {
            "name": "month",
            "type": "uint8"
          },
          {
            "name": "day",
            "type": "uint8"
          },
          {
            "name": "hour",
            "type": "uint8"
          },
          {
            "name": "minute",
            "type": "uint8"
          }
        ],
        "name": "toTimestamp",
        "outputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getDay",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "year",
            "type": "uint16"
          },
          {
            "name": "month",
            "type": "uint8"
          },
          {
            "name": "day",
            "type": "uint8"
          },
          {
            "name": "hour",
            "type": "uint8"
          }
        ],
        "name": "toTimestamp",
        "outputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getSecond",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "year",
            "type": "uint16"
          },
          {
            "name": "month",
            "type": "uint8"
          },
          {
            "name": "day",
            "type": "uint8"
          }
        ],
        "name": "toTimestamp",
        "outputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "year",
            "type": "uint16"
          },
          {
            "name": "month",
            "type": "uint8"
          },
          {
            "name": "day",
            "type": "uint8"
          },
          {
            "name": "hour",
            "type": "uint8"
          },
          {
            "name": "minute",
            "type": "uint8"
          },
          {
            "name": "second",
            "type": "uint8"
          }
        ],
        "name": "toTimestamp",
        "outputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getYear",
        "outputs": [
          {
            "name": "",
            "type": "uint16"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getMonth",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "year",
            "type": "uint16"
          }
        ],
        "name": "isLeapYear",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "year",
            "type": "uint256"
          }
        ],
        "name": "leapYearsBefore",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "month",
            "type": "uint8"
          },
          {
            "name": "year",
            "type": "uint16"
          }
        ],
        "name": "getDaysInMonth",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "__throw",
        "outputs": [],
        "payable": false,
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "name": "getMinute",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "type": "function"
      }
    ],
    "unlinked_binary": "0x6060604052610760806100126000396000f3606060405236156100b95760e060020a60003504633e239e1a81146100be5780634ac1ad78146100ce57806362ba9687146100de57806365c728401461014a5780637f791833146101c75780638aa001fc146101ed5780638c8d98a0146101fd5780639054bdec1461022157806392d6631314610240578063a324ad2414610250578063a6f0e57714610266578063b199993714610276578063b238ad0e14610286578063e1041d8614610299578063fa93f883146102b8575b610002565b34610002576102c8600435610309565b34610002576102c8600435610324565b34610002576103356004356024356044356064356084356000610490868686868660005b6000600061018060405190810160405280600c905b600081526020019060019003908161011757506107b29250505b8861ffff168261ffff1610156104ab576104b88261038d565b34610002576102c86004356000610484825b60e06040519081016040528060008152602001600081526020016000815260200160008152602001600081526020016000815260200160008152602001506000600060006000600093506106c1865b6000806301e1338083046107b29081019082906103ac906103b5565b3461000257610335600435602435604435606435600061049a8585858560006000610102565b34610002576102c8600435610354565b346100025761033560043560243560443560006104a3848484600060006000610102565b346100025761033560043560243560443560643560843560a435610102565b346100025761035d6004356101ab565b34610002576102c8600435600061061e8261015c565b346100025761037460043561038d565b34610002576103356004356103b5565b34610002576102c8600435602435610400565b346100025761046a604080516020810190915260008152806001610002565b34610002576102c8600435610479565b6040805160ff929092168252519081900360200190f35b60ff168260ff161115156103045785846201518001111561073b5760ff821660408601525b61046c865b6018603c808304040661048b565b60ff1660a086015261074f865b60076201518082046004010661048b565b60408051918252519081900360200190f35b60ff166080860152610317865b603c810661048b565b6040805161ffff9092168252519081900360200190f35b604080519115158252519081900360200190f35b6106aa825b6000600461ffff83160661ffff1660001415156106295750600061048b565b6105b48361ffff165b6000190160648104600482040361019082040161048b565b60ff1662015180029050805085848201111561072b5760ff821660208601525b600191505b6102df856020015186600001515b60008260ff166001148061041757508260ff166003145b8061042557508260ff166005145b8061043357508260ff166007145b8061044157508260ff166008145b8061044f57508260ff16600a145b8061045d57508260ff16600c145b1561066c5750601f6106bb565b005b60ff166060860152610347865b603c8082040661048b565b6040015190505b919050565b9695505050505050565b95945050505050565b949350505050565b601f81526104e18961038d565b156104cb576301e28500909201916104d5565b6301e13380909201915b60019190910190610131565b156104f257601d60208201526104fa565b601c60208201525b601f60408201819052601e606083018190526080830182905260a0830181905260c0830182905260e0830182905261010083018190526101208301829052610140830152610160820152600191505b8760ff168261ffff16101561058457806001830361ffff16600c81101561000257602002015162015180029092019160019190910190610549565b505060001990940160ff9081166201518002909401928416610e100292909201908316603c020191160192915050565b036301e2850081029093016107b119830161ffff168490036301e1338002019290505b848311156105eb576105f36001830361038d565b509392505050565b15610607576301e284ff1990920191610612565b6301e1337f19909201915b600019909101906105d7565b60200151905061048b565b606461ffff83160661ffff1660001415156106465750600161048b565b61019061ffff83160661ffff1660001415156106645750600061048b565b50600161048b565b8260ff166004148061068157508260ff166006145b8061068f57508260ff166009145b8061069d57508260ff16600b145b156103885750601e6106bb565b156106b75750601d6106bb565b50601c5b92915050565b61ffff1685526106d26107b26103b5565b85516106e19061ffff166103b5565b86516301e28500929091039182029095016107b11990950161ffff168190036301e133800294909401939250600191505b600c60ff8316116103ed576103cd828660000151610400565b9283019260019190910190610712565b6201518090930192600191909101906103f2565b60ff1660c08601525050505091905056",
    "events": {},
    "updated_at": 1478580810182,
    "links": {},
    "address": "0xf7bf51707d0871bb64d6b3a4d2c76c8e89e6c8a5"
  }
};

  Contract.checkNetwork = function(callback) {
    var self = this;

    if (this.network_id != null) {
      return callback();
    }

    this.web3.version.network(function(err, result) {
      if (err) return callback(err);

      var network_id = result.toString();

      // If we have the main network,
      if (network_id == "1") {
        var possible_ids = ["1", "live", "default"];

        for (var i = 0; i < possible_ids.length; i++) {
          var id = possible_ids[i];
          if (Contract.all_networks[id] != null) {
            network_id = id;
            break;
          }
        }
      }

      if (self.all_networks[network_id] == null) {
        return callback(new Error(self.name + " error: Can't find artifacts for network id '" + network_id + "'"));
      }

      self.setNetwork(network_id);
      callback();
    })
  };

  Contract.setNetwork = function(network_id) {
    var network = this.all_networks[network_id] || {};

    this.abi             = this.prototype.abi             = network.abi;
    this.unlinked_binary = this.prototype.unlinked_binary = network.unlinked_binary;
    this.address         = this.prototype.address         = network.address;
    this.updated_at      = this.prototype.updated_at      = network.updated_at;
    this.links           = this.prototype.links           = network.links || {};
    this.events          = this.prototype.events          = network.events || {};

    this.network_id = network_id;
  };

  Contract.networks = function() {
    return Object.keys(this.all_networks);
  };

  Contract.link = function(name, address) {
    if (typeof name == "function") {
      var contract = name;

      if (contract.address == null) {
        throw new Error("Cannot link contract without an address.");
      }

      Contract.link(contract.contract_name, contract.address);

      // Merge events so this contract knows about library's events
      Object.keys(contract.events).forEach(function(topic) {
        Contract.events[topic] = contract.events[topic];
      });

      return;
    }

    if (typeof name == "object") {
      var obj = name;
      Object.keys(obj).forEach(function(name) {
        var a = obj[name];
        Contract.link(name, a);
      });
      return;
    }

    Contract.links[name] = address;
  };

  Contract.contract_name   = Contract.prototype.contract_name   = "DateTime";
  Contract.generated_with  = Contract.prototype.generated_with  = "3.2.0";

  // Allow people to opt-in to breaking changes now.
  Contract.next_gen = false;

  var properties = {
    binary: function() {
      var binary = Contract.unlinked_binary;

      Object.keys(Contract.links).forEach(function(library_name) {
        var library_address = Contract.links[library_name];
        var regex = new RegExp("__" + library_name + "_*", "g");

        binary = binary.replace(regex, library_address.replace("0x", ""));
      });

      return binary;
    }
  };

  Object.keys(properties).forEach(function(key) {
    var getter = properties[key];

    var definition = {};
    definition.enumerable = true;
    definition.configurable = false;
    definition.get = getter;

    Object.defineProperty(Contract, key, definition);
    Object.defineProperty(Contract.prototype, key, definition);
  });

  bootstrap(Contract);

  if (typeof module != "undefined" && typeof module.exports != "undefined") {
    module.exports = Contract;
  } else {
    // There will only be one version of this contract in the browser,
    // and we can use that.
    window.DateTime = Contract;
  }
})();
