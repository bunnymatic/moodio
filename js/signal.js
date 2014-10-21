var LightPosition, Signal, Spectrum, Temperature, VertexOffset,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Signal = (function() {
  function Signal() {}

  Signal.prototype.sample = function(t) {
    return this.fn(t);
  };

  return Signal;

})();

Temperature = (function(_super) {
  __extends(Temperature, _super);

  function Temperature() {
    return Temperature.__super__.constructor.apply(this, arguments);
  }

  Temperature.prototype.fn = function(t) {
    var x;
    t || (t = Date.now() / 1000);
    x = t % 2400;
    if (parseInt(t, 10) % 2) {
      return Math.cos(x * x * Math.PI / 3000.0);
    } else {
      return Math.sin(x * Math.PI / 380.0);
    }
  };

  return Temperature;

})(Signal);

VertexOffset = (function(_super) {
  __extends(VertexOffset, _super);

  function VertexOffset() {
    return VertexOffset.__super__.constructor.apply(this, arguments);
  }

  VertexOffset.prototype.fn = function() {
    return Math.randomInRange(0, 0.5);
  };

  return VertexOffset;

})(Signal);

Spectrum = (function(_super) {
  __extends(Spectrum, _super);

  function Spectrum() {
    return Spectrum.__super__.constructor.apply(this, arguments);
  }

  Spectrum.prototype.fn = function(t) {
    var h, s, v;
    t = (t || Date.now()) % 1000;
    h = t / 1000;
    s = 0.5;
    v = 0.95;
    return new Color(h, s, v).hex_rgb();
  };

  return Spectrum;

})(Signal);

LightPosition = (function(_super) {
  __extends(LightPosition, _super);

  function LightPosition() {
    return LightPosition.__super__.constructor.apply(this, arguments);
  }

  LightPosition.prototype.fn = function(t) {
    var x;
    x = (t / 1000) % 2000 * Math.PI / 5.0;
    return Math.cos(x);
  };

  return LightPosition;

})(Signal);
