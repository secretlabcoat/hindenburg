
/* ---------- Live AI relay + automatic notebook ----------
   Talks to the hindenburg-ai Worker exactly as it expects:
   POST /talk   {npc, line, trust, phase, claims, heard, history:[{who:'player'|'npc', text}]}
   POST /gossip {a, b, claimsA, claimsB}
   The browser keeps all state. Full history is sent; the relay keeps the last few
   lines for the AI but scans all of it for "you're making that up" call-outs. */
const NPC_IDS={'Damina Vontette':'aunt','Snardy Vontette':'snardy','Colonel Landry Stoppard':'colonel','Vaunice Charles':'actress','Manard Toxu':'steward','Potter McNare':'reporter'}
const ai={}
for(const n of Object.keys(NPC_IDS))ai[n]={met:false,metWhere:'',trust:30,claims:[],heard:[],history:[],mood:'',lastReply:'',suspects:[]}
const contradictions=[]
let talking=false,gossipBusy=false,gossipKeys={}
const relayURL=()=>($('#relay').value||RELAY_DEFAULT).trim().replace(/\/+$/,'')
function trustWord(t){return t>=70?'trusts you':t>=50?'warming to you':t>=30?'wary':t>=15?'suspicious':'deeply distrustful'}
function flashNotebook(){const b=[...document.querySelectorAll('#inv .item')].find(x=>x.title==='Notebook');if(b){b.classList.remove('nbflash');void b.offsetWidth;b.classList.add('nbflash')}}
function renderNotebook(){
  const body=$('#notebookBody');body.innerHTML=''
  const met=Object.keys(ai).filter(n=>ai[n].met)
  if(!met.length){body.innerHTML='<p class="nb-entry">Nobody yet. Find someone to talk to.</p>';return}
  for(const n of met){const s=ai[n],d=document.createElement('div');d.className='nb-entry'
    const h=document.createElement('h3');h.textContent=n;d.append(h)
    const m=document.createElement('div');m.className='nb-meta';m.textContent='Met: '+s.metWhere+' · '+trustWord(s.trust)+' ('+s.trust+'/100)'+(s.mood?' · mood: '+s.mood:'');d.append(m)
    const add=(title,items,cls)=>{if(!items.length)return;const t=document.createElement('div');t.textContent=title;if(cls)t.className=cls;const ul=document.createElement('ul');items.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});d.append(t,ul)}
    add('What you told them:',s.claims)
    add('What they seem to suspect:',s.suspects.slice(-3))
    add('What they heard about you:',s.heard,'nb-contra')
    if(s.lastReply){const l=document.createElement('div');l.className='nb-meta';l.textContent='Last said: “'+s.lastReply+'”';d.append(l)}
    body.append(d)}
  if(contradictions.length){const d=document.createElement('div');d.className='nb-entry';const h=document.createElement('h3');h.textContent='Contradictions caught';d.append(h);const ul=document.createElement('ul');contradictions.forEach(c=>{const li=document.createElement('li');li.className='nb-contra';li.textContent=c;ul.append(li)});d.append(ul);body.append(d)}
}
function openNotebook(){renderNotebook();$('#inventoryModal').classList.remove('open');$('#notebookModal').classList.add('open')}
$('#closeNotebook').onclick=()=>$('#notebookModal').classList.remove('open')
$('#notebookModal').onclick=e=>{if(e.target.id==='notebookModal')$('#notebookModal').classList.remove('open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#notebookModal').classList.remove('open')})
const nb=gameItems.find(i=>i.name==='Notebook');if(nb)nb.desc='Your notebook. It fills itself in as you meet people.'
const _inspect=inspectItem;inspectItem=function(item){if(item.name==='Notebook'){selected='Notebook';openNotebook();return}_inspect(item)}
renderInventory()
// Meeting someone: record it, and keep their greeting in the shared history
const _choose2=choose
choose=function(n){_choose2(n);const s=ai[n];if(!s)return
  if(!s.met){s.met=true;s.metWhere=(typeof room==='string'&&room)||'the ship';flashNotebook()}
  const ps=log.querySelectorAll('p.npc');const greet=ps.length?ps[ps.length-1].textContent.replace(/^[^:]+:\s*/,''):''
  const last=s.history[s.history.length-1];if(greet&&!(last&&last.text===greet))s.history.push({who:'npc',text:greet})}
function thinkingLine(n){const p=document.createElement('p');p.className='thinking';p.textContent=n.split(' ')[0]+' is thinking';const d=document.createElement('span');d.className='dots';p.append(d);log.append(p);log.scrollTop=log.scrollHeight;return p}
async function postRelay(path,body,ms){
 if(!window.hindenburgLiveEnabled)throw Error('Live AI disabled');
 if(!['/talk','/gossip'].includes(path))throw Error('Unsupported relay route');
 window.setRelayState?.('Connecting to live AI…');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),Math.min(ms||15000,15000));
 try{const r=await fetch('https://hindenburg-ai.secretlabcoat-0ba.workers.dev'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal,credentials:'omit',redirect:'error'});
 let data;try{data=await r.json()}catch{throw Error('Relay returned unreadable data')}
 if(!r.ok)throw Error('Relay HTTP '+r.status);
 if(data.fallback)throw Error('Relay used scripted fallback');
 if(path==='/talk'&&(typeof data.reply!=='string'||!data.reply.trim()))throw Error('Relay returned no reply');
 window.setRelayState?.('Live AI connected');return data;
 }catch(e){window.lastRelayFailure=e.name==='AbortError'?'15-second timeout':e.message;window.setRelayState?.('Offline scripted fallback — '+window.lastRelayFailure);throw e}finally{clearTimeout(timer)}
}
$('#form').onsubmit=async e=>{e.preventDefault()
  const s=$('#say').value.trim();if(!s||talking)return
  if(!who){narrate('Choose a passenger first.');return}
  const n=who,st=ai[n];$('#say').value='';line('You',s,'you');turns++
  if(window.gameOver){narrate('The voyage is over. Start a new one from the title screen.');return}
  if(!st){narrate('Choose a character before speaking.');return}
  talking=true;const btn=$('#form button');btn.disabled=true
  $('#speaker').textContent=n+' is thinking… (AI replies can take ~20s)'
  const th=thinkingLine(n)
  try{const data=await postRelay('/talk',{npc:NPC_IDS[n],line:s,trust:st.trust,phase:gamePhase(),claims:st.claims,heard:heardFor(n),history:st.history.slice(-40)},45000)
    if(data.fallback||typeof data.reply!=='string'||!data.reply.trim())throw Error('AI busy')
    th.remove();line(n,data.reply)
    st.history.push({who:'player',text:s},{who:'npc',text:data.reply})
    {const d=Number(data.trust_delta)||0;st.trust=Math.max(0,Math.min(100,st.trust+Math.round(d>0?d*3:d*2)))}
    if(data.claim&&!st.claims.includes(data.claim)){st.claims.push(data.claim);st.claims=st.claims.slice(-6)}
    if(data.mood)st.mood=data.mood
    st.lastReply=data.reply
    if(/\?/.test(data.reply)&&/suspic|wary|doubt|curious|annoy/i.test(data.mood||''))st.suspects.push(data.reply)
    flashNotebook()
    $('#speaker').textContent='Speaking with '+n+' · AI connected'
    showAIStatus('AI connected: last response from '+n+'.')
    afterTurn(n,s,data)
    maybeGossip()
  }catch(err){th.remove();const r=offline(n,s);line(n,r)
    st.history.push({who:'player',text:s},{who:'npc',text:r})
    // Still remember what you claimed, so the notebook and gossip keep working offline
    if(/\b(i am|i'm|i’m|my name|i work|i was|i have)\b/i.test(s)){const c=s.replace(/\s+/g,' ').slice(0,80);if(!st.claims.includes(c)){st.claims.push(c);st.claims=st.claims.slice(-6)}}
    $('#speaker').textContent='Speaking with '+n+' · scripted (AI unavailable: '+err.message+')'
    showAIStatus('AI unavailable, used scripted line: '+err.message)
    afterTurn(n,s,null)
  }finally{talking=false;btn.disabled=false;saveGame()}}
// Gossip: Damina and Snardy travel together, so once both have heard something from
// you they compare notes (once per new set of claims): after a reply and when you move.
const PAIRS=[['Damina Vontette','Snardy Vontette'],['Colonel Landry Stoppard','Vaunice Charles'],['Manard Toxu','Damina Vontette'],['Vaunice Charles','Potter McNare']]
async function maybeGossip(){
  if(gossipBusy||window.gameOver)return
  const pair=PAIRS.find(([a,b])=>ai[a].claims.length&&ai[b].claims.length&&gossipKeys[a+'|'+b]!==JSON.stringify([ai[a].claims,ai[b].claims]))
  if(!pair)return
  const [a,b]=pair,A=ai[a],B=ai[b],pk=a+'|'+b
  gossipBusy=true;gossipKeys[pk]=JSON.stringify([A.claims,B.claims])
  const seen=gossipKeys[pk+'#seen'],nA=seen?A.claims.filter(c=>!seen[0].includes(c)):A.claims,nB=seen?B.claims.filter(c=>!seen[1].includes(c)):B.claims
  const cA=(seen&&nA.length&&!nB.length)?nA:A.claims,cB=(seen&&nB.length&&!nA.length)?nB:B.claims
  try{const g=await postRelay('/gossip',{a:NPC_IDS[a],b:NPC_IDS[b],claimsA:cA,claimsB:cB},45000)
    window.lastGossip=g
    if(g.fallback)throw Error('AI busy')
    gossipKeys[pk+'#seen']=[A.claims.slice(),B.claims.slice()]
    if(g.contradiction){
      const pen=Number(g.trust_penalty)||0;A.trust=Math.max(0,A.trust-pen);B.trust=Math.max(0,B.trust-pen)
      const what=g.what||'Your stories do not match.'
      ;[A,B].forEach(x=>{if(!x.heard.includes(what))x.heard.push(what);x.heard=x.heard.slice(-6)})
      contradictions.push(a.split(' ')[0]+' & '+b.split(' ')[0]+': '+what+(g.line?' (overheard: “'+g.line+'”)':''))
      if(g.line)line('Overheard',g.line,'overheard')
      narrate((SHORT[a]||a)+' and '+(SHORT[b]||b)+' have been comparing notes about you.')
      flashNotebook();checkEndings()}
  }catch(e){delete gossipKeys[pk];window.lastGossip={error:String(e)}}finally{gossipBusy=false;saveGame()}}
// Also compare notes when you move on, in case the last check was skipped
const _travel=travel;travel=function(d){maybeGossip();return _travel(d)}
