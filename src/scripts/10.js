
/* ---------- Round 9: every character has a secret or want that matters ----------
   A secret is earned when the AI says it was revealed, or when trust reaches the gate.
   Each one helps (a clue, a good word to someone, a lower bar) or can hurt (gossip). */
const COLONEL='Colonel Landry Stoppard',VAUNICE='Vaunice Charles',POTTER='Potter McNare',SNARDY='Snardy Vontette',DAMINA='Damina Vontette'
function vouch(from,to,amt,why){const t=ai[to];if(!t)return;t.trust=Math.min(100,t.trust+amt);t.heard.push('rumour: '+why);t.heard=t.heard.slice(-8)
 narrate((SHORT[from]||from.split(' ')[0])+' will put in a good word for you with '+(SHORT[to]||to)+'. (Their trust in you: +'+amt+')')}
function dent(to,amt,why){const t=ai[to];if(!t)return;t.trust=Math.max(t.met?0:12,t.trust-amt);t.heard.push('rumour: '+why);t.heard=t.heard.slice(-8)}
const SECRETS={
 [COLONEL]:{gate:60,clue:'The Colonel was a supply officer and never saw a battle. He dines with the Captain, and his word carries weight there.',fx:()=>vouch(COLONEL,CAPTAIN,20,'Colonel Stoppard calls the stranger a sound sort')},
 [VAUNICE]:{gate:60,clue:'Vaunice has not had a good review in two years. The Chief Steward adores her films.',fx:()=>vouch(VAUNICE,STEWARD,12,'Miss Charles says the stranger is charming company')},
 [POTTER]:{gate:55,clue:'Potter is about to be fired. He noticed cabin B-6 was booked for an “E. Ellery” who never boarded. The steward and the purser might accept that name.',fx:()=>{ai[POTTER].ellery=true}},
 [OREO]:{gate:60,clue:'Oreo’s gossip: the Purser once misplaced an official document and dreads it coming out. Kindness about it may win her over. Also: the First Officer sings beautifully but hides it.',fx:()=>{ai[OREO].tipped=true}},
 [BUNNY]:{gate:55,clue:'Bunny plans to slip off at Lakehurst himself, down the landing ropes from the keel hatch.',fx:()=>{}},
 [PURSER]:{gate:75,clue:'Helen Karens once misplaced an official document. She is on your side now and will not report you.',fx:()=>helenAlly()},
 [CAPTAIN]:{gate:70,clue:'Captain Kyle feels pushed to land on schedule, and his late wife always told him to wait out a storm. He needs less convincing now (60+).',fx:()=>{OFFICERS[CAPTAIN]=60}},
 [FIRST]:{gate:55,clue:'Emilio sings, and keeps his own weather notes. He will back a warning to the Captain if it fits his numbers.',fx:()=>vouch(FIRST,CAPTAIN,15,'the First Officer says the stranger talks sense')},
 [STEWARD]:{gate:60,clue:'The Chief Steward bends rules for tippers. He has quietly written you into his cabin list.',fx:()=>vouch(STEWARD,PURSER,15,'the stranger is on the Chief Steward’s cabin list')},
 [SNARDY]:{gate:50,clue:'Snardy showed you her notebook: everything you have told everyone. It is copied into your notebook below, so you can keep your stories straight.',fx:()=>{}},
 [DAMINA]:{gate:60,clue:'Damina worries she is out of her depth. She knows the Purser from her society column.',fx:()=>vouch(DAMINA,PURSER,15,'Mrs. Vontette vouches for the stranger')}}
function helenAlly(){const H=ai[PURSER];if(H.ally)return;H.ally=true;H.trust=Math.min(100,Math.max(H.trust,50)+10);narrate('Whatever Helen Karens says aloud, she has gone pale. A little later she slips you a folded note: she will not report you, so long as her secret stays safe.');vouch(PURSER,STEWARD,10,'the Purser has no complaint about the stranger')}
const _afterTurn9=afterTurn
afterTurn=function(n,s,data){const st=ai[n],live=data&&!data.fallback
 if(st&&live){const S=SECRETS[n]
  if(S&&!st.secretEarned&&(data.secret_revealed||st.trust>=S.gate)){st.secretEarned=true;st.clue=S.clue;narrate((SHORT[n]||n.split(' ')[0])+' confides something. It is in your notebook.');S.fx()}
  // Oreo's tip lets you reach Helen through kindness
  if(n===PURSER&&ai[OREO].tipped&&!ai[PURSER].ally&&/\b(document|paper|papers|misplac|mislaid|lost)\b/i.test(s)&&!/\b(report|expose|tell everyone|unless)\b/i.test(s)){st.secretEarned=true;st.clue=SECRETS[PURSER].clue;helenAlly()}
  // Potter's empty berth: a name the crew can't disprove
  if((n===STEWARD||n===PURSER)&&ai[POTTER].ellery&&!st.elleryUsed&&/\b(ellery|b-?6)\b/i.test(s)){st.elleryUsed=true;st.trust=Math.min(100,st.trust+12);narrate('The name matches a booked berth. That helps. (+12)')}
  // Potter repeats disaster talk to anyone, until he trusts you
  if(n===POTTER&&!st.secretEarned&&!st.spread&&WARN_RE.test(s)){st.spread=true;dent(STEWARD,6,'a passenger is telling everyone the ship is in danger');dent(PURSER,6,'a passenger is spreading alarming talk');narrate('Potter hurries off to repeat your warning to anyone who will listen. Talk like that reaches the crew. (Steward and Purser trust: -6)')}}
 // Snardy, treated badly, shows her notes to the grown-ups
 if(n===SNARDY&&st&&st.met&&st.trust<=15&&!st.told){st.told=true;dent(STEWARD,10,'the Vontette girl has notes on everything the stranger said');dent(DAMINA,10,'Snardy says the stranger tells different stories');narrate('Snardy marches off with her notebook to show her aunt and the Chief Steward what you have been saying. (Their trust: -10)')}
 _afterTurn9(n,s,data)}
const _checkEndings9=checkEndings
checkEndings=function(){OFFICERS[CAPTAIN]=ai[CAPTAIN].secretEarned?60:70
 const H=ai[PURSER];if(H.ally&&H.trust<=10)H.trust=11
 _checkEndings9()}
const _renderNB9=renderNotebook
renderNotebook=function(){_renderNB9();const g=$('#notebookBody .nb-goals');if(!g)return
 const box=document.createElement('div');box.className='nb-leads';const h=document.createElement('h4');h.textContent='Secrets and leads';box.append(h)
 const ul=document.createElement('ul');const got=Object.keys(SECRETS).filter(n=>ai[n]&&ai[n].secretEarned)
 got.forEach(n=>{const li=document.createElement('li');li.textContent=(SHORT[n]||n)+': '+ai[n].clue;ul.append(li)})
 if(!got.length){const li=document.createElement('li');li.textContent='Everyone aboard wants something or hides something. Earn their trust to find out. Careful: some people repeat what you tell them.';ul.append(li)}
 box.append(ul)
 if(ai[SNARDY].secretEarned){const h2=document.createElement('h4');h2.textContent='Snardy’s notes: what you told whom';box.append(h2);const u2=document.createElement('ul')
  Object.keys(ai).filter(n=>ai[n].claims.length).forEach(n=>{const li=document.createElement('li');li.textContent=(SHORT[n]||n)+': '+ai[n].claims.join(' / ');u2.append(li)});box.append(u2)}
 g.after(box)}
