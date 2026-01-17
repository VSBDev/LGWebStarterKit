import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const PORT = process.argv[2] || 3000;
const TICK_RATE = 60; // Updates per second

// --- Path resolution (ESM) ---
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_PATH = path.join(__dirname, '../public');

// --- Configuration ---
// Allow 'SCREENS' environment variable to define the rig size (Default: 3)
const SCREENS = parseInt(process.env.SCREENS) || 3;
const SCREEN_WIDTH = 1080;
const SCREEN_HEIGHT = 1920;
const WORLD_WIDTH = SCREEN_WIDTH * SCREENS;
const WORLD_HEIGHT = SCREEN_HEIGHT;

console.log(`LG Web Starter Kit starting...`);
console.log(`- Screens: ${SCREENS}`);
console.log(`- Resolution: ${SCREEN_WIDTH}x${SCREEN_HEIGHT} (Portrait)`);
console.log(`- World Size: ${WORLD_WIDTH}x${WORLD_HEIGHT}`);

// --- Express & Socket Setup ---
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// serve Dynamic Config to Clients
// This allows the frontend to automatically adjust to the number of screens
app.get('/common/config.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`
export const CONFIG = {
    // 1080x1920 (Portrait)
    SCREEN_WIDTH: ${SCREEN_WIDTH},
    SCREEN_HEIGHT: ${SCREEN_HEIGHT},
    
    // Dynamic World Width based on Server Config (${SCREENS} screens)
    WORLD_WIDTH: ${WORLD_WIDTH}, 
    WORLD_HEIGHT: ${WORLD_HEIGHT},
    
    // Auto-detect server URL
    SERVER_URL: window.location.hostname === 'localhost' ? '' : \`http://\${window.location.hostname}:3000\`
};

export function getScreenId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('screen')) || 1; 
}
    `);
});

// Serve static files
app.use(express.static(PUBLIC_PATH));

// Routes for convenience
app.get('/', (req, res) => res.redirect('/controller')); // Default to controller if no path
app.get('/2d', (req, res) => res.sendFile(path.join(PUBLIC_PATH, '2d/index.html')));
app.get('/3d', (req, res) => res.sendFile(path.join(PUBLIC_PATH, '3d/index.html')));
app.get('/controller', (req, res) => res.sendFile(path.join(PUBLIC_PATH, 'controller/index.html')));

// --- Game State ---
// World dimensions are now defined dynamically above based on SCREENS config.

let gameState = {
  settings: {
    speed: 5, // Movement speed multiplier
    color: '#00ff00',
    shape: 'circle',
    gravity: false,
    cameraZoom: 2.5 // Multiplier for camera distance
  },
  objects: [
    // Initial ball with 3D velocity (X, Y, Z)
    { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2, z: 0, vx: 5, vy: 5, vz: 5, radius: 50, id: 1 }
  ],
  camera: { x: 0, y: 0, z: 0 } // Synced camera look-at position
};

// --- Physics Loop (Server Side) ---
// We run physics at a fixed rate (60 ticks/s) to ensure consistent simulation
// regardless of server load or client frame rates.
let serverFrame = 0;

setInterval(() => {
  updatePhysics();
  // Broadcast the "Authoritative State" to all connected clients

  // OPTIMIZATION: Bandwidth Saving
  // Clients only need to know WHERE things are (x,y,z), not their velocity vectors.
  // We create a sanitized view of the state to send over the wire.
  const publicState = {
    settings: gameState.settings,
    camera: gameState.camera,
    objects: gameState.objects.map((obj) => ({
      id: obj.id,
      x: parseFloat(obj.x.toFixed(2)), // Round to 2 decimal places to save bytes
      y: parseFloat(obj.y.toFixed(2)),
      z: parseFloat(obj.z.toFixed(2)),
      radius: obj.radius,
      color: obj.color // Send the object's specific color
    }))
  };

  io.emit('state-update', publicState);
}, 1000 / TICK_RATE);

function updatePhysics() {
  // 1. Update Camera Position (Orbit)
  // We calculate the camera's path on the server so that all screens
  // view the scene from the EXACT same angle at the same time.
  serverFrame += 0.005;
  gameState.camera.x = Math.sin(serverFrame) * 1500; // Wider horizontal sway
  gameState.camera.y = Math.cos(serverFrame * 0.7) * 800; // Taller vertical sway

  // 2. Update Objects
  const { speed, gravity } = gameState.settings;

  gameState.objects.forEach((obj) => {
    // Calculate current speed magnitude in 3D space
    const currentMag = Math.sqrt(obj.vx * obj.vx + obj.vy * obj.vy + obj.vz * obj.vz) || 1;

    // Dynamic Velocity Handling:
    // If gravity is OFF, we normalize the velocity vector and scale it to the desired speed.
    // This ensures the ball always travels at exactly 'speed' units per tick.
    if (!gravity) {
      obj.vx = (obj.vx / currentMag) * speed;
      obj.vy = (obj.vy / currentMag) * speed;
      obj.vz = (obj.vz / currentMag) * speed;
    } else {
      // If gravity is ON, we simply add to the Y velocity (downwards)
      obj.vy += 0.5;
    }

    // Move object
    obj.x += obj.vx;
    obj.y += obj.vy;
    obj.z += obj.vz;

    // Collision Detection (Boundary Checking)
    // We simulate a glass box that matches the full world size.
    // PADDING = 0 means the ball bounces off the actual screen edges.
    const PADDING = 0;

    // X-Axis Bounce (Left/Right Walls)
    if (obj.x < obj.radius) {
      obj.x = obj.radius; // Reset position to avoid sticking
      obj.vx *= -1; // Invert velocity
    } else if (obj.x > WORLD_WIDTH - obj.radius) {
      obj.x = WORLD_WIDTH - obj.radius;
      obj.vx *= -1;
    }

    // Y-Axis Bounce (Floor/Ceiling)
    if (obj.y < obj.radius) {
      obj.y = obj.radius;
      obj.vy *= -1;
    } else if (obj.y > WORLD_HEIGHT - obj.radius) {
      obj.y = WORLD_HEIGHT - obj.radius;
      obj.vy *= -0.9; // Apply damping (energy loss) when hitting the floor with gravity
    }

    // Z-Axis Bounce (Front/Back Glass)
    // The box has a depth of 1000 units, centered at 0.
    // So the range is -500 to +500.
    const HALF_DEPTH = 500;
    if (obj.z < -HALF_DEPTH + obj.radius) {
      obj.z = -HALF_DEPTH + obj.radius;
      obj.vz *= -1;
    } else if (obj.z > HALF_DEPTH - obj.radius) {
      obj.z = HALF_DEPTH - obj.radius;
      obj.vz *= -1;
    }
  });
}

// --- Socket Events ---
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send initial state
  socket.emit('state-update', gameState);

  socket.on('update-settings', (newSettings) => {
    // Merge settings
    gameState.settings = { ...gameState.settings, ...newSettings };

    // NOTE: We do NOT update existing objects' color here.
    // This allows the user to have multi-colored balls.
    // The "Settings Color" acts as a "Current Brush Color" for FUTURE balls.

    // Broadcast immediately to update UI on other controllers if any
    io.emit('settings-changed', gameState.settings);
    console.log('Settings updated:', gameState.settings);
  });

  socket.on('reset-ball', () => {
    // 3. Reset Simulation
    // When the user clicks "Reset", we clear all balls and spawn a single "Master Ball".
    // This ball is placed exactly in the center with a defined velocity.
    // We explicitly set z:0 to prevent any depth issues.
    gameState.objects = [
      {
        x: WORLD_WIDTH / 2,
        y: WORLD_HEIGHT / 2,
        z: 0,
        vx: 5,
        vy: 5,
        vz: 5,
        radius: 50,
        color: gameState.settings.color || '#00ff00', // Start with current global color
        id: 1
      }
    ];

    // Broadcast immediately so clients snap to the new state
    io.emit('state-update', gameState);
  });

  socket.on('spawn-ball', () => {
    // Create a new ball at the center with random outward velocity
    // Assign a RANDOM vibrant color for instant fun
    const randomColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');

    const newBall = {
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      z: 0,
      vx: (Math.random() - 0.5) * 10 || 5,
      vy: (Math.random() - 0.5) * 10 || 5,
      vz: (Math.random() - 0.5) * 10 || 5,
      radius: 50,
      color: randomColor,
      id: Date.now() // Unique ID
    };

    gameState.objects.push(newBall);
    // No need to manual emit, the loop will catch it in <16ms
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`LG Starter Kit running on http://localhost:${PORT}`);
  console.log(`- 2D View: http://localhost:${PORT}/2d?screen=1`);
  console.log(`- 3D View: http://localhost:${PORT}/3d?screen=1`);
  console.log(`- Controller: http://localhost:${PORT}/controller`);
});
