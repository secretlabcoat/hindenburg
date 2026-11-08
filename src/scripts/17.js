
/* v2 requested UX fixes + existing allowlisted AI relay. */
(()=>{
 window.hindenburgLiveEnabled=true;
 const settings=$('#settings');settings.innerHTML='<strong>Dialogue mode</strong><p>Live AI uses the existing Hindenburg relay and needs internet. If unavailable, clearly marked scripted dialogue is used. Never enter an API key.</p><label><input id="live-mode" type="checkbox" checked> Use live AI dialogue</label><input id="relay" type="hidden" value="live"><span id="relay-state" role="status" aria-live="polite">Live AI enabled — not yet connected</span>';
 $('#settingsBtn').textContent='Dialogue mode';$('#settingsBtn').setAttribute('aria-label','Open dialogue mode settings');
 window.setRelayState=text=>{window.lastRelayState=text;$('#relay-state').textContent=text;const fb=document.querySelector('.dialogue-feedback');if(fb)fb.textContent=text};
 $('#live-mode').onchange=e=>{window.hindenburgLiveEnabled=e.target.checked;window.setRelayState(e.target.checked?'Live AI enabled — connects when you speak':'Offline scripted mode — use a prompt, or ask about fire, introductions or where to go.')};
 const tools=document.createElement('div');tools.id='dialogue-tools';tools.setAttribute('aria-label','Supported dialogue prompts');$('#form').before(tools);
 const prompts=[['Introduce yourself','Hello. Who are you?'],['Warn about fire','I am warning you about fire and hydrogen during the landing at Lakehurst. Please help me warn the officers.'],['Ask where to go','Where should I go to find the officers?']];
 function refresh(){tools.replaceChildren();const feedback=document.createElement('span');feedback.className='dialogue-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.textContent=who?(window.hindenburgLiveEnabled?'Live AI enabled — speak freely, or choose a prompt.':'Offline scripted mode — choose a supported prompt or ask about fire. And unsupported text gets an explanation.'):'Select a visible character to speak. Live AI needs internet; fallback is scripted.';tools.append(feedback);
 for(const[label,text]of prompts){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-label',label);b.disabled=!who;b.onclick=()=>{if(!who||talking)return;$('#say').value=text;$('#form').requestSubmit()};tools.append(b)}}
 const oldChoose=choose;choose=function(n){const r=oldChoose(n);refresh();return r};
 const oldDraw=draw;draw=function(){const r=oldDraw.apply(this,arguments);refresh();return r};
 const oldOffline=offline;
 offline=function(n,text){
 const q=text.toLowerCase();window.setRelayState('Offline scripted response — '+(window.hindenburgLiveEnabled?(window.lastRelayFailure||'live AI unavailable'):'live AI switched off')+'.');
 if(/\b(fire|burn|hydrogen|crash|disaster|danger|spark|evacuat)/.test(q)){
 if(n==='Colonel Landry Stoppard')return 'A fire during landing? That is a serious warning, not a campaign story. What evidence have you? Take it to Chief Steward Toxu or the officers; they can check the ship. (Scripted response.)';
 if(n==='Manard Toxu'||n==='Emilio Estavant'||n==='Captain Swanson Kyle')return oldOffline(n,text)+' You are warning me about fire at the landing. Evidence matters. (Scripted response.)';
 return 'You are warning us about fire on the airship. Tell the Chief Steward or an officer; they have the authority to investigate. (Scripted response.)';
 }
 if(/where|officer|captain|route|go to/.test(q))return 'The Chief Steward is in the A-deck passenger corridor. The officers are in the control car, reached through the keel. Use your map and notebook. (Scripted guidance.)';
 if(/hello|who are you|introduce|good evening/.test(q))return (GREET[n]||('I am '+n+'.'))+' (Scripted greeting.)';
 return 'Offline scripted mode does not understand that message. Try Introduce yourself, Warn about fire, or Ask where to go. No live AI interpretation was made.';
 };
 $('#say').setAttribute('aria-label','Message to selected character');$('#say').placeholder='Speak to selected character, or choose a prompt';
 $('#closeInventory').setAttribute('aria-label','Close inventory menu');
 const oldSubmit=$('#form').onsubmit;$('#form').onsubmit=async function(e){if(!who)return oldSubmit.call(this,e);await oldSubmit.call(this,e);};
 const oldRestoreV2=restore;restore=function(d){let hintSeen=false;const clean={...d,log:(d.log||[]).filter(row=>{if(!String(row[1]).includes('turn until you face the door'))return true;if(hintSeen)return false;hintSeen=true;return true})};return oldRestoreV2(clean)};
 refresh();renderInventory();
})();
