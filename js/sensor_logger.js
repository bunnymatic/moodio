var SensorLogger;

SensorLogger = (function() {
  SensorLogger.prototype.valueNames = ['light', 'sound', 'temp', 'humid'];

  SensorLogger.prototype.max = {
    light: 0.65039062,
    sound: 0.19921875,
    temp: 28.8156,
    humid: 49.851
  };

  SensorLogger.prototype.min = {
    light: 0.00976562,
    sound: 0.01464844,
    temp: 26.9387,
    humid: 34.3557
  };

  function SensorLogger() {
    setInterval((function(_this) {
      return function() {
        return console.log(_this.min, _this.max);
      };
    })(this), 1000);
  }

  SensorLogger.prototype.log = function(readings) {
    var name, _i, _len, _ref, _results;
    _ref = this.valueNames;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      this.setMax(name, readings[name]);
      _results.push(this.setMin(name, readings[name]));
    }
    return _results;
  };

  SensorLogger.prototype.setMax = function(name, value) {
    var _base;
    (_base = this.max)[name] || (_base[name] = value);
    return this.max[name] = Math.max(value, this.max[name]);
  };

  SensorLogger.prototype.setMin = function(name, value) {
    var _base;
    (_base = this.min)[name] || (_base[name] = value);
    return this.min[name] = Math.min(value, this.min[name]);
  };

  return SensorLogger;

})();
