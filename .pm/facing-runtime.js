// Generated node table above; this renderer deliberately never reuses another facing's photograph.
(function applyPhysicalFacings(){
  Object.keys(nodes).forEach(k=>delete nodes[k]);
  Object.assign(nodes,ROTATION_NODES);
  // Keep movement controls inside the full-height HUD rather than below the clipped shell.
  scene.after(document.querySelector('.navdock'));
  const resolve=v=>ROTATION_ALIASES[v]||v;
  const oldRestore=restore;
  restore=function(d){return oldRestore({...d,view:nodes[resolve(d.view)]?resolve(d.view):'washroom_stall'})};
  const oldTravel=travel;
  travel=function(dest){const id=resolve(dest);if(nodes[id])return oldTravel(id)};
  // The old climb patch wrote an exit onto the Watcher wall. The ladder wall owns that exit.
  ACTS.climb=function(){
    window.nookReturn=view;
    nodes.girder_nook_down.forward=view;
    view='girder_nook';steps++;draw();saveGame();
  };
  const oldDraw=draw;
  draw=function(){
    oldDraw();
    nodes.girder_nook.forward=null;
    nodes.girder_nook_down.forward=nodes[resolve(window.nookReturn)]?resolve(window.nookReturn):'keel_back';
    $('#navforward').disabled=!nodes[view].forward;
  };
  const MAP={washwall:'washbasin',people_side:'people',lounge_aft:'door',promenade_side:'promenade',promenade_far:'promenade',promenade_aft:'door',corridor_forward:'corridor',corridor_end:'corridor',corridor_left:'door',corridor_right:'door',bar_counter:'bar',bar_booths:'bar',bar_windows:'bar',bar_door:'door',office_desk:'office',office_cabinet:'office',office_porthole:'office',office_door:'door',bdeck_corr_washdoor:'door',bdeck_corr_stairs:'door',bdeck_corr_office:'door',bdeck_corr_cabins:'door',bdeck_stairs_door:'door',bdeck_stairs_up:'door',bdeck_stairs_bar:'door',bdeck_stairs_wall:'door',bdeck_cabins_door:'door',bdeck_cabins_crew:'door',bdeck_cabins_back:'door',bdeck_cabins_wall:'door',crew_door_in:'crewdoor11',crew_door_hall:'door',crew_door_sign:'door',crew_door_pipes:'door',adcabin_bunks:'adcabin',adcabin_door:'adcabin',adcabin_curtain:'adcabin',adcabin_wardrobe:'adcabin',keel_forward:'keel',keel_back:'keel',keel_up:'keel',control_helm:'control',control_ladder:'door',control_port:'control',control_starboard:'control',nook_watch:'nook',nook_down:'nook',nook_left:'nook',nook_right:'nook',tour1_l:'tour1',tour1_r:'tour1',tour1_back:'tour1',tour2_l:'tour2',tour2_r:'tour2',tour2_back:'tour2',tour3_l:'tour3',tour3_r:'tour3',tour3_back:'tour3',tour4_l:'tour4',tour4_r:'tour4',tour4_back:'tour4'};
  const keepInteractions=new Set(['washroom_stall','washroom_basins','cabin_bunk','cabin_window','cabin_desk','adeck_cabin','keel_hatch','keel_walk','keel_back','girder_nook','tour_cells','tour_end','crew_door_in','corridor_forward']);
  const oldScenery=scenery;
  const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  scenery=function(v){
    const n=nodes[v];if(!n)return '';
    const stash=n.style;n.style=MAP[stash]||stash;
    let legacy;
    try{legacy=oldScenery(v)}finally{n.style=stash}
    const container=document.createElement('div');container.innerHTML=legacy;
    let interactions='';
    const selector=keepInteractions.has(v)?'[data-person],[data-object],[data-wash],[data-act],[data-x11],.notehot':'[data-person]';
    const selected=keepInteractions.has(v)?Array.from(container.querySelectorAll(selector)):[];
    for(const el of selected){
      if(selected.some(other=>other!==el&&other.contains(el)))continue;
      el.classList.add('facing-interaction');
      interactions+=el.outerHTML;
    }
    if(!keepInteractions.has(v))interactions=castHTML(v);
    if(v==='crew_door_sign')interactions+='<div class="facing-interaction facing-notice-hot" data-x11="notice" title="Read crew notice"></div>';
    // Retain the steward note on the original corridor facing (old scenery selects style corridor).
    const kit=/^(keel_|tour_|girder_|crew_)/.test(v)?'metal':v.startsWith('washroom')?'tile':'wood';
    const axis=n.framing==='hall-axis';
    const feature=n.fallback;
    let prop='<div class="facing-feature prop-'+esc(feature)+'" aria-hidden="true"><i></i><b></b><em></em></div>';
    if(n.forward && !axis && !['door','stairs','ladder'].includes(feature))prop+='<div class="facing-feature prop-door prop-exitdoor" aria-hidden="true"></div>';
    let exit='';
    if(n.forward){
      exit='<div class="facing-exit" data-move="'+esc(n.forward)+'" role="button" tabindex="0" title="'+esc(n.facing)+'"><span>↑ '+esc(n.facing)+'</span></div>';
    }
    const floor=axis?'<div class="facing-axis-left"></div><div class="facing-axis-right"></div><div class="facing-axis-floor"></div>':'<div class="facing-flat-floor"></div>';
    return '<div class="paint facing-scene kit-'+kit+' frame-'+n.framing+' feature-'+feature+(n.forward?' has-exit':'')+'" data-facing="'+v+'" data-art-status="'+n.artStatus+'"><div class="facing-bulkhead"></div>'+floor+'<div class="facing-sconce"></div>'+prop+exit+interactions+'</div><div class="placard">'+esc(n.name)+'</div><div class="hint">'+esc(n.facing)+(n.artStatus==='placeholder'?' · drawn preview':'')+'</div>';
  };
  // Keyboard parity with the existing touch/click exit and action handlers.
  const bindDraw=draw;
  draw=function(){bindDraw();scene.querySelectorAll('.facing-exit').forEach(el=>el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();travel(el.dataset.move)}})};
})();
