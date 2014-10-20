$(function() {
  var MESH, addLights, adjustVertices, animate, container, geometry, initVertices, material, mesh, now, numLights, removeLights, renderer, scene, speed, start;
  now = null;
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
  };
  animate = function() {
    now = Date.now() - start;
    removeLights();
    addLights();
    adjustVertices();
    renderer.render(scene);
    requestAnimationFrame(animate);
  };
  initVertices = function(geometry) {
    var v, vertex;
    v = void 0;
    vertex = void 0;
    v = geometry.vertices.length - 1;
    while (v >= 0) {
      vertex = geometry.vertices[v];
      vertex.anchor = FSS.Vector3.clone(vertex.position);
      vertex.step = FSS.Vector3.create(0.001, 0.001, 0.001);
      vertex.time = Math.randomInRange(0, Math.PIM2);
      v--;
    }
  };
  now = void 0;
  start = Date.now();
  numLights = 1;
  renderer = new FSS.CanvasRenderer();
  container = document.getElementById("container");
  container.appendChild(renderer.element);
  scene = new FSS.Scene();
  geometry = new FSS.Plane(MESH.width, MESH.height, MESH.segments, MESH.slices);
  material = new FSS.Material("#442222", "#FFFF77");
  mesh = new FSS.Mesh(geometry, material);
  initVertices(geometry);
  speed = function() {
    return MESH.speed / 10000.0;
  };
  removeLights = function(lights) {
    lights = lights || scene.lights;
    _.each(scene.lights, function(light) {
      scene.remove(light);
    });
  };
  addLights = function() {
    var oldLights;
    oldLights = scene.lights;
    _.times(numLights, function() {
      var ambient, diffuse, light, newPosition;
      ambient = ["#112222"][parseInt(now, 10) % 1];
      diffuse = ["#ffccff"][parseInt(now, 10) % 1];
      light = new FSS.Light(ambient, diffuse);
      scene.add(light);
      newPosition = [MESH.width * Math.sin(now * speed()) / 4.0, MESH.height * Math.cos(now * speed()) / 4.0, MESH.depth * 2.0];
      light.setPosition.apply(light, newPosition);
    });
    return oldLights;
  };
  adjustVertices = function() {
    var offset, ox, oy, oz, v, vertex;
    offset = MESH.depth / 2;
    v = geometry.vertices.length - 1;
    while (v >= 0) {
      vertex = geometry.vertices[v];
      ox = Math.sin(vertex.time + vertex.step[0] * now * speed());
      oy = Math.cos(vertex.time + vertex.step[1] * now * speed());
      oz = Math.sin(vertex.time + vertex.step[2] * now * speed());
      FSS.Vector3.set(vertex.position, MESH.xRange * geometry.segmentWidth * ox, MESH.yRange * geometry.sliceHeight * oy, MESH.zRange * offset * oz - offset);
      FSS.Vector3.add(vertex.position, vertex.anchor);
      v--;
    }
    geometry.dirty = true;
  };
  scene.add(mesh);
  return animate();
});
