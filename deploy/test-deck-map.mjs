import {JSDOM} from 'jsdom';
import fs from 'fs';
import crypto from 'crypto';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('./hindenburg-worker.html', import.meta.url), 'utf8');
const plan = JSON.parse(fs.readFileSync(new URL('./deck-plans/plans.json', import.meta.url), 'utf8'));
assert.equal(crypto.createHash('sha256').update(html).digest('hex').length, 64);
assert.equal(html.split('https://hindenburg-ai.secretlabcoat-0ba.workers.dev').length - 1, 1);
for (const [id, sha] of Object.entries({
  washroom_stall: '96135f0dfdc0b28b5aaef817c027a6c03703108588592610a2fd9fde4ab313f2',
  washroom_basins: '6c5211f4fa640c9421381eab2771f7c3fdb8a41896b032585cee2cdbda340f8d',
  washroom_door: '10dcbb67392fcbf1453968d630888424b7bc914e25405395a246b357db12c232',
  washroom_wall: '774de38bf2eba9e7c7ec6ce98d09cc8389e5b91e5721e82f16bbcf213bbb6e6b'
})) {
  assert.ok(html.includes(id), id);
}
assert.ok(html.includes('[data-person]{opacity:1!important'));

const dom = new JSDOM(html, {runScripts: 'dangerously', pretendToBeVisual: true, url: 'https://hindenburg.secretlabcoat-0ba.workers.dev/', beforeParse(w) {
  w.HTMLElement.prototype.scrollIntoView = function () {};
}});
await new Promise(r => setTimeout(r, 40));
const w = dom.window;
const gameNodes = Array.from(w.eval('Object.keys(nodes)'));
const mapped = Object.keys(plan.nodes);
const missing = gameNodes.filter(id => !mapped.includes(id));
const extra = mapped.filter(id => !gameNodes.includes(id));
assert.deepEqual({missing, extra, game: gameNodes.length, map: mapped.length}, {missing: [], extra: [], game: mapped.length, map: mapped.length});
const places = mapped.map(id => plan.nodes[id].place);
assert.equal(new Set(places).size, Object.keys(plan.places).length);
for (const id of mapped) {
  const place = plan.places[plan.nodes[id].place];
  assert.ok(place, id);
  assert.ok(plan.decks.some(d => d.id === place.deck), id);
}
function placeOf(id) { return plan.nodes[id].place; }
function linked(a, b) {
  return plan.links.some(l => (l.a === a && l.b === b) || (l.a === b && l.b === a));
}
for (const id of gameNodes) {
  for (const dir of ['forward', 'left', 'right']) {
    const dest = w.eval('nodes[' + JSON.stringify(id) + '].' + dir);
    if (!dest || !plan.nodes[dest]) continue;
    if (placeOf(id) !== placeOf(dest)) assert.ok(linked(placeOf(id), placeOf(dest)), id + ' ' + dir + ' ' + dest);
  }
}
const wash = ['washroom_stall', 'washroom_basins', 'washroom_door', 'washroom_wall'];
assert.equal(new Set(wash.map(placeOf)).size, 1);
assert.equal(w.eval('nodes.washroom_door.forward'), 'bdeck_washroom');

w.eval("document.querySelector('#startgame').click()");
assert.equal(w.eval('view'), 'washroom_stall');
assert.equal(w.document.querySelector('#deckhud').hidden, false);
assert.equal(w.document.querySelector('[data-player]').getAttribute('data-node'), 'washroom_stall');
assert.equal(w.document.querySelector('[data-player]').getAttribute('data-heading'), '0');
const before = w.eval('view');
w.document.querySelector('#deckhud-toggle').click();
w.document.querySelector('#deckhud-deck').value = 'A';
w.document.querySelector('#deckhud-deck').dispatchEvent(new w.Event('change'));
assert.equal(w.eval('view'), before);
assert.equal(w.document.querySelector('#deckhud-full [data-player]'), null);
assert.equal(w.document.querySelector('#deckhud-compact [data-player]').getAttribute('data-node'), 'washroom_stall');
w.document.querySelector('#navright').click();
await new Promise(r => setTimeout(r, 250));
assert.equal(w.eval('view'), 'washroom_basins');
assert.equal(w.document.querySelector('[data-player]').getAttribute('data-heading'), '90');
w.eval("view='control_helm';draw()");
assert.equal(w.document.querySelector('[data-person="Captain Swanson Kyle"]').style.opacity || getComputed(w), '1');
function getComputed(win) {
  return win.getComputedStyle(win.document.querySelector('[data-person="Captain Swanson Kyle"]')).opacity;
}
assert.equal(getComputed(w), '1');
w.eval("view='bdeck_stairs';draw()");
assert.equal(w.document.querySelector('#deckhud-where').textContent.includes('B deck'), true);
console.log('deck map tests passed', gameNodes.length, 'nodes', plan.decks.length, 'decks');
