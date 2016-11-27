contract('Ballot', function() {
  it("should confirm chairperson is account[0]", function() {
    var b = Ballot.deployed();
    return b.chairperson.call().then(function(cp){
      assert.equal(cp, web3.eth.accounts[0], "chairperson is the not first account!");
    });
  });
  it("put two proposals. prop 1 and prop 2", function() {
    var b = Ballot.deployed();
    var p1 = b.proposals.call(0);
//    var p2 = b.proposals[1];
      assert.equal(p1, 'prop 1', "proposal 1 != Prop 1!");
//      assert.equal(p1, 'prop 2', "proposal 2 != Prop 2!");

//      assert.equal(cb, 10000, "10000 wasn't in the first account");
  });
});
