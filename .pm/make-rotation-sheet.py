#!/usr/bin/env python3
"""Four columns per location, actual desktop renders (not old/copied WebP files)."""
from pathlib import Path
import json
from PIL import Image,ImageDraw,ImageFont
P=Path(__file__).resolve().parent;m=json.loads((P/'art-facing-manifest.json').read_text());w,h=384,246;gap=8;header=34
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14);small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
out=Image.new('RGB',(4*w+gap*5,len(m['locations'])*(h+header+gap)+gap),'#151310');d=ImageDraw.Draw(out)
for ri,loc in enumerate(m['locations']):
 y=gap+ri*(h+header+gap);d.text((gap,y),loc['name']+' — clockwise turns, two columns apart = opposite',font=font,fill='#f0d5a1')
 for ci,nid in enumerate(loc['loop']):
  f=m['facings'][nid];x=gap+ci*(w+gap);im=Image.open(P/'rotation-frames'/(nid+'.png')).convert('RGB');im.thumbnail((w,208));out.paste(im,(x,y+header));d.text((x+2,y+header+209),nid,font=small,fill='#faf2dd');d.text((x+2,y+header+226),f['framing']+' · '+('ART' if f['status']=='ready' else 'CSS / pending art'),font=small,fill='#a9d1ac' if f['status']=='ready' else '#e9b383')
out.save(P/'rotation-sheet.png');print(P/'rotation-sheet.png',out.size)
