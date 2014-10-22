class StampedeController
  valueNames: ['light', 'sound', 'temp', 'humid']
  max: {light: 0.65039062, sound: 0.19921875, temp: 28.8156, humid: 49.851}
  min: {light: 0.00976562, sound: 0.01464844, temp: 26.9387, humid: 34.3557}
  count: {
    min: 0
    max: 10
  }

  constructor: ->
    @firebase = new FirebaseAdapter()

    setInterval =>
      sensors = @firebase.read()
      @log(sensors)

      for animal in [0...@animalCount(sensors)]
        addRandomAnimal @hslOffset(sensors)
    , 200

  animalCount: (sensors) ->
    count = @percent(sensors.sound, @min.sound, @max.sound)
    Math.floor count

  hslOffset: (sensors) ->
    hue = Math.random()

    light = @percent(sensors.light, @min.light, @max.light)
    sat = window.sat || Math.random() + 5
    if light < 1
      sat = undefined

    lum = window.lum || Math.random() + 10

    hue: hue
    sat: sat
    lum: lum

  log: (sensors) ->
    for name in @valueNames
      @setMax(name, sensors[name])
      @setMin(name, sensors[name])

  setMax: (name, value) ->
    @max[name] ||= value
    @max[name] = Math.max(value, @max[name])

  setMin: (name, value) ->
    @min[name] ||= value
    @min[name] = Math.min(value, @min[name])

  percent: (value, min, max) ->
    (value - min) / (max - min) * 100

  valueFromPercent: (value, min, max) ->


new StampedeController()
