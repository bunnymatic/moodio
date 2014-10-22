var SEPARATION = 100, AMOUNTX = 50, AMOUNTY = 50;

var container;
var camera, scene, renderer;

var particles, particle, count = 0;

var values = {
  sound: 0.2,
  temperature: 0.5,
  light: 0.2
};

function makeScaler(minMax, desiredMinMax) {
  var desiredMinMax = desiredMinMax || [0,1];
  var min = minMax[0];
  var max = minMax[1];
  var desiredMin = desiredMinMax[0];
  var desiredMax = desiredMinMax[1];

  return function(value) {
    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }
    return (((desiredMax - desiredMin) * (value - min)) / (max - min)) + desiredMin;
  };
}

var scaleSound = makeScaler([0.01, 0.2], [0.2, 0.9]);
var scaleTemperature = makeScaler([15, 38]);
var scaleLight = makeScaler([0.01, 0.05], [0.1, 0.5]);
var firebaseAdapter = new FirebaseAdapter();

tweenValue = function(values, key, newValue) {
  new TWEEN.Tween({value: values[key]})
  .to({value:newValue}, 500)
  .easing(TWEEN.Easing.Quartic.In)
  .onUpdate(
    function() {
      values[key] = this.value;
    }
  )
  .start();
}

var generateColor = function() {
  var color = new THREE.Color();
  var hue = colorScale(values.temperature).hsl()[0]/360;
  color.setHSL(hue, 1, values.light);
  return color;
};

setInterval(function() {
  if (data = firebaseAdapter.read()) {
    var soundReading       = parseFloat(data.sound);
    tweenValue(values, 'sound', scaleSound(soundReading));
    // values.sound = scaleSound(soundReading);
    // console.log(values.sound)

    var temperatureReading = parseFloat(data.temp);
    tweenValue(values, 'temperature', scaleTemperature(temperatureReading));

    var lightReading       = parseFloat(data.light);
    tweenValue(values, 'light', scaleLight(lightReading));
  };
}, 500);

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var colorScale = chroma.scale(['lightblue', 'green', 'yellow', 'orange', 'red', 'fuchsia']);


init();
animate();

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 1000;

  scene = new THREE.Scene();

  particles = new Array();

  var PI2 = Math.PI * 2;

  var i = 0;

  for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

    for ( var iy = 0; iy < AMOUNTY; iy ++ ) {

      var color = 0xffffff;

      // color = randomBool() ? color1 : color2
      var material = new THREE.SpriteCanvasMaterial( {

        color: color,
        program: function ( context ) {

          context.beginPath();
          context.arc( 0, 0, 0.5, 0, PI2, true );
          context.fill();

        }

      } );

      particle = particles[ i ++ ] = new THREE.Sprite( material );
      particle.position.x = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
      particle.position.z = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
      scene.add( particle );

    }

  }

  renderer = new THREE.CanvasRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}
function animate() {

  requestAnimationFrame( animate );

  render();

}

function render() {
  TWEEN.update();
  camera.position.x += ( 200 - camera.position.x ) * .05;
  camera.position.y += ( 200 - camera.position.y ) * .05;
  camera.lookAt( scene.position );

  var i = 0;

  for ( var ix = 0; ix < AMOUNTX; ix ++ ) {

    for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
      particle = particles[ i++ ];

      particle.material.color = generateColor();

      particle.position.y = ( Math.sin( ( ix + count ) * 0.5) * 50 ) +
        ( Math.sin( ( iy + count ) * 0.3) * 50 );

      particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.5) + 1 ) * 4 +
        ( Math.sin( ( iy + count ) * 0.3) + 1 ) * 4;

    }

  }

  renderer.render( scene, camera );

  count += values.sound;
}
