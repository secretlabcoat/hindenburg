
(function(){
  const EYE = 'The Watcher in the Rings';
  if (typeof NPC_IDS !== 'undefined') NPC_IDS[EYE] = 'eye';
  if (typeof ai !== 'undefined') ai[EYE] = ai[EYE] || (typeof blank === 'function' ? blank(35) : {});
  if (typeof SHORT !== 'undefined') SHORT[EYE] = 'The Watcher';
  if (typeof GREET !== 'undefined') GREET[EYE] = '…you came up out of the light, small one. I have been watching your little door since Frankfurt.';
  if (typeof CANNED !== 'undefined') CANNED[EYE] = [
    'A cold draft. The girders hum, and something like a word is lost in it.',
    '…sixteen breaths held above you… one of them is tired…',
    'The glow dims, as if it has looked away. Or looked through you.'
  ];

  const TEXT11 = {
    b6berth: 'Two berths, neatly made up and completely unused. Passenger E. Ellery never boarded in Frankfurt.',
    b6case: 'A small suitcase sits under the lower berth. Freight and bags were stowed away while the berth stayed empty.',
    b6wardrobe: 'A small curtained wardrobe space. Suits and dresses hang behind thin light fabric.',
    b6window: 'A real glass window showing grey sea and sky — a major addition for the nine new B-deck cabins in 1937.',
    b6bell: 'A brass push-button call bell for the steward. You don’t dare press it, because a steward would come.',
    b6desk: 'A small wooden fold-down desk flap, set into thin fabric-covered wall panels.',
    b6basin: 'A compact white plastic washbasin with hot and cold taps. Toilets remain down the hall.',
    adberth: 'A fixed lower berth, 78 by 66 inches. The upper berth folds flush against the fabric wall by day.',
    adbasin: 'A white plastic washbasin tucked into the tiny cabin wall. Space inside A-deck cabins is extremely tight.',
    addesk: 'A small fold-down desk flap. A-deck cabins sit deep inside the hull with no windows.',
    adcloset: 'A narrow closet alcove hidden behind a light fabric curtain.',
    adshoes: 'A pair of leather shoes left outside the door for the steward to polish during the night.'
  };

  function tourOpen(){
    return !window.gameOver && ai[BUNNY] && !ai[BUNNY].toured && clockTime() < 16 && (clockTime() >= 8 || (ai[BUNNY].met && ai[BUNNY].trust >= 50));
  }

  // Update nodes map
  nodes.cabin_bunk = { name: 'Cabin B-6 (B deck)', facing: 'two berths, made up, unused', left: 'cabin_desk', right: 'cabin_window', forward: null, style: 'b6bunk' };
  nodes.cabin_window = { name: 'Cabin B-6 (B deck)', facing: 'a real window — new B-deck cabins have them', left: 'cabin_bunk', right: 'cabin_door', forward: null, style: 'b6window' };
  nodes.cabin_door = { name: 'Cabin B-6 (B deck)', facing: 'door to the B-deck corridor', left: 'cabin_window', right: 'cabin_desk', forward: 'bdeck_cabins', style: 'b6door' };
  nodes.cabin_desk = { name: 'Cabin B-6 (B deck)', facing: 'fold-down desk and washbasin', left: 'cabin_door', right: 'cabin_bunk', forward: null, style: 'b6desk' };

  nodes.bdeck_cabins = { name: 'B-Deck Corridor', facing: 'the new 1937 cabins · B-6', left: 'crew_door', right: 'office_desk', forward: 'cabin_door', style: 'door' };
  if (nodes.crew_door) {
    nodes.crew_door.right = 'bdeck_cabins';
    nodes.crew_door.style = 'crewdoor11';
  }
  if (nodes.office_desk) nodes.office_desk.left = 'bdeck_cabins';

  nodes.adeck_cabin = { name: 'Passenger Cabin (A deck)', facing: 'someone else’s cabin · no window', left: null, right: null, forward: 'corridor_left', style: 'adcabin' };
  if (nodes.corridor_left) {
    nodes.corridor_left.forward = 'adeck_cabin';
    nodes.corridor_left.facing = 'inside cabins · port side';
  }

  nodes.tour_shoes = { name: 'Keel Tour (escorted)', facing: 'felt overshoes and the safety rules', left: null, right: null, forward: 'tour_cells', style: 'tour1' };
  nodes.tour_cells = { name: 'Keel Tour (escorted)', facing: 'looking up into the hull', left: null, right: null, forward: 'tour_tanks', style: 'tour2' };
  nodes.tour_tanks = { name: 'Keel Tour (escorted)', facing: 'fuel and water tanks, crew bunks', left: null, right: null, forward: 'tour_end', style: 'tour3' };
  nodes.tour_end = { name: 'Keel Tour (escorted)', facing: 'the guide turns back · the forward keel', left: null, right: null, forward: 'keel_walk', style: 'tour4' };

  nodes.girder_nook = { name: 'High in the Rings', facing: 'something watching · climb back down', left: null, right: null, forward: 'keel_back', style: 'nook' };

  // XROOM art rendering
  XROOM.b6bunk = function() {
    return '<div class="r11-wall"></div>' +
      '<div class="r11-wardrobe" style="top:10%;left:5%;width:18%;height:75%;" data-x11="b6wardrobe" title="Wardrobe"></div>' +
      '<div class="r11-berth" style="top:25%;left:28%;width:65%;height:18%;" data-x11="b6berth" title="Upper Berth"><div class="r11-sheet" style="inset:3px 3px 3px 20%;"></div><div class="r11-pillow" style="top:5px;left:5px;width:12%;height:60%;"></div></div>' +
      '<div class="r11-berth" style="top:60%;left:28%;width:65%;height:22%;" data-x11="b6berth" title="Lower Berth"><div class="r11-sheet" style="inset:3px 3px 3px 20%;"></div><div class="r11-pillow" style="top:6px;left:6px;width:12%;height:60%;"></div></div>' +
      '<div class="r11-case" style="top:84%;left:35%;width:22%;height:10%;" data-x11="b6case" title="Suitcase"></div>';
  };

  XROOM.b6window = function() {
    return '<div class="r11-wall"></div>' +
      '<div class="r11-window-frame" style="top:20%;left:25%;width:50%;height:45%;" data-x11="b6window" title="Cabin Window"><div class="r11-sea"></div></div>' +
      '<div class="r11-bell" style="top:35%;right:12%;" data-x11="b6bell" title="Call Steward"></div>';
  };

  XROOM.b6door = function() {
    return '<div class="r11-wall"></div>' +
      '<div class="r11-door" style="top:15%;left:30%;width:40%;height:75%;" data-move="bdeck_cabins" title="Exit to B-Deck Corridor">' +
        '<div class="r11-card" style="top:15%;left:30%;width:40%;height:22px;line-height:22px;">B 6</div>' +
      '</div>';
  };

  XROOM.b6desk = function() {
    return '<div class="r11-wall"></div>' +
      '<div class="r11-basin" style="top:30%;left:15%;width:25%;height:22%;" data-x11="b6basin" title="Washbasin"><div class="r11-tap" style="top:-6px;left:6px;"></div><div class="r11-tap" style="top:-6px;right:6px;"></div></div>' +
      '<div class="r11-desk" style="top:55%;left:45%;width:42%;height:28%;" data-x11="b6desk" title="Fold-down Desk"></div>';
  };

  XROOM.adcabin = function() {
    return '<div class="r11-adwall"></div>' +
      '<div class="r11-berth" style="top:62%;left:5%;width:60%;height:22%;" data-x11="adberth" title="Fixed Lower Berth"><div class="r11-sheet" style="inset:3px 3px 3px 20%;"></div></div>' +
      '<div class="r11-berth" style="top:20%;left:5%;width:60%;height:8%;opacity:0.7;" data-x11="adberth" title="Folded Upper Berth"></div>' +
      '<div class="r11-wardrobe" style="top:15%;right:5%;width:22%;height:65%;" data-x11="adcloset" title="Curtained Closet"></div>' +
      '<div class="r11-basin" style="top:35%;left:40%;width:18%;height:16%;" data-x11="adbasin" title="Washbasin"></div>' +
      '<div class="r11-desk" style="top:52%;left:40%;width:20%;height:14%;" data-x11="addesk" title="Desk Flap"></div>' +
      '<div class="r11-bell" style="top:25%;left:30%;" data-x11="b6bell" title="Call Button"></div>' +
      '<div class="r11-door" style="top:10%;left:75%;width:20%;height:80%;" data-move="corridor_left" title="Door to Corridor"></div>' +
      '<div class="r11-shoes" style="top:86%;left:70%;" data-x11="adshoes" title="Shoes for Polishing"></div>';
  };

  XROOM.crewdoor11 = function() {
    const tourBtn = tourOpen() ? '<div class="actbtn" data-act="tour">Join the passengers’ escorted keel tour</div>' : '';
    return '<div class="r11-keelbg"></div>' +
      '<div class="r11-door" style="top:20%;left:35%;width:30%;height:65%;background:#111;border-color:#444;" data-move="keel_walk" title="Crew Door"><div style="color:#aaa;font:11px Georgia;text-align:center;margin-top:10px;">CREW ONLY</div></div>' +
      '<div class="r11-rules" style="top:40%;left:5%;width:22%;" data-x11="notice" title="Notice">Keel tours by arrangement · soft shoes · no flames</div>' + tourBtn;
  };

  XROOM.tour1 = function() {
    return '<div class="r11-keelbg"></div><div class="r11-walkway"></div>' +
      '<div class="r11-bench" style="top:50%;left:15%;width:30%;height:20%;"></div>' +
      '<div class="r11-overshoe" style="top:46%;left:18%;width:10%;height:8%;" title="Felt Overshoes"></div>' +
      '<div class="r11-rules" style="top:25%;right:15%;width:35%;"><strong>SAFETY RULES</strong><br>• No matches<br>• No lighters<br>• Soft shoes only<br>• Stay with guide</div>';
  };

  XROOM.tour2 = function() {
    const flick = '<div class="r11-flicker" style="top:15%;left:48%;" data-x11="flicker" title="High in the girders..."></div>';
    const climbBtn = (ai[EYE] && ai[EYE].noticed) ? '<div class="actbtn" data-act="climb" style="bottom:70px;">Climb the crew ladder (quietly)</div>' : '';
    return '<div class="r11-keelbg"></div>' +
      '<div class="r11-cell" style="top:-10%;left:5%;width:42%;height:55%;"></div>' +
      '<div class="r11-cell" style="top:-10%;right:5%;width:42%;height:55%;"></div>' +
      '<div class="r11-girder" style="top:0;bottom:0;left:20%;width:4px;"></div>' +
      '<div class="r11-girder" style="top:0;bottom:0;right:20%;width:4px;"></div>' +
      '<div class="r11-girder" style="top:30%;left:0;right:0;height:3px;"></div>' +
      '<div class="r11-walkway" style="top:70%;height:30%;"></div>' +
      '<div style="position:absolute;top:75%;left:48%;width:6px;height:14px;background:#e2c9a0;border-radius:3px;" title="Tour Group"></div>' +
      flick + climbBtn;
  };

  XROOM.tour3 = function() {
    return '<div class="r11-keelbg"></div><div class="r11-walkway"></div>' +
      '<div class="r11-tank" style="top:20%;left:10%;width:25%;height:40%;" title="Diesel Fuel Tank"></div>' +
      '<div class="r11-tank" style="top:20%;right:10%;width:25%;height:40%;" title="Water Ballast Tank"></div>' +
      '<div class="r11-tent" style="top:65%;left:10%;width:25%;height:25%;" title="Crew Sleeping Quarters"></div>';
  };

  XROOM.tour4 = function() {
    return '<div class="r11-keelbg"></div><div class="r11-walkway"></div>' +
      '<div style="position:absolute;bottom:20%;left:40%;width:20%;height:20px;border-radius:50%;background:#222;border:1px solid #555;" title="Floor Hatch"></div>' +
      '<div class="actbtn" data-act="tourend">Hang back as the group returns</div>';
  };

  XROOM.nook = function() {
    return '<div class="r11-keelbg"></div>' +
      '<div class="r11-cell" style="top:10%;left:-15%;width:55%;height:80%;"></div>' +
      '<div class="r11-cell" style="top:10%;right:-15%;width:55%;height:80%;"></div>' +
      '<div class="r11-girder" style="top:0;bottom:0;left:40%;width:2px;"></div>' +
      '<div class="r11-girder" style="top:0;bottom:0;right:40%;width:2px;"></div>' +
      '<div class="r11-watcher" data-person="The Watcher in the Rings" role="button" tabindex="0" title="Speak to it"><div class="r11-pupil"></div></div>' +
      '<div class="r11-lbl" style="top:49%;">?</div>';
  };

  const _k = XROOM.keel;
  XROOM.keel = function(v) {
    let base = _k ? _k(v) : '';
    if (v === 'keel_back' && ai[BUNNY] && ai[BUNNY].toured) {
      base += '<div class="r11-flicker" style="top:15%;left:48%;" data-x11="flicker2" title="High in the girders..."></div>';
      if (ai[EYE] && ai[EYE].noticed) {
        base += '<div class="actbtn" data-act="climb" style="bottom:70px;">Climb the crew ladder (quietly)</div>';
      }
    }
    return base;
  };

  // ACTS handlers
  if (typeof ACTS !== 'undefined') {
    ACTS.tour = function() {
      if (!tourOpen()) return;
      narrate('A crew guide gathers a few passengers near the crew door. Nobody checks tickets; you slip into the back of the group.');
      view = 'tour_shoes'; steps++; draw(); saveGame();
    };

    ACTS.tourend = function() {
      if (ai[BUNNY]) {
        ai[BUNNY].toured = true;
        ai[BUNNY].trust = Math.min(100, (ai[BUNNY].trust || 0) + 10);
      }
      window.keelWarned = true;
      narrate('The other passengers file back to B deck. You hang back on the keel walkway; Bunny notices you, but doesn’t shout.');
      view = 'keel_walk'; steps++; draw(); saveGame();
    };

    ACTS.climb = function() {
      window.nookReturn = view;
      if (nodes.girder_nook) nodes.girder_nook.forward = window.nookReturn;
      view = 'girder_nook'; steps++; draw(); saveGame();
    };
  }

  // heardFor wrapping for EYE
  if (typeof heardFor === 'function') {
    const _hf = heardFor;
    heardFor = function(n) {
      if (n === EYE) {
        const res = [];
        for (const m in ai) {
          if (m !== EYE && ai[m] && ai[m].claims) {
            for (let i = ai[m].claims.length - 1; i >= 0; i--) {
              if (res.length < 5) res.push('told ' + m + ': ' + ai[m].claims[i]);
            }
          }
        }
        res.push('known to the Watcher alone (the stranger never said it): the ship will burn at the Lakehurst mooring');
        if (res.length === 1) res.unshift('the stowaway has hidden in the B-deck shower since Frankfurt');
        return res.slice(0, 6);
      }
      const orig = _hf(n) || [];
      return orig.filter(s => typeof s !== 'string' || !s.includes('Watcher'));
    };
  }

  let prevView = null;
  const _draw11 = draw;
  draw = function() {
    _draw11();
    if (window.gameOver) return;

    if (window.nookReturn && nodes.girder_nook) {
      nodes.girder_nook.forward = window.nookReturn;
    }

    if (view === 'keel_walk' && prevView === 'tour_end' && ai[BUNNY] && !ai[BUNNY].toured) {
      ai[BUNNY].toured = true;
      ai[BUNNY].trust = Math.min(100, (ai[BUNNY].trust || 0) + 10);
      window.keelWarned = true;
      narrate('The other passengers file back to B deck. You hang back on the keel walkway; Bunny notices you, but doesn’t shout.');
    }

    if (tourOpen() && ai[BUNNY] && !ai[BUNNY].tourAnnounced) {
      ai[BUNNY].tourAnnounced = true;
      narrate('A steward passes through, ringing a little hand bell: “The evening keel tour gathers at the B-deck crew door. Soft shoes, please, and no matches.”');
    }

    window.r11Seen = window.r11Seen || new Set();
    if (!window.r11Seen.has(view)) {
      if (view === 'tour_shoes') {
        window.r11Seen.add('tour_shoes');
        narrate('You put on soft felt overshoes for the narrow walkway. Passengers handed over all matches and lighters at boarding.');
      } else if (view === 'tour_cells') {
        window.r11Seen.add('tour_cells');
        narrate('High overhead, 16 gas cells hold seven million cubic feet of hydrogen inside duralumin rings. Only crew in spark-proof suits climb up top.');
      } else if (view === 'tour_tanks') {
        window.r11Seen.add('tour_tanks');
        narrate('Diesel and water-ballast tanks sit along the catwalk beside freight rooms and the crew’s tent quarters.');
      } else if (view === 'tour_end') {
        window.r11Seen.add('tour_end');
        narrate('Bunny points out landing-rope gear near a hatch — “that’s where the ropes go down at Lakehurst” — then turns the group back.');
      } else if (view === 'girder_nook') {
        window.r11Seen.add('girder_nook');
        if (ai[EYE] && !ai[EYE].nookVisited) {
          ai[EYE].nookVisited = true;
          narrate('You climb until the catwalk lamps are pinpricks below. The gas cells breathe around you like sleeping animals. Here, where no passenger is ever allowed, the dark is looking back.');
          narrate('It does not speak the way people do. Ask it what you like, but do not expect plain answers.');
        }
      }
    }

    const sc = document.querySelector('.scene');
    if (sc) {
      sc.querySelectorAll('[data-x11]').forEach(el => {
        el.addEventListener('click', e => {
          e.stopPropagation();
          const k = el.getAttribute('data-x11');
          if (k === 'flicker' || k === 'flicker2') {
            if (ai[EYE]) ai[EYE].noticed = true;
            narrate('A cold draft touches your neck. High in the rings, something glimmers — and the guide, mid-sentence about gas cells, does not see it. A rubber-shod crew ladder leads up between two cells.');
            draw();
          } else if (k === 'notice') {
            if (clockTime() >= 16 && ai[BUNNY] && !ai[BUNNY].toured) {
              narrate('A typed card: Tours suspended for landing.');
            } else {
              narrate('A typed card: keel tours are given in the evening, by arrangement with the crew.');
            }
          } else if (TEXT11[k]) {
            narrate(TEXT11[k]);
          }
        });
      });
    }

    prevView = view;
  };
})();
