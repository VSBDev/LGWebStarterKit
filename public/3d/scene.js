import * as THREE from 'three';
import { CONFIG, getScreenId } from '../common/config.js';
import { fitToWindow } from '../common/viewport.js';

const socket = /** @type {any} */ (window).io();
const debugEl = /** @type {HTMLElement} */ (document.getElementById('debug'));
const screenId = getScreenId();

debugEl.innerText = `Screen: ${screenId} (3D Mode)`;

// --- Scene Setup ---
const scene = new THREE.Scene();
// Deep space background
scene.background = new THREE.Color(0x111111);
scene.fog = new THREE.FogExp2(0x111111, 0.00005);

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  75,
  CONFIG.SCREEN_WIDTH / CONFIG.SCREEN_HEIGHT,
  1,
  10000
);

// --- The Liquid Galaxy Magic ---
// This is the most critical part for multi-screen sync.
// We have one giant "Virtual Camera" that sees the entire world (e.g. 3240x1920).
// However, THIS specific screen instance only renders a 1080x1920 "slice" of it.
//
// THREE.PerspectiveCamera.setViewOffset(fullWidth, fullHeight, x, y, width, height)
// - fullWidth/Height: Total resolution of the entire cluster.
// - x, y: The top-left pixel coordinate where THIS screen starts.
// - width, height: The resolution of THIS single screen.
//
// This modifies the camera's internal projection matrix to "skew" the frustum,
// ensuring lines and perspective cross seamlessly from one monitor bezel to the next.
const width = CONFIG.SCREEN_WIDTH;
const x = (screenId - 1) * width; // 0 for Screen1, 1080 for Screen2, etc.
camera.setViewOffset(CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT, x, 0, width, CONFIG.SCREEN_HEIGHT);
camera.position.z = 1500; // Initial "Zoom" distance (will be overriden by server state)

// Position camera to see the full height of the "virtual canvas"
// 1 unit = 1 pixel
camera.position.x = 0;
camera.position.y = 0;
camera.lookAt(0, 0, 0);

// --- Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(CONFIG.SCREEN_WIDTH, CONFIG.SCREEN_HEIGHT);
// Strict color management for consistent visuals across different displays
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
fitToWindow(renderer.domElement);

// --- World "Aquarium" Box ---
// A transparent box representing the boundaries of our simulation.
// It matches the full dimensions of the Liquid Galaxy rig.
const BOX_DEPTH = 1000;
const worldGeo = new THREE.BoxGeometry(CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT, BOX_DEPTH);

// Use BackSide to render the "inside" of the box since the camera is looking into it.
const worldMat = new THREE.MeshBasicMaterial({
  color: 0x0088ff,
  transparent: true,
  opacity: 0.1,
  side: THREE.BackSide,
  depthWrite: false
});
const worldMesh = new THREE.Mesh(worldGeo, worldMat);
worldMesh.position.set(0, 0, 0); // Centered at World Origin
scene.add(worldMesh);

const wireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(worldGeo),
  new THREE.LineBasicMaterial({ color: 0x00aaff, linewidth: 2 })
);
scene.add(wireframe);

// --- Lighting ---
// Even though we use BasicMaterials for the balls (for clear visibility),
// we add lights for any future standard materials.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 1000);
scene.add(pointLight);

// --- Background Objects (Reference Grid) ---
// A plane that matches the 2D world dimensions
const gridHelper = new THREE.GridHelper(CONFIG.WORLD_WIDTH, 20, 0x444444, 0x222222);
// Rotate to stand up facing camera
gridHelper.rotation.x = Math.PI / 2;
scene.add(gridHelper);

// --- Game Objects ---
const meshes = {}; // Map ID -> Mesh

let gameState = { objects: [], settings: {} };
let updateCount = 0;

socket.on('state-update', (state) => {
  gameState = state;
  if (updateCount % 60 === 0) {
    console.log('Received State:', state);
  }
  updateCount++;
  updateScene();
});

function updateScene() {
  const { objects, settings } = gameState;
  const currentIds = new Set(objects.map((o) => o.id));

  // Remove old
  Object.keys(meshes).forEach((id) => {
    if (!currentIds.has(parseInt(id))) {
      const mesh = meshes[id];
      scene.remove(mesh);

      // THREE.JS BEST PRACTICE:
      // Always dispose of Geometries and Materials when removing objects to prevent VRAM memory leaks.
      if (mesh.geometry) mesh.geometry.dispose();
      if (mesh.material) {
        // If it were an array of materials, we'd loop. Here it's single.
        mesh.material.dispose();
        // If we had textures: mesh.material.map.dispose(), etc.
      }

      delete meshes[id];
    }
  });

  // Update/Create new
  objects.forEach((obj) => {
    let mesh = meshes[obj.id];

    if (!mesh) {
      // Create New
      const geometry = new THREE.SphereGeometry(obj.radius, 32, 32);
      const material = new THREE.MeshBasicMaterial({
        color: obj.color || settings.color || '#00ff00'
      });
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      meshes[obj.id] = mesh;
    }

    // Update Position
    // The server sends World Coordinates (0 to 3240).
    // Three.js world is centered at 0. So we shift by -WORLD_WIDTH/2
    mesh.position.set(
      obj.x - CONFIG.WORLD_WIDTH / 2,
      -(obj.y - CONFIG.WORLD_HEIGHT / 2), // Invert Y for 3D (Up is positive)
      obj.z
    );

    // Update Color
    if (obj.color) {
      mesh.material.color.set(obj.color);
    } else if (settings.color) {
      mesh.material.color.set(settings.color);
    }
  });
}

// --- Render Loop ---
function animate() {
  requestAnimationFrame(animate);

  // Synced Camera Movement
  // The server calculates the position to ensure all screens match exactly
  if (gameState.camera) {
    camera.position.x = gameState.camera.x;
    camera.position.y = gameState.camera.y;
    camera.lookAt(0, 0, 0);
  }

  // Synced Camera Zoom (Z-Depth)
  // We calculate base distance to fit height, then apply modifier
  if (gameState.settings && gameState.settings.cameraZoom) {
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    const baseDist = CONFIG.WORLD_HEIGHT / 2 / Math.tan(vFOV / 2); // Use WORLD_HEIGHT, not just SCREEN_HEIGHT
    // Actually fullHeight aka WORLD_HEIGHT is correct standard for "fitting" the view
    camera.position.z = baseDist * gameState.settings.cameraZoom;
  }

  renderer.render(scene, camera);
}

animate();
