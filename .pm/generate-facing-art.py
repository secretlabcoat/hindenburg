#!/usr/bin/env python3
"""Generate up to ten pending facing candidates, never repeat requests after both quotas fail.
Requires gradio_client + Pillow. Tokens are read ONLY from HF_TOKEN/HF_TOKEN_2.
Outputs remain candidates until visually reviewed; use --accept ID after review.
"""
import argparse,hashlib,json,os,shutil,subprocess
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1];PM=ROOT/'.pm';MP=PM/'art-facing-manifest.json'
p=argparse.ArgumentParser();p.add_argument('--limit',type=int,default=10);p.add_argument('--accept',nargs='+');a=p.parse_args()
m=json.loads(MP.read_text());candidates=PM/'art-candidates';candidates.mkdir(exist_ok=True)
if a.accept:
 for nid in a.accept:
  assert nid in m['facings'],nid
  src=candidates/(nid+'.webp');assert src.exists(),src
  dest=ROOT/'assets/art'/src.name;shutil.copy2(src,dest)
  f=m['facings'][nid];f.update(status='ready',reason='Generated with the specific facing prompt and visually reviewed',sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
 MP.write_text(json.dumps(m,indent=2,ensure_ascii=False)+'\n')
 subprocess.run(['python3',str(PM/'sync-facing-plan.py')],check=True)
 print('Accepted reviewed art:',', '.join(a.accept));raise SystemExit
from gradio_client import Client
names=[n for n in ('HF_TOKEN','HF_TOKEN_2') if os.environ.get(n)]
if not names:raise SystemExit('No authorized HF token in environment')
def safe(error):
 text=str(error)
 for name in names:text=text.replace(os.environ[name],'[REDACTED]')
 return text[:400]
def quota(error):return any(w in str(error).lower() for w in ('quota','zerogpu','429','rate limit'))
idx=0;client=None;attempts=[]
pending=[nid for nid,f in m['facings'].items() if f['status']=='placeholder' and not (candidates/(nid+'.webp')).exists()][:max(0,min(a.limit,10))]
for nid in pending:
 f=m['facings'][nid]
 while idx<len(names):
  try:
   if client is None:client=Client(m['generation']['space'],token=os.environ[names[idx]],verbose=False)
   print('Generating '+nid+' using '+names[idx]+' (value private)',flush=True)
   g=m['generation'];result=client.predict(f['prompt'],f['seed'],False,g['width'],g['height'],g['steps'],api_name='/infer')
   src=result[0];src=src.get('path') if isinstance(src,dict) else src
   im=Image.open(src).convert('RGB').resize((g['width'],g['height']),Image.Resampling.LANCZOS)
   dest=candidates/(nid+'.webp')
   for q in range(80,35,-5):
    im.save(dest,'WEBP',quality=q,method=6)
    if dest.stat().st_size<g['maxBytes']:break
   assert dest.stat().st_size<g['maxBytes'],'Image exceeds byte budget'
   attempts.append({'id':nid,'ok':True,'candidate':str(dest.relative_to(ROOT)),'seed':f['seed']});print('Candidate saved; visual review required',flush=True);break
  except Exception as e:
   attempts.append({'id':nid,'ok':False,'credential':names[idx],'quota':quota(e),'error':safe(e)})
   print(type(e).__name__+': '+safe(e),flush=True)
   if quota(e):idx+=1;client=None;continue
   (PM/'art-facing-attempt.json').write_text(json.dumps(attempts,indent=2)+'\n');raise SystemExit('Stopped on non-quota service failure; no retries')
 if idx>=len(names):print('All authorized HF quota exhausted; leave remaining placeholders for next run',flush=True);break
(PM/'art-facing-attempt.json').write_text(json.dumps(attempts,indent=2)+'\n')
