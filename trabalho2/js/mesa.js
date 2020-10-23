/*******************************************************************
 * Trabalho Laboratorial de CG #2
 *
 * GRUPO 4:
 *    Beatriz Alves, 93691
 *    Gonçalo Castilho, 84722
 *    Nelson Trindade, 93743
 *
 *******************************************************************/

"use strict";

/*      Variables     */
var clock;
var size = 150;
var tacoMesh = [];
var BALLRADIUM = 2;
var cameraIndex = 1, tacoSelected = 1;
var scene, renderer;
var geometry, material, mesh;
var frontcam, topcam, latcam;
var aspect = window.innerWidth / window.innerHeight;

function init() {
  "use strict";

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock(true);
  material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });

  createScene();
  createCameras();

  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", keyNotPressed);
}

function animate() {
  "use strict";

  requestAnimationFrame(animate);
  render();
}

function render() {
  "use strict";

  renderer.render(scene, frontcam);

  if (cameraIndex == 1) {
    renderer.render(scene, topcam);
  } else if (cameraIndex == 2) {
    renderer.render(scene, frontcam);
  }
  //else if (cameraIndex == 3) { renderer.render(scene, latcam) }
  tacoMesh[tacoSelected-1].rotateX(Math.PI/60);
  console.log(tacoMesh[tacoSelected-1].rotation);
}

/*******************************************************************
 *
 *   SCENE
 *
 *******************************************************************/
function createScene() {
  "use strict";

  scene = new THREE.Scene();
  scene.add(new THREE.AxisHelper(10));

  createTable(0, 0, 0);
  createTacos();
  createHoles();
}

/*******************************************************************
 *
 *   CAMERAS
 *
 *******************************************************************/
function createCameras() {
  "use strict";

  createFrontCamera();
  createTopCamera();
  createMovilCamera();
}

function createFrontCamera() {
  "use strict";

  frontcam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  frontcam.position.set(100, 125, 100);
  frontcam.lookAt(scene.position);
  scene.add(frontcam);
}

function createTopCamera() {
  "use strict";

  topcam = new THREE.OrthographicCamera(
    -size * aspect * 0.5,
    size * aspect * 0.5,
    size * 0.5,
    -size * 0.5,
    400,
    600
  );
  topcam.position.y = 500;
  topcam.lookAt(scene.position);
  scene.add(topcam);
}

function createMovilCamera() {
  "use strict";

}

/*******************************************************************
 *
 *   USER INPUT
 *
 *******************************************************************/
/* Resize windows and key result*/

function onResize() {
  "use strict";
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (window.innerHeight > 0 && window.innerWidth > 0) {
    frontcam.aspect = window.innerWidth / window.innerHeight;
    frontcam.updateProjectionMatrix();
  }
}

function onKeyDown(e) {
  "use strict";

  /* Camera Controls */
  if (e.keyCode == 49) {
    // keyCode tecla 1
    cameraIndex = 1;
  } else if (e.keyCode == 50) {
    // keyCode tecla 2
    cameraIndex = 2;
  } else if (e.keyCode == 51) {
    // keyCode tecla 3
    cameraIndex = 3;
  } else if (e.keyCode == 52) {
    tacoMesh[tacoSelected-1].material.color.setHex(0xbe935a)
    tacoSelected = 1;
  } else if (e.keyCode == 53) {
    tacoMesh[tacoSelected-1].material.color.setHex(0xbe935a)
    tacoSelected = 2;
  } else if (e.keyCode == 54) {
    tacoMesh[tacoSelected-1].material.color.setHex(0xbe935a)
    tacoSelected = 3;
  } else if (e.keyCode == 55) {
    tacoMesh[tacoSelected-1].material.color.setHex(0xbe935a)
    tacoSelected = 4;
  } else if (e.keyCode == 56) {
    tacoMesh[tacoSelected-1].material.color.setHex(0xbe935a)
    tacoSelected = 5;
  } else if (e.keyCode == 57) {
    tacoMesh[tacoSelected-1].material.color.setHex(0xbe935a)
    tacoSelected = 6;
  }

  tacoMesh[tacoSelected-1].material.color.setHex(0x0000ff)
}

function keyNotPressed(e) {
  "use strict";

}

/*******************************************************************
 *
 *   OBJECTS
 *
 *******************************************************************/
function createHoles() {
  var Holes = new THREE.Object3D();

  createHole(Holes, -11, 0, -41)
  createHole(Holes, 11, 0, 41)
  createHole(Holes, -11, 0, 41)
  createHole(Holes, 11, 0, -41)
  scene.add(Holes);
}



function createTable(x, y, z) {
  var table = new THREE.Object3D();

  createBottom(table, 0, 0, 0);
  createWallX(table, -15.5, 3, 0);
  createWallX(table, 15.5, 3, 0);
  createWallZ(table, 0, 3, 45.5);
  createWallZ(table, 0, 3, -45.5);

  scene.add(table);
  table.position.set(x, y, z)
}

function createTacos() {
  var taco1 = createTaco(1, 30, 2.5, 22.5, Math.PI / 2);
  var taco2 = createTaco(2, 30, 2.5, -22.5, Math.PI / 2);
  var taco3 = createTaco(3, -30, 2.5, 22.5, -Math.PI / 2);
  var taco4 = createTaco(4, -30, 2.5, -22.5, -Math.PI / 2);
  var taco5 = createTacoPoints(5, 0, 2.5, -60, Math.PI / 2);
  var taco6 = createTacoPoints(6, 0, 2.5, 60, -Math.PI / 2);
  
  tacoMesh[tacoSelected-1].material.color.setHex(0x0000ff)

  scene.add(taco1);
  scene.add(taco2);
  scene.add(taco3);
  scene.add(taco4);
  scene.add(taco5);
  scene.add(taco6);
}

function createHole(hole, x, y, z) {

  geometry = new THREE.CylinderGeometry(4, 4, 1);
  material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  hole.add(mesh);
}

function createTaco(selected, x, y, z, rot) {
  var taco = new THREE.Object3D();

  geometry = new THREE.CylinderGeometry(1, 2, 30);
  material = new THREE.MeshBasicMaterial({ color: 0xbe935a , wireframe: true });

  tacoMesh[selected-1] = new THREE.Mesh(geometry, material);
  taco.add(tacoMesh[selected-1]);

  tacoMesh[selected-1].position.set(x, y, z);
  tacoMesh[selected-1].rotateZ(rot);
  return taco
}

function createTacoPoints(selected, x, y, z, rot) {
  var taco = new THREE.Object3D();

  geometry = new THREE.CylinderGeometry(1, 2, 30);
  material = new THREE.MeshBasicMaterial({ color: 0xbe935a , wireframe: true });

  tacoMesh[selected-1] = new THREE.Mesh(geometry, material);
  taco.add(tacoMesh[selected-1]);

  tacoMesh[selected-1].position.set(x, y, z);
  tacoMesh[selected-1].rotateX(rot);
  return taco
}

function createWallZ(obj, x, y, z) {
  geometry = new THREE.CubeGeometry(5, 1, 30);
  material = new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: true });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.rotateZ(Math.PI / 2);
  mesh.rotateX(Math.PI / 2);
  obj.add(mesh);
}

function createWallX(obj, x, y, z) {
  geometry = new THREE.CubeGeometry(5, 1, 90);
  material = new THREE.MeshBasicMaterial({ color: 0xfffa500, wireframe: true });
  mesh = new THREE.Mesh(geometry, material);

  mesh.rotateZ(Math.PI / 2);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createBottom(obj, x, y, z) {
  material = new THREE.MeshBasicMaterial({ color: 0x32cd32, wireframe: true });
  geometry = new THREE.CubeGeometry(30, 1, 90);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}
