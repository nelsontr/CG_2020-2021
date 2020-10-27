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
var BALLRADIUM = 1;
var cameraIndex = 1, tacoSelected = 1;
var ball, ballIndex = 1;
var taco = [];
var scene, renderer;
var velocityball= [];
var ballP= [];
var taco_selecionado;
var movimentBallX= [];
var movimentBallY= [];
var movimentBallZ= [];
var rotacaotaco = [];

var wall_width = [];
var wall_height = [];
var wall_lenght = [];

var raio_ball = [];
var numero_bolas = 16;
var space;
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

  moviment_function();
  render();
  requestAnimationFrame(animate);
}

function render() {
  "use strict";

  if (cameraIndex == 1) {
    renderer.render(scene, topcam);
  } else if (cameraIndex == 2) {
    renderer.render(scene, frontcam);
  } else if (cameraIndex == 3){
    var camPosition = new THREE.Vector3(10, 0, 0);
    var ballPosition = camPosition.applyMatrix4(ballP[tacoSelected-1].matrixWorld);

    cameraFollow.position.x = ballPosition.x;
    cameraFollow.position.y = ballPosition.y;
    cameraFollow.position.z = ballPosition.z;
    cameraFollow.lookAt(ballP[tacoSelected-1].position);

    renderer.render(scene, cameraFollow);
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
  
  for (var i = 1; i < numero_bolas; i++) {
    var randFloatX = Math.random() * (10 - -10) + -10;
    var randFloatZ = Math.random() * (35 - -35) + -35;
    createBall(randFloatX,2.5,randFloatZ,i);
  }

  createBallPrincipal(15-BALLRADIUM, 2.5, 22.5,1);
  createBallPrincipal(-15+BALLRADIUM, 2.5, 22.5,2);
  createBallPrincipal(15-BALLRADIUM, 2.5, -22.5, 3);
  createBallPrincipal(-15+BALLRADIUM, 2.5, -22.5,4);
  createBallPrincipal(0, 2.5, -44.5+BALLRADIUM,5);
  createBallPrincipal(0, 2.5, 44.5-BALLRADIUM,6);


  
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
    if (taco[tacoSelected - 1].rotation.y + Math.PI / 60 <= Math.PI/3)
      taco[tacoSelected - 1].rotateY(Math.PI / 60);
      rotacaotaco[tacoSelected - 1] = taco[tacoSelected - 1].rotation.y;
  } else if (e.keyCode == 39) { //keyCode for right-arrow
    if (taco[tacoSelected - 1].rotation.y - Math.PI / 60 >= -Math.PI/3)
      taco[tacoSelected - 1].rotateY(-Math.PI / 60);
  } else if (e.keyCode == 32) { //keyCode for space
    space = true;

  }

  tacoMesh[tacoSelected - 1].material.color.setHex(0x0000ff)
}



function keyNotPressed(e) {
  "use strict";
  if (e.keyCode == 32) { //keyCode for space
    space = false;
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
  createWall(table, -15.5, 0, 90, 1);
  createWall(table, 15.5, 0, 90, 2);
  createWall(table, 0, 45.5, 30, 3);
  createWall(table, 0, -45.5, 30, 4);

  scene.add(table);
  table.position.set(x, y, z)
}

function createTacos() {
  scene.add(createTaco(1, 15-BALLRADIUM, 22.5));
  scene.add(createTaco(2, -15+BALLRADIUM, 22.5));
  scene.add(createTaco(3, 15-BALLRADIUM, -22.5));
  scene.add(createTaco(4, -15+BALLRADIUM, -22.5));
  scene.add(createTaco(5, 0, -45.5+BALLRADIUM));
  scene.add(createTaco(6, 0, 45.5-BALLRADIUM));
  
  tacoMesh[tacoSelected - 1].material.color.setHex(0x0000ff);
}

function createHole(hole, x, z, y=0) {
  geometry = new THREE.CylinderGeometry(4, 4, 1);
  material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x, y, z);
  hole.add(mesh);
}

function createTaco(selected, xt, zt) {
  
  if (selected % 2 != 0) var rot = Math.PI / 2
  else var rot = -Math.PI / 2
  
  taco[selected-1] = new THREE.Object3D();
  geometry = new THREE.CylinderGeometry(1, 2, 30);
  material = new THREE.MeshBasicMaterial({ color: 0xbe935a, wireframe: true });
  tacoMesh[selected - 1] = new THREE.Mesh(geometry, material);

  if (selected < 5) tacoMesh[selected - 1].rotateZ(rot);
  else tacoMesh[selected - 1].rotateX(rot);

  taco[selected-1].position.set(xt,2.5,zt);
  if (xt>0) tacoMesh[selected - 1].position.set(15+BALLRADIUM, 0, 0);
  else if (xt<0) tacoMesh[selected - 1].position.set(-15-BALLRADIUM, 0, 0);
  
  if (selected>=5) 
    if (zt>0) tacoMesh[selected - 1].position.set(0, 0, 15+BALLRADIUM);
    else tacoMesh[selected - 1].position.set(0, 0, -15-BALLRADIUM);

  taco[selected-1].add(tacoMesh[selected - 1]);
  return taco[selected-1]
}

function createWall(table, x, z, size, index) {
  var wall =  new THREE.Object3D();
  geometry = new THREE.CubeGeometry(5, 1, size);
  material = new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: true });

  wall.name = "Wall "+String (index);
  mesh = new THREE.Mesh(geometry, material);

  mesh.rotateZ(Math.PI / 2);
  if (size == 30) mesh.rotateX(Math.PI / 2);

  mesh.position.set(x, 3, z);
  wall.add(mesh);

  if( size == 90){
    wall_width[index] = size;
    wall_height[index] = 1;
    wall_lenght[index] = 5;
    
  }

  if( size == 30){
    wall_width[index] = 5;
    wall_height[index] = 1;
    wall_lenght[index] = size;
    
  }

  table.add(wall);
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
  geometry = new THREE.SphereGeometry(BALLRADIUM, 32, 32);
  material = new THREE.MeshBasicMaterial({color: 0xbe935a, wireframe: true});

  ball.name = "Ball "+String (index);
  ball.position.set(x, 2.5, z);
  ball.add(new THREE.AxisHelper(3));
  
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0,0,0);
  ball.add(mesh);

  //movimentBall[index] = new THREE.Vector3(Math.random(), 0, Math.random());
  movimentBallX[index] = Math.random() * (2 - -2) + -2;
  movimentBallY[index] = 0;
  movimentBallZ[index] = Math.random() * (2 - -2) + -2;
  velocityball[index] = Math.random() * (.1 - 0.05) + -0.05;
  raio_ball[index] = BALLRADIUM;
  scene.add(ball);
}


function createBallPrincipal(x, y, z, index) {
  ballP[index-1] = new THREE.Object3D();

  // raio, heightsegment, withsegment
  geometry = new THREE.SphereGeometry(BALLRADIUM, 32, 32);
  material = new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true});
  mesh = new THREE.Mesh(geometry, material);
  ballP[index-1].add(mesh);
  
  ballP[index-1].name = "BallP "+String (index);
  ballP[index-1].position.set(x, 2.5, z);
  ballP[index-1].add(new THREE.AxisHelper(3));
  scene.add(ballP[index-1]);
}

function ballRotation(id, delta){


  let position = movimentBallX[id]*velocityball[id];
  let position2 = movimentBallZ[id]*velocityball[id];
  let position3 = movimentBallY[id]*velocityball[id];
  scene.getObjectByName("Ball "+String(id)).translateX(position);
  scene.getObjectByName("Ball "+String(id)).translateZ(position2);
  scene.getObjectByName("Ball "+String(id)).translateY(position3);
}

function moviment_function(){

  var delta = clock.getDelta() * 2;

    for (let f = 1; f < numero_bolas; f++) {
    collision(f, delta);
  }

  for (let i = 1; i < numero_bolas; i++) {
    ballRotation(i, delta);
  }


  if(space == true){
    numero_bolas++;
    if( tacoSelected == 1){
      createBall(15-BALLRADIUM, 2.5, 22.5,numero_bolas-1);
    }
        if( tacoSelected == 2){
       createBall(-15+BALLRADIUM, 2.5, 22.5,numero_bolas-1);
    }
        if( tacoSelected == 3){
      createBall(15-BALLRADIUM, 2.5, -22.5, numero_bolas-1);
    }
        if( tacoSelected == 4){
      createBall(-15+BALLRADIUM, 2.5, -22.5,numero_bolas-1);
    }
        if( tacoSelected == 5){
      createBall(0, 2.5, -44.5+BALLRADIUM,numero_bolas-1);
    }
        if( tacoSelected == 6){
      createBall(0, 2.5, 44.5-BALLRADIUM,numero_bolas-1);
    }

    
    //scene.getObjectByName("Ball "+String(numero_bolas)).mesh.color.setHex(0xcccccc);
    movimentBallX[numero_bolas] = rotacaotaco[tacoSelected-1];
    movimentBallY[numero_bolas] = 0;
    movimentBallZ[numero_bolas] = rotacaotaco[tacoSelected-1];
    velocityball[numero_bolas] = 10;

  }

}

function collision(bola_a, delta) {

  for (let b = 1; b < numero_bolas; b++) {
    /* When colliding with other ball */
    // Intersection between Sphere and Sphere
    if(intersect_sphere_sphere(bola_a, b)){
      elastic_collision(bola_a, b);
    }

  }

  for (let c = 1; c < 5; c++) {
    /* When colliding with wall rebound */
    //Intersection between Sphere and Cube
    if(intersect_sphere_cube(bola_a, c)){
      rebound_colision(bola_a);
    }
  }

  if(intersect_object_plane(bola_a)){
    fallOffTable(bola_a);

  }
}

function intersect_sphere_sphere(bola_a, bola_b){

  let ra = raio_ball[bola_a];
  let rb = raio_ball[bola_b];

  let xa = scene.getObjectByName("Ball "+String(bola_a)).position.x;
  let ya = scene.getObjectByName("Ball "+String(bola_a)).position.y;
  let za = scene.getObjectByName("Ball "+String(bola_a)).position.z;
  let xb = scene.getObjectByName("Ball "+String(bola_b)).position.x;
  let yb = scene.getObjectByName("Ball "+String(bola_b)).position.y;
  let zb = scene.getObjectByName("Ball "+String(bola_b)).position.z;

  let x = (xb-xa)^2 + (yb-ya)^2 + (zb-za)^2
  let distancia = Math.sqrt(x);

  if (ra+rb >= distancia){
    //console.log('estao a bater'+String(bola_a)+String(bola_b) );
    return true;


  }

  else{

    return false;
  }

}

function intersect_sphere_cube(bola_a, wall_b){
/*
  let parede_b_width = wall_b[0]/2;
  let parede_b_height = wall_b[1]/2;
  let parede_b_lenght = wall_b[2]/2;

  let parede_b_max_x = scene.getObjectByName("Wall "+String(wall_b)).position.x + parede_b_width; 
  let parede_b_max_y = scene.getObjectByName("Wall "+String(wall_b)).position.y + parede_b_height; 
  let parede_b_max_z = scene.getObjectByName("Wall "+String(wall_b)).position.z + parede_b_lenght;

  let parede_b_min_x = scene.getObjectByName("Wall "+String(wall_b)).position.x - parede_b_width;
  let parede_b_min_y = scene.getObjectByName("Wall "+String(wall_b)).position.y - parede_b_height;
  let parede_b_min_z = scene.getObjectByName("Wall "+String(wall_b)).position.z - parede_b_lenght;
*/
  /* Sphere Properties */
  /* Width here it's the radius of the sphere */
/*
  let bola_a_width = raio_ball[bola_a];

  let a_max_x = scene.getObjectByName("Ball "+String(bola_a)).object.position.x + bola_a_width;
  let a_max_y = scene.getObjectByName("Ball "+String(bola_a)).object.position.y + bola_a_width;
  let a_max_z = scene.getObjectByName("Ball "+String(bola_a)).object.position.z + bola_a_width;

  let a_min_x = scene.getObjectByName("Ball "+String(bola_a)).object.position.x - bola_a_width;
  let a_min_y = scene.getObjectByName("Ball "+String(bola_a)).object.position.y - bola_a_width;
  let a_min_z = scene.getObjectByName("Ball "+String(bola_a)).object.position.z - bola_a_width;
*/
  /* MATH EXPLANATION */
  /* Bounding box extreme points comparison */

/*
  let test_x = (a_max_x >= b_min_x && a_min_x <= b_max_x);
  let test_y = (a_max_y >= b_min_y && a_min_y <= b_max_y);
  let test_z = (a_max_z >= b_min_z && a_min_z <= b_max_z);


  if(test_x == true && test_z == true && test_y == true){
    return true;
  }
  else{
    return false;
  }

*/

}

function elastic_collision(bola_a, bola_b){


  let velocity_a_old = velocityball[bola_a];
  let velocity_b_old = velocityball[bola_b];

  let moviment_direction_X_a = movimentBallX[bola_a];
  let moviment_direction_Y_a = movimentBallY[bola_a];
  let moviment_direction_Z_a = movimentBallZ[bola_a];

  let moviment_direction_X_b = movimentBallX[bola_b];
  let moviment_direction_Y_b = movimentBallY[bola_b];
  let moviment_direction_Z_b = movimentBallZ[bola_b];


  velocityball[bola_a] = velocity_b_old;
  velocityball[bola_b] = velocity_a_old;

  movimentBallX[bola_a] = -moviment_direction_X_a;
  movimentBallY[bola_a] = -moviment_direction_Y_a;
  movimentBallZ[bola_a] = -moviment_direction_Z_a;

  movimentBallX[bola_b] = -moviment_direction_X_b;
  movimentBallY[bola_b] = -moviment_direction_Y_b;
  movimentBallZ[bola_b] = -moviment_direction_Z_b;

}

function rebound_colision(bola_a){


  let moviment_direction_X_a = movimentBallX[bola_a];
  let moviment_direction_Y_a = movimentBallY[bola_a];
  let moviment_direction_Z_a = movimentBallZ[bola_a];

  movimentBallX[bola_a] = -moviment_direction_X_a;
  movimentBallY[bola_a] = -moviment_direction_Y_a;
  movimentBallZ[bola_a] = -moviment_direction_Z_a;



}

function intersect_object_plane(bola_a){


let bola_a_x = scene.getObjectByName("Ball "+String(bola_a)).position.x;
let bola_a_y = scene.getObjectByName("Ball "+String(bola_a)).position.y;
let bola_a_z = scene.getObjectByName("Ball "+String(bola_a)).position.z;

  if( (bola_a_z<= -37 && bola_a_x <= -7) || (bola_a_z<= -37 && bola_a_x >= 7) || (bola_a_z>= 37 && bola_a_x <= -7) || (bola_a_z>= 37 && bola_a_x >= 7)){
    return true;

  }
  else{
    return false;
  }
  
}

function fallOffTable(bola_a){

  velocityball[bola_a] = 1;
  movimentBallX[bola_a] = 0;
  movimentBallY[bola_a] = -1
  movimentBallX[bola_a] = 0;

}