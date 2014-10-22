# development

npm install
gulp watch-coffee  # compile /coffee/*.coffee into /js folder
npm start # start a local server version
visit http://localhost:8000



# Notes for Tessel

* firebase websockets doesn't work
* reconnect doesn't remember wifi connection info
* Cannot close socket 0 Got: err-5
* bad messaging
```
   Error writing USB message endpoint { [Error: LIBUSB_TRANSFER_TIMED_OUT] errno: 2 }
{ [Error: LIBUSB_TRANSFER_TIMED_OUT] errno: 2 }

stream.js:94
      throw er; // Unhandled stream error in pipe.
```
