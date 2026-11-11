import {JSDOM} from 'jsdom';
import fs from 'fs';
import crypto from 'crypto';
import vm from 'vm';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('./hindenburg-worker.html', import.meta.url), 'utf8');
const plan = JSON.parse(fs.readFileSync(new URL('./deck-plans/plans.json', import.meta.url), 'utf8'));
plan.nodes = {};
for (const ring of plan.rings) {
  for (const face of ring.faces) {
    plan.nodes[face.id] = {place: ring.place, heading: face.heading, at: ring.at, stand: ring.stand, forward: face.forward || null};
  }
}
function standOf(id) { return plan.nodes[id].stand; }
assert.equal(crypto.createHash('sha256').update(html).digest('hex').length, 64);
assert.equal(html.split('https://hindenburg-ai.secretlabcoat-0ba.workers.dev').length - 1, 1);
for (const name of ['washroom_stall', 'washroom_basins', 'washroom_door', 'washroom_wall']) {
  const raw = fs.readFileSync(new URL('./bathroom-harmonized/' + name + '.webp', import.meta.url));
  assert.ok(html.includes(raw.toString('base64').slice(0, 80)), name + ' harmonized art');
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
assert.equal(w.eval('nodes.washroom_door.forward'), 'b_north_s');
assert.equal(standOf(w.eval('nodes.washroom_door.forward')), 'b-north');

w.eval("document.querySelector('#startgame').click()");
assert.equal(w.eval('view'), 'washroom_stall');
assert.equal(w.document.querySelector('#deckhud').hidden, false);
assert.equal(w.document.querySelector('[data-player]').getAttribute('data-marker'), 'arrow');
assert.ok(w.document.querySelector('[data-player] line'), 'facing marker has a shaft');
assert.ok(w.document.querySelector('[data-player] polygon'), 'facing marker has an arrowhead');
assert.equal(w.document.querySelector('#navleft').textContent, '←');
assert.equal(w.document.querySelector('#navforward').textContent, '↑');
assert.equal(w.document.querySelector('#navright').textContent, '→');
assert.equal(w.document.querySelector('[data-player]').getAttribute('data-node'), 'washroom_stall');
assert.equal(w.document.querySelector('[data-player]').getAttribute('data-heading'), '0');
assert.equal(w.document.querySelector('#deckpop').hidden, true);
const before = w.eval('view');
w.document.querySelector('#deckhud-open').click();
assert.equal(w.document.querySelector('#deckpop').hidden, false);
assert.equal(w.document.querySelectorAll('#deckhud svg').length, 1);
assert.equal(w.document.querySelectorAll('#deckhud-full svg').length, 1);
assert.equal(w.document.querySelector('#deckhud-full [data-player]').getAttribute('data-node'), 'washroom_stall');
w.document.querySelector('#deckhud-deck').value = 'A';
w.document.querySelector('#deckhud-deck').dispatchEvent(new w.Event('change'));
assert.equal(w.eval('view'), before);
assert.equal(w.document.querySelector('#deckhud-full [data-player]'), null);
w.document.querySelector('#deckpop-close').click();
assert.equal(w.document.querySelector('#deckpop').hidden, true);
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
w.eval("view='washroom_door';draw()");
const door = w.document.querySelector('#scene [data-move="b_north_s"]');
assert.ok(door, 'washroom door hotspot');
assert.equal(door.getAttribute('aria-label'), 'Enter B-Deck Corridor');
assert.equal(door.querySelector('.exit-label').textContent, 'Enter B-Deck Corridor');
assert.equal(door.style.cursor, 'pointer');
door.click();
await new Promise(r => setTimeout(r, 250));
assert.equal(w.eval('view'), 'b_north_s');
assert.equal(standOf(w.eval('view')), 'b-north');
w.eval("view='washroom_door';draw()");
w.document.querySelector('#deckhud-open').click();
const mapDoor = w.document.querySelector('#deckhud-full [data-link="bcorridor-washroom"]');
assert.ok(mapDoor, 'popup door for current exit');
assert.equal(mapDoor.getAttribute('role'), 'button');
const distant = w.document.querySelector('#deckhud-full [data-link="lounge-promenade"]');
assert.equal(distant, null);
const otherDeck = w.document.querySelector('#deckhud-deck');
otherDeck.value = 'A';
otherDeck.dispatchEvent(new w.Event('change'));
const farDoor = w.document.querySelector('#deckhud-full [data-link="lounge-promenade"]');
assert.ok(farDoor, 'other deck still draws its doors');
assert.equal(farDoor.onclick, null);
const stayed = w.eval('view');
if (farDoor.onclick) farDoor.onclick();
assert.equal(w.eval('view'), stayed);
otherDeck.value = 'B';
otherDeck.dispatchEvent(new w.Event('change'));
w.document.querySelector('#deckhud-full [data-link="bcorridor-washroom"]').onclick();
await new Promise(r => setTimeout(r, 250));
assert.equal(w.eval('view'), 'b_north_s');
assert.equal(w.document.querySelector('#deckpop').hidden, true);
w.eval('ai["Bunny Treemont"].toured = true');
w.eval("view='crew_door';draw()");
const tourHot = w.document.querySelector('#scene [data-gated="tour"]');
assert.ok(tourHot, 'gated tour hotspot');
tourHot.click();
assert.equal(w.eval('view'), 'crew_door');
assert.ok(w.document.querySelector('#log').textContent.includes('not gathering'));
w.eval("view='tour_cells';draw()");
const climbHot = w.document.querySelector('#scene [data-gated="climb"]');
assert.ok(climbHot, 'gated ladder hotspot');
climbHot.click();
assert.equal(w.eval('view'), 'tour_cells');
assert.ok(w.document.querySelector('#log').textContent.includes('upper rings'));
w.eval("view='bdeck_washroom';draw()");
assert.equal(w.document.querySelector('#deckhud-where').textContent.includes('Washroom') || w.document.querySelector('#deckhud-where').textContent.includes('corridor') || w.document.querySelector('#deckhud-where').textContent.length > 0, true);
let missingHot = [];
const audit = [];
for (const id of gameNodes) {
  w.eval('view=' + JSON.stringify(id) + ';draw()');
  const row = {id, exits: []};
  for (const dir of ['forward', 'left', 'right']) {
    const dest = w.eval('nodes[' + JSON.stringify(id) + '].' + dir);
    if (!dest) continue;
    const same = placeOf(id) === placeOf(dest);
    if (dir !== 'forward') {
      if (!same || standOf(id) !== standOf(dest)) missingHot.push(id + ' turn leaves ' + dir);
      continue;
    }
    const hot = w.document.querySelector('#scene [data-move="' + dest + '"]');
    const label = hot && hot.getAttribute('aria-label');
    const hover = hot && hot.querySelector('.exit-label') && hot.querySelector('.exit-label').textContent;
    const good = label && (label.startsWith('Enter ') || label === 'Continue forward');
    if (!hot || hot.style.cursor !== 'pointer' || !good || hover !== label) {
      missingHot.push(id + ' ' + dir + ' -> ' + dest + ' ' + label);
    }
    row.exits.push(dir + ' → ' + dest + ' [' + (label || 'MISSING') + ']');
  }
  if (id === 'crew_door' || id === 'tour_cells' || id === 'keel_back') {
    const kind = id === 'crew_door' ? 'tour' : 'climb';
    const gated = w.document.querySelector('#scene [data-gated="' + kind + '"]');
    if (!gated || gated.style.cursor !== 'pointer') missingHot.push(id + ' gated ' + kind);
    row.exits.push('gated ' + kind + ' [' + (gated ? gated.getAttribute('aria-label') : 'MISSING') + ']');
  }
  audit.push(row);
}
assert.deepEqual(missingHot, []);
console.log('EXIT AUDIT');
for (const row of audit) console.log(row.id + ' | ' + (row.exits.join('; ') || '(no exit on this facing; turns stay in the room)'));
const ctx = {};
vm.runInNewContext(fs.readFileSync(new URL('./deck-map.js', import.meta.url), 'utf8') + '\nthis.svg=hindenburgDeckSvg;', ctx);
const svgs = {};
for (const deck of plan.decks) svgs[deck.id] = ctx.svg(plan, deck.id, null);
function linesOf(svg) { return [...svg.matchAll(/<line data-link="([^"]+)"/g)].map(m => m[1]); }
for (const stub of plan.stubs) {
  assert.ok(linesOf(svgs[stub.deck]).includes(stub.link), 'stub not drawn ' + stub.label);
  assert.ok(svgs[stub.deck].includes('data-arrow="shaft"'), 'stair arrow is a drawn shaft ' + stub.deck);
  assert.ok(!/[▲▼◀▶⬆⬇➤➔]/.test(svgs[stub.deck]), 'no decorative arrow glyphs ' + stub.deck);
}
for (const id of gameNodes) {
  for (const dir of ['forward', 'left', 'right']) {
    const dest = w.eval('nodes[' + JSON.stringify(id) + '].' + dir);
    if (!dest || placeOf(id) === placeOf(dest)) continue;
    const link = plan.links.find(l => (l.a === placeOf(id) && l.b === placeOf(dest)) || (l.b === placeOf(id) && l.a === placeOf(dest)));
    assert.ok(link, 'exit without link ' + id + ' ' + dir);
    const deck = plan.places[placeOf(id)].deck;
    assert.ok(linesOf(svgs[deck]).includes(link.id), 'exit without line ' + id + ' ' + dir);
  }
}
for (const [id, place] of Object.entries(plan.places)) {
  const deck = place.deck;
  const attached = plan.links.some(l => (l.a === id || l.b === id) && linesOf(svgs[deck]).includes(l.id))
    || plan.stubs.some(s => s.from === id && s.deck === deck && linesOf(svgs[deck]).includes(s.link));
  assert.ok(attached, 'floating room ' + id);
}
const info = Object.fromEntries(gameNodes.map(id => [id, w.eval('({left:nodes[' + JSON.stringify(id) + '].left,right:nodes[' + JSON.stringify(id) + '].right,forward:nodes[' + JSON.stringify(id) + '].forward,name:nodes[' + JSON.stringify(id) + '].name,facing:nodes[' + JSON.stringify(id) + '].facing})')]));
const seen = new Set(['washroom_stall']);
const via = {washroom_stall: 'start'};
const queue = ['washroom_stall'];
while (queue.length) {
  const id = queue.shift();
  for (const dir of ['left', 'right', 'forward']) {
    const dest = info[id][dir];
    if (dest && info[dest] && !seen.has(dest)) { seen.add(dest); via[dest] = id + ' · ' + dir; queue.push(dest); }
  }
}
const free = [...seen];
if (!seen.has('tour_shoes')) { seen.add('tour_shoes'); via.tour_shoes = 'crew_door · escorted tour (gated)'; queue.push('tour_shoes'); }
if (!seen.has('girder_nook')) { seen.add('girder_nook'); via.girder_nook = 'keel_back or tour_cells · climb after the glimmer (gated)'; queue.push('girder_nook'); }
while (queue.length) {
  const id = queue.shift();
  for (const dir of ['left', 'right', 'forward']) {
    const dest = info[id][dir];
    if (dest && info[dest] && !seen.has(dest)) { seen.add(dest); via[dest] = id + ' · ' + dir; queue.push(dest); }
  }
}
const unreachable = gameNodes.filter(id => !seen.has(id));
assert.deepEqual(unreachable, []);
const turnBugs = [];
for (const id of gameNodes) {
  let cursor = id;
  for (let step = 0; step < 4; step++) {
    const nxt = info[cursor].right;
    if (!nxt || !info[nxt]) { turnBugs.push(id + ' right broken at ' + cursor); break; }
    if (standOf(nxt) !== standOf(id) || placeOf(nxt) !== placeOf(id)) turnBugs.push(id + ' right leaves stand');
    cursor = nxt;
  }
  if (cursor !== id) turnBugs.push(id + ' 4 rights -> ' + cursor);
  const dest = info[id].forward;
  if (!dest || id === 'girder_nook') continue;
  const backHeading = (plan.nodes[dest].heading + 180) % 360;
  const back = gameNodes.find(v => standOf(v) === standOf(dest) && plan.nodes[v].heading === backHeading);
  const ret = back && info[back].forward;
  if (!ret || standOf(ret) !== standOf(id)) turnBugs.push(id + ' reverse forward -> ' + ret);
}
assert.deepEqual(turnBugs, []);
function segHits(x1, y1, x2, y2, r) {
  const left = r.x + 0.8, right = r.x + r.w - 0.8, top = r.y + 0.8, bot = r.y + r.h - 0.8;
  if (Math.abs(y1 - y2) < 0.3) {
    const y = y1, xlo = Math.min(x1, x2), xhi = Math.max(x1, x2);
    if (y <= top || y >= bot) return false;
    return xhi > left && xlo < right;
  }
  if (Math.abs(x1 - x2) > 0.3) return true;
  const x = x1, ylo = Math.min(y1, y2), yhi = Math.max(y1, y2);
  if (x <= left || x >= right) return false;
  return yhi > top && ylo < bot;
}
const orthoBugs = [];
for (const deck of plan.decks) {
  const svg = svgs[deck.id];
  const rooms = Object.entries(plan.places).filter(([, p]) => p.deck === deck.id).map(([id, p]) => ({id, ...p}));
  const boxes = rooms.concat(plan.stubs.filter(s => s.deck === deck.id).map(s => ({id: 'stub:' + s.link, ...s})));
  for (const m of svg.matchAll(/<line data-link="([^"]+)" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)) {
    const [, link, xs1, ys1, xs2, ys2] = m;
    const x1 = +xs1, y1 = +ys1, x2 = +xs2, y2 = +ys2;
    if (Math.abs(x1 - x2) > 0.3 && Math.abs(y1 - y2) > 0.3) orthoBugs.push(link + ' diagonal');
    const linkDef = plan.links.find(l => l.id === link);
    const allowed = new Set();
    if (linkDef) {
      if (plan.places[linkDef.a].deck === deck.id) allowed.add(linkDef.a);
      if (plan.places[linkDef.b].deck === deck.id) allowed.add(linkDef.b);
    }
    for (const s of plan.stubs) if (s.link === link && s.deck === deck.id) allowed.add('stub:' + s.link);
    for (const box of boxes) {
      if (allowed.has(box.id)) continue;
      if (segHits(x1, y1, x2, y2, box)) orthoBugs.push(link + ' crosses ' + box.id);
    }
  }
}
assert.deepEqual(orthoBugs, []);
assert.equal(w.document.querySelector('#talk'), null);
assert.equal(w.document.querySelector('#examine'), null);
assert.equal(w.document.querySelector('#take'), null);
assert.equal(w.document.querySelector('#use'), null);
assert.equal(w.document.querySelector('#back'), null);
assert.ok(w.document.querySelector('.arrowcol #navleft'));
assert.ok(w.document.querySelector('.arrowcol #navforward'));
assert.ok(w.document.querySelector('.arrowcol #navright'));
assert.ok(html.includes("'cabin_door':'cabin_door'") || html.includes('"cabin_door":"cabin_door"'));
assert.ok(html.includes('tour_shoes'));
assert.ok(html.includes('bdeck_corr_office'));
assert.ok(html.includes('bdeck_corr_stairs'));
console.log('REACH');
for (const id of gameNodes.sort()) console.log(id + ' | ' + info[id].name + ' | ' + info[id].facing + ' | ' + via[id] + (free.includes(id) ? '' : ' | GATED'));
console.log('deck map tests passed', gameNodes.length, 'nodes', plan.decks.length, 'decks');
