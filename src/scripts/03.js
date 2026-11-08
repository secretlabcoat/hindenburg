
/* Original generated ambience: a quiet waltz-like motif, mechanical drone and filtered noise. No recordings or copyrighted melodies. */
let audioCtx=null,audioOn=true,master=null,audioLoop=null,noiseNode=null;
function beginAudio(){
  if(!audioOn)return;
  try{
    if(!audioCtx){
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      master=audioCtx.createGain();
      master.gain.value=.14;
      master.connect(audioCtx.destination);
      AudioFX.init();
    }
    let drone=audioCtx.createOscillator(),dg=audioCtx.createGain();
    drone.type='sine';
    drone.frequency.value=58;
    dg.gain.value=.09;
    drone.connect(dg).connect(master);
    drone.start();
    let len=audioCtx.sampleRate*2,buffer=audioCtx.createBuffer(1,len,audioCtx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<len;i++)data[i]=(Math.random()*2-1);
    let src=audioCtx.createBufferSource();
    src.buffer=buffer;
    src.loop=true;
    let low=audioCtx.createBiquadFilter();
    low.type='lowpass';
    low.frequency.value=220;
    let ng=audioCtx.createGain();
    ng.gain.value=.045;
    src.connect(low).connect(ng).connect(master);
    src.start();
    noiseNode=src;
    let t=0;
    audioLoop=setInterval(()=>{
      if(!audioCtx||!audioOn)return;
      const now=audioCtx.currentTime;
      const melody=[392,440,349.23,329.63,392,293.66,349.23,261.63,329.63,293.66,261.63,293.66];
      for(let j=0;j<3;j++){
        let osc=audioCtx.createOscillator(),g=audioCtx.createGain();
        osc.type='sine';
        osc.frequency.value=melody[(t+j)%melody.length];
        let at=now+j*.55;
        g.gain.setValueAtTime(.0001,at);
        g.gain.exponentialRampToValueAtTime(.024,at+.04);
        g.gain.exponentialRampToValueAtTime(.0001,at+.46);
        osc.connect(g).connect(master);
        osc.start(at);
        osc.stop(at+.5);
      }
      t=(t+3)%melody.length;
    },1700);
    audioCtx.resume();
  }catch(e){
    document.querySelector('#soundbtn').textContent='Sound unavailable';
  }
}
document.querySelector('#startgame').onclick=()=>{document.querySelector('#titleoverlay').style.display='none'; document.querySelector('#titleoverlay').hidden=true;beginAudio();log.innerHTML='';view='washroom_stall';steps=0;
  narrate('The B-deck washroom. You have spent the crossing hidden behind the curtain of the only shower aboard, listening to the engines hum through the thin walls. Out the door is the B-deck corridor. Up the stairs, the passengers are gathering for evening drinks. You know how this voyage ends.');
  narrate('Tip: Turn in place with ← →. Face South for the washroom door; use its labelled doorway to enter the adjoining B-deck corridor.');
  draw();
  setTimeout(()=>{$('#navleft').classList.add('pulse');},500);
  setTimeout(()=>{$('#navright').classList.add('pulse');},1500);
  setTimeout(()=>{$('#navforward').classList.add('pulse');},2500);
  setTimeout(()=>{$('#navleft').classList.remove('pulse');$('#navright').classList.remove('pulse');$('#navforward').classList.remove('pulse');},5000);
};
document.querySelector('#soundbtn').onclick=()=>{
  audioOn=!audioOn;
  document.querySelector('#soundbtn').textContent=audioOn?'♫ Sound on':'♫ Sound off';
  if(audioOn){beginAudio();AudioFX.setEnabled(true);}
  else{if(audioCtx)audioCtx.suspend();AudioFX.setEnabled(false);}
};
