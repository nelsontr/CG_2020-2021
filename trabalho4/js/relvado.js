/*******************************************************************
 * Trabalho Laboratorial de CG #4
 *
 * GRUPO 4:
 *    Beatriz Alves, 93691
 *    Gonçalo Castilho, 84722
 *    Nelson Trindade, 93743
 *
// camera neither orthographic nor perspective
                console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
                scope.enablePan = false;

 *******************************************************************/
 "use strict";

/*      Variables     */
var clock;
var geometry, material, mesh;
var scene, renderer;
var cameraIndex = 1;
var frontcam;
var board, ball;
var bandeira;
var directionalLight;
var pointlight;
var light_on = true;
var pointlight_on = true;
var pause = false;
var Flag = false;
var cubeCam;

var materialBoard = [];
var meshBoard = [];
var materialBall = [];
var meshBall = [];
var materialHasteBandeira = [];
var materialBandeira = [];
var meshBandeira = [];
var meshHasteBandeira = [];



const loader = new THREE.TextureLoader();

function init() {
  "use strict";

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock(true);
	
  createScene();
	createSkyBox();
  createCameras();
  createDirectionalLight();
  createPointLights();

  window.addEventListener("resize", onResize);
  window.addEventListener("keydown", onKeyDown);

}

// ORBIT CONTROLS
// BUMP BOLA
// RESTART


function animate() {
  "use strict";

	if (pause == true){
		update_ilum();
		requestAnimationFrame(animate);
		render();
	}
	else {
		requestAnimationFrame(animate);
		update_movimento_bandeira();

		update_ilum();
		render();
	}
}

function render() {
  "use strict";
 
  if (cameraIndex == 1) {
  	renderer.render(scene, frontcam);
  } 

  renderer.render(scene, frontcam);
  
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

  scene.background = new THREE.Color(0xbbbbbb);

  createBoard(0,0,0);
  createBall(0,2.25, 0);
  createBandeira(0, 0, 0);
 
}


/*******************************************************************
 *
 *   CAMERAS
 *
 *******************************************************************/
 function createCameras() {
  "use strict";

  createFrontCamera();
  
}

function createFrontCamera() {
  "use strict";

  frontcam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  frontcam.position.set(75, 125/4, 75); 
  frontcam.lookAt(scene.position);
  scene.add(frontcam);
}





 /*******************************************************************
 *
 *   USER INPUT
 *
 *******************************************************************/

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

  if (e.keyCode == 49) { 
  	cameraIndex = 1;

	}else if (e.keyCode == 68) { // keyCode tecla D - luz direcional
		if(light_on == true) {
		light_on = false;
	}
	else {
		light_on = true;
	}

	}else if (e.keyCode == 80) { // keyCode tecla P - luz pontual
		if(pointlight_on == true) {
			pointlight_on = false;
			pointlight.intensity = 0;
		} else {
			pointlight_on = true;
			pointlight.intensity = 2;
		}

	}else if (e.keyCode == 87) { // keyCode tecla W - modelo arames
		scene.traverse(function (node) {
		if (node instanceof THREE.Mesh) {
			node.material.wireframe = !node.material.wireframe;
		}} );
    
  }else if (e.keyCode == 73) { // keyCode tecla I - iluminacao
  	ilumination();
  }else if (e.keyCode == 66) { // keyCode tecla B - bola parar/mexer - anda automaticmente
    
  }else if (e.keyCode == 83) { // keyCode tecla S - Pausa
		if(pause == true) {
			clock.start();
			pause = false;
			frontcam.remove(cubeCam);
		}
		else {
			clock.stop();
			pause = true;
			texture_pause();

		}
    
  }else if (e.keyCode == 82) { // keyCode tecla R - Refresh
		if (pause) restartGame();
  }
}


function texture_pause() {
	var geometry = new THREE.CubeGeometry( 1,2.5,2.5);
	var cubeMaterials =
		[
			new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/stop.png"), side: THREE.DoubleSide}),
	]
	//var cubeMaterial = new THREE.MeshBasicMaterial(cubeMaterials);
	cubeCam = new THREE.Mesh(geometry, cubeMaterials);
	cubeCam.rotateY(Math.PI/2);
	cubeCam.position.set(0,0,-3);
  frontcam.add( cubeCam );

}


/*******************************************************************
 *
 *   OBJECTS
 *
 *******************************************************************/

function createSkyBox(){
	var geometry = new THREE.CubeGeometry( 200,200,200);
  var cubeMaterials =
  [
      new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/cubemap/px.png"), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/cubemap/py.png"), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/cubemap/pz.png"), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/cubemap/ny.png"), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/cubemap/nx.png"), side: THREE.DoubleSide}),
      new THREE.MeshBasicMaterial({map : new THREE.TextureLoader( ).load("js/cubemap/nz.png"), side: THREE.DoubleSide})
  ]
  //var cubeMaterial = new THREE.MeshBasicMaterial(cubeMaterials);
  var cube = new THREE.Mesh(geometry, cubeMaterials);
  scene.add( cube );
}


 function createBoard(x, y, z) {  
 
	board = new THREE.Object3D();
	geometry = new THREE.CubeGeometry(90, 1, 90);

	materialBoard[0] = new THREE.MeshPhongMaterial({ map: loader.load('js/textura_relvado.jpg'), bumpMap:  loader.load('js/textura_relvado.jpg'),
		wireframe: false, color: 0xFFFFFF, opacity: 1});
	materialBoard[1] = new THREE.MeshBasicMaterial({ map: loader.load('js/textura_relvado.jpg'),
		wireframe: false, color: 0xFFFFFF, opacity: 1});

	meshBoard = new THREE.Mesh(geometry, materialBoard[0]);

	board.add(meshBoard);
	board.position.set(x, y, z);

	scene.add(board);

}

function createBall(x, y, z) {
  ball = new THREE.Object3D();

  // raio, heightsegment, withsegment
  geometry = new THREE.SphereGeometry(2, 16,16);
	 materialBall[0] = new THREE.MeshPhongMaterial({map: loader.load('js/textura_bola_golf.png'), bumMap: loader.load('js/textura_bola_golf.png'),
	 	wireframe: false, color: 0xFFFFFF,specular: 0xffffff});
   materialBall[1] = new THREE.MeshBasicMaterial({map: loader.load('js/textura_bola_golf.png'), wireframe: false, color: 0xFFFFFF});

  ball.position.set(x, y, z);
  
  meshBall = new THREE.Mesh(geometry, materialBall[0]);

  ball.add(meshBall);
  scene.add(ball);
}

function createBandeira(x, y, z){

	bandeira = new THREE.Object3D();

	add_haste_bandeira(bandeira, -15, 5.5, 25);
	add_bandeira(bandeira, -18.5, 11.5, 25);

	scene.add(bandeira);
    bandeira.position.x = -15;
    bandeira.position.y = 0;
    bandeira.position.z = 25;
}




function add_haste_bandeira(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry( 1, 1, 10, 10);
    materialHasteBandeira[0] = new THREE.MeshPhongMaterial({color: 0x235632, wireframe: false});
    materialHasteBandeira[1] = new THREE.MeshBasicMaterial({color: 0x235632, wireframe: false});

    meshHasteBandeira = new THREE.Mesh(geometry, materialHasteBandeira[0]);
    obj.position.set(x, y , z);
    meshHasteBandeira.position.set(0, y+1 , 0);
    obj.add(meshHasteBandeira);
 
}

function add_bandeira(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(6,2,0);
    materialBandeira[0] = new THREE.MeshPhongMaterial({color: 0x235632, wireframe: false});
    materialBandeira[1] = new THREE.MeshBasicMaterial({color: 0x235632, wireframe: false});
    meshBandeira = new THREE.Mesh(geometry, materialBandeira[0]);
    obj.position.set(x, y , z);
    meshBandeira.position.set(3, y , 0);
    obj.add(meshBandeira);
 
}

/*******************************************************************
 *
 *   LIGHT
 *
 *******************************************************************/


function createDirectionalLight() {
	'use strict';
	
	directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(100, 100, 100);
	directionalLight.castShadow = true;
	scene.add(directionalLight);
}


function createPointLights() {
	'use strict';
	
	pointlight = new THREE.PointLight( 0xff0000, 2, 200 );
	pointlight.position.set( 15, 2, 15 );
	scene.add( pointlight );
	
}



function update_ilum() {
	'use strict';

	if(light_on == true) {
		directionalLight.intensity = 1;	
	}
	else if(light_on == false){
		directionalLight.intensity = 0.1;
	}
}


function ilumination(){
	if(!Flag) {

		meshBoard.material = materialBoard[1];
		meshBall.material = materialBall[1];
		meshHasteBandeira.material = materialHasteBandeira[1];
		meshBandeira.material = materialBandeira[1];
		meshBoard.material = materialBoard[1];

		
		Flag = true;
		
	}
	else{
		meshBoard.material = materialBoard[0];
		meshBall.material = materialBall[0];
		meshHasteBandeira.material = materialHasteBandeira[0];
		meshBandeira.material = materialBandeira[0];
		meshBoard.material = materialBoard[0];
			
		Flag = false;	
	}
}	



function update_movimento_bandeira(){
	var delta = clock.getDelta();
	//bandeira.translateX(-5 * delta);
	bandeira.rotateY(-5 * delta);

}


function restartGame() {
	var cameraIndex = 1;
	var light_on = true;
	var pointlight_on = true;
	var pause = false;
	var Flag = false;
	clock.start();
	board.position.set(0,0,0);
	ball.position.set(0, 2.25, 0);
	bandeira.position.set(0, 0, 0);
	
}


/*
	var currentFrameTime = Date.now(),
		deltaT = (paused || gameOver) ? 0 : currentFrameTime - previousFrameTime;


		~*/


