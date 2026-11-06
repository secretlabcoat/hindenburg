# Hindenburg rotation audit (before 4-facing pass)

Date: 2026-11-06 (America/Toronto). Source: `index.html` node graph after B-6/tour patches.

## Model today

Each **node** is a camera facing. `left`/`right` turn the camera; `forward` moves when set.
This is closer to Titanic AOOT than hotspots, but **many rooms do not have 4 walls**, and on B-deck **turning left/right walks you into a different room** (corridor graph) instead of looking at another wall.

## Counts (before)

| Metric | Count |
|---|---|
| Nodes (facings) | 36 |
| Named rooms (by `name`) | 14 |
| Rooms with closed 4-cycle left-loop | 4 (cabin B-6, lounge, promenade, A-deck corridor) |
| Rooms with 3-cycle | 2 (washroom, keel) |
| Rooms with 2-cycle | 1 (control car) |
| Rooms with 1 facing / no turns | 6+ (bar, office, adeck_cabin, girder_nook, 4 tour stops) |
| Styles with art WebP | 27 (keyed by `style`, not by facing) |

## Per-room facing inventory

### Cabin B-6 (B deck) — OK (4)
| Node | Facing | L | R | F |
|---|---|---|---|---|
| cabin_bunk | two berths | cabin_desk | cabin_window | — |
| cabin_window | window | cabin_bunk | cabin_door | — |
| cabin_door | door to corridor | cabin_window | cabin_desk | bdeck_cabins |
| cabin_desk | fold-down desk | cabin_door | cabin_bunk | — |
Left×4 returns to start. Art via styles `b6bunk/b6window/b6door/b6desk`.

### Passenger Lounge — OK (4)
lounge_windows → lounge_people → lounge_side → lounge_aft → …  
Forward: windows→promenade, aft→corridor_forward.

### Promenade — OK (4)
promenade → promenade_side → promenade_far → promenade_aft → …  
Forward: promenade/aft → lounge_windows.

### Passenger Corridor (A deck) — OK (4)
corridor_forward → corridor_left → corridor_end → corridor_right → …  
Forward: forward→end, end→lounge_aft, left→adeck_cabin, right→bdeck_stairs.

### B-Deck Washroom — MISSING 1 (3-cycle)
washroom_stall ↔ washroom_basins ↔ washroom_door (3 nodes).  
**Gap:** no 4th wall (e.g. towel/locker wall). Left×3 returns, not ×4.

### Keel Walkway — MISSING 1 (3-cycle)
keel_walk ↔ keel_hatch ↔ keel_back. **Gap:** 4th facing (e.g. looking aft/up into cells).

### Control Car — MISSING 2 (2-cycle)
control_helm ↔ control_back only. **Gap:** port instruments wall, starboard window wall.

### Bar & Smoking Room — MISSING 3 (1 facing)
bar_counter only. Left/right currently leave the bar into B-deck nodes. **Wrong model.**

### Purser’s Office — MISSING 3 (1 facing)
office_desk only. Left/right leave into corridor nodes.

### B-Deck “corridor” cluster — WRONG MODEL
Nodes `bdeck_washroom`, `bdeck_stairs`, `crew_door`, `bdeck_cabins` use style `door` and **left/right navigate between locations**. Titanic-style: each should be its own location with 4 wall facings; doorways use **forward**.

### Passenger Cabin (A deck) — MISSING 3
adeck_cabin: left=right=null, forward=corridor_left only.

### High in the Rings / Keel Tour — linear / no turns
girder_nook, tour_shoes/cells/tanks/end: no left/right. Tour may stay forward-only (escorted) but should still allow looking around (2–4 facings) without breaking progression.

## Image reuse problems

- Many distinct places share style `door` → **same `door.webp`** for stairs, crew door, washroom corridor, promenade aft, lounge aft, etc. Walls do not look like the same/different rooms correctly.
- Art keyed by `style` not by facing id → cannot give 4 unique walls per room without new keys.

## Target model (after)

1. **Location** = physical room. Each has **4 facings** (N/E/S/W or named walls) forming a closed left/right loop.
2. **Forward** only on facings that have an exit (door/opening); lands on a facing in the destination location.
3. **Art key** = node id (`assets/art/<nodeId>.webp`), with shared room prompt prefix + fixed seed family per room for consistency.
4. Tiny spaces (nook, tour stops): still 4 facings if sensible; tour forward chain preserved.
5. Preserve hotspots (`data-person`, `data-move`, `data-object`, `data-wash`, `data-act`), puzzles, endings.

## Implementation order

1. This audit committed.
2. Style bible update in `.pm/art-prompts.md`.
3. Coding agent: expand graph to 4-facings + art keyed by node id.
4. Generate/regenerate WebPs via FLUX.1-schnell.
5. Wire CDN ART_COMMIT; QA rotation walk; push.
