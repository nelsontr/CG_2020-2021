/*******************************************************************
* Trabalho Laboratorial de CG #2
*
* GRUPO 4:
*    Beatriz Alves, 93691
*    Gonçalo Castilho, 84722
*    Nelson Trindade, 93743
*
*******************************************************************/


/*******************************************************************
*
* THREE.JS INIT
*
*******************************************************************/
'use strict'

var clock;
var size = 150;
var BALLRADIUM = 50;
var cameraIndex = 1;
var scene, renderer;
var geometry, material, mesh;
var frontcam, topcam, latcam;
var aspect = window.innerWidth / window.innerHeight;


function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock(true);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    material.wireframe = !material.wireframe

    createScene();
    createCameras();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", keyNotPressed);
}

function animate() {
    'use strict';

    requestAnimationFrame(animate);
    render();
}


function render() {
    'use strict';
    renderer.render(scene, frontcam);

    if (cameraIndex == 1) { renderer.render(scene, topcam); }
    else if (cameraIndex == 2) { renderer.render(scene, frontcam); }
    //else if (cameraIndex == 3) { renderer.render(scene, latcam) }
}


/*******************************************************************
*
*   SCENE
*
*******************************************************************/

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));

    createTable(0,0,0);

}

function createTable(x,y,z){
  var table = new THREE.Object3D();

  createBottom(table,0,0,0);
  //createWallX(table, , , );
  //createWallX(table, , , );
  //createWallZ(table, , , );
  //createWallZ(table, , , );


  scene.add(table);
  table.position.x = x;
  table.position.y = y;
  table.position.z = z;
}

function createWallZ(obj, x, y, z){
  geometry = new THREE.CubeGeometry(2, 7, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y , z);
  obj.add(mesh);
}

function createWallX(obj, x, y, z){
  geometry = new THREE.CubeGeometry(2, 7, 1);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y , z);
  obj.add(mesh);
}

function createBottom(obj, x, y, z){
  geometry = new THREE.CubeGeometry(5, 1, 25);
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y , z);
  obj.add(mesh);
}


/*******************************************************************
*
* CAMERA
*
*******************************************************************/

function createCameras(){
  'use strict';

  createFrontCamera();
  createTopCamera();
  createMovilCamera();
}

function createFrontCamera(){
    'use strict';

    frontcam = new THREE.OrthographicCamera(-65 , 65 , 10, -120, 600, 800);
    frontcam.position.z = 700;
    frontcam.lookAt(scene.position);
    scene.add(frontcam);
}

function createTopCamera(){
    'use strict';

    topcam = new THREE.OrthographicCamera(-size * aspect * 0.5, size * aspect * 0.5, size * 0.5, -size * 0.5, 400, 600);
    topcam.position.y = 500;
    topcam.lookAt(scene.position);
    scene.add(topcam);
}

function createMovilCamera() {
    'use strict';

    /*latcam = new THREE.OrthographicCamera(-100 , 100 , 0, -200, 400, 600);
    latcam.position.x = 500;
    latcam.lookAt(scene.position);
    scene.add(latcam);*/
}


/*******************************************************************
*
*   USER INPUT
*
*******************************************************************/

/* Resize windows and key result*/

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        frontcam.aspect = window.innerWidth / window.innerHeight;
        frontcam.updateProjectionMatrix();
    }
}

function onKeyDown(e) {
    'use strict';

    /* Camera Controls */
    if(e.keyCode == 49) { // keyCode tecla 1
        cameraIndex = 1;
    }
    else if(e.keyCode == 50) { // keyCode tecla 2
        cameraIndex = 2;
    }
    else if(e.keyCode == 51) { // keyCode tecla 3
        cameraIndex = 3;
    }
}

/*******************************************************************
*
* OBJECTS SCENE
*
*******************************************************************/

function keyNotPressed(e) {
    'use strict';

}
