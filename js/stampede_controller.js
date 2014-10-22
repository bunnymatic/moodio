var StampedeController;

StampedeController = (function() {
  StampedeController.prototype.max = {
    light: 0.65039062,
    sound: 0.19921875,
    temp: 28.8156,
    humid: 49.851
  };

  StampedeController.prototype.min = {
    light: 0.00976562,
    sound: 0.01464844,
    temp: 26.9387,
    humid: 34.3557
  };

  function StampedeController(logger) {
    this.firebase = new FirebaseAdapter();
    setInterval((function(_this) {
      return function() {
        var animal, sensors, _i, _ref, _results;
        sensors = _this.firebase.read();
        if (sensors == null) {
          return;
        }
        if (logger != null) {
          logger.log(sensors);
        }
        _results = [];
        for (animal = _i = 0, _ref = _this.animalCount(sensors); 0 <= _ref ? _i < _ref : _i > _ref; animal = 0 <= _ref ? ++_i : --_i) {
          _results.push(addRandomAnimal(_this.hslOffset(sensors)));
        }
        return _results;
      };
    })(this), 200);
  }

  StampedeController.prototype.animalCount = function(sensors) {
    var count;
    count = this.percent(sensors.sound, this.min.sound, this.max.sound);
    return Math.floor(count);
  };

  StampedeController.prototype.hslOffset = function(sensors) {
    var hue, light, lum, sat;
    hue = Math.random();
    light = this.percent(sensors.light, this.min.light, this.max.light);
    sat = Math.random() + 5;
    if (light < 1) {
      sat = void 0;
    }
    lum = Math.random() + 10;
    return {
      hue: hue,
      sat: sat,
      lum: lum
    };
  };

  StampedeController.prototype.percent = function(value, min, max) {
    return (value - min) / (max - min) * 100;
  };

  StampedeController.prototype.valueFromPercent = function(value, min, max) {};

  return StampedeController;

})();

new StampedeController();
