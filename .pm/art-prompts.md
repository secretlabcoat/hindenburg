# Hindenburg art generation prompts — authoritative 76-facing plan

## Style bible — global lock

first-person pre-rendered 3D CGI, mid-1990s adventure game, Titanic Adventure Out of Time style reference only; period-accurate 1937 LZ 129 Hindenburg Art Deco, warm tungsten practical lighting, soft grain and gentle plastic sheen. Eye-level 50mm equivalent camera, same horizon and camera height for all four facings. No modern objects, electronics, readable text, logos, watermarks or UI. Not an ocean liner.

## Physical framing rules
- Every location has four 90° facings; a hallway has two OPPOSITE long axial views and two OPPOSITE close perpendicular side walls.
- Side walls: front-on elevation, shallow floor strip, no long hallway or vanishing point. A visible actual door may be entered; a solid wall/window may not.
- Rooms: four specific walls, no repeated full-room panorama. Same material kit and eye height across a location; adjacent seeds help but do not guarantee geometry.
- Each facing has a unique prompt below and in `art-facing-manifest.json`. Legacy style prompts are superseded.
- Render 768×432, FLUX.1-schnell, 4 steps, WebP <150 KB, no text/watermarks, no modern objects, people only where explicitly requested.

## Routine / regeneration contract
`art-facing-manifest.json` is the source of truth; `art-placeholders.json` is the generated pending list. Do NOT infer completion from a WebP existing: wrong copied files remain on disk for history but are NOT displayed.
Use `.pm/generate-facing-art.py --limit 10` with HF_TOKEN then HF_TOKEN_2 from environment; stop once both quotas are exhausted, no repeated quota retries. Each image requires visual review: generated output remains a candidate until accepted. After review set `facings[id].status="ready"`, update SHA-256, run `python3 .pm/sync-facing-plan.py`, commit images, then pin ART_COMMIT to that asset commit. Sync writes the old `/workspace/scratch/hb-art/{need,nodes,placeholders}.json` mirrors used by the existing routine; old generation logs must not cause current placeholders to be skipped. CSS remains visible for pending or failed photos. Never fall back to a different facing's image. Never deploy automatically.

## B-Deck Washroom

Material lock: Teal glazed tiles, black-and-white check floor, chrome fittings, dark wood door. Seed family: 1000. Clockwise: washroom_stall → washroom_basins → washroom_door → washroom_wall.

### washroom_stall — ready / room-wall

Seed 1000; `assets/art/washroom_stall.webp`. Unique source image retained.

**Append to global + material lock:** Striped shower curtain and chrome shower head on the north tiled wall; no basin or door centered.

### washroom_basins — ready / room-wall

Seed 1001; `assets/art/washroom_basins.webp`. Unique source image retained.

**Append to global + material lock:** East wall: two white porcelain basins below a single wide mirror, chrome taps, tile visible at edges.

### washroom_door — ready / room-wall

Seed 1002; `assets/art/washroom_door.webp`. Unique source image retained.

**Append to global + material lock:** South wall: one closed dark wood exit door with brass latch and a shallow tile threshold, no corridor beyond.

### washroom_wall — placeholder / room-wall

Seed 1003; `assets/art/washroom_wall.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** West wall: blank teal tile, a horizontal chrome towel rail and two folded white towels; no basin, shower or doorway.

## Cabin B-6 (B deck)

Material lock: Compact B-6 cabin, honey wood veneer, cream ceiling, brass fittings, made-up linen berths. Seed family: 1100. Clockwise: cabin_bunk → cabin_window → cabin_door → cabin_desk.

### cabin_bunk — ready / room-wall

Seed 1100; `assets/art/cabin_bunk.webp`. Unique source image retained.

**Append to global + material lock:** North wall: two made-up berths and a steamer suitcase below; upper and lower linen beds fill frame.

### cabin_window — ready / room-wall

Seed 1101; `assets/art/cabin_window.webp`. Unique source image retained.

**Append to global + material lock:** East wall: one square rounded-corner cabin observation window, pale daylight, a bell push at right; not another bunk view.

### cabin_door — placeholder / room-wall

Seed 1102; `assets/art/cabin_door.webp`. Whole bunk-room view, not a close frontal exit wall.

**Append to global + material lock:** South wall: close front-on cabin exit door with brass handle, only a sliver of bunk at left; no full-room or hallway perspective.

### cabin_desk — ready / room-wall

Seed 1103; `assets/art/cabin_desk.webp`. Unique source image retained.

**Append to global + material lock:** West wall: fold-down writing desk on right and white washbasin niche at left, glass of water, blank timetable, no computers.

## Passenger Lounge

Material lock: Mahogany trim, cream panels, warm brass sconces, patterned carpet, low Art Deco armchairs. Seed family: 1200. Clockwise: lounge_windows → lounge_people → lounge_side → lounge_aft.

### lounge_windows — ready / room-wall

Seed 1200; `assets/art/lounge_windows.webp`. Unique source image retained.

**Append to global + material lock:** North wall: broad slanted observation windows over clouds, low armchairs at edges, no door or walk-through opening.

### lounge_people — ready / room-wall

Seed 1201; `assets/art/lounge_people.webp`. Unique source image retained.

**Append to global + material lock:** East wall: two armchairs around a low table, two period-dressed female passengers as mid-90s CGI figures, framed landscape behind.

### lounge_side — placeholder / room-wall

Seed 1202; `assets/art/lounge_side.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** South wall: writing alcove with narrow table and upholstered settee at left, an actual glazed promenade door at right; distinct from east seating view.

### lounge_aft — placeholder / room-wall

Seed 1203; `assets/art/lounge_aft.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** West wall: a single aft exit doorway to A-deck corridor, cream panel surround and amber sconces; close elevation, not a long passage.

## Promenade

Material lock: Long slanted observation glazing, mahogany handrail, cream inboard paneling, wicker seating, cloud daylight. Seed family: 1300. Clockwise: promenade → promenade_far → promenade_side → promenade_aft.

### promenade — placeholder / side-wall

Seed 1300; `assets/art/promenade.webp`. Old long axial promenade view is wrong for a perpendicular observation-window side wall.

**Append to global + material lock:** OUTBOARD wall perpendicular to walkway: close broad slanted observation window and brass handrail, clouds outside, no walk-through opening.

### promenade_far — ready / hall-axis

Seed 1301; `assets/art/promenade_far.webp`. Canonical long forward-axis promenade image retained; copied side-wall versions disabled.

**Append to global + material lock:** FORWARD axis: long narrow promenade receding to a closed forward end bulkhead and small end window, glazing on left, seating on right; no exit at this end.

### promenade_side — placeholder / side-wall

Seed 1302; `assets/art/promenade_side.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** INBOARD wall perpendicular to walkway: wicker settee, one framed route map and a real glazed lounge door to the right; no vanishing hallway.

### promenade_aft — placeholder / hall-axis

Seed 1303; `assets/art/promenade_aft.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** AFT axis opposite forward: long promenade to an open return passage into the lounge at distant end, glazing now on right and seating on left.

## Passenger Corridor

Material lock: A-deck mahogany and cream cabin panels, muted patterned carpet runner, identical brass amber sconces. Seed family: 1400. Clockwise: corridor_forward → corridor_left → corridor_end → corridor_right.

### corridor_forward — ready / hall-axis

Seed 1400; `assets/art/corridor_forward.webp`. Unique source image retained.

**Append to global + material lock:** FORWARD axis: straight long cabin corridor to a blank closed end bulkhead, cabin doors at both sides, one-point perspective. No exit in the end wall.

### corridor_left — placeholder / side-wall

Seed 1401; `assets/art/corridor_left.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** PORT side wall: a single A-deck cabin door close and front-on, brass handle, one sconce at left and cream panel at right. No view down a corridor.

### corridor_end — placeholder / hall-axis

Seed 1402; `assets/art/corridor_end.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** AFT axis opposite forward: long cabin corridor with an open passenger lounge entrance at far end, a small carpet medallion at threshold; not the forward closed-end view.

### corridor_right — placeholder / side-wall

Seed 1403; `assets/art/corridor_right.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** STARBOARD side wall: close transverse stairwell opening with a brass rail and first steps descending, cream surround; not a long hallway or another cabin door.

## Bar & Smoking Room

Material lock: Dark polished wood, leather seats, brass footrail, bottle shelving, amber practical lamps. Seed family: 1500. Clockwise: bar_counter → bar_booths → bar_windows → bar_door.

### bar_counter — ready / room-wall

Seed 1500; `assets/art/bar_counter.webp`. Unique source image retained.

**Append to global + material lock:** North wall: bar counter and brass footrail, bottle shelves behind, leather stools in foreground; counter-centered composition.

### bar_booths — placeholder / room-wall

Seed 1501; `assets/art/bar_booths.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** East wall: a pair of high-backed oxblood leather booths and small round tables under a mirror; no bar counter.

### bar_windows — placeholder / room-wall

Seed 1502; `assets/art/bar_windows.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** South wall: three compact smoking-room observation windows, brass ashtray stand and low leather bench, cloud daylight.

### bar_door — placeholder / room-wall

Seed 1503; `assets/art/bar_door.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** West wall: closed pressure-lock exit door to stair landing with metal surround and brass latch; shallow floor, no bar or corridor perspective.

## Purser's Office

Material lock: Small oak-paneled purser office, brass lamp, paper ledger, filing cabinets, single porthole, no electronics. Seed family: 1600. Clockwise: office_desk → office_cabinet → office_porthole → office_door.

### office_desk — ready / room-wall

Seed 1600; `assets/art/office_desk.webp`. Unique source image retained.

**Append to global + material lock:** North wall: oak purser desk with paper ledger, fountain pen and brass lamp, chair behind, no computer or keyboard.

### office_cabinet — placeholder / room-wall

Seed 1601; `assets/art/office_cabinet.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** East wall: tall filing cabinet with many shallow drawers and a wall shelf of bound paper ledgers; no desk centered.

### office_porthole — placeholder / room-wall

Seed 1602; `assets/art/office_porthole.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** South wall: single brass-rimmed porthole, a chronometer on its right and a narrow radiator beneath; close wall, not desk view.

### office_door — placeholder / room-wall

Seed 1603; `assets/art/office_door.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** West wall: closed wood door to B-deck corridor, brass coat hook with cap at left, no view down corridor.

## B-Deck Corridor

Material lock: B-deck dark lacquered wood, cream panel insets, brass hardware, warm tungsten sconces, dark carpet. Seed family: 1700. Clockwise: bdeck_corr_washdoor → bdeck_corr_stairs → bdeck_corr_office → bdeck_corr_cabins.

### bdeck_corr_washdoor — ready / side-wall

Seed 1700; `assets/art/bdeck_corr_washdoor.webp`. New HF FLUX.1-schnell image, visually reviewed this pass.

**Append to global + material lock:** PORT SIDE WALL: camera one metre from a closed washroom door centered in flat paneling, chrome door vent, amber sconce at left, black-and-white tile threshold. No vanishing passage.

### bdeck_corr_stairs — ready / hall-axis

Seed 1701; `assets/art/bdeck_corr_stairs.webp`. New HF FLUX.1-schnell image, visually reviewed this pass.

**Append to global + material lock:** FORWARD AXIS: long straight passage to stair landing at far end, carpet runner receding under sconces, a short ascending stair flight visible ahead. Washroom door near left, office door near right. No intersections.

### bdeck_corr_office — ready / side-wall

Seed 1702; `assets/art/bdeck_corr_office.webp`. New HF FLUX.1-schnell image, visually reviewed this pass.

**Append to global + material lock:** STARBOARD SIDE WALL: single closed purser office door, brass mail slot, small frosted pane, brass clock at right, short noticeboard at left, shallow floor strip. No corridor perspective.

### bdeck_corr_cabins — placeholder / hall-axis

Seed 1703; `assets/art/bdeck_corr_cabins.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite stairs: long straight passage toward new cabin section and twin narrow end doors; washroom on right and office on left. No staircase in this direction, no junction.

## B Deck · Stair Landing

Material lock: Dark wood stair landing, cream inset panels, continuous brass stair rail, warm lamp. Seed family: 1800. Clockwise: bdeck_stairs_door → bdeck_stairs_up → bdeck_stairs_bar → bdeck_stairs_wall.

### bdeck_stairs_door — placeholder / hall-axis

Seed 1800; `assets/art/bdeck_stairs_door.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** FORWARD landing axis: short straight approach back into B-deck corridor, one open rectangular passage centered, railing edge at right.

### bdeck_stairs_up — placeholder / side-wall

Seed 1801; `assets/art/bdeck_stairs_up.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD transverse wall: stairs ascending directly away through a close stair opening to A deck, brass handrail at left; not a long hallway.

### bdeck_stairs_bar — placeholder / hall-axis

Seed 1802; `assets/art/bdeck_stairs_bar.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT landing axis opposite corridor opening: short approach to the smoking-room pressure door, metal surround and glazed transom visible.

### bdeck_stairs_wall — placeholder / side-wall

Seed 1803; `assets/art/bdeck_stairs_wall.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT wall close-up: lacquered cream-inset bulkhead with a framed deck plan and brass sconce, no door or passage.

## B-Deck Corridor · Cabins

Material lock: Quiet B-deck cabin passage, dark wood panels, cream door inserts, brass handles, dark runner. Seed family: 1900. Clockwise: bdeck_cabins_door → bdeck_cabins_crew → bdeck_cabins_wall → bdeck_cabins_back.

### bdeck_cabins_door — placeholder / side-wall

Seed 1900; `assets/art/bdeck_cabins_door.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT wall: close frontal B-6 cabin door with a small blank number plate, brass knob, one adjacent cream panel; no hallway depth.

### bdeck_cabins_crew — placeholder / hall-axis

Seed 1901; `assets/art/bdeck_cabins_crew.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** FORWARD AXIS: narrow straight cabin passage toward a dark crew-only threshold at far end, B-6 door on left, brass sconces recede.

### bdeck_cabins_wall — placeholder / side-wall

Seed 1902; `assets/art/bdeck_cabins_wall.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD wall: close uninterrupted wood bulkheads, inset cream panels, one amber sconce and low ventilation grille, no door or corridor opening.

### bdeck_cabins_back — placeholder / hall-axis

Seed 1903; `assets/art/bdeck_cabins_back.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite crew threshold: long return view toward the brighter washroom/office corridor, B-6 door now on right, no crew door ahead.

## B Deck · Crew Door

Material lock: Tiny crew vestibule, dull wood and grey metal, exposed service pipes, crew noticeboard, industrial light. Seed family: 2000. Clockwise: crew_door_in → crew_door_sign → crew_door_hall → crew_door_pipes.

### crew_door_in — placeholder / hall-axis

Seed 2000; `assets/art/crew_door_in.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** FORWARD AXIS of tiny vestibule: utilitarian crew door through to keel catwalk, metal threshold, small lamp above, pipes at edges.

### crew_door_sign — placeholder / side-wall

Seed 2001; `assets/art/crew_door_sign.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD close side wall: crew safety noticeboard with illegible paper cards and felt-overshoe shelf beneath, no door or receding passage.

### crew_door_hall — placeholder / hall-axis

Seed 2002; `assets/art/crew_door_hall.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite keel door: short vestibule return opening into wood cabin corridor, warm cabin sconces visible beyond.

### crew_door_pipes — placeholder / side-wall

Seed 2003; `assets/art/crew_door_pipes.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT close side wall: three grey service pipes, red valve wheel and small brass pressure gauge, shallow metal deck strip; no exit.

## Passenger Cabin (A deck)

Material lock: Windowless compact cabin, pale veneer, cream berth curtains, brass latch, warm small lamp. Seed family: 2100. Clockwise: adeck_cabin → adeck_cabin_door → adeck_cabin_curtain → adeck_cabin_wardrobe.

### adeck_cabin — ready / room-wall

Seed 2100; `assets/art/adeck_cabin.webp`. Unique source image retained.

**Append to global + material lock:** North wall: upper and lower compact berths, a small suitcase and neatly folded blanket; no windows.

### adeck_cabin_door — placeholder / room-wall

Seed 2101; `assets/art/adeck_cabin_door.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** East wall: one close wood exit door, plain brass latch and shoes below, just a sliver of berth edge; not whole bunk room.

### adeck_cabin_curtain — placeholder / room-wall

Seed 2102; `assets/art/adeck_cabin_curtain.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** South wall: closed cream berth/privacy curtain with narrow pelmet, hem above small floor strip, no door, no window.

### adeck_cabin_wardrobe — placeholder / room-wall

Seed 2103; `assets/art/adeck_cabin_wardrobe.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** West wall: shallow wardrobe niche with two hanging coats, washbasin shelf and small lamp; no full-room or bunk perspective.

## Keel Walkway

Material lock: Aluminum ring trusses, grey gas-cell fabric, narrow metal catwalk, warm industrial cage lamps. Seed family: 2200. Clockwise: keel_walk → keel_hatch → keel_back → keel_up.

### keel_walk — ready / hall-axis

Seed 2200; `assets/art/keel_walk.webp`. Unique source image retained.

**Append to global + material lock:** FORWARD AXIS: narrow keel catwalk receding through repeated aluminum rings toward descent to control car, handrails both sides.

### keel_hatch — placeholder / side-wall

Seed 2201; `assets/art/keel_hatch.webp`. Old picture shows a long glazed control vestibule, not a close outer-cover hatch side wall.

**Append to global + material lock:** STARBOARD side: close metal-framed outer-cover hatch, bolts and handwheel, glimpse of blue sky at seam, railing at bottom; no long walkway centered.

### keel_back — placeholder / hall-axis

Seed 2202; `assets/art/keel_back.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** AFT AXIS opposite control car: catwalk returning to the B-deck crew vestibule door at distant end, rectangular door replaces forward ring view.

### keel_up — placeholder / side-wall

Seed 2203; `assets/art/keel_up.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT side wall: close curved grey gas-cell fabric immediately beyond diagonal aluminum bracing, one cage lamp, railing at bottom; no vanishing catwalk, no vertical camera tilt.

## Control Car

Material lock: Polished wood gondola, brass analog instruments, broad cloud windows, dark wheel, warm lamps. Seed family: 2300. Clockwise: control_helm → control_starboard → control_back → control_port.

### control_helm — ready / room-wall

Seed 2300; `assets/art/control_helm.webp`. Unique source image retained.

**Append to global + material lock:** Forward wall: steering wheel and engine telegraphs below wide forward windows over clouds, all 1937 analog hardware.

### control_starboard — placeholder / room-wall

Seed 2301; `assets/art/control_starboard.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** Starboard wall: close bank of slanted gondola side windows with clouds and part of brass handrail, no helm centered.

### control_back — placeholder / room-wall

Seed 2302; `assets/art/control_back.webp`. Duplicate or generic hall view does not match this facing.

**Append to global + material lock:** Aft wall: close vertical ladder through ceiling hatch up to keel, wood bulkhead and safety rail; not a wood passenger hallway.

### control_port — placeholder / room-wall

Seed 2303; `assets/art/control_port.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** Port wall: close analog brass gauge bank, engine-order dial, chart shelf and red valve handle, no central helm or wide window view.

## High in the Rings

Material lock: Cramped aluminum ring nook, fabric cells close on both sides, sparse warm cage light, deep shadows. Seed family: 2400. Clockwise: girder_nook → girder_nook_right → girder_nook_down → girder_nook_left.

### girder_nook — ready / room-wall

Seed 2400; `assets/art/girder_nook.webp`. Unique source image retained.

**Append to global + material lock:** Forward face: cramped truss opening, small mysterious shape half-hidden behind cross-bracing, no broad passenger room.

### girder_nook_right — placeholder / room-wall

Seed 2401; `assets/art/girder_nook_right.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** Right face: close cable run clipped to aluminum ring, one junction box and dark fabric beyond, no long hallway.

### girder_nook_down — placeholder / room-wall

Seed 2402; `assets/art/girder_nook_down.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** Rear face: ladder descending toward distant catwalk lamps, handhold at eye level, actual climb-down opening.

### girder_nook_left — placeholder / room-wall

Seed 2403; `assets/art/girder_nook_left.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** Left face: close curved gas-cell fabric and diagonal truss joints disappearing into shadow, no watcher or ladder.

## Keel Tour · tour_shoes

Material lock: Escorted keel tour stop 1, aluminum trusses, grey gas-cell fabric, metal catwalk, warm cage lamps. Seed family: 2500. Clockwise: tour_shoes → tour_shoes_r → tour_shoes_back → tour_shoes_l.

### tour_shoes — placeholder / hall-axis

Seed 2500; `assets/art/tour_shoes.webp`. Old picture lacks the safety gate / overshoe landmark.

**Append to global + material lock:** FORWARD AXIS: straight catwalk toward next tour stop; felt overshoe rack beside safety gate flanks the route, centered walkway and one-point perspective, a clear onward opening.

### tour_shoes_r — placeholder / side-wall

Seed 2501; `assets/art/tour_shoes_r.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD side: close riveted ring cross-braces and single utility lamp, no door or long passage.

### tour_shoes_back — placeholder / hall-axis

Seed 2502; `assets/art/tour_shoes_back.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite tour progress: return catwalk toward the crew entrance, different distant landmark, no feature from forward end centered.

### tour_shoes_l — placeholder / side-wall

Seed 2503; `assets/art/tour_shoes_l.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT side: close felt-overshoe rack and safety cards, metal shelf, no walkway depth.

## Keel Tour · tour_cells

Material lock: Escorted keel tour stop 2, aluminum trusses, grey gas-cell fabric, metal catwalk, warm cage lamps. Seed family: 2600. Clockwise: tour_cells → tour_cells_r → tour_cells_back → tour_cells_l.

### tour_cells — placeholder / hall-axis

Seed 2600; `assets/art/tour_cells.webp`. Old picture shows an enormous circular fan in a wood room, not an onward gas-cell catwalk axis.

**Append to global + material lock:** FORWARD AXIS: straight catwalk toward next tour stop; enormous gas-cell ring beyond railing flanks the route, centered walkway and one-point perspective, a clear onward opening.

### tour_cells_r — placeholder / side-wall

Seed 2601; `assets/art/tour_cells_r.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD side: vertical cable bundle, truss junctions and grey fabric seam, no forward catwalk.

### tour_cells_back — placeholder / hall-axis

Seed 2602; `assets/art/tour_cells_back.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite tour progress: return catwalk toward overshoe gate, different distant landmark, no feature from forward end centered.

### tour_cells_l — placeholder / side-wall

Seed 2603; `assets/art/tour_cells_l.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT side: huge curved gas-cell fabric and close diagonal aluminum truss, railing at bottom, no vanishing catwalk.

## Keel Tour · tour_tanks

Material lock: Escorted keel tour stop 3, aluminum trusses, grey gas-cell fabric, metal catwalk, warm cage lamps. Seed family: 2700. Clockwise: tour_tanks → tour_tanks_r → tour_tanks_back → tour_tanks_l.

### tour_tanks — ready / hall-axis

Seed 2700; `assets/art/tour_tanks.webp`. Unique source image retained.

**Append to global + material lock:** FORWARD AXIS: straight catwalk toward next tour stop; cylindrical diesel and ballast tanks flanks the route, centered walkway and one-point perspective, a clear onward opening.

### tour_tanks_r — placeholder / side-wall

Seed 2701; `assets/art/tour_tanks_r.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD side: close crew bunk cubbies with folded blankets and metal lockers, no tanks or corridor view.

### tour_tanks_back — placeholder / hall-axis

Seed 2702; `assets/art/tour_tanks_back.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite tour progress: return catwalk toward gas-cell ring, different distant landmark, no feature from forward end centered.

### tour_tanks_l — placeholder / side-wall

Seed 2703; `assets/art/tour_tanks_l.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT side: close cylindrical diesel fuel tank, one black pipe and red valve, railing foreground, no receding path.

## Keel Tour · tour_end

Material lock: Escorted keel tour stop 4, aluminum trusses, grey gas-cell fabric, metal catwalk, warm cage lamps. Seed family: 2800. Clockwise: tour_end → tour_end_r → tour_end_back → tour_end_l.

### tour_end — ready / hall-axis

Seed 2800; `assets/art/tour_end.webp`. Unique source image retained.

**Append to global + material lock:** FORWARD AXIS: straight catwalk toward next tour stop; landing rope equipment near forward hatch flanks the route, centered walkway and one-point perspective, a clear onward opening.

### tour_end_r — placeholder / side-wall

Seed 2801; `assets/art/tour_end_r.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** STARBOARD side: close bolted outer-cover hatch with small porthole and control lever, no long passage.

### tour_end_back — placeholder / hall-axis

Seed 2802; `assets/art/tour_end_back.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** AFT AXIS opposite tour progress: return catwalk toward tank stop, different distant landmark, no feature from forward end centered.

### tour_end_l — placeholder / side-wall

Seed 2803; `assets/art/tour_end_l.webp`. Previously room-matched copied placeholder.

**Append to global + material lock:** PORT side: close coiled landing ropes and hatch winch on grey brackets, dark hull fabric behind, no walkway depth.
