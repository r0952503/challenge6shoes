import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui'



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );



const renderer = new THREE.WebGLRenderer();
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth - 200, window.innerHeight);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth - 300, window.innerHeight);
    camera.aspect = (window.innerWidth - 300) / window.innerHeight;
    camera.updateProjectionMatrix();
});
// Load environment map
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
    '/Standardd-Cube-Map/nx.png',
    '/Standardd-Cube-Map/px.png',
    '/Standardd-Cube-Map/ny.png',
    '/Standardd-Cube-Map/py.png',
    '/Standardd-Cube-Map/nz.png',
    '/Standardd-Cube-Map/pz.png',
   
]);

scene.background = environmentMap;
scene.environment = environmentMap;


//dat gui
const gui = new dat.GUI();




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


let selectedPart = null; // Variable to store the selected part

gltfLoader.load(
  '/shoes/shoe.gltf',
  (gltf) => {
    const root = gltf.scene;

    // Traverse the model and log each part
    root.traverse((child) => {
      console.log(child.name);

      // Store shoe parts
      if (child.isMesh) {
        child.userData.originalMaterial = child.material; // Store original material
      }
    });

    scene.add(root);
  },
  undefined,
  (error) => {
    console.error('An error occurred while loading the GLTF model:', error);
  }
);





camera.position.z = 0.5;



function animate() {

	
  controls.update(); // Update controls
	renderer.render( scene, camera );

}


// Add event listeners to part list
document.querySelectorAll('#part-list li').forEach(item => {
  item.addEventListener('click', (event) => {
      // Remove 'selected' class from all items
      document.querySelectorAll('#part-list li').forEach(li => li.classList.remove('selected'));

      // Add 'selected' class to the clicked item
      event.target.classList.add('selected');

      const partName = event.target.getAttribute('data-part');
      selectedPart = partName;
  });
});

// Add event listener to color picker
document.getElementById('color-picker').addEventListener('input', (event) => {
  const color = event.target.value;
  if (selectedPart) {
      scene.traverse((child) => {
          if (child.name === selectedPart) {
              child.material = new THREE.MeshStandardMaterial({ color: color });
              // Update the color indicator
              document.querySelector(`#part-list li[data-part="${selectedPart}"] .color-indicator`).style.backgroundColor = color;
          }
      });

   
  }
});
