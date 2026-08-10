/* Beta 4 - Mister AI: contextual fantasy-football recommendation engine */
(function(){
const $m=id=>document.getElementById(id);
const M_LIMITS={P:3,D:8,C:8,A:6};
const M_LABEL={P:'portieri',D:'difensori',C:'centrocampisti',A:'attaccanti'};
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function rating(p){return Number(p.rating||0)}
function bonus(p){return Number(p.bonus_probability||0)}
function score(p,style='balanced'){
 const r=rating(p),b=bonus(p),pr=Number(p.price||0);
 if(style==='bonus')return r+b*55+(p.role==='A'?8:p.role==='C'?5:0);
 if(style==='defence')return r+b*(p.role==='P'?12:p.role==='D'?22:25)+(p.role==='D'?8:0)+(p.role==='P'?5:0);
 return r+b*32+Math.min(10,pr*.12);
}
function valueScore(p){return score(p)/(Math.max(1,Number(p.price))*0.65+5)}
function spent(){return state.roster.reduce((s,p)=>s+Number(p.price||0),0)}
function budgetLeft(){return 250-spent()}
function roleCount(r){return state.roster.filter(p=>p.role===r).length}
function missing(){const o={};Object.keys(M_LIMITS).forEach(r=>o[r]=Math.max(0,M_LIMITS[r]-roleCount(r)));return o}
function available(role){return players.filter(p=>(!role||p.role===role)&&!state.roster.some(x=>Number(x.id)===Number(p.id)))}
function currentModule(){try{return (window.fModule||window.fantaModule||state.formations?.[0]?.module||'4-3-3')}catch(e){return '4-3-3'}}
function playerLine(p){return `<div class="mRec"><div><b>${esc(p.name)}</b><small>${esc(p.team)} • ${p.role} • ${p.price} cr • Rating ${Math.round(rating(p))} • Bonus β ${Math.round(bonus(p)*100)}%</small></div><button onclick="misterAdd(${Number(p.id)})">+ Rosa</button></div>`}
function bubble(html,who='ai'){const box=$m('misterChat');if(!box)return;const d=document.createElement('div');d.className='mBubble '+who;d.innerHTML=html;box.appendChild(d);box.scrollTop=box.scrollHeight;}
function tell(text,extra=''){bubble(`<div>${text}</div>${extra}`,'ai')}
function user(text){bubble(esc(text),'user')}
function parseRole(q){q=q.toLowerCase();if(/attacc|punta|bomber/.test(q))return'A';if(/centr|mezzala|trequart/.test(q))return'C';if(/difens|terzin|centrale/.test(q))return'D';if(/portier/.test(q))return'P';return null}
function parseBudget(q){let m=q.match(/(?:con|ho|budget|rimangono|restano|restano\s+)?\s*(\d{1,3})\s*(?:crediti|credito|cr\b)/i);return m?Math.min(250,Number(m[1])):null}
function parseCount(q,role){const map={A:'attacc',C:'centr',D:'difens',P:'portier'};if(role){let re=new RegExp('(\\d+)\\s*(?:'+map[role]+')','i'),m=q.match(re);if(m)return Math.max(1,Math.min(6,Number(m[1])))}let m=q.match(/(?:mi\s+mancano|cerco|voglio|prendere|comprare)\s*(\d+)/i);return m?Math.max(1,Math.min(6,Number(m[1]))):1}
function bestN(role,n,budget,style='balanced'){
 const arr=available(role).filter(p=>Number(p.price)<=budget).sort((a,b)=>score(b,style)-score(a,style));
 if(n===1)return arr.length?[arr[0]]:[];
 const dp=Array.from({length:n+1},()=>Array(budget+1).fill(null));dp[0][0]={s:0,ids:[]};
 for(const p of arr){const c=Number(p.price),v=score(p,style);for(let k=n-1;k>=0;k--)for(let b=budget-c;b>=0;b--){const cur=dp[k][b];if(!cur)continue;const nb=b+c,ns=cur.s+v,old=dp[k+1][nb];if(!old||ns>old.s)dp[k+1][nb]={s:ns,ids:cur.ids.concat(Number(p.id))}}}
 let best=null,bestB=0;for(let b=0;b<=budget;b++){const x=dp[n][b];if(x&&(!best||x.s>best.s)){best=x;bestB=b}}if(!best)return[];return best.ids.map(id=>players.find(p=>Number(p.id)===id)).filter(Boolean)
}
function topPlusLowVsSemi(role,budget){
 const arr=available(role).filter(p=>Number(p.price)<=budget).sort((a,b)=>Number(b.price)-Number(a.price));if(arr.length<2)return null;
 let topPlan=null,semiPlan=null;
 for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){
  const a=arr[i],b=arr[j],cost=Number(a.price)+Number(b.price);if(cost>budget)continue;const sc=score(a,'bonus')+score(b,'bonus');
  const spread=Math.abs(Number(a.price)-Number(b.price));
  if(spread>=8&&(!topPlan||sc>topPlan.sc))topPlan={a,b,cost,sc};
  if(spread<=5&&(!semiPlan||sc>semiPlan.sc))semiPlan={a,b,cost,sc};
 }
 return {topPlan,semiPlan};
}
function lineupBench(){
 const mod=currentModule();let used=new Set();const f=state.formations?.[0]?.slots||{};Object.values(f).forEach(id=>used.add(Number(id)));
 if(!used.size&&typeof window.fillBestXIForModule==='function'){try{Object.values(fillBestXIForModule(mod)).forEach(id=>used.add(Number(id)))}catch(e){}}
 const bench=state.roster.filter(p=>!used.has(Number(p.id)));return {mod,bench};
}
function analyseRoster(){
 const miss=missing(),left=budgetLeft();const roleAverages={};Object.keys(M_LIMITS).forEach(r=>{const a=state.roster.filter(p=>p.role===r);roleAverages[r]=a.length?a.reduce((s,p)=>s+rating(p),0)/a.length:0});
 const weakest=Object.entries(roleAverages).sort((a,b)=>a[1]-b[1])[0];
 const missingTxt=Object.entries(miss).filter(([,n])=>n>0).map(([r,n])=>`${n} ${M_LABEL[r]}`).join(', ');
 tell(`<b>Analisi della tua rosa</b><br>Hai speso <b>${spent()}/250</b> e ti restano <b>${left} crediti</b>. ${missingTxt?`Per completarla mancano: <b>${missingTxt}</b>.`:'La rosa è completa.'} ${weakest&&weakest[1]>0?`Il reparto con Rating medio più basso, al momento, è <b>${M_LABEL[weakest[0]]}</b>.`:''}`);
}
function recommendNext(){
 const miss=missing(),left=budgetLeft(),remaining=Object.values(miss).reduce((a,b)=>a+b,0);if(!remaining){analyseRoster();return}
 const role=Object.keys(miss).filter(r=>miss[r]>0).sort((a,b)=>miss[b]-miss[a])[0],reserve=Math.max(0,remaining-1),max=Math.max(1,left-reserve);const cand=available(role).filter(p=>Number(p.price)<=max).sort((a,b)=>valueScore(b)-valueScore(a)).slice(0,4);
 tell(`<b>Chi comprerei adesso</b><br>Ti restano ${left} crediti e ${remaining} slot. Per prima cosa lavorerei sui <b>${M_LABEL[role]}</b>, mantenendo almeno ${reserve} crediti per gli altri posti.`,cand.map(playerLine).join(''));
}
function benchAdvice(){
 const {mod,bench}=lineupBench();if(!state.roster.length){tell('Prima aggiungi qualche giocatore alla rosa e poi posso valutare la panchina.');return}const weak=bench.slice().sort((a,b)=>score(a)-score(b)).slice(0,4);let h=`<b>Panchina • ${esc(mod)}</b><br>`;if(!bench.length){h+='Non riesco ancora a distinguere titolari e panchina: salva una formazione o usa Miglior XI.';tell(h);return}h+=`Hai ${bench.length} giocatori fuori dall'XI. I profili più deboli secondo Rating/Bonus β sono questi:`;tell(h,weak.map(playerLine).join(''));
}
function moduleAdvice(){
 if(!state.roster.length){tell('Costruisci almeno una parte della rosa e poi posso confrontare i moduli.');return}
 if(typeof window.chooseBestModule==='function'){try{const c=chooseBestModule(state.roster);tell(`<b>Modulo consigliato: ${c.module}</b><br>È quello che al momento massimizza il valore stimato dell'XI. Se usa almeno 4 difensori, mantiene anche l'accesso al modificatore difesa.`);return}catch(e){}}
 tell(`<b>Modulo attuale: ${esc(currentModule())}</b><br>Appena la rosa è completa posso confrontare automaticamente tutti i moduli ammessi.`)
}
function answer(raw){const q=raw.trim();if(!q)return;user(q);const l=q.toLowerCase();
 if(/analizz|valuta.*rosa|come.*rosa/.test(l)){analyseRoster();return}
 if(/panchina|riserve/.test(l)){benchAdvice();return}
 if(/modulo|formazione migliore|schema/.test(l)){moduleAdvice();return}
 if(/chi compro|prossimo acquisto|cosa compro|consigliami/.test(l)&&!parseRole(l)){recommendNext();return}
 const role=parseRole(l),bud=parseBudget(l)??budgetLeft(),n=parseCount(l,role);
 if(/top.*low|low.*top|semitop|semi top/.test(l)&&role){const c=topPlusLowVsSemi(role,bud);if(!c||(!c.topPlan&&!c.semiPlan)){tell('Non trovo due combinazioni confrontabili con questo budget.');return}let html='<b>Confronto strategico</b><br>';if(c.topPlan)html+=`Top + low cost: <b>${esc(c.topPlan.a.name)} + ${esc(c.topPlan.b.name)}</b> (${c.topPlan.cost} cr).<br>`;if(c.semiPlan)html+=`Due semitop: <b>${esc(c.semiPlan.a.name)} + ${esc(c.semiPlan.b.name)}</b> (${c.semiPlan.cost} cr).<br>`;if(c.topPlan&&c.semiPlan)html+=c.topPlan.sc>c.semiPlan.sc?'Con i dati β attuali preferisco <b>top + low cost</b>.':'Con i dati β attuali preferisco <b>due semitop</b> per equilibrio.';tell(html);return}
 if(role){const style=/bonus|aggress|top|bomber/.test(l)?'bonus':/difens|modificatore/.test(l)?'defence':'balanced';const rec=bestN(role,n,bud,style);if(!rec.length){tell(`Non trovo ${n} ${M_LABEL[role]} entro ${bud} crediti senza usare giocatori già presenti nella tua rosa.`);return}const cost=rec.reduce((s,p)=>s+Number(p.price),0);tell(`<b>Proposta: ${n} ${M_LABEL[role]} con massimo ${bud} crediti</b><br>Spesa della combinazione: <b>${cost}</b>. Ho privilegiato ${style==='bonus'?'potenziale bonus':style==='defence'?'solidità/modificatore':'equilibrio tra Rating, bonus e costo'}.`,rec.map(playerLine).join(''));return}
 recommendNext();
}
window.misterAsk=function(v){const input=$m('misterInput');const q=typeof v==='string'?v:(input?.value||'');if(input)input.value='';answer(q)};
window.misterAdd=async function(id){if(typeof toggle==='function')await toggle(Number(id));tell('Giocatore aggiunto alla rosa. Ho aggiornato budget e fabbisogni. ✅')};
window.misterQuick=function(text){const i=$m('misterInput');if(i)i.value=text;window.misterAsk(text)};
function inject(){
 const section=$m('mister');if(!section)return;
 const left=budgetLeft(),miss=missing();const summary=$m('misterSummary');if(summary)summary.innerHTML=`<b>${left}</b> crediti disponibili • Rosa <b>${state.roster.length}/25</b> • Mancano ${Object.entries(miss).filter(([,n])=>n).map(([r,n])=>n+r).join(' · ')||'0 slot'}`;
 if(!$m('misterChat').children.length)tell('Ciao Mister 👋 Io leggo la tua rosa e il listone. Chiedimi un acquisto, una combinazione entro budget, il modulo migliore oppure come sistemare la panchina.');
}
const oldRenderAll=window.renderAll;window.renderAll=function(){oldRenderAll.apply(this,arguments);setTimeout(inject,0)};
const oldPageM=window.page;window.page=function(btn,id){oldPageM(btn,id);if(id==='mister')setTimeout(inject,0)};
document.addEventListener('DOMContentLoaded',()=>setTimeout(inject,300));
})();
