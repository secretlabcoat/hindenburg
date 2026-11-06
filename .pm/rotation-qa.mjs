// Repro: npm install --prefix /tmp/hb-qa playwright-core; PLAYWRIGHT_MODULE=/tmp/hb-qa/node_modules/playwright-core node .pm/rotation-qa.mjs
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);let pw;try{pw=require('playwright-core')}catch{pw=require(process.env.PLAYWRIGHT_MODULE||'/workspace/scratch/hb-qa/node_modules/playwright-core')}
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const OUT=path.join(ROOT,'.pm');const manifest=JSON.parse(fs.readFileSync(path.join(OUT,'art-facing-manifest.json')));
const frames=path.join(OUT,'rotation-frames');fs.mkdirSync(frames,{recursive:true});
const browser=await pw.chromium.launch({executablePath:process.env.CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--disable-gpu']});
async function run(label,size){
 const ctx=await browser.newContext({viewport:size,isMobile:label==='mobile',hasTouch:label==='mobile'});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push('pageerror:'+e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 // Test the actual locally committed art bytes deterministically, without CDN caching/network flakiness.
 await page.route('https://cdn.jsdelivr.net/**/assets/art/**',r=>r.fulfill({path:path.join(ROOT,'assets/art',r.request().url().split('/').pop()),contentType:'image/webp'}));
 await page.goto('file://'+path.join(ROOT,'index.html'));await page.evaluate(()=>localStorage.clear());await page.reload();await page.locator('#startgame').click();
 const report={label,nodeCount:76,assetMode:'local mirror of pinned CDN files',locations:{},errors:[],failures:[],facings:{},forwardTests:[],aliasTests:[]};
 const fail=s=>report.failures.push(s);
 async function teleport(id){await page.waitForFunction(()=>!busy);await page.evaluate(id=>{steps=0;turns=0;window.gameOver=false;view=id;draw()},id);}
 async function turn(direction){await page.locator('#nav'+direction).click();await page.waitForFunction(()=>!busy);return page.evaluate(()=>view)}
 for(const loc of manifest.locations){
  const ids=loc.loop;await teleport(ids[0]);let seen=[];
  for(let i=0;i<4;i++)seen.push(await turn('left'));const leftBack=seen[3]===ids[0];const leftOk=new Set(seen).size===4&&seen.every(id=>ids.includes(id));
  seen=[];for(let i=0;i<4;i++)seen.push(await turn('right'));const rightBack=seen[3]===ids[0];const rightOk=new Set(seen).size===4&&seen.every(id=>ids.includes(id));
  report.locations[loc.name]={facingCount:4,ids,leftBack,rightBack,leftOk,rightOk};if(!leftBack||!rightBack||!leftOk||!rightOk)fail('turn loop '+loc.name);
 }
 for(const [id,f] of Object.entries(manifest.facings)){
  await teleport(id);
  if(f.status==='ready')await page.waitForFunction(()=>document.querySelector('.paint.has-art .scene-art')?.naturalWidth>0);
  const state=await page.evaluate(()=>{const n=nodes[view],p=document.querySelector('.paint');const b=document.querySelector('#navforward');const rect=document.querySelector('.navdock').getBoundingClientRect();return {view,framing:n.framing,feature:n.fallback,status:n.artStatus,hasArt:p.classList.contains('has-art'),hasImage:!!p.querySelector('.scene-art'),hasDrawing:!!p.querySelector('.facing-feature'),forward:n.forward,forwardDisabled:b.disabled,reciprocal:nodes[n.right]?.left===view&&nodes[n.left]?.right===view,navVisible:rect.top>=0&&rect.bottom<=innerHeight,moveTargets:[...p.querySelectorAll('[data-move]')].map(el=>el.dataset.move)}});
  report.facings[id]=state;
  if(!state.reciprocal)fail('inverse turns '+id);
  if(f.status==='placeholder'&&(state.hasArt||state.hasImage||!state.hasDrawing))fail('placeholder photo leak '+id);
  if(f.status==='ready'&&!state.hasArt)fail('missing ready art '+id);
  if(state.forwardDisabled!==!state.forward)fail('forward enabled state '+id);
  if(!state.navVisible)fail('navigation clipped '+id);
  if(state.moveTargets.some(target=>target!==state.forward))fail('stale hotspot '+id);
  if(label==='desktop')await page.locator('#scene').screenshot({path:path.join(frames,id+'.png')});
  if(state.forward){const expected=state.forward;const got=await turn('forward');report.forwardTests.push({id,expected,got,ok:expected===got});if(expected!==got)fail('forward destination '+id)}
 }
 // Structural physical constraints, independent of UI rendering.
 const graph=await page.evaluate(()=>JSON.parse(JSON.stringify(nodes)));
 for(const loc of manifest.locations){const axis=loc.loop.filter(id=>graph[id].framing==='hall-axis');if(axis.length){if(axis.length!==2||graph[graph[axis[0]].right].right!==axis[1])fail('non-opposite hall axes '+loc.name)}}
 for(const id of ['promenade','lounge_windows','corridor_forward','bdeck_cabins_wall','crew_door_sign','crew_door_pipes','bdeck_stairs_wall'])if(graph[id].forward)fail('solid-wall forward '+id);
 for(const [alias,target] of Object.entries(manifest.aliases)){
  await page.evaluate(alias=>{let d=JSON.parse(localStorage.getItem(SAVE_KEY));d.view=alias;restore(d)},alias);let restored=await page.evaluate(()=>view);
  await page.waitForFunction(()=>!busy);await page.evaluate(alias=>travel(alias),alias);await page.waitForFunction(()=>!busy);let travelled=await page.evaluate(()=>view);
  report.aliasTests.push({alias,target,restored,travelled,ok:restored===target&&travelled===target});if(restored!==target||travelled!==target)fail('alias '+alias);
 }
 // Tour/climb action edges are deliberate gates in addition to navigation graph exits.
 const reached=new Set(['washroom_stall']);let todo=['washroom_stall'];while(todo.length){const id=todo.pop();let next=['left','right','forward'].map(k=>graph[id][k]).filter(Boolean);if(id==='crew_door_in')next.push('tour_shoes');if(id==='tour_cells')next.push('girder_nook');for(const dest of next)if(!reached.has(dest)){reached.add(dest);todo.push(dest)}}
 report.reachableFacings=reached.size;if(reached.size!==76)fail('unreachable facings '+[...Object.keys(graph)].filter(id=>!reached.has(id)).join(','));
 // Actual quest/action interactions still rendered on the appropriate original facing.
 report.interactions={};await page.evaluate(()=>{ai[BUNNY].toured=false;ai[BUNNY].met=true;ai[BUNNY].trust=60});
 for(const [id,selector] of [['crew_door_in','[data-act="tour"]'],['tour_cells','[data-x11="flicker"]'],['girder_nook','[data-person]'],['keel_hatch','[data-act="hatch"]'],['washroom_stall','[data-wash="shower"]'],['cabin_window','[data-x11="b6window"]']]){await teleport(id);const count=await page.locator('#scene '+selector).count();report.interactions[id]=count;if(!count)fail('interaction lost '+id)}
 await teleport('tour_cells');await page.evaluate(()=>ACTS.climb());let climbed=await page.evaluate(()=>({view,wallForward:nodes.girder_nook.forward,down:nodes.girder_nook_down.forward}));report.climbTest=climbed;if(climbed.view!=='girder_nook'||climbed.wallForward!==null||climbed.down!=='tour_cells')fail('climb return wall');
 await teleport('bdeck_corr_washdoor');await page.waitForFunction(()=>document.querySelector('.scene-art')?.naturalWidth>0);await page.screenshot({path:path.join(OUT,'rotation-'+label+'.png')});
 report.errors=errors;if(errors.length)fail('console/page errors');await ctx.close();return report;
}
let results;try{results=[await run('mobile',{width:390,height:844}),await run('desktop',{width:1280,height:800})];fs.writeFileSync(path.join(OUT,'rotation-qa.json'),JSON.stringify(results,null,2)+'\n');for(const r of results)console.log(r.label,':',r.nodeCount,'facings;',r.failures.length,'failures;',r.errors.length,'console errors; reachable',r.reachableFacings);if(results.some(r=>r.failures.length))process.exitCode=1}finally{await browser.close()}
