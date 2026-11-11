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

# North curtain WebP kept on disk as the grading source. The embedded
# washroom pictures are the colour-matched set in bathroom-harmonized/.
STALL = '96135f0dfdc0b28b5aaef817c027a6c03703108588592610a2fd9fde4ab313f2'
HARM = ROOT / 'bathroom-harmonized'
HARMONIZED = {
    'washroom_stall': '81f1de5d504d2f3e3ab373339be83727df3d937ae100d716e5a4a3e635a5493b',
    'washroom_basins': '6e777ff7cdbb533d16ab3c7fd1472561e9bf7ed75ec06d549f693b0cd6af1a84',
    'washroom_door': 'a9eca5ea53becf193058572c18902246f2dd8d4062a3ad4139c00b5291885cb6',
    'washroom_wall': '205b1a3f9acc9af13ab08661abca3a915b4486e86242a0a0b322b55e36c3b8b7',
}
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
    'cabin_door': 'cabin_door',
    'lounge_windows': 'lounge_windows',
    'lounge_people': 'lounge_people',
    'promenade_far': 'promenade_far',
    'promenade_side': 'promenade_far',
    'corridor_forward': 'corridor_forward',
    'corridor_end': 'corridor_forward',
    'corridor_left': 'corridor_forward',
    'corridor_right': 'bdeck_corr_stairs',
    'bar_counter': 'bar_counter',
    'office_desk': 'office_desk',
    'bdeck_washroom': 'bdeck_corr_washdoor',
    'bdeck_stairs': 'bdeck_corr_stairs',
    'bdeck_stairs_up': 'bdeck_stairs_up',
    'bdeck_stairs_wall': 'bdeck_stairs_wall',
    'bdeck_stairs_door': 'bdeck_stairs_door',
    'bdeck_stairs_bar': 'bdeck_stairs_bar',
    'bdeck_corr_office': 'bdeck_corr_south',
    'b_mid_w': 'bdeck_corr_office',
    'b_mid_n': 'corridor_forward',
    'b_mid_s': 'corridor_forward',
    'b_cab_n': 'corridor_forward',
    'b_crew_n': 'corridor_forward',
    'bdeck_cabins': 'corridor_forward',
    'adeck_cabin': 'adeck_cabin',
    'keel_walk': 'keel_walk',
    'keel_b_e': 'keel_walk',
    'keel_m_e': 'keel_walk',
    'keel_m_w': 'keel_walk',
    'keel_e_w': 'keel_walk',
    'control_helm': 'control_helm',
    'girder_nook': 'girder_nook',
    'tour_shoes': 'tour_shoes',
    'tour_cells': 'tour_cells',
    'tour_tanks': 'tour_tanks',
    'tour_end': 'tour_end',
}
# These ready photos have no node in the permanent 36-view game.
UNMAPPED_READY = ['bdeck_corr_stairs']
# Painted central opening, and the permanent scene has no data-move hotspot.
CENTER_EXIT = ['keel_walk', 'tour_end']

expected = json.loads((ART / 'hashes.json').read_text())
if expected.get('washroom_stall') != STALL:
    raise SystemExit('north curtain hash drifted')
if hashlib.sha256((ART / 'washroom_stall.webp').read_bytes()).hexdigest() != STALL:
    raise SystemExit('north curtain file changed')
images = {}
for name, sha in expected.items():
    if name in HARMONIZED:
        continue  # bathroom walls are the harmonized set, not the older bytes
    raw = (ART / f'{name}.webp').read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        raise SystemExit(f'{name} sha256 {got} != ShareHTML {sha}')
    images[name] = 'data:image/webp;base64,' + base64.b64encode(raw).decode()
for name, sha in HARMONIZED.items():
    raw = (HARM / f'{name}.webp').read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        raise SystemExit(f'{name} sha256 {got} != harmonized bathroom {sha}')
    images[name] = 'data:image/webp;base64,' + base64.b64encode(raw).decode()
FACE = ROOT / 'facing-art'
FACING = {
    'cabin_door': '8e387bd2cf4a073c9aa8325b033fa509970feef37e9bb11bd7aa51d030683e17',
    'tour_shoes': 'd99b239f7f7be69697870b8616f7446af2ba680ff83fa9167b05640f8eb56cdf',
    'tour_cells': '332249cca5d13a37ee6115e00223bd237b60897c58fed9ef063d27aec481b1d3',
    'bdeck_stairs_up': 'bd0cf913494ad0eb5b28fc39d1f8cb54f12a2fd063c5b404d3dc30c1f6143878',
    'bdeck_stairs_wall': '66fa02a84722b59b0554d5f347102cd1abe6aa42bf618a055be4f2e497b00dab',
    'bdeck_stairs_door': '703902a47d1fa95f98987ab1ff08b66ea7a5b85841b60bcfe6fee69914d5294f',
    'bdeck_stairs_bar': '3470159d2a2e6cfce8d986a2abec4e90e797aa883b6a68b9ad611cdef9772f68',
    'bdeck_corr_south': '80ddcbde4a947077e7b9b32ba7a4a1303349ee1fe3eef64e552b32674e28480f',
}
for name, sha in FACING.items():
    raw = (FACE / f'{name}.webp').read_bytes()
    got = hashlib.sha256(raw).hexdigest()
    if got != sha:
        raise SystemExit(f'{name} sha256 {got} != facing art {sha}')
    images[name] = 'data:image/webp;base64,' + base64.b64encode(raw).decode()
steward_png = (FACE / 'steward-portrait.png').read_bytes()
if hashlib.sha256(steward_png).hexdigest() != '03b94b7a86a8beabc6c5a6dc3c3f9e4e6d1e740147e46a1f14213e2d08779dce':
    raise SystemExit('steward portrait hash drifted')
steward_uri = 'data:image/png;base64,' + base64.b64encode(steward_png).decode()

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
.scene .paint.has-art>.photo-exit{opacity:1;background:transparent;pointer-events:auto;z-index:6;cursor:pointer}
.scene .paint.has-art [data-move]{background:transparent!important;border-color:transparent!important;box-shadow:none!important;color:transparent}
.scene .paint.has-art [data-move]:before,.scene .paint.has-art [data-move]:after{content:none!important}
.photo-exit span{position:absolute;left:50%;bottom:0;transform:translateX(-50%);background:#23190ee8;color:#f3e2c0;font:12px Georgia,serif;padding:3px 6px;white-space:nowrap;opacity:0;pointer-events:none}
.photo-exit:hover span,.photo-exit:focus span{opacity:1}
.scene .paint.has-art [data-person]{opacity:1!important;z-index:6;pointer-events:auto}
.scene .paint.has-art [data-person].in-photo{background:transparent;filter:none}
.scene .paint.has-art [data-person].in-photo:before,
.scene .paint.has-art [data-person].in-photo:after{content:none!important;display:none!important}
.scene .paint.has-art [data-person].in-photo.photo-damina{left:18%!important;width:24%;top:48%;height:30%;bottom:auto}
.scene .paint.has-art [data-person].in-photo.photo-snardy{left:56%!important;width:26%;top:46%;height:34%;bottom:auto}
.scene .paint.has-art [data-person].in-photo>.exit-label{bottom:auto;top:-2px}
.scene .paint.has-art [data-person].in-photo:hover,
.scene .paint.has-art [data-person].in-photo:focus-visible{outline:1px solid #f5d89599}
.scene [data-person]:hover>.exit-label,
.scene [data-person]:focus>.exit-label,
.scene [data-person]:focus-visible>.exit-label{opacity:1}
.scene .paint.has-art .wash-curtain{left:34%;width:30%;top:14%;bottom:22%;background:transparent!important;border:0!important}
.scene .paint.has-art .wash-curtain:before,.scene .paint.has-art .wash-curtain:after{content:none!important}
.wash-toilet{position:absolute;left:66%;width:16%;top:50%;height:26%;background:transparent;border:0;padding:0;cursor:pointer;z-index:6}
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
  nodes.washroom_wall=nodes.washroom_wall||{name:'B-Deck Washroom',facing:'Towel Rail',left:'washroom_door',right:'washroom_stall',forward:null,style:'washwall'};
  const wall=nodes.washroom_wall;
  wall.name='B-Deck Washroom';
  wall.facing='Towel Rail';
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
#deckhud{position:fixed;z-index:30;left:8px;top:96px;width:152px;box-sizing:border-box;background:#d6e6f5ee;color:#1c2430;border:2px solid #243044;padding:4px}
#deckhud.is-collapsed{width:48px}
#deckhud.is-collapsed #deckhud-open{display:none}
#deckhud-collapse{min-height:36px;width:100%;background:#243044;color:#f4efe6;border:0;font:12px Georgia,serif;margin-bottom:4px}
.deckhud-mini{display:block;width:100%;padding:0;border:0;background:transparent;color:#1c2430;cursor:pointer;text-align:left}
#deckhud-where{display:block;font:11px Georgia,serif;line-height:1.2;margin:0 0 2px}
.deckhud-mini svg{width:100%;height:auto;display:block;pointer-events:none}
#deckpop[hidden]{display:none!important}
#deckpop{position:fixed;inset:0;z-index:50;background:#0c0a0880;display:flex;align-items:center;justify-content:center;padding:16px}
.deckpop-card{background:#d6e6f5;color:#1c2430;border:3px solid #243044;width:min(920px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;padding:12px;box-sizing:border-box}
#deckpop-close{min-height:44px;min-width:44px;background:#243044;color:#f4efe6;border:0;font:14px Georgia,serif;margin-bottom:8px}
#deckhud-deck{min-height:44px;font:16px Georgia,serif;margin-left:6px}
#deckhud-facing{font:14px Georgia,serif;margin:8px 0}
#deckhud-full svg{width:auto;height:min(70vh,640px);max-width:100%;display:block;margin:0 auto}
.exit-left{left:4%;width:28%}
.exit-right{left:68%;width:28%}
.exit-stairs-up{left:28%;width:44%;top:10%;height:78%}
.exit-stairs-door{left:36%;width:28%;top:14%;height:72%}
.exit-hall{left:42%;top:78%;width:16%;height:14%}
.door-crew{left:20%;width:18%;top:16%;height:66%}
.door-cabin{left:62%;width:18%;top:16%;height:66%}
.exit-hot{cursor:pointer}
.exit-label{position:absolute;left:50%;bottom:0;transform:translateX(-50%);background:#23190ee8;color:#f3e2c0;font:12px Georgia,serif;padding:3px 6px;white-space:nowrap;opacity:0;pointer-events:none;z-index:8}
.exit-hot:hover>.exit-label,.exit-hot:focus>.exit-label{opacity:1}
.exit-gated{left:4%;top:62%;width:28%;height:18%}
.exit-climb{left:36%;top:4%;width:28%;height:18%}
.exit-sink{left:8%;top:42%;width:22%;height:22%}
@media(max-width:700px){#deckhud{width:112px;top:84px}#deckhud.is-collapsed{width:44px}#deckhud-full svg{height:min(62vh,520px)}}
html,body{height:100%;overflow:hidden!important}
.shell{height:100dvh!important;max-height:100dvh!important;min-height:0!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;box-sizing:border-box;padding:4px!important;padding-bottom:calc(4px + env(safe-area-inset-bottom))!important;gap:3px!important}
.top{flex:0 0 auto}
.scene{flex:1 1 auto!important;min-height:0!important;height:auto!important}
.navdock{display:none!important}
.bottom{flex:0 0 auto;margin:0!important;display:grid!important;grid-template-columns:72px minmax(0,1fr)!important;gap:4px!important;align-items:stretch}
.arrowcol{display:flex;flex-direction:column;justify-content:center;gap:4px;padding:4px}
.arrowcol button{min-height:36px;font-size:20px;padding:2px 4px}
.viewlabel{font:12px Georgia,serif;color:#d9bd8d;margin:0 0 4px}
.dialogue{height:auto!important;max-height:22dvh;min-height:56px}
.inventory{grid-column:1/-1;max-height:64px;overflow:hidden}
.inv{grid-template-columns:repeat(6,minmax(0,1fr))!important}
.item{height:36px!important}
.actbtn{display:none!important}
.hot-person .steward-portrait{position:absolute;left:0;right:0;bottom:0;width:100%;height:78%;object-fit:cover;object-position:center top;border-radius:2px;pointer-events:none}
.hot-person:has(.steward-portrait):before,.hot-person:has(.steward-portrait):after{opacity:0}
@media(min-width:750px){
  .bottom{grid-template-columns:88px minmax(0,1fr) 210px!important}
  .inventory{grid-column:auto;max-height:none;overflow:visible}
  .item{height:49px!important}
  .dialogue{max-height:140px}
  .scene{min-height:240px!important}
}
</style>
"""
plan = json.loads((ROOT / 'deck-plans' / 'plans.json').read_text())
deck_js = (ROOT / 'deck-map.js').read_text()
deck_script = '<script id="deck-hud">\nconst DECK_PLAN=' + json.dumps(plan, separators=(',', ':')) + ';\nconst STEWARD_PORTRAIT=' + json.dumps(steward_uri) + ';\n' + deck_js + '\nhindenburgMountDeckHud(DECK_PLAN);\n</script>'
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
