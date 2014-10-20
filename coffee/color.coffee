class Color

  validateColor = (color) ->
    color == 0 if color < 0
    color == 255 if color > 255
    parseInt(color,10)
    
  constructor: (r,g,b,a) ->
    @red = validateColor(r)
    @green = validateColor(g)
    @blue =  validateColor(b)
    @alpha = validateAlpha(a)
    
  # HSV values in [0..1[
  # returns [r, g, b] values from 0 to 255
  hsv_to_rgb: (h, s, v) ->
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
    _.map [r*256, g*256, b*256], (val) -> parseInt(val, 10)
