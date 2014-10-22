var StampedeController;

StampedeController = (function() {
  StampedeController.prototype.valueNames = ['light', 'sound', 'temp', 'humid'];

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

  StampedeController.prototype.count = {
    min: 0,
    max: 10
  };

  function StampedeController() {
    this.firebase = new FirebaseAdapter();
    setInterval((function(_this) {
      return function() {
        var animal, sensors, _i, _ref, _results;
        sensors = _this.firebase.read();
        _this.log(sensors);
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
    sat = window.sat || Math.random() + 5;
    if (light < 1) {
      sat = void 0;
    }
    lum = window.lum || Math.random() + 10;
    return {
      hue: hue,
      sat: sat,
      lum: lum
    };
  };

  StampedeController.prototype.log = function(sensors) {
    var name, _i, _len, _ref, _results;
    _ref = this.valueNames;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      this.setMax(name, sensors[name]);
      _results.push(this.setMin(name, sensors[name]));
    }
    return _results;
  };

  StampedeController.prototype.setMax = function(name, value) {
    var _base;
    (_base = this.max)[name] || (_base[name] = value);
    return this.max[name] = Math.max(value, this.max[name]);
  };

  StampedeController.prototype.setMin = function(name, value) {
    var _base;
    (_base = this.min)[name] || (_base[name] = value);
    return this.min[name] = Math.min(value, this.min[name]);
  };

  StampedeController.prototype.percent = function(value, min, max) {
    return (value - min) / (max - min) * 100;
  };

  StampedeController.prototype.valueFromPercent = function(value, min, max) {};

  return StampedeController;

})();

new StampedeController();
