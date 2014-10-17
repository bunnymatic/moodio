$(function() {
  // 1) Create a Renderer for the context you would like to render to.
  //    You can use either the WebGLRenderer, CanvasRenderer or SVGRenderer.
  var renderer = new FSS.CanvasRenderer();

  // 2) Add the Renderer's element to the DOM:
  var container = document.getElementById('container');
  container.appendChild(renderer.element);

  // 3) Create a Scene:
  var scene = new FSS.Scene();

  // 4) Create some Geometry & a Material, pass them to a Mesh constructor, and add the Mesh to the Scene:
  var geometry = new FSS.Plane(400, 400, 44, 2);
  var material = new FSS.Material('#444444', '#FFFFFF');
  var mesh = new FSS.Mesh(geometry, material);
  scene.add(mesh);

  setInterval(function() {
    // Augment vertices for animation
    var v, vertex;
    for (v = geometry.vertices.length - 1; v >= 0; v--) {
      vertex = geometry.vertices[v];
      vertex.anchor = FSS.Vector3.clone(vertex.position);
      vertex.step = FSS.Vector3.create(
        Math.randomInRange(0.2, 1.0),
        Math.randomInRange(0.2, 1.0),
        Math.randomInRange(0.2, 1.0)
      );
      vertex.time = Math.randomInRange(0, Math.PIM2);
    }


    // 5) Create and add a Light to the Scene:
    var light = new FSS.Light('#ccff00', '#0000FF');
    scene.add(light);
    // 6) Finally, render the Scene:
    renderer.render(scene);
  },100);

});