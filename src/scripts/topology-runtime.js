/* V3: ONE geometry/topology model drives navigation, room doors and floor-plan HUD.
   Fictional game arrangement inspired by historical cutaway; not measured plans. */
(()=>{
 const T=TOPOLOGY_DATA, dirs=['North / bow','East / starboard','South / stern','West / port'];
 const byView={};for(const[id,r]of Object.entries(T.rooms))r.views.forEach((v,h)=>byView[v]={room:id,heading:h});
 const originalNodes=JSON.parse(JSON.stringify(nodes));
 const keptArt=new Set(['washroom_stall','washroom_basins','washroom_door','cabin_bunk','cabin_window','cabin_desk','control_helm']);
 const roomOf=v=>byView[v]?.room,headingOf=v=>byView[v]?.heading;
 function gate(edge){if(edge.gate==='watcher-noticed'&&!ai['The Watcher in the Rings']?.noticed)return 'The gas-cell ladder is concealed. Examine the glimmer in the gas-cell gallery first.';return ''}
 function exits(id,h){return T.edges.flatMap(e=>e.a===id&&e.ha===h?[{edge:e,to:e.b}]:e.b===id&&e.hb===h?[{edge:e,to:e.a}]:[])}
 function target(x,h){return T.rooms[x.to].views[h]}
 function configure(){
  for(const[id,r]of Object.entries(T.rooms))r.views.forEach((v,h)=>{const n=nodes[v],ee=exits(id,h);n.name=r.name;n.left=r.views[(h+3)%4];n.right=r.views[(h+1)%4];n.forward=ee.length?target(ee[0],h):null;n.facing=dirs[h]+' · '+(ee.length?ee.map(x=>x.edge.label+' to '+T.rooms[x.to].name).join(' / '):'wall / no doorway');n.artStatus=keptArt.has(v)&&originalNodes[v].artStatus==='ready'?'ready':'placeholder';n.framing=((id==='acorr'&&h%2===0)||(['bcorr','bcab'].includes(id)&&h%2===1)||(['keel','shoes','cells','tanks','tourend'].includes(id)&&h%2===0))?'hall-axis':'room-wall';});
 }
 document.querySelector('#offline-map')?.remove();document.querySelector('#map-toggle')?.remove();
 const toggle=document.createElement('button');toggle.id='topology-map-toggle';toggle.textContent='Floor plan';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','topology-map');document.querySelector('.top').append(toggle);
 // Keep sound in the wrapping toolbar: the legacy fixed phone button covered Floor plan.
 const sound=document.querySelector('#soundbtn');if(sound)document.querySelector('.top').append(sound);
 const drawer=document.createElement('aside');drawer.id='topology-map';drawer.hidden=true;drawer.setAttribute('aria-label','Ship floor plan');
 const select=document.createElement('select');select.id='topology-deck';select.setAttribute('aria-label','Select ship level');
 for(const[k,label]of Object.entries(T.decks)){const o=document.createElement('option');o.value=k;o.textContent=label;select.append(o)}
 const caption=document.createElement('div');caption.className='topology-caption';
 const scroll=document.createElement('div');scroll.className='topology-plan-scroll';
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('role','img');scroll.append(svg);
 const legend=document.createElement('div');legend.className='topology-legend';legend.textContent='N ↑ bow · cyan: door · violet: stairs/ladder · gold: you. Scroll plan; no fast travel.';legend.title='Fictional coherent plan, not historically measured. Gold dot marks the room, not exact footsteps.';
 drawer.append(select,caption,scroll,legend);document.querySelector('.shell').append(drawer);
 toggle.onclick=()=>{drawer.hidden=!drawer.hidden;toggle.setAttribute('aria-expanded',String(!drawer.hidden));toggle.textContent=drawer.hidden?'Floor plan':'Close floor plan';mapFocusKey=null;renderMap()};select.onchange=()=>{mapFocusKey=null;renderMap()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)toggle.click()});
 let lastDeck=null,mapFocusKey=null;
 // Center ONLY the internal scroll pane using rendered viewport geometry, never
 // raw SVG viewBox units or scrollIntoView (which scrolls the outer game/page).
 function centerMap(){
  if(drawer.hidden||select.value!==T.rooms[roomOf(view)]?.deck)return;
  const dot=svg.querySelector('[data-player-dot]');if(!dot)return;
  const d=dot.getBoundingClientRect(),r=scroll.getBoundingClientRect();
  if(!d.width||!scroll.clientWidth||!scroll.clientHeight)return;
  scroll.scrollLeft=Math.max(0,scroll.scrollLeft+d.left+d.width/2-r.left-scroll.clientLeft-scroll.clientWidth/2);
  scroll.scrollTop=Math.max(0,scroll.scrollTop+d.top+d.height/2-r.top-scroll.clientTop-scroll.clientHeight/2);
 }
 const queueCenter=()=>{centerMap();requestAnimationFrame(()=>requestAnimationFrame(centerMap))};
 window.addEventListener('resize',queueCenter);
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(queueCenter);observer.observe(scroll)}

 const S='http://www.w3.org/2000/svg';function se(tag,attr={},text){const n=document.createElementNS(S,tag);for(const[k,v]of Object.entries(attr))n.setAttribute(k,String(v));if(text)n.textContent=text;return n}
 const names={wash:['Washroom'],b6:['Cabin B-6'],lounge:['Lounge / reading','East promenade'],dining:['Dining','West promenade'],acorr:['A corridor'],bar:['Bar'],purser:['Purser'],bcorr:['B main corridor'],stairs:['Stairs'],bcab:['Cabin corridor'],crew:['Crew access'],acab:['A cabin'],keel:['Keel walkway'],control:['Control car'],nook:['Upper rings','Watcher'],shoes:['Keel entry','Overshoes'],cells:['Gas cells'],tanks:['Fuel / ballast'],tourend:['Tour landing']};
 function renderMap(){
  if(!byView[view])return;const cur=T.rooms[roomOf(view)],active=cur.deck;
  if(lastDeck!==active){select.value=active;lastDeck=active}
  for(const o of select.options)o.textContent=T.decks[o.value]+(o.value===active?' · YOU ARE HERE':'');
  const deck=select.value,rs=Object.entries(T.rooms).filter(([,r])=>r.deck===deck);const cells=rs.flatMap(([,r])=>r.cells);
  const minX=Math.min(...cells.map(c=>c[0])),minY=Math.min(...cells.map(c=>c[1]));const maxX=Math.max(...cells.map(c=>c[0]))+1,maxY=Math.max(...cells.map(c=>c[1]))+1;
  const size=72,pad=23;const pt=(x,y)=>[(x-minX)*size+pad,(y-minY)*size+pad];
  svg.replaceChildren();svg.setAttribute('viewBox',`0 0 ${(maxX-minX)*size+2*pad} ${(maxY-minY)*size+2*pad}`);svg.style.width=((maxX-minX)*size+2*pad)+'px';svg.style.height=((maxY-minY)*size+2*pad)+'px';svg.setAttribute('aria-label',T.decks[deck]+' floor plan; '+(deck===active?'player in '+cur.name:'player is on '+T.decks[active]));
  for(let x=minX;x<maxX;x++){const[p]=pt(x+.5,minY);svg.append(se('text',{x:p,y:14,'text-anchor':'middle',fill:'#a79060','font-size':9},'x'+x));}for(let y=minY;y<maxY;y++){const[,q]=pt(minX,y+.5);svg.append(se('text',{x:2,y:q,fill:'#a79060','font-size':9},'y'+y));}
  for(const[id,r]of rs){const group=se('g');group.setAttribute('data-room',id);const own=new Set(r.cells.map(c=>c.join(',')));
   for(const[x,y]of r.cells){const[p,q]=pt(x,y);group.append(se('rect',{x:p,y:q,width:size,height:size,fill:id===roomOf(view)?'#725f30':'#30291e'}));for(const[dx,dy,ax,ay,bx,by]of [[0,-1,0,0,1,0],[1,0,1,0,1,1],[0,1,0,1,1,1],[-1,0,0,0,0,1]])if(!own.has([x+dx,y+dy].join(',')))group.append(se('line',{x1:p+ax*size,y1:q+ay*size,x2:p+bx*size,y2:q+by*size,stroke:'#d1b77b','stroke-width':2}));}
   const[p,q]=pt(r.anchor[0]+.5,r.anchor[1]+.5);for(const[line,j]of (names[id]||[r.name]).map((v,i)=>[v,i]))group.append(se('text',{x:p,y:q-10+j*13,'text-anchor':'middle',fill:'#f4e0b5','font-size':11,'font-family':'Georgia'},line));group.append(se('title',{},r.name));svg.append(group);
  }
  for(const e of T.edges){const a=T.rooms[e.a],b=T.rooms[e.b];if(a.deck!==deck&&b.deck!==deck)continue;const[p,q]=pt(...e.point);
   if(e.kind==='door'){const vertical=e.ha%2===1;svg.append(se('line',{x1:p-(vertical?0:10),y1:q-(vertical?10:0),x2:p+(vertical?0:10),y2:q+(vertical?10:0),stroke:'#7ddce0','stroke-width':5,'data-door':e.id}));}
   else{const g=se('g',{'data-connector':e.id});g.append(se('rect',{x:p-8,y:q-8,width:16,height:16,fill:gate(e)?'#796b82':'#b19be0',stroke:'#e4d6fa'}));g.append(se('text',{x:p+11,y:q+4,fill:'#e0d2ff','font-size':10},a.deck===deck?'↕ '+b.deck:'↕ '+a.deck));g.append(se('title',{},e.label+(gate(e)?' · '+gate(e):'')));svg.append(g)}
  }
  if(deck===active){const[p,q]=pt(cur.anchor[0]+.5,cur.anchor[1]+.5);svg.append(se('circle',{'data-player-dot':'true',cx:p,cy:q+17,r:6,fill:'#ffe1a0',stroke:'#080706','stroke-width':1}));svg.append(se('path',{d:`M${p} ${q+2} l-5 9 h10Z`,fill:'#ffe1a0',transform:`rotate(${headingOf(view)*90} ${p} ${q+17})`}));}
  caption.textContent='You: '+cur.name+' · '+dirs[headingOf(view)];
  caption.title='Viewing '+T.decks[deck]+'. Dot indicates the current room, not exact walking coordinates.';
  if(!drawer.hidden&&deck===active&&mapFocusKey!==deck+'|'+roomOf(view)){queueCenter();mapFocusKey=deck+'|'+roomOf(view);}

 }
 const movement=document.createElement('div');movement.id='topology-movement';movement.setAttribute('aria-live','polite');document.querySelector('.navdock').after(movement);
 function canAct(){return !window.gameOver&&!busy}
 function finish(oldRoom){
  if(roomOf(view)==='keel'&&oldRoom==='tourend'&&ai[BUNNY]&&!ai[BUNNY].toured){ai[BUNNY].toured=true;ai[BUNNY].trust=Math.min(100,ai[BUNNY].trust+10);window.keelWarned=true;narrate('You walk through the adjacent tour landing into the keel service walkway. Bunny notices you hanging back.');}
  if(roomOf(view)==='keel'&&!window.keelWarned){window.keelWarned=true;narrate('Crew service walkway. The control car is down the enclosed service ladder; the escape hatch is on the south side.');}
  updateClock();checkEndings();saveGame();
 }
 function move(edgeId){
  if(!canAct())return false;const id=roomOf(view),h=headingOf(view),x=exits(id,h).find(x=>x.edge.id===edgeId);if(!x){narrate('That doorway is not on the wall you are facing. Turn to it first.');return false}
  const why=gate(x.edge);if(why){narrate(why);return false}
  const old=id;view=target(x,h);steps++;who='';window.nookReturn=undefined;AudioFX.doorLatch();narrate((x.edge.kind==='vertical'?'You use '+x.edge.label+' and enter ':'You step through the adjoining door into ')+T.rooms[x.to].name+', still facing '+dirs[h]+'.');draw();finish(old);return true;
 }
 function turn(delta){if(!canAct())return false;const id=roomOf(view),h=headingOf(view);view=T.rooms[id].views[(h+delta+4)%4];steps++;who='';AudioFX.uiClick();narrate('You turn '+(delta===2?'around':delta<0?'left':'right')+' in '+T.rooms[id].name+', facing '+dirs[headingOf(view)]+'.');draw();finish(id);return true}
 travel=function(dest){const id=ROTATION_ALIASES[dest]||dest;if(!id)return false;if(id===nodes[view].left)return turn(-1);if(id===nodes[view].right)return turn(1);const candidate=exits(roomOf(view),headingOf(view)).find(x=>target(x,headingOf(view))===id);if(candidate)return move(candidate.edge.id);narrate('No adjacent doorway leads there from this wall. Use the floor plan and turn to a labelled door.');return false;};
 const oldDraw=draw;draw=function(){configure();window.nookReturn=undefined;oldDraw();configure();
  scene.querySelectorAll('[data-move],.facing-exit,.hoverlink,[data-act="tour"],[data-act="tourend"],[data-act="climb"]').forEach(el=>el.remove());
  const id=roomOf(view),h=headingOf(view),ee=exits(id,h);movement.replaceChildren();
  const info=document.createElement('span');info.className='movement-reason';info.textContent=dirs[h]+' — '+(ee.length?'Adjacent '+(ee.length>1?'doorways:':'exit:'):'No doorway on this wall. Turn left or right.');movement.append(info);
  for(const x of ee){const b=document.createElement('button');b.type='button';b.dataset.topologyEdge=x.edge.id;const why=gate(x.edge);b.textContent=(x.edge.kind==='vertical'?x.edge.label+' → ':'Door → ')+T.rooms[x.to].name;b.title=why||'Move through this adjacent '+(x.edge.kind==='vertical'?'connector':'door');b.disabled=!!why;b.setAttribute('aria-label',b.textContent+(why?' — '+why:''));b.onclick=()=>move(x.edge.id);movement.append(b);if(why){const reason=document.createElement('span');reason.textContent=why;reason.className='movement-reason';movement.append(reason)}}
  if(id==='crew'&&h===1&&clockTime()>=8&&clockTime()<16&&!ai[BUNNY].toured){const b=document.createElement('button');b.textContent='Join guided tour via this crew ladder';b.onclick=()=>ACTS.tour();movement.append(b)}
  if(id==='keel'&&h===2){const p=document.createElement('span');p.className='movement-reason';p.textContent='External escape hatch (not a room): Bunny must arrange it; only usable during approach.';movement.append(p)}
  const strip=document.createElement('div');strip.className='topology-door-strip';strip.setAttribute('aria-label','Doorways visible on this wall');for(const x of ee){const b=document.createElement('button');b.type='button';b.textContent=(x.edge.kind==='vertical'?'↕ ':'Door: ')+T.rooms[x.to].name;b.dataset.topologyEdge=x.edge.id;b.disabled=!!gate(x.edge);b.title=gate(x.edge)||x.edge.label;b.onclick=()=>move(x.edge.id);strip.append(b)}scene.append(strip);
  document.querySelector('#navleft').onclick=()=>turn(-1);document.querySelector('#navright').onclick=()=>turn(1);
  const f=document.querySelector('#navforward'),first=ee.find(x=>!gate(x.edge));f.disabled=!first;f.onclick=()=>first?move(first.edge.id):narrate(ee.length?gate(ee[0].edge):'Wall, not a doorway. Turn to an exit.');f.title=first?'Enter '+T.rooms[first.to].name:ee.length?gate(ee[0].edge):'No door on this wall';f.setAttribute('aria-label',first?'Move forward to '+T.rooms[first.to].name:'Forward unavailable: '+f.title);
  document.querySelector('#back').textContent='Turn around';document.querySelector('#back').setAttribute('aria-label','Turn around in the current room');document.querySelector('#back').onclick=()=>turn(2);
  document.querySelector('#viewlabel').textContent=T.rooms[id].name+' · '+dirs[h];renderMap();
 };
 // All legacy navigation actions use the SAME adjacent connector; no view= teleports.
 ACTS.tour=function(){if(roomOf(view)!=='crew'){narrate('The guided tour gathers at the B-deck crew access. Walk there first.');return}if(clockTime()<8||clockTime()>=16||ai[BUNNY].toured){narrate('No guided tour now. The ordinary crew service ladder remains where the floor plan shows it.');return}view=T.rooms.crew.views[1];draw();narrate('The guide leads you up the crew ladder to the adjoining keel entry.');move('crew-shoes')};
 ACTS.tourend=function(){if(roomOf(view)!=='tourend'){narrate('Walk to the forward tour landing first.');return}view=T.rooms.tourend.views[T.edges.find(e=>e.id==='tourend-keel').ha];draw();move('tourend-keel')};
 ACTS.climb=function(){if(roomOf(view)!=='cells'){narrate('The upper-rings ladder is above the gas-cell tour gallery, not here.');return}view=T.rooms.cells.views[T.edges.find(e=>e.id==='cells-nook').ha];draw();move('cells-nook')};
 document.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp'].includes(e.key)||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)||!document.querySelector('#titleoverlay').hidden||document.querySelector('.inventory-modal.open'))return;e.preventDefault();e.stopImmediatePropagation();if(e.key==='ArrowLeft')turn(-1);else if(e.key==='ArrowRight')turn(1);else{const x=exits(roomOf(view),headingOf(view)).find(x=>!gate(x.edge));if(x)move(x.edge.id);else narrate('No available exit on the '+dirs[headingOf(view)]+' wall.');}},true);
 const oldRestore=restore;restore=function(d){const previous=roomOf(d.view);oldRestore(d);if(d.topologyVersion!==3)narrate('V3 layout migration: your saved room, inventory and story are retained. Each view now has a fixed world-compass heading; use the floor plan to reorient. No room was reset.');draw();saveGame();return previous};
 const oldSave=saveGame;saveGame=function(){oldSave();try{const d=JSON.parse(localStorage.getItem(SAVE_KEY));if(d){d.topologyVersion=3;localStorage.setItem(SAVE_KEY,JSON.stringify(d))}}catch{}};
 window.HindenburgTopology={data:T,roomOf,headingOf,exits,gate,move,turn,configure,renderMap,centerMap};
 configure();draw();
})();
