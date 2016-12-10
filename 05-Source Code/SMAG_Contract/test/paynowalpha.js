contract('PayNowAlpha', function(accounts) {

  it("should create a new task", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a73";
    var inc_created = "2016-10-31 08:48:27";
    var inc_priority = "High";

    return itc.createTask(inc_requester, inc_sys_id, inc_created, inc_priority).then(function(isIncCreated) {
      assert(isIncCreated, "task not created!");

    });
  });

  it("should return an open task state", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a73";
    var inc_created = "100";
    var inc_priority = "High";

    return itc.createTask(inc_requester, inc_sys_id, inc_created, inc_priority).then(function(isIncCreated) {
      return itc.readTaskState("inc_sys_id").then(function(state) {
        assert.equal(state.valueOf(), "open", "state not open!");
      });
    });
  });

  it("should get the latest updated timestamp", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a";
    var inc_created = Date.now();

    return itc.createtask(inc_requester, inc_sys_id, inc_created).then(function() {
           return itc.updatetaskState(inc_sys_id, "wip").then(function() {
        return itc.readIncUpdatedOn.call(inc_sys_id).then(function(suo) {
          assert((Date.now() - suo.valueOf())/Date.now() < 1, "was it close?!");
        });
      });
    });
  });

  it("should read the number of open tasks in the contract", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];

    return itc.readOpentasks(inc_requester).then(function(num) {
      assert.equal(num.valueOf(), 3, "tasks more than 3! ");
    });
  });

  it("should return an open task createdon timestamp", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a";
    var inc_created = Date.now();
    return itc.createtask(inc_requester, inc_sys_id, inc_created).then(function() {
      return itc.readIncUpdatedOn(inc_sys_id).then(function(co) {
        assert((Date.now() - co.valueOf())/Date.now() < 1, "timestamp is wrong!");
      });
    });
  });

  it("should update the state of an task to wip", function() {
    var itc = PayNowAlpha.deployed();
    var inc_requester = accounts[0];
    var inc_sys_id = "f41a73";
    var inc_created = Date.now();

    return itc.createtask(inc_requester, inc_sys_id, inc_created).then(function() {
      return itc.updatetaskState(inc_sys_id, "wip").then(function() {
        return itc.readtaskState.call(inc_sys_id).then(function(wp) {
          assert.equal(wp, "wip", "current state is wrong!");
        });
      });
    });
  });

});
