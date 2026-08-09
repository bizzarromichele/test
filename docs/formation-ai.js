/* Beta 2 formation engine + 250-credit squad optimizer */
let fModule='4-3-3', fSlots={}, fSelected=null, fHydrated=false, aiProposal=null;

const F_LAYOUTS={
'4-3-3':[['P',50,90],['D',16,72],['D',38,70],['D',62,70],['D',84,72],['C',25,47],['C',50,42],['C',75,47],['A',20,20],['A',50,14],['A',80,20]],
'3-4-3':[['P',50,90],['D',22,70],['D',50,67],['D',78,70],['C',15,47],['C',38,42],['C',62,42],['C',85,47],['A',20,20],['A',50,14],['A',80,20]],
'3-5-2':[['P',50,90],['D',22,70],['D',50,67],['D',78,70],['C',12,47],['C',32,42],['C',50,37],['C',68,42],['C',88,47],['A',35,18],['A',65,18]],
'4-4-2':[['P',50,90],['D',16,72],['D',38,70],['D',62,70],['D',84,72],['C',15,45],['C',38,41],['C',62,41],['C',85,45],['A',35,18],['A',65,18]],
'5-3-2':[['P',50,90],['D',10,70],['D',30,68],['D',50,66],['D',70,68],['D',90,70],['C',25,43],['C',50,38],['C',75,43],['A',35,18],['A',65,18]],
'4-5-1':[['P',50,90],['D',16,72],['D',38,70],['D',62,70],['D',84,72],['C',10,47],['C',30,42],['C',50,37],['C',70,42],['C',90,47],['A',50,17]],
'5-4-1':[['P',50,90],['D',10,70],['D',30,68],['D',50,66],['D',70,68],['D',90,70],['C',15,43],['C',38,39],['C',62,39],['C',85,43],['A',50,17]]
};

function fEsc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function fRating(p){return Number(p.rating||0);}
function fBonus(p){return Number(p.bonus_probability||0);}
function fPlayerValue(p){return fRating(p)+fBonus(p)*28;}
function fXIValue(p){const mult={P:8,D:15,C:34,A:48}[p.role]||20;return fRating(p)+fBonus(p)*mult;}

function hydrateFormation(){
 if(fHydrated)return;
 const f=Array.isArray(state.formations)&&state.formations[0]?state.formations[0]:null;
 if(f){fModule=F_LAYOUTS[f.module]?f.module:'4-3-3';fSlots=f.slots&&typeof f.slots==='object'?f.slots:{};}
 const sel=document.getElementById('module');if(sel)sel.value=fModule;
 fHydrated=true;
}

const oldPage=page;
page=function(btn,id){
 ['market','roster','formation','analysis'].forEach(x=>{const el=document.getElementById(x);if(el)el.classList.add('hidden')});
 const target=document.getElementById(id);if(target)target.classList.remove('hidden');
 document.querySelectorAll('#nav button').forEach(x=>x.classList.remove('active'));if(btn)btn.classList.add('active');
 if(id==='roster')renderRoster();
 if(id==='formation'){hydrateFormation();renderFormation();}
 if(id==='analysis')renderAnalysis();
};

function setModule(m){fModule=F_LAYOUTS[m]?m:'4-3-3';fSlots={};fSelected=null;renderFormation();}
function clearLineup(){fSlots={};fSelected=null;renderFormation();}
function selectFormationPlayer(id){fSelected=Number(id);renderFormation();}
function placeFormationPlayer(slotIndex,role){
 hydrateFormation();
 if(!fSelected){delete fSlots[slotIndex];renderFormation();return;}
 const p=state.roster.find(x=>Number(x.id)===Number(fSelected));
 if(!p||p.role!==role){alert('In questo slot serve un giocatore di ruolo '+role+'.');return;}
 Object.keys(fSlots).forEach(k=>{if(Number(fSlots[k])===Number(fSelected))delete fSlots[k];});
 fSlots[slotIndex]=Number(fSelected);fSelected=null;renderFormation();
}
function sortedRole(role){return state.roster.filter(p=>p.role===role).slice().sort((a,b)=>fXIValue(b)-fXIValue(a));}
function fillBestXIForModule(mod){
 const layout=F_LAYOUTS[mod], byRole={P:sortedRole('P'),D:sortedRole('D'),C:sortedRole('C'),A:sortedRole('A')}, used={P:0,D:0,C:0,A:0}, out={};
 layout.forEach((s,i)=>{const p=byRole[s[0]][used[s[0]]++];if(p)out[i]=Number(p.id);});return out;
}
function autoLineup(){hydrateFormation();fSlots=fillBestXIForModule(fModule);fSelected=null;renderFormation();}
async function saveFormation(showMsg=false){
 hydrateFormation();state.formations=[{name:'Principale',module:fModule,slots:fSlots}];await save();if(showMsg)alert('Formazione salvata ✅');
}
function renderFormation(){
 hydrateFormation();const pitch=document.getElementById('pitch'),bench=document.getElementById('bench');if(!pitch||!bench)return;
 const layout=F_LAYOUTS[fModule]||F_LAYOUTS['4-3-3'];
 pitch.innerHTML=layout.map((s,i)=>{const p=state.roster.find(x=>Number(x.id)===Number(fSlots[i]));return `<div class="slot" style="left:${s[1]}%;top:${s[2]}%" onclick="placeFormationPlayer(${i},'${s[0]}')">${p?`<div class="token">${fEsc(p.name)}<br><span class="team">${fEsc(p.team)}</span></div>`:`<div class="empty">${s[0]}</div>`}</div>`}).join('');
 const used=new Set(Object.values(fSlots).map(Number));
 bench.innerHTML=state.roster.filter(p=>!used.has(Number(p.id))).map(p=>`<button class="${Number(fSelected)===Number(p.id)?'selected':''}" onclick="selectFormationPlayer(${p.id})"><b>${fEsc(p.name)}</b><br><span class="team">${p.role} • ${fEsc(p.team)} • ${p.price}</span></button>`).join('')||'<span class="muted">Aggiungi giocatori alla rosa per comporre la formazione.</span>';
}

function roleDP(role,need){
 const arr=players.filter(p=>p.role===role), dp=Array.from({length:need+1},()=>Array(251).fill(null));
 dp[0][0]={score:0,ids:[]};
 for(const p of arr){const cost=Number(p.price),value=fPlayerValue(p);if(!Number.isFinite(cost)||cost<0||cost>250)continue;
  for(let c=need-1;c>=0;c--)for(let b=250-cost;b>=0;b--){const cur=dp[c][b];if(!cur)continue;const nb=b+cost,ns=cur.score+value,old=dp[c+1][nb];if(!old||ns>old.score)dp[c+1][nb]={score:ns,ids:cur.ids.concat(Number(p.id))};}
 }
 return dp[need];
}
function optimizeExact250(){
 const needs={P:3,D:8,C:8,A:6}, maps=['P','D','C','A'].map(r=>roleDP(r,needs[r]));
 let combo=Array(251).fill(null);combo[0]={score:0,ids:[]};
 for(const rm of maps){const next=Array(251).fill(null);for(let a=0;a<=250;a++){const ca=combo[a];if(!ca)continue;for(let b=0;b+a<=250;b++){const rb=rm[b];if(!rb)continue;const total=a+b,sc=ca.score+rb.score;if(!next[total]||sc>next[total].score)next[total]={score:sc,ids:ca.ids.concat(rb.ids)};}}combo=next;}
 const best=combo[250];if(!best)return null;const roster=best.ids.map(id=>players.find(p=>Number(p.id)===Number(id))).filter(Boolean);return roster.length===25?roster:null;
}
function moduleCounts(mod){const c={P:0,D:0,C:0,A:0};F_LAYOUTS[mod].forEach(s=>c[s[0]]++);return c;}
function chooseBestModule(roster){
 let best=null;
 for(const mod of Object.keys(F_LAYOUTS)){const c=moduleCounts(mod);let score=0,possible=true;for(const r of ['P','D','C','A']){const a=roster.filter(p=>p.role===r).sort((x,y)=>fXIValue(y)-fXIValue(x));if(a.length<c[r]){possible=false;break;}score+=a.slice(0,c[r]).reduce((s,p)=>s+fXIValue(p),0);}if(!possible)continue;
  if(c.D>=4)score+=10;else score-=10; // strategic weight for the league's defence modifier
  if(c.A===3)score+=3;
  if(!best||score>best.score)best={module:mod,score,counts:c};
 }
 return best;
}
function proposalReason(roster,choice){
 const spend={P:0,D:0,C:0,A:0};roster.forEach(p=>spend[p.role]+=Number(p.price));
 const avg=Math.round(roster.reduce((s,p)=>s+fRating(p),0)/roster.length), top=roster.slice().sort((a,b)=>fPlayerValue(b)-fPlayerValue(a)).slice(0,3);
 const mod=choice.module,c=choice.counts;
 let why=`Il ${mod} è il modulo che, con questa rosa, porta in campo il valore stimato più alto.`;
 if(c.D>=4)why+=` Usa ${c.D} difensori e quindi mantiene accessibile il modificatore difesa.`;else why+=` In questa simulazione il maggior potenziale offensivo compensa la rinuncia al modificatore difesa.`;
 why+=` Schiera ${c.C} centrocampisti e ${c.A} attaccanti scegliendo automaticamente i migliori Rating/Bonus β disponibili.`;
 return {spend,avg,top,why};
}
function makeProposal(){
 if(!Array.isArray(players)||players.length<25){alert('Il listone non è ancora caricato. Accedi e riprova.');return;}
 const roster=optimizeExact250();if(!roster){alert('Con il listone attuale non trovo una combinazione valida esattamente da 250 crediti.');return;}
 const choice=chooseBestModule(roster),reason=proposalReason(roster,choice);aiProposal={roster,choice,reason};showProposalModal();
}
function groupedRosterHtml(roster){return ['P','D','C','A'].map(r=>{const a=roster.filter(p=>p.role===r).sort((x,y)=>Number(y.price)-Number(x.price));return `<div style="margin-top:12px"><b style="color:#55e4aa">${r}</b><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:6px">${a.map(p=>`<div style="background:#0b1a24;border:1px solid #1c3a4b;border-radius:10px;padding:7px"><b>${fEsc(p.name)}</b><br><span style="font-size:11px;color:#93a9b8">${fEsc(p.team)} • ${p.price} cr</span></div>`).join('')}</div></div>`}).join('');}
function showProposalModal(){
 const p=aiProposal;if(!p)return;document.getElementById('aiModal')?.remove();const {roster,choice,reason}=p;
 const top=reason.top.map(x=>`${fEsc(x.name)} (${x.price})`).join(', ');
 const ov=document.createElement('div');ov.id='aiModal';ov.style.cssText='position:fixed;inset:0;z-index:9998;background:#041018ee;display:flex;align-items:center;justify-content:center;padding:12px';
 ov.innerHTML=`<div style="width:min(720px,100%);max-height:92vh;overflow:auto;background:#0d1e2a;border:1px solid #2a5267;border-radius:24px;padding:18px;color:#fff;box-shadow:0 25px 80px #000a"><div style="font-size:11px;font-weight:900;letter-spacing:.12em;color:#55e4aa">ROSA AI • PROPOSTA</div><div style="display:flex;justify-content:space-between;gap:10px;align-items:end"><div><h2 style="margin:6px 0">250 / 250 crediti</h2><div style="color:#93a9b8">25 giocatori • 3P + 8D + 8C + 6A</div></div><div style="font-size:28px;font-weight:950;color:#ffd166">${choice.module}</div></div><div style="margin-top:14px;background:#102735;border-radius:15px;padding:12px"><b>Perché questa rosa</b><p style="margin:7px 0;color:#cbdde6">Massimizza il punteggio combinato Rating + Bonus β rispettando ruoli e budget esatto. Rating medio rosa: <b>${reason.avg}</b>. Punti di forza: <b>${top}</b>.</p><div style="font-size:12px;color:#93a9b8">Spesa: P ${reason.spend.P} • D ${reason.spend.D} • C ${reason.spend.C} • A ${reason.spend.A}</div></div><div style="margin-top:10px;background:#102735;border-radius:15px;padding:12px"><b>Perché ${choice.module}</b><p style="margin:7px 0;color:#cbdde6">${reason.why}</p></div>${groupedRosterHtml(roster)}<div style="display:flex;gap:8px;margin-top:16px;position:sticky;bottom:0;background:#0d1e2a;padding-top:10px"><button onclick="closeProposalModal()" style="flex:1;padding:12px;border-radius:12px;border:1px solid #315063;background:#102735;color:#fff">Annulla</button><button onclick="applyAIProposal()" style="flex:2;padding:12px;border-radius:12px;border:0;background:#55e4aa;color:#052116;font-weight:950">Usa questa rosa</button></div><div style="font-size:11px;color:#78919f;margin-top:8px">Le percentuali β sono stime orientative, non garanzie di risultato.</div></div>`;document.body.appendChild(ov);
}
function closeProposalModal(){document.getElementById('aiModal')?.remove();}
async function applyAIProposal(){
 if(!aiProposal)return;state.roster=aiProposal.roster.slice();fModule=aiProposal.choice.module;fSlots=fillBestXIForModule(fModule);fSelected=null;fHydrated=true;state.formations=[{name:'AI 250',module:fModule,slots:fSlots}];await save();renderAll();const sel=document.getElementById('module');if(sel)sel.value=fModule;renderFormation();closeProposalModal();alert('Rosa AI applicata e salvata ✅ 250/250 crediti • '+fModule);
}
function injectAIControls(){
 if(document.getElementById('aiSquadBtn'))return;const market=document.getElementById('market');if(!market)return;
 const box=document.createElement('div');box.style.cssText='margin:12px 0;background:linear-gradient(135deg,#133246,#0e4338);border:1px solid #2b6b61;border-radius:17px;padding:12px';
 box.innerHTML='<div style="font-size:11px;font-weight:900;letter-spacing:.1em;color:#8affd4">FANTA AI</div><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:5px"><div><b>Generatore rosa 250/250</b><div style="font-size:12px;color:#a9bdc8">Crea 25 giocatori, sceglie il modulo e ti spiega il perché.</div></div><button id="aiSquadBtn" onclick="makeProposal()" style="border:0;border-radius:12px;padding:11px 12px;background:#55e4aa;color:#052116;font-weight:950;white-space:nowrap">✨ Crea Rosa AI</button></div>';
 const search=document.getElementById('search');market.insertBefore(box,search||market.firstChild);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectAIControls);else injectAIControls();
