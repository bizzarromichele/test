/* Beta 3: three squad philosophies, bench-aware recommendations and pitch ambience */
let v3Proposal=null;
const V3_STYLES={
 balanced:{key:'balanced',icon:'⚖️',title:'Equilibrata',tag:'Solidità + bonus',desc:'Distribuisce il budget su tutti i reparti, cerca titolari forti e una panchina realmente utilizzabile.'},
 bonus:{key:'bonus',icon:'🔥',title:'Bonus / Top',tag:'Massimizza i bonus',desc:'Spinge più crediti su centrocampisti e attaccanti ad alto potenziale, accettando più rischio negli altri reparti.'},
 modifier:{key:'modifier',icon:'🛡️',title:'Modificatore',tag:'Portiere + difesa',desc:'Premia portiere e difensori di valore, la profondità difensiva e i moduli che sfruttano il modificatore.'}
};
function v3Num(x){return Number(x||0)}
function v3Rating(p){return v3Num(p.rating)}
function v3Bonus(p){return v3Num(p.bonus_probability)}
function v3Score(p,style){
 const r=p.role, rating=v3Rating(p), bonus=v3Bonus(p), price=v3Num(p.price);
 if(style==='bonus'){
   const rm={P:.72,D:.78,C:1.18,A:1.35}[r]||1;
   const bm={P:10,D:18,C:52,A:66}[r]||30;
   return rating*rm+bonus*bm+price*({P:.02,D:.03,C:.12,A:.16}[r]||0);
 }
 if(style==='modifier'){
   const rm={P:1.28,D:1.30,C:.90,A:.88}[r]||1;
   const bm={P:18,D:20,C:28,A:34}[r]||25;
   return rating*rm+bonus*bm+price*({P:.11,D:.10,C:.02,A:.01}[r]||0);
 }
 const rm={P:.96,D:1.02,C:1.08,A:1.12}[r]||1;
 const bm={P:14,D:22,C:38,A:46}[r]||30;
 return rating*rm+bonus*bm+price*.035;
}
function v3RoleDP(role,need,style){
 const arr=players.filter(p=>p.role===role),dp=Array.from({length:need+1},()=>Array(251).fill(null));
 dp[0][0]={score:0,ids:[]};
 for(const p of arr){const cost=v3Num(p.price);if(!Number.isFinite(cost)||cost<0||cost>250)continue;const value=v3Score(p,style);
   for(let c=need-1;c>=0;c--)for(let b=250-cost;b>=0;b--){const cur=dp[c][b];if(!cur)continue;const nb=b+cost,ns=cur.score+value,old=dp[c+1][nb];if(!old||ns>old.score)dp[c+1][nb]={score:ns,ids:cur.ids.concat(Number(p.id))};}
 }
 return dp[need];
}
function v3Optimize(style){
 const needs={P:3,D:8,C:8,A:6},roles=['P','D','C','A'],maps=roles.map(r=>v3RoleDP(r,needs[r],style));
 let combo=Array(251).fill(null);combo[0]={score:0,ids:[]};
 for(const rm of maps){const next=Array(251).fill(null);for(let a=0;a<=250;a++){const ca=combo[a];if(!ca)continue;for(let b=0;a+b<=250;b++){const rb=rm[b];if(!rb)continue;const t=a+b,sc=ca.score+rb.score;if(!next[t]||sc>next[t].score)next[t]={score:sc,ids:ca.ids.concat(rb.ids)};}}combo=next;}
 const best=combo[250];if(!best)return null;const roster=best.ids.map(id=>players.find(p=>Number(p.id)===Number(id))).filter(Boolean);return roster.length===25?roster:null;
}
function v3Counts(mod){const c={P:0,D:0,C:0,A:0};(F_LAYOUTS[mod]||[]).forEach(s=>c[s[0]]++);return c}
function v3XIPlayerScore(p,style){
 const base=v3Score(p,style);
 if(style==='bonus'&&(p.role==='A'||p.role==='C'))return base*1.13;
 if(style==='modifier'&&(p.role==='P'||p.role==='D'))return base*1.15;
 return base;
}
function v3ChooseModule(roster,style){
 let best=null;
 for(const mod of Object.keys(F_LAYOUTS)){
  const counts=v3Counts(mod);let score=0,ok=true;
  for(const r of ['P','D','C','A']){const pool=roster.filter(p=>p.role===r).sort((a,b)=>v3XIPlayerScore(b,style)-v3XIPlayerScore(a,style));if(pool.length<counts[r]){ok=false;break}score+=pool.slice(0,counts[r]).reduce((s,p)=>s+v3XIPlayerScore(p,style),0)}
  if(!ok)continue;
  if(style==='bonus'){score+=counts.A===3?28:counts.A===2?10:-10;score+=counts.C>=4?8:0;score+=counts.D>=4?4:-5}
  else if(style==='modifier'){score+=counts.D===5?38:counts.D===4?27:-28;score+=counts.A===1?5:0}
  else {score+=counts.D>=4?18:-18;score+=counts.A===3?9:counts.A===2?5:0}
  if(!best||score>best.score)best={module:mod,score,counts};
 }
 return best;
}
function v3Lineup(roster,mod,style){
 const layout=F_LAYOUTS[mod],pools={P:[],D:[],C:[],A:[]},used={P:0,D:0,C:0,A:0},slots={};
 roster.forEach(p=>pools[p.role].push(p));Object.keys(pools).forEach(r=>pools[r].sort((a,b)=>v3XIPlayerScore(b,style)-v3XIPlayerScore(a,style)));
 layout.forEach((s,i)=>{const p=pools[s[0]][used[s[0]]++];if(p)slots[i]=Number(p.id)});return slots;
}
function v3Reason(roster,choice,style){
 const cfg=V3_STYLES[style],spend={P:0,D:0,C:0,A:0};roster.forEach(p=>spend[p.role]+=v3Num(p.price));
 const slots=v3Lineup(roster,choice.module,style),starterIds=new Set(Object.values(slots).map(Number));
 const starters=roster.filter(p=>starterIds.has(Number(p.id))),bench=roster.filter(p=>!starterIds.has(Number(p.id)));
 const top=roster.slice().sort((a,b)=>v3Score(b,style)-v3Score(a,style)).slice(0,4);
 const benchTop=bench.slice().sort((a,b)=>v3Score(b,style)-v3Score(a,style)).slice(0,4);
 let why='';
 if(style==='bonus')why=`Il ${choice.module} mette in campo il maggior potenziale stimato di bonus della rosa, privilegiando centrocampo e attacco. Il modello accetta una spesa più contenuta negli altri reparti per finanziare i profili offensivi.`;
 else if(style==='modifier')why=`Il ${choice.module} è il miglior compromesso per questa strategia: schiera ${choice.counts.D} difensori, valorizza portiere e reparto arretrato e mantiene accessibile il modificatore difesa.`;
 else why=`Il ${choice.module} offre il miglior equilibrio tra qualità dell'XI, accesso al modificatore e presenza offensiva, senza sacrificare troppo la profondità della rosa.`;
 const benchWhy=benchTop.length?`La panchina non è riempitiva: i primi cambi suggeriti sono ${benchTop.map(p=>p.name).join(', ')}. Il generatore conserva alternative per ruolo per ridurre il rischio di assenze.`:'La panchina viene costruita rispettando la profondità per ogni ruolo.';
 return {cfg,spend,slots,starters,bench,top,benchTop,why,benchWhy};
}
function v3MakeProposal(style){
 if(!V3_STYLES[style])style='balanced';
 if(!Array.isArray(players)||players.length<25)return alert('Il listone non è ancora disponibile.');
 const roster=v3Optimize(style);if(!roster)return alert('Non trovo una combinazione valida esattamente a 250 crediti.');
 const choice=v3ChooseModule(roster,style),reason=v3Reason(roster,choice,style);v3Proposal={style,roster,choice,reason};v3ShowModal();
}
function v3GroupHtml(roster){return ['P','D','C','A'].map(r=>{const a=roster.filter(p=>p.role===r).sort((x,y)=>v3Num(y.price)-v3Num(x.price));return `<div style="margin-top:12px"><b style="color:#55e4aa">${r}</b><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:6px">${a.map(p=>`<div style="background:#0b1a24;border:1px solid #1c3a4b;border-radius:10px;padding:7px"><b>${fEsc(p.name)}</b><br><span style="font-size:11px;color:#93a9b8">${fEsc(p.team)} • ${p.price} cr</span></div>`).join('')}</div></div>`}).join('')}
function v3ShowModal(){
 const q=v3Proposal;if(!q)return;document.getElementById('v3Modal')?.remove();const {roster,choice,reason}=q,cfg=reason.cfg;
 const ov=document.createElement('div');ov.id='v3Modal';ov.style.cssText='position:fixed;inset:0;z-index:9998;background:#041018ee;display:flex;align-items:center;justify-content:center;padding:12px';
 ov.innerHTML=`<div style="width:min(760px,100%);max-height:92vh;overflow:auto;background:#0d1e2a;border:1px solid #2a5267;border-radius:24px;padding:18px;color:#fff;box-shadow:0 25px 80px #000a"><div style="font-size:11px;font-weight:900;letter-spacing:.12em;color:#55e4aa">FANTA AI • ${cfg.title.toUpperCase()}</div><div style="display:flex;justify-content:space-between;gap:10px;align-items:end"><div><h2 style="margin:6px 0">${cfg.icon} ${cfg.title} • 250/250</h2><div style="color:#93a9b8">25 giocatori • ${cfg.tag}</div></div><div style="font-size:30px;font-weight:950;color:#ffd166">${choice.module}</div></div><div style="margin-top:13px;background:#102735;border-radius:15px;padding:12px"><b>Perché questa rosa</b><p style="margin:7px 0;color:#cbdde6">${cfg.desc}</p><div style="font-size:12px;color:#93a9b8">Spesa reparto: P ${reason.spend.P} • D ${reason.spend.D} • C ${reason.spend.C} • A ${reason.spend.A}</div><p style="margin:8px 0 0;color:#cbdde6">Profili chiave: <b>${reason.top.map(p=>fEsc(p.name)).join(', ')}</b>.</p></div><div style="margin-top:9px;background:#102735;border-radius:15px;padding:12px"><b>Perché ${choice.module}</b><p style="margin:7px 0;color:#cbdde6">${reason.why}</p></div><div style="margin-top:9px;background:#102735;border-radius:15px;padding:12px"><b>La panchina</b><p style="margin:7px 0;color:#cbdde6">${reason.benchWhy}</p></div>${v3GroupHtml(roster)}<div style="display:flex;gap:8px;margin-top:16px;position:sticky;bottom:0;background:#0d1e2a;padding-top:10px"><button onclick="document.getElementById('v3Modal')?.remove()" style="flex:1;padding:12px;border-radius:12px;border:1px solid #315063;background:#102735;color:#fff">Annulla</button><button onclick="v3Apply()" style="flex:2;padding:12px;border-radius:12px;border:0;background:#55e4aa;color:#052116;font-weight:950">Usa questa rosa</button></div><div style="font-size:11px;color:#78919f;margin-top:8px">Rating e probabilità β sono stime orientative.</div></div>`;document.body.appendChild(ov);
}
async function v3Apply(){const q=v3Proposal;if(!q)return;state.roster=q.roster.slice();fModule=q.choice.module;fSlots=q.reason.slots;fSelected=null;fHydrated=true;state.formations=[{name:'AI '+q.reason.cfg.title,module:fModule,slots:fSlots,strategy:q.style}];await save();renderAll();const sel=document.getElementById('module');if(sel)sel.value=fModule;renderFormation();document.getElementById('v3Modal')?.remove();alert(`${q.reason.cfg.icon} Rosa ${q.reason.cfg.title} applicata • 250/250 • ${fModule}`)}
function v3InjectControls(){
 const market=document.getElementById('market');if(!market||document.getElementById('v3Strategies'))return;
 document.querySelectorAll('#aiSquadBtn').forEach(x=>x.closest('div[style]')?.remove());
 const box=document.createElement('div');box.id='v3Strategies';box.style.cssText='margin:12px 0;background:linear-gradient(135deg,#123147,#0e3b34);border:1px solid #2b6b61;border-radius:18px;padding:13px';
 box.innerHTML=`<div style="font-size:11px;font-weight:900;letter-spacing:.11em;color:#8affd4">FANTA AI • SCEGLI COME VUOI GIOCARE</div><div style="font-weight:900;font-size:18px;margin:4px 0 3px">Tre filosofie, tre rose diverse</div><div style="color:#9bb0bd;font-size:12px;margin-bottom:10px">Tutte cercano 25 giocatori e 250/250 crediti, ma cambiano priorità, modulo, titolari e profondità della panchina.</div><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px"><button onclick="v3MakeProposal('balanced')" style="border:1px solid #446274;border-radius:12px;padding:10px 5px;background:#102735;color:#fff"><b>⚖️ Equilibrata</b><br><span style="font-size:10px;color:#9bb0bd">rosa completa</span></button><button onclick="v3MakeProposal('bonus')" style="border:1px solid #75533b;border-radius:12px;padding:10px 5px;background:#302218;color:#fff"><b>🔥 Bonus/Top</b><br><span style="font-size:10px;color:#d5b497">più C + A</span></button><button onclick="v3MakeProposal('modifier')" style="border:1px solid #3d637d;border-radius:12px;padding:10px 5px;background:#122838;color:#fff"><b>🛡️ Modificatore</b><br><span style="font-size:10px;color:#9fc5db">P + difesa</span></button></div>`;
 const search=document.getElementById('search');market.insertBefore(box,search);
}
/* Pitch ambience */
let v3Animations=localStorage.getItem('fanta_pitch_anim')!=='off',v3BallTimer=null,v3BallIndex=0;
function v3InjectPitchCss(){if(document.getElementById('v3PitchCss'))return;const st=document.createElement('style');st.id='v3PitchCss';st.textContent=`.pitch.v3live{background:linear-gradient(110deg,#ffffff08,transparent 22%,#ffffff06 42%,transparent 62%),repeating-linear-gradient(0deg,#0e6036 0 55px,#116e3e 55px 110px);background-size:180% 100%,100% 100%;animation:v3grass 9s ease-in-out infinite alternate}.pitchBall{position:absolute;width:15px;height:15px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff 0 28%,#202a30 31% 42%,#fff 45% 68%,#202a30 70% 78%,#fff 80%);z-index:4;transform:translate(-50%,-50%);transition:left 1.25s cubic-bezier(.45,.05,.35,1),top 1.25s cubic-bezier(.45,.05,.35,1);box-shadow:0 4px 8px #0008;pointer-events:none}.token{transition:transform .25s,box-shadow .25s}.token:hover,.token:active{transform:translateY(-2px) scale(1.025);box-shadow:0 10px 24px #000a,0 0 18px #55e4aa55}@keyframes v3grass{0%{background-position:0 0,0 0}100%{background-position:100% 0,0 0}}@media(prefers-reduced-motion:reduce){.pitch.v3live{animation:none}.pitchBall{transition:none}}`;document.head.appendChild(st)}
function v3BallStep(){const pitch=document.getElementById('pitch');if(!pitch||!v3Animations)return;let ball=document.getElementById('pitchBall');if(!ball){ball=document.createElement('div');ball.id='pitchBall';ball.className='pitchBall';pitch.appendChild(ball)}const occupied=Array.from(pitch.querySelectorAll('.slot')).filter(x=>x.querySelector('.token'));if(occupied.length<2){ball.style.display='none';return}ball.style.display='block';const s=occupied[v3BallIndex%occupied.length];v3BallIndex++;ball.style.left=s.style.left;ball.style.top=s.style.top}
function v3StartBall(){clearInterval(v3BallTimer);const pitch=document.getElementById('pitch');if(pitch)pitch.classList.toggle('v3live',v3Animations);if(!v3Animations){document.getElementById('pitchBall')?.remove();return}v3BallStep();v3BallTimer=setInterval(v3BallStep,1600)}
function v3ToggleAnimations(){v3Animations=!v3Animations;localStorage.setItem('fanta_pitch_anim',v3Animations?'on':'off');v3StartBall();v3AnimButton()}
function v3AnimButton(){const formation=document.getElementById('formation');if(!formation)return;let b=document.getElementById('v3AnimBtn');if(!b){b=document.createElement('button');b.id='v3AnimBtn';b.className='ghost';b.onclick=v3ToggleAnimations;const actions=formation.querySelector('.actions');if(actions)actions.appendChild(b)}b.textContent=v3Animations?'🌿 Animazioni ON':'🌿 Animazioni OFF'}
const v3OldRenderFormation=window.renderFormation;window.renderFormation=function(){if(typeof v3OldRenderFormation==='function')v3OldRenderFormation();v3InjectPitchCss();v3AnimButton();setTimeout(v3StartBall,80)};
function v3Boot(){v3InjectControls();v3InjectPitchCss();v3AnimButton();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(v3Boot,250));else setTimeout(v3Boot,250);
