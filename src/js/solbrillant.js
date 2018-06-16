// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import {TweenLite as TweenLine} from "gsap/TweenLite";

let camera, scene, renderer, geometry, material, material2, meshParent, meshChild, mesh, hand, pointer;
var controls;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseMove(e){
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 + 1;
}

var keys = [];
document.onkeydown = function (e) {
    e=e|| window.event;
    keys[e.keyCode] = true;
};
document.onkeyup = function (e) {
    e=e|| window.event;
    keys[e.keyCode] = false;
};



function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
    camera.position.z = 0;


    var materials = [
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/dirt.png')
        })
    ];
    var texture = THREE.ImageUtils.loadTexture('../images/grass.png');
    //cubes floor
    for (var x = 0; x < 30; x++){
        for(var y = 0; y < 30; y++){
            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var material = new THREE.MeshBasicMaterial({

                map: THREE.ImageUtils.loadTexture('images/grass.png'),
                map: THREE.ImageUtils.loadTexture('images/grass.png'),
                map: THREE.ImageUtils.loadTexture('images/grass.png'),
                map: THREE.ImageUtils.loadTexture('images/grass.png'),
                map: THREE.ImageUtils.loadTexture('images/grass.png'),
                map: THREE.ImageUtils.loadTexture('images/dirt.png'),
            });
            /*var material = new THREE.MeshBasicMaterial({
                map: texture
                //color: Math.floor(Math.random() * 16777215)
            });*/
            var mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2, 2, 2, 2), materials);
            mesh.position.x -= x * 2;
            mesh.position.z -= y * 2;
            mesh.position.y = 2;

            scene.add(mesh);
        }
    }




    // main du personnage
    var handGeo = new THREE.BoxGeometry(1, 2, 1);
    var handMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    hand = new THREE.Mesh(handGeo, handMaterial);
    hand.position.copy( camera.position );
    hand.rotation.copy( camera.rotation );
    hand.translateZ( - 5 );
    hand.translateY( - 2.5 );
    hand.translateX( 1.5 );



    // pointer
    var pointerGeo = new THREE.CircleGeometry(0.004, 128, 0, 6.3);
    var pointerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    pointer = new THREE.Mesh(pointerGeo, pointerMaterial);
    pointer.position.copy( camera.position );
    pointer.rotation.copy( camera.rotation );
    pointer.translateZ( - 1 );


    // ligne supérieur de la barre d'action
    var suppLineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
    var suppLineGeometry = new THREE.Geometry();
    suppLineGeometry.vertices.push(new THREE.Vector3( -0.5, 0, 0) );
    suppLineGeometry.vertices.push(new THREE.Vector3( 0.5, 0, 0) );
    var suppline = new THREE.Line( suppLineGeometry, suppLineMaterial );
    suppline.position.copy( camera.position );
    suppline.rotation.copy( camera.rotation );
    suppline.translateZ(- 1);
    suppline.translateY(- 0.5);

    // lignes verticales de la barre d'action
    for (var x= -0.5; x < 0.6; x = x + 0.1)
    {
        var linesMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
        var linesGeometry = new THREE.Geometry();
        linesGeometry.vertices.push(new THREE.Vector3( 0, -0.6, 0) );
        linesGeometry.vertices.push(new THREE.Vector3( 0, -0.5, 0) );
        var lines = new THREE.Line( linesGeometry, linesMaterial );
        lines.position.copy( camera.position );
        lines.rotation.copy( camera.rotation );
        lines.translateZ(- 1);
        lines.translateX(- x);

        lines.updateMatrix();
        camera.add( lines );
    }

    // image pickaexe
    var loader = new THREE.TextureLoader();
    var pickaxeMaterial = new THREE.MeshBasicMaterial({
        map: loader.load('../images/grass.png')
    });
    var pickaxeGeo = new THREE.PlaneGeometry(0.099, 0.099);
    var pickaxe = new THREE.Mesh(pickaxeGeo, pickaxeMaterial);
    pickaxe.position.copy( camera.position );
    pickaxe.rotation.copy( camera.rotation );
    pickaxe.translateZ(- 1);
    pickaxe.translateY(- 0.55);
    pickaxe.translateX(-0.45);
    pickaxe.updateMatrix();
    camera.add(pickaxe);


    // display des éléments collé à la caméra
    pointer.updateMatrix();
    hand.updateMatrix();
    suppline.updateMatrix();
    camera.add(hand);
    camera.add(pointer);
    camera.add( suppline );



    var data = { x: 0};
    var myTween = TweenLine.to(
        data,
            2,
        {
            x: 100,
            ease: Circ.easeInOut,
            delay: 1,
            onComplete: function () {
                console.log("mytween complete");
            }
        }
    );
    myTween.kill();

    // 2cube moving together
    //
    /*geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    material2 = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });

    meshParent = new THREE.Mesh(geometry, material);
    meshChild = new THREE.Mesh(geometry, material2);
    meshChild.position.x = 300;
    scene.add(meshParent);
    meshParent.add(meshChild);
    */


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

//mouse view control
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // pointer lock
    var element = document.body;
    var pointerlockchange = function (event) {
        if(document.pointerLockElement == element){
            controls.enabled = true;
        } else {
            controls.enabled = false;
        }
    };
    var pointerlockerror = function(event) {};


    // hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('pointerlockerror', pointerlockerror, false);
    var element = document.body;

    element.addEventListener('click', function () {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
    }, false);
}

const clock = new THREE.Clock();


function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    var speed = 10;
    //   mesh.rotation.x += 0.5 * delta;
//    mesh.rotation.y += 0.7 * delta;
    // left
    if (keys[37]) {
        controls.getObject().translateX(-delta * speed);
    }
    if (keys[39]) {
        controls.getObject().translateX(delta * speed);
    }
    if (keys[38]) {
        controls.getObject().translateZ(-delta * speed);
    }
    if (keys[40]) {
        controls.getObject().translateZ(delta * speed);
    }

    raycaster.setFromCamera(new THREE.Vector2(), camera);
    var intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++)
    {
        intersects[i].object.material.color.set(0x00ff00);
    }

    renderer.render(scene, camera);
}


// window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);


init();
animate();
window.addEventListener('mousemove', onMouseMove, false);













/*

document.onkeydown = function (e) {
    e = e || window.event;

    switch (e.keyCode) {
        case 32:
            switchCamera();
            break;

        case 90:
            meshParent.rotation.x -= 0.02;
            return;
        case 81:
            meshParent.rotation.y -= 0.02;
            return;
        case 83:
            meshParent.rotation.x += 0.02;
            return;
        case 68:
            meshParent.rotation.y += 0.02;
            return;


        // left
        case 37:
            //meshParent.rotation.y -= 0.02;
            camera.rotation.y -= 0.02;
            controls.getObject().translateX(-delta * speed);
            return;
        // right
        case 39:
            //meshParent.rotation.y += 0.02;
            //camera.rotation.y += 0.02;
            controls.getObject().translateX(delta * speed);
            return;
        // top
        case 38:
            //meshParent.rotation.x -= 0.02;
            //camera.rotation.x -= 0.02;
            controls.getObject().translateZ(-delta * speed);
            return;
        // down
        case 40:
            //meshParent.rotation.x += 0.02;
            //camera.rotation.x += 0.02;
            controls.getObject().translateZ(delta * speed);
            return;
    }
};*/
