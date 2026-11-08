
/* ---------- Cast greetings, time, goals, endings and browser save ---------- */
const GREET={
 'Manard Toxu':'Good evening. Manard Toxu, Chief Steward. I know every name on the passenger list, and I do not believe I know yours. Which cabin are you in?',
 'Colonel Landry Stoppard':'Ah! Fresh ears! Colonel Landry Stoppard, retired. Sit down, sit down. And who might you be, soldier?',
 'Vaunice Charles':'Darling. You know who I am, of course. Vaunice Charles? The stage? ...You do know who I am?',
 'Potter McNare':'Potter McNare, newspaperman. Everybody aboard is a story if you ask the right way. What is yours?'}
const CANNED={
 'Manard Toxu':['Manard smiles and checks his list.','One moment. I am consulting the passenger list.','Rules exist for everyone’s comfort, you understand.'],
 'Colonel Landry Stoppard':['The Colonel is mid-story and does not stop.','Reminds me of a campaign I once led. Where was I?','Hmph. Speak up, soldier.'],
 'Vaunice Charles':['Vaunice waves a gloved hand and sighs.','Darling, how terribly dramatic.','Tell me more. Slowly. With feeling.'],
 'Potter McNare':['Potter scribbles something and does not show you.','Can I quote you on that?','Interesting. My editor would want a second source.']}
const _offline=offline;offline=function(n,s){
  if(beliefs[n])return _offline(n,s);AudioFX.uiClick();
  const st=ai[n],q=s.toLowerCase();
  if(n==='Manard Toxu'){
    if(st.warned)return['You have warned me. I am considering it.','Rules exist for everyone\'s comfort.','I will speak to the officers when the time comes.'][turns%3];
    if(/warning|fire|danger|hydrogen|crash/i.test(s)){st.warned=true;return 'You have warned me. I will take it to the officers.'}
    return['Good evening. I am Manard Toxu, Chief Steward.','I know every name on the passenger list.','Rules exist for everyone\'s comfort.'][turns%3];
  }
  if(n==='Helen Karens'){
    if(st.ally)return['Your secret is safe with me.','I will not report you.','The manifest is... flexible.'][turns%3];
    return['Helen Karens, Purser. Name and ticket, please.','Every soul appears on my manifest.','Regulations exist for a reason.'][turns%3];
  }
  if(n==='Bunny Treemont'){
    if(st.route)return['The hatch will open when the ropes drop.','Wait for the approach.','Stay quiet until then.'][turns%3];
    return['Passengers don\'t come down here. Are you lost, or hiding?','Keep your voice down. Officers walk this catwalk.','I could get in real trouble for talking to you.'][turns%3];
  }
  if(n==='Emilio Estavant'||n==='Captain Swanson Kyle'){
    if(st.warned)return['Your warning is noted.','I will check the weather logs.','The Captain decides.'][turns%3];
    return['State your business.','I have a schedule to keep.','Passengers are not permitted here.'][turns%3];
  }
  if(n==='Oreo Malloy')return['Oreo polishes a glass.','A story for a story.','Now why would you want to know that?'][turns%3];
  const c=CANNED[n]||['They look at you, unsure what to say.'];return c[turns%c.length];
}

const TURN_LIMIT=22,STEWARD='Manard Toxu'
const WARN_RE=/\b(fire|burn|flame|explo|hydrogen|crash|disaster|danger|landing|lakehurst|evacuat|spark|leak)/i
const clockTime=()=>turns+Math.floor(steps/8)
const period=()=>{const t=clockTime();return t<8?'Early evening':t<16?'Evening':'Approaching Lakehurst'}
const gamePhase=()=>clockTime()>=16?'approach':'crossing'
let lastPeriod='Early evening'
function updateClock(){const p=period();$('#clock').textContent='May 6, 1937 · '+p
  if(p!==lastPeriod){lastPeriod=p
    narrate(p==='Evening'?'The light outside is going gold. The evening wears on, and Lakehurst is getting closer.':'Through the windows: the coast of New Jersey. The ship is beginning its approach to Lakehurst. Not much time left.')}}
// Good word travels: anyone who trusts you puts in a word with the others
function heardFor(n){const v=Object.keys(ai).filter(m=>m!==n&&ai[m].met&&ai[m].trust>=60).map(m=>'rumour: '+(SHORT[m]||m)+' seems to think well of the stranger')
  return [...ai[n].heard.slice(-(6-Math.min(v.length,3))),...v.slice(0,3)]}
function afterTurn(n,s,data){const st=ai[n];if(!st)return
  if(n===STEWARD&&((data&&data.claim_type==='warning')||WARN_RE.test(s))){if(!st.warned)narrate('You have told the Chief Steward about the danger. Now he has to believe you.');st.warned=true}
  if(n===STEWARD||n===PURSER){const CONF=/\b(stow ?away|stowed|sneak|snuck|sneaked|no ticket|without a ticket|no cabin|not a passenger|in a crate|i lied)\b/i,RUDE=/\b(idiot|idiotic|fool|stupid|pompous|clerk|shut up|get out of my way)\b/i;let pen=0;if(CONF.test(s))pen+=15;if(RUDE.test(s))pen+=8;if(pen){st.trust=Math.max(0,st.trust-pen);{const W=n===STEWARD?'The Chief Steward':'The Purser';narrate(CONF.test(s)?W+' writes something in '+(n===STEWARD?'his':'her')+' ledger, slowly.':W+'’s smile goes thin.')}}}
  if(data&&data.secret_revealed&&!st.secret){st.secret=data.reply;narrate(n.split(' ')[0]+' has told you something private. It is in your notebook.')}
  updateClock();checkEndings();saveGame()}

// ---------- Endings ----------
const ENDINGS={
 hero:{kind:'ENDING · HEROISM',title:'The Warning Carried Forward',text:'Manard Toxu straightens his jacket, tucks your warning into his list, and carries it to the control car himself. Nobody can prove you right. But as Lakehurst comes into view, the stewards quietly gather the passengers by the low promenade windows, coats on, ready. When the moment comes, they are close to the ground and close to the exits. Everyone you spoke to walks away.'},
 capture:{kind:'ENDING · CAPTURED',title:'No Such Passenger',text:'The Chief Steward closes his ledger. “There is no passenger by that name, or by any of the others you have used.” You spend the rest of the crossing locked in the mail room with a sack of postcards, rehearsing a warning nobody will hear.'},
 failure:{kind:'ENDING · OUT OF TIME',title:'Lakehurst',text:'Through the promenade windows the mooring mast grows larger, and the ground crew runs out beneath the ship. You knew exactly what was coming. You could not make the right person believe you in time.'}}
function checkEndings(){if(window.gameOver)return;const S=ai[STEWARD]
  if(S.met&&S.warned&&S.trust>=65)return endGame('hero')
  if(S.met&&S.trust<=10)return endGame('capture')
  if(clockTime()>=TURN_LIMIT)return endGame('failure')}
function endGame(k){window.gameOver=k;const e=ENDINGS[k]
  try{const v=typeof endingArtKey==='function'?endingArtKey(k):k,f=foundEndings();window.newEnding=!f.includes(v);if(window.newEnding){f.push(v);localStorage.setItem('hindenburg_endings_v2',JSON.stringify(f))}}catch{}
  saveGame()
  setTimeout(()=>{$('#endkind').textContent=e.kind;$('#endtitle').textContent=e.title;$('#endtext').textContent=e.text
    const met=Object.keys(ai).filter(n=>ai[n].met).length
    $('#endstats').textContent='People met: '+met+' · Contradictions caught: '+contradictions.length+' · Endings found: '+foundEndings().length+' of '+ENDING_TOTAL+(window.newEnding?' (new!)':'')
    $('#endoverlay').hidden=false},2500)}
// 7 endings: hero_steward, hero_officer, hero_captain, capture_steward, capture_purser, escape, failure.
// Saved across playthroughs under hindenburg_endings_v2. From the old 4-kind list only the unambiguous ones carry over.
const ENDING_TOTAL=7
const foundEndings=()=>{try{let f=JSON.parse(localStorage.getItem('hindenburg_endings_v2')||'null');if(!Array.isArray(f)){f=JSON.parse(localStorage.getItem('hindenburg_endings')||'[]').filter(k=>k==='escape'||k==='failure');localStorage.setItem('hindenburg_endings_v2',JSON.stringify(f))}return [...new Set(f)]}catch{return[]}}
$('#endrestart').onclick=()=>{localStorage.removeItem(SAVE_KEY);location.reload()}

// ---------- Goals in the notebook ----------
const _renderNB=renderNotebook;renderNotebook=function(){_renderNB();const S=ai[STEWARD],met=Object.keys(ai).filter(n=>ai[n].met).length
  const goals=[[met+' of '+Object.keys(ai).length+' people aboard met',met>=3],['Earn someone’s trust (60+)',Object.values(ai).some(x=>x.trust>=60)],['Find the Chief Steward (A-deck passenger corridor, up the stairs from B deck)',S.met],['Warn him about the landing',!!S.warned],['Win his trust (65+). Now: '+(S.met?S.trust:'?'),S.met&&S.trust>=65],['Or save yourself: someone on the crew may know a way off (Bunny trust '+(ai[BUNNY].met?ai[BUNNY].trust:'?')+'/55)',!!ai[BUNNY].route]]
  const d=document.createElement('div');d.className='nb-entry';const h=document.createElement('h3');h.textContent='Your goal: be believed before Lakehurst';d.append(h)
  const m=document.createElement('div');m.className='nb-meta';m.textContent='Time: '+period()+' · about '+Math.max(0,TURN_LIMIT-clockTime())+' conversations left · endings found: '+foundEndings().length+'/'+ENDING_TOTAL;d.append(m)
  const ul=document.createElement('ul');ul.className='nb-goals';goals.forEach(([t,ok])=>{const li=document.createElement('li');li.textContent=t;if(ok)li.className='done';ul.append(li)});d.append(ul)
  const body=$('#notebookBody');body.prepend(d)
  Object.keys(ai).forEach(n=>{if(!ai[n].secret)return;[...body.querySelectorAll('h3')].filter(x=>x.textContent===n).forEach(x=>{const c=document.createElement('div');c.className='nb-meta';c.textContent='They confided: “'+ai[n].secret+'”';x.parentNode.append(c)})})}

// ---------- Save progress in this browser ----------
const SAVE_KEY='hindenburg_playable_20261107_v1';let logEntries=[],restoring=false // gitleaks:allow -- public localStorage namespace, not a credential
const _line=line;line=function(name,msg,cls){_line(name,msg,cls);if(!restoring){logEntries.push([name,msg,cls||'npc']);if(logEntries.length>40)logEntries.shift()}}
function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({v:1,ai,contradictions,gossipKeys,view,steps,turns,items:gameItems,note:!!window.collectedNote,log:logEntries,over:window.gameOver||false,lastPeriod}))}catch{}}
function loadSave(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');return d&&d.v===1?d:null}catch{return null}}
function restore(d){for(const n of Object.keys(ai))if(d.ai[n])Object.assign(ai[n],d.ai[n])
  contradictions.length=0;contradictions.push(...d.contradictions);gossipKeys=d.gossipKeys||{};view=nodes[d.view]?d.view:'washroom_stall';steps=d.steps|0;turns=d.turns|0
  gameItems.length=0;gameItems.push(...d.items);renderInventory();window.collectedNote=d.note;lastPeriod=(d.lastPeriod==='Afternoon'?'Early evening':d.lastPeriod)||period()
  log.innerHTML='';restoring=true;d.log.forEach(([a,b,c])=>_line(a,b,c));restoring=false;logEntries=d.log.slice()
  narrate('You pick up where you left off.');updateClock();draw()}
const _addItem=addItem;addItem=function(...a){_addItem(...a);saveGame()}
const _travel2=travel;travel=function(d){_travel2(d);setTimeout(()=>{updateClock();checkEndings();saveGame()},300)}
const _start=$('#startgame').onclick
const saved=loadSave()
if(saved&&!saved.over){$('#startgame').textContent='Continue Voyage';const nb2=document.createElement('button');nb2.id='newgame';nb2.className='secondary';nb2.textContent='New Voyage';$('#startgame').after(nb2)
  nb2.onclick=()=>{localStorage.removeItem(SAVE_KEY);newGame()}
  $('#startgame').onclick=()=>{$('#titleoverlay').style.display='none'; $('#titleoverlay').hidden=true;beginAudio();restore(saved)}}
else{if(saved)localStorage.removeItem(SAVE_KEY);$('#startgame').onclick=()=>newGame()}
function newGame(){
  logEntries=[];_start();
  narrate('Your goal: get someone with authority to believe you before the ship reaches Lakehurst. The Chief Steward works the passenger corridor on A deck, up the stairs from B deck. Your notebook keeps track of everything.');
  // Opening navigation hint is emitted once by _start().
  updateClock();saveGame();
  setTimeout(()=>{$('#navleft').classList.add('pulse');},500);
  setTimeout(()=>{$('#navright').classList.add('pulse');},1500);
  setTimeout(()=>{$('#navforward').classList.add('pulse');},2500);
  setTimeout(()=>{$('#navleft').classList.remove('pulse');$('#navright').classList.remove('pulse');$('#navforward').classList.remove('pulse');},5000);
}
