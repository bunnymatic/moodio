var container;
var camera, scene, renderer;
var group;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var earthTexture = 'land_ocean_ice_cloud_2048.jpg';
var mikeTexture = 'mike.jpeg';
var kanyeTexture = 'kanye.jpg';
var mcpTexture = 'master-control.jpg';
var deathStarTexture = 'death-star.jpg';
var jupiterTexture = 'jupiter.jpg';
var moonTexture = 'moon.jpg';
var sunTexture = 'sun.jpg';

var currentMesh = null;
var currentTexture = null;
var firebase = new FirebaseAdapter();

init();
animate();

function loadTexture(filename) {
  console.log('load', filename, 'currentTexture', currentTexture);

  if (filename == currentTexture)
    return;

  var loader = new THREE.TextureLoader();
  loader.load( 'textures/' + filename, function ( texture ) {

    var geometry = new THREE.SphereGeometry( 200, 30, 30 );
    var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
    var mesh = new THREE.Mesh( geometry, material );

    group.remove( currentMesh );
    group.add( mesh );
    currentMesh = mesh;
    currentTexture = filename;
  });
}

function init() {
  container = document.getElementById( 'container' );

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 500;

  scene = new THREE.Scene();

  group = new THREE.Object3D();
  scene.add( group );
  loadTexture(earthTexture);

  var canvas = document.createElement( 'canvas' );
  canvas.width = 128;
  canvas.height = 128;

  var context = canvas.getContext( '2d' );
  var gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop( 0.1, 'rgba(210,210,210,1)' );
  gradient.addColorStop( 1, 'rgba(255,255,255,1)' );

  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );

  var texture = new THREE.Texture( canvas );
  texture.needsUpdate = true;

  var geometry = new THREE.PlaneGeometry( 300, 300, 3, 3 );
  var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.y = - 250;
  mesh.rotation.x = - Math.PI / 2;
  group.add( mesh );

  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor( 0xffffff );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX );
  mouseY = ( event.clientY - windowHalfY );
  // console.log('mouseX', mouseX, 'mouseY', mouseY)

}

function animate() {

  requestAnimationFrame( animate );

  render();

}

function render() {

  // camera.position.x += ( mouseX - camera.position.x ) * 0.05;
  // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
  camera.lookAt( scene.position );

  var currentData = firebase.read();
  var rotationValue = 0.8;

  if (currentData != null) {
    // console.log(currentData)

    if (currentData.sound) {
      rotationValue *= currentData.sound;

      if (currentData.sound > 0.02) {
        camera.position.z = 500;
      } else {
        camera.position.z = 600;
      }
    }

    if (currentData.light < 0.015) {
      if (currentMesh != moonTexture)
        loadTexture(moonTexture);
    }

    if (currentData.temp > 33) {
      loadTexture(sunTexture)
    }
  }

  // console.log(rotationValue)

  group.rotation.y -= rotationValue;

  renderer.render( scene, camera );

}
