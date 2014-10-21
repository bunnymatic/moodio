if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -250;

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

    //light.shadowCameraVisible = true;

    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = SHADOW_MAP_WIDTH;
    light.shadowMapHeight = SHADOW_MAP_HEIGHT;

    scene.add( light );

    createHUD();
    createScene();

    // RENDERER

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    container.appendChild( renderer.domElement );

    renderer.setClearColor( scene.fog.color, 1 );
    renderer.autoClear = false;

    //

    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    // STATS

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    container.appendChild( stats.domElement );

    //

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

function createHUD() {

    // cameraOrtho = new THREE.OrthographicCamera( SCREEN_WIDTH / - 2, SCREEN_WIDTH / 2,  SCREEN_HEIGHT / 2, SCREEN_HEIGHT / - 2, -10, 1000 );
    // cameraOrtho.position.z = 10;

    // var shader = THREE.UnpackDepthRGBAShader;
    // var uniforms = new THREE.UniformsUtils.clone( shader.uniforms );

    // hudMaterial = new THREE.ShaderMaterial( { vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader, uniforms: uniforms } );

    // var hudGeo = new THREE.PlaneGeometry( SHADOW_MAP_WIDTH / 2, SHADOW_MAP_HEIGHT / 2 );
    // var hudMesh = new THREE.Mesh( hudGeo, hudMaterial );
    // hudMesh.position.x = ( SCREEN_WIDTH - SHADOW_MAP_WIDTH / 2 ) * -0.5;
    // hudMesh.position.y = ( SCREEN_HEIGHT - SHADOW_MAP_HEIGHT / 2 ) * -0.5;
    // hudMesh.rotation.x = Math.PI / 2;

    // sceneHUD = new THREE.Scene();
    // sceneHUD.add( hudMesh );

    // cameraOrtho.lookAt( sceneHUD.position );

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

    // TEXT

    // var textGeo = new THREE.TextGeometry( "CODEO", {

    //     size: 200,
    //     height: 50,
    //     curveSegments: 12,

    //     font: "gentilis",
    //     weight: "bold",
    //     style: "normal",

    //     bevelThickness: 0,
    //     bevelSize: 0,
    //     bevelEnabled: true

    // });

    // textGeo.computeBoundingBox();
    // var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

    // var textMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, specular: 0x111111, ambient: 0x333333 } );

    // var mesh = new THREE.Mesh( textGeo, textMaterial );
    // mesh.position.x = centerOffset;
    // mesh.position.y = FLOOR + 80;

    // mesh.castShadow = true;
    // mesh.receiveShadow = true;

    // scene.add( mesh );

    // CUBES

    // var mesh2 = new THREE.Mesh( new THREE.BoxGeometry( 1500, 220, 150 ), planeMaterial );

    // mesh2.position.y = FLOOR - 50;
    // mesh2.position.z = 20;

    // mesh2.castShadow = true;
    // mesh2.receiveShadow = true;

    // scene.add( mesh2 );

    // var mesh3 = new THREE.Mesh( new THREE.BoxGeometry( 1600, 170, 250 ), planeMaterial );

    // mesh3.position.y = FLOOR - 50;
    // mesh3.position.z = 20;

    // mesh3.castShadow = true;
    // mesh3.receiveShadow = true;

    // scene.add( mesh3 );

    // MORPHS

    function addMorph( geometry, speed, duration, x, y, z, fudgeColor ) {

        var material = new THREE.MeshLambertMaterial( { color: 0xffaa55, morphTargets: true, vertexColors: THREE.FaceColors } );

        if ( fudgeColor ) {

            material.color.offsetHSL( Math.random(), Math.random() * 0.5 - 0.25, 5 );
            material.ambient = material.color;

        }

        var meshAnim = new THREE.MorphAnimMesh( geometry, material );

        meshAnim.speed = speed;
        meshAnim.duration = duration;
        meshAnim.time = 600 * Math.random();

        meshAnim.position.set( x, y, z );
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

    window.addHorse = function(){
        var i = (Math.random() * 600) + 200;
        addMorph( zoo.horse, 550, 1000, -1000, FLOOR, i, true );
    };

    window.addFlamingo = function(){
        addBird(zoo.flamingo);
    };

    window.addStork = function(){
        addBird(zoo.stork);
    };

    window.addBird = function(bird){
        var i = (Math.random() * 600) + 200;
        addMorph( bird, 550, 1000, -1000, FLOOR + Math.random() * 400 + 100, i, true );
    };

    /*
    loader.load( "obj/morphs/fox.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 200, 1000, 100 - Math.random() * 500, FLOOR - 5, 600 );

    } );

    loader.load( "obj/morphs/shdw3walk.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 40, 2000, -500, FLOOR + 60, 245 );

    } );

    loader.load( "obj/morphs/flamingo.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 500, 1000, 500 - Math.random() * 500, FLOOR + 350, 40 );

    } );

    loader.load( "obj/morphs/stork.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 350, 1000, 500 - Math.random() * 500, FLOOR + 350, 340 );

    } );

    loader.load( "obj/morphs/mountainlion.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 400, 1000, 500 - Math.random() * 500, FLOOR - 5, 700 );

    } );

    loader.load( "obj/morphs/bearBrown.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 300, 2500, -500, FLOOR - 5, -750 );

    } );

    loader.load( "obj/morphs/parrot.js", function( geometry ) {

        morphColorsToFaceColors( geometry );
        addMorph( geometry, 450, 500, 500 - Math.random() * 500, FLOOR + 300, 700 );

    } );
    */

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

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

    // Render debug HUD with shadow map

    //hudMaterial.uniforms.tDiffuse.texture = light.shadowMap;
    //renderer.render( sceneHUD, cameraOrtho );

}