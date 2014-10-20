$(function() {
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
  var geometry = new FSS.Plane(400,400, 20, 30);
  var material = new FSS.Material('#444444', '#FFFFFF');
  var mesh = new FSS.Mesh(geometry, material);

  var removeLights = function() {
    _.each(scene.lights, function(light) {
      scene.remove(light)
    });
  };

  var addLights = function() {
    _.times(numLights, function() {
      ambient = new FSS.Color([ '#112222', '#223344', '#445566' ][ parseInt(now,16) % 3 ])
      diffuse = new FSS.Color([ '#ccccff', '#ffffcc', '#ccffcc' ][ parseInt(now,16) % 3 ])
      var light = new FSS.Light(ambient, diffuse);
      scene.add(light)
      light.setPosition(300*Math.sin(now*0.001), 200*Math.cos(now*0.0005), 60);
    });
  };

  function animate() {
    now = Date.now() - start;

    removeLights();
    addLights();


    renderer.render(scene);
    requestAnimationFrame(animate);
  }

  scene.add(mesh);

  animate()

});