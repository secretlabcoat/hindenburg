
/* Connected-viewpoint movement prototype. Each scene is a fixed camera node. */
const nodes={cabin_bunk:{name:'Your Cabin',facing:'bunk and belongings',left:'cabin_desk',right:'cabin_window',forward:null,style:'cabin'},cabin_window:{name:'Your Cabin',facing:'small window',left:'cabin_bunk',right:'cabin_door',forward:null,style:'cabinwindow'},cabin_door:{name:'Your Cabin',facing:'door to corridor',left:'cabin_window',right:'cabin_desk',forward:'corridor_left',style:'cabindoor'},cabin_desk:{name:'Your Cabin',facing:'writing desk',left:'cabin_door',right:'cabin_bunk',forward:null,style:'cabindesk'},lounge_windows:{name:'Passenger Lounge',facing:'windows',left:'lounge_aft',right:'lounge_people',forward:'promenade',style:'windows'},lounge_people:{name:'Passenger Lounge',facing:'passengers',left:'lounge_windows',right:'lounge_side',forward:null,style:'people'},lounge_side:{name:'Passenger Lounge',facing:'seating area',left:'lounge_people',right:'lounge_aft',forward:null,style:'people'},lounge_aft:{name:'Passenger Lounge',facing:'aft doorway',left:'lounge_side',right:'lounge_windows',forward:'corridor_forward',style:'door'},promenade:{name:'Promenade',facing:'observation windows',left:'promenade_aft',right:'promenade_side',forward:'lounge_windows',style:'promenade'},promenade_side:{name:'Promenade',facing:'seating',left:'promenade',right:'promenade_far',forward:null,style:'promenade'},promenade_far:{name:'Promenade',facing:'forward windows',left:'promenade_side',right:'promenade_aft',forward:null,style:'promenade'},promenade_aft:{name:'Promenade',facing:'return passage',left:'promenade_far',right:'promenade',forward:'lounge_windows',style:'door'},corridor_forward:{name:'Passenger Corridor',facing:'forward',left:'corridor_left',right:'corridor_right',forward:'corridor_end',style:'corridor'},corridor_left:{name:'Passenger Corridor',facing:'port cabins',left:'corridor_end',right:'corridor_forward',forward:'cabin_door',style:'door'},corridor_right:{name:'Passenger Corridor',facing:'starboard cabins',left:'corridor_forward',right:'corridor_end',forward:null,style:'door'},corridor_end:{name:'Passenger Corridor',facing:'lounge entrance',left:'corridor_right',right:'corridor_left',forward:'lounge_aft',style:'corridor'}};
// Who stands where. Damina keeps her niece in sight, so they share the lounge.
const CAST_AT={lounge_people:['Damina Vontette','Snardy Vontette'],lounge_side:['Colonel Landry Stoppard','Vaunice Charles'],corridor_forward:['Manard Toxu'],promenade_side:['Potter McNare']}
const LOOK={'Damina Vontette':'woman','Snardy Vontette':'child','Colonel Landry Stoppard':'colonel','Vaunice Charles':'woman actress','Manard Toxu':'uniform','Potter McNare':'reporter'}
const SHORT={'Colonel Landry Stoppard':'Colonel Stoppard','Manard Toxu':'Chief Steward Toxu'}
function castHTML(v){const c=CAST_AT[v]||[];return c.map((n,i)=>'<div class="hot-person '+(LOOK[n]||'')+'" style="left:'+(c.length===1?18:i===0?22:62)+'%" data-person="'+n+'" role="button" tabindex="0" title="Speak to '+n+'"><span>'+(SHORT[n]||n)+'</span></div>').join('')}
let view='cabin_bunk',steps=0, busy=false;const scene=$('#scene');
function applySceneArt(paintEl, viewId){
  const n=nodes[viewId];
  if(!n || n.artStatus!=='ready') return; // Never display a wrong/copy placeholder photograph.
  const primary=artUrl(viewId);
  const fallback=null; // No cross-facing/style photograph reuse; CSS is the fallback.
  if(!primary) return;
  const title=document.querySelector('#titleoverlay');
  if(!title || !title.hidden) return;
  paintEl.classList.remove('has-art');
  const old=paintEl.querySelector('.scene-art');
  if(old) old.remove();
  const img=document.createElement('img');
  img.className='scene-art';
  img.alt='';
  img.decoding='async';
  const mark=()=>{if(img.isConnected&&img.naturalWidth>0)paintEl.classList.add('has-art')};
  img.onload=mark;
  img.onerror=()=>{
    if(fallback && img.dataset.tried!=='1'){img.dataset.tried='1';img.src=fallback;return}
    img.remove();paintEl.classList.remove('has-art');
  };
  img.src=primary;
  paintEl.insertBefore(img, paintEl.firstChild);
  // Data-URL photographs can already be complete before naturalWidth is ready, so the
  // load event never arrives. Decode again or the CSS fixtures stay painted over the photo.
  mark();
  queueMicrotask(mark);
  if(typeof img.decode==='function')img.decode().then(mark).catch(()=>{});
}
function scenery(v){let n=nodes[v],style=n.style,s='<div class="paint"><div class="ceiling"></div><div class="perspective-floor"></div>';
if(n.style==='cabin'||n.style==='cabinwindow'||n.style==='cabindoor'||n.style==='cabindesk'){s+='<div class="cabinwall"></div><div class="cabinlamp"></div>';if(n.style==='cabindesk')s+='<div class="cabindesk"></div>';if(n.style==='cabin')s+='<div class="cabinbed"></div><div class="cabintrunk" data-object="trunk" title="Inspect trunk"></div>';if(n.style==='cabinwindow')s+='<div class="cabinport"></div><div class="cabindesk" data-object="desk" title="Inspect desk"></div>';if(n.style==='cabindoor'||n.style==='cabindesk')s+='<div class="cabindoorobj" data-move="corridor_left" title="Open cabin door"></div>';}
if(n.style==='promenade'||n.style==='windows'){s+='<div class="viewwindow"><div class="cloud"></div></div><div class="rail"></div>';if(n.style==='windows')s+='<div class="furniture a"></div><div class="furniture b"></div>'}
if(n.style==='corridor'||n.style==='door'){s+='<div class="sidewall left"></div><div class="sidewall right"></div><div class="porthole l"></div><div class="porthole r"></div><div class="doorway" data-move="'+(n.forward||'')+'" title="Approach doorway"></div>'}
if(n.style==='people'){s+='<div class="painting"></div><div class="furniture a"></div><div class="furniture b"></div>';}s+=castHTML(v);
if(n.style==='corridor'&&steps>=3&&steps<10&&!window.collectedNote)s+='<div class="notehot" title="Pick up steward’s note"></div>';
s+='</div><div class="placard">'+n.name+'</div><div class="hint">'+n.facing+' · tap objects to interact</div>';return s}

// Map data - room positions on the map canvas (200x200)
const MAP_ROOMS={
  washroom_stall:{x:50,y:150,name:'Washroom Stall',exits:['washroom_door']},
  washroom_basins:{x:50,y:100,name:'Wash Basins',exits:['washroom_door']},
  washroom_door:{x:50,y:50,name:'Washroom Door',exits:['bdeck_washroom']},
  bdeck_washroom:{x:100,y:50,name:'B-Deck Corridor',exits:['office_desk','bdeck_stairs']},
  office_desk:{x:160,y:50,name:"Purser's Office",exits:['crew_door']},
  crew_door:{x:160,y:100,name:'Crew Door',exits:['keel_walk']},
  keel_walk:{x:160,y:150,name:'Keel Walkway',exits:['keel_hatch','keel_back']},
  keel_hatch:{x:160,y:180,name:'Keel Hatch',exits:[]},
  keel_back:{x:100,y:150,name:'Keel Back',exits:['crew_door']},
  bdeck_stairs:{x:100,y:100,name:'B-Deck Stairs',exits:['bar_counter']},
  bar_counter:{x:50,y:100,name:'Bar',exits:['crew_door']},
  corridor_forward:{x:100,y:20,name:'Corridor Forward',exits:['corridor_left','corridor_right','corridor_end']},
  corridor_left:{x:30,y:50,name:'Port Corridor',exits:['cabin_door']},
  corridor_right:{x:170,y:50,name:'Starboard Corridor',exits:['bdeck_stairs']},
  corridor_end:{x:100,y:80,name:'Corridor End',exits:['lounge_aft']},
  lounge_windows:{x:50,y:20,name:'Lounge Windows',exits:['lounge_aft','promenade']},
  lounge_people:{x:80,y:50,name:'Lounge Passengers',exits:['lounge_side']},
  lounge_side:{x:120,y:50,name:'Lounge Seating',exits:['lounge_aft']},
  lounge_aft:{x:80,y:80,name:'Lounge Aft',exits:['corridor_end','promenade_aft']},
  promenade:{x:50,y:20,name:'Promenade Windows',exits:['promenade_aft','lounge_windows']},
  promenade_side:{x:80,y:50,name:'Promenade Seating',exits:['promenade_aft']},
  promenade_far:{x:120,y:50,name:'Promenade Forward',exits:['promenade_aft']},
  promenade_aft:{x:80,y:80,name:'Promenade Aft',exits:['promenade','lounge_aft']},
  cabin_bunk:{x:30,y:120,name:'Empty Cabin',exits:['cabin_desk']},
  cabin_window:{x:30,y:80,name:'Cabin Window',exits:['cabin_door']},
  cabin_door:{x:30,y:40,name:'Cabin Door',exits:['corridor_left']},
  cabin_desk:{x:70,y:120,name:'Cabin Desk',exits:['cabin_bunk']},
  control_helm:{x:160,y:20,name:'Control Car',exits:['control_back']},
  control_back:{x:160,y:20,name:'Control Car Back',exits:['keel_walk']},
  keel_hatch:{x:160,y:180,name:'Keel Hatch',exits:[]},
  keel_back:{x:100,y:150,name:'Keel Back',exits:['crew_door']},
};

function updateMap(){
 const canvas=document.getElementById('mapCanvas');if(!canvas||!nodes[view])return;
 const name=nodes[view].name, ids=Object.keys(nodes).filter(id=>nodes[id].name===name);
 const exits=[...new Set(ids.flatMap(id=>{const dest=nodes[id].forward;return dest&&nodes[dest]&&nodes[dest].name!==name?[nodes[dest].name]:[]}))];
 canvas.replaceChildren();
 const current=document.createElement('div');current.className='map-current';
 const dot=document.createElement('span');dot.className='player-dot';dot.setAttribute('aria-label','Your location');
 current.append(dot,document.createTextNode(name));canvas.append(current);
 for(const exit of exits){const el=document.createElement('div');el.className='map-neighbor';el.textContent='│ ▢ '+exit;canvas.append(el)}
 const people=[...new Set(ids.flatMap(id=>CAST_AT[id]||[]))];
 const note=document.createElement('div');note.className='map-people';note.textContent=people.length?'● '+people.map(n=>SHORT[n]||n).join(', '):'No people here';canvas.append(note);
 canvas.setAttribute('aria-label','You are in '+name+'. Connected areas: '+exits.join(', '));
}

function draw(){
  updateMap();
  let n=nodes[view];scene.innerHTML=scenery(view);{const p=scene.querySelector('.paint');if(p)applySceneArt(p,view)}$('#viewlabel').textContent=n.name+' · '+n.facing;$('#navleft').disabled=!n.left;$('#navright').disabled=!n.right;$('#navforward').disabled=!n.forward;room=n.name;scene.querySelectorAll('[data-person]').forEach(el=>{el.onclick=()=>{AudioFX.uiClick();AudioFX.glassClink();choose(el.dataset.person);};el.onkeydown=e=>{if(e.key==='Enter'){AudioFX.uiClick();choose(el.dataset.person)}};});scene.querySelectorAll('[data-object]').forEach(el=>el.onclick=()=>{AudioFX.uiClick();AudioFX.woodCreak();if(el.dataset.object==='trunk')narrate('An empty steamer trunk. This cabin is made up for a passenger who is not using it.');else narrate('The writing desk holds a glass of water and an old timetable. Nothing you can take.');});scene.querySelectorAll('[data-move]').forEach(el=>el.onclick=()=>{AudioFX.doorLatch();travel(el.dataset.move);});let note=scene.querySelector('.notehot');if(note)note.onclick=()=>{window.collectedNote=true;addItem('Steward’s note','✉️');narrate('You take the steward’s note. It reads: “Officer requested at the forward control car before landing.”');draw()}}
function travel(dest){
  if(!dest||busy)return;busy=true;AudioFX.enginePulse();
  scene.classList.add('travel');
  setTimeout(()=>{
    view=dest;steps++;who='';$('#speaker').textContent='Select a passenger to speak with them.';draw();
    scene.classList.remove('travel');busy=false;
    const n=nodes[dest];
    if(n.style==='corridor'||n.style==='door'||n.style==='keel')AudioFX.footstepMetal();
    else if(n.style==='washshower'||n.style==='washbasin'||n.style==='washdoor')AudioFX.footstepTile();
    else AudioFX.footstepWood();
    if(steps===3)narrate('You hear footsteps in the corridor. Passengers are beginning to move about the ship.');
  },210);
}
$('#navleft').onclick=()=>travel(nodes[view].left);$('#navright').onclick=()=>travel(nodes[view].right);$('#navforward').onclick=()=>travel(nodes[view].forward);
document.addEventListener('keydown',e=>{
  if(['INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;
  if(e.key==='ArrowLeft'){AudioFX.uiClick();AudioFX.footstepMetal();travel(nodes[view].left);}
  if(e.key==='ArrowRight'){AudioFX.uiClick();AudioFX.footstepMetal();travel(nodes[view].right);}
  if(e.key==='ArrowUp'){AudioFX.uiClick();const n=nodes[view];if(n.style==='corridor'||n.style==='door'||n.style==='keel')AudioFX.footstepMetal();else if(n.style==='washshower'||n.style==='washbasin'||n.style==='washdoor')AudioFX.footstepTile();else AudioFX.footstepWood();travel(nodes[view].forward);}
});
$('#back').onclick=()=>travel('lounge_windows');$('#talk').onclick=()=>{const p=CAST_AT[view]&&CAST_AT[view].length>0;if(!p){AudioFX.warningBuzz();return narrate('There is no one here to talk to.');}AudioFX.uiClick();narrate('Face the passengers and tap a character to talk.');};$('#examine').onclick=()=>{AudioFX.uiClick();AudioFX.paperRustle();narrate('You examine the '+nodes[view].name.toLowerCase()+'. '+(nodes[view].style==='corridor'?'Narrow passages lead toward the passenger cabins.':'Every detail seems ordinary, which makes your knowledge of the approaching disaster harder to bear.'));};
$('#status').textContent='';draw();
