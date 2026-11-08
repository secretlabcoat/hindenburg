
const gameItems=[{name:'Notebook',icon:'📓',desc:'A notebook. A few empty pages are waiting for your invented life.'},{name:'Key',icon:'🗝️',desc:'An unmarked brass key. Which lock does it fit?'},{name:'Scrap of paper',icon:'📜',desc:'A torn scrap bearing the words “Lakehurst — May 6”.'}];
function addItem(name,icon,desc='An object you picked up aboard the airship.'){if(!gameItems.some(i=>i.name===name))gameItems.push({name,icon,desc});renderInventory()}
function inspectItem(item){selected=item.name;$('#itemnote').textContent=item.desc;$('#inventoryInfo').textContent=item.desc;narrate(item.desc)}
function renderInventory(){
 const bar=$('#inv');bar.replaceChildren();
 const labelFor=item=>item.name==='Scrap of paper'?'Paper / scrap':item.name;
 const make=item=>{const b=document.createElement('button');b.type='button';b.className='item';b.title=item.name;b.setAttribute('aria-label',item.name);const icon=document.createElement('span');icon.textContent=item.icon;icon.setAttribute('aria-hidden','true');const cap=document.createElement('span');cap.className='item-caption';cap.textContent=labelFor(item);b.append(icon,cap);b.onclick=()=>inspectItem(item);return b};
 gameItems.slice(0,3).forEach(item=>bar.append(make(item)));
 const more=document.createElement('button');more.type='button';more.className='item moreitem';more.textContent='Inventory menu';more.title='Open full inventory';more.setAttribute('aria-label','Open inventory menu');more.onclick=()=>openInventory();bar.append(more);
 const grid=$('#inventoryGrid');grid.replaceChildren();gameItems.forEach(item=>grid.append(make(item)));
}
function openInventory(){renderInventory();$('#inventoryModal').classList.add('open')}
$('#closeInventory').onclick=()=>$('#inventoryModal').classList.remove('open');$('#inventoryModal').onclick=e=>{if(e.target.id==='inventoryModal')$('#inventoryModal').classList.remove('open')};document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#inventoryModal').classList.remove('open')});
const viewport=window.visualViewport;function fitKeyboard(){const viewportHeight=viewport?viewport.height:window.innerHeight;const keyboardVisible=window.innerHeight-viewportHeight>130;document.body.classList.toggle('keyboard-open',keyboardVisible);if(keyboardVisible){document.querySelector('.shell').style.height=Math.max(270,viewportHeight)+'px';document.querySelector('.shell').style.minHeight='0'}else{document.querySelector('.shell').style.height='';document.querySelector('.shell').style.minHeight='100dvh'}}
if(viewport){viewport.addEventListener('resize',fitKeyboard);viewport.addEventListener('scroll',fitKeyboard)}
$('#say').addEventListener('focus',()=>{setTimeout(()=>{$('#say').scrollIntoView({block:'nearest',behavior:'smooth'});fitKeyboard()},250)});$('#say').addEventListener('blur',()=>setTimeout(fitKeyboard,150));
// Avoid opening the keyboard just because a character was tapped: user chooses when to speak.
const oldChoose=choose;choose=function(n){oldChoose(n);$('#say').blur()};
renderInventory();fitKeyboard();
