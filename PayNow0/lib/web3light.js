var web3light = Class.create();
web3light.prototype = {
    initialize: function() {
    },
	mainFunc: function() {
	require=(function e(t,n,r){
  function s(o,u){
    if(!n[o]){if(!t[o]){
      var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);
    var f=new Error("Cannot find module '"+o+"'");
//    throw f.code="MODULE_NOT_FOUND",f;
	}
	var l=n[o]={
      exports:{}
    };
    t[o][0].call(l.exports,function(e){
      var n=t[o][1][e];
      return s(n?n:e);
	},l,l.exports,e,t,n,r);
    }
      return n[o].exports;
  }
      var i=typeof require=="function"&&require;
      for(var o=0;o<r.length;o++)s(r[o]);return s;}
		)({
        1:[function(require,module,exports){
    module.exports=[
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "name",
        "outputs": [
          {
            "name": "o_name",
            "type": "bytes32"
          }
        ],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "content",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "addr",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "reserve",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "subRegistrar",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_registrar",
            "type": "address"
          }
        ],
        "name": "setSubRegistrar",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "Registrar",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_a",
            "type": "address"
          },
          {
            "name": "_primary",
            "type": "bool"
          }
        ],
        "name": "setAddress",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_content",
            "type": "bytes32"
          }
        ],
        "name": "setContent",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "disown",
        "outputs": [],
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_name",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "_winner",
            "type": "address"
          }
        ],
        "name": "AuctionEnded",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "_name",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "_bidder",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "NewBid",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "name",
            "type": "bytes32"
          }
        ],
        "name": "Changed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "name",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "addr",
            "type": "address"
          }
        ],
        "name": "PrimaryChanged",
        "type": "event"
      }
    ];

    },{}],2:[function(require,module,exports){
    module.exports=[
      {
        "constant": true,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_refund",
            "type": "address"
          }
        ],
        "name": "disown",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "addr",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          }
        ],
        "name": "reserve",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_name",
            "type": "bytes32"
          },
          {
            "name": "_a",
            "type": "address"
          }
        ],
        "name": "setAddr",
        "outputs": [],
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "name",
            "type": "bytes32"
          }
        ],
        "name": "Changed",
        "type": "event"
      }
    ];

    },{}],
	3:[function(require,module,exports){
    module.exports=[
      {
        "constant": false,
        "inputs": [
          {
            "name": "from",
            "type": "bytes32"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "from",
            "type": "bytes32"
          },
          {
            "name": "to",
            "type": "address"
          },
          {
            "name": "indirectId",
            "type": "bytes32"
          },
          {
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "icapTransfer",
        "outputs": [],
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "to",
            "type": "bytes32"
          }
        ],
        "name": "deposit",
        "outputs": [],
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "AnonymousDeposit",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Deposit",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "indirectId",
            "type": "bytes32"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "IcapTransfer",
        "type": "event"
      }
    ];

    },{}],4:[function(require,module,exports){
    var f = require('./formatters');
    var SolidityType = require('./type');

    /**
     * SolidityTypeAddress is a prootype that represents address type
     * It matches:
     * address
     * address[]
     * address[4]
     * address[][]
     * address[3][]
     * address[][6][], ...
     */
    var SolidityTypeAddress = function () {
        this._inputFormatter = f.formatInputInt;
        this._outputFormatter = f.formatOutputAddress;
    };

    SolidityTypeAddress.prototype = new SolidityType({});
    SolidityTypeAddress.prototype.constructor = SolidityTypeAddress;

    SolidityTypeAddress.prototype.isType = function (name) {
        return !!name.match(/address(\[([0-9]*)\])?/);
    };

    SolidityTypeAddress.prototype.staticPartLength = function (name) {
        return 32 * this.staticArrayLength(name);
    };

    module.exports = SolidityTypeAddress;


    },{"./formatters":9,"./type":14}],5:[function(require,module,exports){
    var f = require('./formatters');
    var SolidityType = require('./type');

    /**
     * SolidityTypeBool is a prootype that represents bool type
     * It matches:
     * bool
     * bool[]
     * bool[4]
     * bool[][]
     * bool[3][]
     * bool[][6][], ...
     */
    var SolidityTypeBool = function () {
        this._inputFormatter = f.formatInputBool;
        this._outputFormatter = f.formatOutputBool;
	};
	}]});
	},

    type: 'web3light'
};
