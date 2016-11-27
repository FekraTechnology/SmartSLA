contract('PayNowAlpha', function(accounts) {

  it("should create a new incident", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a73";
    var inc_created = "2016-10-31 08:48:27";

    return itc.createIncident(inc_requester, inc_sys_id, inc_created).then(function(isIncCreated) {
      assert(isIncCreated, "Incident not created!");

    });
  });

  it("should return an open incident state", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a73";
    var inc_created = "100";

    return itc.createIncident(inc_requester, inc_sys_id, inc_created).then(function() {
      return itc.readIncidentState(inc_sys_id).then(function(state) {
        assert.equal(state, "open", "state not open!");
      });
    });
  });

  it("should get the latest updated timestamp", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a";
    var inc_created = Date.now();

    return itc.createIncident(inc_requester, inc_sys_id, inc_created).then(function() {
           return itc.updateIncidentState(inc_sys_id, "wip").then(function() {
        return itc.readIncUpdatedOn.call(inc_sys_id).then(function(suo) {
          assert((Date.now() - suo.valueOf())/Date.now() < 1, "was it close?!");
        });
      });
    });
  });

  it("should read the number of open incidents in the contract", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];

    return itc.readOpenIncidents(inc_requester).then(function(num) {
      assert.equal(num.valueOf(), 1, "Incidents more than 1! ");
    });
  });

  it("should return an open incident createdon timestamp", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a";
    var inc_created = Date.now();
    return itc.createIncident(inc_requester, inc_sys_id, inc_created).then(function() {
      return itc.readIncUpdatedOn(inc_sys_id).then(function(co) {
        assert((Date.now() - co.valueOf())/Date.now() < 1, "timestamp is wrong!");
      });
    });
  });

  it("should update the state of an incident to wip", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a73";
    var inc_created = Date.now();

    return itc.createIncident(inc_requester, inc_sys_id, inc_created).then(function() {
      return itc.updateIncidentState(inc_sys_id, "wip").then(function() {
        return itc.readIncidentState.call(inc_sys_id).then(function(wp) {
          assert.equal(wp, "wip", "current state is wrong!");
        });
      });
    });
  });

});
