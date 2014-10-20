var Color;

Color = (function() {
  var GOLDEN_RATIO_CONJUGATE, restrictWithin, validateAlpha, validateColor;

  GOLDEN_RATIO_CONJUGATE = 0.618033988749895;

  restrictWithin = function(val, min, max) {
    if (val < min) {
      val === min;
    }
    if (val > max) {
      val === max;
    }
    return val;
  };

  validateColor = function(color) {
    return parseInt(restrictWithin(color, 0, 255), 10);
  };

  validateAlpha = function(alpha) {
    return restrictWithin(alpha, 0.0, 1.0);
  };

  Color.prototype.hsv_to_rgb = function() {
    var b, f, g, h, h_i, p, q, r, s, t, v, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    h = this.hue;
    s = this.saturation;
    v = this.value;
    h_i = parseInt(h * 6, 10);
    f = h * 6 - h_i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    if (h_i === 0) {
      _ref = [v, t, p], r = _ref[0], g = _ref[1], b = _ref[2];
    }
    if (h_i === 1) {
      _ref1 = [q, v, p], r = _ref1[0], g = _ref1[1], b = _ref1[2];
    }
    if (h_i === 2) {
      _ref2 = [p, v, t], r = _ref2[0], g = _ref2[1], b = _ref2[2];
    }
    if (h_i === 3) {
      _ref3 = [p, q, v], r = _ref3[0], g = _ref3[1], b = _ref3[2];
    }
    if (h_i === 4) {
      _ref4 = [t, p, v], r = _ref4[0], g = _ref4[1], b = _ref4[2];
    }
    if (h_i === 5) {
      _ref5 = [v, p, q], r = _ref5[0], g = _ref5[1], b = _ref5[2];
    }
    return _ref6 = [r * 256, g * 256, b * 256], this.red = _ref6[0], this.green = _ref6[1], this.blue = _ref6[2], _ref6;
  };

  function Color(h, s, v) {
    var _ref;
    _ref = [h, s, v], this.hue = _ref[0], this.saturation = _ref[1], this.value = _ref[2];
    this.hsv_to_rgb();
  }

  Color.prototype.decimal_rgb = function() {
    return _.map([this.red, this.green, this.blue], function(val) {
      return parseInt(val, 10);
    });
  };

  Color.prototype.hex_rgb = function() {
    return '#' + _.map(this.decimal_rgb(), function(val) {
      return val.toString(16);
    }).join('');
  };

  return Color;

})();
