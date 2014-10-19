$(function() {
  // 1) Create a Renderer for the context you would like to render to.
  //    You can use either the WebGLRenderer, CanvasRenderer or SVGRenderer.
  var now, start = Date.now();
  var renderer = new FSS.CanvasRenderer();

  // 2) Add the Renderer's element to the DOM:
  var container = document.getElementById('container');
  container.appendChild(renderer.element);

  // 3) Create a Scene:
  var scene = new FSS.Scene();

  // 4) Create some Geometry & a Material, pass them to a Mesh constructor, and add the Mesh to the Scene:
  var geometry = new FSS.Plane(400,400, 20, 30);
  var material = new FSS.Material('#444444', '#FFFFFF');
  var light = new FSS.Light('#111122', '#FF0022');
  var mesh = new FSS.Mesh(geometry, material);


  function animate() {
    now = Date.now() - start;

    light.setPosition(300*Math.sin(now*0.001), 200*Math.cos(now*0.0005), 60);
    renderer.render(scene);
    requestAnimationFrame(animate);
  }

  scene.add(mesh);
  scene.add(light);

  animate()

});