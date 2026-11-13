/* Deck plans for the permanent game. Geometry is a schematic of the
   walkable nodes, not a measured airship. Bow is up. */
function hindenburgDeckSvg(plan, deckId, marker) {
  const places = Object.entries(plan.places).filter(([, p]) => p.deck === deckId);
  const deck = plan.decks.find(d => d.id === deckId);
  const w = plan.width, h = plan.height;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let shapes = '';
  let gaps = '';
  let lines = '';
  let labels = '';
  const onDeck = id => plan.places[id] && plan.places[id].deck === deckId;
  const span = (a0, a1, b0, b1) => Math.min(a1, b1) - Math.max(a0, b0);
  const doorSegment = (a, b) => {
    const tries = [[a, b], [b, a]];
    for (let t = 0; t < tries.length; t++) {
      const p = tries[t][0], q = tries[t][1];
      const pr = p.x + p.w, pb = p.y + p.h, qr = q.x + q.w, qb = q.y + q.h;
      if (Math.abs(pr - q.x) <= 0.8 && span(p.y, pb, q.y, qb) >= 14) {
        const y = (Math.max(p.y, q.y) + Math.min(pb, qb)) / 2;
        return [pr - 10, y, pr + 10, y];
      }
      if (Math.abs(pb - q.y) <= 0.8 && span(p.x, pr, q.x, qr) >= 14) {
        const x = (Math.max(p.x, q.x) + Math.min(pr, qr)) / 2;
        return [x, pb - 10, x, pb + 10];
      }
    }
    return null;
  };
  const addDoor = (id, a, b, kind) => {
    const seg = doorSegment(a, b);
    if (!seg) return;
    const x1 = seg[0], y1 = seg[1], x2 = seg[2], y2 = seg[3];
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const horiz = Math.abs(y1 - y2) < 0.2;
    if (horiz) gaps += '<rect x="' + (mx - 4).toFixed(1) + '" y="' + (my - 16).toFixed(1) + '" width="8" height="32" fill="#d6e6f5"/>';
    else gaps += '<rect x="' + (mx - 16).toFixed(1) + '" y="' + (my - 4).toFixed(1) + '" width="32" height="8" fill="#d6e6f5"/>';
    const dash = kind === 'gated' ? ' stroke-dasharray="4 3"' : '';
    const coords = ' x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"';
    lines += '<line data-link="' + id + '"' + coords + ' stroke="#243044" stroke-width="' + (kind === 'stairs' ? 5 : 4) + '"' + dash + '/>';
  };
  for (const [id, p] of places) {
    const fill = p.label.indexOf('corridor') >= 0 || p.label.indexOf('walkway') >= 0 ? '#e7d2c4' : '#c48b93';
    shapes += '<g data-place="' + id + '"><rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="2" fill="' + fill + '" stroke="#243044" stroke-width="4"/></g>';
    labels += '<text x="' + (p.x + p.w / 2) + '" y="' + (p.y + p.h / 2) + '" text-anchor="middle" fill="#1c2430" font-family="Georgia, serif" font-size="13">' + esc(p.label) + '</text>';
  }
  for (const link of plan.links) {
    if (onDeck(link.a) && onDeck(link.b)) addDoor(link.id, plan.places[link.a], plan.places[link.b], link.kind);
  }
  for (const stub of plan.stubs || []) {
    if (stub.deck !== deckId) continue;
    const box = {x: stub.x, y: stub.y, w: stub.w, h: stub.h};
    const ay = stub.y + stub.h / 2;
    const up = stub.dir === 'up';
    const shaft = up ? '<line x1="0" y1="7" x2="0" y2="-1" stroke="#1d3557" stroke-width="2.5"/>' : '<line x1="0" y1="-7" x2="0" y2="1" stroke="#1d3557" stroke-width="2.5"/>';
    const head = up ? '0,-8 -6,-1 6,-1' : '0,8 -6,1 6,1';
    shapes += '<g data-transfer="1" data-arrow="shaft"><rect x="' + stub.x + '" y="' + stub.y + '" width="' + stub.w + '" height="' + stub.h + '" fill="#f3d48a" stroke="#243044" stroke-width="3"/>' +
      '<g transform="translate(' + (stub.x + 16) + ' ' + ay + ')">' + shaft + '<polygon points="' + head + '" fill="#1d3557"/></g>' +
      '<text x="' + (stub.x + stub.w / 2 + 8) + '" y="' + (ay + 4) + '" text-anchor="middle" fill="#1c2430" font-family="Georgia, serif" font-size="11">' + esc(stub.label) + '</text></g>';
    if (stub.from && onDeck(stub.from)) addDoor(stub.link, plan.places[stub.from], box, (plan.links.find(l => l.id === stub.link) || {}).kind);
  }
  let body = shapes + gaps + lines;
  if (marker && plan.places[marker.place] && plan.places[marker.place].deck === deckId) {
    const node = plan.nodes[marker.node] || {};
    const p = plan.places[marker.place];
    const heading = node.heading || 0;
    let x, y;
    if (node.at) {
      x = node.at[0];
      y = node.at[1];
    } else {
      const rad = heading * Math.PI / 180;
      const reach = Math.min(p.w, p.h) * 0.28;
      x = p.x + p.w / 2 + Math.sin(rad) * reach;
      y = p.y + p.h / 2 - Math.cos(rad) * reach;
    }
    body += '<g data-player="1" data-marker="arrow" data-node="' + esc(marker.node) + '" data-heading="' + heading + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + heading + ')">' +
      '<line x1="0" y1="12" x2="0" y2="-4" stroke="#fff8e8" stroke-width="7" stroke-linecap="butt"/>' +
      '<line x1="0" y1="12" x2="0" y2="-4" stroke="#1d3557" stroke-width="3.5" stroke-linecap="butt"/>' +
      '<polygon points="0,-15 -7,-3 7,-3" fill="#1d3557" stroke="#fff8e8" stroke-width="1.5"/>' +
      '</g>';
  }
  body += labels;
  const title = deck ? deck.name : deckId;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(title) + ' game schematic, bow up">' +
    '<rect width="' + w + '" height="' + h + '" fill="#d6e6f5"/>' +
    '<text x="16" y="18" fill="#1c2430" font-family="Georgia, serif" font-size="14" font-weight="700">' + esc(title) + '</text>' +
    '<text x="16" y="' + (h - 28) + '" fill="#1c2430" font-family="Georgia, serif" font-size="11">Game schematic · not a measured blueprint</text>' +
    '<text x="16" y="' + (h - 12) + '" fill="#1c2430" font-family="Georgia, serif" font-size="11">Bow up · port left · starboard right · gap = door · arrow = stair · dashed = gated</text>' +
    body + '</svg>';
}

function hindenburgApplyFacingRings(plan) {
  if (!plan.rings) return;
  plan.nodes = plan.nodes || {};
  for (const ring of plan.rings) {
    const faces = ring.faces.slice().sort((a, b) => a.heading - b.heading);
    const ids = faces.map(f => f.id);
    faces.forEach((face, i) => {
      if (!nodes[face.id]) {
        nodes[face.id] = {
          name: face.name || ring.name,
          facing: face.facing || 'another wall',
          left: null,
          right: null,
          forward: null,
          style: face.style || 'plain'
        };
      }
      const n = nodes[face.id];
      n.left = ids[(i + 3) % 4];
      n.right = ids[(i + 1) % 4];
      if (face.name) n.name = face.name;
      if (face.facing) n.facing = face.facing;
      if (face.keepForward && window.nookReturn) n.forward = window.nookReturn;
      else n.forward = face.forward || null;
      n.doors = face.doors || [];
      plan.nodes[face.id] = {place: ring.place, heading: face.heading, at: ring.at, stand: ring.stand};
    });
  }
}

function hindenburgPlaceArrows() {
  const verbs = document.querySelector('.verbs');
  if (!verbs || verbs.dataset.arrows === '1') return;
  verbs.dataset.arrows = '1';
  verbs.classList.add('arrowcol');
  verbs.setAttribute('aria-label', 'Turn and move');
  verbs.innerHTML = '';
  ['navleft', 'navforward', 'navright'].forEach(id => {
    const button = document.getElementById(id);
    if (button) verbs.append(button);
  });
  let back = document.getElementById('navback');
  if (!back) {
    back = document.createElement('button');
    back.id = 'navback';
    back.type = 'button';
    back.textContent = '↩';
    back.setAttribute('aria-label', 'Return the way you came');
  }
  verbs.append(back);
  back.onclick = () => hindenburgReturn();
  const label = document.getElementById('viewlabel');
  const dialogue = document.querySelector('.dialogue');
  if (label && dialogue) {
    label.classList.add('viewlabel');
    dialogue.parentElement.insertBefore(label, dialogue);
  }
  const dock = document.querySelector('.navdock');
  if (dock) dock.remove();
}

function hindenburgSceneActions() {
  const paint = document.querySelector('#scene .paint');
  if (!paint) return;
  paint.querySelectorAll('.actbtn').forEach(el => el.remove());
  const photoPeople = {
    lounge_people: {'Damina Vontette': 'photo-damina', 'Snardy Vontette': 'photo-snardy'}
  };
  const inPhoto = photoPeople[view] || {};
  if (view === 'washroom_stall') {
    paint.querySelectorAll('.wash-basin, .wash-door, [data-sink], [data-move]').forEach(el => el.remove());
    let toilet = paint.querySelector('[data-wash="toilet"]');
    if (!toilet) {
      toilet = document.createElement('button');
      toilet.type = 'button';
      toilet.className = 'wash-toilet';
      toilet.dataset.wash = 'toilet';
      toilet.setAttribute('aria-label', 'Toilet');
      paint.append(toilet);
    }
    toilet.onclick = () => hindenburgExamine({title: 'Toilet', icon: '🚽', text: 'A plain white toilet beside the tub. The curtain is the only place to hide.'});
    const shower = paint.querySelector('[data-wash="shower"]');
    if (shower) {
      shower.setAttribute('aria-label', 'Shower');
      shower.classList.add('exit-hot');
      shower.onclick = () => hindenburgExamine({title: 'Shower', icon: '🚿', text: 'The only shower aboard any airship, and the one place nobody looks twice at a closed curtain.'});
    }
  }
  paint.querySelectorAll('[data-person]').forEach(el => {
    const name = el.dataset.person;
    if (inPhoto[name]) el.classList.add('in-photo', inPhoto[name]);
    el.classList.add('exit-hot');
    el.style.cursor = 'pointer';
    el.setAttribute('aria-label', 'Talk to ' + name);
    let caption = el.querySelector(':scope > .exit-label');
    if (!caption) {
      caption = document.createElement('span');
      caption.className = 'exit-label';
      el.append(caption);
    }
    caption.textContent = hindenburgFigureCaption(name);
    el.onclick = () => choose(name);
    hindenburgDressFigure(el, name);
  });
  const figures = [...paint.querySelectorAll('.cast-figure')];
  const stand = ({
    lounge_people: {'Damina Vontette': ['16%', '30%', '12%'], 'Snardy Vontette': ['46%', '22%', '12%']},
    lounge_side: {'Colonel Landry Stoppard': ['14%', '46%', '0'], 'Vaunice Charles': ['50%', '46%', '0']},
    corridor_forward: {'Manard Toxu': ['36%', '48%', '2%']},
    promenade_side: {'Potter McNare': ['60%', '44%', '2%']},
    office_desk: {'Helen Karens': ['20%', '50%', '2%']},
    bar_counter: {'Oreo Malloy': ['20%', '28%', '14%']},
    keel_walk: {'Bunny Treemont': ['40%', '46%', '10%']},
    control_helm: {'Captain Swanson Kyle': ['14%', '36%', '2%'], 'Emilio Estavant': ['56%', '34%', '2%']}
  })[view] || {};
  figures.forEach((el, i) => {
    const spec = stand[el.dataset.person];
    if (spec) {
      el.style.left = spec[0];
      el.style.height = spec[1];
      el.style.bottom = spec[2];
      el.style.width = '24%';
    } else {
      const count = figures.length;
      el.style.left = (count === 1 ? 40 : (i === 0 ? 24 : 58)) + '%';
    }
  });
  hindenburgFitCaptions();
  paint.querySelectorAll('[data-object]').forEach(el => {
    const kind = el.dataset.object || 'object';
    const label = kind === 'trunk' ? 'Trunk' : 'Desk';
    el.style.cursor = 'pointer';
    el.setAttribute('aria-label', label);
    if (!el.querySelector('.exit-label')) {
      const s = document.createElement('span');
      s.className = 'exit-label';
      s.textContent = label;
      el.append(s);
    }
    el.onclick = () => hindenburgExamine({
      title: label,
      icon: kind === 'trunk' ? '🧳' : '🖋️',
      text: kind === 'trunk' ? 'An empty steamer trunk. This cabin is made up for a passenger who is not using it.' : 'The writing desk holds a glass of water and an old timetable. Nothing you can take.'
    });
  });
  const note = paint.querySelector('.notehot');
  if (note) {
    note.style.cursor = 'pointer';
    note.setAttribute('aria-label', 'Steward’s Note');
    if (!note.querySelector('.exit-label')) {
      const s = document.createElement('span');
      s.className = 'exit-label';
      s.textContent = 'Steward’s Note';
      note.append(s);
    }
  }
  const hatch = paint.querySelector('.hatch');
  if (hatch) {
    hatch.style.cursor = 'pointer';
    hatch.setAttribute('aria-label', 'Keel Hatch');
    hatch.onclick = () => {
      const bunny = ai['Bunny Treemont'];
      if (bunny && bunny.route && gamePhase() !== 'approach') ACTS.wait();
      else ACTS.hatch();
    };
  }
  const sinks = {
    washroom_basins: {context: true, label: 'Wash Basins'},
    bar_counter: {context: false, label: 'Bar Counter', npc: 'Oreo Malloy'}
  };
  if (sinks[view] && !paint.querySelector('[data-sink]')) {
    const spec = sinks[view];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'photo-exit exit-hot exit-sink';
    b.dataset.sink = view;
    b.setAttribute('aria-label', spec.label);
    const s = document.createElement('span');
    s.className = 'exit-label';
    s.textContent = hindenburgSink === view ? 'Turn Off' : spec.label;
    b.append(s);
    b.onclick = () => {
      if (hindenburgSink === view) {
        hindenburgStopWater();
        s.textContent = spec.label;
        narrate('You turn the tap off.');
        return;
      }
      hindenburgSink = view;
      hindenburgStartWater();
      s.textContent = 'Turn Off';
      if (spec.context) {
        narrate('You turn on the basin. The stream is thin, more like a siphon than a shower.');
        return;
      }
      narrate('You turn on the tap. Water runs into the bar sink.');
      const npc = ai[spec.npc];
      if (!npc) return;
      const memory = 'the stranger turned on the bar tap and left the water running';
      npc.heard = npc.heard || [];
      if (!npc.heard.includes(memory)) {
        npc.heard.push(memory);
        npc.heard = npc.heard.slice(-8);
      }
      const first = !npc.sinkNoted;
      npc.sinkNoted = true;
      line(spec.npc, first
        ? 'Turn that off. This is a bar, not the washroom.'
        : 'The tap again? Shut it off before someone slips.');
    };
    paint.append(b);
  }
  if (view === 'tour_end' && !paint.querySelector('[data-act="tourend"]')) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'photo-exit exit-hot';
    b.dataset.act = 'tourend';
    b.setAttribute('aria-label', 'Hang Back');
    const s = document.createElement('span');
    s.className = 'exit-label';
    s.textContent = 'Hang Back';
    b.append(s);
    b.onclick = () => ACTS.tourend();
    paint.append(b);
  }
  const scene = document.querySelector('#scene');
  if (scene && scene.dataset.examineBound !== '1') {
    scene.dataset.examineBound = '1';
    scene.addEventListener('click', e => {
      const t = e.target;
      if (!(t.id === 'scene' || t.classList.contains('scene-art') || t.classList.contains('paint') || t.classList.contains('ceiling') || t.classList.contains('perspective-floor'))) return;
      const n = nodes[view];
      if (!n) return;
      if (typeof selected !== 'undefined' && selected) narrate('You consider using the ' + selected + '. There is no obvious use for it here.');
      else narrate('You examine the ' + n.name.toLowerCase() + '. ' + (n.style === 'corridor' ? 'Narrow passages lead toward the passenger cabins.' : 'Every detail seems ordinary, which makes your knowledge of the approaching disaster harder to bear.'));
    });
  }
}

const hindenburgPath = [];
let hindenburgSink = null;
let hindenburgWater = null;

function hindenburgAudio() {
  if (typeof audioOn !== 'undefined' && !audioOn) return null;
  try {
    if ((!audioCtx) && typeof beginAudio === 'function') beginAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx || null;
  } catch (err) {
    return null;
  }
}

function hindenburgDoorSound() {
  const ctx = hindenburgAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.16), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate;
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 32);
  }
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 380;
  const out = master || ctx.destination;
  [0, 0.2].forEach((when, n) => {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = n ? 0.45 : 0.85;
    src.connect(filter).connect(gain).connect(out);
    src.start(now + when);
  });
}

function hindenburgStopWater() {
  hindenburgSink = null;
  if (!hindenburgWater) return;
  try { hindenburgWater.stop(); } catch (err) {}
  hindenburgWater = null;
}

function hindenburgStartWater() {
  if (hindenburgWater) {
    try { hindenburgWater.stop(); } catch (err) {}
    hindenburgWater = null;
  }
  const ctx = hindenburgAudio();
  if (!ctx) return;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 800;
  const gain = ctx.createGain();
  gain.gain.value = 0.2;
  src.connect(filter).connect(gain).connect(master || ctx.destination);
  src.start();
  hindenburgWater = src;
}

function hindenburgInstallTravel(plan) {
  if (travel.hindenburgWrapped) return;
  const orig = travel;
  function wrapped(dest) {
    if (!dest || busy || dest === view) return;
    const fromPlace = plan.nodes[view] && plan.nodes[view].place;
    const toPlace = plan.nodes[dest] && plan.nodes[dest].place;
    if (!wrapped.skipHistory) hindenburgPath.push(view);
    const walkingForward = nodes[view] && (nodes[view].forward === dest || (document.getElementById('navforward') && document.getElementById('navforward').dataset.dest === dest));
    if (fromPlace && toPlace && fromPlace !== toPlace) hindenburgDoorSound();
    else if (walkingForward) hindenburgFootstep();
    if (hindenburgSink && hindenburgSink !== dest) hindenburgStopWater();
    orig(dest);
  }
  wrapped.skipHistory = false;
  wrapped.hindenburgWrapped = true;
  travel = wrapped;
}

function hindenburgReturn() {
  if (typeof busy !== 'undefined' && busy) return;
  if (!hindenburgPath.length) {
    narrate('You have not come through a door yet.');
    return;
  }
  const prev = hindenburgPath.pop();
  travel.skipHistory = true;
  travel(prev);
  travel.skipHistory = false;
}

function hindenburgMountDeckHud(plan) {
  window.hindenburgPlan = plan;
  hindenburgInstallTravel(plan);
  hindenburgApplyFacingRings(plan);
  hindenburgPlaceArrows();
  if (document.getElementById('deckhud')) return;
  const left = document.querySelector('#navleft');
  const forward = document.querySelector('#navforward');
  const right = document.querySelector('#navright');
  if (left) left.textContent = '←';
  if (forward) forward.textContent = '↑';
  if (right) right.textContent = '→';
  const hud = document.createElement('aside');
  hud.id = 'deckhud';
  hud.hidden = true;
  hud.innerHTML = '<button type="button" id="deckhud-collapse" aria-expanded="true">Hide</button>' +
    '<button type="button" id="deckhud-open" class="deckhud-mini" aria-haspopup="dialog" aria-expanded="false" aria-controls="deckpop">' +
    '<span id="deckhud-where"></span><span id="deckhud-mini"></span></button>';
  const pop = document.createElement('div');
  pop.id = 'deckpop';
  pop.hidden = true;
  pop.innerHTML = '<div class="deckpop-card" role="dialog" aria-modal="true" aria-label="Deck plan"><button type="button" id="deckpop-close">Close</button>' +
    '<label>Deck <select id="deckhud-deck"></select></label><p id="deckhud-facing"></p><div id="deckhud-full"></div></div>';
  document.body.append(hud, pop);
  const select = pop.querySelector('#deckhud-deck');
  for (const deck of plan.decks) {
    const o = document.createElement('option');
    o.value = deck.id;
    o.textContent = deck.name;
    select.append(o);
  }
  let phone = false;
  try { phone = window.matchMedia('(max-width: 700px)').matches; } catch (e) { phone = false; }
  let collapsed = phone;
  let open = false;
  let chosen = null;
  function placeId(nodeId) {
    return plan.nodes[nodeId] ? plan.nodes[nodeId].place : null;
  }
  function exitText() {
    const n = nodes[view];
    if (!n || !n.forward || !nodes[n.forward]) return 'Forward: no door on this facing.';
    const there = nodes[n.forward];
    if (placeId(n.forward) === placeId(view)) return 'Forward: farther along ' + plan.places[placeId(view)].label + '.';
    return 'Forward: ' + there.name + '.';
  }
  function currentExits() {
    const here = placeId(view);
    const out = [];
    if (!here || !nodes[view]) return out;
    const dest = nodes[view].forward;
    if (dest && nodes[dest] && plan.nodes[dest] && placeId(dest) !== here) {
      const link = plan.links.find(l => (l.a === here && l.b === placeId(dest)) || (l.b === here && l.a === placeId(dest)));
      if (link) out.push({link: link.id, dest, label: 'Enter ' + nodes[dest].name});
    }
    if (view === 'crew_door') out.push({link: 'bcorridor-tour', dest: null, gated: 'tour', label: 'Join escorted tour'});
    if (view === 'tour_cells') out.push({link: 'tour-cells-nook', dest: null, gated: 'climb', label: 'Climb to the upper rings'});
    if (view === 'keel_back') out.push({link: 'keel-nook', dest: null, gated: 'climb', label: 'Climb to the upper rings'});
    return out;
  }
  function useExit(exit) {
    if (!exit.gated) { travel(exit.dest); return; }
    if (exit.gated === 'tour') {
      const before = view;
      ACTS.tour();
      if (view === before) narrate('The escorted tour is not gathering now. It meets at the crew door in the daytime, before Bunny has already taken a group.');
      return;
    }
    const button = document.querySelector('#scene [data-act="climb"]');
    if (button) { button.click(); return; }
    narrate('The ladder into the upper rings stays hidden until you notice the glimmer.');
  }
  function wirePopupDoors() {
    const exits = currentExits();
    pop.querySelectorAll('[data-link]').forEach(el => {
      const exit = exits.find(x => x.link === el.dataset.link);
      el.style.cursor = exit ? 'pointer' : '';
      if (!exit) { el.onclick = null; return; }
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = exit.label;
      el.append(title);
      const go = () => { open = false; pop.hidden = true; useExit(exit); };
      el.onclick = go;
      el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } };
    });
    pop.querySelectorAll('[data-place]').forEach(el => {
      const place = el.dataset.place;
      const visited = window.hindenburgVisited && window.hindenburgVisited[place];
      const locked = hindenburgPlaceLocked(place);
      const rect = el.querySelector('rect');
      if (!visited || locked) {
        el.style.cursor = '';
        el.onclick = null;
        if (rect) rect.setAttribute('stroke', '#8d7358');
        return;
      }
      el.style.cursor = 'pointer';
      if (rect) { rect.setAttribute('stroke', '#f5d895'); rect.setAttribute('stroke-width', '3'); }
      const tip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      tip.textContent = 'Travel here';
      el.append(tip);
      const goPlace = () => {
        const dest = (window.hindenburgVisitedFace && window.hindenburgVisitedFace[place]) || hindenburgFaceFor(place);
        if (!dest || !nodes[dest]) return;
        open = false;
        pop.hidden = true;
        travel(dest);
      };
      el.onclick = e => { e.stopPropagation(); goPlace(); };
    });
  }
  function exitLabel(dest) {
    if (view === 'washroom_door') return 'Exit to B-deck corridor';
    if (placeId(dest) && placeId(dest) === placeId(view)) return 'Continue forward';
    return 'Enter ' + nodes[dest].name;
  }
  function labelExit(el, dest) {
    const label = exitLabel(dest);
    el.classList.add('exit-hot', 'exit-shown');
    el.style.cursor = 'pointer';
    el.setAttribute('aria-label', label);
    if (el.tabIndex < 0) el.tabIndex = 0;
    if (el.tagName !== 'BUTTON' && !el.getAttribute('role')) el.setAttribute('role', 'button');
    let s = el.querySelector(':scope > .exit-label');
    if (!s) {
      s = document.createElement('span');
      s.className = 'exit-label';
      el.append(s);
    }
    s.textContent = label;
  }
  function addHotspot(dest, label, extraClass) {
    const paint = document.querySelector('#scene .paint') || document.querySelector('#scene');
    if (!paint || !dest) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'photo-exit exit-hot exit-shown ' + (extraClass || 'exit-forward');
    b.dataset.move = dest;
    b.setAttribute('aria-label', label);
    const s = document.createElement('span');
    s.className = 'exit-label';
    s.textContent = label;
    b.append(s);
    b.onclick = () => travel(dest);
    paint.append(b);
  }
  function addGated(kind, label, extraClass) {
    const paint = document.querySelector('#scene .paint');
    if (!paint || paint.querySelector('[data-gated="' + kind + '"]')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'photo-exit exit-hot ' + extraClass;
    b.style.cursor = 'pointer';
    b.dataset.gated = kind;
    b.setAttribute('aria-label', label);
    const s = document.createElement('span');
    s.className = 'exit-label';
    s.textContent = label;
    b.append(s);
    b.onclick = () => useExit({gated: kind, dest: null, label: label});
    paint.append(b);
  }
  function samePlace(dest) {
    return plan.nodes[view] && plan.nodes[dest] && plan.nodes[dest].place === plan.nodes[view].place;
  }
  function ensureExits() {
    const n = nodes[view];
    const paint = document.querySelector('#scene .paint');
    if (!n || !paint) return;
    const dest = n.forward && nodes[n.forward] ? n.forward : '';
    const extras = (n.doors || []).filter(d => d && d.dest && nodes[d.dest] && d.dest !== dest);
    if (!extras.length) {
      paint.querySelectorAll('[data-move]').forEach(el => {
        if (dest && el.dataset.move !== dest) el.dataset.move = dest;
      });
    }
    const forwardSlot = {
      bdeck_stairs_up: 'exit-stairs-up',
      bdeck_stairs_door: 'exit-stairs-door',
      bdeck_corr_office: 'exit-hall'
    };
    if (dest) {
      let el = paint.querySelector('[data-move="' + dest + '"]');
      if (!el) {
        addHotspot(dest, exitLabel(dest), forwardSlot[view] || 'exit-forward');
        el = paint.querySelector('[data-move="' + dest + '"]');
      } else if (forwardSlot[view]) {
        forwardSlot[view].split(' ').forEach(c => el.classList.add(c));
      }
      if (el) labelExit(el, dest);
    }
    extras.forEach(d => {
      if (paint.querySelector('[data-move="' + d.dest + '"]')) return;
      addHotspot(d.dest, d.label || exitLabel(d.dest), d.slot || 'exit-left');
    });
    if (view === 'crew_door') addGated('tour', 'Join escorted tour', 'exit-gated');
    if (view === 'tour_cells' || view === 'keel_back') addGated('climb', 'Climb to the upper rings', 'exit-climb');
  }
  function placePhotoHits() {
    const hits = {
      bdeck_stairs_up: {corridor_right: {x: 0.36, y: 0.02, w: 0.28, h: 0.96}},
      bdeck_stairs_door: {bdeck_stairs: {x: 0.39, y: 0.06, w: 0.25, h: 0.84}},
      bdeck_corr_office: {
        b_crew_n: {x: 0.20, y: 0.08, w: 0.20, h: 0.68},
        b_cab_n: {x: 0.595, y: 0.08, w: 0.20, h: 0.68},
        b_mid_s: {x: 0.42, y: 0.80, w: 0.16, h: 0.14}
      },
      washroom_stall: {
        shower: {x: 0.37, y: 0.14, w: 0.26, h: 0.66},
        toilet: {x: 0.62, y: 0.48, w: 0.11, h: 0.32}
      }
    };
    const spec = hits[view];
    const paint = document.querySelector('#scene .paint');
    if (!spec || !paint) return;
    const boxW = paint.clientWidth;
    const boxH = paint.clientHeight;
    if (!boxW || !boxH) return;
    const scale = Math.max(boxW / 768, boxH / 432);
    const offX = (boxW - 768 * scale) / 2;
    const offY = (boxH - 432 * scale) / 2;
    Object.keys(spec).forEach(key => {
      const el = paint.querySelector('[data-move="' + key + '"], [data-wash="' + key + '"]');
      if (!el) return;
      const r = spec[key];
      el.style.left = (offX + r.x * 768 * scale) + 'px';
      el.style.top = (offY + r.y * 432 * scale) + 'px';
      el.style.width = (r.w * 768 * scale) + 'px';
      el.style.height = (r.h * 432 * scale) + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    });
  }
  function paintHud() {
    hindenburgApplyFacingRings(plan);
    const started = document.querySelector('#titleoverlay') && document.querySelector('#titleoverlay').hidden;
    hud.hidden = !started;
    if (!started || !plan.nodes[view]) return;
    ensureExits();
    hindenburgSceneActions();
    placePhotoHits();
    const meta = plan.nodes[view];
    const place = plan.places[meta.place];
    if (!chosen || !open) chosen = place.deck;
    select.value = chosen;
    hud.classList.toggle('is-collapsed', collapsed);
    hud.querySelector('#deckhud-collapse').setAttribute('aria-expanded', String(!collapsed));
    hud.querySelector('#deckhud-collapse').textContent = collapsed ? 'Map' : 'Hide';
    hud.querySelector('#deckhud-open').hidden = collapsed;
    hud.querySelector('#deckhud-open').setAttribute('aria-expanded', String(open));
    const marker = {node: view, place: meta.place};
    hud.querySelector('#deckhud-where').textContent = plan.places[meta.place].label;
    hud.querySelector('#deckhud-mini').innerHTML = collapsed ? '' : hindenburgDeckSvg(plan, place.deck, marker);
    pop.hidden = !open;
    if (open) {
      pop.querySelector('#deckhud-full').innerHTML = hindenburgDeckSvg(plan, chosen, chosen === place.deck ? marker : null);
      const here = chosen === place.deck ? 'You are here. ' : 'You are on ' + plan.decks.find(d => d.id === place.deck).name + '. ';
      pop.querySelector('#deckhud-facing').textContent = here + 'Facing: ' + nodes[view].facing + '. ' + exitText() + ' Gold rooms can be travelled to.';
      wirePopupDoors();
    }
  }
  function setOpen(next) {
    open = next;
    if (open) collapsed = false;
    paintHud();
  }
  hud.querySelector('#deckhud-collapse').onclick = e => {
    e.stopPropagation();
    collapsed = !collapsed;
    if (collapsed) open = false;
    paintHud();
  };
  hud.querySelector('#deckhud-open').onclick = () => setOpen(!open);
  pop.querySelector('#deckpop-close').onclick = () => setOpen(false);
  pop.addEventListener('click', e => { if (e.target === pop) setOpen(false); });
  select.onchange = () => { chosen = select.value; paintHud(); };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) setOpen(false); });
  window.addEventListener('resize', () => { placePhotoHits(); hindenburgFitCaptions(); });
  const prevDraw = draw;
  draw = function () {
    hindenburgApplyFacingRings(plan);
    const result = prevDraw.apply(this, arguments);
    hindenburgApplyFacingRings(plan);
    const label = document.getElementById('viewlabel');
    if (label && nodes[view]) label.textContent = nodes[view].name + ' · ' + nodes[view].facing;
    hindenburgRememberVisit();
    hindenburgSyncForward();
    paintHud();
    hindenburgExitLine();
    hindenburgSpeakPrompt();
    hindenburgGuideTick();
    return result;
  };
  paintHud();
  if (!window.hindenburgCastHooked) {
    window.hindenburgCastHooked = true;
    let playerLine = '';
    const previousLine = line;
    line = function (name, msg, cls) {
      previousLine(name, msg, cls);
      if (cls === 'you') { playerLine = msg || ''; return; }
      if (hindenburgCastId(name)) hindenburgOpenPortrait(name, hindenburgMood(playerLine, msg || ''));
    };
    const previousChoose = choose;
    choose = function (name) {
      playerLine = '';
      previousChoose(name);
    };
  }
}

const HINDENBURG_CAST = {
  'Manard Toxu': 'steward',
  'Damina Vontette': 'damina',
  'Snardy Vontette': 'snardy',
  'Colonel Landry Stoppard': 'colonel',
  'Vaunice Charles': 'vaunice',
  'Potter McNare': 'potter',
  'Bunny Treemont': 'bunny',
  'Helen Karens': 'helen',
  'Oreo Malloy': 'oreo',
  'Captain Swanson Kyle': 'captain',
  'Emilio Estavant': 'emilio'
};

function hindenburgFaceFor(place) {
  const plan = window.hindenburgPlan;
  if (!plan || !plan.nodes) return '';
  const remembered = window.hindenburgVisitedFace && window.hindenburgVisitedFace[place];
  if (remembered && nodes[remembered]) return remembered;
  return Object.keys(plan.nodes).find(id => plan.nodes[id].place === place && nodes[id]) || '';
}

function hindenburgPlaceLocked(place) {
  const tour = {tour_shoes: 1, tour_cells: 1, tour_tanks: 1, tour_end: 1};
  if (tour[place]) {
    const bunny = typeof ai !== 'undefined' && ai['Bunny Treemont'];
    return !(bunny && bunny.toured);
  }
  if (place === 'nook') return true;
  return false;
}

function hindenburgRememberVisit() {
  const plan = window.hindenburgPlan;
  if (!plan || !plan.nodes || !plan.nodes[view]) return;
  const place = plan.nodes[view].place;
  window.hindenburgVisited = window.hindenburgVisited || {};
  window.hindenburgVisitedFace = window.hindenburgVisitedFace || {};
  window.hindenburgVisited[place] = true;
  window.hindenburgVisitedFace[place] = view;
}

function hindenburgSyncForward() {
  const button = document.getElementById('navforward');
  const n = nodes[view];
  if (!button || !n) return;
  const door = (n.doors || []).find(d => d && d.dest && nodes[d.dest]);
  const dest = n.forward && nodes[n.forward] ? n.forward : (door ? door.dest : '');
  button.disabled = !dest;
  button.dataset.dest = dest || '';
}

function hindenburgExitLine() {
  let line = document.getElementById('exitline');
  const label = document.getElementById('viewlabel');
  if (!line && label && label.parentElement) {
    line = document.createElement('div');
    line.id = 'exitline';
    label.after(line);
  }
  if (!line) return;
  const labels = [...document.querySelectorAll('#scene .exit-shown > .exit-label')].map(el => el.textContent).filter(Boolean);
  const unique = [...new Set(labels)];
  line.textContent = unique.length ? 'Exits: ' + unique.join(', ') : 'No exit this way. Turn to look for one.';
}

function hindenburgSpeakLine() {
  const people = document.querySelectorAll('#scene [data-person]').length;
  return people ? 'Tap someone to talk to them' : 'Nobody here to talk to';
}

function hindenburgSpeakPrompt() {
  const speaker = document.getElementById('speaker');
  if (!speaker || (typeof who !== 'undefined' && who)) return;
  speaker.textContent = hindenburgSpeakLine();
}

function hindenburgGuideTick() {
  let g = window.hindenburgGuide;
  if (!g) g = window.hindenburgGuide = {step: 0, done: false};
  let bar = document.getElementById('guidebar');
  const scene = document.getElementById('scene');
  if (!bar && scene) {
    bar = document.createElement('div');
    bar.id = 'guidebar';
    bar.innerHTML = '<p></p><button type="button" id="guideskip">Skip</button>';
    scene.append(bar);
    bar.querySelector('#guideskip').onclick = () => {
      window.hindenburgGuide = {step: 2, done: true};
      bar.hidden = true;
      if (typeof saveGame === 'function') saveGame();
    };
  }
  document.querySelectorAll('.guide-pulse').forEach(el => el.classList.remove('guide-pulse'));
  if (!bar) return;
  if (g.done) { bar.hidden = true; return; }
  const map = window.hindenburgPlan;
  const place = (map && map.nodes && map.nodes[view]) ? map.nodes[view].place : '';
  if (g.step === 0 && place && place !== 'washroom') g.step = 1;
  else if (g.step === 1 && g.hintPlace && place && place !== g.hintPlace) { g.done = true; g.step = 2; }
  if (g.done) { bar.hidden = true; if (typeof saveGame === 'function') saveGame(); return; }
  bar.hidden = false;
  const text = bar.querySelector('p');
  if (g.step === 0) {
    text.textContent = 'Turn to face the door, then tap it or press ↑ to enter the corridor.';
    if (view === 'washroom_door') {
      const door = document.querySelector('#scene [data-move]');
      const forward = document.getElementById('navforward');
      if (door) door.classList.add('guide-pulse');
      if (forward) forward.classList.add('guide-pulse');
    }
  } else {
    text.textContent = 'The stairs to A deck are along this corridor. The Chief Steward works up there.';
    g.hintPlace = place;
  }
}

function hindenburgExamine(info) {
  let pop = document.getElementById('examinepop');
  if (!pop) {
    pop = document.createElement('div');
    pop.id = 'examinepop';
    pop.hidden = true;
    pop.innerHTML = '<div class="examine-card" role="dialog" aria-modal="true"><div class="exam-icon"></div><strong></strong><p></p><div class="examine-actions"><button type="button" id="examineuse">Use</button><button type="button" id="examineshow">Show</button><button type="button" id="examineclose">Close</button></div></div>';
    document.body.append(pop);
    pop.querySelector('#examineclose').onclick = () => { pop.hidden = true; };
    pop.addEventListener('click', e => { if (e.target === pop) pop.hidden = true; });
  }
  pop.querySelector('.exam-icon').textContent = info.icon || '✦';
  pop.querySelector('strong').textContent = info.title || 'Examine';
  pop.querySelector('p').textContent = info.text || '';
  const use = pop.querySelector('#examineuse');
  const show = pop.querySelector('#examineshow');
  use.hidden = !info.item;
  show.hidden = !(info.item && /key|scrap/i.test(info.item.name));
  use.onclick = () => {
    selected = info.item.name;
    pop.hidden = true;
    narrate('You ready the ' + info.item.name + '.');
  };
  show.onclick = () => {
    pop.hidden = true;
    hindenburgShowItem(info.item);
  };
  pop.hidden = false;
}

function hindenburgShowItem(item) {
  if (!item) return;
  selected = item.name;
  if (!who) {
    narrate('Nobody here to show the ' + item.name + ' to. Tap someone first.');
    return;
  }
  const npc = ai[who];
  if (npc) {
    npc.heard = npc.heard || [];
    const memory = 'shown the ' + item.name + ': ' + item.desc;
    if (!npc.heard.includes(memory)) npc.heard.push(memory);
  }
  line('You', 'I want to show you this. ' + item.name + '. ' + item.desc, 'you');
  narrate(who.split(' ')[0] + ' studies the ' + item.name + '.');
}

function hindenburgFootstep() {
  const ctx = hindenburgAudio();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

function hindenburgFigureCaption(name) {
  if (typeof SHORT !== 'undefined' && SHORT[name]) return SHORT[name];
  const parts = String(name || '').split(' ').filter(Boolean);
  if (parts.length > 2) return parts[0] + ' ' + parts[parts.length - 1];
  return name;
}

function hindenburgFitCaptions() {
  const scene = document.querySelector('#scene');
  if (!scene) return;
  const bound = scene.getBoundingClientRect();
  const pad = 6;
  scene.querySelectorAll('[data-person] > .exit-label').forEach(label => {
    label.style.marginLeft = '0px';
    const rect = label.getBoundingClientRect();
    let shift = 0;
    if (rect.left < bound.left + pad) shift += (bound.left + pad) - rect.left;
    if (rect.right + shift > bound.right - pad) shift -= (rect.right + shift) - (bound.right - pad);
    if (shift) label.style.marginLeft = shift.toFixed(1) + 'px';
  });
}

function hindenburgCastId(name) {
  if (!name || /watcher/i.test(name)) return '';
  return HINDENBURG_CAST[name] || '';
}

function hindenburgDressFigure(el, name) {
  const id = hindenburgCastId(name);
  if (!id) return;
  el.classList.add('cast-figure');
  const pack = (typeof CAST_PACK === 'undefined' ? null : CAST_PACK[id]) || {};
  if (pack.fullbody) {
    let body = el.querySelector('.cast-body');
    if (!body) {
      body = document.createElement('img');
      body.className = 'cast-body';
      body.alt = '';
      el.append(body);
    }
    body.src = pack.fullbody;
    const sil = el.querySelector('.cast-silhouette');
    if (sil) sil.remove();
  } else if (!el.querySelector('.cast-silhouette')) {
    const sil = document.createElement('span');
    sil.className = 'cast-silhouette';
    sil.setAttribute('aria-hidden', 'true');
    const head = document.createElement('i');
    head.className = 'cast-head';
    const coat = document.createElement('i');
    coat.className = 'cast-coat';
    sil.append(head, coat);
    el.append(sil);
  }
}

function hindenburgMood(playerLine, reply) {
  const text = ((playerLine || '') + ' ' + (reply || '')).toLowerCase();
  const words = text.match(/[a-z']+/g) || [];
  const bag = new Set(words);
  const has = (...list) => list.some(word => word.includes(' ') ? text.includes(word) : bag.has(word));
  const scores = [
    ['surprised', 5, has('fire', 'bomb', 'explosion', 'explode', 'hydrogen', 'disaster', 'crash', 'sabotage', 'danger', 'blaze', 'burn', 'burning', 'doom')],
    ['sad', 4, has('sorry', 'grief', 'mourn', 'funeral', 'widow', 'heartbroken', 'tragic', 'tears', 'cried', 'cry', 'sad', 'alone')],
    ['frown', 4, has('liar', 'fool', 'idiot', 'stupid', 'accuse', 'guilt', 'thief', 'spy', 'fraud', 'insult', 'hate', 'coward', 'blame', 'worthless')],
    ['shake', 3, has('no', 'never', 'deny', 'denied', 'refuse', 'refused', 'cannot', "can't", "don't", "won't", 'impossible', 'nonsense', 'untrue')],
    ['nod', 3, has('yes', 'agree', 'agreed', 'indeed', 'exactly', 'correct', 'certainly', 'understood', 'course')],
    ['smile', 3, has('thank', 'thanks', 'joke', 'funny', 'laugh', 'lovely', 'beautiful', 'charming', 'compliment', 'glad', 'wonderful', 'delight', 'amusing', 'kind')]
  ];
  let best = 'idle';
  let bestScore = 0;
  scores.forEach(([mood, weight, hit]) => {
    if (hit && weight > bestScore) { best = mood; bestScore = weight; }
  });
  return best;
}

function hindenburgPlayClip(video, still, pack, mood) {
  const clips = pack.clips || {};
  const showStill = () => {
    try { if (video.pause) video.pause(); } catch (err) { /* jsdom has no media playback */ }
    video.hidden = true;
    video.removeAttribute('src');
    still.hidden = false;
  };
  const play = (src, loop, done) => {
    still.hidden = true;
    video.hidden = false;
    video.loop = !!loop;
    video.onended = done || null;
    video.src = src;
    try {
      const started = video.play && video.play();
      if (started && started.catch) started.catch(showStill);
    } catch (err) { showStill(); }
  };
  const reaction = mood && mood !== 'idle' ? clips[mood] : '';
  if (reaction) {
    play(reaction, false, () => { if (clips.idle) play(clips.idle, true, null); else showStill(); });
    return;
  }
  if ((!mood || mood === 'idle') && clips.idle) { play(clips.idle, true, null); return; }
  showStill();
}

function hindenburgOpenPortrait(name, mood) {
  const id = hindenburgCastId(name);
  const pack = (typeof CAST_PACK === 'undefined' ? null : CAST_PACK[id]) || null;
  const scene = document.getElementById('scene');
  if (!id || !pack || !pack.portrait || !scene) return;
  let stage = document.getElementById('cast-stage');
  if (!stage) {
    stage = document.createElement('div');
    stage.id = 'cast-stage';
    const still = document.createElement('img');
    still.alt = '';
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', '');
    video.playsInline = true;
    stage.append(still, video);
    scene.append(stage);
  }
  stage.hidden = false;
  const still = stage.querySelector('img');
  still.src = pack.portrait;
  hindenburgPlayClip(stage.querySelector('video'), still, pack, mood || 'idle');
}

if (typeof document !== 'undefined') (function hindenburgPlaytest() {
  const log = document.getElementById('log');
  if (log) { log.setAttribute('aria-live', 'polite'); log.setAttribute('role', 'log'); }
  const forward = document.getElementById('navforward');
  if (forward) forward.onclick = () => { if (forward.dataset.dest) travel(forward.dataset.dest); };
  document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement && document.activeElement.tagName)) return;
    if (e.key === 'Enter' && forward && forward.dataset.dest && !forward.disabled) {
      e.preventDefault();
      travel(forward.dataset.dest);
    }
  });
  const form = document.getElementById('form');
  if (form) form.addEventListener('submit', e => {
    if (who) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    narrate(hindenburgSpeakLine());
  }, true);
  if (typeof inspectItem === 'function') {
    const previous = inspectItem;
    inspectItem = function (item) {
      if (item && item.name === 'Notebook') { previous(item); return; }
      hindenburgExamine({title: item.name, icon: item.icon, text: item.desc, item: item});
    };
  }
  if (typeof renderNotebook === 'function') {
    renderNotebook = function () {
      const body = document.getElementById('notebookBody');
      if (!body) return;
      body.innerHTML = '';
      const learned = document.createElement('div');
      learned.className = 'nb-entry';
      const lh = document.createElement('h3');
      lh.textContent = 'What you have learned';
      learned.append(lh);
      const clues = [];
      if (typeof ai !== 'undefined') Object.keys(ai).forEach(n => { if (ai[n].secret) clues.push((typeof SHORT !== 'undefined' && SHORT[n]) || n + ': ' + ai[n].secret); });
      if (typeof contradictions !== 'undefined') contradictions.forEach(c => clues.push(c));
      if (!clues.length) clues.push('Nothing certain yet. Talk to people and keep the notebook.');
      const ul = document.createElement('ul');
      clues.forEach(c => { const li = document.createElement('li'); li.textContent = c; ul.append(li); });
      learned.append(ul);
      body.append(learned);
      const met = typeof ai === 'undefined' ? [] : Object.keys(ai).filter(n => ai[n].met);
      if (!met.length) {
        const empty = document.createElement('p');
        empty.className = 'nb-entry';
        empty.textContent = 'You have not spoken with anyone yet.';
        body.append(empty);
        return;
      }
      met.forEach(n => {
        const s = ai[n];
        const card = document.createElement('div');
        card.className = 'nb-entry';
        const h = document.createElement('h3');
        h.textContent = n;
        card.append(h);
        const meta = document.createElement('div');
        meta.className = 'nb-meta';
        meta.textContent = 'Talked to in ' + (s.metWhere || 'the ship') + '. They ' + (typeof trustWord === 'function' ? trustWord(s.trust) : 'are wary') + '.';
        card.append(meta);
        if (s.claims && s.claims.length) {
          const t = document.createElement('div');
          t.textContent = 'What they believe you said:';
          const list = document.createElement('ul');
          s.claims.forEach(c => { const li = document.createElement('li'); li.textContent = c; list.append(li); });
          card.append(t, list);
        }
        body.append(card);
      });
    };
  }
  if (typeof updateClock === 'function' && typeof clockTime === 'function') {
    const previousClock = updateClock;
    updateClock = function () {
      previousClock();
      const clock = document.getElementById('clock');
      if (!clock) return;
      const total = 18 * 60 + 30 + clockTime() * 10;
      const hour = Math.floor(total / 60);
      const minute = total % 60;
      const shown = ((hour + 11) % 12) + 1;
      clock.textContent = 'May 6 · ' + shown + ':' + String(minute).padStart(2, '0') + (hour >= 12 ? ' pm' : ' am');
    };
  }
  if (typeof saveGame === 'function') {
    const previousSave = saveGame;
    saveGame = function () {
      previousSave();
      try {
        const raw = localStorage.getItem('hindenburg_save_v1');
        if (!raw) return;
        const data = JSON.parse(raw);
        data.guide = window.hindenburgGuide || {step: 0, done: false};
        data.visited = window.hindenburgVisited || {};
        data.visitedFace = window.hindenburgVisitedFace || {};
        localStorage.setItem('hindenburg_save_v1', JSON.stringify(data));
      } catch (err) {}
    };
  }
  if (typeof restore === 'function') {
    const previousRestore = restore;
    restore = function (data) {
      previousRestore(data);
      window.hindenburgGuide = data.guide || {step: 2, done: true};
      window.hindenburgVisited = data.visited || {};
      window.hindenburgVisitedFace = data.visitedFace || {};
    };
  }
  if (typeof newGame === 'function') {
    const previousNew = newGame;
    newGame = function () {
      window.hindenburgGuide = {step: 0, done: false};
      window.hindenburgVisited = {};
      window.hindenburgVisitedFace = {};
      previousNew();
    };
  }
})();
