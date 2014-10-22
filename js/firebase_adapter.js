var FirebaseAdapter;

FirebaseAdapter = (function() {
  FirebaseAdapter.prototype.buffer = null;

  FirebaseAdapter.prototype.fetchUrl = "https://amber-fire-6627.firebaseio.com/tessel/sf/sensors";

  function FirebaseAdapter(limit) {
    var sensorsData;
    if (limit == null) {
      limit = 100;
    }
    sensorsData = new Firebase(this.fetchUrl);
    sensorsData.limit(limit);
    sensorsData.on('child_added', (function(_this) {
      return function(snapshot, prevChildName) {
        return _this.buffer = snapshot.val();
      };
    })(this));
  }

  FirebaseAdapter.prototype.read = function() {
    return this.buffer;
  };

  return FirebaseAdapter;

})();
