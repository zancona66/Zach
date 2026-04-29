# super-agent-code scaffold

Reusable skeleton for cross-domain orchestration tasks. The orchestrator records its routing decision here, then delegates execution to a sub-skill (`zra-master-ops`, `zra-special-ops`, or `deep-coded`).

## Files
- `task-brief.md`: intake template that captures the routing decision, signals matched, alternatives rejected, and the chosen sub-skill's scaffold pointer.
- `validation-log.md`: execution/verification template with a routing audit and a pointer to the sub-skill's own validation evidence.

## Usage
1. Copy both files into your run folder (typically `.agents/runs/YYYY-MM-DD-<task-name>/`).
2. Fill `task-brief.md` Routing decision section before doing any other work.
3. Copy the chosen sub-skill's own scaffold (`task-brief.md`, `validation-log.md`) into the same run folder, side-by-side, and execute under that sub-skill.
4. Fill `validation-log.md` Routing audit after the sub-skill finishes; confirm the route was correct in hindsight.
5. Before handoff, confirm: routing decision recorded, sub-skill checklist satisfied, audit logged, risks recorded, confidence stated.
