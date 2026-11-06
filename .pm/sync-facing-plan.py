#!/usr/bin/env python3
"""Sync graph, embedded renderer, docs and legacy routine mirrors from the reviewed manifest.
After visually reviewing generated art: set facings[id].status/node.artStatus to ready,
update its sha256, then run this. Pin ART_COMMIT separately to the committed image revision.
"""
import json,re
from pathlib import Path
R=Path(__file__).resolve().parents[1];P=R/'.pm'
m=json.loads((P/'art-facing-manifest.json').read_text());facings=m['facings'];nodes={}
for loc in m['locations']:
 ids=loc['loop']
 assert len(ids)==4 and len(set(ids))==4
 for i,nid in enumerate(ids):
  f=facings[nid];n=f['node'];n.update(left=ids[(i-1)%4],right=ids[(i+1)%4],artStatus=f['status'],framing=f['framing'],fallback=f['feature'])
  nodes[nid]=n
assert len(nodes)==76 and len(m['locations'])==19
m['regeneration']=[n for n,f in facings.items() if f['status']=='placeholder']
(P/'art-facing-manifest.json').write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')
data={'node_count':len(nodes),'location_count':len(m['locations']),'aliases':m['aliases'],'start':m['start'],'nodes':nodes}
(P/'rotation-nodes-final.json').write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
js='const ROTATION_NODES='+json.dumps(nodes,indent=2,ensure_ascii=False)+';\nconst ROTATION_ALIASES='+json.dumps(m['aliases'])+';\n'
(P/'rotation-nodes-final.js').write_text(js)
target={'art_key':'node_id','source':'art-facing-manifest.json','locations':[]}
for loc in m['locations']:
 target['locations'].append({**loc,'facings':[{'id':nid,**nodes[nid]} for nid in loc['loop']]})
(P/'rotation-target.json').write_text(json.dumps(target,indent=2,ensure_ascii=False)+'\n')
(P/'art-placeholders.json').write_text(json.dumps(m['regeneration'],indent=2)+'\n')
html=(R/'index.html').read_text()
block='<script>\n/* ---- Titanic-style 4-facing rotation (applied last so it wins over earlier patches) ---- */\n'+js+(P/'facing-runtime.js').read_text()+'\n</script>'
pattern=r'<script>\s*/\* ---- Titanic-style 4-facing rotation.*?</script>'
html,n=re.subn(pattern,lambda _:block,html,flags=re.S);assert n==1
css='<style id="physical-facing-fallback">\n'+(P/'facing-fallback.css').read_text()+'</style>'
if '<style id="physical-facing-fallback">' in html:html=re.sub(r'<style id="physical-facing-fallback">.*?</style>',lambda _:css,html,flags=re.S)
else:html=html.replace('</head>',css+'</head>',1)
html=html.replace("  const n=nodes[viewId];\n  const primary", "  const n=nodes[viewId];\n  if(!n || n.artStatus!=='ready') return; // Never display a wrong/copy placeholder photograph.\n  const primary")
html=html.replace("const fallback=n&&n.style&&n.style!==viewId?artUrl(n.style):null;", "const fallback=null; // No cross-facing/style photograph reuse; CSS is the fallback.")
(R/'index.html').write_text(html)
# The existing daily routine's paths stay compatible, but the repo is authoritative now.
legacy=Path('/workspace/scratch/hb-art')
if legacy.exists():
 (legacy/'need.json').write_text(json.dumps(m['regeneration'],indent=2)+'\n');(legacy/'nodes.json').write_text(json.dumps(nodes,indent=2)+'\n');(legacy/'placeholders.json').write_text(json.dumps(m['regeneration'],indent=2)+'\n')
text='''# Hindenburg art generation prompts — authoritative 76-facing plan

## Style bible — global lock

'''+m['styleLock']+'''

## Physical framing rules
- Every location has four 90° facings; a hallway has two OPPOSITE long axial views and two OPPOSITE close perpendicular side walls.
- Side walls: front-on elevation, shallow floor strip, no long hallway or vanishing point. A visible actual door may be entered; a solid wall/window may not.
- Rooms: four specific walls, no repeated full-room panorama. Same material kit and eye height across a location; adjacent seeds help but do not guarantee geometry.
- Each facing has a unique prompt below and in `art-facing-manifest.json`. Legacy style prompts are superseded.
- Render 768×432, FLUX.1-schnell, 4 steps, WebP <150 KB, no text/watermarks, no modern objects, people only where explicitly requested.

## Routine / regeneration contract
`art-facing-manifest.json` is the source of truth; `art-placeholders.json` is the generated pending list. Do NOT infer completion from a WebP existing: wrong copied files remain on disk for history but are NOT displayed.
Use `.pm/generate-facing-art.py --limit 10` with HF_TOKEN then HF_TOKEN_2 from environment; stop once both quotas are exhausted, no repeated quota retries. Each image requires visual review: generated output remains a candidate until accepted. After review set `facings[id].status="ready"`, update SHA-256, run `python3 .pm/sync-facing-plan.py`, commit images, then pin ART_COMMIT to that asset commit. Sync writes the old `/workspace/scratch/hb-art/{need,nodes,placeholders}.json` mirrors used by the existing routine; old generation logs must not cause current placeholders to be skipped. CSS remains visible for pending or failed photos. Never fall back to a different facing's image. Never deploy automatically.

'''
for loc in m['locations']:
 text+='## '+loc['name']+'\n\nMaterial lock: '+loc['roomPrefix']+'. Seed family: '+str(loc['seedBase'])+'. Clockwise: '+' → '.join(loc['loop'])+'.\n\n'
 for nid in loc['loop']:
  f=facings[nid];text+='### '+nid+' — '+f['status']+' / '+f['framing']+'\n\nSeed '+str(f['seed'])+'; `assets/art/'+nid+'.webp`. '+f['reason']+'.\n\n**Append to global + material lock:** '+f['detail']+'\n\n'
(P/'art-prompts.md').write_text(text.rstrip()+'\n')
print('Synced',len(nodes),'facings;',len(m['regeneration']),'placeholders')
