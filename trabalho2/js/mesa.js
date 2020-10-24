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
var ball, ballIndex = 1;
var scene, renderer;
var velocityball= [];
var movimentBall= [];
var geometry, material, mesh;
var frontcam, topcam, cameraFollow;
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
  } else if (cameraIndex == 3){
    var camPosition = new THREE.Vector3(10, 0, 0);
    var ballPosition = camPosition.applyMatrix4(ball.matrixWorld);

    cameraFollow.position.x = ballPosition.x;
    cameraFollow.position.y = ballPosition.y;
    cameraFollow.position.z = ballPosition.z;
    cameraFollow.lookAt(ball.position);

    renderer.render(scene, cameraFollow);
  }
  for (var i = 1; i < 16; i++) {
    ballRotation(i);
  }
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
  
  for (var i = 1; i < 16; i++) {
    var randFloatX = Math.random() * (10 - -10) + -10;
    var randFloatZ = Math.random() * (35 - -35) + -35;
    createBall(randFloatX,2.5,randFloatZ,i);
  }
  
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
  createFollowCamera();
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

function createFollowCamera() {
  "use strict";

  cameraFollow = new THREE.PerspectiveCamera(45, aspect, 1, 1000);
  //console.log("Ball "+String(ballIndex));
  //var ballMovement = scene.getObjectByName(("Ball "+String(ballIndex)));
  //cameraFollow.position.x = ballMovement.position.x;
  //cameraFollow.position.y = ballMovement.position.y;
  //cameraFollow.position.z = ballMovement.position.z;
  //cameraFollow.lookAt(ballMovement.position);
  scene.add(cameraFollow);
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
    tacoMesh[tacoSelected - 1].material.color.setHex(0xbe935a)
    tacoSelected = 1;
  } else if (e.keyCode == 53) {
    tacoMesh[tacoSelected - 1].material.color.setHex(0xbe935a)
    tacoSelected = 2;
  } else if (e.keyCode == 54) {
    tacoMesh[tacoSelected - 1].material.color.setHex(0xbe935a)
    tacoSelected = 3;
  } else if (e.keyCode == 55) {
    tacoMesh[tacoSelected - 1].material.color.setHex(0xbe935a)
    tacoSelected = 4;
  } else if (e.keyCode == 56) {
    tacoMesh[tacoSelected - 1].material.color.setHex(0xbe935a)
    tacoSelected = 5;
  } else if (e.keyCode == 57) {
    tacoMesh[tacoSelected - 1].material.color.setHex(0xbe935a)
    tacoSelected = 6;
  } else if (e.keyCode == 37) { //keyCode for left-arrow
    if (tacoSelected < 5) tacoMesh[tacoSelected - 1].rotateX(Math.PI / 60);
    else tacoMesh[tacoSelected - 1].rotateZ(Math.PI / 60);
  } else if (e.keyCode == 39) { //keyCode for right-arrow
    if (tacoSelected < 5) tacoMesh[tacoSelected - 1].rotateX(-Math.PI / 60);
    else tacoMesh[tacoSelected - 1].rotateZ(-Math.PI / 60);
  } else if (e.keyCode == 32) { //keyCode for space
  
  }

  tacoMesh[tacoSelected - 1].material.color.setHex(0x0000ff)
}

function keyNotPressed(e) {
  "use strict";
  if (e.keyCode == 32) { //keyCode for space
  
  }
}

/*******************************************************************
 *
 *   OBJECTS
 *
 *******************************************************************/
function createHoles() {
  var Holes = new THREE.Object3D();

  createHole(Holes, -11, -41)
  createHole(Holes, 11, 41)
  createHole(Holes, -11, 41)
  createHole(Holes, 11, -41)
  scene.add(Holes);
}



function createTable(x, y, z) {
  var table = new THREE.Object3D();

  createBottom(table, 0, 0, 0);
  createWall(table, -15.5, 0, 90);
  createWall(table, 15.5, 0, 90);
  createWall(table, 0, 45.5);
  createWall(table, 0, -45.5);

  scene.add(table);
  table.position.set(x, y, z)
}

function createTacos() {
  scene.add(createTaco(1, 30, 22.5));
  scene.add(createTaco(2, -30, 22.5));
  scene.add(createTaco(3, 30, -22.5));
  scene.add(createTaco(4, -30, -22.5));
  scene.add(createTaco(5, 0, -60));
  scene.add(createTaco(6, 0, 60));
  
  tacoMesh[tacoSelected - 1].material.color.setHex(0x0000ff);
}

function createHole(hole, x, z, y=0) {
  geometry = new THREE.CylinderGeometry(4, 4, 1);
  material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  hole.add(mesh);
}

function createTaco(selected, x, z) {
  
  if (selected % 2 != 0) var rot = Math.PI / 2
  else var rot = -Math.PI / 2
  
  var taco = new THREE.Object3D();
  geometry = new THREE.CylinderGeometry(1, 2, 30);
  material = new THREE.MeshBasicMaterial({ color: 0xbe935a, wireframe: true });

  tacoMesh[selected - 1] = new THREE.Mesh(geometry, material);
  if (selected < 5) tacoMesh[selected - 1].rotateZ(rot);
  else tacoMesh[selected - 1].rotateX(rot);

  tacoMesh[selected - 1].position.set(x, 2.5, z);
  taco.add(tacoMesh[selected - 1]);
  return taco
}

function createWall(obj, x, z, size = 30) {
  geometry = new THREE.CubeGeometry(5, 1, size);
  material = new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: true });
  mesh = new THREE.Mesh(geometry, material);

  mesh.rotateZ(Math.PI / 2);
  if (size == 30) mesh.rotateX(Math.PI / 2);

  mesh.position.set(x, 3, z);
  obj.add(mesh);
}


function createBottom(obj, x, y, z) {
  material = new THREE.MeshBasicMaterial({ color: 0x32cd32, wireframe: true });
  geometry = new THREE.CubeGeometry(30, 1, 90);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  obj.add(mesh);
}

function createBall(x, y, z, index) {
  ball = new THREE.Object3D();

  // raio, heightsegment, withsegment
  geometry = new THREE.SphereGeometry(2, 32, 32);
  material = new THREE.MeshBasicMaterial({color: 0xbe935a, wireframe: true});
  mesh = new THREE.Mesh(geometry, material);
  ball.add(mesh);

  movimentBall[index] = Math.random() * (2 - 0) + 0;
  velocityball[index] = Math.random() * (20 - 10) + 10;
  
  ball.name = "Ball "+String (index);
  ball.position.set(x, y, z);
  ball.add(new THREE.AxisHelper(3));
  scene.add(ball);
}

function ballRotation(id){
  var delta = clock.getDelta() * 2;
  var position = velocityball[id] * delta;
  //console.log(delta);
  console.log(velocityball[id]);
  //console.log(position);
  scene.getObjectByName("Ball "+String(id)).translateX(position);
}
