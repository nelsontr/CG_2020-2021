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
var cameraIndex = 1;
var scene, renderer;
var directionalLight;

var PhongFlag = true;
var BasicFlag = false;
var LambertFlag = false;

var board, car, palanque;
var rotate_right, rotate_left;
var light_on = true;
var holofote_1, holofote_2, holofote_3;

var geometry, material, mesh;
var frontcam;
var aspect = window.innerWidth / window.innerHeight;

var listCars = [];

//Texturas
var pneu_texture = new THREE.ImageUtils.loadTexture('js/pneu.jpg');
var carro_texture = new THREE.ImageUtils.loadTexture('js/carro.jpg');

//VARS MATERIALS

var materialCarTop = [], materialCarBody = [], materialCarTopBack = [];
var materialCarSpoiler = [], materialWheel = [];
var materialBoard = [], materialPalanque = [], materialHolofotes = [];

var meshCarTop = [], meshCarBody = [], meshCarTopBack = [];
var meshWheel = [];
var meshBoard = [], meshPalaque = [], meshHolofotes = [];


function init() {
	"use strict";

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	clock = new THREE.Clock(true);

	createScene();
	createCameras();
	createDirectionalLight();

	window.addEventListener("resize", onResize);
	window.addEventListener("keydown", onKeyDown);
	window.addEventListener("keyup", keyNotPressed);
}

function animate() {
	"use strict";

	requestAnimationFrame(animate);
	update_ilum();
	update_movimento_palanque();
	render();
}

function render() {
	"use strict";
	if (cameraIndex == 1) {
		renderer.render(scene, frontcam);
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

	scene.background = new THREE.Color(0xbbbbbb);

	createBoard(0, 0, 0);
	createPalanque(0, 5.5, 0);
	createCars(0, 14.5, 0);

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
	frontcam.position.set(100, 125, 100);
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

	/* Camera Controls */
	if (e.keyCode == 49) { // keyCode tecla 1
		holofote_1 = true;
	} else if (e.keyCode == 50) { // keyCode tecla 2
		holofote_2 = true;
	} else if (e.keyCode == 51) { // keyCode tecla 3
		holofote_3 = true;
	} else if (e.keyCode == 52) { // keyCode tecla 4
		cameraIndex = 1;
	} else if (e.keyCode == 53) { // keyCode tecla 5
		cameraIndex = 2;
	} else if (e.keyCode == 37) { // keyCode for arrowleft
		rotate_left = true;
	} else if (e.keyCode == 39) { // keyCode for arrowright
		rotate_right = true;
	} else if (e.keyCode == 81) { // keyCode for q
		if (light_on == true) {
			light_on = false;
		}
		else {
			light_on = true;
		}
	} else if (e.keyCode == 87) { // keyCode for w
		ilumination();
	} else if (e.keyCode == 69) { // keyCode for e
		shadding();
	}
}


function keyNotPressed(e) {
	"use strict";

	if (e.keyCode == 37) { // keyCode for arrowleft
		rotate_left = false;
	}
	else if (e.keyCode == 39) { // keyCode for arrowright
		rotate_right = false;
	}
}

/*******************************************************************
 *
 *   OBJECTS
 *
 *******************************************************************/

function createBoard(x, y, z) {

	board = new THREE.Object3D();
	geometry = new THREE.CubeGeometry(90, 1, 90);

	materialBoard[0] = new THREE.MeshBasicMaterial({ color: 0x955599, wireframe: false });
	materialBoard[1] = new THREE.MeshPhongMaterial({ color: 0x955599, wireframe: false, specular: 0xffffff, shininess: 60 });
	materialBoard[2] = new THREE.MeshLambertMaterial({ color: 0x955599, wireframe: false });
	meshBoard = new THREE.Mesh(geometry, materialBoard[1]);

	board.add(meshBoard);
	board.position.set(x, y, z);

	scene.add(board);
}

function createPalanque(x, y, z) {

	'use strict';
	palanque = new THREE.Object3D();

	/*scale , CylinderGeometry(radiustop, radiusbottom, height)****/
	geometry = new THREE.CylinderGeometry(20, 20, 10, 32);

	materialPalanque[0] = new THREE.MeshBasicMaterial({ color: 0x999999, wireframe: false });
	materialPalanque[1] = new THREE.MeshPhongMaterial({ color: 0x999999, wireframe: false, specular: 0xffffff, shininess: 60 });
	materialPalanque[2] = new THREE.MeshLambertMaterial({ color: 0x999999, wireframe: false });
	meshPalaque = new THREE.Mesh(geometry, materialPalanque[1]);

	palanque.add(meshPalaque);
	palanque.position.set(x, y, z);

	board.add(palanque);

}

function createHolofotes(x, y, z, index) {

	var holofotes = new THREE.Object3D();

	/*scale , CylinderGeometry(radiustop, radiusbottom, height)****/
	geometry = new THREE.CylinderGeometry(1, 0, 4, 32);

	materialHolofotes[0] = new THREE.MeshBasicMaterial({ color: 0xb37387, wireframe: false });
	materialHolofotes[1] = new THREE.MeshPhongMaterial({ color: 0xb37387, wireframe: false, specular: 0xffffff, shininess: 60 });
	materialHolofotes[2] = new THREE.MeshLambertMaterial({ color: 0xb37387, wireframe: false });
	meshHolofotes[index] = new THREE.Mesh(geometry, materialHolofotes[1]);

	palanque.add(meshHolofotes[index]);
	palanque.position.set(x, y, z);

	board.add(palanque);

	/*
	var holofote1 = new THREE.Object3D();
	var holofote2 = new THREE.Object3D();
	var holofote3 = new THREE.Object3D();
	
	holofote1.position.set(-9, 0, 3);
	holofote2.position.set(-9, 0, -3);
	holofote3.position.set(-9, 0, -3);
	
	spotLightHF1 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
	spotLightHF2 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
	spotLightHF3 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
	
	spotLightHF1.position.set(0, 0, 3);
	spotLightHF2.position.set(0, 0, -3);
	spotLightHF3.position.set(0, 0, -3);
	
	spotLightHF1.castShadow = true;
	spotLightHF2.castShadow = true;
	spotLightHF3.castShadow = true;
	
	spotLightHF1.target = holofote1;
	spotLightHF2.target = holofote2;
	spotLightHF3.target = holofote3;
	
	board.add(holofote1);
	boarc.add(holofote2);
	board.add(holofote3);
	
	board.add(spotLightHF1);
	board.add(spotLightHF2);
	board.add(spotLightHF3);
	*/
}

function createCars(x, y, z) {

	'use strict';
	var i;
	listCars = [];
	for (i = 0; i < 6; i++) {
		var raceCar = new THREE.Object3D();
		addWheel(raceCar, -7, 0, 5, 0);
		addWheel(raceCar, -7, 0, -5, 1);
		addWheel(raceCar, 7, 0, 5, 2);
		addWheel(raceCar, 7, 0, -5, 3);
		addCarBody(raceCar, 0, 0, 0);
		addCarTop(raceCar, 1, 2.5, 0);
		addCarTopBack(raceCar, 5, 1.5, 0);
		listCars.push(raceCar);
	}

	car = listCars[0];
	car.position.set(x, y, z);
	console.log(car.position);
	palanque.add(car);

}

function addWheel(obj, x, y, z, index) {
	'use strict';

	materialWheel[0] = new THREE.MeshBasicMaterial({ map: pneu_texture, wireframe: false });
	materialWheel[1] = new THREE.MeshPhongMaterial({ map: pneu_texture, wireframe: false, specular: 0x000000, shininess: 30 });
	materialWheel[2] = new THREE.MeshLambertMaterial({ map: pneu_texture, wireframe: false });
	geometry = new THREE.CylinderGeometry(2, 2, 1.5, 25, 25);
	meshWheel[index] = new THREE.Mesh(geometry, materialWheel[1]);
	meshWheel[index].position.set(x, y - 1, z);
	meshWheel[index].rotateX(Math.PI / 2);
	obj.add(meshWheel[index]);
}

function addCarBody(obj, x, y, z) {
	'use strict';

	materialCarBody[0] = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false });
	materialCarBody[1] = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false, specular: 0xffffff, shininess: 60 });
	materialCarBody[2] = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false });
	geometry = new THREE.BoxGeometry(20, 3, 8, 10, 10, 10);
	meshCarBody = new THREE.Mesh(geometry, materialCarBody[1]);
	meshCarBody.position.set(x, y, z);
	obj.add(meshCarBody);
}

function addCarTop(obj, x, y, z) {
	'use strict';

	materialCarTop[0] = new THREE.MeshBasicMaterial({ map: carro_texture, wireframe: false });
	materialCarTop[1] = new THREE.MeshPhongMaterial({ map: carro_texture, wireframe: false, specular: 0xffffff, shininess: 60 });
	materialCarTop[2] = new THREE.MeshLambertMaterial({ map: carro_texture, wireframe: false });
	geometry = new THREE.BoxGeometry(8, 2, 8, 10, 10, 10);
	meshCarTop = new THREE.Mesh(geometry, materialCarTop[1]);
	meshCarTop.position.set(x, y, z);
	obj.add(meshCarTop);
}

function addCarTopBack(obj, x, y, z) {
	'use strict';

	var geometry_carTopBack = new THREE.Geometry();

	geometry_carTopBack.vertices.push(new THREE.Vector3(0, 0, 4)); // 0
	geometry_carTopBack.vertices.push(new THREE.Vector3(3, 0, 4)); // 1
	geometry_carTopBack.vertices.push(new THREE.Vector3(0, 2, 4)); // 2
	////////////////////////////////////////////////////////////
	geometry_carTopBack.vertices.push(new THREE.Vector3(0, 0, -4)); // 3
	geometry_carTopBack.vertices.push(new THREE.Vector3(3, 0, -4)); // 4
	geometry_carTopBack.vertices.push(new THREE.Vector3(0, 2, -4)); // 5
	////////////////////////////////////////////////////////////
	geometry_carTopBack.faces.push(new THREE.Face3(2, 0, 1, new THREE.Vector3(0, 0, 1)));
	////////////////////////////////////////////////////////////
	geometry_carTopBack.faces.push(new THREE.Face3(5, 3, 4, new THREE.Vector3(0, 0, -1)));
	////////////////////////////////////////////////////////////////
	geometry_carTopBack.faces.push(new THREE.Face3(0, 3, 5, new THREE.Vector3(1, 0, 0)));
	////////////////////////////////////////////////////////////////
	geometry_carTopBack.faces.push(new THREE.Face3(5, 2, 0, new THREE.Vector3(-1, 0, 0)));
	////////////////////////////////////////////////////////////////
	geometry_carTopBack.faces.push(new THREE.Face3(1, 4, 5, new THREE.Vector3(0, 1, 0)));
	////////////////////////////////////////////////////////////////
	geometry_carTopBack.faces.push(new THREE.Face3(5, 2, 1, new THREE.Vector3(0, -1, 0)));

	geometry_carTopBack.computeFaceNormals();
	geometry_carTopBack.computeVertexNormals();

	materialCarTopBack[0] = new THREE.MeshBasicMaterial({ map: carro_texture, wireframe: false });
	materialCarTopBack[1] = new THREE.MeshPhongMaterial({ map: carro_texture, wireframe: false, specular: 0xffffff, shininess: 60 });
	materialCarTopBack[2] = new THREE.MeshLambertMaterial({ map: carro_texture, wireframe: false });
	meshCarTopBack = new THREE.Mesh(geometry_carTopBack, materialCarTopBack[1]);
	meshCarTopBack.position.set(x, y, z);
	obj.add(meshCarTopBack);
}

/*******************************************************************
 *
 *   LIGHT
 *
 *******************************************************************/


function createDirectionalLight() {
	'use strict';

	directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(0, 100, 0);
	directionalLight.castShadow = true;
	scene.add(directionalLight);
}

function update_ilum() {
	'use strict';

	if (light_on == true) {
		directionalLight.intensity = 1;
	}
	else if (light_on == false) {
		directionalLight.intensity = 0.1;
	}

	if (holofote_1 == true) {
		spotLightL.intensity = 5;
		spotLightR.intensity = 5;
	}
	else if (holofote_1 == false) {
		spotLightL.intensity = 0;
		spotLightR.intensity = 0;
	}

	if (holofote_2 == true) {
		spotLightL.intensity = 5;
		spotLightR.intensity = 5;
	}
	else if (holofote_2 == false) {
		spotLightL.intensity = 0;
		spotLightR.intensity = 0;
	}

	if (holofote_3 == true) {
		spotLightL.intensity = 5;
		spotLightR.intensity = 5;
	}
	else if (holofote_3 == false) {
		spotLightL.intensity = 0;
		spotLightR.intensity = 0;
	}
}

function update_movimento_palanque() {
	var delta = clock.getDelta();

	if (rotate_right == true) {
		palanque.rotateY(-5 * delta);
	}

	else if (rotate_left == true) {
		palanque.rotateY(5 * delta);

	}

}

function ilumination() {
	if (!BasicFlag) {

		/*for(var k = 0; k < 3; k++) {
		meshHolofotes[k].material = materialHolofotes[0];
		}*/

		meshCarTop.material = materialCarTop[0];
		meshCarBody.material = materialCarBody[0];
		meshCarTopBack.material = materialCarTopBack[0];
		meshWheel.material = materialWheel[0];
		meshBoard.material = materialBoard[0];
		meshPalaque.material = materialPalanque[0];

		PhongFlag = false;
		BasicFlag = true;
		LambertFlag = false;
	}
	else {
		/*for(var k = 0; k < 3; k++) {
		meshHolofotes[k].material = materialHolofotes[1];
		}*/

		meshCarTop.material = materialCarTop[1];
		meshCarBody.material = materialCarBody[1];
		meshCarTopBack.material = materialCarTopBack[1];

		meshWheel.material = materialWheel[1];
		meshBoard.material = materialBoard[1];
		meshPalaque.material = materialPalanque[1];

		PhongFlag = true;
		BasicFlag = false;
		LambertFlag = false;
	}
}


function shadding() {
	if (!LambertFlag) {
		/*for(var k = 0; k < 3; k++) {
		meshHolofotes[k].material = materialHolofotes[2];
		}*/

		meshCarTop.material = materialCarTop[2];
		meshCarBody.material = materialCarBody[2];
		meshCarTopBack.material = materialCarTopBack[2];

		meshWheel.material = materialWheel[2];
		meshBoard.material = materialBoard[2];
		meshPalaque.material = materialPalanque[2];

		PhongFlag = false;
		BasicFlag = false;
		LambertFlag = true;
	}
	else {
		/*for(var k = 0; k < 3; k++) {
		meshHolofotes[k].material = materialHolofotes[1];
		}*/

		meshCarTop.material = materialCarTop[1];
		meshCarBody.material = materialCarBody[1];
		meshCarTopBack.material = materialCarTopBack[1];

		meshWheel.material = materialWheel[1];
		meshBoard.material = materialBoard[1];
		meshPalaque.material = materialPalanque[1];

		PhongFlag = true;
		BasicFlag = false;
		LambertFlag = false;
	}
}
