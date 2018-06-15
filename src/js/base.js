// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import {TweenLite as TweenLine} from "gsap/TweenLite";
import '../js/water-material.js';

let camera, scene, renderer, hand, pointer, water, material, loader, texture;
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

    loader = new THREE.ImageLoader();

    texture = new THREE.TextureLoader().load( '../images/atlas.png' );
    material = new THREE.MeshStandardMaterial( { map: texture } );

    //cubes floor
    for (var x = 0; x < 30; x++){
        for(var y = 0; y < 30; y++){
            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x -= x * 2;
            mesh.position.z -= y * 2;
            mesh.position.y = 0;

            scene.add(mesh);
        }
    }
    var handGeo = new THREE.BoxGeometry(1, 1, 1);
    var handMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    hand = new THREE.Mesh(handGeo, handMaterial);
    hand.position.copy( camera.position );
    hand.rotation.copy( camera.rotation );
    hand.updateMatrix();
    hand.translateZ( - 5 );
    hand.translateY( - 2.5 );
    hand.translateX( 1.5 );
    camera.add(hand);


    var pointerGeo = new THREE.CircleGeometry(0.0004, 128, 0, 6.3);
    var pointerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    pointer = new THREE.Mesh(pointerGeo, pointerMaterial);
    pointer.position.copy( camera.position );
    pointer.rotation.copy( camera.rotation );
    pointer.updateMatrix();
    pointer.translateZ(-0.1);
    camera.add(pointer);


    var waterNormals = new THREE.ImageUtils.loadTexture( '../images/water.png' );
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

     water = new THREE.Water( renderer, camera, scene, {
        waterNormals: waterNormals,
        waterColor: 0x1F4F4F,
    } );

    var mirrorMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(100000, 100000 ),
        water.material
    );

    mirrorMesh.add( water );
    mirrorMesh.rotation.x = - Math.PI * 0.5;
    mirrorMesh.position.y = 0;
    scene.add( mirrorMesh );

    var cubeMap = new THREE.CubeTexture( [] );
    cubeMap.format = THREE.RGBFormat;

    loader.load( '../images/skybox.png', function ( image ) {

        var getSide = function ( x, y ) {

            var size = 1024;

            var canvas = document.createElement( 'canvas' );
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext( '2d' );
            context.drawImage( image, - x * size, - y * size );

            return canvas;

        };

        cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
        cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
        cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
        cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
        cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
        cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
        cubeMap.needsUpdate = true;

    } );

    var cubeShader = THREE.ShaderLib[ 'cube' ];
    cubeShader.uniforms[ 'tCube' ].value = cubeMap;

    var skyBoxMaterial = new THREE.ShaderMaterial( {
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    } );

    var skyBox = new THREE.Mesh(
        new THREE.BoxGeometry( 100000, 100000, 100000 ),
        skyBoxMaterial
    );

    scene.add( skyBox );

    skyBox.position.y= -10;
    skyBox.position.z= -10;

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
    hemiLight.position.set( 15, 500, 15 );
    scene.add( hemiLight );

    var sun = new THREE.SphereGeometry(10, 32, 32, 0, 7, 0, 7);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    mesh = new THREE.Mesh(sun, material);
    mesh.position.set( 15, 500, 15 );

    scene.add(mesh);


    var sun = new THREE.SphereGeometry(1, 32, 32, 0, 7, 0, 7);
    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    mesh = new THREE.Mesh(sun, material);
    mesh.position.set( -1, 1, 1 );

    scene.add(mesh);


    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.position.set( -1, 1, 1 );
    dirLight.position.multiplyScalar( 50);
    dirLight.name = "dirlight";

    scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

    var d = 300;

    dirLight.shadowCameraLeft = -d;
    dirLight.shadowCameraRight = d;
    dirLight.shadowCameraTop = d;
    dirLight.shadowCameraBottom = -d;

    dirLight.shadowCameraFar = 3500;
    dirLight.shadowBias = -0.0001;
    dirLight.shadowDarkness = 0.35;




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
    if (keys[16]) {
        controls.getObject().translateY(delta * speed);
    }
    if (keys[17]) {
        controls.getObject().translateY(-delta * speed);
    }

    raycaster.setFromCamera(new THREE.Vector2(), camera);
    var intersects = raycaster.intersectObjects(scene.children);

    water.material.uniforms.time.value += 1.0 / 40.0;

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