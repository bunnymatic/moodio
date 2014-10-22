if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;

var ANIM_SPEED = 550;
var ANIM_DURATION = 1000;
var ANIM_START_X = -1000;

var camera, controls, scene, renderer;
var container, stats;

var NEAR = 5, FAR = 6000;

var sceneHUD, cameraOrtho, hudMaterial;

var morph, morphs = [];

var light;

var clock = new THREE.Clock();

init();
animate();


function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // SCENE CAMERA

    camera = new THREE.PerspectiveCamera( 23, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
    camera.position.set( 700, 200, 1900 );

    controls = new THREE.FirstPersonControls( camera );

    controls.lookSpeed = 0;
    controls.movementSpeed = 500;
    controls.noFly = false;
    controls.lookVertical = true;
    controls.constrainVertical = true;
    controls.verticalMin = 1.5;
    controls.verticalMax = 2.0;

    controls.lon = -110;

    // SCENE

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x2222222, 3000, FAR );

    // LIGHTS

    var ambient = new THREE.AmbientLight( 0x444444 );
    scene.add( ambient );

    light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI/2, 1 );
    light.position.set( 0, 1500, 1000 );
    light.target.position.set( 0, 0, 0 );

    light.castShadow = true;

    light.shadowCameraNear = 700;
    light.shadowCameraFar = camera.far;
    light.shadowCameraFov = 50;

    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = SHADOW_MAP_WIDTH;
    light.shadowMapHeight = SHADOW_MAP_HEIGHT;

    scene.add( light );

    createScene();

    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    container.appendChild( renderer.domElement );

    renderer.setClearColor( scene.fog.color, 1 );
    renderer.autoClear = false;

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

    controls.handleResize();

}

function createScene( ) {

    // GROUND

    var geometry = new THREE.PlaneGeometry( 100, 100 );
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0x222222 } );
    planeMaterial.ambient = planeMaterial.color;

    var ground = new THREE.Mesh( geometry, planeMaterial );

    ground.position.set( 0, FLOOR, 0 );
    ground.rotation.x = - Math.PI / 2;
    ground.scale.set( 100, 100, 100 );

    ground.castShadow = false;
    ground.receiveShadow = true;

    scene.add( ground );

    // MORPHS

    function addMorph( geometry, y, z, hslOffset ) {
        var material = new THREE.MeshLambertMaterial( { color: 0xffaa55, morphTargets: true, vertexColors: THREE.FaceColors } );

        material.color.offsetHSL( hslOffset.hue, hslOffset.sat, hslOffset.lum );
        material.ambient = material.color;

        var meshAnim = new THREE.MorphAnimMesh( geometry, material );

        meshAnim.speed = ANIM_SPEED;
        meshAnim.duration = ANIM_DURATION;
        meshAnim.time = 600 * Math.random();

        meshAnim.position.set( ANIM_START_X, y, z );
        meshAnim.rotation.y = Math.PI/2;

        meshAnim.castShadow = true;
        meshAnim.receiveShadow = true;

        scene.add( meshAnim );

        morphs.push( meshAnim );

        setTimeout(function(){
            scene.remove(meshAnim);
        }, 6000);

    }

    function morphColorsToFaceColors( geometry ) {

        if ( geometry.morphColors && geometry.morphColors.length ) {

            var colorMap = geometry.morphColors[ 0 ];

            for ( var i = 0; i < colorMap.colors.length; i ++ ) {

                geometry.faces[ i ].color = colorMap.colors[ i ];

            }

        }

    }

    var loader = new THREE.JSONLoader();

    zoo = {};

    loader.load( "models/animated/horse.js", function( geometry ) {
        morphColorsToFaceColors( geometry );
        zoo.horse = geometry;
    } );

    loader.load( "models/animated/flamingo.js", function( geometry ) {
        morphColorsToFaceColors( geometry );
        zoo.flamingo = geometry;
    } );

    loader.load( "models/animated/stork.js", function( geometry ) {
        morphColorsToFaceColors( geometry );
        zoo.stork = geometry;
    } );

    window.addHorse = function(hslOffset){
        addAnimal( zoo.horse, FLOOR, hslOffset );
    };

    window.addFlamingo = function(hslOffset){
        addBird(zoo.flamingo, hslOffset);
    };

    window.addStork = function(hslOffset){
        addBird(zoo.stork, hslOffset);
    };

    window.addBird = function(bird, hslOffset){
        addAnimal( bird, FLOOR + Math.random() * 400 + 100, hslOffset );
    };

    window.addAnimal = function(animal, y, hslOffset){
        var z = (Math.random() * 800) + 200;
        addMorph( animal, y, z, hslOffset );
    };

    animals = [addHorse, addFlamingo, addStork];
    window.addRandomAnimal = function(hslOffset){
        var addAnimal = animals[Math.floor(Math.random()*animals.length)];
        addAnimal(hslOffset);
    };

}

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {

    var delta = clock.getDelta();

    for ( var i = 0; i < morphs.length; i ++ ) {

        morph = morphs[ i ];

        morph.updateAnimation( 1000 * delta );

        morph.position.x += morph.speed * delta;

        if ( morph.position.x  > 2000 )  {

            morph.position.x = -1000 - Math.random() * 500;

        }

    }

    controls.update( delta );

    renderer.clear();
    renderer.render( scene, camera );

}
