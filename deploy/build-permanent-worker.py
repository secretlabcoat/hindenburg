#!/usr/bin/env python3
"""Build the permanent Worker HTML.

Baseline is the catch-all HTML from
https://hindenburg.secretlabcoat-0ba.workers.dev/ (git 59d0b47).
Scene photographs are ShareHTML's ready WebPs, except the bathroom:
east, south, and west walls come from the uploaded 2026-11-08 originals.
The north curtain stays the reference those walls were drawn against.
The west wall is added to the washroom turn cycle. The south door still
exits to the B-deck corridor. The AI relay is unchanged.
"""
import base64, hashlib, json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BASE = (ROOT / 'permanent-baseline.html').read_bytes()
ART = ROOT / 'sharehtml-art'
BATH = ROOT / 'bathroom-20261108'
OUT = ROOT / 'hindenburg-worker.html'
MODULE = ROOT / 'hindenburg-worker-module.mjs'

# Authoritative bathroom WebPs. These replace the older ShareHTML bathroom bytes.
BATHROOM = {
    'washroom_basins': '6c5211f4fa640c9421381eab2771f7c3fdb8a41896b032585cee2cdbda340f8d',
    'washroom_door': '10dcbb67392fcbf1453968d630888424b7bc914e25405395a246b357db12c232',
    'washroom_wall': '774de38bf2eba9e7c7ec6ce98d09cc8389e5b91e5721e82f16bbcf213bbb6e6b',
}
# North curtain. reference.png in the upload decodes to this exact WebP.
STALL = '96135f0dfdc0b28b5aaef817c027a6c03703108588592610a2fd9fde4ab313f2'
OLD_BATHROOM = {
    'washroom_basins': '4cd0b7484391d0fec40bcd7e361744ad2417349fe038f2c99baa2638db385a2b',
    'washroom_door': '0a213e84d96dcecd32e94288bd8c27da289d0604437b8e0941059f7e3aed7134',
}

# Worker view id -> ShareHTML ready photograph. bdeck_washroom is the permanent
# game's name for the corridor wall whose ready photo is bdeck_corr_washdoor.
VIEW_ART = {
    'washroom_stall': 'washroom_stall',
    'washroom_basins': 'washroom_basins',
    'washroom_door': 'washroom_door',
    'washroom_wall': 'washroom_wall',
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
if expected.get('washroom_stall') != STALL:
    raise SystemExit('north curtain hash drifted')
images = {}
for name, sha in expected.items():
    if name in BATHROOM:
        continue  # older ShareHTML bathroom bytes stay on disk for comparison only
    raw = (ART / f'{name}.webp').read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        raise SystemExit(f'{name} sha256 {got} != ShareHTML {sha}')
    images[name] = 'data:image/webp;base64,' + base64.b64encode(raw).decode()
for name, sha in BATHROOM.items():
    raw = (BATH / f'{name}.webp').read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        raise SystemExit(f'{name} sha256 {got} != uploaded bathroom {sha}')
    images[name] = 'data:image/webp;base64,' + base64.b64encode(raw).decode()
if hashlib.sha256(base64.b64decode(images['washroom_stall'].split(',',1)[1])).hexdigest() != STALL:
    raise SystemExit('stall photograph is not the north reference')

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
.scene .paint.has-art>:not(.scene-art)[data-object],
.scene .paint.has-art>:not(.scene-art)[data-wash],
.scene .paint.has-art>:not(.scene-art)[data-act],
.scene .paint.has-art>:not(.scene-art)[data-x11],
.scene .paint.has-art>.photo-exit{opacity:0;pointer-events:auto;z-index:4}
.scene .paint.has-art [data-person]{opacity:1!important;z-index:6;pointer-events:auto}
.scene .paint.has-art .wash-curtain{left:33%;width:34%;top:18%;bottom:28%}
.scene .paint.has-art .wash-mirror{left:38%;width:24%;top:14%;height:28%}
.scene .paint.has-art .wash-door{left:40%;width:20%;top:16%;height:62%}
.scene .paint.has-art .doorway{left:36%;width:28%;top:16%;height:64%}
.photo-exit{position:absolute;left:42%;top:28%;width:16%;height:36%;background:transparent;border:0;padding:0;cursor:pointer}
.photo-exit:focus{outline:2px solid #f5d895}
</style>
""".strip()

script = """
<script id="sharehtml-raster-art">
(function(){
const PACK=%s;
function ensureWashroom(){
  nodes.washroom_wall=nodes.washroom_wall||{name:'B-Deck Washroom',facing:'tiled wall and towel rail',left:'washroom_door',right:'washroom_stall',forward:null,style:'washwall'};
  const wall=nodes.washroom_wall;
  wall.name='B-Deck Washroom';
  wall.facing='tiled wall and towel rail';
  wall.left='washroom_door';
  wall.right='washroom_stall';
  wall.forward=null;
  wall.style='washwall';
  nodes.washroom_stall.left='washroom_wall';
  nodes.washroom_stall.right='washroom_basins';
  nodes.washroom_stall.forward=null;
  nodes.washroom_basins.left='washroom_stall';
  nodes.washroom_basins.right='washroom_door';
  nodes.washroom_basins.forward=null;
  nodes.washroom_door.left='washroom_basins';
  nodes.washroom_door.right='washroom_wall';
  nodes.washroom_door.forward='bdeck_washroom';
}
ensureWashroom();
const oldDraw=draw;
draw=function(){
  ensureWashroom();
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

deck_css = r"""
<style id="deck-hud">
#deckhud{order:0;flex:0 0 auto;background:#d6e6f5;color:#1c2430;border:2px solid #243044;margin:0 0 3px}
.shell:has(#deckhud-large:not([hidden])) .scene{flex:0 1 30vh;min-height:120px}
.shell:has(#deckhud-large:not([hidden])) .dialogue{height:72px}
.deckhud-bar{display:flex;align-items:center;gap:8px;padding:4px 6px}
#deckhud-toggle{min-height:44px;min-width:44px;background:#243044;color:#f4efe6;border:0;padding:6px 10px;font:14px Georgia,serif}
#deckhud-where{font:13px Georgia,serif}
.deckhud-compact svg{width:100%;height:72px;display:block;pointer-events:none}
.deckhud-large{padding:6px 8px 8px;max-height:min(42vh,280px);overflow:auto}
.deckhud-large svg{width:100%;height:auto;display:block}
#deckhud-deck{min-height:44px;font:16px Georgia,serif;margin-left:6px}
#deckhud-facing{font:13px Georgia,serif;margin:6px 0}
@media(max-height:700px){.deckhud-compact svg{height:56px}.deckhud-large{max-height:28vh}}
</style>
"""
plan = json.loads((ROOT / 'deck-plans' / 'plans.json').read_text())
deck_js = (ROOT / 'deck-map.js').read_text()
deck_script = '<script id="deck-hud">\nconst DECK_PLAN=' + json.dumps(plan, separators=(',', ':')) + ';\n' + deck_js + '\nhindenburgMountDeckHud(DECK_PLAN);\n</script>'
html = BASE.decode('utf-8')
if '</body>' not in html:
    raise SystemExit('baseline has no body close')
html = html.replace('</body>', style + '\n' + script + '\n' + deck_css + '\n' + deck_script + '\n</body>', 1)
if html.count(relay.decode()) < 1:
    raise SystemExit('relay URL dropped')
for name in OLD_BATHROOM:
    old_b64 = base64.b64encode((ART / f'{name}.webp').read_bytes()).decode()
    if old_b64 in html:
        raise SystemExit(f'old ShareHTML {name} photograph is still embedded')
data = html.encode()
OUT.write_bytes(data)
digest = hashlib.sha256(data).hexdigest()
module = (
    "// ES module package for the EXISTING Worker named hindenburg.\n"
    "// Returns deploy/hindenburg-worker.html for every path.\n"
    "// Do not deploy this file to hindenburg-ai. Do not create a new Worker.\n"
    f"// SHA-256 of the HTML body: {digest}\n"
    "const HTML = " + json.dumps(html) + ";\n"
    "export default {\n"
    "  async fetch() {\n"
    "    return new Response(HTML, {\n"
    "      headers: {\n"
    "        'content-type': 'text/html;charset=utf-8',\n"
    "        'cache-control': 'no-cache'\n"
    "      }\n"
    "    });\n"
    "  }\n"
    "};\n"
)
MODULE.write_text(module)
print(OUT.name, len(data), digest)
print('photos', len(images), 'views', len(VIEW_ART), 'unmapped', ','.join(UNMAPPED_READY))
