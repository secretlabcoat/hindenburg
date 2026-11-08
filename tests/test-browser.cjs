// Optional real-browser QA: PLAYWRIGHT_MODULE=/path/to/playwright-core node tests/test-browser.cjs
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright-core');
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const results=[];try{for(const viewport of [{width:1280,height:900},{width:393,height:852},{width:393,height:600},{width:852,height:393}]){
console.log("Checking",viewport);const page=await browser.newPage({viewport});page.setDefaultTimeout(5000);const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://**/*',route=>route.abort());await page.goto('file://'+path.resolve(__dirname,'../dist/index.html'));await page.locator('#startgame').click();
await page.locator('#topology-map-toggle').click();await page.locator('#soundbtn').click();await page.locator('#soundbtn').click();
assert(await page.locator('.scene').evaluate(e=>e.getBoundingClientRect().height>=180));
for(const room of ['shoes','keel','control']){await page.evaluate(id=>{window.eval('view=HindenburgTopology.data.rooms['+JSON.stringify(id)+'].views[0];draw()')},room);await page.waitForTimeout(100);
const check=await page.evaluate(()=>{const p=document.querySelector('.topology-plan-scroll'),d=document.querySelector('[data-player-dot]').getBoundingClientRect(),r=p.getBoundingClientRect();return {visible:d.bottom>r.top&&d.top<r.bottom&&d.right>r.left&&d.left<r.right,outer:window.scrollY}});assert(check.visible,room+' dot visible');assert.equal(check.outer,0);
await page.locator('#topology-deck').selectOption('A');await page.locator('.topology-plan-scroll').evaluate(e=>e.scrollTop=12);await page.waitForTimeout(100);assert.equal(await page.locator('.topology-plan-scroll').evaluate(e=>e.scrollTop),12);await page.locator('#topology-deck').selectOption(await page.evaluate(()=>HindenburgTopology.data.rooms[HindenburgTopology.roomOf(window.eval('view'))].deck));await page.waitForTimeout(100);
}
await page.locator('#topology-map-toggle').click();await page.locator('#examine').click();await page.locator('#topology-map-toggle').click();await page.locator('#examine').click();
await page.screenshot({path:path.resolve(__dirname,`../audit/p0-${viewport.width}x${viewport.height}.png`),fullPage:true});
await page.setViewportSize({width:393,height:852});await page.waitForTimeout(100);assert(await page.locator('.scene').evaluate(e=>e.getBoundingClientRect().height>=180));
assert.deepEqual(errors,[]);results.push({viewport,passed:true});await page.close();}
fs.writeFileSync(path.resolve(__dirname,'browser-test-results.json'),JSON.stringify({results,limits:'Headless Chrome; file-origin offline UI. No live relay, soft keyboard, audio quality or full story/ending suite verified.'},null,2));console.log(results);
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
