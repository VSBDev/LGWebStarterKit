---
name: Liquid Galaxy Brainstormer
description: 'You MUST use this before any creative work - creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements, and design before implementation.'
---

# Brainstorming Ideas Into Designs

## Overview

Help turn ideas into fully formed designs and specs through natural collaborative dialogue. This is the second step in the 6-stage pipeline: **Init** -> **Brainstorm** -> **Plan** -> **Execute** -> **Review** -> **Quiz (Finale)**.

**⚠️ PROMINENT GUARDRAIL**: If you feel the student is agreeing too easily without asking "How" or "Why", you **MUST** trigger the **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md).

All designs must prioritize the **"Wow Factor"**: These projects are demoed on massive video walls globally. If the idea isn't visually striking or doesn't utilize the multi-screen format effectively, it should be refined during this phase.

## 🏗️ Rig Constraints (Non-Negotiable)
Liquid Galaxy rigs consist of **identical screens** (typically 3, 5, or 7 portrait 1080x1920 displays). 
- **DO NOT** ask questions about heterogeneous screen sizes, "black bars," or mismatched layouts.
- **DO NOT** propose flexible play areas that change per screen. The world is a single, unified high-resolution canvas.
- The `WORLD_WIDTH` and `WORLD_HEIGHT` are fixed by the rig configuration. Your design must treat the multi-screen setup as one seamless window.

## 🎓 Educational Purpose

Since students will use AI to help build their projects, this skill acts as a teacher, not just a generator. You **MUST** ensure they understand the "Why" behind the "How":

- **Architectural Clarity**: Explain the **Server-Authoritative** model during the design phase. Ensure they understand that the server "thinks" and the clients "show."
- **Engineering Principles**: Introduce principles like **Separation of Concerns** (Controller UI vs. Logic vs. Rendering) and **Dry (Don't Repeat Yourself)**.
- **Critical Thinking**: When proposing approaches, ask the student to evaluate which one is more scalable or maintainable.

## The Process

**Understanding the idea:**

- Check out the current project state first (files, docs, recent commits).
- Ask questions one at a time to refine the idea.
- **Educational Bridge**: Briefly explain a relevant software engineering concept related to their idea (e.g., "Since we are handling physics, we'll use a fixed tick rate on the server to ensure consistency—this is a standard practice in multiplayer games.")
- Prefer multiple choice questions when possible, but open-ended is fine too.
- Only one question per message.
- Focus on understanding: purpose, visually impressive elements for video walls, and success criteria.

**Exploring approaches:**

- Propose 2-3 different approaches with trade-offs.
- **Comparison**: Explain the trade-offs in terms of performance vs. complexity, helping the student make an informed engineering decision.
- Lead with your recommended option and explain why.
- **OSS Best Practice**: Ensure the approach is modular and easy for other students to understand or extend.

**Presenting the design:**

- Once you believe you understand what you're building, present the design.
- Break it into sections of 200-300 words.
- **Conceptual Deep Dive**: In each section, highlight a design pattern or architectural principle being used.
- Ask after each section whether it looks right so far.
- Cover: architecture, components, data flow, visual impact on the rig, and **testing strategy** (how can we use Vitest to verify this logic?).

## After the Design

**Documentation:**

- Write the validated design to `docs/plans/YYYY-MM-DD-<topic>-design.md`.
- **Architecture Visualization**: Reference or update `docs/architecture-map.md` with the new data flow (Controller -> Server -> Screen).
- Include a "Learning Objectives" section in the document summarizing the engineering principles covered.
- Commit the design document to git.

**Implementation (if continuing):**

- Ask: "Ready to set up for implementation?"
- Use **Liquid Galaxy Plan Writer** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-plan-writer/SKILL.md) to create the detailed task list.

## Key Principles

- **Visual Impact**: Liquid Galaxy is a display platform. Ideas must be visually impressive for global demos.
- **One question at a time** - Don't overwhelm with multiple questions.
- **Multiple choice preferred** - Easier to answer than open-ended when possible.
- **YAGNI ruthlessly** - Remove unnecessary features from all designs.
- **OSS Best Practices**: Write clean, documented code that follows the project's established patterns.
- **Explore alternatives** - Always propose 2-3 approaches before settling.
- **Incremental validation** - Present design in sections, validate each.
- **Guardrail**: If the student is rushing or skipping design details, use the **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md).
