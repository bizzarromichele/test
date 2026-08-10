/* Post-disclaimer onboarding — project story + mini guide */
(function(){
  const DISCLAIMER_KEY='fanta_disclaimer_v1';
  const ONBOARDING_KEY='fanta_onboarding_v2';

  function showJourney(){
    if(localStorage.getItem(ONBOARDING_KEY)==='seen') return;
    if(localStorage.getItem(DISCLAIMER_KEY)!=='accepted') return;
    if(document.getElementById('fantaJourney')) return;

    const ov=document.createElement('div');
    ov.id='fantaJourney';
    ov.style.cssText='position:fixed;inset:0;z-index:9998;background:linear-gradient(180deg,#031019f7,#071923fb);display:flex;align-items:center;justify-content:center;padding:14px';
    ov.innerHTML=`
      <div style="width:min(720px,100%);max-height:92vh;overflow:auto;background:#0d1e2a;border:1px solid #2a5367;border-radius:26px;padding:20px;box-shadow:0 26px 90px #000b;color:#fff">
        <div style="font-size:11px;font-weight:950;letter-spacing:.15em;color:#55e4aa">DAL PRIMO PROTOTIPO A OGGI</div>
        <h2 style="font-size:30px;line-height:1;margin:8px 0 6px">⚽ Il Fanta<br><span style="color:#55e4aa">secondo Michele Bizzarro</span></h2>
        <p style="color:#a9bfcb;margin:8px 0 16px">Un piccolo progetto nato per costruire meglio una rosa è diventato una web app multiutente con mercato, analisi e formazione.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px">
          <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px">
            <div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 1 • LE FONDAMENTA</div>
            <b style="display:block;margin:5px 0">👤 Account + Mercato</b>
            <span style="font-size:13px;color:#9fb5c1">Registrazione privata, massimo 10 mister, database del listone, prezzi, rosa personale e controllo automatico dei 250 crediti.</span>
          </div>
          <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px">
            <div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 2 • IL CAMPO</div>
            <b style="display:block;margin:5px 0">🟩 Formazione + Rosa AI</b>
            <span style="font-size:13px;color:#9fb5c1">Campo stile videogame, moduli ammessi, Miglior XI, panchina e generazione automatica di una rosa completa 3P + 8D + 8C + 6A.</span>
          </div>
          <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px">
            <div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 3 • LA STRATEGIA</div>
            <b style="display:block;margin:5px 0">🤖 Strategie + Mister AI</b>
            <span style="font-size:13px;color:#9fb5c1">Rose Equilibrata, Bonus/Top e Modificatore, spiegazione delle scelte, analisi della panchina e assistente mercato contestuale.</span>
          </div>
        </div>

        <div style="margin-top:14px;background:linear-gradient(135deg,#143348,#0d473a);border:1px solid #2a6d5d;border-radius:18px;padding:14px">
          <div style="font-size:11px;color:#8affd4;font-weight:950;letter-spacing:.1em">OGGI • A COSA SERVE</div>
          <p style="margin:7px 0;color:#e4f2f5">L'obiettivo è aiutarti a <b>costruire, confrontare e gestire una rosa da 250 crediti</b> usando i prezzi reali del nostro listone, senza perdere di vista ruoli, panchina, modulo e modificatore difesa.</p>
        </div>

        <h3 style="margin:16px 0 8px">Mini guida • 20 secondi</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">
          <div style="background:#102735;border-radius:13px;padding:10px"><b>1. ⚽ Mercato</b><br><span style="font-size:12px;color:#9fb5c1">Cerca un giocatore, controlla quota e Rating β e aggiungilo alla rosa.</span></div>
          <div style="background:#102735;border-radius:13px;padding:10px"><b>2. ✨ Fanta AI</b><br><span style="font-size:12px;color:#9fb5c1">Prova una rosa Equilibrata, Bonus/Top o Modificatore entro 250 crediti.</span></div>
          <div style="background:#102735;border-radius:13px;padding:10px"><b>3. 🟩 Formazione</b><br><span style="font-size:12px;color:#9fb5c1">Scegli il modulo, schiera l'XI e salva la tua formazione personale.</span></div>
          <div style="background:#102735;border-radius:13px;padding:10px"><b>4. 🤖 Mister AI</b><br><span style="font-size:12px;color:#9fb5c1">Chiedi chi comprare, come usare il budget o quale reparto rinforzare.</span></div>
        </div>

        <p style="font-size:11px;color:#728b99;margin:14px 0 8px">Beta 2026/27 • Progetto ideato e creato da Michele Bizzarro • Funzioni e stime evolvono durante lo sviluppo.</p>
        <button id="closeFantaJourney" style="width:100%;border:0;border-radius:14px;padding:14px;background:#55e4aa;color:#052116;font-weight:950;font-size:16px">🚀 Entra ne Il Fanta</button>
      </div>`;
    document.body.appendChild(ov);
    document.getElementById('closeFantaJourney').onclick=()=>{
      localStorage.setItem(ONBOARDING_KEY,'seen');
      ov.remove();
    };
  }

  // New users: the disclaimer button sets its localStorage key, then this observer shows the journey.
  const obs=new MutationObserver(()=>{
    if(localStorage.getItem(DISCLAIMER_KEY)==='accepted' && localStorage.getItem(ONBOARDING_KEY)!=='seen'){
      setTimeout(showJourney,120);
    }
  });
  obs.observe(document.documentElement,{childList:true,subtree:true});

  // Returning users who had already accepted the old disclaimer see the new onboarding once.
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(showJourney,250));
  else setTimeout(showJourney,250);
})();
