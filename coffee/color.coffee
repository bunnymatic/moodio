class Color

  GOLDEN_RATIO_CONJUGATE = 0.618033988749895
  
  restrictWithin = (val, min, max) ->
    val == min if val < min
    val == max if val > max
    val
    
  validateColor = (color) ->
    parseInt(restrictWithin(color, 0, 255), 10)

  validateAlpha = (alpha) -> 
    restrictWithin(alpha, 0.0, 1.0)

  hsv_to_rgb: ->
    h = @hue
    s = @saturation
    v = @value
    h_i = parseInt(h*6, 10)
    f = h*6 - h_i
    p = v * (1 - s)
    q = v * (1 - f*s)
    t = v * (1 - (1 - f) * s)
    [r, g, b] = [v, t, p] if h_i==0
    [r, g, b] = [q, v, p] if h_i==1
    [r, g, b] = [p, v, t] if h_i==2
    [r, g, b] = [p, q, v] if h_i==3
    [r, g, b] = [t, p, v] if h_i==4
    [r, g, b] = [v, p, q] if h_i==5
    [@red, @green, @blue] = [r*256, g*256, b*256]        

  constructor: (h,s,v) ->
    [@hue, @saturation, @value] = [h,s,v]
    @hsv_to_rgb()

  # HSV values in [0..1[
  # returns [r, g, b] values from 0 to 255
  decimal_rgb:->
    _.map [@red, @green, @blue], (val) -> parseInt(val, 10)

  hex_rgb: ->
    '#' + _.map(@decimal_rgb(), (val) -> val.toString(16)).join ''
