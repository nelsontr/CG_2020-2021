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
var spotLightHF1, spotLightHF2, spotLightHF3;
var windows;
var lateral_car;
var geometry_carTopBack;

var PhongFlag = true;
var BasicFlag = false;
var LambertFlag = false;

var board, car, palanque;
var carlado;
var rotate_right, rotate_left;
var light_on = true;
var holofote_1, holofote_2, holofote_3;
var spotLightHF1, spotLightHF2, spotLightHF3;

var geometry, material, mesh;
var frontcam, followcamera;
var aspect = window.innerWidth / window.innerHeight;

var listCars = [];


//VARS MATERIALS

var materialCarTop = [], materialCarBody = [], materialCarTopBack = [];
var materialCarSpoiler = [], materialWheel = [];
var materialBoard = [], materialPalanque = [], materialHolofotes = [];
var material_cone = [], material_sphere = [];
var materialWindow = [], material_lateral_car = [];

var meshCarTop = [], meshCarBody = [], meshCarTopBack = [];
var meshWheel = [];
var meshBoard = [], meshPalaque = [], meshHolofotes = [];
var meshWindow = [];
var mesh_cone = [], mesh_sphere = [], mesh_lateral_car = [];



function init() {
  "use strict";

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  clock = new THREE.Clock(true);

  createScene();
  createCameras();
  createDirectionalLight();
  createHolofoteLight();

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
  } else if (cameraIndex == 2){
  	
  	var camPosition = new THREE.Vector3(0, 0, -40);
	var lateralPosition = camPosition.applyMatrix4(car.matrixWorld);
  	
    followcamera.position.x = lateralPosition.x;
    followcamera.position.y = lateralPosition.y;
    followcamera.position.z = lateralPosition.z;

    followcamera.lookAt(car.position);

  	renderer.render(scene, followcamera);
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
  createCars(0, 10.5, 0);
  createHolofotes( -20,30, 0, 1);
  createHolofotes( 20, 30, 0, 2);
  createHolofotes( 0, 30, -20, 3);
 
}

/*******************************************************************
 *
 *   CAMERAS
 *
 *******************************************************************/

 function createCameras() {
  "use strict";

  createFrontCamera();
  createFollowCamera();
  
}

function createFrontCamera() {
  "use strict";

  frontcam = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
  frontcam.position.set(100, 125, 100);
  frontcam.lookAt(scene.position);
  scene.add(frontcam);
}

function createFollowCamera(){
  "use strict";

  followcamera = new THREE.OrthographicCamera( -70, 70, 60, -20, 0, 300);
  followcamera.position.x = 0;
  followcamera.position.y = 10.5;
  followcamera.position.z = 0;
  followcamera.lookAt(scene.position);
  scene.add(followcamera);

}



/*******************************************************************
 *
 *   USER INPUT
 *
 *******************************************************************/

 function onResize() {
  "use strict";
	renderer.setSize(window.innerWidth, window.innerHeight);
	if(cameraIndex == 1){
		frontcam.aspect = window.innerWidth / window.innerHeight;
	    frontcam.updateProjectionMatrix();
	}

	else if(cameraIndex == 2){
	  	if(aspect > 1){

	  	let tablesize = 90;
	    followcamera.left   = -tablesize * aspect * 0.5;
	    followcamera.right  =  tablesize * aspect * 0.5;
	    followcamera.top    =  tablesize * 0.5;
	    followcamera.bottom = -tablesize * 0.5;
	    followcamera.updateProjectionMatrix();

	  	}

	  	else if(aspect <= 1){

		let tablesize = 90;
	    followcamera.left   = -tablesize * 0.5;
	    followcamera.right  =  tablesize * 0.5;
	    followcamera.top    =  tablesize * 0.5 / aspect;
	    followcamera.bottom =  -tablesize * 0.5 / aspect;
	    followcamera.updateProjectionMatrix();
		}
	}
}


function onKeyDown(e) {
  "use strict";

  /* Camera Controls */
  if (e.keyCode == 49) { // keyCode tecla 1
    if(holofote_1 == true){
    	holofote_1 = false;
    }
    else{
    	holofote_1 = true;
    }
  } else if (e.keyCode == 50) { // keyCode tecla 2
  	if(holofote_2 == true){
    	holofote_2 = false;
    }
    else{
    	holofote_2 = true;
    }
  } else if (e.keyCode == 51) { // keyCode tecla 3
  	if(holofote_3 == true){
    	holofote_3 = false;
    }
    else{
    	holofote_3 = true;
    }
  } else if (e.keyCode == 52) { // keyCode tecla 4
    cameraIndex = 1;
  } else if (e.keyCode == 53) { // keyCode tecla 5
    cameraIndex = 2;
  } else if (e.keyCode == 37) { // keyCode for arrowleft
    rotate_left = true;
  } else if (e.keyCode == 39) { // keyCode for arrowright
    rotate_right = true;
  } else if (e.keyCode == 81) { // keyCode for q
  		if(light_on == true) {
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

	materialBoard[0] = new THREE.MeshBasicMaterial({color: 0x955599, wireframe: false});
	materialBoard[1] = new THREE.MeshPhongMaterial({color: 0x955599, wireframe: false, specular: 0xffffff, shininess: 60});
	materialBoard[2] = new THREE.MeshLambertMaterial({color: 0x955599, wireframe: false});
	meshBoard = new THREE.Mesh(geometry, materialBoard[1]);

	board.add(meshBoard);
	board.position.set(x, y, z);

	scene.add(board);
}

function createPalanque(x, y, z) {

	'use strict';
	palanque = new THREE.Object3D();

    /*scale , CylinderGeometry(radiustop, radiusbottom, height)****/
    geometry = new THREE.CylinderGeometry( 20, 20, 10, 32);

    materialPalanque[0] = new THREE.MeshBasicMaterial({color: 0x999999, wireframe: false});
	materialPalanque[1] = new THREE.MeshPhongMaterial({color: 0x999999, wireframe: false, specular: 0xffffff, shininess: 60});
	materialPalanque[2] = new THREE.MeshLambertMaterial({color: 0x999999, wireframe: false});
    meshPalaque = new THREE.Mesh(geometry, materialPalanque[1]);

    palanque.add(meshPalaque);
	palanque.position.set(x, y, z);

	board.add(palanque);

}

function createHolofotes(x, y, z, index) { 

	var holofotes = new THREE.Object3D();

	add_sphere_holofote(holofotes,0 ,2.5 ,0 );
	add_cone_holofote(holofotes,0 , 10, 0);

	holofotes.position.set(x, y, z);
	board.add(holofotes);


}

function add_sphere_holofote(obj, x, y, z){

	//raio, segment, segment
	const geometry_sphere = new THREE.SphereGeometry( 2.5, 32, 32 );
	const material_sphere = new THREE.MeshPhongMaterial({color: 0x00acff, wireframe: false, specular: 0x00acff, shininess: 60});
	const mesh_sphere = new THREE.Mesh( geometry_sphere, material_sphere );
	mesh_sphere.position.set(x, y, z);
	obj.add( mesh_sphere );

}

function add_cone_holofote(obj, x, y, z){

	// raio, height, segment/
	const geometry_cone = new THREE.ConeGeometry( 3 , 10, 32 );
	const material_cone = new THREE.MeshPhongMaterial({color: 0xff0000, wireframe: false, specular: 0xff0000, shininess: 60});
	const mesh_cone = new THREE.Mesh( geometry_cone, material_cone );
	mesh_cone.position.set(x, y, z);
	obj.add( mesh_cone ); 

}

function createCars(x, y, z) {

	'use strict';
	var i;
	listCars = [];
	for( i = 0; i < 6; i++){
		var raceCar = new THREE.Object3D();
		addWheel(raceCar, -7, 0, 5, 0);
		addWheel(raceCar, -7, 0, -5, 1);
		addWheel(raceCar, 7, 0, 5, 2);
		addWheel(raceCar, 7, 0, -5, 3);
		addCarBody(raceCar, 0, 0, 0);
		addCarTopBack(raceCar, 5, 1.5, 0);
		carlado = addLateral_Car(raceCar, 5, 1.5, 0);
		listCars.push(raceCar);
	}

	car = listCars[0];
	car.position.set(x, y, z);
	console.log(car.position);
	palanque.add(car);

}

function addWheel(obj, x, y, z, index) {
	'use strict';

	materialWheel[0] = new THREE.MeshBasicMaterial({wireframe: false});
	materialWheel[1] = new THREE.MeshPhongMaterial({wireframe: false, specular: 0x000000, shininess: 30});
	materialWheel[2] = new THREE.MeshLambertMaterial({wireframe: false});
	geometry = new THREE.CylinderGeometry(2, 2, 1.5, 25, 25);
	meshWheel[index] = new THREE.Mesh(geometry, materialWheel[1]);
	meshWheel[index].position.set(x, y - 1, z);
	meshWheel[index].rotateX(Math.PI / 2);
	obj.add(meshWheel[index]);
}

function addCarBody(obj, x, y, z) {
	'use strict';

	materialCarBody[0] = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
	materialCarBody[1] = new THREE.MeshPhongMaterial({color: 0xff0000, wireframe: false, specular: 0xffffff, shininess: 60});
	materialCarBody[2] = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: false});
	geometry = new THREE.BoxGeometry(20, 3, 8, 10, 10, 10);
	meshCarBody = new THREE.Mesh(geometry, materialCarBody[1]);
	meshCarBody.position.set(x, y, z);
	obj.add(meshCarBody);
}


function addLateral_Car(obj, x, y, z) {
	'use strict';
	lateral_car = new THREE.Geometry();
	lateral_car.vertices.push(new THREE.Vector3(-2, 4, 3));		// 0
	lateral_car.vertices.push(new THREE.Vector3(-15, 1.5, 4));	// 1
	lateral_car.vertices.push(new THREE.Vector3(5, 1.5, 4));	// 2
	lateral_car.faces.push(new THREE.Face3(0, 1, 2));

	lateral_car.computeFaceNormals();
	lateral_car.computeVertexNormals();

	material_lateral_car[0] = new THREE.MeshBasicMaterial({color: 0xff0000 ,wireframe: false});
	material_lateral_car[1] = new THREE.MeshPhongMaterial({color: 0xff0000 , wireframe: false, specular: 0xffffff, shininess: 60});
	material_lateral_car[2] = new THREE.MeshLambertMaterial({color: 0xff0000 , wireframe: false});
	mesh_lateral_car = new THREE.Mesh(lateral_car, material_lateral_car[1]);
	mesh_lateral_car.position.set(x, y-1.5, z);
	obj.add(mesh_lateral_car);

}


function addCarTopBack(obj, x, y, z) {
	'use strict';
	geometry_carTopBack = new THREE.Geometry();
	windows = new THREE.Geometry();
		//Laterais
		geometry_carTopBack.vertices.push(new THREE.Vector3(-2, 4, 3));		// 0
		geometry_carTopBack.vertices.push(new THREE.Vector3(-15, 1.5, 4));	// 1
		geometry_carTopBack.vertices.push(new THREE.Vector3(5, 1.5, 4));	// 2
		//geometry_carTopBack.faces.push(new THREE.Face3(0, 1, 2));
		
		geometry_carTopBack.vertices.push(new THREE.Vector3(-2, 4, -3));	// 3
		geometry_carTopBack.vertices.push(new THREE.Vector3(-15, 1.5, -4));	// 4
		geometry_carTopBack.vertices.push(new THREE.Vector3(5, 1.5, -4));	// 5
		geometry_carTopBack.faces.push(new THREE.Face3(5, 4, 3));
		//Atras
		geometry_carTopBack.faces.push(new THREE.Face3(1, 0, 3));
		geometry_carTopBack.faces.push(new THREE.Face3(4, 1, 3));
		//Frente
		geometry_carTopBack.faces.push(new THREE.Face3(0, 2, 5));
		geometry_carTopBack.faces.push(new THREE.Face3(0, 5, 3));
		
		// janela lado esquerda
   		windows.vertices.push(new THREE.Vector3(-2, 3.5, 3.5));  // 0
   		windows.vertices.push(new THREE.Vector3(-10, 2, 4));    // 1
    	windows.vertices.push(new THREE.Vector3(2, 2, 4));     // 2
		windows.faces.push(new THREE.Face3(0, 1, 2));
		
		// janela lado direita
    	windows.vertices.push(new THREE.Vector3(-2, 3.5, -3.5)); // 3
    	windows.vertices.push(new THREE.Vector3(-10, 2, -4));   // 4
    	windows.vertices.push(new THREE.Vector3(2, 2, -4));    // 5
		windows.faces.push(new THREE.Face3(5, 4, 3));

		// janela frente
		windows.vertices.push(new THREE.Vector3(-1, 3.65, -2.5)); // 6
		windows.vertices.push(new THREE.Vector3(-1, 3.65, 2.5));  // 7
		windows.vertices.push(new THREE.Vector3(4, 1.86, 3));      // 8
		windows.vertices.push(new THREE.Vector3(4, 1.86, -3));     // 9
		windows.faces.push(new THREE.Face3(7, 8, 9));
		windows.faces.push(new THREE.Face3(6, 7, 9));

		//janela tras
		windows.vertices.push(new THREE.Vector3(-3, 3.81, -2.5));  // 10
		windows.vertices.push(new THREE.Vector3(-3, 3.81, 2.5));   // 11
		windows.vertices.push(new THREE.Vector3(-10, 2.47, 3));       // 12
		windows.vertices.push(new THREE.Vector3(-10, 2.47, -3));      // 13
		windows.faces.push(new THREE.Face3(10, 13, 12));
		windows.faces.push(new THREE.Face3(11, 10, 12));

   		//luz frente
    	geometry_carTopBack.vertices.push(new THREE.Vector3(5.1, 1, 3));					//6           
    	geometry_carTopBack.vertices.push(new THREE.Vector3(5.1, 1, -3));        //7
    	geometry_carTopBack.vertices.push(new THREE.Vector3(5.1, 0, -3));        //8
    	geometry_carTopBack.vertices.push(new THREE.Vector3(5.1, 0, 3));         //9   
		geometry_carTopBack.faces.push(new THREE.Face3(8, 7, 6));
		geometry_carTopBack.faces.push(new THREE.Face3(9, 8, 6));
				
		//luz atras
		geometry_carTopBack.vertices.push(new THREE.Vector3(-15.1, 0, 3));        //10
		geometry_carTopBack.vertices.push(new THREE.Vector3(-15.1, 0, -3));       //11 
		geometry_carTopBack.vertices.push(new THREE.Vector3(-15.1, -1, -3));      //12
		geometry_carTopBack.vertices.push(new THREE.Vector3(-15.1, -1, 3));       //13
		geometry_carTopBack.faces.push(new THREE.Face3(10, 11, 12));
		geometry_carTopBack.faces.push(new THREE.Face3(10, 12, 13));	
	
	geometry_carTopBack.computeFaceNormals();
	geometry_carTopBack.computeVertexNormals();
	windows.computeFaceNormals();
	windows.computeVertexNormals();
		
	materialCarTopBack[0] = new THREE.MeshBasicMaterial({color: 0xff0000 ,wireframe: false});
	materialCarTopBack[1] = new THREE.MeshPhongMaterial({color: 0xff0000 , wireframe: false, specular: 0xffffff, shininess: 60});
	materialCarTopBack[2] = new THREE.MeshLambertMaterial({color: 0xff0000 , wireframe: false});
	meshCarTopBack = new THREE.Mesh(geometry_carTopBack, materialCarTopBack[1]);
	meshCarTopBack.position.set(x, y-1.5, z);
	obj.add(meshCarTopBack);

	materialWindow[0] = new THREE.MeshBasicMaterial({color: 0x424242 ,wireframe: false});
	materialWindow[1] = new THREE.MeshPhongMaterial({color: 0x424242 , wireframe: false, specular: 0xffffff, shininess: 60});
	materialWindow[2] = new THREE.MeshLambertMaterial({color: 0x424242 , wireframe: false});
	meshWindow = new THREE.Mesh(windows, materialWindow[1]);
	meshWindow.position.set(x, y-1.5, z);
	obj.add(meshWindow);

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

function createHolofoteLight(){

	spotLightHF1 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
	spotLightHF2 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
	spotLightHF3 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
	
	spotLightHF1.position.set(-20, 45, 0);
	spotLightHF2.position.set(20, 45, 0);
	spotLightHF3.position.set(0, 45, -20);

	spotLightHF1.target.position.set(0, 10, 0);
	spotLightHF2.target.position.set(0, 10, 0);
	spotLightHF3.target.position.set(0, 10, 0);

	spotLightHF1.castShadow = true;
	spotLightHF2.castShadow = true;
	spotLightHF3.castShadow = true;

	board.add(spotLightHF1.target);
	board.add(spotLightHF2.target);
	board.add(spotLightHF3.target);
	
	board.add(spotLightHF1);
	board.add(spotLightHF2);
	board.add(spotLightHF3);

}

function update_ilum() {
	'use strict';

	if(light_on == true) {
		directionalLight.intensity = 1;	
	}
	else if(light_on == false){
		directionalLight.intensity = 0.1;
	}

	if(holofote_1 == true) {
		spotLightHF1.intensity = 5;
	}
	else if(holofote_1 == false){
		spotLightHF1.intensity = 0;
	}

	if(holofote_2 == true) {
		spotLightHF2.intensity = 5;
		
	}
	else if(holofote_2 == false){
		spotLightHF2.intensity = 0;
		
	}

	if(holofote_3 == true) {
		spotLightHF3.intensity = 5;
	}
	else if(holofote_3 == false){
		spotLightHF3.intensity = 0;
	}
}

function update_movimento_palanque(){
	var delta = clock.getDelta();

	if(rotate_right == true){
		palanque.rotateY(-5 * delta);
	} 

	else if(rotate_left == true){
		palanque.rotateY(5 * delta);

	}

}

function ilumination(){
	if(!BasicFlag) {

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
	else{
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


function shadding(){
	if(!LambertFlag) {
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










