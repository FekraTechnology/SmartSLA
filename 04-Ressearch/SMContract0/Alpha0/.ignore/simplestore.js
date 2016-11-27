contract('SimpleStorage', function() {
  it("should store some data", function() {
      var ss = SimpleStorage.deployed();
      return ss.set(13).then(function() {
        return ss.get.call().then(function(stored) {
          assert.equal(stored, 13, "mismatch!!");
        });
      });
    });
  });
