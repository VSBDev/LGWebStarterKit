---
name: Liquid Galaxy Plan Executer
description: Use when you have a written implementation plan (from lg-plan-writer) to execute with review checkpoints and educational validation.
---

# Executing Liquid Galaxy Plans

## Overview

Execute implementation plans in batches. This is the fourth step in the 6-stage pipeline: **Init** -> **Brainstorm** -> **Plan** -> **Execute** -> **Review** -> **Quiz (Finale)**.

**⚠️ PROMINENT GUARDRAIL**: Do not be a "coding robot." If the student stops participating or just says "Go on," you **MUST** trigger the **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md).

**Announce at start:** "I'm using the lg-exec skill to implement the [Feature Name] plan."

## The Process

### Step 1: Load and Review Plan

1. Read the plan file in `docs/plans/`.
2. **Critical Review**: Identify questions about the architecture or synchronization strategy.
3. **OSS Context**: Ensure the proposed names and structures follow the existing project patterns.
4. If concerns: Raise them with the student before starting.

### Step 2: Execute Batch

**Default: Execute tasks in batches of 2-3.**

For each task in the batch:

1. Mark as `in_progress`.
2. Follow the steps exactly (Logic -> Implementation -> Verification).
3. **Educational Check**: Briefly explain why this specific task is necessary for the overall architecture.
4. Run verifications as specified (e.g., opening Chrome tabs to check sync).
    - **Pro Tip**: If changes don't appear, check if the server is running with `nodemon`. If not, restart it manually with `npm run dev`.
5. **Quality Check**: Run `npm run lint` and `npm run check-types`.
6. **Test Check**: If logic was modified, run `npm run test`.
7. Commit with a descriptive message: `feat: [task name]`.

### Step 3: Educational Report

When a batch is complete, report back with:

- **What was built**: A summary of the changes.
- **Verification Result**: Screenshots or console outputs showing the sync works.
- **Engineering Principles**: Mention which principle was applied (e.g., "I applied Separation of Concerns by keeping the UI logic inside the controller folder").
- **Visual Check**: How does it look on the virtual rig? Does it have the "Wow Factor"?
- **Checklist**: Mark the completed tasks in the `docs/plans/` folder.
- **Learning Journal**: Append this educational report to `docs/learning-journal.md` to track your engineering growth.

### Step 4: Continue

- Ask: "Ready for the next batch? Does the architecture still make sense to you?"
- Execute next batch until complete.

### Step 5: Final Review & Completion

After all tasks are complete:

1. Perform a final sync check across all simulated screens.
2. Finalize the `docs/plans/` document by marking it as complete.
3. **Review Handoff**: Ask: "Feature implementation is complete. Ready for a professional Code Review?" 
4. Use the **Liquid Galaxy Code Reviewer** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-code-reviewer/SKILL.md) to perform the final quality audit.

## When to Stop and Ask for Help

- Hit a blocker (desync, unclear instruction).
- Plan has logic gaps.
- Verification fails repeatedly.
- **Don't guess—ask for clarification.**

## Remember

- Review critically first.
- **Sync is everything**: If it's not on the server, it's not in sync.
- Report engineering principles after every batch.
- **Guardrail**: If the student asks for too much automation or loses track of the engineering principles, call in the **Skeptical Mentor** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-skeptical-mentor/SKILL.md).
- Stop when blocked.
