contract('Conference', function(accounts) {
  it("Should check if owner is coinbase address (accounts[0])", function() {
    var con = Conference.deployed();
    return con.organizer.call().then(function(organizer) {
      assert.equal(organizer, accounts[0], "Organizer is not accounts[0]!");
    });
  });
  it("Should check if quota is 500", function() {
    var con = Conference.deployed();
    return con.quota.call().then(function(quota) {
      assert.equal(quota, 500, "Quota doesn't match");
    });
  });
  it("Should update quota", function() {
    var con = Conference.deployed();
    return con.changeQuota(300).then(function(result) {
      return con.quota.call().then(function(display) {
        assert.equal(display, 300, "Quota didn't change correctly");
        console.log('quota updated successfully')
      });
    });
  });
  it("Should buy a ticket", function() {
    var con = Conference.deployed();
    var ticketPrice = web3.toWei(.05, 'ether');
    var initialBalance = web3.eth.getBalance(con.address).toNumber();
    console.log('initial balance is ', initialBalance);
    console.log('ticket price is ', ticketPrice);
    return con.buyTicket({ from: accounts[1], value: ticketPrice }).then(function() {
      var newBalance = web3.eth.getBalance(con.address).toNumber();
      console.log('new balance is ', newBalance);
      var difference = newBalance - initialBalance;
      assert.equal(difference, ticketPrice, "Difference should be what was sent");
      return con.numRegistrants.call().then(function(num) {
        assert.equal(num, 1, "there should be 1 registrant");
        return con.registrantsPaid.call(accounts[1]).then(function(amount) {
          assert.equal(amount.toNumber(), ticketPrice, "Sender's paid but is not listed");
        }).catch(amount);
      }).catch(num);
    }).catch();
  });

});
