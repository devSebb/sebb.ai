# ViewComponent Decision

Decision: **defer ViewComponent adoption for this stabilization cycle**.

Rationale:
- Current priority is architecture stabilization with minimal moving parts.
- The existing ERB partial system can be stabilized with explicit contracts first.
- Introducing ViewComponent now adds framework and migration overhead while high-risk controller, animation, and route changes are still in flight.

Revisit trigger:
- Reassess ViewComponent after stabilization phases complete and redesign implementation starts.
