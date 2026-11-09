/* Deck plans for the permanent game. Geometry is a schematic of the
   walkable nodes, not a measured airship. Bow is up. */
function hindenburgDeckSvg(plan, deckId, marker) {
  const places = Object.entries(plan.places).filter(([, p]) => p.deck === deckId);
  const deck = plan.decks.find(d => d.id === deckId);
  const w = plan.width, h = plan.height;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const center = p => [p.x + p.w / 2, p.y + p.h / 2];
  let body = '';
  const onDeck = id => plan.places[id] && plan.places[id].deck === deckId;
  for (const link of plan.links) {
    if (onDeck(link.a) && onDeck(link.b)) {
      const [x1, y1] = center(plan.places[link.a]);
      const [x2, y2] = center(plan.places[link.b]);
      const dash = link.kind === 'gated' ? ' stroke-dasharray="5 4"' : '';
      body += '<line data-link="' + link.id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="#243044" stroke-width="' + (link.kind === 'stairs' ? 6 : 3) + '"' + dash + '/>';
    } else if (onDeck(link.a) || onDeck(link.b)) {
      const id = onDeck(link.a) ? link.a : link.b;
      const p = plan.places[id];
      const x = p.x + p.w - 8, y = p.y + 8;
      body += '<g data-link="' + link.id + '" data-transfer="1"><rect x="' + (x - 28) + '" y="' + y + '" width="36" height="22" fill="#f3d48a" stroke="#243044" stroke-width="2"/>' +
        '<path d="M' + (x - 24) + ' ' + (y + 16) + ' h28 M' + (x - 22) + ' ' + (y + 11) + ' h24 M' + (x - 20) + ' ' + (y + 6) + ' h20" stroke="#243044" stroke-width="1.4" fill="none"/>' +
        '<title>' + esc(link.label) + '</title></g>';
    }
  }
  for (const [id, p] of places) {
    const fill = p.label.indexOf('corridor') >= 0 || p.label.indexOf('walkway') >= 0 ? '#e7d2c4' : '#c48b93';
    body += '<g data-place="' + id + '"><rect x="' + p.x + '" y="' + p.y + '" width="' + p.w + '" height="' + p.h + '" rx="2" fill="' + fill + '" stroke="#243044" stroke-width="4"/>' +
      '<text x="' + (p.x + p.w / 2) + '" y="' + (p.y + p.h / 2) + '" text-anchor="middle" fill="#1c2430" font-family="Georgia, serif" font-size="13">' + esc(p.label) + '</text></g>';
  }
  for (const stub of plan.stubs || []) {
    if (stub.deck !== deckId) continue;
    body += '<g data-link="' + stub.link + '" data-transfer="1"><rect x="' + stub.x + '" y="' + stub.y + '" width="' + stub.w + '" height="' + stub.h + '" fill="#f3d48a" stroke="#243044" stroke-width="3"/>' +
      '<text x="' + (stub.x + stub.w / 2) + '" y="' + (stub.y + stub.h / 2 + 4) + '" text-anchor="middle" fill="#1c2430" font-family="Georgia, serif" font-size="11">' + esc(stub.label) + '</text></g>';
  }
  if (marker && plan.places[marker.place] && plan.places[marker.place].deck === deckId) {
    const node = plan.nodes[marker.node] || {};
    const p = plan.places[marker.place];
    const x = node.at ? node.at[0] : p.x + p.w / 2;
    const y = node.at ? node.at[1] : p.y + p.h / 2;
    const heading = node.heading || 0;
    body += '<g data-player="1" data-node="' + esc(marker.node) + '" data-heading="' + heading + '" transform="translate(' + x + ' ' + y + ')">' +
      '<circle r="11" fill="#f4c430" stroke="#1c2430" stroke-width="2"/>' +
      '<polygon points="0,-16 -7,6 7,6" fill="#1d3557" transform="rotate(' + heading + ')"/>' +
      '</g>';
  }
  const title = deck ? deck.name : deckId;
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(title) + ' game schematic, bow up">' +
    '<rect width="' + w + '" height="' + h + '" fill="#d6e6f5"/>' +
    '<text x="16" y="18" fill="#1c2430" font-family="Georgia, serif" font-size="14" font-weight="700">' + esc(title) + '</text>' +
    '<text x="16" y="' + (h - 28) + '" fill="#1c2430" font-family="Georgia, serif" font-size="11">Game schematic · not a measured blueprint</text>' +
    '<text x="16" y="' + (h - 12) + '" fill="#1c2430" font-family="Georgia, serif" font-size="11">Bow ↑   Port ←   Starboard →   door —   stairs = ladder   dashed = gated</text>' +
    body + '</svg>';
}

function hindenburgMountDeckHud(plan) {
  if (document.getElementById('deckhud')) return;
  const hud = document.createElement('section');
  hud.id = 'deckhud';
  hud.hidden = true;
  hud.innerHTML = '<div class="deckhud-bar"><button type="button" id="deckhud-toggle" aria-expanded="false" aria-controls="deckhud-large">Deck plan</button><span id="deckhud-where"></span></div>' +
    '<div id="deckhud-compact" class="deckhud-compact"></div>' +
    '<div id="deckhud-large" class="deckhud-large" hidden><label>Deck <select id="deckhud-deck"></select></label><p id="deckhud-facing"></p><div id="deckhud-full"></div></div>';
  document.querySelector('.top').after(hud);
  const select = hud.querySelector('#deckhud-deck');
  for (const deck of plan.decks) {
    const o = document.createElement('option');
    o.value = deck.id;
    o.textContent = deck.name;
    select.append(o);
  }
  let enlarged = false;
  let chosen = null;
  function placeOf(nodeId) {
    const n = plan.nodes[nodeId];
    return n ? plan.places[n.place] : null;
  }
  function exitText() {
    const n = nodes[view];
    if (!n || !n.forward || !nodes[n.forward]) return 'Forward: no door on this facing.';
    const there = nodes[n.forward];
    const same = plan.nodes[n.forward] && plan.nodes[view] && plan.nodes[n.forward].place === plan.nodes[view].place;
    if (same) return 'Forward: farther along ' + placeOf(view).label + '.';
    return 'Forward: ' + there.name + ' · ' + there.facing + '.';
  }
  function paintHud() {
    const started = document.querySelector('#titleoverlay') && document.querySelector('#titleoverlay').hidden;
    hud.hidden = !started;
    if (!started || !plan.nodes[view]) return;
    const meta = plan.nodes[view];
    const place = plan.places[meta.place];
    if (!chosen) chosen = place.deck;
    if (!enlarged) chosen = place.deck;
    select.value = chosen;
    hud.querySelector('#deckhud-where').textContent = plan.decks.find(d => d.id === place.deck).name + ' · ' + place.label;
    const marker = {node: view, place: meta.place};
    hud.querySelector('#deckhud-compact').innerHTML = hindenburgDeckSvg(plan, place.deck, marker);
    hud.querySelector('#deckhud-full').innerHTML = hindenburgDeckSvg(plan, chosen, chosen === place.deck ? marker : null);
    const here = chosen === place.deck ? 'You are here. ' : 'You are on ' + plan.decks.find(d => d.id === place.deck).name + '. ';
    hud.querySelector('#deckhud-facing').textContent = here + 'Facing: ' + nodes[view].facing + '. ' + exitText();
  }
  hud.querySelector('#deckhud-toggle').onclick = () => {
    enlarged = !enlarged;
    hud.querySelector('#deckhud-large').hidden = !enlarged;
    hud.querySelector('#deckhud-toggle').setAttribute('aria-expanded', String(enlarged));
    hud.querySelector('#deckhud-toggle').textContent = enlarged ? 'Close plan' : 'Deck plan';
    paintHud();
  };
  select.onchange = () => { chosen = select.value; paintHud(); };
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && enlarged) hud.querySelector('#deckhud-toggle').click();
  });
  const prevDraw = draw;
  draw = function () {
    const result = prevDraw.apply(this, arguments);
    paintHud();
    return result;
  };
  paintHud();
}
