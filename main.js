import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

// ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add (ambientLight);

// directional light 
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);


// point light 
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 2, 0);
pointLight.castShadow.true;
scene.add(pointLight);


// Add OrbitControls to enable user interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth controls
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0); // Orbit around the center

// Create a large sphere for the panorama
const textureLoader = new THREE.TextureLoader();
textureLoader.load('/360.jpg', (texture) => {
    const sphereGeometry = new THREE.SphereGeometry(100, 64, 64); // Large sphere
    const sphereMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide, // Flip the normals to make the texture visible from the inside
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere); // Add the sphere to the scene
});

// Load the 3D model

const gltfLoader = new GLTFLoader();
gltfLoader.load('/shoes/shoe.gltf', (gltf) => {
    const root = gltf.scene;
    scene.add(root); // Add the 3D model to the scene
});






camera.position.z = 0.5;



function animate() {

	

	renderer.render( scene, camera );

}