class FirebaseAdapter

  buffer: null
  sensorsData: null
  fetchUrl: "https://amber-fire-6627.firebaseio.com/tessel/sensors"

  constructor: (limit = 100) ->

    sensorsData = new Firebase(fetchUrl)
    sensorsData.limit(limit)

    sensorsData.on 'child_added', (snapshot, prevChildName) =>
      buffer = snapshot.val()

  read: ->
    buffer
