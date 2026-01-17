import { CONFIG, getScreenId } from '../common/config.js';
import { fitToWindow } from '../common/viewport.js';

const socket = /** @type {any} */ (window).io();
/** @type {HTMLCanvasElement} */
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const ctx = canvas.getContext('2d');
/** @type {HTMLElement} */
const debugEl = /** @type {HTMLElement} */ (document.getElementById('debug'));

// Setup Screen
const screenId = getScreenId();
debugEl.innerText = `Screen: ${screenId}`;

// Set Canvas Size to FIXED Liquid Galaxy Resolution
canvas.width = CONFIG.SCREEN_WIDTH;
canvas.height = CONFIG.SCREEN_HEIGHT;

// Apply Virtual Viewport Scaling
fitToWindow(canvas);

// Calculate Global Offset for this screen
// In 2D, we don't have a "Camera". We essentially just draw the entire world,
// but we shift everything to the left so that our "slice" is visible.
// Example: Screen 2 needs to show pixels 1080 to 2160.
// By subtracting 1080 from every object's X coordinate, an object at x=1080 becomes local x=0.
const globalOffsetX = (screenId - 1) * CONFIG.SCREEN_WIDTH;

let gameState = { objects: [], settings: {} };
let updateCount = 0;

socket.on('state-update', (state) => {
  gameState = state;
  if (updateCount % 60 === 0) {
    console.log('Received State:', state);
  }
  updateCount++;
});

function draw() {
  requestAnimationFrame(draw);

  // Clear background (with fade effect optionally, but let's do clean clear)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Trail effect
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Objects
  const { objects, settings } = gameState;

  if (!objects) return;

  ctx.save();
  // 2. Coordinate System Shift
  // We shift the canvas origin to the left by globalOffsetX.
  // This allows us to draw objects using their absolute World Coordinates (x, y)
  // without needing to manually subtract the offset for every single object.
  ctx.translate(-globalOffsetX, 0);

  objects.forEach((obj) => {
    // Culling: Performance Optimization
    // Only draw if the object is effectively visible in this screen's viewport.
    // Screen Viewport in World Coords: [globalOffsetX, globalOffsetX + CONFIG.SCREEN_WIDTH]
    if (
      obj.x + obj.radius < globalOffsetX ||
      obj.x - obj.radius > globalOffsetX + CONFIG.SCREEN_WIDTH
    ) {
      return;
    }

    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);

    // Use Object-Specific Color (fall back to settings or green)
    const objectColor = obj.color || settings.color || '#00ff00';
    ctx.fillStyle = objectColor;

    // Add a simple glow effect for visual flair
    ctx.shadowBlur = 20;
    ctx.shadowColor = objectColor;

    ctx.fill();
    ctx.closePath();
  });

  ctx.restore(); // Undo the translation so the debug border draws in screen-space

  // Draw Debug Border (visualize screen edges)
  ctx.strokeStyle = '#0088ff';
  ctx.lineWidth = 10;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Start Loop
draw();

// Handle Resize: Handled by viewport.js scaler now
