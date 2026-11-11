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
      if (face.keepForward && window.nookReturn) n.forward = window.nookReturn;
      else n.forward = face.forward || null;
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
  paint.querySelectorAll('[data-person]').forEach(el => {
    const name = el.dataset.person;
    el.style.cursor = 'pointer';
    el.setAttribute('aria-label', 'Talk to ' + name);
    if (!el.querySelector('.exit-label')) {
      const s = document.createElement('span');
      s.className = 'exit-label';
      s.textContent = 'Talk to ' + name;
      el.append(s);
    }
    el.onclick = () => choose(name);
  });
  const steward = paint.querySelector('[data-person="Manard Toxu"]');
  if (steward && typeof STEWARD_PORTRAIT === 'string' && !steward.querySelector('.steward-portrait')) {
    const img = document.createElement('img');
    img.className = 'steward-portrait';
    img.alt = '';
    img.src = STEWARD_PORTRAIT;
    steward.append(img);
  }
  paint.querySelectorAll('[data-object]').forEach(el => {
    const kind = el.dataset.object || 'object';
    const label = kind === 'trunk' ? 'Examine the trunk' : 'Examine the desk';
    el.style.cursor = 'pointer';
    el.setAttribute('aria-label', label);
    if (!el.querySelector('.exit-label')) {
      const s = document.createElement('span');
      s.className = 'exit-label';
      s.textContent = label;
      el.append(s);
    }
    el.onclick = () => {
      if (typeof selected !== 'undefined' && selected) narrate('You consider using the ' + selected + ' on the ' + kind + '. There is no obvious use for it here.');
      else if (kind === 'trunk') narrate('An empty steamer trunk. This cabin is made up for a passenger who is not using it.');
      else narrate('The writing desk holds a glass of water and an old timetable. Nothing you can take.');
    };
  });
  const note = paint.querySelector('.notehot');
  if (note) {
    note.style.cursor = 'pointer';
    note.setAttribute('aria-label', 'Take the steward’s note');
    if (!note.querySelector('.exit-label')) {
      const s = document.createElement('span');
      s.className = 'exit-label';
      s.textContent = 'Take the steward’s note';
      note.append(s);
    }
  }
  const hatch = paint.querySelector('.hatch');
  if (hatch) {
    hatch.style.cursor = 'pointer';
    hatch.setAttribute('aria-label', 'The keel hatch');
    hatch.onclick = () => {
      const bunny = ai['Bunny Treemont'];
      if (bunny && bunny.route && gamePhase() !== 'approach') ACTS.wait();
      else ACTS.hatch();
    };
  }
  if (view === 'tour_end' && !paint.querySelector('[data-act="tourend"]')) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'photo-exit exit-hot';
    b.dataset.act = 'tourend';
    b.setAttribute('aria-label', 'Hang back as the group returns');
    const s = document.createElement('span');
    s.className = 'exit-label';
    s.textContent = 'Hang back as the group returns';
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

function hindenburgMountDeckHud(plan) {
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
  }
  function exitLabel(dest) {
    if (placeId(dest) && placeId(dest) === placeId(view)) return 'Continue forward';
    return 'Enter ' + nodes[dest].name;
  }
  function labelExit(el, dest) {
    const label = exitLabel(dest);
    el.classList.add('exit-hot');
    el.style.cursor = 'pointer';
    el.setAttribute('aria-label', label);
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
    b.className = 'photo-exit exit-hot ' + (extraClass || 'exit-forward');
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
    paint.querySelectorAll('[data-move]').forEach(el => {
      if (el.dataset.move !== dest) el.dataset.move = dest;
    });
    if (dest) {
      let el = paint.querySelector('[data-move="' + dest + '"]');
      if (!el) {
        addHotspot(dest, exitLabel(dest), 'exit-forward');
        el = paint.querySelector('[data-move="' + dest + '"]');
      }
      if (el) labelExit(el, dest);
    }
    if (view === 'crew_door') addGated('tour', 'Join escorted tour', 'exit-gated');
    if (view === 'tour_cells' || view === 'keel_back') addGated('climb', 'Climb to the upper rings', 'exit-climb');
  }
  function paintHud() {
    hindenburgApplyFacingRings(plan);
    const started = document.querySelector('#titleoverlay') && document.querySelector('#titleoverlay').hidden;
    hud.hidden = !started;
    if (!started || !plan.nodes[view]) return;
    ensureExits();
    hindenburgSceneActions();
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
      pop.querySelector('#deckhud-facing').textContent = here + 'Facing: ' + nodes[view].facing + '. ' + exitText();
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
  const prevDraw = draw;
  draw = function () {
    hindenburgApplyFacingRings(plan);
    const result = prevDraw.apply(this, arguments);
    hindenburgApplyFacingRings(plan);
    paintHud();
    return result;
  };
  paintHud();
}
