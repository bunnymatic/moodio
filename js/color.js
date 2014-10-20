var Color;

Color = (function() {
  var validateColor;

  validateColor = function(color) {
    if (color < 0) {
      color === 0;
    }
    if (color > 255) {
      color === 255;
    }
    return parseInt(color, 10);
  };

  function Color(r, g, b, a) {
    this.red = validateColor(r);
    this.green = validateColor(g);
    this.blue = validateColor(b);
    this.alpha = validateAlpha(a);
  }

  Color.prototype.hsv_to_rgb = function(h, s, v) {
    var b, f, g, h_i, p, q, r, t, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
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
    return _.map([r * 256, g * 256, b * 256], function(val) {
      return parseInt(val, 10);
    });
  };

  return Color;

})();
