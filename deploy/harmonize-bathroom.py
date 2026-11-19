#!/usr/bin/env python3
"""Grade the four washroom facings onto one palette.

The target is the shell (tiles, floor, ceiling, wood) of the newer
2026-11-08 walls: east basins, south door, and west wall. The north
curtain is the older reference photograph, so it moves the farthest.
Fixtures stay where they are; only colour, brightness, and contrast change.
"""
import hashlib
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'bathroom-harmonized'
SRC = {
    'washroom_stall': Path('/workspace/art/bathroom-20261108/reference.png'),
    'washroom_basins': Path('/workspace/art/bathroom-20261108/washroom_basins.png'),
    'washroom_door': Path('/workspace/art/bathroom-20261108/washroom_door.png'),
    'washroom_wall': Path('/workspace/art/bathroom-20261108/washroom_wall.png'),
}
NEWER = ('washroom_basins', 'washroom_door', 'washroom_wall')
M = np.array([
    [0.4124564, 0.3575761, 0.1804375],
    [0.2126729, 0.7151522, 0.0721750],
    [0.0193339, 0.1191920, 0.9503041],
], dtype=np.float64)
MINV = np.linalg.inv(M)
WHITE = np.array([0.95047, 1.0, 1.08883])
DELTA = 6 / 29


def srgb_to_linear(c):
    x = c / 255.0
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(c):
    c = np.clip(c, 0, 1)
    y = np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)
    return np.clip(y * 255.0, 0, 255)


def f_lab(t):
    return np.where(t > DELTA ** 3, np.cbrt(t), t / (3 * DELTA ** 2) + 4 / 29)


def f_inv(t):
    return np.where(t > DELTA, t ** 3, 3 * DELTA ** 2 * (t - 4 / 29))


def rgb_to_lab(rgb):
    xyz = srgb_to_linear(rgb.astype(np.float64)) @ M.T
    f = f_lab(xyz / WHITE)
    L = 116 * f[..., 1] - 16
    a = 500 * (f[..., 0] - f[..., 1])
    b = 200 * (f[..., 1] - f[..., 2])
    return np.stack([L, a, b], axis=-1)


def lab_to_rgb(lab):
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    fy = (L + 16) / 116
    fx = fy + a / 500
    fz = fy - b / 200
    xyz = np.stack([f_inv(fx), f_inv(fy), f_inv(fz)], axis=-1) * WHITE
    return linear_to_srgb(xyz @ MINV.T)


def load(path):
    im = Image.open(path).convert('RGB')
    if im.size != (768, 432):
        im = im.resize((768, 432), Image.Resampling.LANCZOS)
    return np.asarray(im, dtype=np.float64)


def shell_samples(rgb):
    h, w, _ = rgb.shape
    lab = rgb_to_lab(rgb)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    tile = (g > r + 12) & (g > b + 8) & (lum > 55) & (lum < 190)
    boxes = [
        (0.06, 0.16, 0.30, 0.72),
        (0.70, 0.16, 0.94, 0.72),
    ]
    picks = []
    for x0, y0, x1, y1 in boxes:
        ys, ye = int(h * y0), int(h * y1)
        xs, xe = int(w * x0), int(w * x1)
        m = tile[ys:ye, xs:xe]
        pix = lab[ys:ye, xs:xe][m]
        if len(pix):
            picks.append(pix)
    tiles = np.concatenate(picks) if picks else lab.reshape(-1, 3)[:1000]
    floor = lab[int(h * 0.80):int(h * 0.97), int(w * 0.22):int(w * 0.78)].reshape(-1, 3)
    ceil = lab[int(h * 0.01):int(h * 0.08), int(w * 0.34):int(w * 0.66)].reshape(-1, 3)
    wood = lab[int(h * 0.07):int(h * 0.15), int(w * 0.18):int(w * 0.82)].reshape(-1, 3)
    rng = np.random.default_rng(4)

    def take(arr, n):
        if len(arr) > n:
            return arr[rng.choice(len(arr), n, replace=False)]
        return arr

    return np.concatenate([take(tiles, 7000), take(floor, 5000), take(ceil, 2000), take(wood, 2000)])


def region_means(rgb):
    """Means for the surfaces that should agree from wall to wall."""
    h, w, _ = rgb.shape
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    tile_m = (g > r + 12) & (g > b + 8) & (lum > 55) & (lum < 190)
    picks = []
    for x0, x1 in ((0.06, 0.28), (0.72, 0.94)):
        sl = tile_m[int(h * 0.18):int(h * 0.42), int(w * x0):int(w * x1)]
        pix = rgb[int(h * 0.18):int(h * 0.42), int(w * x0):int(w * x1)][sl]
        if len(pix):
            picks.append(pix)
    tile = np.concatenate(picks).mean(axis=0)
    floor = rgb[int(h * 0.82):int(h * 0.96), int(w * 0.28):int(w * 0.72)].reshape(-1, 3)
    fl = floor @ np.array([0.2126, 0.7152, 0.0722])
    cream = floor[fl > 150].mean(axis=0)
    black = floor[fl < 55].mean(axis=0)
    ceil = rgb[int(h * 0.015):int(h * 0.07), int(w * 0.38):int(w * 0.62)].reshape(-1, 3)
    cl = ceil @ np.array([0.2126, 0.7152, 0.0722])
    ceil = ceil[(cl > 80) & (cl < 200)].mean(axis=0)
    return {'black': black, 'tile': tile, 'cream': cream, 'ceil': ceil}


def lut_for(src, dst):
    xs = [0.0, float(src['black']), float(src['tile']), float(src['cream']), 255.0]
    ys = [0.0, float(dst['black']), float(dst['tile']), float(dst['cream']), 255.0]
    order = np.argsort(xs)
    xs = [xs[i] for i in order]
    ys = [ys[i] for i in order]
    clean_x, clean_y = [], []
    for x, y in zip(xs, ys):
        if clean_x and x <= clean_x[-1] + 0.4:
            continue
        clean_x.append(x)
        clean_y.append(y)
    for i in range(1, len(clean_y)):
        if clean_y[i] < clean_y[i - 1]:
            clean_y[i] = clean_y[i - 1]
    return np.interp(np.arange(256), clean_x, clean_y)


def apply_luts(rgb, luts):
    out = np.empty_like(rgb)
    idx = np.clip(np.rint(rgb), 0, 255).astype(np.uint8)
    for ch in range(3):
        out[..., ch] = luts[ch][idx[..., ch]]
    return out


def feather_offset(rgb, y0, y1, delta, keep):
    """Add a vertical feather of `delta` where `keep` is true."""
    h = rgb.shape[0]
    yy = np.linspace(0, 1, h)[:, None]
    if y1 <= y0:
        return rgb
    ramp = np.clip((yy - y0) / max(y1 - y0, 1e-3), 0, 1)
    # Peak in the middle of the band, zero at the edges.
    weight = np.sin(ramp * np.pi) ** 2
    mask = keep.astype(np.float64) * weight
    return np.clip(rgb + delta * mask[..., None], 0, 255)


def grade(rgb, target):
    src = region_means(rgb)
    dst = {k: np.array(target[k], dtype=np.float64) for k in ('black', 'tile', 'cream')}
    out = rgb
    for _ in range(3):
        luts = [lut_for(
            {k: src[k][ch] for k in ('black', 'tile', 'cream')},
            {k: dst[k][ch] for k in ('black', 'tile', 'cream')},
        ) for ch in range(3)]
        out = apply_luts(rgb, luts)
        got = region_means(out)
        for key in dst:
            dst[key] = np.clip(dst[key] - (got[key] - target[key]), 0, 255)
        # Keep the anchors in shadow → tile → highlight order.
        dst['tile'] = np.maximum(dst['tile'], dst['black'] + 8)
        dst['cream'] = np.maximum(dst['cream'], dst['tile'] + 20)
    r, g, b = out[..., 0], out[..., 1], out[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    # Ceiling paint only: leave the lamp cores and the green tile alone.
    ceil_keep = (lum > 70) & (lum < 215) & ~((g > r + 10) & (g > b))
    ceil_now = region_means(out)['ceil']
    out = feather_offset(out, 0.0, 0.09, (target['ceil'] - ceil_now) * 0.9, ceil_keep)
    return np.clip(out, 0, 255)


def main():
    OUT.mkdir(exist_ok=True)
    rgb = {name: load(path) for name, path in SRC.items()}
    means = {name: region_means(arr) for name, arr in rgb.items()}
    target = {key: np.mean([means[name][key] for name in NEWER], axis=0) for key in means['washroom_door']}
    print('target tile', target['tile'].round(1), 'cream', target['cream'].round(1), 'black', target['black'].round(1), 'ceil', target['ceil'].round(1))
    for name, arr in rgb.items():
        graded = grade(arr, target)
        path = OUT / f'{name}.webp'
        Image.fromarray(graded.astype(np.uint8)).save(path, format='WEBP', quality=85, method=6)
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        after = region_means(graded)
        print(name, digest)
        for key in ('tile', 'cream', 'black', 'ceil'):
            err = after[key] - target[key]
            print(f'  {key:6} {after[key].round(1)} err {err.round(1)}')


if __name__ == '__main__':
    main()
