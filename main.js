import * as THREE from './three.js-master/build/three.module.js'
import {OrbitControls}  from './three.js-master/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader}  from './three.js-master/examples/jsm/loaders/GLTFLoader.js'

let w = window.innerWidth;
let h = window.innerHeight;
let aspect = w/h;

let scene = new THREE.Scene();
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.setClearColor(0xadd8e6);
renderer.shadowMap.enabled = true;

//Loader
let textureLoader = new THREE.TextureLoader();
let modelLoader = new GLTFLoader();

//Perspective Cam
var persCam = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
persCam.position.set(10, 10, 10);

let persCam2 = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
persCam2.position.set(0, 1, 10);
// persCam2.lookAt(2, 2, 2);

let persCam3 = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
persCam3.position.set(-10, 2, -10);
persCam3.lookAt(2, 2, 2);

let activeCamera = persCam;
let control = new OrbitControls(activeCamera, renderer.domElement);

//Geometric

//Basic Material
let woodTexture = textureLoader.load('./assets/texture/cottage.jpg');
let boxMat = new THREE.MeshBasicMaterial({map: woodTexture});
//Box
let boxGeo = new THREE.BoxGeometry(1.2, 1, 1.1);
let box = new THREE.Mesh( boxGeo, boxMat );
box.position.set(0, 0.55, 0);
box.castShadow = true;
scene.add( box );

//Phong Material
let coneMat = new THREE.MeshPhongMaterial({color: 'darkred', shininess: 100, specular: 0xFFFFFF});
//Cone
let coneGeo = new THREE.ConeGeometry(0.8, 1, 20);
let cone = new THREE.Mesh(coneGeo, coneMat);
cone.position.set(0, 1.55, 0);
cone.castShadow = true;
scene.add(cone);

//Lambert Material
let planeTex = textureLoader.load('./assets/texture/grass.jpg');
let planeGeo = new THREE.PlaneGeometry(20, 20);
let planeMat = new THREE.MeshLambertMaterial({map: planeTex, side: THREE.DoubleSide});
//Plane
let plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
plane.rotation.x = Math.PI / 2;
scene.add(plane);

//Basic Material
let bricksTexture = textureLoader.load('./assets/texture/bricks.jpg');
let cyMat = new THREE.MeshBasicMaterial({map: bricksTexture});
//Cylinder
const cyGeo = new THREE.CylinderGeometry(0.5, 0.5, 3);
const cylinder = new THREE.Mesh( cyGeo, cyMat );
cylinder.position.set(-4, 1.55, -5);
scene.add( cylinder );

//Basic Material
let roof2Texture = textureLoader.load('./assets/texture/rooff.jpg');
let latheMat = new THREE.MeshBasicMaterial({map: roof2Texture});
//Lathe
const points = [];
for ( let i = 0; i < 10; i ++ ) {
	points.push( new THREE.Vector2( Math.sin( i * 0.2 ) / 2, ( i - 5 )/4));
}
let latheGeo = new THREE.LatheGeometry( points );
let lathe = new THREE.Mesh( latheGeo, latheMat );
lathe.rotation.x = 180* Math.PI / 180;
lathe.position.set(-4, 4, -5);
scene.add( lathe );

// //Sphere
let sphereGeo = new THREE.SphereGeometry(0.4, 20, 20);
//Lambert Material
let sphereMat = new THREE.MeshLambertMaterial({color: 'yellow'});
let sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(2, 4, 0);
sphere.name = 'matahari';
sphere.castShadow = true;
scene.add(sphere);

//Torus
let torusGeo = new THREE.TorusGeometry(0.6, 0.1, 5, 80);
let torusMat = new THREE.MeshLambertMaterial({color: 'red'});
let torus = new THREE.Mesh(torusGeo, torusMat);
torus.position.set(2, 4, 0);
torus.rotation.x = 1.6;
torus.name = 'torus'
scene.add(torus);

//Text
let fontLoader = new THREE.FontLoader();
fontLoader.load('./three.js-master/examples/fonts/helvetiker_bold.typeface.json',(font)=>{
    let textGeo = new THREE.TextGeometry("LC037 ",{
        font: font,
        size: 0.5,
        height: 0.25,
        color: 'black'
    });
    //Normal Material
    let textMat = new THREE.MeshNormalMaterial();
    var text = new THREE.Mesh(textGeo, textMat);
    text.position.set(2, 0, 4);
    text.castShadow = true;
    text.name = 'text';
    scene.add(text);
});

//LIGHT

//Point Light
let pointLight = new THREE.PointLight(0xffffff, 2, 1000);
pointLight.position.set(4, 5, 0);
pointLight.castShadow = true;

let lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);
scene.add(pointLight);

//Spotlight
let spotLight = new THREE.SpotLight(0xffffff, 1.5, 20, Math.PI / 32)
spotLight.position.set(-5, 5, 5);
spotLight.castShadow = true;

let helper = new THREE.SpotLightHelper(spotLight);
// scene.add(helper);

spotLight.target = box;
scene.add(spotLight);

let spotLight1 = new THREE.SpotLight(0xffffff, 1.5, 20, Math.PI / 32)
spotLight1.position.set(5, 5, 5);

let helper1 = new THREE.SpotLightHelper(spotLight1);
// scene.add(helper1);
scene.add(spotLight1);

//Directinal Light
let dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(-5, 6, -6);

let dirLightHelper = new THREE.DirectionalLightHelper(dirLight);
// scene.add(dirLightHelper);

//Model
modelLoader.load('./assets/model/model.gltf', (e)=>{
    var model = e.scene
    model.name = 'model'
    model.scale.set(0.05, 0.05, 0.05)
    model.position.set(1, 0, 1);
    model.rotation.y = -1;
    scene.add(model)
})


//Sky box
let skyTex = [
    new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/skybox/back.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/skybox/front.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/skybox/top.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/skybox/bottom.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/skybox/left.png"), side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: textureLoader.load("./assets/skybox/right.png"), side: THREE.DoubleSide}),
]

let skyGeo = new THREE.BoxGeometry(1000, 1000, 1000);
let skybox = new THREE.Mesh( skyGeo, skyTex);
scene.add(skybox);

//Raycast

const raycast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let animation = true;

function onclick(event) {
    mouse.x = (event.clientX/w) * 2 - 1;
    mouse.y = -(event.clientY/h) * 2 + 1;
    
    raycast.setFromCamera(mouse, persCam);

    const intersects = raycast.intersectObjects(scene.children);
    for(let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.name == 'matahari') {   
            animation = !animation;
        }else if(intersects[i].object.name == 'torus'){
            if(intersects[i].object.scale.x == 1){
                intersects[i].object.scale.x = 2;
                intersects[i].object.scale.y = 2;
                intersects[i].object.scale.z = 2;
            }else{
                intersects[i].object.scale.x = 1;
                intersects[i].object.scale.y = 1;
                intersects[i].object.scale.z = 1;
            }
        }

    }
}


//key event
function ontype(event) {
    var keyCode = event.which;
    if (keyCode == 32) {
        if (activeCamera == persCam) {
            activeCamera = persCam2;
            control.object = persCam2;
        } else if (activeCamera == persCam2) {
            activeCamera = persCam3;
            control.object = persCam3;
        } else if (activeCamera == persCam3) {
            activeCamera = persCam;
            control.object = persCam;
        }
    }
};

window.addEventListener("keypress", ontype);
window.addEventListener("pointerdown", onclick);

function animate(){
    if(animation){   
        sphere.position.x += 0.001;
        sphere.position.y += 0.001;
        sphere.position.z += 0.001;

        torus.position.x += 0.001;
        torus.position.y += 0.001;
        torus.position.z += 0.001;

        torus.rotation.x += 0.05;
        torus.rotation.y += 0.05;
        torus.rotation.z += 0.05;

        if(sphere.position.z >= 1.5){
            sphere.position.set(2, 4, 0);
            torus.position.set(2, 4, 0);
        }

    }
    renderer.render(scene, activeCamera);
    requestAnimationFrame(animate);
}
animate();


document.body.appendChild(renderer.domElement)