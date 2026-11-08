
/* ---------- Round 2: the bar (Oreo Malloy) and the control car (Captain Kyle, First Officer Estavant) ---------- */
const OREO='Oreo Malloy',CAPTAIN='Captain Swanson Kyle',FIRST='Emilio Estavant'
Object.assign(NPC_IDS,{[OREO]:'bartender',[CAPTAIN]:'captain',[FIRST]:'first'})
const blank=t=>({met:false,metWhere:'',trust:t,claims:[],heard:[],history:[],mood:'',lastReply:'',suspects:[]})
ai[OREO]=blank(35);ai[CAPTAIN]=blank(20);ai[FIRST]=blank(30)
CAST_AT.bar_counter=[OREO];CAST_AT.control_helm=[CAPTAIN,FIRST]
Object.assign(LOOK,{[OREO]:'bartender',[CAPTAIN]:'captain',[FIRST]:'uniform'})
Object.assign(SHORT,{[OREO]:'Oreo (bar)',[CAPTAIN]:'Captain Kyle',[FIRST]:'First Officer'})
GREET[OREO]='Evening. Oreo Malloy. What will it be, and what is the story that comes with it?'
GREET[CAPTAIN]='This is the control car. Passengers are not permitted here. I am Captain Kyle. State your business.'
GREET[FIRST]='Emilio Estavant, First Officer. You have about one minute. Give me something I can check.'
CANNED[OREO]=['Oreo polishes a glass and says nothing.','Now why would you want to know that?','A story for a story. That is how this bar works.']
CANNED[CAPTAIN]=['The Captain does not look up from his schedule.','Captain Kyle, if you please.','I will not discuss the ship with a passenger.']
CANNED[FIRST]=['Emilio taps his logbook. “Later.”','Numbers, please. Not feelings.','I can check a figure. I cannot check a rumour.']
PAIRS.push([CAPTAIN,FIRST],[OREO,'Vaunice Charles'])
const HERO_STEWARD=ENDINGS.hero
const HERO_OFFICER={kind:'ENDING · HEROISM',title:'Checked Twice',text:'Emilio Estavant writes your warning in his logbook, then checks the ship against it, line by line. At his word, Captain Kyle holds the landing until the weather settles, and the stewards gather the passengers by the low promenade windows, coats on. When the moment comes, everyone is close to the ground and close to the exits. Nobody will ever know you were right. Everyone you spoke to walks away.'}
const HERO_CAPTAIN={kind:'ENDING · HEROISM',title:'The Captain’s Word',text:'Captain Kyle lets his monocle drop and is quiet for a long moment. Then he orders the landing held until the weather settles and the passengers gathered at the low windows, coats on. He does not thank you. He does not need to. When the moment comes, everyone you spoke to walks away.'}
const OFFICERS={[FIRST]:60,[CAPTAIN]:70}
const _afterTurn6=afterTurn
afterTurn=function(n,s,data){const st=ai[n]
 if(st&&OFFICERS[n]&&((data&&data.claim_type==='warning')||WARN_RE.test(s))){if(!st.warned)narrate('You have warned '+(n===FIRST?'the First Officer':'the Captain')+'. Now you have to be believed.');st.warned=true}
 _afterTurn6(n,s,data)}
const _checkEndings6=checkEndings
checkEndings=function(){if(window.gameOver)return
 for(const [n,g] of Object.entries(OFFICERS)){const o=ai[n];if(o.met&&o.warned&&o.trust>=g){ENDINGS.hero=n===FIRST?HERO_OFFICER:HERO_CAPTAIN;return endGame('hero')}}
 ENDINGS.hero=HERO_STEWARD;_checkEndings6()}
const _renderNB6=renderNotebook
renderNotebook=function(){_renderNB6();const g=$('#notebookBody .nb-goals');if(!g)return;const F=ai[FIRST],C=ai[CAPTAIN]
 const li=document.createElement('li');li.textContent='Or warn and convince an officer in the control car (First Officer 60+, Captain '+OFFICERS[CAPTAIN]+'+). Now: '+(F.met?F.trust:'?')+' / '+(C.met?C.trust:'?')
 if((F.warned&&F.trust>=60)||(C.warned&&C.trust>=70))li.className='done';g.children[4]?g.children[4].after(li):g.append(li)}
