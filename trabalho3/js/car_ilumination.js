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
var cameraIndex = 1;
var scene, renderer;

var space;
var geometry, material, mesh;
var frontcam, topcam;
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
  //scene.add(new THREE.AxisHelper(10));

  scene.background = new THREE.Color(0xbbbbbb);

  createTable(0, 0, 0);



  
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
    light_on = true;
  } else if (e.keyCode == 87) { // keyCode for w
    ilumination = true;
  } else if (e.keyCode == 69) { // keyCode for e
    shadding = true;
  }


}

function keyNotPressed(e) {
  "use strict";


}

/*******************************************************************
 *
 *   OBJECTS
 *
 *******************************************************************/



function createTable(x, y, z) {
  var table = new THREE.Object3D();



  scene.add(table);
  table.position.set(x, y, z)
}








function moviment_function(){

  

}






// Q -luz global
function update_ilum() {
  'use strict';

  if(mododia == true) {
    directionalLight.intensity = 1; 
  }
  else {
    directionalLight.intensity = 0.1;
  }

}

function createDirectionalLight() {
  'use strict';
  
  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(0, 550, 550);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
}




//E - Shading

    if(!LambertFlag) {

      for(var i = 0; i < norange; i++) {
        meshOrange[i].material = materialOrange[2];
        meshLeaf[i].material = materialLeaf[2];
        meshStalk[i].material = materialStalk[2];
      }
      for(var j = 0; j < nbutter; j++) {
        meshButter[j].material = materialButter[2];
      }
      for(var k = 0; k < ntorus; k++) {
        meshTorus[k].material = materialTorus[2];
      }

      meshCarTop.material = materialCarTop[2];
      meshCarBody.material = materialCarBody[2];
      meshCarTopBack.material = materialCarTopBack[2];
      meshCarSpoiler.material = materialCarSpoiler[2];
      meshCarLights.material = materialCarLights[2];
      meshWheel.material = materialWheel[2];
      meshTable.material = materialTable[2];

      PhongFlag = false;
      BasicFlag = false;
      LambertFlag = true;
    }
    else {

      for(var i = 0; i < norange; i++) {
        meshOrange[i].material = materialOrange[1];
        meshLeaf[i].material = materialLeaf[1];
        meshStalk[i].material = materialStalk[1];
      }
      for(var j = 0; j < nbutter; j++) {
        meshButter[j].material = materialButter[1];
      }
      for(var k = 0; k < ntorus; k++) {
        meshTorus[k].material = materialTorus[1];
      }

      meshCarTop.material = materialCarTop[1];
      meshCarBody.material = materialCarBody[1];
      meshCarTopBack.material = materialCarTopBack[1];
      meshCarSpoiler.material = materialCarSpoiler[1];
      meshCarLights.material = materialCarLights[1];
      meshWheel.material = materialWheel[1];
      meshTable.material = materialTable[1];

      PhongFlag = true;
      BasicFlag = false;
      LambertFlag = false;
    }
  } 


// W - ilumination
      if(!BasicFlag) {

      for(var i = 0; i < norange; i++) {
        meshOrange[i].material = materialOrange[0];
        meshLeaf[i].material = materialLeaf[0];
        meshStalk[i].material = materialStalk[0];
      }
      for(var j = 0; j < nbutter; j++) {
        meshButter[j].material = materialButter[0];
      }
      for(var k = 0; k < ntorus; k++) {
        meshTorus[k].material = materialTorus[0];
      }

      meshCarTop.material = materialCarTop[0];
      meshCarBody.material = materialCarBody[0];
      meshCarTopBack.material = materialCarTopBack[0];
      meshCarSpoiler.material = materialCarSpoiler[0];
      meshCarLights.material = materialCarLights[0];
      meshWheel.material = materialWheel[0];
      meshTable.material = materialTable[0];

      PhongFlag = false;
      BasicFlag = true;
      LambertFlag = false;
    }
    else {

      for(var i = 0; i < norange; i++) {
        meshOrange[i].material = materialOrange[1];
        meshLeaf[i].material = materialLeaf[1];
        meshStalk[i].material = materialStalk[1];
      }
      for(var j = 0; j < nbutter; j++) {
        meshButter[j].material = materialButter[1];
      }
      for(var k = 0; k < ntorus; k++) {
        meshTorus[k].material = materialTorus[1];
      }

      meshCarTop.material = materialCarTop[1];
      meshCarBody.material = materialCarBody[1];
      meshCarTopBack.material = materialCarTopBack[1];
      meshCarSpoiler.material = materialCarSpoiler[1];
      meshCarLights.material = materialCarLights[1];
      meshWheel.material = materialWheel[1];
      meshTable.material = materialTable[1];

      PhongFlag = true;
      BasicFlag = false;
      LambertFlag = false;
    }


// criar 3 holofotes





Criar um total de três holofotes (fontes de luz spotlight) distribuídas ao redor do veículo
que devem iluminar parcialmente os objectos da cena. Esta iluminação deve ser suficiente para se conseguir visualizar o veículo e o palanque, mas não necessita de os iluminar
na íntegra. Estas fontes de luz devem poder ser activadas ou desactivadas através das
teclas ’1’ a ‘3’ que ligam e desligam cada um dos holofotes individualmente. Os holofotes devem ser geometricamente modelados usando duas primitivas geométricas: um
cone e uma esfera bastando atribuir um tipo de material à vossa escolha [1,0 valores] 





Definir uma câmara fixa com uma vista sobre a cena utilizando uma projecção perspectiva que mostre toda a cena usando a tecla ‘4’ assim como uma câmara fixa, activada
usando a tecla ‘5’, que está alinhada com o referencial do palanque e aponta para a lateral do veículo utilizando uma projecção ortogonal. [0,5 valores]



- Criar carro, board, palanque                                                                                           - done
- rodar com tecla esquerda e direita o palaque e carro                                                                   - done
- Usar os 3 tipos de material para os objetos da cena: MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial         - done

- criar iluminacao global recorrendo a fonte de luz direcional. ligar/desligar com q                                     - done
- ligar/desligar calculos iluminacao                                                                                     - done             
- alterar sombreamento entre Gouraud e Phong                                                                             - done

- criar 3 holofotes (usar um cone e uma esfera)
- fontes de spotlight

- 2 camaras - camera4 global e camera5 alinnhada com o                                                                     - 1 camera feita
referencial do palanque e aponta para a lateral do carro


