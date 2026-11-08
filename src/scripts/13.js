
/* ---- Titanic-style 4-facing rotation (applied last so it wins over earlier patches) ---- */
const ROTATION_NODES={
  "washroom_stall": {
    "name": "B-Deck Washroom",
    "facing": "the shower stall · your hiding place",
    "left": "washroom_wall",
    "right": "washroom_basins",
    "forward": null,
    "style": "washshower",
    "framing": "room-wall",
    "fallback": "shower",
    "artStatus": "ready"
  },
  "washroom_basins": {
    "name": "B-Deck Washroom",
    "facing": "wash basins and mirror",
    "left": "washroom_stall",
    "right": "washroom_door",
    "forward": null,
    "style": "washbasin",
    "framing": "room-wall",
    "fallback": "mirror",
    "artStatus": "ready"
  },
  "washroom_door": {
    "name": "B-Deck Washroom",
    "facing": "door to the B-deck corridor",
    "left": "washroom_basins",
    "right": "washroom_wall",
    "forward": "bdeck_corr_washdoor",
    "style": "washdoor",
    "framing": "room-wall",
    "fallback": "door",
    "artStatus": "ready"
  },
  "washroom_wall": {
    "name": "B-Deck Washroom",
    "facing": "tiled wall and towel rail",
    "left": "washroom_door",
    "right": "washroom_stall",
    "forward": null,
    "style": "washwall",
    "framing": "room-wall",
    "fallback": "towel",
    "artStatus": "placeholder"
  },
  "cabin_bunk": {
    "name": "Cabin B-6 (B deck)",
    "facing": "two berths, made up, unused",
    "left": "cabin_desk",
    "right": "cabin_window",
    "forward": null,
    "style": "b6bunk",
    "framing": "room-wall",
    "fallback": "bunks",
    "artStatus": "ready"
  },
  "cabin_window": {
    "name": "Cabin B-6 (B deck)",
    "facing": "a real window — new B-deck cabins have them",
    "left": "cabin_bunk",
    "right": "cabin_door",
    "forward": null,
    "style": "b6window",
    "framing": "room-wall",
    "fallback": "window",
    "artStatus": "ready"
  },
  "cabin_door": {
    "name": "Cabin B-6 (B deck)",
    "facing": "door to the B-deck corridor",
    "left": "cabin_window",
    "right": "cabin_desk",
    "forward": "bdeck_cabins_door",
    "style": "b6door",
    "framing": "room-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "cabin_desk": {
    "name": "Cabin B-6 (B deck)",
    "facing": "fold-down desk and washbasin",
    "left": "cabin_door",
    "right": "cabin_bunk",
    "forward": null,
    "style": "b6desk",
    "framing": "room-wall",
    "fallback": "desk",
    "artStatus": "ready"
  },
  "lounge_windows": {
    "name": "Passenger Lounge",
    "facing": "windows",
    "left": "lounge_aft",
    "right": "lounge_people",
    "forward": null,
    "style": "windows",
    "framing": "room-wall",
    "fallback": "window",
    "artStatus": "ready"
  },
  "lounge_people": {
    "name": "Passenger Lounge",
    "facing": "passengers",
    "left": "lounge_windows",
    "right": "lounge_side",
    "forward": null,
    "style": "people",
    "framing": "room-wall",
    "fallback": "booths",
    "artStatus": "ready"
  },
  "lounge_side": {
    "name": "Passenger Lounge",
    "facing": "writing alcove and glazed promenade door",
    "left": "lounge_people",
    "right": "lounge_aft",
    "forward": "promenade_side",
    "style": "people_side",
    "framing": "room-wall",
    "fallback": "desk",
    "artStatus": "placeholder"
  },
  "lounge_aft": {
    "name": "Passenger Lounge",
    "facing": "aft doorway",
    "left": "lounge_side",
    "right": "lounge_windows",
    "forward": "corridor_forward",
    "style": "lounge_aft",
    "framing": "room-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "promenade": {
    "name": "Promenade",
    "facing": "outboard observation windows · solid glazing",
    "left": "promenade_aft",
    "right": "promenade_far",
    "forward": null,
    "style": "promenade",
    "framing": "side-wall",
    "fallback": "window",
    "artStatus": "placeholder"
  },
  "promenade_far": {
    "name": "Promenade",
    "facing": "forward along the promenade · closed end",
    "left": "promenade",
    "right": "promenade_side",
    "forward": null,
    "style": "promenade_far",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "ready"
  },
  "promenade_side": {
    "name": "Promenade",
    "facing": "inboard seating and lounge doorway",
    "left": "promenade_far",
    "right": "promenade_aft",
    "forward": "lounge_side",
    "style": "promenade_side",
    "framing": "side-wall",
    "fallback": "booths",
    "artStatus": "placeholder"
  },
  "promenade_aft": {
    "name": "Promenade",
    "facing": "return passage",
    "left": "promenade_side",
    "right": "promenade",
    "forward": "lounge_windows",
    "style": "promenade_aft",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "corridor_forward": {
    "name": "Passenger Corridor",
    "facing": "forward along the hall · closed end bulkhead",
    "left": "corridor_right",
    "right": "corridor_left",
    "forward": null,
    "style": "corridor_forward",
    "framing": "hall-axis",
    "fallback": "wall",
    "artStatus": "ready"
  },
  "corridor_left": {
    "name": "Passenger Corridor",
    "facing": "port cabins",
    "left": "corridor_forward",
    "right": "corridor_end",
    "forward": "adeck_cabin",
    "style": "corridor_left",
    "framing": "side-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "corridor_end": {
    "name": "Passenger Corridor",
    "facing": "lounge entrance",
    "left": "corridor_left",
    "right": "corridor_right",
    "forward": "lounge_aft",
    "style": "corridor_end",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "corridor_right": {
    "name": "Passenger Corridor",
    "facing": "starboard cabins / stairs down",
    "left": "corridor_end",
    "right": "corridor_forward",
    "forward": "bdeck_stairs_up",
    "style": "corridor_right",
    "framing": "side-wall",
    "fallback": "stairs",
    "artStatus": "placeholder"
  },
  "bar_counter": {
    "name": "Bar & Smoking Room",
    "facing": "the bar",
    "left": "bar_door",
    "right": "bar_booths",
    "forward": null,
    "style": "bar_counter",
    "framing": "room-wall",
    "fallback": "bar",
    "artStatus": "ready"
  },
  "bar_booths": {
    "name": "Bar & Smoking Room",
    "facing": "leather booths",
    "left": "bar_counter",
    "right": "bar_windows",
    "forward": null,
    "style": "bar_booths",
    "framing": "room-wall",
    "fallback": "booths",
    "artStatus": "placeholder"
  },
  "bar_windows": {
    "name": "Bar & Smoking Room",
    "facing": "smoking-room windows",
    "left": "bar_booths",
    "right": "bar_door",
    "forward": null,
    "style": "bar_windows",
    "framing": "room-wall",
    "fallback": "window",
    "artStatus": "placeholder"
  },
  "bar_door": {
    "name": "Bar & Smoking Room",
    "facing": "door to stair landing",
    "left": "bar_windows",
    "right": "bar_counter",
    "forward": "bdeck_stairs_bar",
    "style": "bar_door",
    "framing": "room-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "office_desk": {
    "name": "Purser's Office",
    "facing": "the purser's desk",
    "left": "office_door",
    "right": "office_cabinet",
    "forward": null,
    "style": "office_desk",
    "framing": "room-wall",
    "fallback": "desk",
    "artStatus": "ready"
  },
  "office_cabinet": {
    "name": "Purser's Office",
    "facing": "filing cabinets",
    "left": "office_desk",
    "right": "office_porthole",
    "forward": null,
    "style": "office_cabinet",
    "framing": "room-wall",
    "fallback": "cabinets",
    "artStatus": "placeholder"
  },
  "office_porthole": {
    "name": "Purser's Office",
    "facing": "porthole and chronometer",
    "left": "office_cabinet",
    "right": "office_door",
    "forward": null,
    "style": "office_porthole",
    "framing": "room-wall",
    "fallback": "porthole",
    "artStatus": "placeholder"
  },
  "office_door": {
    "name": "Purser's Office",
    "facing": "door to B-deck corridor",
    "left": "office_porthole",
    "right": "office_desk",
    "forward": "bdeck_corr_office",
    "style": "office_door",
    "framing": "room-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "bdeck_corr_washdoor": {
    "name": "B-Deck Corridor",
    "facing": "washroom door",
    "left": "bdeck_corr_cabins",
    "right": "bdeck_corr_stairs",
    "forward": "washroom_door",
    "style": "bdeck_corr_washdoor",
    "framing": "side-wall",
    "fallback": "door",
    "artStatus": "ready"
  },
  "bdeck_corr_stairs": {
    "name": "B-Deck Corridor",
    "facing": "toward the stair landing",
    "left": "bdeck_corr_washdoor",
    "right": "bdeck_corr_office",
    "forward": "bdeck_stairs_door",
    "style": "bdeck_corr_stairs",
    "framing": "hall-axis",
    "fallback": "stairs",
    "artStatus": "ready"
  },
  "bdeck_corr_office": {
    "name": "B-Deck Corridor",
    "facing": "purser's office door",
    "left": "bdeck_corr_stairs",
    "right": "bdeck_corr_cabins",
    "forward": "office_door",
    "style": "bdeck_corr_office",
    "framing": "side-wall",
    "fallback": "door",
    "artStatus": "ready"
  },
  "bdeck_corr_cabins": {
    "name": "B-Deck Corridor",
    "facing": "toward the new cabins",
    "left": "bdeck_corr_office",
    "right": "bdeck_corr_washdoor",
    "forward": "bdeck_cabins_back",
    "style": "bdeck_corr_cabins",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "bdeck_stairs_door": {
    "name": "B Deck · Stair Landing",
    "facing": "opening to B-deck corridor",
    "left": "bdeck_stairs_wall",
    "right": "bdeck_stairs_up",
    "forward": "bdeck_corr_stairs",
    "style": "bdeck_stairs_door",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "bdeck_stairs_up": {
    "name": "B Deck · Stair Landing",
    "facing": "stairs ascending to A deck",
    "left": "bdeck_stairs_door",
    "right": "bdeck_stairs_bar",
    "forward": "corridor_right",
    "style": "bdeck_stairs_up",
    "framing": "side-wall",
    "fallback": "stairs",
    "artStatus": "placeholder"
  },
  "bdeck_stairs_bar": {
    "name": "B Deck · Stair Landing",
    "facing": "door to bar & smoking room",
    "left": "bdeck_stairs_up",
    "right": "bdeck_stairs_wall",
    "forward": "bar_door",
    "style": "bdeck_stairs_bar",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "bdeck_stairs_wall": {
    "name": "B Deck · Stair Landing",
    "facing": "lacquered bulkhead",
    "left": "bdeck_stairs_bar",
    "right": "bdeck_stairs_door",
    "forward": null,
    "style": "bdeck_stairs_wall",
    "framing": "side-wall",
    "fallback": "notice",
    "artStatus": "placeholder"
  },
  "bdeck_cabins_door": {
    "name": "B-Deck Corridor · Cabins",
    "facing": "cabin B-6 door",
    "left": "bdeck_cabins_back",
    "right": "bdeck_cabins_crew",
    "forward": "cabin_door",
    "style": "bdeck_cabins_door",
    "framing": "side-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "bdeck_cabins_crew": {
    "name": "B-Deck Corridor · Cabins",
    "facing": "crew door to the keel",
    "left": "bdeck_cabins_door",
    "right": "bdeck_cabins_wall",
    "forward": "crew_door_in",
    "style": "bdeck_cabins_crew",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "bdeck_cabins_wall": {
    "name": "B-Deck Corridor · Cabins",
    "facing": "cabin bulkheads",
    "left": "bdeck_cabins_crew",
    "right": "bdeck_cabins_back",
    "forward": null,
    "style": "bdeck_cabins_wall",
    "framing": "side-wall",
    "fallback": "wall",
    "artStatus": "placeholder"
  },
  "bdeck_cabins_back": {
    "name": "B-Deck Corridor · Cabins",
    "facing": "back toward the washroom corridor",
    "left": "bdeck_cabins_wall",
    "right": "bdeck_cabins_door",
    "forward": "bdeck_corr_cabins",
    "style": "bdeck_cabins_back",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "crew_door_in": {
    "name": "B Deck · Crew Door",
    "facing": "crew door · keel · no passengers",
    "left": "crew_door_pipes",
    "right": "crew_door_sign",
    "forward": "keel_walk",
    "style": "crew_door_in",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "crew_door_sign": {
    "name": "B Deck · Crew Door",
    "facing": "crew-only notice board",
    "left": "crew_door_in",
    "right": "crew_door_hall",
    "forward": null,
    "style": "crew_door_sign",
    "framing": "side-wall",
    "fallback": "notice",
    "artStatus": "placeholder"
  },
  "crew_door_hall": {
    "name": "B Deck · Crew Door",
    "facing": "back to cabin corridor",
    "left": "crew_door_sign",
    "right": "crew_door_pipes",
    "forward": "bdeck_cabins_crew",
    "style": "crew_door_hall",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "crew_door_pipes": {
    "name": "B Deck · Crew Door",
    "facing": "service pipes and valves",
    "left": "crew_door_hall",
    "right": "crew_door_in",
    "forward": null,
    "style": "crew_door_pipes",
    "framing": "side-wall",
    "fallback": "pipes",
    "artStatus": "placeholder"
  },
  "adeck_cabin": {
    "name": "Passenger Cabin (A deck)",
    "facing": "someone else's cabin · no window",
    "left": "adeck_cabin_wardrobe",
    "right": "adeck_cabin_door",
    "forward": null,
    "style": "adcabin_bunks",
    "framing": "room-wall",
    "fallback": "bunks",
    "artStatus": "ready"
  },
  "adeck_cabin_door": {
    "name": "Passenger Cabin (A deck)",
    "facing": "door to the corridor",
    "left": "adeck_cabin",
    "right": "adeck_cabin_curtain",
    "forward": "corridor_left",
    "style": "adcabin_door",
    "framing": "room-wall",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "adeck_cabin_curtain": {
    "name": "Passenger Cabin (A deck)",
    "facing": "berth curtain",
    "left": "adeck_cabin_door",
    "right": "adeck_cabin_wardrobe",
    "forward": null,
    "style": "adcabin_curtain",
    "framing": "room-wall",
    "fallback": "curtain",
    "artStatus": "placeholder"
  },
  "adeck_cabin_wardrobe": {
    "name": "Passenger Cabin (A deck)",
    "facing": "wardrobe niche",
    "left": "adeck_cabin_curtain",
    "right": "adeck_cabin",
    "forward": null,
    "style": "adcabin_wardrobe",
    "framing": "room-wall",
    "fallback": "wardrobe",
    "artStatus": "placeholder"
  },
  "keel_walk": {
    "name": "Keel Walkway",
    "facing": "catwalk toward the control car",
    "left": "keel_up",
    "right": "keel_hatch",
    "forward": "control_helm",
    "style": "keel_forward",
    "framing": "hall-axis",
    "fallback": "girders",
    "artStatus": "ready"
  },
  "keel_hatch": {
    "name": "Keel Walkway",
    "facing": "a hatch in the outer cover",
    "left": "keel_walk",
    "right": "keel_back",
    "forward": null,
    "style": "keelhatch",
    "framing": "side-wall",
    "fallback": "hatch",
    "artStatus": "placeholder"
  },
  "keel_back": {
    "name": "Keel Walkway",
    "facing": "door back to B Deck",
    "left": "keel_hatch",
    "right": "keel_up",
    "forward": "crew_door_in",
    "style": "keel_back",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "keel_up": {
    "name": "Keel Walkway",
    "facing": "port gas-cell fabric and bracing",
    "left": "keel_back",
    "right": "keel_walk",
    "forward": null,
    "style": "keel_up",
    "framing": "side-wall",
    "fallback": "gascell",
    "artStatus": "placeholder"
  },
  "control_helm": {
    "name": "Control Car",
    "facing": "the helm",
    "left": "control_port",
    "right": "control_starboard",
    "forward": null,
    "style": "control_helm",
    "framing": "room-wall",
    "fallback": "helm",
    "artStatus": "ready"
  },
  "control_starboard": {
    "name": "Control Car",
    "facing": "starboard windows over the clouds",
    "left": "control_helm",
    "right": "control_back",
    "forward": null,
    "style": "control_starboard",
    "framing": "room-wall",
    "fallback": "window",
    "artStatus": "placeholder"
  },
  "control_back": {
    "name": "Control Car",
    "facing": "ladder up to the keel",
    "left": "control_starboard",
    "right": "control_port",
    "forward": "keel_walk",
    "style": "control_ladder",
    "framing": "room-wall",
    "fallback": "ladder",
    "artStatus": "placeholder"
  },
  "control_port": {
    "name": "Control Car",
    "facing": "port instruments",
    "left": "control_back",
    "right": "control_helm",
    "forward": null,
    "style": "control_port",
    "framing": "room-wall",
    "fallback": "instruments",
    "artStatus": "placeholder"
  },
  "girder_nook": {
    "name": "High in the Rings",
    "facing": "something watching",
    "left": "girder_nook_left",
    "right": "girder_nook_right",
    "forward": null,
    "style": "nook_watch",
    "framing": "room-wall",
    "fallback": "girders",
    "artStatus": "ready"
  },
  "girder_nook_right": {
    "name": "High in the Rings",
    "facing": "cable runs along the ring",
    "left": "girder_nook",
    "right": "girder_nook_down",
    "forward": null,
    "style": "nook_right",
    "framing": "room-wall",
    "fallback": "cables",
    "artStatus": "placeholder"
  },
  "girder_nook_down": {
    "name": "High in the Rings",
    "facing": "climb back down",
    "left": "girder_nook_right",
    "right": "girder_nook_left",
    "forward": "keel_back",
    "style": "nook_down",
    "framing": "room-wall",
    "fallback": "ladder",
    "artStatus": "placeholder"
  },
  "girder_nook_left": {
    "name": "High in the Rings",
    "facing": "girders vanishing into shadow",
    "left": "girder_nook_down",
    "right": "girder_nook",
    "forward": null,
    "style": "nook_left",
    "framing": "room-wall",
    "fallback": "gascell",
    "artStatus": "placeholder"
  },
  "tour_shoes": {
    "name": "Keel Tour · tour_shoes",
    "facing": "forward along the catwalk · overshoe gate",
    "left": "tour_shoes_l",
    "right": "tour_shoes_r",
    "forward": "tour_cells",
    "style": "tour1",
    "framing": "hall-axis",
    "fallback": "girders",
    "artStatus": "placeholder"
  },
  "tour_shoes_r": {
    "name": "Keel Tour · tour_shoes",
    "facing": "looking at the girders",
    "left": "tour_shoes",
    "right": "tour_shoes_back",
    "forward": null,
    "style": "tour1_r",
    "framing": "side-wall",
    "fallback": "girders",
    "artStatus": "placeholder"
  },
  "tour_shoes_back": {
    "name": "Keel Tour · tour_shoes",
    "facing": "the way you came",
    "left": "tour_shoes_r",
    "right": "tour_shoes_l",
    "forward": null,
    "style": "tour1_back",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "tour_shoes_l": {
    "name": "Keel Tour · tour_shoes",
    "facing": "looking along the catwalk",
    "left": "tour_shoes_back",
    "right": "tour_shoes",
    "forward": null,
    "style": "tour1_l",
    "framing": "side-wall",
    "fallback": "safety",
    "artStatus": "placeholder"
  },
  "tour_cells": {
    "name": "Keel Tour · tour_cells",
    "facing": "forward along the catwalk · gas-cell ring",
    "left": "tour_cells_l",
    "right": "tour_cells_r",
    "forward": "tour_tanks",
    "style": "tour2",
    "framing": "hall-axis",
    "fallback": "girders",
    "artStatus": "placeholder"
  },
  "tour_cells_r": {
    "name": "Keel Tour · tour_cells",
    "facing": "looking at the girders",
    "left": "tour_cells",
    "right": "tour_cells_back",
    "forward": null,
    "style": "tour2_r",
    "framing": "side-wall",
    "fallback": "cables",
    "artStatus": "placeholder"
  },
  "tour_cells_back": {
    "name": "Keel Tour · tour_cells",
    "facing": "the way you came",
    "left": "tour_cells_r",
    "right": "tour_cells_l",
    "forward": null,
    "style": "tour2_back",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "tour_cells_l": {
    "name": "Keel Tour · tour_cells",
    "facing": "looking along the catwalk",
    "left": "tour_cells_back",
    "right": "tour_cells",
    "forward": null,
    "style": "tour2_l",
    "framing": "side-wall",
    "fallback": "gascell",
    "artStatus": "placeholder"
  },
  "tour_tanks": {
    "name": "Keel Tour · tour_tanks",
    "facing": "forward along the catwalk · tanks",
    "left": "tour_tanks_l",
    "right": "tour_tanks_r",
    "forward": "tour_end",
    "style": "tour3",
    "framing": "hall-axis",
    "fallback": "girders",
    "artStatus": "ready"
  },
  "tour_tanks_r": {
    "name": "Keel Tour · tour_tanks",
    "facing": "looking at the girders",
    "left": "tour_tanks",
    "right": "tour_tanks_back",
    "forward": null,
    "style": "tour3_r",
    "framing": "side-wall",
    "fallback": "bunks",
    "artStatus": "placeholder"
  },
  "tour_tanks_back": {
    "name": "Keel Tour · tour_tanks",
    "facing": "the way you came",
    "left": "tour_tanks_r",
    "right": "tour_tanks_l",
    "forward": null,
    "style": "tour3_back",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "tour_tanks_l": {
    "name": "Keel Tour · tour_tanks",
    "facing": "looking along the catwalk",
    "left": "tour_tanks_back",
    "right": "tour_tanks",
    "forward": null,
    "style": "tour3_l",
    "framing": "side-wall",
    "fallback": "tank",
    "artStatus": "placeholder"
  },
  "tour_end": {
    "name": "Keel Tour · tour_end",
    "facing": "forward along the catwalk · landing-rope gear",
    "left": "tour_end_l",
    "right": "tour_end_r",
    "forward": "keel_walk",
    "style": "tour4",
    "framing": "hall-axis",
    "fallback": "girders",
    "artStatus": "ready"
  },
  "tour_end_r": {
    "name": "Keel Tour · tour_end",
    "facing": "looking at the girders",
    "left": "tour_end",
    "right": "tour_end_back",
    "forward": null,
    "style": "tour4_r",
    "framing": "side-wall",
    "fallback": "hatch",
    "artStatus": "placeholder"
  },
  "tour_end_back": {
    "name": "Keel Tour · tour_end",
    "facing": "the way you came",
    "left": "tour_end_r",
    "right": "tour_end_l",
    "forward": null,
    "style": "tour4_back",
    "framing": "hall-axis",
    "fallback": "door",
    "artStatus": "placeholder"
  },
  "tour_end_l": {
    "name": "Keel Tour · tour_end",
    "facing": "looking along the catwalk",
    "left": "tour_end_back",
    "right": "tour_end",
    "forward": null,
    "style": "tour4_l",
    "framing": "side-wall",
    "fallback": "rope",
    "artStatus": "placeholder"
  }
};
const ROTATION_ALIASES={"bdeck_washroom": "bdeck_corr_washdoor", "bdeck_stairs": "bdeck_stairs_door", "bdeck_cabins": "bdeck_cabins_door", "crew_door": "crew_door_in"};
// Generated node table above; this renderer deliberately never reuses another facing's photograph.
(function applyPhysicalFacings(){
  Object.keys(nodes).forEach(k=>delete nodes[k]);
  Object.assign(nodes,ROTATION_NODES);
  // Keep movement controls inside the full-height HUD rather than below the clipped shell.
  scene.after(document.querySelector('.navdock'));
  const resolve=v=>ROTATION_ALIASES[v]||v;
  const oldRestore=restore;
  restore=function(d){return oldRestore({...d,view:nodes[resolve(d.view)]?resolve(d.view):'washroom_stall'})};
  const oldTravel=travel;
  travel=function(dest){const id=resolve(dest);if(nodes[id])return oldTravel(id)};
  // The old climb patch wrote an exit onto the Watcher wall. The ladder wall owns that exit.
  ACTS.climb=function(){
    window.nookReturn=view;
    nodes.girder_nook_down.forward=view;
    view='girder_nook';steps++;draw();saveGame();
  };
  const oldDraw=draw;
  draw=function(){
    oldDraw();
    nodes.girder_nook.forward=null;
    nodes.girder_nook_down.forward=nodes[resolve(window.nookReturn)]?resolve(window.nookReturn):'keel_back';
    $('#navforward').disabled=!nodes[view].forward;
  };
  const MAP={washwall:'washbasin',people_side:'people',lounge_aft:'door',promenade_side:'promenade',promenade_far:'promenade',promenade_aft:'door',corridor_forward:'corridor',corridor_end:'corridor',corridor_left:'door',corridor_right:'door',bar_counter:'bar',bar_booths:'bar',bar_windows:'bar',bar_door:'door',office_desk:'office',office_cabinet:'office',office_porthole:'office',office_door:'door',bdeck_corr_washdoor:'door',bdeck_corr_stairs:'door',bdeck_corr_office:'door',bdeck_corr_cabins:'door',bdeck_stairs_door:'door',bdeck_stairs_up:'door',bdeck_stairs_bar:'door',bdeck_stairs_wall:'door',bdeck_cabins_door:'door',bdeck_cabins_crew:'door',bdeck_cabins_back:'door',bdeck_cabins_wall:'door',crew_door_in:'crewdoor11',crew_door_hall:'door',crew_door_sign:'door',crew_door_pipes:'door',adcabin_bunks:'adcabin',adcabin_door:'adcabin',adcabin_curtain:'adcabin',adcabin_wardrobe:'adcabin',keel_forward:'keel',keel_back:'keel',keel_up:'keel',control_helm:'control',control_ladder:'door',control_port:'control',control_starboard:'control',nook_watch:'nook',nook_down:'nook',nook_left:'nook',nook_right:'nook',tour1_l:'tour1',tour1_r:'tour1',tour1_back:'tour1',tour2_l:'tour2',tour2_r:'tour2',tour2_back:'tour2',tour3_l:'tour3',tour3_r:'tour3',tour3_back:'tour3',tour4_l:'tour4',tour4_r:'tour4',tour4_back:'tour4'};
  const keepInteractions=new Set(['washroom_stall','washroom_basins','cabin_bunk','cabin_window','cabin_desk','adeck_cabin','keel_hatch','keel_walk','keel_back','girder_nook','tour_cells','tour_end','crew_door_in','corridor_forward']);
  const oldScenery=scenery;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  scenery=function(v){
    const n=nodes[v];if(!n)return '';
    const stash=n.style;n.style=MAP[stash]||stash;
    let legacy;
    try{legacy=oldScenery(v)}finally{n.style=stash}
    const container=document.createElement('div');container.innerHTML=legacy;
    let interactions='';
    const selector=keepInteractions.has(v)?'[data-person],[data-object],[data-wash],[data-act],[data-x11],.notehot':'[data-person]';
    const selected=keepInteractions.has(v)?Array.from(container.querySelectorAll(selector)):[];
    for(const el of selected){
      if(selected.some(other=>other!==el&&other.contains(el)))continue;
      el.classList.add('facing-interaction');
      interactions+=el.outerHTML;
    }
    if(!keepInteractions.has(v))interactions=castHTML(v);
    if(v==='crew_door_sign')interactions+='<div class="facing-interaction facing-notice-hot" data-x11="notice" title="Read crew notice"></div>';
    // Retain the steward note on the original corridor facing (old scenery selects style corridor).
    const kit=/^(keel_|tour_|girder_|crew_)/.test(v)?'metal':v.startsWith('washroom')?'tile':'wood';
    const axis=n.framing==='hall-axis';
    const feature=n.fallback;
    let prop='<div class="facing-feature prop-'+esc(feature)+'" aria-hidden="true"><i></i><b></b><em></em></div>';
    if(n.forward && !axis && !['door','stairs','ladder'].includes(feature))prop+='<div class="facing-feature prop-door prop-exitdoor" aria-hidden="true"></div>';
    let exit='';
    if(n.forward){
      exit='<div class="facing-exit" data-move="'+esc(n.forward)+'" role="button" tabindex="0" title="'+esc(n.facing)+'"><span>↑ '+esc(n.facing)+'</span></div>';
    }
    const floor=axis?'<div class="facing-axis-left"></div><div class="facing-axis-right"></div><div class="facing-axis-floor"></div>':'<div class="facing-flat-floor"></div>';
    return '<div class="paint facing-scene kit-'+kit+' frame-'+n.framing+' feature-'+feature+(n.forward?' has-exit':'')+'" data-facing="'+v+'" data-art-status="'+n.artStatus+'"><div class="facing-bulkhead"></div>'+floor+'<div class="facing-sconce"></div>'+prop+exit+interactions+'</div><div class="placard">'+esc(n.name)+'</div><div class="hint">'+esc(n.facing)+(n.artStatus==='placeholder'?' · drawn preview':'')+'</div>';
  };
  // Keyboard parity with the existing touch/click exit and action handlers.
  const bindDraw=draw;
  draw=function(){bindDraw();scene.querySelectorAll('.facing-exit').forEach(el=>el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();travel(el.dataset.move)}})};
})();

