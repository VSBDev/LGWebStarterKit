---
name: Liquid Galaxy Plan Writer
description: Use when you have a spec or requirements for a multi-step task, before touching code. Creates a detailed, educational implementation plan for Liquid Galaxy projects.
---

# Writing Liquid Galaxy Implementation Plans

## Overview

Write comprehensive implementation plans that guide students through building features for the Liquid Galaxy. This is the third step in the 6-stage pipeline: **Init** -> **Brainstorm** -> **Plan** -> **Execute** -> **Review** -> **Quiz (Finale)**.

**⚠️ PROMINENT GUARDRAIL**: The **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md) is your educational partner. If the student fails the Educational Verification phase below, call the mentor immediately.

**Announce at start:** "I'm using the lg-plan-writer skill to create your implementation plan."

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>-plan.md`

## Bite-Sized Task Granularity

Each step should be a single, logical action taking 5-10 minutes. This helps students stay focused and allows for frequent verification.

- **Visual Flow**: Implement a server state change -> Verify with console.log -> Implement rendering -> Verify in chrome.
- **Commit Often**: Every task should end with a git commit, but the student needs to verify it works and the agend should ensure the student understood the contents.

## Plan Document Header

Every plan **MUST** start with this header:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about the approach, specifically mentioning the Server-Authoritative model]

**Tech Stack:** [e.g. Node.js, Socket.io, Three.js/Canvas]

**Educational Objectives:** [What engineering principles will the student learn and the agent should ensure were explained?]

---

## 🗺️ Implementation Checklist
- [ ] Task 1: [Short Title]
- [ ] Task 2: [Short Title]
- [ ] ...

---
```

## Task Structure

````markdown
### Task N: [Component/Logic Name]

**Files:**

- Create: `exact/path/to/file.js`
- Modify: `exact/path/to/existing.js`
- Test: `tests/exact/path/to/test.js` (if applicable)

**Step 1: Architectural Definition**
Briefly explain _why_ we are touching these files (e.g., "We are adding the 'score' to the server state because the server must be the source of truth for all screens.")

**Step 2: Define Logic/Interface**
Write out the specific code or socket event name.

```javascript
// Example: server/index.js
socket.on('player-scored', (data) => { ... });
```
````

**Step 3: Verification/Testing**
How does the student know it works?

- **Server**: "Run `npm run dev` and check the console for 'State Updated' logs."
- **Quality**: "Run `npm run lint` and `npm run check-types` to ensure code stability."
- **Testing**: "If logic was added, run `npm run test` or `npm run coverage`."
- **Client**: "Open 3 tabs in chrome (default or ask for screen count if relevant to the feature) and verify screens show the same value."

**Step 4: Commit**

```bash
git add .
git commit -m "feat: [brief description]"
```

```

## Engineering Principles to Enforce
- **Authoritative Server**: Logic belongs on the server.
- **Separation of Concerns**: Rendering logic stays in `public/`, physics/state stays in `server/`.
- **DRY/YAGNI/SOLID**: Don't build complex systems for simple features. Keep it modular.
- **Visual Impact**: Remind them to check the "Wow Factor" on the virtual rig.
- **Guardrail**: If the student cannot answer the below architectural questions, activate the **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md).

## 🎓 Educational Verification Phase

Before starting the implementation, you **MUST** conduct a short verification dialogue with the student. This is the most critical step to ensure they are learning and not just executing commands.

**Ask the following types of questions:**
1.  **Architecture Check**: "Why are we putting [Feature Logic] on the server instead of the client? What would happen if we did it the other way?"
2.  **Engineering Trade-offs**: "We chose [Approach A] over [Approach B]. Can you explain one advantage of this choice in terms of code maintainability or performance?"
3.  **Synchronization Logic**: "How will Screen 2 know that a change happened on the Mobile Controller? Walk me through the data path (Controller -> Server -> Screens)."
4.  **SOLID/DRY Patterns**: "Which engineering principle are we applying by keeping the rendering code separate from the physics engine?"

**Requirement**: Do not proceed to execution until the student has provided reasonable answers. If they are unsure, take a moment to explain the concept again using the code examples in the plan.

## Execution Handoff

After saving the plan and completing the **Educational Verification Phase**, offer to help start the implementation:

**"Plan complete and saved to `docs/plans/<filename>.md`. After our discussion on the architecture, I'll use the Liquid Galaxy Plan Executer (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-exec/SKILL.md) to start Task 1. Ready?"**
```
