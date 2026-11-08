# Chief Steward reaction quality (2026-11-06 evening, Toronto)

CPU LivePortrait, FP32 (`--flag_force_cpu --no-flag-use-half-precision`).
Pasteback/stitching on. Drivers from `assets/examples/driving/*.pkl`.

## Source
Fred’s iPhone screenshot `c36773da…jpg` (1179×2556). Portrait band cropped
square at `(300,920)–(870,1490)`, upscaled Lanczos → 768×768
(`source_square_verified.png`). Script then re-framed to 4:5 → `source.png`
576×768. **"Made with AI" badge cropped out**; no phone UI / rounded corners.

Prior stand-in outputs archived under `standin/`.

| clip | driver | gen time | MP4 | verdict |
|------|--------|----------|-----|---------|
| idle | wink.pkl | 154 s | 76 KB | **Good** — subtle blink/micro-motion; uniform stable; Fred’s real portrait |
| smile | laugh.pkl | 147 s | 88 KB | **OK** — open-mouth pleased chuckle more than closed smile; no melt |
| nod | shy.pkl | 221 s | 137 KB | **OK** — soft head dip; mid-frame near-neutral (motion in clip) |
| surprised | open_lip.pkl | 207 s | 104 KB | **OK** — eyes/brows lift; mouth change mild |
| frown | aggrieved.pkl | 157 s | 84 KB | **Good** — sterner brow/mouth; usable as suspicious |
| shake | shake_face.pkl | 247 s | 144 KB | **Good** — clear disagree head turn; no warping; largest but under 150 KB |

No clips rejected. Face-region brightness mid-frames: mean ~68–73, 0% near-black
(no NaN / black-face). No badge remnants in any mid-frame or preview sheet.
All web MP4/WebM/poster files under ~150 KB. Preview contact sheet + labeled
concat written.

## Paths
- `/workspace/portraits/steward/preview.mp4` (324 KB)
- `/workspace/portraits/steward/preview.png` (611 KB)
- `/workspace/portraits/steward/source.png` (576×768)
- clips: `idle|smile|nod|surprised|frown|shake` `.mp4` / `.webm` / `_poster.webp`

## Not done
Not committed to hindenburg. Not wired into the game.
