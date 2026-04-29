# Validation Log — super-agent-code

## Skill scope
- Skill scope check: confirm work remained aligned to the chosen sub-skill, with `super-agent-code` only owning the routing pass.
- Skill scope result: pass | warn | fail

## Routing audit
- Chosen sub-skill: `zra-master-ops` | `zra-special-ops` | `deep-coded`
- Was the route correct in hindsight? yes | no | partial
- Evidence (what the work actually exercised vs. what the sub-skill is built for):
- Re-route triggered? yes | no
- If yes: pre-route phase, signal that flipped, new sub-skill, where the new brief/log live.
- Tie-breaker validity (if applied): held | failed | n/a

## Sub-skill validation evidence
- Sub-skill validation-log path in this run folder:
- Narrowest check that passed (sub-skill specific):
- Result: pass | warn | fail

## Cross-phase consistency (if multi-phase)
- Phase 1 sub-skill / outcome:
- Phase 2 sub-skill / outcome:
- Phase 3 sub-skill / outcome:
- Did handoffs preserve invariants across phases? yes | no — evidence:

## Workflow status
- Detect: complete | partial | blocked
- Classify: complete | partial | blocked
- Delegate: complete | partial | blocked
- Execute (sub-skill): complete | partial | blocked
- Aggregate (if multi-phase): complete | partial | blocked
- Validate: complete | partial | blocked
- Report: complete | partial | blocked

## Files reviewed
-

## Files changed
-

## Assumptions
-

## Risks / unresolved gaps
-

## Rollback readiness
- Revert method (single commit, feature flag, migration down):
- Re-route plan if a future signal contradicts the chosen sub-skill:
- Observability signal after merge or delivery:

## Final status
- Complete | Partial | Blocked
- Confidence: low | medium | high
