#!/usr/bin/env python3
"""One photograph per facing, with exactly as many doors as that facing has exits."""
import hashlib, json
from pathlib import Path
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent
PLAN = json.loads((ROOT / 'deck-plans' / 'plans.json').read_text())
OUT = ROOT / 'facing-art' / 'unique'
OUT.mkdir(parents=True, exist_ok=True)

ART = ROOT / 'sharehtml-art'
FACE = ROOT / 'facing-art'
HARM = ROOT / 'bathroom-harmonized'

CENTER = [0.40, 0.16, 0.20, 0.66]
LEFT = [0.15, 0.16, 0.18, 0.66]
RIGHT = [0.67, 0.16, 0.18, 0.66]
FAR = [0.44, 0.20, 0.12, 0.30]
STAIR = [0.36, 0.05, 0.28, 0.88]
HATCH = [0.44, 0.05, 0.12, 0.14]

# Facings whose existing photograph already shows the right number of doors.
KEEP = {
    'washroom_stall': (HARM / 'washroom_stall.webp', {}),
    'washroom_basins': (HARM / 'washroom_basins.webp', {}),
    'washroom_wall': (HARM / 'washroom_wall.webp', {}),
    'washroom_door': (HARM / 'washroom_door.webp', {'bdeck_corr_office': [0.400, 0.22, 0.195, 0.57]}),
    'bdeck_washroom': (ART / 'bdeck_corr_washdoor.webp', {'washroom_stall': [0.385, 0.14, 0.24, 0.68]}),
    'bdeck_stairs_up': (FACE / 'bdeck_stairs_up.webp', {'corridor_right': [0.36, 0.02, 0.28, 0.94]}),
    'bdeck_stairs_wall': (FACE / 'bdeck_stairs_wall.webp', {}),
    'bdeck_stairs_door': (FACE / 'bdeck_stairs_door.webp', {'bdeck_stairs': [0.37, 0.10, 0.26, 0.80]}),
    'bdeck_stairs_bar': (FACE / 'bdeck_stairs_bar.webp', {}),
    'bdeck_stairs': (ART / 'bdeck_corr_stairs.webp', {'bdeck_stairs_up': [0.41, 0.24, 0.18, 0.42]}),
    'bdeck_corr_office': (FACE / 'bdeck_corr_south.webp', {
        'b_crew_n': [0.175, 0.13, 0.20, 0.66],
        'b_cab_n': [0.63, 0.13, 0.21, 0.66],
    }),
    'b_mid_w': (ART / 'bdeck_corr_office.webp', {'office_desk': [0.37, 0.14, 0.26, 0.70]}),
    'cabin_bunk': (ART / 'cabin_bunk.webp', {}),
    'cabin_window': (ART / 'cabin_window.webp', {}),
    'cabin_desk': (ART / 'cabin_desk.webp', {}),
    'cabin_door': (FACE / 'cabin_door.webp', {'b_cab_e': [0.41, 0.24, 0.18, 0.58]}),
    'lounge_windows': (ART / 'lounge_windows.webp', {}),
    'lounge_people': (FACE / 'lounge_people.webp', {}),
    'promenade_far': (ART / 'promenade_far.webp', {}),
    'bar_counter': (ART / 'bar_counter.webp', {}),
    'office_desk': (ART / 'office_desk.webp', {}),
    'adeck_cabin': (ART / 'adeck_cabin.webp', {}),
    'control_helm': (ART / 'control_helm.webp', {}),
    'girder_nook': (ART / 'girder_nook.webp', {'keel_back': [0.42, 0.46, 0.16, 0.32]}),
    'tour_shoes': (FACE / 'tour_shoes.webp', {}),
    'tour_tanks': (ART / 'tour_tanks.webp', {'tour_end_e': [0.44, 0.18, 0.12, 0.22]}),
    'keel_walk': (ART / 'keel_walk.webp', {'control_helm': [0.45, 0.44, 0.10, 0.12]}),
}

BASE_FOR_PLACE = {
    'washroom': HARM / 'washroom_wall.webp',
    'stairs': FACE / 'bdeck_stairs_wall.webp',
    'lounge': ART / 'lounge_windows.webp',
    'promenade': ART / 'promenade_far.webp',
    'acorridor': ART / 'corridor_forward.webp',
    'acabin': ART / 'adeck_cabin.webp',
    'bcorridor': ART / 'corridor_forward.webp',
    'office': ART / 'office_desk.webp',
    'bar': ART / 'bar_counter.webp',
    'b6': ART / 'cabin_bunk.webp',
    'keel': ART / 'keel_walk.webp',
    'control': ART / 'control_helm.webp',
    'tour_shoes': FACE / 'tour_shoes.webp',
    'tour_cells': FACE / 'tour_cells.webp',
    'tour_tanks': ART / 'tour_tanks.webp',
    'tour_end': ART / 'tour_end.webp',
    'nook': ART / 'girder_nook.webp',
    'dining': ART / 'lounge_windows.webp',
}

FAR_SINGLE = {
    'b_mid_n', 'b_mid_s', 'b_cab_n', 'b_crew_n', 'corridor_forward', 'corridor_end',
    'keel_b_e', 'keel_m_e', 'keel_m_w', 'keel_e_w', 'keel_b_w', 'keel_e_e', 'keel_e_n', 'keel_e_s',
}


def exits_for(face):
    out = []
    if face.get('forward'):
        out.append(face['forward'])
    for door in face.get('doors') or []:
        if door.get('dest') and door['dest'] not in out:
            out.append(door['dest'])
    if face['id'] == 'crew_door':
        out.append('tour')
    if face['id'] in ('tour_cells', 'keel_back'):
        out.append('climb')
    return out


def slots_for(face_id, keys):
    if not keys:
        return {}
    stair = [k for k in keys if 'stair' in k]
    hatch = [k for k in keys if k in ('climb', 'tour')]
    rest = [k for k in keys if k not in stair and k not in hatch]
    assigned = {}
    if len(keys) == 1:
        only = keys[0]
        if only in stair:
            assigned[only] = STAIR
        elif only == 'climb':
            assigned[only] = HATCH
        elif face_id in FAR_SINGLE:
            assigned[only] = FAR
        else:
            assigned[only] = CENTER
        return assigned
    pool = rest + stair
    if len(pool) == 1 and hatch:
        assigned[pool[0]] = CENTER if pool[0] not in stair else STAIR
        assigned[hatch[0]] = HATCH
        for extra in hatch[1:]:
            assigned[extra] = LEFT
        return assigned
    if len(pool) >= 3:
        assigned[pool[0]] = FAR if face_id in FAR_SINGLE or 'stair' not in pool[0] else STAIR
        assigned[pool[1]] = LEFT
        assigned[pool[2]] = RIGHT
        for i, extra in enumerate(pool[3:] + hatch):
            assigned[extra] = HATCH if extra in ('climb', 'tour') else CENTER
        return assigned
    if len(pool) == 2:
        assigned[pool[0]] = LEFT
        assigned[pool[1]] = RIGHT
    elif len(pool) == 1:
        assigned[pool[0]] = CENTER if pool[0] not in stair else STAIR
    for extra in hatch:
        assigned[extra] = HATCH
    return assigned


def vary(im, face_id):
    n = int(hashlib.sha256(face_id.encode()).hexdigest()[:6], 16)
    w, h = im.size
    side = 18 + (n % 24)
    box = (side if n % 2 == 0 else 0, 8 + (n % 10), w - (0 if n % 2 == 0 else side), h - (6 + (n % 8)))
    im = im.crop(box).resize((w, h), Image.Resampling.LANCZOS)
    if n % 3 == 0:
        im = im.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    factor = 0.88 + (n % 21) / 80
    im = ImageEnhance.Brightness(im).enhance(factor)
    im = ImageEnhance.Color(im).enhance(0.9 + (n % 15) / 50)
    # A one-pixel stamp keeps two compressed frames from collapsing to the same file.
    px = im.load()
    px[0, 0] = (n % 255, (n // 255) % 255, (n // 65025) % 255)
    return im


def cover_wall(im):
    w, h = im.size
    sample = im.resize((1, 1), Image.Resampling.BOX).getpixel((0, 0))
    wall = Image.new('RGB', (w, h), sample)
    wall = ImageEnhance.Brightness(im.filter(ImageFilter.GaussianBlur(14))).enhance(0.85)
    mask = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.rectangle((int(w * 0.08), int(h * 0.08), int(w * 0.92), int(h * 0.92)), fill=210)
    mask = mask.filter(ImageFilter.GaussianBlur(12))
    return Image.composite(wall, im, mask)


def paint_opening(im, rect, kind):
    w, h = im.size
    x = int(rect[0] * w)
    y = int(rect[1] * h)
    rw = int(rect[2] * w)
    rh = int(rect[3] * h)
    d = ImageDraw.Draw(im)
    if kind == 'hatch':
        d.rectangle((x, y, x + rw, y + rh), fill=(28, 24, 20), outline=(150, 120, 70))
        return
    if kind == 'far':
        d.rectangle((x, y, x + rw, y + rh), fill=(32, 22, 16), outline=(120, 90, 55))
        return
    if kind == 'stair':
        d.rectangle((x, y, x + rw, y + rh), fill=(48, 40, 34), outline=(90, 70, 48))
        for i in range(6):
            yy = y + int(rh * (0.25 + i * 0.1))
            d.line((x + 6, yy, x + rw - 6, yy), fill=(150, 130, 100), width=2)
        return
    d.rectangle((x - 6, y - 6, x + rw + 6, y + rh + 4), fill=(92, 64, 40))
    d.rectangle((x, y, x + rw, y + rh), fill=(62, 40, 26))
    d.rectangle((x + 8, y + 10, x + rw - 8, y + int(rh * 0.46)), outline=(110, 78, 48))
    d.rectangle((x + 8, y + int(rh * 0.52), x + rw - 8, y + rh - 12), outline=(110, 78, 48))
    d.ellipse((x + rw - 16, y + int(rh * 0.48), x + rw - 8, y + int(rh * 0.48) + 8), fill=(196, 164, 96))


def kind_for(key, face_id):
    if key in ('climb', 'tour'):
        return 'hatch'
    if 'stair' in key or face_id in ('bdeck_stairs_up', 'corridor_right', 'bdeck_stairs'):
        return 'stair'
    if face_id in FAR_SINGLE and key == exits_for_id.get(face_id, [None])[0]:
        return 'far'
    return 'door'


faces = []
for ring in PLAN['rings']:
    for face in ring['faces']:
        faces.append((ring['place'], face))

exits_for_id = {face['id']: exits_for(face) for _, face in faces}
views = {}
for place, face in faces:
    fid = face['id']
    keys = exits_for(face)
    if fid in KEEP:
        src, rects = KEEP[fid]
        (OUT / f'{fid}.webp').write_bytes(src.read_bytes())
        views[fid] = rects
        continue
    base = BASE_FOR_PLACE.get(place, ART / 'corridor_forward.webp')
    im = vary(Image.open(base).convert('RGB').resize((768, 432), Image.Resampling.LANCZOS), fid)
    im = cover_wall(im)
    rects = slots_for(fid, keys)
    for key, rect in rects.items():
        paint_opening(im, rect, kind_for(key, fid))
    im.save(OUT / f'{fid}.webp', 'WEBP', quality=72, method=4)
    views[fid] = rects

# Prove the files differ.
hashes = {}
for fid in views:
    digest = hashlib.sha256((OUT / f'{fid}.webp').read_bytes()).hexdigest()
    hashes.setdefault(digest, []).append(fid)
dupes = {k: v for k, v in hashes.items() if len(v) > 1}
if dupes:
    raise SystemExit('duplicate art: ' + str(dupes))
(OUT / 'doors.json').write_text(json.dumps({'views': views}, indent=1))
print('facings', len(views), 'unique', len(hashes))
