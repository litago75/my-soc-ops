---
name: dogfooding
description: 'Critically dogfood the running app by playing real user flows and reporting severity-ranked UX and fun feedback with concrete code-linked fixes. Use when asked to test the app experience, evaluate engagement, or provide product-quality UX critique.'
argument-hint: '[focus area: fun | onboarding | retention | accessibility]'
---

# Dogfooding Skill

Hands-on product review workflow for this workspace. Prefer direct interaction over code-only analysis.

## When To Use
- User asks to dogfood, playtest, or critically review UX.
- User asks if the app is fun, engaging, sticky, or clear.
- User wants feedback tied to actual interaction evidence.

## Inputs
- Optional focus area: fun, onboarding, retention, accessibility.
- If no focus is provided, default to fun + usability.

## Procedure
1. Ensure app is running locally.
   - Start with npm run dev if needed.
   - Open browser at http://localhost:5173/.
2. Play at least one full primary loop.
   - Start screen -> in-game interactions -> win state or terminal state -> replay/reset path.
3. Stress key interactions.
   - Fast-path completion (speed-run behavior).
   - Error/edge behavior (toggle, undo, reset, back navigation).
   - Post-win continuation behavior and replay quality.
4. Capture concrete evidence.
   - Cite exact UI behavior observed in browser interactions.
   - Map major findings to code locations when possible.
5. Report findings in severity order.
   - Focus on bugs, UX friction, fun blockers, retention risks.
   - Keep summaries brief after findings.
6. Provide actionable fixes.
   - Propose high-leverage changes first.
   - Include smallest effective next steps.

## Report Format
1. Dogfooder verdict (short score + rationale).
2. Findings ordered by severity.
   - Severity level.
   - Observed behavior.
   - User impact (fun/usability).
   - Relevant file links when available.
3. What is working well.
4. Highest-leverage improvements (top 3-5).

## Workspace Anchors
- App shell: [src/App.tsx](../../src/App.tsx)
- Game state and persistence: [src/hooks/useBingoGame.ts](../../src/hooks/useBingoGame.ts)
- Rules engine: [src/utils/bingoLogic.ts](../../src/utils/bingoLogic.ts)
- In-game UI: [src/components/GameScreen.tsx](../../src/components/GameScreen.tsx)
- Win modal: [src/components/BingoModal.tsx](../../src/components/BingoModal.tsx)

## Quality Bar
- Do not provide feedback without interaction evidence.
- Do not stop at generic advice; tie feedback to observed behaviors.
- Prioritize issues that reduce fun, clarity, or replay value.
- Explicitly call out if a critical loop is too easy to game or lacks reward.
