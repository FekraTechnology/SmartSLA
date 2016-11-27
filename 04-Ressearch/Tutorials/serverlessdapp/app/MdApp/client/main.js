import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

function checkWeb3(){
  console.log('Checking Web3 support');
  // Checks Web3 support
  if(typeof web3 == 'object'){
    console.log("we found web3!");
  } else if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
    // If there's a web3 library loaded, then make your own web3
    web3 = new Web3(web3.currentProvider);
  } else if (typeof Web3 !== 'undefined') {
    // If there isn't then set a provider
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  } else if(typeof web3 == 'undefined') {
    // Alert the user he is not in a web3 compatible browser
    console.log("web3 not found! this is not a compatible browser. Please use Mist or install MetaMask Addon to your browser")
  }
  return;
}

function loadContract(_caddr) {
// load the contract to javascript
  cAbi = loadContractABI(_caddr);

  web3.eth.getCode(_caddr, function(e, r) {
    if (!e && r.length > 3)
      ethervoteContract = web3.eth.contract(cAbi);
      ethervote = ethervoteContract.at(_caddr);
      return ethervote;
    });
}

function getUserInfo(){
  web3.eth.getAccounts(function(e,accounts){
    if (!e) {
      console.log(typeof accounts);
      console.log('will say something about accounts here');
    } else {
      console.log('did something go wrong?');
    }
  });
}

function loadContractABI(){
  var contractABI =
  [ { constant: false,
      inputs: [ [Object], [Object] ],
      name: 'vote',
      outputs: [],
      payable: false,
      type: 'function' },
    { payable: false, type: 'fallback' },
    { anonymous: false,
      inputs: [ [Object], [Object], [Object] ],
      name: 'LogVote',
      type: 'event' } ];
      return contractABI;
}

Template.contract.onCreated(function contractOnCreated() {
  // counter starts at 0
  //this.counter = new ReactiveVar(0);
  checkWeb3();
});

Template.contract.helpers({
  c_address(_addr) {
    return _addr;
  },
});

Template.contract.events({
    'click button'(event, instance) {
    //instance.counter.set(instance.counter.get() + 1);
    // Load the contract
    caddr = "0x6a37e2a62ccc81d8f5c9e28783b8f2915794db0a";
    //var ui = getUserInfo();
    loadedContract = loadContract(caddr);
    console.log("this is the contract", loadedContract);
  }
});
