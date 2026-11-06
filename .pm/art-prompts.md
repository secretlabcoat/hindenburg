# Hindenburg art generation prompts

Generated via Hugging Face Space `black-forest-labs/FLUX.1-schnell` (`gradio_client`; authenticated with HF token when available).
Landscape backgrounds for the `.scene` box. CSS drawings remain as fallback.

## Shared style lock (prepend to every scene prompt)

**Style reference:** Cyberflix *Titanic: Adventure Out of Time* (1996) — first-person pre-rendered 3D CGI adventure look. Style reference only; do **not** copy Titanic assets or likenesses.

```
first-person pre-rendered 3D CGI scene in mid-1990s adventure-game style like Titanic Adventure Out of Time, realistic period-accurate 1937 LZ 129 Hindenburg interior, historically researched Art Deco fittings, warm tungsten practical lighting, slightly soft grainy 1990s CG render with gentle plastic sheen on wood and metal, eye-level camera, empty room, no painterly brushstrokes, no illustration, no anime, no readable text watermarks logos or UI, no modern objects
```

Negative intent: no painterly/illustrated look, no text/UI, no Titanic ship interiors (this is Hindenburg), no anachronisms.

**Portraits:** the game uses CSS `.hot-person` silhouettes, not portrait stills — no separate portrait assets to generate.

## Viewpoint → style → asset

Runtime `nodes[view].style` selects the CSS/XROOM drawing. Art files are named by **style** (one WebP per unique style). Viewpoints that share a style share one background; clickable hotspots stay in the CSS/HTML overlay layer.

| Viewpoint | Room | Facing | Style | Asset |
|---|---|---|---|---|
| washroom_stall | B-Deck Washroom | shower stall · hiding place | washshower | washshower.webp |
| washroom_basins | B-Deck Washroom | wash basins and mirror | washbasin | washbasin.webp |
| washroom_door | B-Deck Washroom | door to B-deck corridor | washdoor | washdoor.webp |
| bdeck_washroom | B-Deck Corridor | washroom door | door | door.webp |
| bdeck_stairs | B Deck | stairs up to passenger deck | door | door.webp |
| bar_counter | Bar & Smoking Room | the bar | bar | bar.webp |
| crew_door | B Deck | crew door · keel | door | door.webp |
| office_desk | Purser’s Office | purser’s desk | office | office.webp |
| keel_walk | Keel Walkway | catwalk toward control car | keel | keel.webp |
| keel_hatch | Keel Walkway | hatch in outer cover | keelhatch | keelhatch.webp |
| keel_back | Keel Walkway | door back to B Deck | keel | keel.webp |
| control_helm | Control Car | the helm | control | control.webp |
| control_back | Control Car | ladder up to keel | door | door.webp |
| cabin_bunk | Cabin B-6 | two berths | b6bunk | b6bunk.webp |
| cabin_window | Cabin B-6 | window | b6window | b6window.webp |
| cabin_door | Cabin B-6 | door to corridor | b6door | b6door.webp |
| cabin_desk | Cabin B-6 | fold-down desk | b6desk | b6desk.webp |
| bdeck_cabins | B-Deck Corridor | new 1937 cabins · B-6 | door | door.webp |
| adeck_cabin | Passenger Cabin (A deck) | someone else’s cabin | adcabin | adcabin.webp |
| lounge_windows | Passenger Lounge | windows | windows | windows.webp |
| lounge_people | Passenger Lounge | passengers | people | people.webp |
| lounge_side | Passenger Lounge | seating area | people | people.webp |
| lounge_aft | Passenger Lounge | aft doorway | door | door.webp |
| promenade | Promenade | observation windows | promenade | promenade.webp |
| promenade_side | Promenade | seating | promenade | promenade.webp |
| promenade_far | Promenade | forward windows | promenade | promenade.webp |
| promenade_aft | Promenade | return passage | door | door.webp |
| corridor_forward | Passenger Corridor | forward | corridor | corridor.webp |
| corridor_left | Passenger Corridor | port cabins | door | door.webp |
| corridor_right | Passenger Corridor | starboard cabins | door | door.webp |
| corridor_end | Passenger Corridor | lounge entrance | corridor | corridor.webp |
| tour_shoes | Keel Tour | felt overshoes / safety | tour1 | tour1.webp |
| tour_cells | Keel Tour | looking up into the hull | tour2 | tour2.webp |
| tour_tanks | Keel Tour | fuel/water tanks, crew bunks | tour3 | tour3.webp |
| tour_end | Keel Tour | guide turns back | tour4 | tour4.webp |
| girder_nook | High in the Rings | something watching | nook | nook.webp |

Legacy style keys still present in early `scenery()` (overwritten at runtime for B-6 cabin): `cabin`, `cabinwindow`, `cabindoor`, `cabindesk` — generate matching assets for fallback paths.

## Per-style prompts (append after style lock)

### washshower
B-deck washroom shower stall, green tile walls, black-and-white checkered floor, striped shower curtain closed, cramped private stall, no people

### washbasin
B-deck washroom with porcelain wash basins and a mirror above, chrome taps, green tiles, checkered floor, no people

### washdoor
B-deck washroom facing a wood Art Deco door labeled only by hardware (no readable text), green tiles, checkered floor, door centered, no people

### door
Narrow passenger corridor aboard Hindenburg, lacquered wood walls, brass portholes, Art Deco doorway ahead, carpet runner, warm lamps, no people

### bar
Hindenburg smoking lounge bar, padded leather stools, brass rail, bottles and glassware on shelves, Art Deco mirrors, amber light, no people

### office
Purser’s small office 1937, oak desk with paper ledger and fountain pen only, filing cabinet, brass lamp, wood paneling, porthole light, no computers/keyboards/mice/screens/phones/modern electronics, period stationery only, no people

### keel
Interior keel catwalk of a zeppelin, aluminum girders, gas-cell fabric above, narrow metal walkway, utilitarian lamps, industrial, no people

### keelhatch
Keel walkway facing an outer-cover hatch, metal framing, glimpse of sky through hatch edge, girders, no people

### control
Hindenburg control car gondola, ship’s wheel and engine telegraphs, large forward windows over clouds, brass instruments, no people

### windows
Passenger lounge facing tall slanted observation windows, blue-grey sky outside, polished wood and brass, lounge chairs at sides, no people

### people
Passenger lounge seating with two 1930s passengers in period evening dress (one older woman, one young woman) as mid-90s pre-rendered 3D figures, Art Deco chairs and table, warm tungsten light, not celebrity likenesses, same 1990s CG sheen as the room

### promenade
Hindenburg promenade deck, long slanted observation windows, handrail, clouds beyond, elegant wood trim, empty seating, no people

### corridor
Long A-deck passenger corridor, cabin doors left and right, carpet, wall sconces, vanishing perspective, no people

### cabin / b6bunk
Small passenger cabin with made-up bunk berth, steamer trunk, wood paneling, soft lamp, cozy unused cabin, no people

### cabinwindow / b6window
Small passenger cabin facing a round porthole window with daylight, fold-down desk edge, wood walls, no people

### cabindoor / b6door
Small passenger cabin facing the cabin door to the corridor, wood door with brass handle, bunk edge visible, no people

### cabindesk / b6desk
Small passenger cabin fold-down writing desk and washbasin niche, glass of water, wood paneling, no people

### adcabin
Compact A-deck cabin without a window, upper and lower berths, curtain, dim warm light, someone else’s tidy cabin, no people

### tour1
Keel tour staging area, felt overshoes on a rack, safety notice board (illegible markings only), metal deck, no people

### tour2
Looking up from keel into vast hydrogen gas-cell rings and girders inside the hull, awe-inspiring scale, dim shafts of light, no people

### tour3
Keel area with cylindrical fuel and water tanks, crew bunk cubbies, pipes and valves, utilitarian, no people

### tour4
Forward keel walkway turning back, girders narrowing, guide’s empty path, industrial lamps, no people

### nook
High among the airship’s rings, cramped girder nook, eerie quiet, strange small shape half-hidden in shadow (not a clear creature), unsettling, no people

## Generation settings

- Space: `black-forest-labs/FLUX.1-schnell`
- Size: 768×432 (landscape, iPhone-friendly; WebP <150 KB)
- Steps: 4
- Output: `assets/art/<style>.webp` target &lt;150 KB (Pillow WebP quality tuned)
