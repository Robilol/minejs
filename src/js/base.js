// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import {TweenLite as TweenLine} from "gsap/TweenLite";
import '../js/water-material.js';

let camera, scene, renderer, hand, pointer, water, material, loader, texture, blocs, player, redSquarre, starField, starsGeometry, beginTimer, inHand, inHandMaterial;
var controls;
var raycaster = new THREE.Raycaster();
var pointCaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var actionBarNumber = 1;
var starFieldArray = [];
var beginTimerArray = [];

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
var quarryMaterials = [
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/quarry.jpg')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/quarry.jpg')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/quarry.jpg')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/quarry.jpg')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/quarry.jpg')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/quarry.jpg')
    })
];
var netherMaterials = [
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/nether.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/nether.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/nether.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/nether.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/nether.png')
    }),
    new THREE.MeshLambertMaterial({
        map: THREE.ImageUtils.loadTexture('images/nether.png')
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
        for(var z = 0; z < 30; z++){
            for (var y = 1; y < 10; y++)
            {
                var randPut = THREE.Math.randInt(0, 2);
                if (randPutInit)
                {
                    randPut = 0;
                    randPutInit = false;
                }
                if (randPut != 1)
                    break;
                if (randPut == 1) {
                    if (y == 1) {
                        var randMat = THREE.Math.randInt(1, 4);
                        if (randMat == 1) {
                            while (randPut == 1) {
                                randPut = THREE.Math.randInt(0, 2);
                                material = new THREE.MeshFaceMaterial(dirtMaterials);
                                var geometry = new THREE.CubeGeometry(2, 2, 2);
                                var mesh = new THREE.Mesh(geometry, material);
                                mesh.position.x -= x * 2;
                                mesh.position.z -= z * 2;
                                mesh.position.y += y * 2;
                                blocs.add(mesh);
                                y++;
                            }
                            material = new THREE.MeshFaceMaterial(grassMaterials);
                            var randPutInit = true;
                        }
                        if (randMat == 2)
                            material = new THREE.MeshFaceMaterial(dirtMaterials);
                        if (randMat == 3)
                            material = new THREE.MeshFaceMaterial(quarryMaterials);
                        if (randMat == 4)
                            material = new THREE.MeshFaceMaterial(netherMaterials);
                    }
                    var geometry = new THREE.CubeGeometry(2, 2, 2);
                    var mesh = new THREE.Mesh(geometry, material);
                    mesh.position.x -= x * 2;
                    mesh.position.z -= z * 2;
                    mesh.position.y += y * 2;

                    blocs.add(mesh);
                }
            }
            var geometry = new THREE.CubeGeometry(2, 2, 2);
            material = new THREE.MeshFaceMaterial(grassMaterials);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x -= x * 2;
            mesh.position.z -= z * 2;
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
    hand.updateMatrix();
    camera.add(hand);

    // inhand
    inHandMaterial = grassMaterials;

    // pointer
    var pointerGeo = new THREE.CircleGeometry(0.004, 128, 0, 6.3);
    var pointerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
    });
    pointer = new THREE.Mesh(pointerGeo, pointerMaterial);
    pointer.position.copy( camera.position );
    pointer.rotation.copy( camera.rotation );
    pointer.translateZ( - 1 );
    pointer.updateMatrix();
    camera.add(pointer);

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
    redSquarre.translateY( - 0.53 );
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
    suppline.translateY(- 0.48);
    suppline.updateMatrix();
    camera.add( suppline );

    // lignes verticales de la barre d'action
    for (var x= -0.5; x < 0.6; x = x + 0.1)
    {
        var linesMaterial = new THREE.LineBasicMaterial( { color: 0xffffff } );
        var linesGeometry = new THREE.Geometry();
        linesGeometry.vertices.push(new THREE.Vector3( 0, -0.6, 0) );
        linesGeometry.vertices.push(new THREE.Vector3( 0, -0.48, 0) );
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
    grassDirt.translateY(- 0.53);
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
    dirt.translateY(- 0.53);
    dirt.translateX(-0.35);
    dirt.updateMatrix();
    camera.add(dirt);

    // image quarry action bar
    var loaderQuarry = new THREE.TextureLoader();
    var quarryMaterial = new THREE.MeshBasicMaterial({
        map: loaderQuarry.load('../images/quarry.jpg')
    });
    var quarryGeo = new THREE.PlaneGeometry(0.099, 0.099);
    var quarry = new THREE.Mesh(quarryGeo, quarryMaterial);
    quarry.position.copy( camera.position );
    quarry.rotation.copy( camera.rotation );
    quarry.translateZ(- 1);
    quarry.translateY(- 0.53);
    quarry.translateX(- 0.25);
    quarry.updateMatrix();
    camera.add(quarry);

    // image nether action bar
    var loaderQuarry = new THREE.TextureLoader();
    var netherMaterial = new THREE.MeshBasicMaterial({
        map: loaderQuarry.load('../images/nether.png')
    });
    var netherGeo = new THREE.PlaneGeometry(0.099, 0.099);
    var nether = new THREE.Mesh(netherGeo, netherMaterial);
    nether.position.copy( camera.position );
    nether.rotation.copy( camera.rotation );
    nether.translateZ(- 1);
    nether.translateY(- 0.53);
    nether.translateX(- 0.15);
    nether.updateMatrix();
    camera.add(nether);


    var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
    directionalLight.position.set(-600, 300, 600);
    scene.add(directionalLight);

    var waterNormals = new THREE.TextureLoader().load('../images/water.jpg' );
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

     water = new THREE.Water( renderer, camera, scene, {
         textureWidth: 512,
         textureHeight: 512,
         waterNormals: waterNormals,
         alpha: 	1.0,
         sunDirection: directionalLight.position.normalize(),
         sunColor: 0xffffff,
         waterColor: 0xffffff,
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
    if (starFieldArray)
    {
        var i = 0;
        while (starFieldArray[i] != null) {
            var endTimer = beginTimerArray[i] + 0.40;
            starFieldArray[i].position.y -= 0.1;
            if (clock.elapsedTime > endTimer) {
                scene.remove(starFieldArray[i]);
            }
            i++;
        }
    }

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
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX( - 0.45 );
        inHandMaterial = grassMaterials;
        actionBarNumber = 1;
    }
    if (keys[50]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX( - 0.35 );
        inHandMaterial = dirtMaterials;
        actionBarNumber = 2;
    }
    if (keys[51]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX( - 0.25 );
        inHandMaterial = quarryMaterials;
        actionBarNumber = 3;
    }
    if (keys[52]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX( - 0.15 );
        inHandMaterial = netherMaterials;
        actionBarNumber = 4;
    }
    if (keys[53]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX( - 0.05 );
        actionBarNumber = 5;
    }
    if (keys[54]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX( 0.05 );
        actionBarNumber = 6;
    }
    if (keys[55]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX(  0.15 );
        actionBarNumber = 7;
    }
    if (keys[56]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX(  0.25 );
        actionBarNumber = 8;
    }
    if (keys[57]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX(  0.35 );
        actionBarNumber = 9;
    }
    if (keys[48]){
        redSquarre.position.copy( camera.position );
        redSquarre.rotation.copy( camera.rotation );
        redSquarre.translateZ( - 0.999999 );
        redSquarre.translateY( - 0.53 );
        redSquarre.translateX(  0.45 );
        actionBarNumber = 10;
    }
    if (inHand)
        camera.remove(inHand);

    if (actionBarNumber < 5) {
        var inHandGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        inHand = new THREE.Mesh(inHandGeo, inHandMaterial);
        inHand.position.copy(camera.position);
        inHand.rotation.copy(camera.rotation);
        inHand.translateZ(-5);
        inHand.translateY(-2);
        inHand.translateX(1.5);
        inHand.updateMatrix();
        camera.add(inHand);
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
            var textureBlock = intersects[0].object.material[3].map;
            blocs.remove(intersects[0].object);

            starsGeometry = new THREE.Geometry();
            for (var i = 0; i < 20; i ++ ) {

                var star = new THREE.Vector3();

                var randomX = THREE.Math.randFloatSpread( 1 );
                var randomY = THREE.Math.randFloatSpread( 2 );
                var randomZ = THREE.Math.randFloatSpread( 2 );
                star.y = randomY + intersects[0].object.position.y;
                star.x = randomX + intersects[0].object.position.x;
                star.z = randomZ + intersects[0].object.position.z;
                starsGeometry.vertices.push( star );
            }
            var starsMaterial = new THREE.PointsMaterial( { map: textureBlock, size: 0.3 } );
            starField = new THREE.Points( starsGeometry, starsMaterial );
            scene.add( starField );
            beginTimer = clock.elapsedTime;
            starFieldArray.push(starField);
            beginTimerArray.push(beginTimer);
        }


        if (e.which == 3) {
            var pos = intersects[0].object.position;

            var geometry = new THREE.CubeGeometry(2, 2, 2);
            if (actionBarNumber === 1)
                material = new THREE.MeshFaceMaterial(grassMaterials);
            if (actionBarNumber === 2)
                material = new THREE.MeshFaceMaterial(dirtMaterials);
            if (actionBarNumber === 3)
                material = new THREE.MeshFaceMaterial(quarryMaterials);
            if (actionBarNumber === 4)
                material = new THREE.MeshFaceMaterial(netherMaterials);
            var mesh = new THREE.Mesh(geometry, material);

            if (actionBarNumber > 4)
                return;

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