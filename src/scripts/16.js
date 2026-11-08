
/* NEW LOCAL REPLACEMENT for missing map-hud sidecars. Schematic, not to scale. */
(()=>{
 const SVG='http://www.w3.org/2000/svg';
 const layout={"washroom_stall": [90, 240, "B deck"], "cabin_bunk": [190, 240, "B deck"], "lounge_windows": [90, 90, "A deck"], "promenade": [190, 90, "A deck"], "corridor_forward": [290, 90, "A deck"], "bar_counter": [290, 240, "B deck"], "office_desk": [390, 240, "B deck"], "bdeck_corr_washdoor": [490, 240, "B deck"], "bdeck_stairs_door": [390, 90, "A/B stairs"], "bdeck_cabins_door": [590, 240, "B deck"], "crew_door_in": [690, 240, "B deck"], "adeck_cabin": [490, 90, "A deck"], "keel_walk": [590, 390, "Keel / hull"], "control_helm": [690, 390, "Control car"], "girder_nook": [590, 90, "Upper rings"], "tour_shoes": [90, 390, "Keel tour"], "tour_cells": [190, 390, "Keel tour"], "tour_tanks": [290, 390, "Keel tour"], "tour_end": [390, 390, "Keel tour"]};
 const panel=document.createElement('aside');panel.id='offline-map';panel.setAttribute('aria-label','Ship cutaway schematic map');
 const toggle=document.createElement('button');toggle.type='button';toggle.textContent='Map';toggle.setAttribute('aria-expanded','false');document.querySelector('.top').append(toggle);toggle.id='map-toggle';toggle.setAttribute('aria-controls','offline-map');panel.hidden=true;
 const status=document.createElement('div');status.className='map-status';status.setAttribute('aria-live','polite');panel.append(status);
 const svg=document.createElementNS(SVG,'svg');svg.setAttribute('viewBox','0 0 780 450');svg.setAttribute('role','img');svg.setAttribute('aria-label','Room groups by deck and hull level; only existing forward connections shown');panel.append(svg);
 const help=document.createElement('div');help.className='map-help';help.textContent='Schematic · not to scale · turn ← →, walk ↑';panel.append(help);
 const detail=document.createElement('div');detail.className='map-detail map-help';panel.append(detail);
 document.querySelector('.shell').append(panel);
 toggle.onclick=()=>{const e=panel.hidden;panel.hidden=!e;panel.classList.toggle('expanded',e);toggle.setAttribute('aria-expanded',String(e));toggle.textContent=e?'Close map':'Map';render()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('expanded'))toggle.click()});
 function el(t,a={},text){const n=document.createElementNS(SVG,t);for(const[k,v]of Object.entries(a))n.setAttribute(k,String(v));if(text)n.textContent=text;return n}
 function render(){
  if(typeof nodes==='undefined'||!nodes[view])return;
  const groups=new Map(),positions=new Map();
  for(const[id,n]of Object.entries(ROTATION_NODES)){if(!groups.has(n.name))groups.set(n.name,[]);groups.get(n.name).push(id)}
  for(const[rep,pos]of Object.entries(layout)){const n=nodes[rep];if(n)positions.set(n.name,{x:pos[0],y:pos[1],floor:pos[2]})}
  svg.replaceChildren();
  svg.append(el('path',{d:'M20 35 Q390 -15 760 35 L750 430 Q390 455 30 430 Z',fill:'#332c1c66',stroke:'#aa8c50','stroke-width':3}));
  for(const[y,text]of [[32,'A deck / upper rings'],[185,'B deck'],[335,'Keel tour / hull / control car']]){svg.append(el('line',{x1:35,y1:y+12,x2:745,y2:y+12,stroke:'#8a754955'}));svg.append(el('text',{x:42,y},text));svg.lastChild.setAttribute('class','map-floor-label')}
  const edges=new Set();
  for(const[id,n]of Object.entries(ROTATION_NODES)){const actual=nodes[id],to=actual&&nodes[actual.forward];if(!to||to.name===n.name)continue;const a=positions.get(n.name),b=positions.get(to.name);if(!a||!b)continue;const key=[n.name,to.name].sort().join('|');if(edges.has(key))continue;edges.add(key);svg.append(el('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'map-edge'}))}
  for(const[name,p]of positions){const active=name===nodes[view].name;const group=el('g');group.append(el('rect',{x:p.x-40,y:p.y-23,width:80,height:46,rx:5,class:active?'map-node active-room':'map-node'}));const label=name.replace('Passenger ','').replace('B-Deck ','').replace('Keel Tour · ','Tour: ').replace('B Deck · ','').replace(' (B deck)','');group.append(el('text',{x:p.x,y:p.y+38,'text-anchor':'middle',class:'map-room-label'},label));group.append(el('title',{},name+' · '+p.floor));svg.append(group)}
  const p=positions.get(nodes[view].name),ids=groups.get(nodes[view].name)||[view],f=Math.max(0,ids.indexOf(view));
  if(p){svg.append(el('circle',{cx:p.x,cy:p.y,r:8,class:'player'}));svg.append(el('path',{d:`M ${p.x} ${p.y-23} l -5 10 h 10 Z`,fill:'#ffe4a4',transform:`rotate(${f*90} ${p.x} ${p.y})`}))}
  status.textContent=nodes[view].name+' · '+nodes[view].facing+' · facing '+(f+1)+'/4';
  const exits=[...new Set(ids.flatMap(id=>{const n=nodes[id],dest=n&&nodes[n.forward];return dest&&dest.name!==nodes[view].name?[dest.name]:[]}))];detail.textContent='Existing outward routes: '+(exits.join(' • ')||'none from these walls')+'. Map is informational, not fast travel. Heading triangle is relative to this room’s four-view ring, not geographic north.';
 }
 const old=draw;draw=function(){const result=old.apply(this,arguments);render();return result};render();
})();
