---
name: Liquid Galaxy Nano Banana Sprite Master
description: Leverage AI (Nano Banana/Imagen) to generate high-quality game sprites and integrate them with real-time background removal for Liquid Galaxy demos.
---

# 🍌 Nano Banana Sprite Master 🚀

## Overview
This skill helps students transform text prompts into high-fidelity **game sprites** (ships, asteroids, power-ups, obstacles, or background elements) that look stunning on the Liquid Galaxy video wall. It covers the full pipeline: **Generation -> Transparent Processing -> Rig Integration**.

## 🎨 Phase 1: The Perfect Generation Prompt
To get a usable game asset, you must be specific. Nano Banana generates squares, but we need game sprites.

**Prompt Template:**
> "Top-down view of a [Aesthetic, e.g., Sleek Vaporwave] [Object, e.g., Space Ship]. Feature: [Details, e.g., Single central thruster]. Background: Solid bright neon green (#00FF00). High contrast, symmetrical, game asset, 4k. The object must occupy the center of the frame. No checkerboard, no grid, no shadowed ground."

### Why Green? 💚
Generating with a solid neon green background allows us to use a **Chroma Key** algorithm (like in Hollywood movies) to remove the background in real-time on the client, as AI models often struggle to export true transparency (Alpha channel).

---

## 💻 Phase 2: Real-time Background Removal
Add this utility to your client-side code (e.g., `sketch.js`) to process the AI asset upon loading.

```javascript
/**
 * Removes bright green backgrounds from AI-generated sprites
 * @param {HTMLImageElement} img
 */
function makeTransparent(img) {
  const c = document.createElement('canvas');
  c.width = img.width;
  c.height = img.height;
  const cx = c.getContext('2d');
  cx.drawImage(img, 0, 0);
  
  const imageData = cx.getImageData(0, 0, c.width, c.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i+1], b = data[i+2];
    // Chroma Key: Target the bright Green (#00FF00)
    if (g > 100 && r < 100 && b < 100) {
      data[i + 3] = 0; // Set Alpha to 0 (Transparent)
    }
  }

  cx.putImageData(imageData, 0, 0);
  return c; // Use this Canvas as your image in ctx.drawImage()
}
```

---

## 📏 Phase 3: Alignment & Scaling
Liquid Galaxy screens are high-resolution. Simple triangles get lost.

1.  **Visual Scale**: Render at **3x** the logic size (e.g., if radius is 30, render at 120-180px) to ensure details are visible from a distance.
2.  **Rotation Offset**: Most top-down AI sprites face **UP**. Most game engines (and ours) assume **0 Radians** points **RIGHT**. 
    - **Fix**: Apply `ctx.rotate(Math.PI / 2)` after your translation and before drawing the image.
3.  **Physics Radius**: Always update your `server/entities.js` radius to match the new visual footprint, or players will get frustrated by "invisible" collisions.

---

## 🏁 Example Task: The Vaporwave Interceptor
Used in the **LGAsteroids** project:
- **Prompt**: Sleek fighter with single central thruster, magenta/cyan trim, green bg.
- **Scale**: 360px visual size.
- **Hitbox**: 90 radius on server.
- **Code**: `drawNeonShip` updated to accept the processed canvas object.

### Example: The Glowing Asteroid
- **Prompt**: "Top-down view of a jagged, crystalline asteroid with glowing internal magma veins. Craters and sharp edges. Background: Solid bright neon green (#00FF00)."
- **Strategy**: Great for variety. Generate 3-4 different ones and randomly assign them to asteroid entities.

### Example: The Neon Power-up
- **Prompt**: "Top-down view of a futuristic tech-orb power-up. Pulsating core, rotating outer rings, lightning effects. Background: Solid bright neon green (#00FF00)."
- **Strategy**: Use for health packs or weapon upgrades.

---

## 🚦 Verification Checklist
- [ ] Is the object centered in the generated image?
- [ ] Is the green background completely removed (no "halo" effect)?
- [ ] Does the object's rotation in the game match its visual orientation?
- [ ] Is the sprite large enough to be seen across the entire Liquid Galaxy rig?
