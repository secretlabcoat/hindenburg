# V3 physical topology / navigation audit

## Scope and assumptions

This is a coherent FICTIONAL game arrangement inspired by the supplied cutaway, not a measured or historically exact Hindenburg reconstruction. The reference image was not copied/redistributed. Cell coordinates x increase starboard/east; y increase stern/south; north is bow. Cells have no claimed real-world metre scale. Rooms/corridors can span connected cells; navigation is room-to-room, not continuous tile walking. The player dot marks a room anchor and world heading, not exact footsteps.

Same 19 room identities / 76 original view IDs / 12 NPCs + unnamed player. Former Promenade is labelled Dining room / west promenade; lounge aggregate includes reading alcove/east promenade. Those are explicit subareas within existing location identities, not extra traversable locations. Individual historical room separation would require a later expanded location count.

Levels: B below A; keel/hull gallery above A; upper rings above keel; control car below B. The enclosed keel-to-control service ladder runs in a named aligned shaft outside occupied passenger-room footprints; it does not provide hidden stops in intervening decks.

## Exact room footprints and world-facing view IDs

|Room identity|Current label|Level|Occupied (x,y) cells|N, E, S, W view IDs|
|---|---|---|---|---|
|wash|B-Deck Washroom|B|(1, 3)|washroom_stall, washroom_basins, washroom_door, washroom_wall|
|b6|Cabin B-6 (B deck)|B|(0, 5), (0, 6)|cabin_bunk, cabin_door, cabin_window, cabin_desk|
|lounge|Lounge / reading room / east promenade|A|(3, 0), (3, 1), (3, 2), (3, 3), (4, 0), (4, 1), (4, 2), (4, 3)|lounge_windows, lounge_people, lounge_aft, lounge_side|
|dining|Dining room / west promenade|A|(0, 0), (0, 1), (0, 2), (0, 3)|promenade, promenade_side, promenade_far, promenade_aft|
|acorr|A-Deck Passenger Corridor|A|(2, 0), (2, 1), (2, 2), (2, 3), (1, 0), (1, 3)|corridor_forward, corridor_right, corridor_end, corridor_left|
|bar|Bar & Smoking Room|B|(3, 3)|bar_windows, bar_booths, bar_door, bar_counter|
|purser|Purser's Office|B|(4, 3)|office_porthole, office_cabinet, office_door, office_desk|
|bcorr|B-Deck Main Corridor|B|(1, 4), (2, 4), (3, 4), (4, 4)|bdeck_corr_washdoor, bdeck_corr_stairs, bdeck_corr_office, bdeck_corr_cabins|
|stairs|B-Deck Stair Landing|B|(2, 3)|bdeck_stairs_up, bdeck_stairs_wall, bdeck_stairs_door, bdeck_stairs_bar|
|bcab|B-Deck Cabin Corridor|B|(1, 5), (2, 5)|bdeck_cabins_wall, bdeck_cabins_crew, bdeck_cabins_back, bdeck_cabins_door|
|crew|B-Deck Crew Access|B|(3, 5)|crew_door_hall, crew_door_in, crew_door_pipes, crew_door_sign|
|acab|A-Deck Passenger Cabin|A|(1, 1), (1, 2)|adeck_cabin, adeck_cabin_curtain, adeck_cabin_wardrobe, adeck_cabin_door|
|keel|Keel Service Walkway|K|(3, 1), (3, 0), (3, -1)|keel_up, keel_walk, keel_hatch, keel_back|
|control|Control Car|C|(3, -1)|control_helm, control_starboard, control_back, control_port|
|nook|Upper Rings / Watcher|U|(3, 4)|girder_nook, girder_nook_right, girder_nook_down, girder_nook_left|
|shoes|Keel Entry / Overshoes|K|(3, 5)|tour_shoes_l, tour_shoes, tour_shoes_r, tour_shoes_back|
|cells|Gas-Cell Tour Gallery|K|(3, 4)|tour_cells_l, tour_cells, tour_cells_r, tour_cells_back|
|tanks|Fuel / Ballast Gallery|K|(3, 3)|tour_tanks_l, tour_tanks, tour_tanks_r, tour_tanks_back|
|tourend|Forward Tour Landing|K|(3, 2)|tour_end_l, tour_end, tour_end_r, tour_end_back|

## Exact reciprocal connections

All horizontal portals lie on a shared cell boundary. No overlap, diagonal crossing or long-distance edge is accepted. Stairs/ladders are the ONLY inter-level connections and occupy the same x,y shaft point in each endpoint footprint. Moving preserves world heading; the return door is behind the player after entering, so turning 180 degrees is required to go back. On a wall with several corridor doors, labelled doorway choices identify each destination; ↑ uses the first available labelled door.

|Connection|A facing → B / reverse wall|Kind|Shared doorway or shaft point|Gate / description|
|---|---|---|---|---|
|wash ↔ bcorr|S → S / return N|door|(1.5, 4.0)|Door|
|bcorr ↔ stairs|N → N / return S|door|(2.5, 4.0)|Door|
|bcorr ↔ bar|N → N / return S|door|(3.5, 4.0)|Door|
|bcorr ↔ purser|N → N / return S|door|(4.5, 4.0)|Door|
|bcorr ↔ bcab|S → S / return N|door|(1.5, 5.0)|Door|
|bcab ↔ b6|W → W / return E|door|(1.0, 5.5)|Door|
|bcab ↔ crew|E → E / return W|door|(3.0, 5.5)|Door|
|bcorr ↔ crew|S → S / return N|door|(3.5, 5.0)|Door|
|acorr ↔ acab|W → W / return E|door|(2.0, 1.5)|Door|
|acorr ↔ lounge|E → E / return W|door|(3.0, 0.5)|Door|
|acorr ↔ dining|W → W / return E|door|(1.0, 0.5)|Door|
|shoes ↔ cells|N → N / return S|door|(3.5, 5.0)|Door|
|cells ↔ tanks|N → N / return S|door|(3.5, 4.0)|Door|
|tanks ↔ tourend|N → N / return S|door|(3.5, 3.0)|Door|
|tourend ↔ keel|N → N / return S|door|(3.5, 2.0)|Door|
|stairs ↔ acorr|N → N / return S|vertical|(2.5, 3.5)|Passenger stairs|
|crew ↔ shoes|E → E / return W|vertical|(3.5, 5.5)|Crew ladder: B deck ↔ keel|
|cells ↔ nook|E → E / return W|vertical|(3.5, 4.5)|Gas-cell ladder: keel ↔ upper rings · watcher-noticed|
|keel ↔ control|N → N / return S|vertical|(3.5, -0.5)|Enclosed service ladder: keel ↔ control car|

## Actual edge changes versus V2, every original facing

The legacy raw camera table is bootstrap data only. Final V3 configure() derives all runtime nodes.left/right/forward/name/facing/art flags from topology-v3.json. All original data-move hotspots and generic stale exits are removed each draw. Visible scene doorway buttons, movement choices, compass, map walls/doors and ↑ availability use the same topology. Global travel() rejects any non-adjacent/non-turn target. Legacy tour/climb actions now use matching adjacent connectors; Return-to-lounge teleport replaced by Turn around. Start/New Voyage and explicit save restoration are intentional state initialization, not travel.

|View ID|V2 forward target|V3 destinations on this world-facing wall|
|---|---|---|
|washroom_stall|none|wall / no doorway|
|washroom_basins|none|wall / no doorway|
|washroom_door|bdeck_corr_washdoor|bdeck_corr_office (bcorr)|
|washroom_wall|none|wall / no doorway|
|cabin_bunk|none|wall / no doorway|
|cabin_window|none|wall / no doorway|
|cabin_door|bdeck_cabins_door|bdeck_cabins_crew (bcab)|
|cabin_desk|none|wall / no doorway|
|lounge_windows|none|wall / no doorway|
|lounge_people|none|wall / no doorway|
|lounge_side|promenade_side|corridor_left (acorr)|
|lounge_aft|corridor_forward|wall / no doorway|
|promenade|none|wall / no doorway|
|promenade_far|none|wall / no doorway|
|promenade_side|lounge_side|corridor_right (acorr)|
|promenade_aft|lounge_windows|wall / no doorway|
|corridor_forward|none|wall / no doorway|
|corridor_left|adeck_cabin|adeck_cabin_door (acab), promenade_aft (dining)|
|corridor_end|lounge_aft|bdeck_stairs_door (stairs)|
|corridor_right|bdeck_stairs_up|lounge_people (lounge)|
|bar_counter|none|wall / no doorway|
|bar_booths|none|wall / no doorway|
|bar_windows|none|wall / no doorway|
|bar_door|bdeck_stairs_bar|bdeck_corr_office (bcorr)|
|office_desk|none|wall / no doorway|
|office_cabinet|none|wall / no doorway|
|office_porthole|none|wall / no doorway|
|office_door|bdeck_corr_office|bdeck_corr_office (bcorr)|
|bdeck_corr_washdoor|washroom_door|washroom_stall (wash), bdeck_stairs_up (stairs), bar_windows (bar), office_porthole (purser)|
|bdeck_corr_stairs|bdeck_stairs_door|wall / no doorway|
|bdeck_corr_office|office_door|bdeck_cabins_back (bcab), crew_door_pipes (crew)|
|bdeck_corr_cabins|bdeck_cabins_back|wall / no doorway|
|bdeck_stairs_door|bdeck_corr_stairs|bdeck_corr_office (bcorr)|
|bdeck_stairs_up|corridor_right|corridor_forward (acorr)|
|bdeck_stairs_bar|bar_door|wall / no doorway|
|bdeck_stairs_wall|none|wall / no doorway|
|bdeck_cabins_door|cabin_door|cabin_desk (b6)|
|bdeck_cabins_crew|crew_door_in|crew_door_in (crew)|
|bdeck_cabins_wall|none|bdeck_corr_washdoor (bcorr)|
|bdeck_cabins_back|bdeck_corr_cabins|wall / no doorway|
|crew_door_in|keel_walk|tour_shoes (shoes)|
|crew_door_sign|none|bdeck_cabins_door (bcab)|
|crew_door_hall|bdeck_cabins_crew|bdeck_corr_washdoor (bcorr)|
|crew_door_pipes|none|wall / no doorway|
|adeck_cabin|none|wall / no doorway|
|adeck_cabin_door|corridor_left|wall / no doorway|
|adeck_cabin_curtain|none|corridor_right (acorr)|
|adeck_cabin_wardrobe|none|wall / no doorway|
|keel_walk|control_helm|wall / no doorway|
|keel_hatch|none|tour_end_r (tourend)|
|keel_back|crew_door_in|wall / no doorway|
|keel_up|none|control_helm (control)|
|control_helm|none|wall / no doorway|
|control_starboard|none|wall / no doorway|
|control_back|keel_walk|keel_hatch (keel)|
|control_port|none|wall / no doorway|
|girder_nook|none|wall / no doorway|
|girder_nook_right|none|wall / no doorway|
|girder_nook_down|keel_back|wall / no doorway|
|girder_nook_left|none|tour_cells_back (cells)|
|tour_shoes|tour_cells|wall / no doorway|
|tour_shoes_r|none|wall / no doorway|
|tour_shoes_back|none|crew_door_sign (crew)|
|tour_shoes_l|none|tour_cells_l (cells)|
|tour_cells|tour_tanks|girder_nook_right (nook)|
|tour_cells_r|none|tour_shoes_r (shoes)|
|tour_cells_back|none|wall / no doorway|
|tour_cells_l|none|tour_tanks_l (tanks)|
|tour_tanks|tour_end|wall / no doorway|
|tour_tanks_r|none|tour_cells_r (cells)|
|tour_tanks_back|none|wall / no doorway|
|tour_tanks_l|none|tour_end_l (tourend)|
|tour_end|keel_walk|wall / no doorway|
|tour_end_r|none|tour_tanks_r (tanks)|
|tour_end_back|none|wall / no doorway|
|tour_end_l|none|keel_up (keel)|

44 original forward targets differ from the V3 primary target; additional same-wall doorway choices are explicitly listed above. All right/left rings are rebuilt as fixed N→E→S→W within the same room.

## Story gates / explicit exceptions

- Gas-cell glimmer inspection still unlocks upper-rings ladder. The Watcher remains a fictional nonhuman speaking entity, not a teleport excuse. Access is a physical ladder above the gas-cell gallery only; no dynamic return jump to an unrelated keel view.
- Guided tours still require the crew gathering point and original evening window (clock 8–15, not previously toured). Ordinary crew service access was already available without tour in source and remains available, now via the actual ladder and successive galleries rather than crew-door→distant-keel jump.
- Hanging back now means walking from adjacent forward tour landing into keel walkway. Bunny toured/trust state retained.
- Bunny hatch remains a gated external ESCAPE ENDING requiring arranged route and approach. It is explicitly described as outside the ship, not a normal room doorway or hidden map teleport.
- Inventory, cast, live AI relay allowlist/status/fallback, endings and trust state retained. The source has no extra key-operated navigation locks to migrate.

## Art and UI

All 21 original embedded room-image bytes are preserved in the file; only 7 camera views remain enabled after topology changes: washroom_stall, washroom_basins, washroom_door, cabin_bunk, cabin_window, cabin_desk, control_helm. Other 69 facings use honest CSS fallback until art is reviewed against new topology. No art is stretched/reused for a different doorway, no new art generated. Original Toxu portrait remains.

New floor plan draws filled cell footprints and actual boundary walls/door gaps. Named vertical shafts marked violet. Deck selector marks current level, keeps manually selected other level until deck changes, and displays current compass/room. It is a bounded scrollable normal-flow drawer; no floor-plan clicking/fast travel. Common grid labels allow floor-to-floor shaft comparison. Current dot autoscrolls into view when entering a room/opening drawer.

Desktop inventory moved to its own full-width flex-wrapped row with explicit minimum item sizes/captions; no implicit third grid column or emoji/label overlap. Phone captions wrap instead of overflowing.

## Saves and version migration

Save key stays hindenburg_playable_20261107_v1; existing ai/claims/items/log/time/turns fields preserved. V3 adds only topologyVersion:3. A V2 save keeps its exact view ID, hence original room identity, but view ID now maps to a fixed world direction; migration message explicitly explains reorientation. No silent reset. Marker is persisted immediately. Different browser/file origins may still have separate storage. Do not open V2 again expecting its old geometry to interpret a V3 world heading; room IDs remain readable but geometry is versioned.

## Tests and limitations

149 geometry/topology assertions: 19 rooms/76 views; every occupied cell non-overlapping; dot anchor within room; every horizontal door on shared wall with correct facing; every vertical connector aligned/named; opposite return headings; reachability 18 rooms before Watcher clue / all19 after clue.

DOM regression exercises all76 turns, all19 reciprocal edges, every scene/UI exit consistency, long gameplay routes, stairs/control, clue ladder, guided tour, Bunny escape, V2 save migration, and floor selectors. For exhaustive all-room cycles only, the clock ending was stubbed in the test environment to avoid ending the run before topology coverage; normal build clock remains unchanged. Separate story-gate tests use original ending logic. Read dom-test-results.json for latest pass count. No real-browser layout/audio test claimed. Parent must open final file in desktop Chrome / phone-sized viewport.

Live relay code/CSP and 21 image data mappings are byte-identical to V2. V2 endpoint HTTP200/CORS evidence retained; no new production worker changes, credentials, or deployment. Browser live AI worked for parent in V2; V3 browser testing still pending.

Build is isolated; V2/original uploads/import archives/production GitHub/Mac source untouched.


## Map usability patch after initial Chrome spatial pass
Topology, gate rules, live AI and all original game script blocks remain unchanged. Center uses rendered dot/scroll rectangles (including border and prior scroll), never raw SVG units or outer-ancestor scrolling. Removed300px minimum inflation on narrow decks; explicit SVG width/height. Active dot re-centered on open/deck-entry/current-level-selection/window or pane resize. Phone drawer174px, scene minimum180px, bounded scrolling transcript,76px verb column. Parent initial desktop spatial/live tests passed; patch-specific desktop/mobile visual retest pending. See `map-layout-test-results.json`.
