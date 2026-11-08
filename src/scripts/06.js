
/* ---------- Round 2: B deck, keel walkway, Bunny and the escape ending ---------- */
Object.assign(nodes,{
 bdeck_stairs:{name:'B Deck',facing:'stairs up to the passenger deck',left:'office_desk',right:'bar_counter',forward:'corridor_right',style:'door'},
 bar_counter:{name:'Bar & Smoking Room',facing:'the bar',left:'bdeck_stairs',right:'crew_door',forward:null,style:'bar'},
 crew_door:{name:'B Deck',facing:'crew door · keel · no passengers',left:'bar_counter',right:'office_desk',forward:'keel_walk',style:'door'},
 office_desk:{name:'Purser’s Office',facing:'the purser’s desk',left:'crew_door',right:'bdeck_stairs',forward:null,style:'office'},
 keel_walk:{name:'Keel Walkway',facing:'catwalk toward the control car',left:'keel_hatch',right:'keel_back',forward:'control_helm',style:'keel'},
 keel_hatch:{name:'Keel Walkway',facing:'a hatch in the outer cover',left:'keel_back',right:'keel_walk',forward:null,style:'keelhatch'},
 keel_back:{name:'Keel Walkway',facing:'door back to B Deck',left:'keel_walk',right:'keel_hatch',forward:'crew_door',style:'keel'},
 control_helm:{name:'Control Car',facing:'the helm',left:'control_back',right:'control_back',forward:null,style:'control'},
 control_back:{name:'Control Car',facing:'ladder up to the keel',left:'control_helm',right:'control_helm',forward:'keel_walk',style:'door'}})
// The starboard corridor now has stairs down to B deck
nodes.corridor_right.forward='bdeck_stairs';nodes.corridor_right.facing='starboard cabins · stairs down'
const BUNNY='Bunny Treemont'
NPC_IDS[BUNNY]='deckhand'
ai[BUNNY]={met:false,metWhere:'',trust:30,claims:[],heard:[],history:[],mood:'',lastReply:'',suspects:[]}
CAST_AT.keel_walk=[BUNNY];LOOK[BUNNY]='deckhand';SHORT[BUNNY]='Bunny (deckhand)'
GREET[BUNNY]='Passengers don’t come down here. I’m Bunny, deckhand. Are you lost, or hiding?'
CANNED[BUNNY]=['Bunny looks over his shoulder.','Keep your voice down. Officers walk this catwalk.','I could get in real trouble for talking to you.']
ENDINGS.escape={kind:'ENDING · ESCAPE',title:'Down the Landing Rope',text:'The landing ropes drop toward the wet sand of Lakehurst. Bunny swings the hatch open and grips your wrist: “Now. Don’t look down, and don’t stop.” You slide, burn your palms, hit the ground and run for the hangar. You do not turn around until the sky behind you goes orange. You are alive. You will spend the rest of your life wondering who else you could have saved.'}

const XROOM={
 bar:()=>'<div class="bar-wall"></div><div class="bar-shelf"></div><div class="bar-counter"></div>',
 office:()=>'<div class="office-wall"></div><div class="office-cabinet"></div><div class="office-desk"></div><div class="office-ledger"></div>',
 keel:()=>'<div class="keel-cells"></div><div class="keel-girders"></div><div class="keel-lamp"></div><div class="keel-walk"></div>',
 keelhatch:()=>{const B=ai[BUNNY],open=B.route&&gamePhase()==='approach'
   return '<div class="keel-cells"></div><div class="keel-girders"></div><div class="keel-lamp"></div><div class="keel-walk"></div><div class="hatch'+(open?' open':'')+'" data-act="hatch" title="Hatch"></div>'+(B.route&&!open?'<div class="actbtn" data-act="wait">Wait here until the approach</div>':'')+(open?'<div class="actbtn" data-act="hatch">Go down the rope with Bunny</div>':'')},
 control:()=>'<div class="ctrl-windows"></div><div class="ctrl-panel"></div><div class="ctrl-wheel"></div>'}
const ACTS={
 hatch(){if(window.gameOver)return;const B=ai[BUNNY]
  if(!B.route){narrate('A round hatch in the outer cover, bolted shut. Someone who knows the ship could open it.');return}
  if(gamePhase()!=='approach'){narrate('Bunny’s hatch. Below it there is only the ocean. Wait for the approach to Lakehurst.');return}
  narrate('Bunny appears at your shoulder and unbolts the hatch.');endGame('escape')},
 wait(){if(window.gameOver)return;turns=Math.max(turns,16-Math.floor(steps/8))
  narrate('You sit with your back to a girder and wait. Hours pass in the drone of the engines.');updateClock();checkEndings();saveGame();draw()}}
const _scenery=scenery
scenery=function(v){const n=nodes[v],style=n.style;if(!XROOM[style])return _scenery(v)
 return '<div class="paint xroom">'+XROOM[style](v)+castHTML(v)+'</div><div class="placard">'+n.name+'</div><div class="hint">'+n.facing+' · tap objects to interact</div>'}
const _draw=draw
draw=function(){_draw();scene.querySelectorAll('[data-act]').forEach(el=>el.onclick=()=>{AudioFX.panelPress();ACTS[el.dataset.act]();});
 if(view==='keel_walk'&&!window.keelWarned){window.keelWarned=true;narrate('Crew only. Narrow catwalks, girders and the great silver gas cells. A passenger has no business here.')}}
// Bunny shows you the way once he trusts you (or lets his secret slip)
const _afterTurn=afterTurn
afterTurn=function(n,s,data){const st=ai[n]
 if(n===BUNNY&&st&&!st.route&&(st.trust>=55||(data&&data.secret_revealed))){st.route=true
  narrate('Bunny leans in close: “There’s a hatch on the keel, by the forward landing ropes. When we’re over the field and the ropes go down, I’ll open it for you. Not before.”')}
 _afterTurn(n,s,data)}
const _updateClock=updateClock
updateClock=function(){const before=lastPeriod;_updateClock()
 if(before!==lastPeriod&&gamePhase()==='approach'&&ai[BUNNY].route&&!window.gameOver&&view!=='keel_hatch')narrate('Somewhere on the keel, Bunny will be waiting by the hatch.')}
