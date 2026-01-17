---
name: Liquid Galaxy Project Init
description: Helps students bootstrap a new Liquid Galaxy project by forking the starter kit and configuring standard parameters (2D/3D, screens, orientation).
---

# Liquid Galaxy Project Initializer

Use this skill when a student wants to start a new project based on the `LGWebStarterKit`. This is the first step in the 6-stage pipeline: **Init** -> **Brainstorm** -> **Plan** -> **Execute** -> **Review** -> **Quiz (Finale)**.

**⚠️ PROMINENT GUARDRAIL**: The **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md) is active at all times. If you rush, skip explanations, or fail to demonstrate understanding, the mentor **WILL** intervene.

## ⛓️ Phase 0: Repository & Version Control Setup
Before initializing, ensure the student has a proper foundation:
1.  **Check for Git**: Ensure the directory is a Git repository (`git status`).
2.  **Verify Origin**: Check if they have forked or just cloned.
3.  **Action**: 
    - If they haven't initialized git: `git init`.
    - If they are working directly on the starter kit: Recommend they create a new repository or fork to track their specific project.
    - Ask: "Is this a new project repository or a fork of the starter kit?"

## 🏁 Phase 1: Interactive Requirement Gathering
Before writing a single line of code, you **MUST** ask the student for:
1.  **Project Identity**: Name and a brief description (e.g., "LG-Mars-Explorer").
2.  **Display Configuration**: 
    - **Screen Count**: (Common are 3, 5, or 7).
    - **Physical Layout**: Confirm portrait (1080x1920) lg default.
    - **Note**: Liquid Galaxy rigs use **identical screens**. We do not support heterogeneous screen sizes in this starter kit.
3.  **Visual Engine**:
    - `Canvas 2D`: High performance for sprites/text.
    - `Three.js 3D`: For immersive 3D environments.
4.  **Confirm Tooling**: Remind them that the project includes **ESLint, Prettier, TypeScript (checkJs), and Vitest** for professional quality.

## 🏗 Phase 2: Structural Scaffolding

Follow this standard Liquid Galaxy architecture. Delete unused directories to keep the student focused.

```text
/
├── .agent/              # Agent skills and workflows
├── docs/
│   └── plans/           # Implementation plans and design docs
├── public/
│   ├── common/          # Shared logic (socket.io, config, viewport)
│   ├── controller/      # The mobile/tablet remote UI
│   ├── 2d/              # Canvas renderer (delete if 3D-only)
│   └── 3d/              # Three.js renderer (delete if 2D-only)
├── server/
│   ├── index.js         # Authoritative Server (Physics/State)
│   └── state.json       # (Optional) Persistent state
├── package.json         # Dependencies and LG run scripts
└── README.md            # Project-specific documentation
```

### 🛠 Action: Dependency & Directory Check

You must ensure the following are ready:

1.  **Project Folders**: Create `docs/plans` if it does not exist.
2.  **Update `package.json`**: Set the `name` to the new project and update `scripts`.
3.  **Pull Packages**: Run `npm install` to ensure `express`, `socket.io`, and (if 3D) `three` are present.
4.  **Nodemon**: Ensure `nodemon` is in devDependencies for a smooth dev loop.

## ⚙ Phase 3: Configuration & Environment

Update the following files based on the gathering phase:

### 1. `public/common/config.js`

Apply the screen dimensions and rig size.

```javascript
export const CONFIG = {
  SCREEN_WIDTH: 1080, // or 1920
  SCREEN_HEIGHT: 1920, // or 1080
  SCREENS: 3
  // Ensure WORLD_WIDTH is calculated: SCREEN_WIDTH * SCREENS
};
```

### 2. `server/index.js`

Ensure the server defaults to the student's screen count via env vars or hardcoded defaults.

```javascript
const SCREENS = parseInt(process.env.SCREENS) || 3;
```

## 🎓 Phase 4: Best Practices & Reminders

Once initialized, explain these 3 Golden Rules to the student:

1.  **The Authoritative Server**: "Your game logic lives ONLY on the server. The screens are just mirrors. If you calculate a ball's position on a client, it will be out of sync in 5 seconds."
2.  **Bezel-Aware Design**: "Never put text or critical buttons at the very edge of the screen. Screen frames (bezels) will eat your pixels."
3.  **The Simulator Tab**: "You don't need a real LG to develop. Open 3 tabs with `?screen=1`, `?screen=2`, etc. if you see the object move seamlessly across tabs, you've succeeded."

## 🚀 Execution Script for Agent

1.  Ask the questions.
2.  Plan the file deletions/creations.
3.  Run `npm install`.
4.  Update `config.js` and `package.json`.
5.  Generate a "Hello World" specific to their choice (2D/3D).
6.  Explain the local testing workflow.
7.  **Project Documentation**: Create `docs/project-overview.md` summarizing the rig configuration, visual engine, and project identity.
8.  **Skill Chain**: Once initialized, ask: "Ready to brainstorm your first feature?" and use the **Liquid Galaxy Brainstormer** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-brainstormer/SKILL.md) to explore ideas and architecture.
