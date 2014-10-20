$(function() {

  MESH = {
    xRange: 0.2,
    yRange: 0.2,
    zRange: 0.01,
    width: 500,
    height: 500,
    depth: 10,
    segments: 30,
    slices: 30,
    speed: 18
  }


  var initVertices = function(geometry) {
    var v, vertex;
    for (v = geometry.vertices.length - 1; v >= 0; v--) {
      vertex = geometry.vertices[v];
      vertex.anchor = FSS.Vector3.clone(vertex.position);
      vertex.step = FSS.Vector3.create(0,0,0)

      vertex.time = Math.randomInRange(0, Math.PIM2);
    }
  }


  // 1) Create a Renderer for the context you would like to render to.
  //    You can use either the WebGLRenderer, CanvasRenderer or SVGRenderer.
  var now, start = Date.now();
  var numLights = 1;
  var renderer = new FSS.CanvasRenderer();

  // 2) Add the Renderer's element to the DOM:
  var container = document.getElementById('container');
  container.appendChild(renderer.element);

  // 3) Create a Scene:
  var scene = new FSS.Scene();

  // 4) Create some Geometry & a Material, pass them to a Mesh constructor, and add the Mesh to the Scene:
  var geometry = new FSS.Plane( MESH.width, MESH.height, MESH.segments, MESH.slices);
  var material = new FSS.Material('#442222', '#FFFF77');
  var mesh = new FSS.Mesh(geometry, material);
  initVertices(geometry)

  var speed = function() { return MESH.speed / 10000.0; };

  var removeLights = function(lights) {
    lights = lights || scene.lights
    _.each(scene.lights, function(light) {
      scene.remove(light)
    });
  };

  var addLights = function() {
    oldLights = scene.lights
    _.times(numLights, function() {
      ambient = [ '#112222' ][ parseInt(now,10) % 1 ]
      diffuse = [ '#ffccff' ][ parseInt(now,10) % 1 ]
      var light = new FSS.Light(ambient, diffuse);
      scene.add(light)
      light.setPosition(MESH.width*Math.sin(now * speed())/4.0,
                        MESH.height*Math.cos(now * speed())/4.0,
                        MESH.depth * 2.0);
    });
    return oldLights;
  };

  var adjustVertices = function() {
    offset = MESH.depth / 2;
    for (v = geometry.vertices.length - 1; v >= 0; v--) {
      vertex = geometry.vertices[v];

      ox = Math.sin(vertex.time + vertex.step[0] * now * speed());
      oy = Math.cos(vertex.time + vertex.step[1] * now * speed());
      oz = Math.sin(vertex.time + vertex.step[2] * now * speed());
      FSS.Vector3.set(vertex.position,
                      MESH.xRange*geometry.segmentWidth*ox,
                      MESH.yRange*geometry.sliceHeight*oy,
                      MESH.zRange*offset*oz - offset);
      FSS.Vector3.add(vertex.position, vertex.anchor);
    }
    // Set the Geometry to dirty
    geometry.dirty = true;
  }

  function animate() {
    now = Date.now() - start;

    removeLights();
    oldLights = addLights();
    adjustVertices();

    renderer.render(scene);
    requestAnimationFrame(animate);
  }

  scene.add(mesh);

  animate()

});