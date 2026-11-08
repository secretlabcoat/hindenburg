
/* Start hidden in the B-deck washroom (the real ship's washrooms, toilets and only shower were on B deck) */
Object.assign(nodes,{
 washroom_stall:{name:'B-Deck Washroom',facing:'the shower stall · your hiding place',left:'washroom_basins',right:'washroom_door',forward:null,style:'washshower'},
 washroom_basins:{name:'B-Deck Washroom',facing:'wash basins and mirror',left:'washroom_door',right:'washroom_stall',forward:null,style:'washbasin'},
 washroom_door:{name:'B-Deck Washroom',facing:'door to the B-deck corridor',left:'washroom_stall',right:'washroom_basins',forward:'bdeck_washroom',style:'washdoor'},
 bdeck_washroom:{name:'B-Deck Corridor',facing:'washroom door',left:'office_desk',right:'bdeck_stairs',forward:'washroom_door',style:'door'}})
nodes.bdeck_stairs.left='bdeck_washroom';nodes.office_desk.right='bdeck_washroom'
nodes.bdeck_stairs.name='B-Deck Corridor';nodes.crew_door.name='B-Deck Corridor'
// A-deck cabins belong to paying passengers; the stowaway has none. The old start room is now an unused cabin.
;['cabin_bunk','cabin_window','cabin_door','cabin_desk'].forEach(k=>nodes[k].name='Empty Cabin (A deck)');nodes.cabin_bunk.facing='a made-up bunk nobody is using'
XROOM.washshower=()=>'<div class="wash-wall"></div><div class="wash-floor"></div><div class="wash-rail"></div><div class="wash-head"></div><div class="wash-curtain" data-wash="shower" title="Shower curtain"></div>'
XROOM.washbasin=()=>'<div class="wash-wall"></div><div class="wash-floor"></div><div class="wash-mirror" data-wash="mirror" title="Mirror"></div><div class="wash-basin a"></div><div class="wash-basin b"></div>'
XROOM.washdoor=()=>'<div class="wash-wall"></div><div class="wash-floor"></div><div class="wash-door" data-move="bdeck_washroom" title="Step out into the corridor"><div class="wash-door-tag">EXIT TO CORRIDOR ↑</div></div>'
const WASH_TEXT={shower:'The only shower aboard any airship, and the one place nobody looks twice at a closed curtain. You have been hiding behind it since Frankfurt.',
 mirror:'Your reflection looks like someone who has not slept in three days. No ticket, no cabin, no name on the manifest. Just what you know about tonight.'}
const _draw10=draw
draw=function(){_draw10();scene.querySelectorAll('[data-wash]').forEach(el=>el.onclick=()=>{AudioFX.uiClick();AudioFX.curtainSlide();narrate(WASH_TEXT[el.dataset.wash]);});
 if(!who){
  const hasP=CAST_AT[view]&&CAST_AT[view].length>0;
  if(view.startsWith('washroom_')){
   $('#speaker').textContent=view==='washroom_door'?'Facing the door. Press ↑ or tap the door to step into the corridor.':'Use ← or → to turn around and find the door.';
  }else if(!hasP){
   $('#speaker').textContent=nodes[view]&&nodes[view].forward?'Explore using ← → to turn or ↑ to move forward.':'Turn with ← → to explore this area.';
  }else{
   $('#speaker').textContent='Select a passenger to speak with them.';
  }
 }
 const fwd=$('#navforward');
 if(fwd)fwd.classList.toggle('pulse',!fwd.disabled&&(view==='washroom_door'||view.startsWith('washroom_')));
}
