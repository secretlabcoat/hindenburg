# Physical facing + duplicate-image audit

2026-11-06 (America/Toronto). Replaces the earlier 36→76 graph audit. Fred's hallway feedback exposed that closed turn loops alone did not make the pictures physically sensible.

## Result
76 facings / 19 locations retained. Hall-axis views form opposite pairs; side walls form the other opposite pair. Side walls are close frontal panels/doors, never duplicate hallway photographs. Forward requires a real exit; all solid walls and windows disable it. A side-facing real cabin/office door remains enterable. Room walls are individually framed. No deployment.

**21 ready facing images, 55 regeneration placeholders.** Three fresh HF images: B-deck washroom side door, office side door, stair-axis view. First HF token exhausted; second produced three images then exhausted. Wrong/copied historical files remain on disk but are blocked by artStatus; CSS-drawn previews render instead. No legacy-style photograph fallback.

## Implementation ownership
Attempted Claude Code, Codex, OpenCode and Aider through FreeLLMAPI sequentially. All were rejected with 429 / exhausted free routes before editing. Executor applied the expressly allowed fallback changes. No Cursor cloud agent.

## Per-location plan and art state

### B-Deck Washroom — 3 ready / 1 placeholder
Clockwise: washroom_stall → washroom_basins → washroom_door → washroom_wall. Opposite pairs: washroom_stall ↔ washroom_door; washroom_basins ↔ washroom_wall.

- `washroom_stall`: room-wall / shower; ready. Unique source image retained.
- `washroom_basins`: room-wall / mirror; ready. Unique source image retained.
- `washroom_door`: room-wall / door; ready. Unique source image retained.
- `washroom_wall`: room-wall / towel; placeholder. Previously room-matched copied placeholder.

### Cabin B-6 (B deck) — 3 ready / 1 placeholder
Clockwise: cabin_bunk → cabin_window → cabin_door → cabin_desk. Opposite pairs: cabin_bunk ↔ cabin_door; cabin_window ↔ cabin_desk.

- `cabin_bunk`: room-wall / bunks; ready. Unique source image retained.
- `cabin_window`: room-wall / window; ready. Unique source image retained.
- `cabin_door`: room-wall / door; placeholder. Whole bunk-room view, not a close frontal exit wall.
- `cabin_desk`: room-wall / desk; ready. Unique source image retained.

### Passenger Lounge — 2 ready / 2 placeholder
Clockwise: lounge_windows → lounge_people → lounge_side → lounge_aft. Opposite pairs: lounge_windows ↔ lounge_side; lounge_people ↔ lounge_aft.

- `lounge_windows`: room-wall / window; ready. Unique source image retained.
- `lounge_people`: room-wall / booths; ready. Unique source image retained.
- `lounge_side`: room-wall / desk; placeholder. Duplicate or generic hall view does not match this facing.
- `lounge_aft`: room-wall / door; placeholder. Duplicate or generic hall view does not match this facing.

### Promenade — 1 ready / 3 placeholder
Clockwise: promenade → promenade_far → promenade_side → promenade_aft. Opposite pairs: promenade ↔ promenade_side; promenade_far ↔ promenade_aft.

- `promenade`: side-wall / window; placeholder. Old long axial view is wrong for a close side wall.
- `promenade_far`: hall-axis / door; ready. Canonical axial promenade view.
- `promenade_side`: side-wall / booths; placeholder. Duplicate or generic hall view does not match this facing.
- `promenade_aft`: hall-axis / door; placeholder. Duplicate or generic hall view does not match this facing.

### Passenger Corridor — 1 ready / 3 placeholder
Clockwise: corridor_forward → corridor_left → corridor_end → corridor_right. Opposite pairs: corridor_forward ↔ corridor_end; corridor_left ↔ corridor_right.

- `corridor_forward`: hall-axis / wall; ready. Unique source image retained.
- `corridor_left`: side-wall / door; placeholder. Duplicate or generic hall view does not match this facing.
- `corridor_end`: hall-axis / door; placeholder. Duplicate or generic hall view does not match this facing.
- `corridor_right`: side-wall / stairs; placeholder. Duplicate or generic hall view does not match this facing.

### Bar & Smoking Room — 1 ready / 3 placeholder
Clockwise: bar_counter → bar_booths → bar_windows → bar_door. Opposite pairs: bar_counter ↔ bar_windows; bar_booths ↔ bar_door.

- `bar_counter`: room-wall / bar; ready. Unique source image retained.
- `bar_booths`: room-wall / booths; placeholder. Previously room-matched copied placeholder.
- `bar_windows`: room-wall / window; placeholder. Previously room-matched copied placeholder.
- `bar_door`: room-wall / door; placeholder. Previously room-matched copied placeholder.

### Purser's Office — 1 ready / 3 placeholder
Clockwise: office_desk → office_cabinet → office_porthole → office_door. Opposite pairs: office_desk ↔ office_porthole; office_cabinet ↔ office_door.

- `office_desk`: room-wall / desk; ready. Unique source image retained.
- `office_cabinet`: room-wall / cabinets; placeholder. Previously room-matched copied placeholder.
- `office_porthole`: room-wall / porthole; placeholder. Previously room-matched copied placeholder.
- `office_door`: room-wall / door; placeholder. Previously room-matched copied placeholder.

### B-Deck Corridor — 3 ready / 1 placeholder
Clockwise: bdeck_corr_washdoor → bdeck_corr_stairs → bdeck_corr_office → bdeck_corr_cabins. Opposite pairs: bdeck_corr_washdoor ↔ bdeck_corr_office; bdeck_corr_stairs ↔ bdeck_corr_cabins.

- `bdeck_corr_washdoor`: side-wall / door; ready. New HF FLUX.1-schnell image, visually reviewed this pass.
- `bdeck_corr_stairs`: hall-axis / stairs; ready. New HF FLUX.1-schnell image, visually reviewed this pass.
- `bdeck_corr_office`: side-wall / door; ready. New HF FLUX.1-schnell image, visually reviewed this pass.
- `bdeck_corr_cabins`: hall-axis / door; placeholder. Previously room-matched copied placeholder.

### B Deck · Stair Landing — 0 ready / 4 placeholder
Clockwise: bdeck_stairs_door → bdeck_stairs_up → bdeck_stairs_bar → bdeck_stairs_wall. Opposite pairs: bdeck_stairs_door ↔ bdeck_stairs_bar; bdeck_stairs_up ↔ bdeck_stairs_wall.

- `bdeck_stairs_door`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `bdeck_stairs_up`: side-wall / stairs; placeholder. Previously room-matched copied placeholder.
- `bdeck_stairs_bar`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `bdeck_stairs_wall`: side-wall / notice; placeholder. Previously room-matched copied placeholder.

### B-Deck Corridor · Cabins — 0 ready / 4 placeholder
Clockwise: bdeck_cabins_door → bdeck_cabins_crew → bdeck_cabins_wall → bdeck_cabins_back. Opposite pairs: bdeck_cabins_door ↔ bdeck_cabins_wall; bdeck_cabins_crew ↔ bdeck_cabins_back.

- `bdeck_cabins_door`: side-wall / door; placeholder. Previously room-matched copied placeholder.
- `bdeck_cabins_crew`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `bdeck_cabins_wall`: side-wall / wall; placeholder. Previously room-matched copied placeholder.
- `bdeck_cabins_back`: hall-axis / door; placeholder. Previously room-matched copied placeholder.

### B Deck · Crew Door — 0 ready / 4 placeholder
Clockwise: crew_door_in → crew_door_sign → crew_door_hall → crew_door_pipes. Opposite pairs: crew_door_in ↔ crew_door_hall; crew_door_sign ↔ crew_door_pipes.

- `crew_door_in`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `crew_door_sign`: side-wall / notice; placeholder. Previously room-matched copied placeholder.
- `crew_door_hall`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `crew_door_pipes`: side-wall / pipes; placeholder. Previously room-matched copied placeholder.

### Passenger Cabin (A deck) — 1 ready / 3 placeholder
Clockwise: adeck_cabin → adeck_cabin_door → adeck_cabin_curtain → adeck_cabin_wardrobe. Opposite pairs: adeck_cabin ↔ adeck_cabin_curtain; adeck_cabin_door ↔ adeck_cabin_wardrobe.

- `adeck_cabin`: room-wall / bunks; ready. Unique source image retained.
- `adeck_cabin_door`: room-wall / door; placeholder. Previously room-matched copied placeholder.
- `adeck_cabin_curtain`: room-wall / curtain; placeholder. Previously room-matched copied placeholder.
- `adeck_cabin_wardrobe`: room-wall / wardrobe; placeholder. Previously room-matched copied placeholder.

### Keel Walkway — 1 ready / 3 placeholder
Clockwise: keel_walk → keel_hatch → keel_back → keel_up. Opposite pairs: keel_walk ↔ keel_back; keel_hatch ↔ keel_up.

- `keel_walk`: hall-axis / girders; ready. Unique source image retained.
- `keel_hatch`: side-wall / hatch; placeholder. Old picture shows a long glazed control vestibule, not a close outer-cover hatch side wall.
- `keel_back`: hall-axis / door; placeholder. Duplicate or generic hall view does not match this facing.
- `keel_up`: side-wall / gascell; placeholder. Previously room-matched copied placeholder.

### Control Car — 1 ready / 3 placeholder
Clockwise: control_helm → control_starboard → control_back → control_port. Opposite pairs: control_helm ↔ control_back; control_starboard ↔ control_port.

- `control_helm`: room-wall / helm; ready. Unique source image retained.
- `control_starboard`: room-wall / window; placeholder. Previously room-matched copied placeholder.
- `control_back`: room-wall / ladder; placeholder. Duplicate or generic hall view does not match this facing.
- `control_port`: room-wall / instruments; placeholder. Previously room-matched copied placeholder.

### High in the Rings — 1 ready / 3 placeholder
Clockwise: girder_nook → girder_nook_right → girder_nook_down → girder_nook_left. Opposite pairs: girder_nook ↔ girder_nook_down; girder_nook_right ↔ girder_nook_left.

- `girder_nook`: room-wall / girders; ready. Unique source image retained.
- `girder_nook_right`: room-wall / cables; placeholder. Previously room-matched copied placeholder.
- `girder_nook_down`: room-wall / ladder; placeholder. Previously room-matched copied placeholder.
- `girder_nook_left`: room-wall / gascell; placeholder. Previously room-matched copied placeholder.

### Keel Tour · tour_shoes — 0 ready / 4 placeholder
Clockwise: tour_shoes → tour_shoes_r → tour_shoes_back → tour_shoes_l. Opposite pairs: tour_shoes ↔ tour_shoes_back; tour_shoes_r ↔ tour_shoes_l.

- `tour_shoes`: hall-axis / girders; placeholder. Old picture lacks the safety gate / overshoe landmark.
- `tour_shoes_r`: side-wall / girders; placeholder. Previously room-matched copied placeholder.
- `tour_shoes_back`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `tour_shoes_l`: side-wall / safety; placeholder. Previously room-matched copied placeholder.

### Keel Tour · tour_cells — 0 ready / 4 placeholder
Clockwise: tour_cells → tour_cells_r → tour_cells_back → tour_cells_l. Opposite pairs: tour_cells ↔ tour_cells_back; tour_cells_r ↔ tour_cells_l.

- `tour_cells`: hall-axis / girders; placeholder. Old picture shows an enormous circular fan in a wood room, not an onward gas-cell catwalk axis.
- `tour_cells_r`: side-wall / cables; placeholder. Previously room-matched copied placeholder.
- `tour_cells_back`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `tour_cells_l`: side-wall / gascell; placeholder. Previously room-matched copied placeholder.

### Keel Tour · tour_tanks — 1 ready / 3 placeholder
Clockwise: tour_tanks → tour_tanks_r → tour_tanks_back → tour_tanks_l. Opposite pairs: tour_tanks ↔ tour_tanks_back; tour_tanks_r ↔ tour_tanks_l.

- `tour_tanks`: hall-axis / girders; ready. Unique source image retained.
- `tour_tanks_r`: side-wall / bunks; placeholder. Previously room-matched copied placeholder.
- `tour_tanks_back`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `tour_tanks_l`: side-wall / tank; placeholder. Previously room-matched copied placeholder.

### Keel Tour · tour_end — 1 ready / 3 placeholder
Clockwise: tour_end → tour_end_r → tour_end_back → tour_end_l. Opposite pairs: tour_end ↔ tour_end_back; tour_end_r ↔ tour_end_l.

- `tour_end`: hall-axis / girders; ready. Unique source image retained.
- `tour_end_r`: side-wall / hatch; placeholder. Previously room-matched copied placeholder.
- `tour_end_back`: hall-axis / door; placeholder. Previously room-matched copied placeholder.
- `tour_end_l`: side-wall / rope; placeholder. Previously room-matched copied placeholder.

## Every exact duplicate group BEFORE this change
SHA-256 equality, with all involved facing IDs (including the original anchor). The canonical source is retained only where its subject matches its facing. New generated files replace three members of the large door group; other unsuitable members use CSS pending regeneration. Near/same-view problems are also flagged below.

- `washroom_stall`, `washroom_wall`.

- `lounge_people`, `lounge_side`.

- `lounge_aft`, `promenade_aft`, `corridor_left`, `corridor_right`, `bdeck_corr_washdoor`, `bdeck_corr_stairs`, `bdeck_corr_office`, `bdeck_corr_cabins`, `bdeck_stairs_door`, `bdeck_stairs_up`, `bdeck_stairs_bar`, `bdeck_stairs_wall`, `bdeck_cabins_door`, `bdeck_cabins_crew`, `bdeck_cabins_back`, `bdeck_cabins_wall`, `crew_door_in`, `crew_door_hall`, `crew_door_sign`, `crew_door_pipes`, `control_back`.

- `promenade`, `promenade_side`, `promenade_far`.

- `corridor_forward`, `corridor_end`.

- `bar_counter`, `bar_booths`, `bar_windows`, `bar_door`.

- `office_desk`, `office_cabinet`, `office_porthole`, `office_door`.

- `adeck_cabin`, `adeck_cabin_door`, `adeck_cabin_curtain`, `adeck_cabin_wardrobe`.

- `keel_walk`, `keel_back`, `keel_up`.

- `control_helm`, `control_starboard`, `control_port`.

- `girder_nook`, `girder_nook_right`, `girder_nook_down`, `girder_nook_left`.

- `tour_shoes`, `tour_shoes_l`, `tour_shoes_r`, `tour_shoes_back`, `tour_cells_l`, `tour_cells_r`, `tour_cells_back`, `tour_tanks_l`, `tour_tanks_r`, `tour_tanks_back`, `tour_end_l`, `tour_end_r`, `tour_end_back`.

## Nonidentical but wrong view / geometry
- `keel_hatch`: long glazed vestibule instead of close hatch wall → placeholder.
- `tour_cells`: huge fan room instead of onward gas-cell catwalk → placeholder.
- `cabin_door`: full bunk-room panorama instead of close frontal exit wall → placeholder.
- `tour_shoes`: old room photo lacks overshoe/safety-gate landmark → placeholder.
- `corridor_forward` previously moved to `corridor_end` in the SAME location; now it looks toward a closed end bulkhead, forward disabled. Opposite axis `corridor_end` exits through the lounge entrance.
- Promenade and lounge glass windows no longer act as exits. The lounge writing wall has a real glazed promenade door; promenade inboard seating has the matching lounge doorway; aft axis has the return passage. Forward/aft are now opposite.
- Cabin-corridor crew/return axes are opposite; B-6 door and solid bulkhead are opposite.
- Crew vestibule keel/cabin axes are opposite; noticeboard and pipes are opposite.
- Tour onward/return axes are opposite at every stop; left and right are close structure/feature views.
- Climbing now puts the return exit on `girder_nook_down`, never on the Watcher wall.
- Legacy save aliases are mapped on restore AND travel; old CSS data-move targets no longer reference missing nodes.
- Crew tour offer, Watcher/climb, hatch/escape, washroom, note, cabin inspections and character interactions retained on the appropriate original facings.

## Reproduction
`python3 .pm/sync-facing-plan.py` regenerates tables/embedded graph/prompts/pending list. `node .pm/rotation-qa.mjs` tests desktop/mobile and produces actual-render thumbnails and `.pm/rotation-qa.json`; `python3 .pm/make-rotation-sheet.py` produces `.pm/rotation-sheet.png`. See QA report for network mode. Regeneration uses `.pm/art-facing-manifest.json` / `art-placeholders.json`, not stale success logs. No copied placeholder photograph is accepted as completion.
