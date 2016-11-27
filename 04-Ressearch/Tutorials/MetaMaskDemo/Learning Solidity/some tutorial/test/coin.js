// contract('Coin', function() {
//   it("should confirm account[0] is minter", function() {
//     var c = Coin.deployed();
//     return c.minter.call().then(function(theminter){
//       assert.equal(theminter, web3.eth.accounts[0], "minter is the first account");
//     });
//   });
//   it("should mint 1000 and put in account[0] balance", function() {
//     var c = Coin.deployed();
//     return c.mint.call(10000).then(function(mnt){
//       var cb = c.balances[accounts[0]];
//       console.log('cb= ', cb);
// //      assert.equal(cb, 10000, "10000 wasn't in the first account");
//     });
//   });
// });
