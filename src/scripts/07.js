
/* ---------- Round 2: Helen Karens, the Purser, a second person who can catch you ---------- */
const PURSER='Helen Karens'
NPC_IDS[PURSER]='purser'
ai[PURSER]={met:false,metWhere:'',trust:25,claims:[],heard:[],history:[],mood:'',lastReply:'',suspects:[],contraSeen:0}
CAST_AT.office_desk=[PURSER];LOOK[PURSER]='purser';SHORT[PURSER]='Purser Karens'
GREET[PURSER]='Helen Karens, Purser. Every soul aboard appears on my manifest, by regulation. Your name and ticket number, please.'
CANNED[PURSER]=['Helen opens her ledger and frowns.','Regulations exist for a reason.','Name. Ticket. Cabin. In that order, please.']
PAIRS.push(['Manard Toxu',PURSER])
const CAPTURE_STEWARD=ENDINGS.capture
const CAPTURE_PURSER={kind:'ENDING · CAPTURED',title:'Not on the Manifest',text:'Helen Karens runs her pen down the manifest twice, then closes it. “Regulation requires me to report a person not on my list.” Two crewmen walk you to the mail room. Through the little window you watch the lights of New Jersey appear, holding a warning nobody will hear.'}
const _checkEndings=checkEndings
checkEndings=function(){if(window.gameOver)return;const H=ai[PURSER]
 // Every lie caught anywhere on the ship eventually reaches the purser's office
 if(contradictions.length>(H.contraSeen||0)){const d=contradictions.length-(H.contraSeen||0);H.contraSeen=contradictions.length
  H.trust=Math.max(H.met?0:12,H.trust-5*d);const r='rumour: a stranger aboard is telling different people different stories'
  if(!H.heard.includes(r)){H.heard.push(r);H.heard=H.heard.slice(-6)}
  narrate('Word of your mixed-up stories is reaching the purser’s office.')}
 if(H.met&&H.trust<=10){ENDINGS.capture=CAPTURE_PURSER;return endGame('capture')}
 ENDINGS.capture=CAPTURE_STEWARD;_checkEndings()}
const _renderNB3=renderNotebook
renderNotebook=function(){_renderNB3();const H=ai[PURSER],g=$('#notebookBody .nb-goals');if(!g)return
 const w=document.createElement('div');w.className='nb-meta nb-contra'
 w.textContent='Danger: the Purser, Helen Karens (B deck office), checks every name against her manifest. '+(H.met?'Her trust: '+H.trust+'/100. At 10 or below, she has you.':'Lies caught anywhere on the ship reach her office.')
 g.after(w)}
