from pathlib import Path
import json,collections
D=Path(__file__).parent;t=json.loads((D.parent/'src/topology-v3.json').read_text());r=t['rooms'];tests=[]
def check(v,label):assert v,label;tests.append(label)
check(len(r)==19,'19 room identities');check(len({v for x in r.values() for v in x['views']})==76,'76 unique world-facing views')
occ={}
for id,x in r.items():
 check(len(x['views'])==4,id+': four compass headings')
 for c in x['cells']:
  key=(x['deck'],*c);check(key not in occ,id+': occupied cell does not overlap another room');occ[key]=id
 check(x['anchor'] in x['cells'],id+': map dot anchor is actually inside room')
for e in t['edges']:
 a,b=r[e['a']],r[e['b']];check(e['hb']==(e['ha']+2)%4,e['id']+': return door opposite facing')
 if e['kind']=='door':
  check(a['deck']==b['deck'],e['id']+': horizontal door stays on deck')
  dx,dy=[(0,-1),(1,0),(0,1),(-1,0)][e['ha']];p=e['point'];matches=[(x,y) for x,y in a['cells'] if [x+dx,y+dy] in b['cells'] and [x+.5+dx*.5,y+.5+dy*.5]==p]
  check(bool(matches),e['id']+': portal exactly on shared neighboring-cell wall')
 else:
  check(a['deck']!=b['deck'],e['id']+': explicit vertical changes deck')
  check(bool(e['label']),e['id']+': named vertical connector')
  for side in [a,b]:check(any(x<=e['point'][0]<=x+1 and y<=e['point'][1]<=y+1 for x,y in side['cells']),e['id']+': same shaft point in each deck footprint')
# Graph reachability with/without clue-gated ladder.
for unlocked,expected in [(False,18),(True,19)]:
 seen={'wash'};q=['wash']
 while q:
  a=q.pop()
  for e in t['edges']:
   if e.get('gate') and not unlocked:continue
   b=e['b'] if e['a']==a else e['a'] if e['b']==a else None
   if b and b not in seen:seen.add(b);q.append(b)
 check(len(seen)==expected,f'{expected} rooms reachable with watcher clue '+('unlocked' if unlocked else 'locked'))
(D/'topology-test-results.json').write_text(json.dumps({'passed':len(tests),'tests':tests},indent=2));print('Geometry/topology assertions passed:',len(tests))
