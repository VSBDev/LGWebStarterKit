---
description: How to test the Liquid Galaxy rig on a single laptop screen using multiple browser windows.
---

1. **Start the Server**
   Run the project in development mode:

   ```bash
   npm run dev
   ```

2. **Open the 2D View (3 Screens)**
   Open these 3 URLs in separate windows (or tabs) to see the full panoramic effect:
   - [http://localhost:3000/2d?screen=1](http://localhost:3000/2d?screen=1)
   - [http://localhost:3000/2d?screen=2](http://localhost:3000/2d?screen=2)
   - [http://localhost:3000/2d?screen=3](http://localhost:3000/2d?screen=3)

3. **Open the Controller**
   Open the mobile controller:
   - [http://localhost:3000/controller](http://localhost:3000/controller)

4. **Verify Sync**
   Toggle the "Gravity" or "Speed" in the controller. Observe that all 2D screen windows react simultaneously. If you move a ball from left to right, it should disappear from Screen 1 and immediately appear on Screen 2.

5. **Test 3D Mode**
   Switch the tabs to use `/3d` instead of `/2d` to verify the Three.js panoramic projection is working.
