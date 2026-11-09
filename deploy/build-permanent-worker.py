#!/usr/bin/env python3
"""Build the permanent Worker HTML: live game bytes plus ShareHTML raster art.

The baseline is the catch-all HTML served by
https://hindenburg.secretlabcoat-0ba.workers.dev/ (git 59d0b47).
Photographs are the 21 artStatus=ready WebPs embedded in
https://oofyjym.sharehtml.org/. Placeholder and CSS/vector art are not copied.
Navigation, node graph, and the hindenburg-ai relay are left unchanged.
"""
import base64, hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = (ROOT / 'permanent-baseline.html').read_bytes()
ART = ROOT / 'sharehtml-art'
OUT = ROOT / 'hindenburg-worker.html'

# Worker view id -> ShareHTML ready photograph. bdeck_washroom is the permanent
# game's name for the corridor wall whose ready photo is bdeck_corr_washdoor.
VIEW_ART = {
    'washroom_stall': 'washroom_stall',
    'washroom_basins': 'washroom_basins',
    'washroom_door': 'washroom_door',
    'cabin_bunk': 'cabin_bunk',
    'cabin_window': 'cabin_window',
    'cabin_desk': 'cabin_desk',
    'lounge_windows': 'lounge_windows',
    'lounge_people': 'lounge_people',
    'promenade_far': 'promenade_far',
    'corridor_forward': 'corridor_forward',
    'bar_counter': 'bar_counter',
    'office_desk': 'office_desk',
    'bdeck_washroom': 'bdeck_corr_washdoor',
    'adeck_cabin': 'adeck_cabin',
    'keel_walk': 'keel_walk',
    'control_helm': 'control_helm',
    'girder_nook': 'girder_nook',
    'tour_tanks': 'tour_tanks',
    'tour_end': 'tour_end',
}
# These ready photos have no node in the permanent 36-view game.
UNMAPPED_READY = ['bdeck_corr_stairs', 'bdeck_corr_office']
# Painted central opening, and the permanent scene has no data-move hotspot.
CENTER_EXIT = ['keel_walk', 'tour_end']

expected = json.loads((ART / 'hashes.json').read_text())
images = {}
for name, sha in expected.items():
    raw = (ART / f'{name}.webp').read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        raise SystemExit(f'{name} sha256 {got} != ShareHTML {sha}')
    images[name] = 'data:image/webp;base64,' + base64.b64encode(raw).decode()

payload = {
    'images': images,
    'viewArt': VIEW_ART,
    'centerExit': CENTER_EXIT,
}
# Keep the relay string byte-for-byte from the baseline.
relay = b"https://hindenburg-ai.secretlabcoat-0ba.workers.dev"
if relay not in BASE:
    raise SystemExit('baseline lost the AI relay URL')

style = r"""
<style id="sharehtml-raster-art">
.scene .scene-art{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0;pointer-events:none}
.scene .paint.has-art>:not(.scene-art){opacity:0}
.scene .paint.has-art>:not(.scene-art)[data-move],
.scene .paint.has-art>:not(.scene-art)[data-person],
.scene .paint.has-art>:not(.scene-art)[data-object],
.scene .paint.has-art>:not(.scene-art)[data-wash],
.scene .paint.has-art>:not(.scene-art)[data-act],
.scene .paint.has-art>:not(.scene-art)[data-x11],
.scene .paint.has-art>.photo-exit{opacity:0;pointer-events:auto;z-index:4}
.scene .paint.has-art .wash-curtain{left:34%;width:32%;top:18%;bottom:30%}
.scene .paint.has-art .wash-mirror{left:40%;width:22%;top:20%;height:26%}
.scene .paint.has-art .wash-door{left:36%;width:28%;top:14%;bottom:18%}
.scene .paint.has-art .doorway{left:36%;width:28%;top:16%;height:64%}
.photo-exit{position:absolute;left:42%;top:28%;width:16%;height:36%;background:transparent;border:0;padding:0;cursor:pointer}
.photo-exit:focus{outline:2px solid #f5d895}
</style>
""".strip()

script = """
<script id="sharehtml-raster-art">
(function(){
const PACK=%s;
const oldDraw=draw;
draw=function(){
  const result=oldDraw.apply(this, arguments);
  const title=document.querySelector('#titleoverlay');
  const paint=document.querySelector('#scene .paint');
  const artId=PACK.viewArt[view];
  if(!paint||!artId||!title||!title.hidden) return result;
  const img=document.createElement('img');
  img.className='scene-art';
  img.alt='';
  img.decoding='sync';
  const mark=()=>{if(img.isConnected&&img.naturalWidth>0)paint.classList.add('has-art')};
  img.onload=mark;
  img.onerror=()=>{img.remove();paint.classList.remove('has-art')};
  img.src=PACK.images[artId];
  paint.insertBefore(img, paint.firstChild);
  mark();
  queueMicrotask(mark);
  if(typeof img.decode==='function') img.decode().then(mark).catch(()=>{});
  const n=nodes[view];
  if(n&&n.forward&&PACK.centerExit.indexOf(view)>=0&&!paint.querySelector('[data-move]')){
    const b=document.createElement('button');
    b.type='button';
    b.className='photo-exit';
    b.dataset.move=n.forward;
    b.setAttribute('aria-label', n.facing);
    b.onclick=()=>travel(b.dataset.move);
    paint.append(b);
  }
  return result;
};
})();
</script>
""" % json.dumps(payload, separators=(',', ':'))

html = BASE.decode('utf-8')
if '</body>' not in html:
    raise SystemExit('baseline has no body close')
html = html.replace('</body>', style + '\n' + script + '\n</body>', 1)
if html.count(relay.decode()) < 1:
    raise SystemExit('relay URL dropped')
data = html.encode()
OUT.write_bytes(data)
print(OUT.name, len(data), hashlib.sha256(data).hexdigest())
print('photos', len(images), 'views', len(VIEW_ART), 'unmapped', ','.join(UNMAPPED_READY))
