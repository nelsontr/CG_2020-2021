/*******************************************************************
 * Trabalho Laboratorial de CG #4
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
var geometry, material, mesh;
var scene, renderer;
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
var position,
  velocity = 10;
var pararBola = false;

var materialBoard = [];
var meshBoard = [];
var materialBall = [];
var meshBall = [];
var materialHasteBandeira = [];
var materialBandeira = [];
var meshBandeira = [];
var meshHasteBandeira = [];
var controls;

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

function animate() {
  "use strict";

  if (pause == true) {
    requestAnimationFrame(animate);
    render();
  } else {
    controls.update();
    requestAnimationFrame(animate);
    update_movimento_bandeira();
    update_ilum();
    render();
  }
}

function render() {
  "use strict";
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

  createBoard(0, 0, 0);
  createBall(0, 2.25, 0);
  createBandeira(-15, 0, 25);
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

  frontcam = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  controls = new THREE.OrbitControls(frontcam, renderer.domElement);

  frontcam.position.set(75, 20, 100);
  frontcam.lookAt(scene.position);
  controls.update();
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
  
  if (e.keyCode == 68) {
    // keyCode tecla D - luz direcional
    if (light_on == true) {
      light_on = false;
    } else {
      light_on = true;
    }
  } else if (e.keyCode == 80) {
    // keyCode tecla P - luz pontual
    if (pointlight_on == true) {
      pointlight_on = false;
      pointlight.intensity = 0;
    } else {
      pointlight_on = true;
      pointlight.intensity = 2;
    }
  } else if (e.keyCode == 87) {
    // keyCode tecla W - modelo arames
    scene.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.material.wireframe = !node.material.wireframe;
      }
    });
  } else if (e.keyCode == 73) {
    // keyCode tecla I - iluminacao
    ilumination();
  } else if (e.keyCode == 66) {
    // keyCode tecla B - bola parar/mexer - anda automaticmente
    if (pararBola) {
      pararBola = false;
    } else {
      pararBola = true;
    }
  } else if (e.keyCode == 83) {
    // keyCode tecla S - Pausa
    if (pause == true) {
      clock.start();
      pause = false;
      frontcam.remove(cubeCam);
    } else {
      clock.stop();
      pause = true;
      texture_pause();
    }
  } else if (e.keyCode == 82) {
    // keyCode tecla R - Refresh
    if (pause) restartGame();
  }
}

function texture_pause() {
  var geometry = new THREE.CubeGeometry(1, 1, 1);
  var cubeMaterials = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/stop.png"),
      side: THREE.DoubleSide,
    }),
  ];
  //var cubeMaterial = new THREE.MeshBasicMaterial(cubeMaterials);
  cubeCam = new THREE.Mesh(geometry, cubeMaterials);
  cubeCam.rotateY(Math.PI / 2);
  cubeCam.position.set(1.5, 0.75, -3);
  frontcam.add(cubeCam);
}

/*******************************************************************
 *
 *   OBJECTS
 *
 *******************************************************************/

function createSkyBox() {
  var geometry = new THREE.CubeGeometry(1000, 1000, 1000);
  var cubeMaterials = [
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/cubemap/px.png"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/cubemap/nx.png"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/cubemap/py.png"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/cubemap/ny.png"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/cubemap/pz.png"),
      side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load("js/cubemap/nz.png"),
      side: THREE.DoubleSide,
    }),
  ];
  //var cubeMaterial = new THREE.MeshBasicMaterial(cubeMaterials);
  var cube = new THREE.Mesh(geometry, cubeMaterials);
  scene.add(cube);
}

function createBoard(x, y, z) {
  board = new THREE.Object3D();
  geometry = new THREE.CubeGeometry(90, 1, 90);

  var boardTexture = loader.load("js/textura_relvado.jpg");

  boardTexture.wrapS = boardTexture.wrapT = THREE.RepeatWrapping;
  boardTexture.offset.set(0, 0);
  boardTexture.repeat.set(8, 8);

  materialBoard[0] = new THREE.MeshPhongMaterial({
    map: boardTexture,
    bumpMap: boardTexture,
    wireframe: false,
    color: 0xffffff,
    opacity: 1,
  });
  materialBoard[1] = new THREE.MeshBasicMaterial({
    map: boardTexture,
    wireframe: false,
    color: 0xffffff,
    opacity: 1,
  });

  /*materialBoard[0].wrapS = materialBoard[0].wrapT = THREE.RepeatWrapping;
	materialBoard[1].wrapS = materialBoard[1].wrapT = THREE.RepeatWrapping;
	
	materialBoard[0].repeat.set( 4, 4 );
	materialBoard[1].repeat.set( 4, 4 );*/

  meshBoard = new THREE.Mesh(geometry, materialBoard[0]);

  board.add(meshBoard);
  board.position.set(x, y, z);

  scene.add(board);
}

function createBall(x, y, z) {
  ball = new THREE.Object3D();

  // raio, heightsegment, withsegment
  geometry = new THREE.SphereGeometry(2, 16, 16);
  materialBall[0] = new THREE.MeshPhongMaterial({
    map: loader.load("js/textura_bola_golf.png"),
    bumMap: loader.load("js/textura_bola_golf.png"),
    wireframe: false,
    color: 0xffffff,
    specular: 0xffffff,
  });
  materialBall[1] = new THREE.MeshBasicMaterial({
    map: loader.load("js/textura_bola_golf.png"),
    wireframe: false,
    color: 0xffffff,
  });

  ball.position.set(x, y, z);

  meshBall = new THREE.Mesh(geometry, materialBall[0]);

  ball.add(meshBall);
  scene.add(ball);
}

function createBandeira(x, y, z) {
  bandeira = new THREE.Object3D();

  add_haste_bandeira(bandeira, -15, 5.5, 25);
  add_bandeira(bandeira, -15, 9.5, 25);

  scene.add(bandeira);
  bandeira.position.x = x;
  bandeira.position.y = y;
  bandeira.position.z = z;
}

function add_haste_bandeira(obj, x, y, z) {
  "use strict";

  geometry = new THREE.CylinderGeometry(1, 1, 10, 10);
  materialHasteBandeira[0] = new THREE.MeshPhongMaterial({
    color: 0x855e42,
    wireframe: false,
  });
  materialHasteBandeira[1] = new THREE.MeshBasicMaterial({
    color: 0x855e42,
    wireframe: false,
  });

  meshHasteBandeira = new THREE.Mesh(geometry, materialHasteBandeira[0]);
  obj.position.set(x, y, z);
  meshHasteBandeira.position.set(0, y, 0);
  obj.add(meshHasteBandeira);
}

function add_bandeira(obj, x, y, z) {
  "use strict";

  geometry = new THREE.CubeGeometry(6, 2, 0);
  materialBandeira[0] = new THREE.MeshPhongMaterial({
    color: 0xff3333,
    wireframe: false,
  });
  materialBandeira[1] = new THREE.MeshBasicMaterial({
    color: 0xff3333,
    wireframe: false,
  });
  meshBandeira = new THREE.Mesh(geometry, materialBandeira[0]);
  obj.position.set(x, y, z);
  meshBandeira.position.set(3, y, 0);
  obj.add(meshBandeira);
}

/*******************************************************************
 *
 *   LIGHT
 *
 *******************************************************************/

function createDirectionalLight() {
  "use strict";

  directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(100, 100, 100);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
}

function createPointLights() {
  "use strict";

  pointlight = new THREE.PointLight(0xff0000, 2, 200);
  pointlight.position.set(0, 6, 0);
  scene.add(pointlight);
}

function update_ilum() {
  "use strict";

  if (light_on == true) {
    directionalLight.intensity = 1;
  } else if (light_on == false) {
    directionalLight.intensity = 0.1;
  }
}

function ilumination() {
  if (!Flag) {
    meshBoard.material = materialBoard[1];
    meshBall.material = materialBall[1];
    meshHasteBandeira.material = materialHasteBandeira[1];
    meshBandeira.material = materialBandeira[1];
    meshBoard.material = materialBoard[1];

    Flag = true;
  } else {
    meshBoard.material = materialBoard[0];
    meshBall.material = materialBall[0];
    meshHasteBandeira.material = materialHasteBandeira[0];
    meshBandeira.material = materialBandeira[0];
    meshBoard.material = materialBoard[0];

    Flag = false;
  }
}

function update_movimento_bandeira() {
  var delta = clock.getDelta();
  bandeira.rotateY(-5 * delta);

  if (!pararBola) {
    position = velocity * delta;

    if (ball.position.y > 15 || ball.position.y < 0) {
      velocity = -velocity;
      if (ball.position.y > 15) ball.position.y = 14;
      else if (ball.position.y < 0) ball.position.y = 1;
    }

    var positionX = 5 * delta;
    if (
      ball.position.x > 45 ||
      ball.position.z > 45 ||
      ball.position.x < -45 ||
      ball.position.z < -45
    ) {
      velocity = 10;
      ball.position.set(0, 2.25, 0);
    }

    ball.translateX(positionX);
    ball.translateZ(positionX);
    ball.translateY(position);
  }
}

function restartGame() {
  light_on = true;
  pointlight_on = true;
  pointlight.intensity = 2;
  pararBola = false;
  Flag = true;

  frontcam.remove(cubeCam);
  board.position.set(0, 0, 0);
  ball.position.set(0, 2.25, 0);
  bandeira.position.set(-15, 0, 25);

  ilumination();
  clock.start();
  pause = false;
  frontcam.remove(cubeCam);
}
