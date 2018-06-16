// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import {TweenLite as TweenLine} from "gsap/TweenLite";
import '../js/water-material.js';

let camera, scene, renderer, hand, pointer, water, material, loader, texture, blocs, player, redSquarre;
var controls;
var raycaster = new THREE.Raycaster();
var pointCaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var actionBarNumber = 1;

var grassMaterials = [
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/grass.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
    })
];
var dirtMaterials = [
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/dirt.png')
    })
];

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
    blocs = new THREE.Group();

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight);
    camera.position.z = 0;

    player = new THREE.Object3D();
    player.add(camera);
    scene.add( player );

    loader = new THREE.ImageLoader();



    //cubes floor
    for (var x = 0; x < 30; x++){
        for(var y = 0; y < 30; y++){
            var geometry = new THREE.CubeGeometry(2, 2, 2);
            material = new THREE.MeshFaceMaterial(grassMaterials);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x -= x * 2;
            mesh.position.z -= y * 2;
            mesh.position.y = 0;

            blocs.add(mesh);
        }
    }
    scene.add(blocs);

    // main du personnage
    var handGeo = new THREE.BoxGeometry(1, 2, 1);
    var handMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
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


    // carré rouge barre d'action
    var redSquareGeo = new THREE.BoxGeometry(0.1, 0.1, 0.000001);
    var redSquarreMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    redSquarre = new THREE.Mesh(redSquareGeo, redSquarreMaterial);
    redSquarre.position.copy( camera.position );
    redSquarre.rotation.copy( camera.rotation );
    redSquarre.translateZ( - 0.999999 );
    redSquarre.translateY( - 0.55 );
    redSquarre.translateX( - 0.45 );
    redSquarre.updateMatrix();
    camera.add( redSquarre );

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

    // image grass-dirt action bar
    var loaderGrassDirt = new THREE.TextureLoader();
    var grassDirtMaterial = new THREE.MeshBasicMaterial({
        map: loaderGrassDirt.load('../images/grass-dirt.png')
    });
    var grassDirtGeo = new THREE.PlaneGeometry(0.099, 0.099);
    var grassDirt = new THREE.Mesh(grassDirtGeo, grassDirtMaterial);
    grassDirt.position.copy( camera.position );
    grassDirt.rotation.copy( camera.rotation );
    grassDirt.translateZ(- 1);
    grassDirt.translateY(- 0.55);
    grassDirt.translateX(-0.45);
    grassDirt.updateMatrix();
    camera.add(grassDirt);

    // image dirt action bar
    var loaderDirt = new THREE.TextureLoader();
    var dirtMaterial = new THREE.MeshBasicMaterial({
        map: loaderDirt.load('../images/dirt.png')
    });
    var dirtGeo = new THREE.PlaneGeometry(0.099, 0.099);
    var dirt = new THREE.Mesh(dirtGeo, dirtMaterial);
    dirt.position.copy( camera.position );
    dirt.rotation.copy( camera.rotation );
    dirt.translateZ(- 1);
    dirt.translateY(- 0.55);
    dirt.translateX(-0.35);
    dirt.updateMatrix();
    camera.add(dirt);


    // display des éléments collé à la caméra
    pointer.updateMatrix();
    hand.updateMatrix();
    suppline.updateMatrix();
    camera.add(hand);
    camera.add(pointer);
    camera.add( suppline );





    var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
    directionalLight.position.set(-600, 300, 600);
    scene.add(directionalLight);


    var waterNormals = new THREE.TextureLoader().load('../images/water.png' );
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

     water = new THREE.Water( renderer, camera, scene, {
         textureWidth: 512,
         textureHeight: 512,
         waterNormals: waterNormals,
         alpha: 	1.0,
         sunDirection: directionalLight.position.normalize(),
         sunColor: 0xffffff,
         waterColor: 0x001e0f,
         distortionScale: 50.0
    } );

    var aMeshMirror = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(100000, 100000, 10, 10),
        water.material
    );
    aMeshMirror.add(water);
    aMeshMirror.rotation.x = - Math.PI * 0.5;
    scene.add(aMeshMirror);



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

    window.addEventListener("click", onClick);
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
    if (keys[49]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX( - 0.45 );
        actionBarNumber = 1;
    }
    if (keys[50]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX( - 0.35 );
        actionBarNumber = 2;
    }
    if (keys[51]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX( - 0.25 );
        actionBarNumber = 3;
    }
    if (keys[52]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX( - 0.15 );
        actionBarNumber = 4;
    }
    if (keys[53]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX( - 0.05 );
        actionBarNumber = 5;
    }
    if (keys[54]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX( 0.05 );
        actionBarNumber = 6;
    }
    if (keys[55]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX(  0.15 );
        actionBarNumber = 7;
    }
    if (keys[56]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX(  0.25 );
        actionBarNumber = 8;
    }
    if (keys[57]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.55 );
        redSquarre.translateX(  0.35 );
        actionBarNumber = 9;
    }

    water.material.uniforms.time.value += 1.0 / 40.0;

    renderer.render(scene, camera);
}


// window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

function onClick ( e ) {

    pointCaster.setFromCamera(new THREE.Vector2(), camera);
    var intersects = pointCaster.intersectObjects(blocs.children);


    if (intersects.length > 0 ) {
        if (e.which == 1) {
            blocs.remove(intersects[0].object);
        }


        if (e.which == 3) {
            var pos = intersects[0].object.position;



            var geometry = new THREE.CubeGeometry(2, 2, 2);
            if (actionBarNumber === 1)
                material = new THREE.MeshFaceMaterial(grassMaterials);
            if (actionBarNumber === 2)
                material = new THREE.MeshFaceMaterial(dirtMaterials);
            var mesh = new THREE.Mesh(geometry, material);


            switch (intersects[0].faceIndex) {
                case 0:
                    mesh.position.x = pos.x + 2;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y;
                    break;
                case 1:
                    mesh.position.x = pos.x + 2;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y;
                    break;
                case 2:
                    mesh.position.x = pos.x - 2;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y;
                    break;
                case 3:
                    mesh.position.x = pos.x - 2;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y;
                    break;
                case 4:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y + 2;
                    break;
                case 5:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y + 2;
                    break;
                case 6:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y - 2;
                    break;
                case 7:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z;
                    mesh.position.y = pos.y - 2;
                    break;
                case 8:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z + 2;
                    mesh.position.y = pos.y;
                    break;
                case 9:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z + 2;
                    mesh.position.y = pos.y;
                    break;
                case 10:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z - 2;
                    mesh.position.y = pos.y;
                    break;
                case 11:
                    mesh.position.x = pos.x;
                    mesh.position.z = pos.z - 2;
                    mesh.position.y = pos.y;
                    break;
            }

            blocs.add(mesh);

        }
    }
}


init();
animate();
window.addEventListener('mousemove', onMouseMove, false);