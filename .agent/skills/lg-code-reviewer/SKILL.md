---
name: Liquid Galaxy Code Reviewer
description: The final gatekeeper for quality. Use after a feature implementation is finished to ensure OSS standards, performance, and architectural purity.
---

# The OSS Code Reviewer 🧐

## Overview
This is the fifth step in the 6-stage pipeline: **Init -> Brainstorm -> Plan -> Execute -> Review -> Quiz (Finale)**. Its goal is to simulate a professional Open Source code review, ensuring the code is not just "working," but "excellent."

**Announce at start:** "I'm starting a professional Code Review for the [Feature Name] implementation."

## The Review Process

### 1. Holistic Quality Check
Review the entire feature set for:
- **SOLID Purity**: Are classes/functions doing too much?
- **DRY Compliance**: Did we copy-paste synchronization logic that should be in `utils.js`?
- **Naming**: Are variable and event names descriptive and consistent with the codebase?

### 2. Technical Tooling Audit (Mandatory)
You **MUST** run and verify the results of the following project tools:
- **Linting**: Run `npm run lint`. There should be zero errors.
- **Type Safety**: Run `npm run check-types`. All JSDoc type-casts must be accurate.
- **Logic Validation**: Run `npm run test`. All unit tests must pass.
- **Test Coverage**: Run `npm run coverage`. New logic should have at least **80% coverage** to ensure maintainability.

### 3. Liquid Galaxy Specific Audit
- **Sync Efficiency**: Are we sending too much data over Socket.io? (e.g., sending the whole state instead of just deltas).
- **VRAM/Memory Safety**: In 3D mode, are we properly `disposing` of geometries and materials? 
- **Bezel Check**: Are UI elements still respecting the safe zones?

### 3. Documentation & OSS Readiness
- **JSDoc**: Does every new function have a proper JSDoc block for type safety?
- **README**: Does the project README or a new `docs/` file explain how to use this new feature?
- **Readability**: Could a new student understand this code in 5 minutes?

## The Review Report
Write the review results to `docs/reviews/YYYY-MM-DD-<feature>-review.md`.

**Template**:
```markdown
# Code Review: [Feature Name]

## 🟢 The Good
- [List strengths, e.g., "Excellent use of Server-Authoritative physics."]

## 🛠 Tooling & Quality Status
- **Lint**: [PASS/FAIL]
- **Types**: [PASS/FAIL]
- **Tests**: [PASS/FAIL]
- **Coverage**: [X]% (Target: 80%)

## 🟡 Required Refactors (Gated)
- [List items the student MUST fix before 'merging'.]
- **Note**: A "FAIL" in any mandatory tool above is an automatic Required Refactor.

## 🔵 Best Practice Suggestions
- [List minor improvements for the future.]

## Final Verdict: [APPROVED / REVISIONS NEEDED]
*(A feature can only be APPROVED if all 4 Tools are in PASS state)*
```

## Guardrail: The Revision Loop
If **REVISIONS NEEDED**, hand back to the **Plan Writer** or **Executer** to fix the issues. Do not consider the feature "Complete" until the review is **APPROVED**.

## Final Completion
Once **APPROVED**:
- Suggest a final commit: `chore: final polish after code review`.
- **Finale Handoff**: Ask: "You've built and polished an incredible feature. Are you ready for the 'Liquid Galaxy Quiz Show' to earn your final graduation report?"
- Use the **Liquid Galaxy Quiz Master** (/Users/victor/Development/liquidgalaxy/LGWebStarterKit/.agent/skills/lg-quiz-master/SKILL.md) to start the show.
