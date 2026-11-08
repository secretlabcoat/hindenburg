const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('node:fs');
const assert=require('node:assert/strict');

const SAVE_KEY='hindenburg_playable_20261107_v1';
const html=fs.readFileSync(__dirname+'/../dist/index.html','utf8');
const passed=[];
const allErrors=[];
let relayReply={reply:'The warning is serious.',trust_delta:0,claim_type:'warning',mood:'skeptical'};
let relayCalls=0;

function make(save){
  const errors=[];
  const vc=new VirtualConsole();
  vc.on('jsdomError',e=>errors.push(e.message));
  const dom=new JSDOM(html,{
    runScripts:'dangerously',
    pretendToBeVisual:true,
    url:'http://localhost:8774/game.html',
    virtualConsole:vc,
    beforeParse(w){
      w.HTMLElement.prototype.scrollIntoView=function(){};
      w.AbortController=AbortController;
      const originalSetTimeout=w.setTimeout.bind(w);
      w.setTimeout=(fn,ms,...args)=>ms===2500?(fn(...args),0):originalSetTimeout(fn,ms,...args);
      w.fetch=async()=>{relayCalls++;return{ok:true,status:200,json:async()=>({...relayReply})}};
      if(save)w.localStorage.setItem(SAVE_KEY,save);
    }
  });
  return{dom,w:dom.window,d:dom.window.document,errors};
}

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const plain=value=>JSON.parse(JSON.stringify(value));
async function start(save){
  const t=make(save);
  await wait(20);
  t.d.querySelector('#startgame').click();
  await wait(20);
  allErrors.push(...t.errors);
  return t;
}
function close(t){allErrors.push(...t.errors);t.dom.window.close()}
function say(t,text){
  t.d.querySelector('#say').value=text;
  t.d.querySelector('#form').dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));
  return wait(20);
}

(async()=>{
  const endings=[
    {key:'hero_steward',kind:'hero',title:'The Warning Carried Forward',setup:"ai[STEWARD].met=true;ai[STEWARD].warned=true;ai[STEWARD].trust=65;"},
    {key:'hero_officer',kind:'hero',title:'Checked Twice',setup:"ai[FIRST].met=true;ai[FIRST].warned=true;ai[FIRST].trust=60;"},
    {key:'hero_captain',kind:'hero',title:'The Captain’s Word',setup:"ai[CAPTAIN].met=true;ai[CAPTAIN].warned=true;ai[CAPTAIN].trust=70;"},
    {key:'capture_steward',kind:'capture',title:'No Such Passenger',setup:"ai[STEWARD].met=true;ai[STEWARD].trust=10;"},
    {key:'capture_purser',kind:'capture',title:'Not on the Manifest',setup:"ai[PURSER].met=true;ai[PURSER].trust=10;"},
    {key:'escape',kind:'escape',title:'Down the Landing Rope',setup:"view='keel_hatch';ai[BUNNY].route=true;turns=16;steps=0;draw();",action:t=>t.d.querySelector('.scene [data-act="hatch"]').click()},
    {key:'failure',kind:'failure',title:'Lakehurst',setup:'turns=22;checkEndings();'}
  ];
  for(const ending of endings){
    const t=await start();
    t.w.eval(ending.setup);
    if(ending.action)ending.action(t);
    else if(ending.key!=='failure')t.w.eval('checkEndings()');
    assert.equal(t.w.gameOver,ending.kind,ending.key+' ending kind');
    assert.equal(t.d.querySelector('#endtitle').textContent,ending.title,ending.key+' ending title');
    const collected=JSON.parse(t.w.localStorage.getItem('hindenburg_endings_v2'));
    assert(collected.includes(ending.key),ending.key+' recorded in collection');
    close(t);
  }
  passed.push('All seven ending branches trigger and record their distinct collection keys at boundary prerequisites');

  const items=await start();
  for(const name of ['Key','Scrap of paper']){
    items.d.querySelector(`#inv .item[aria-label="${name}"]`).click();
    items.d.querySelector('#use').click();
    assert(items.d.querySelector('#log').textContent.includes(`You consider using the ${name}. There is no obvious use for it here.`));
  }
  items.d.querySelector('#take').click();
  assert(items.d.querySelector('#log').textContent.includes('Nothing here looks unattended enough to pocket.'));
  items.w.eval("ai[STEWARD].met=true;ai[STEWARD].metWhere='A-deck corridor';ai[STEWARD].warned=true;ai[STEWARD].trust=64;renderNotebook()");
  items.d.querySelector('#inv .item[aria-label="Notebook"]').click();
  const notebook=items.d.querySelector('#notebookBody').textContent;
  assert(items.d.querySelector('#notebookModal').classList.contains('open'));
  assert(notebook.includes('Manard Toxu')&&notebook.includes('Warn him about the landing')&&notebook.includes('64/100'));
  passed.push('Key and scrap have no implemented use; Take is a generic dead end; Notebook renders met-character goals and trust');
  close(items);

  const warning=await start();
  warning.w.eval('window.hindenburgLiveEnabled=false;choose(STEWARD)');
  await say(warning,'There is a fire danger at Lakehurst.');
  assert(warning.w.eval('ai[STEWARD].warned'));
  assert(warning.d.querySelector('#log').textContent.includes('You have warned me. I will take it to the officers.'));
  close(warning);
  passed.push('Offline fire/Lakehurst warning marks the Chief Steward warned without a relay call');

  relayReply={reply:'You have my attention.',trust_delta:1,claim_type:'ordinary',mood:'calm'};
  const bunny=await start();
  bunny.w.eval("view='keel_walk';ai[BUNNY].trust=52;draw()");
  bunny.w.eval('choose(BUNNY)');
  await say(bunny,'I can help you when the ropes drop.');
  assert.equal(bunny.w.eval('ai[BUNNY].trust'),55);
  assert(bunny.w.eval('ai[BUNNY].route'));
  bunny.w.eval("view='keel_hatch';turns=15;steps=0;draw()");
  bunny.d.querySelector('.scene [data-act="hatch"]').click();
  assert.notEqual(bunny.w.gameOver,'escape','hatch stays closed before approach');
  bunny.w.eval('turns=16;steps=0;draw()');
  bunny.d.querySelector('.scene [data-act="hatch"]').click();
  assert.equal(bunny.w.gameOver,'escape');
  assert(bunny.d.querySelector('#endtext').textContent.includes('Bunny'));
  assert.equal(relayCalls,1,'only the mocked Bunny reply was requested');
  close(bunny);
  passed.push('Mocked trust increase from 52 to 55 arranges Bunny; hatch refuses before clock 16 and escapes at approach');

  const tour=await start();
  tour.w.eval("view='washroom_stall';turns=8;steps=0;draw();ACTS.tour()");
  assert.equal(tour.w.HindenburgTopology.roomOf(tour.w.eval('view')),'wash','tour requires crew access');
  tour.w.eval("view='crew_door_in';turns=7;steps=0;draw();ACTS.tour()");
  assert.equal(tour.w.HindenburgTopology.roomOf(tour.w.eval('view')),'crew','tour closed before 8');
  for(const time of [8,15]){
    tour.w.eval(`view='crew_door_in';turns=${time};steps=0;ai[BUNNY].toured=false;draw();ACTS.tour()`);
    assert.equal(tour.w.HindenburgTopology.roomOf(tour.w.eval('view')),'shoes',`tour open at ${time}`);
  }
  tour.w.eval("view='crew_door_in';turns=16;steps=0;ai[BUNNY].toured=false;draw();ACTS.tour()");
  assert.equal(tour.w.HindenburgTopology.roomOf(tour.w.eval('view')),'crew','tour closed at 16');
  close(tour);
  passed.push('Guided tour requires crew access and is available at clock 8–15, but closed at 7 and 16');

  const source=await start();
  source.w.eval("view='lounge_side';turns=5;steps=7;ai[STEWARD].met=true;ai[STEWARD].warned=true;ai[STEWARD].trust=64;ai[BUNNY].met=true;ai[BUNNY].trust=55;ai[BUNNY].route=true;contradictions.push('synthetic contradiction');window.collectedNote=true;gameItems.push({name:'Steward note',icon:'N',desc:'Synthetic test item'});saveGame()");
  const v3=JSON.parse(source.w.localStorage.getItem(SAVE_KEY));
  const expected={
    view:'lounge_side',
    room:source.w.HindenburgTopology.roomOf('lounge_side'),
    heading:source.w.HindenburgTopology.headingOf('lounge_side'),
    turns:5,steps:7,
    items:plain(source.w.eval('gameItems')),
    note:true,
    contradictions:['synthetic contradiction'],
    steward:{met:true,warned:true,trust:64},
    bunny:{met:true,trust:55,route:true}
  };
  close(source);
  const fixtures=[
    {name:'V1 synthetic',mutate:s=>delete s.topologyVersion,migrates:true},
    {name:'V2 synthetic',mutate:s=>{s.topologyVersion=2},migrates:true},
    {name:'V3 synthetic',mutate:s=>{s.topologyVersion=3},migrates:false}
  ];
  for(const fixture of fixtures){
    const save={...v3,ai:JSON.parse(JSON.stringify(v3.ai))};
    fixture.mutate(save);
    const t=await start(JSON.stringify(save));
    const topology=t.w.HindenburgTopology;
    assert.equal(t.w.eval('view'),expected.view,fixture.name+' exact view');
    assert.equal(topology.roomOf(t.w.eval('view')),expected.room,fixture.name+' room');
    assert.equal(topology.headingOf(t.w.eval('view')),expected.heading,fixture.name+' orientation');
    assert.equal(t.w.eval('turns'),expected.turns,fixture.name+' turns');
    assert.equal(t.w.eval('steps'),expected.steps,fixture.name+' steps');
    assert.deepEqual(plain(t.w.eval('gameItems')),expected.items,fixture.name+' inventory');
    assert.equal(t.w.collectedNote,expected.note,fixture.name+' note flag');
    assert.deepEqual(plain(t.w.eval('contradictions')),expected.contradictions,fixture.name+' contradictions');
    assert.deepEqual(plain(t.w.eval(`({met:ai[STEWARD].met,warned:ai[STEWARD].warned,trust:ai[STEWARD].trust})`)),expected.steward,fixture.name+' Steward flags');
    assert.deepEqual(plain(t.w.eval(`({met:ai[BUNNY].met,trust:ai[BUNNY].trust,route:ai[BUNNY].route})`)),expected.bunny,fixture.name+' Bunny flags');
    assert.equal(JSON.parse(t.w.localStorage.getItem(SAVE_KEY)).topologyVersion,3,fixture.name+' rewritten as V3');
    assert.equal(t.d.querySelector('#log').textContent.includes('V3 layout migration'),fixture.migrates,fixture.name+' migration notice');
    close(t);
  }
  passed.push('Synthetic V1/V2/V3 reloads retain room, compass orientation, turns, steps, inventory, note, contradictions, Steward and Bunny flags');

  assert.equal(allErrors.length,0,allErrors.join('\n'));
  console.log(JSON.stringify({passed:passed.length,tests:passed,uncaughtErrors:allErrors,relayCalls,limits:'Synthetic save payloads derived from the current v:1 schema; no historical save files or live relay used.'},null,2));
})().catch(error=>{console.error(error);process.exit(1)});
