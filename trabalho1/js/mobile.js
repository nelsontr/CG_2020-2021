/*******************************************************************
* Trabalho Laboratorial de CG #1
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

var scene, renderer;
var cameraIndex = 1;

var geometry, material, mesh;
var frontcam, topcam, latcam;
var moveForward, moveBackward, moveLeft, moveRight;
var rotateQ, rotateW, rotateA, rotateD, rotateZ, rotateC;
var escultura_tres_andar, escultura_um_andar, escultura_dois_andar;

var aspect = window.innerWidth / window.innerHeight;
var size = 150;


var velocity = 1;
var position = 0;

var clock;



function init() {


    'use strict';
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
   
    clock = new THREE.Clock(true);

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    createScene();
    createFrontCamera();
    createTopCamera();
    createLatCamera();

    render();
    
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", keyNotPressed);
}

function animate() {
    'use strict';
    
    requestAnimationFrame(animate);
    update_movimento_escultura();
    render();
}


function render() {
    'use strict';
    renderer.render(scene, frontcam);

    if (cameraIndex == 1) { renderer.render(scene, frontcam); }
    else if (cameraIndex == 2) { renderer.render(scene, topcam); }
    else if (cameraIndex == 3) { renderer.render(scene, latcam) }

}




/*******************************************************************
*
*   SCENE 
*
*******************************************************************/
/**/


function createScene() {
    'use strict';
    
    scene = new THREE.Scene(); 

    scene.add(new THREE.AxisHelper(10));
    
    mobile_escultura_um_andar(0, 0, 0);
    mobile_escultura_dois_andar(0, 0, 0);
    mobile_escultura_tres_andar(0, 0, 0);
    
}

/*******************************************************************
*
* CAMERA
*
*******************************************************************/

/**/


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

function createLatCamera() {
    'use strict';
    latcam = new THREE.OrthographicCamera(-100 , 100 , 0, -200, 400, 600);
    latcam.position.x = 500;
    latcam.lookAt(scene.position);
    scene.add(latcam);
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

    
    if(e.keyCode == 37) { // Left
        moveLeft = true;
    }
    else if(e.keyCode == 38) { // Up
        moveForward = true;
    }
    else if(e.keyCode == 39) { // Right
        moveRight = true;
    }
    else if(e.keyCode == 40) { // Down
        moveBackward = true;
    }


    /* Camera Controls */
    else if(e.keyCode == 49) { // keyCode tecla 1
        cameraIndex = 1;
    }
    else if(e.keyCode == 50) { // keyCode tecla 2
        cameraIndex = 2;
    }
    else if(e.keyCode == 51) { // keyCode tecla 3
        cameraIndex = 3;
    }


    /* Wireframe View */
    else if (e.keyCode == 52) { // keyCode tecla 4
        material.wireframe = !material.wireframe;
    }

    else if(e.keyCode == 81) { // keyCode tecla q ou Q
        rotateQ = true;
    }
    else if(e.keyCode == 87) { // keyCode tecla w ou W
        rotateW = true;
    }
    else if(e.keyCode == 65) { // keyCode tecla a ou A
        rotateA = true;
    }
    else if(e.keyCode == 68) { // keyCode tecla d ou D
        rotateD = true;
    }
    else if(e.keyCode == 90) { // keyCode tecla z ou Z
        rotateZ = true;
    }
    else if(e.keyCode == 67) { // keyCode tecla c ou C
        rotateC = true;
    }

}


function keyNotPressed(e) {
    'use strict';

    if(e.keyCode == 37) { // Left
        moveLeft = false;
    }
    else if(e.keyCode == 38) { // Up
        moveForward = false;
    }
    else if(e.keyCode == 39) { // Right
        moveRight = false;
    }
    else if(e.keyCode == 40) { // Down
        moveBackward = false;
    }

    else if(e.keyCode == 81) { // keyCode tecla q ou Q 
        rotateQ = false;
    }
    else if(e.keyCode == 87) { // keyCode tecla w ou W
        rotateW = false;
    }
    else if(e.keyCode == 65) { // keyCode tecla a ou A
        rotateA = false;
    }
    else if(e.keyCode == 68) { // keyCode tecla d ou D
        rotateD = false;
    }
    else if(e.keyCode == 90) { // keyCode tecla z ou Z
        rotateZ = false;
    }
    else if(e.keyCode == 67) { // keyCode tecla c ou C
        rotateC = false;
    }
}
/*******************************************************************
*
* UPDATE ESCULTURA
*
*******************************************************************/

/**/

function update_movimento_escultura(){
    'use strict';


    var delta = clock.getDelta();

    velocity = 50;
    position = velocity * delta;
    
    /* Movimento forward, backward, left and right*/
    if(moveForward == true) {
       
        escultura_um_andar.translateZ(-position);
        
        if(moveLeft == true) {
            escultura_um_andar.translateX(-position);
        }
        else if(moveRight == true) {
            escultura_um_andar.translateX(position);
        }
        else if(moveBackward == true) {
            escultura_um_andar.translateZ(position);
        }
    }
    
    else if(moveBackward == true) {

        escultura_um_andar.translateZ(position);
        

        if(moveLeft == true) {
            escultura_um_andar.translateX(-position);
        }
        else if(moveRight == true) {
            escultura_um_andar.translateX(position);
        }
        else if(moveForward == true) {
            escultura_um_andar.translateZ(-position);
        }
    }

    else if(moveRight == true) {

        escultura_um_andar.translateX(position);

        if(moveLeft == true) {
            escultura_um_andar.translateX(-position);
        }
        else if(moveForward == true) {
            escultura_um_andar.translateZ(-position);
        }
        else if(moveBackward == true) {
            escultura_um_andar.translateZ(position);
        }
    }
    
    else if(moveLeft == true) {

        escultura_um_andar.translateX(-position);

        if(moveForward == true) {
            escultura_um_andar.translateZ(-position);
        }
        else if(moveRight == true) {
            escultura_um_andar.translateX(position);
        }
        else if(moveBackward == true) {
            escultura_um_andar.translateZ(position);
        }   
    }

    
    /* Movimento rotate*/
    else if(rotateQ == true) { // keyCode tecla q ou Q
        escultura_um_andar.rotateY(-5 * delta);

    }
    else if(rotateW == true) { // keyCode tecla w ou W
        escultura_um_andar.rotateY(5 * delta);
        
    }
    else if(rotateA == true) { // keyCode tecla a ou A
        escultura_dois_andar.rotateY(5 * delta);
         
    }
    else if(rotateD == true) { // keyCode tecla d ou D
        escultura_dois_andar.rotateY(-5 * delta);
        
    }
    else if(rotateZ == true) { // keyCode tecla z ou Z
        escultura_tres_andar.rotateY(5 * delta);
    }
    else if(rotateC == true) { // keyCode tecla c ou C
        escultura_tres_andar.rotateY(-5 * delta);
    }

}




/*******************************************************************
*
* OBJECTS SCENE
*
*******************************************************************/

/**/



function add_cilindro_circulares_reto_achatado(obj, x, y, z) {
    'use strict';

    /*scale , CylinderGeometry(radiustop, radiusbottom, height, radialsegments, heightsegments, openended, thetastart, thetalenght)****/
    geometry = new THREE.CylinderGeometry( 4, 4, 1, 10);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    mesh.rotateX(Math.PI / 2);
    obj.add(mesh);
}


function add_paralelepipedo_achatado(obj, x, y, z) {
    'use strict';
    /* (width, height, depth)*/
    geometry = new THREE.CubeGeometry(2, 7, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    obj.add(mesh);
}

function add_hastes_vertical(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry( 1, 1, 10, 10);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    obj.add(mesh);
 
}

function add_hastes_horizontal(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CylinderGeometry( 1, 1, 10, 10);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y , z);
    mesh.rotateZ(Math.PI / 2);
    obj.add(mesh);
 
}



function mobile_escultura_um_andar(x, y, z) {
    'use strict';

    escultura_um_andar = new THREE.Object3D();
   
    add_hastes_vertical(escultura_um_andar, 0, -5, 0);
    add_hastes_vertical(escultura_um_andar, 1, -17, 0);

    add_hastes_horizontal(escultura_um_andar, -2.5, -11, 0);
    add_hastes_horizontal(escultura_um_andar, -1.5, -23, 0);

    add_cilindro_circulares_reto_achatado(escultura_um_andar, -11.5, -11, 0);
    add_cilindro_circulares_reto_achatado(escultura_um_andar, -10.5, -23, 0);

    add_paralelepipedo_achatado(escultura_um_andar, 3.5, -11, 0);

    scene.add(escultura_um_andar);
    escultura_um_andar.position.x = x;
    escultura_um_andar.position.y = y;
    escultura_um_andar.position.z = z;

}

function mobile_escultura_dois_andar(x, y, z) {
    'use strict';

    escultura_dois_andar = new THREE.Object3D();

    add_hastes_vertical(escultura_dois_andar, 2, -29, 0);
    add_hastes_vertical(escultura_dois_andar, 7, -40,0);
    add_hastes_vertical(escultura_dois_andar, 7, -52,0);

    add_hastes_horizontal(escultura_dois_andar, 11,-34, 0);
    add_hastes_horizontal(escultura_dois_andar, 1, -35, 0);
    add_hastes_horizontal(escultura_dois_andar, 3, -46, 0);
    add_hastes_horizontal(escultura_dois_andar, 13, -46, 0);
    add_hastes_horizontal(escultura_dois_andar, 3, -58, 0);
    add_hastes_horizontal(escultura_dois_andar, 13, -58, 0);

    add_cilindro_circulares_reto_achatado(escultura_dois_andar, 20, -34, 0);
    add_cilindro_circulares_reto_achatado(escultura_dois_andar, 22, -46, 0);
    add_cilindro_circulares_reto_achatado(escultura_dois_andar, -6, -58, 0);

    add_paralelepipedo_achatado(escultura_dois_andar, -5, -35, 0);
    add_paralelepipedo_achatado(escultura_dois_andar, -3, -46, 0);
    add_paralelepipedo_achatado(escultura_dois_andar, 19, -58, 0);

    escultura_um_andar.add(escultura_dois_andar);
    escultura_dois_andar.position.x = x;
    escultura_dois_andar.position.y = y;
    escultura_dois_andar.position.z = z;

}

function mobile_escultura_tres_andar(x, y, z) {
    'use strict';

    escultura_tres_andar = new THREE.Object3D();
 
    add_hastes_vertical(escultura_tres_andar, 12, -64,0);
    add_hastes_vertical(escultura_tres_andar, 30, -70,0);
    add_hastes_vertical(escultura_tres_andar, 2, -76,0);
    add_hastes_vertical(escultura_tres_andar, 16, -76,0);

    add_hastes_horizontal(escultura_tres_andar, 4, -70, 0);
    add_hastes_horizontal(escultura_tres_andar,14, -70, 0);
    add_hastes_horizontal(escultura_tres_andar, 24, -70, 0);

    add_cilindro_circulares_reto_achatado(escultura_tres_andar, 30, -61, 0);
    add_cilindro_circulares_reto_achatado(escultura_tres_andar, 30, -79, 0);
    add_cilindro_circulares_reto_achatado(escultura_tres_andar, 2, -85, 0);
    add_cilindro_circulares_reto_achatado(escultura_tres_andar, 16, -85, 0);

    add_paralelepipedo_achatado(escultura_tres_andar, -2, -70, 0);

    escultura_dois_andar.add(escultura_tres_andar);
    escultura_tres_andar.position.x = x;
    escultura_tres_andar.position.y = y;
    escultura_tres_andar.position.z = z;

}