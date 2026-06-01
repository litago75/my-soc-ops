---
name: dogfooding
description: 'Run a critical dogfood pass on a local web app using the built-in browser. Use when you need UX findings, fun-factor scoring, replayability checks, and concrete improvement ideas.'
argument-hint: 'Optional focus: fun | UX clarity | replayability | bugs | mobile'
user-invocable: true
---

# Dogfooding Skill

Run a realistic, critical product pass as if you are an end user, then report what is fun, what is confusing, and what should change first.

## When to Use
- You want a real interaction pass, not only lint/tests.
- You need a fun-factor or delight assessment for a game or interactive UI.
- You suspect behavior quirks that only appear after repeated flows.
- You want implementation-ready recommendations from product feedback.

## Inputs
- Local app URL (default: http://localhost:5173/)
- Optional focus area: `fun`, `UX clarity`, `replayability`, `bugs`, `mobile`

## Procedure
1. Verify app reachability.
- Open the target URL in the browser tool.
- If load fails, start dev server.
- If startup fails with port-in-use, check if app is already running on that port before treating it as a defect.

2. Establish baseline UX.
- Capture first screen impression.
- Assess clarity of title, primary CTA, and rules/onboarding text.
- Note emotional tone and visual coherence.

3. Execute full core loop.
- Start game.
- Perform normal interactions (mark/unmark, state changes).
- Trigger first win/bingo.
- Validate celebration surfaces (banner/modal, copy, dismiss/continue).
- Continue play to probe repeated-win behavior (second bingo or equivalent).
- Validate reset/back flow and fresh-round behavior.

4. Stress replayability.
- Run at least one additional quick round path.
- Check whether excitement sustains or flattens.
- Identify static/repetitive points.

5. Check mobile usability.
- Resize to a narrow viewport (for example ~390x844).
- Confirm no horizontal overflow and key controls remain visible.

6. Cross-check with automated signals.
- Run lint/test/build if needed to separate product issues from code regressions.

7. Produce a critical report.
- Score categories: overall fun, first impression, interaction feel, replayability, social energy.
- List findings ordered by severity.
- Distinguish confirmed defects vs design opportunities.
- Provide top 3-5 highest-impact improvements.

## Decision Rules
- If behavior appears odd once, reproduce before reporting as defect.
- If behavior is intentional but weak for engagement, classify as product/design gap, not bug.
- If port or process conflicts block startup but app is reachable, classify as environment/process issue.
- If a state transition does not repeat when expected (for example second win), classify as logic defect and include repro steps.

## Quality Criteria
- Covers start, play, win, post-win continue, and reset flows.
- Includes at least one repeated-event check (such as second win).
- Includes at least one mobile viewport pass.
- Outputs both findings and prioritized recommendations.
- Avoids false positives by verifying whether app is already running.

## Report Template
Use this structure:

1. Summary
- Overall status and confidence.

2. Scores
- Overall fun: X/10
- First impression: X/10
- Interaction feel: X/10
- Replayability: X/10
- Social energy: X/10

3. Findings (High to Low)
- Severity, observed behavior, why it matters, repro notes.

4. Fun Analysis
- What creates delight.
- What flattens energy over time.

5. Top Improvements
- 3-5 concrete changes with expected impact.

6. Optional Next Action
- Offer to create issues for each top improvement.

## Example Prompts
- Dogfood the app and give me a critical fun report.
- Dogfood localhost:5173 with focus on replayability.
- Run a full dogfooding pass focused on second-win behavior.
- Dogfood this redesign on mobile and list blockers.
