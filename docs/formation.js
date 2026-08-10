let fantaModule='4-3-3',fantaSlots={},fantaSelected=null;
const fantaLayouts={
'4-3-3':[['P',50,90],['D',15,72],['D',38,69],['D',62,69],['D',85,72],['C',25,47],['C',50,41],['C',75,47],['A',20,20],['A',50,14],['A',80,20]],
'3-4-3':[['P',50,90],['D',22,70],['D',50,66],['D',78,70],['C',14,47],['C',38,42],['C',62,42],['C',86,47],['A',20,20],['A',50,14],['A',80,20]],
'3-5-2':[['P',50,90],['D',22,70],['D',50,66],['D',78,70],['C',10,48],['C',30,42],['C',50,37],['C',70,42],['C',90,48],['A',35,18],['A',65,18]],
'4-4-2':[['P',50,90],['D',15,72],['D',38,69],['D',62,69],['D',85,72],['C',14,46],['C',38,41],['C',62,41],['C',86,46],['A',35,18],['A',65,18]],
'5-3-2':[['P',50,90],['D',9,72],['D',29,68],['D',50,65],['D',71,68],['D',91,72],['C',25,43],['C',50,38],['C',75,43],['A',35,18],['A',65,18]],
'4-5-1':[['P',50,90],['D',15,72],['D',38,69],['D',62,69],['D',85,72],['C',10,48],['C',30,42],['C',50,37],['C',70,42],['C',90,48],['A',50,16]],
'5-4-1':[['P',50,90],['D',9,72],['D',29,68],['D',50,65],['D',71,68],['D',91,72],['C',14,44],['C',38,39],['C',62,39],['C',86,44],['A',50,16]]};
function fEsc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function loadSavedFormation(){if(Array.isArray(state.formations)&&state.formations[0]){fantaModule=state.formations[0].module||'4-3-3';fantaSlots=state.formations[0].slots||{};if(document.getElementById('module'))document.getElementById('module').value=fantaModule}}
function setModule(m){fantaModule=m;fantaSlots={};fantaSelected=null;renderFormation()}
function selectPlayer(id){fantaSelected=+id;renderFormation()}
function putPlayer(i,r){if(!fantaSelected){delete fantaSlots[i];renderFormation();return}let p=state.roster.find(x=>+x.id===+fantaSelected);if(!p||p.role!==r)return alert('In questo slot serve un giocatore di ruolo '+r);for(const k of Object.keys(fantaSlots))if(+fantaSlots[k]===+fantaSelected)delete fantaSlots[k];fantaSlots[i]=fantaSelected;fantaSelected=null;renderFormation()}
function renderFormation(){let pitch=document.getElementById('pitch'),bench=document.getElementById('bench');if(!pitch||!bench)return;loadSavedFormationOnce();let layout=fantaLayouts[fantaModule]||fantaLayouts['4-3-3'];pitch.innerHTML=layout.map((s,i)=>{let p=state.roster.find(x=>+x.id===+fantaSlots[i]);return '<div class="slot" style="left:'+s[1]+'%;top:'+s[2]+'%" onclick="putPlayer('+i+',\''+s[0]+'\')">'+(p?'<div class="token">'+fEsc(p.name)+'<br><span class="team">'+fEsc(p.team)+'</span></div>':'<div class="empty">'+s[0]+'</div>')+'</div>'}).join('');let used=new Set(Object.values(fantaSlots).map(Number));let free=state.roster.filter(p=>!used.has(+p.id));bench.innerHTML=free.length?free.map(p=>'<button class="'+(+fantaSelected===+p.id?'selected':'')+'" onclick="selectPlayer('+p.id+')"><b>'+fEsc(p.name)+'</b><br><span class="team">'+p.role+' • '+fEsc(p.team)+'</span></button>').join(''):'<span class="muted">Aggiungi giocatori alla rosa per comporre la formazione.</span>'}
let loadedFormation=false;function loadSavedFormationOnce(){if(loadedFormation)return;loadedFormation=true;loadSavedFormation()}
function autoLineup(){let layout=fantaLayouts[fantaModule],pool={P:[],D:[],C:[],A:[]};state.roster.forEach(p=>pool[p.role].push(p));for(const r of Object.keys(pool))pool[r].sort((a,b)=>(+b.rating||0)-(+a.rating||0)||(+b.price)-(+a.price));fantaSlots={};let idx={P:0,D:0,C:0,A:0};layout.forEach((s,i)=>{let p=pool[s[0]][idx[s[0]]++];if(p)fantaSlots[i]=p.id});fantaSelected=null;renderFormation()}
function clearLineup(){fantaSlots={};fantaSelected=null;renderFormation()}
async function saveFormation(show=false){state.formations=[{name:'Principale',module:fantaModule,slots:fantaSlots}];await save();if(show)alert('Formazione salvata ✅')}
const originalPage=page;page=function(b,id){originalPage(b,id);if(id==='formation'){loadSavedFormation();renderFormation()}};
(function(){
 if(!document.querySelector('script[data-fanta-ai]')){const s=document.createElement('script');s.src='docs/formation-ai.js?v=110';s.defer=true;s.dataset.fantaAi='1';s.onload=()=>{if(document.querySelector('script[data-fanta-v3]'))return;const v=document.createElement('script');v.src='docs/strategy-v3.js?v=110';v.defer=true;v.dataset.fantaV3='1';document.body.appendChild(v)};document.body.appendChild(s)}
 if(!document.querySelector('script[data-fanta-onboarding]')){const o=document.createElement('script');o.src='docs/onboarding.js?v=110';o.defer=true;o.dataset.fantaOnboarding='1';document.body.appendChild(o)}
 if(!document.querySelector('script[data-fanta-pwa]')){const p=document.createElement('script');p.src='docs/pwa-install.js?v=1102';p.defer=true;p.dataset.fantaPwa='1';document.body.appendChild(p)}
 if(!document.querySelector('script[data-fanta-polish]')){const q=document.createElement('script');q.src='docs/visual-polish.js?v=1101';q.defer=true;q.dataset.fantaPolish='1';document.body.appendChild(q)}
})();