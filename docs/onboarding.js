/* IL FANTA 1.1.0 — prima release ufficiale */
(function(){
  const DISCLAIMER_KEY='fanta_disclaimer_v1';
  const ONBOARDING_KEY='fanta_onboarding_v110';
  function showJourney(){
    if(localStorage.getItem(ONBOARDING_KEY)==='seen'||localStorage.getItem(DISCLAIMER_KEY)!=='accepted'||document.getElementById('fantaJourney'))return;
    const ov=document.createElement('div');ov.id='fantaJourney';ov.style.cssText='position:fixed;inset:0;z-index:9998;background:linear-gradient(180deg,#031019f7,#071923fb);display:flex;align-items:center;justify-content:center;padding:14px';
    ov.innerHTML=`<div style="width:min(760px,100%);max-height:92vh;overflow:auto;background:#0d1e2a;border:1px solid #2a5367;border-radius:26px;padding:20px;box-shadow:0 26px 90px #000b;color:#fff">
      <div style="font-size:11px;font-weight:950;letter-spacing:.15em;color:#55e4aa">VERSIONE UFFICIALE 1.1.0 • RELEASE</div>
      <h2 style="font-size:30px;line-height:1;margin:8px 0 6px">⚽ Il Fanta<br><span style="color:#55e4aa">secondo Michele Bizzarro</span></h2>
      <div style="margin:14px 0;background:linear-gradient(135deg,#163951,#0d4c3e);border:1px solid #36a47f;border-radius:18px;padding:15px">
        <div style="font-size:11px;color:#8affd4;font-weight:950;letter-spacing:.1em">🎉 PRIMA VERSIONE UFFICIALE • 1.1.0</div>
        <h3 style="margin:7px 0">🏆 Dalla Beta alla Release</h3>
        <p style="margin:6px 0;color:#e4f2f5">Dopo quattro Beta, <b>IL FANTA – secondo Michele Bizzarro</b> raggiunge la sua prima versione ufficiale. Mercato, rosa, formazione, strategie, Fanta AI e Mister AI sono ora riuniti nella release <b>1.1.0</b>.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;margin-top:11px">
          <div style="background:#071923;border-radius:12px;padding:11px"><b style="color:#8affd4">✨ Gemini 3.1 Flash-Lite</b><br><span style="font-size:12px;color:#b9ccd5">Mister AI interpreta domande libere, usa rosa e listone e mantiene il fallback locale.</span></div>
          <div style="background:#071923;border-radius:12px;padding:11px"><b style="color:#8affd4">➕ Consigli → Rosa</b><br><span style="font-size:12px;color:#b9ccd5">I giocatori suggeriti da Gemini possono essere aggiunti direttamente alla rosa senza cercarli nel Mercato.</span></div>
          <div style="background:#071923;border-radius:12px;padding:11px"><b style="color:#8affd4">📲 Installa IL FANTA</b><br><span style="font-size:12px;color:#b9ccd5">Nuova esperienza PWA per aggiungere IL FANTA alla schermata Home su Android, iPhone e iPad senza passare dagli store.</span></div>
        </div>
        <div style="margin-top:10px;padding:10px;border-radius:12px;background:#071923;color:#b9ccd5;font-size:12px"><b style="color:#ffd166">Gemini:</b> massimo <b>30 richieste al giorno per account</b>; disponibilità soggetta al servizio Google e ai limiti tecnici/API. Le risposte AI possono essere inesatte o incomplete e non garantiscono bonus, voti o risultati. Se Gemini non è disponibile o il limite viene raggiunto, IL FANTA continua con il <b>motore locale</b>.</div>
      </div>
      <h3 style="margin:15px 0 8px">Il percorso fino alla 1.1.0</h3>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:9px">
        <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px"><div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 1 • LE FONDAMENTA</div><b>👤 Account + Mercato</b><p style="font-size:13px;color:#9fb5c1">Account privati, listone, rosa personale e controllo dei 250 crediti.</p></div>
        <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px"><div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 2 • IL CAMPO</div><b>🟩 Formazione + Rosa AI</b><p style="font-size:13px;color:#9fb5c1">Moduli, Miglior XI, panchina e generazione automatica della rosa.</p></div>
        <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px"><div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 3 • STRATEGIA</div><b>🤖 Strategie + Mister AI</b><p style="font-size:13px;color:#9fb5c1">Equilibrata, Bonus/Top, Modificatore e assistente mercato contestuale.</p></div>
        <div style="background:#0a1b26;border:1px solid #1d4052;border-radius:16px;padding:13px"><div style="font-size:11px;color:#55e4aa;font-weight:900">BETA 4 • GEMINI</div><b>✨ Vera AI generativa</b><p style="font-size:13px;color:#9fb5c1">Gemini, domande libere, quota giornaliera e fallback automatico al motore locale.</p></div>
      </div>
      <h3 style="margin:16px 0 8px">Mini guida</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px">
        <div style="background:#102735;border-radius:13px;padding:10px"><b>1. ⚽ Mercato</b><br><span style="font-size:12px;color:#9fb5c1">Cerca e aggiungi giocatori.</span></div><div style="background:#102735;border-radius:13px;padding:10px"><b>2. ✨ Fanta AI</b><br><span style="font-size:12px;color:#9fb5c1">Genera strategie entro 250 crediti.</span></div><div style="background:#102735;border-radius:13px;padding:10px"><b>3. 🟩 Formazione</b><br><span style="font-size:12px;color:#9fb5c1">Schiera e salva l'XI.</span></div><div style="background:#102735;border-radius:13px;padding:10px"><b>4. 🤖 Mister AI</b><br><span style="font-size:12px;color:#9fb5c1">Chiedi a Gemini e aggiungi i consigli direttamente alla rosa.</span></div>
      </div>
      <p style="font-size:11px;color:#728b99;margin:14px 0 8px">v1.1.0 • Prima release ufficiale • Progetto ideato e creato da Michele Bizzarro.</p>
      <button id="closeFantaJourney" style="width:100%;border:0;border-radius:14px;padding:14px;background:#55e4aa;color:#052116;font-weight:950;font-size:16px">🎉 Entra nella versione ufficiale</button></div>`;
    document.body.appendChild(ov);document.getElementById('closeFantaJourney').onclick=()=>{localStorage.setItem(ONBOARDING_KEY,'seen');ov.remove()};
  }
  const obs=new MutationObserver(()=>{if(localStorage.getItem(DISCLAIMER_KEY)==='accepted'&&localStorage.getItem(ONBOARDING_KEY)!=='seen')setTimeout(showJourney,120)});obs.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(showJourney,250));else setTimeout(showJourney,250);
})();
