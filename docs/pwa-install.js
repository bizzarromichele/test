/* IL FANTA v1.1.0 - installazione PWA Android/iOS */
(function(){
  const VERSION='1.1.0';
  let deferredPrompt=null;
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;

  function ensureHead(){
    if(!document.querySelector('link[rel="manifest"]')){const l=document.createElement('link');l.rel='manifest';l.href='/manifest.webmanifest';document.head.appendChild(l)}
    if(!document.querySelector('link[rel="apple-touch-icon"]')){const l=document.createElement('link');l.rel='apple-touch-icon';l.href='/docs/icon-192.svg';document.head.appendChild(l)}
    if(!document.querySelector('meta[name="apple-mobile-web-app-capable"]')){const m=document.createElement('meta');m.name='apple-mobile-web-app-capable';m.content='yes';document.head.appendChild(m)}
    if(!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')){const m=document.createElement('meta');m.name='apple-mobile-web-app-status-bar-style';m.content='black-translucent';document.head.appendChild(m)}
    if(!document.querySelector('meta[name="apple-mobile-web-app-title"]')){const m=document.createElement('meta');m.name='apple-mobile-web-app-title';m.content='IL FANTA';document.head.appendChild(m)}
  }

  function updateVersionLabels(){
    document.title='Il Fanta secondo Michele Bizzarro • v'+VERSION;
    document.querySelectorAll('div,span,p').forEach(el=>{
      if(el.children.length)return;
      const t=(el.textContent||'').trim();
      if(t==='VERSIONE UFFICIALE 1.0.4 • 2026/27')el.textContent='VERSIONE UFFICIALE 1.1.0 • 2026/27';
      if(t==='IL FANTA • v1.0.4')el.textContent='IL FANTA • v1.1.0';
      if(t==='v1.0.4 • Creato da Michele Bizzarro')el.textContent='v1.1.0 • Creato da Michele Bizzarro';
      if(t==='Beta privata • massimo 10 mister • username e password personali.')el.textContent='Release ufficiale • accesso privato fino a 10 mister • username e password personali.';
    });
    const disclaimer=document.getElementById('fantaDisclaimer');
    if(disclaimer){
      const box=disclaimer.firstElementChild;
      if(box)box.innerHTML=box.innerHTML.replace('INFORMAZIONI SULLA BETA','INFORMAZIONI SULLA RELEASE').replace('<b>Versione Beta.</b> Al momento il servizio è sperimentale ed è limitato a un massimo di <b>10 utenti</b>. Funzioni, statistiche e stime possono essere modificate durante lo sviluppo. In futuro il progetto potrà eventualmente essere reso disponibile su scala più ampia.','<b>Versione ufficiale 1.1.0.</b> IL FANTA è nella sua prima release ufficiale ed è attualmente distribuito con accesso privato fino a un massimo di <b>10 utenti</b>. Funzioni, statistiche e stime potranno continuare a evolvere nelle versioni successive.');
    }
  }

  function closeHelp(){document.getElementById('installHelp')?.remove()}
  function help(kind){
    closeHelp();
    const ios=kind==='ios';
    const ov=document.createElement('div');ov.id='installHelp';ov.style.cssText='position:fixed;inset:0;z-index:10020;background:#02080dcc;display:flex;align-items:center;justify-content:center;padding:16px';
    ov.innerHTML=`<div style="width:min(520px,100%);background:#0d1e2a;border:1px solid #2b5264;border-radius:24px;padding:20px;color:#fff;box-shadow:0 24px 80px #000b"><div style="font-size:11px;font-weight:950;letter-spacing:.12em;color:#55e4aa">📲 INSTALLA IL FANTA</div><h2 style="margin:8px 0 12px">${ios?' iPhone / iPad':'🤖 Android'}</h2>${ios?'<p>Apri il sito nel browser, tocca <b>Condividi</b> e scegli <b>Aggiungi alla schermata Home</b>. Conferma con <b>Aggiungi</b>: IL FANTA comparirà tra le tue app.</p>':'<p>Se il browser supporta l’installazione diretta, usa il pulsante Android nella pagina. Se il popup non compare ancora, apri il menu del browser e scegli <b>Installa app</b> oppure <b>Aggiungi alla schermata Home</b>.</p>'}<p style="font-size:12px;color:#9fb5c1">Non si apre alcuno store: viene installata la versione web di IL FANTA direttamente dal browser.</p><button id="closeInstallHelp" style="width:100%;border:0;border-radius:13px;padding:13px;background:#55e4aa;color:#052116;font-weight:950">Ho capito</button></div>`;
    document.body.appendChild(ov);document.getElementById('closeInstallHelp').onclick=closeHelp;
  }

  async function installAndroid(){
    if(isStandalone)return alert('IL FANTA è già installato su questo dispositivo ✅');
    if(deferredPrompt){deferredPrompt.prompt();const choice=await deferredPrompt.userChoice;deferredPrompt=null;if(choice?.outcome==='accepted')document.querySelectorAll('[data-install-status]').forEach(x=>x.textContent='Installazione avviata ✅');return}
    help('android');
  }

  function installIOS(){
    if(isStandalone)return alert('IL FANTA è già installato su questo dispositivo ✅');
    help('ios');
  }

  function installCard(){
    if(document.getElementById('fantaInstallCard'))return;
    const card=document.createElement('div');card.id='fantaInstallCard';card.style.cssText='margin:14px 0;background:linear-gradient(135deg,#102b39,#103b31);border:1px solid #2f6a5c;border-radius:18px;padding:14px;color:#fff';
    card.innerHTML=`<div style="font-size:11px;font-weight:950;letter-spacing:.12em;color:#8affd4">📲 INSTALLA LA NOSTRA APP</div><div style="font-weight:900;font-size:19px;margin:4px 0">IL FANTA sul tuo smartphone</div><div style="font-size:13px;color:#b8ccd5;margin-bottom:11px">Niente store: aggiungila direttamente alla schermata Home dal browser.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button id="installAndroidBtn" style="border:0;border-radius:12px;padding:12px;background:#55e4aa;color:#052116;font-weight:950">🤖 Android</button><button id="installIOSBtn" style="border:1px solid #507184;border-radius:12px;padding:12px;background:#102735;color:#fff;font-weight:950"> iPhone / iPad</button></div><div data-install-status style="font-size:11px;color:#8fa8b7;margin-top:8px">${isStandalone?'App già installata ✅':isIOS?'Su iOS ti guideremo in Aggiungi alla schermata Home.':'Su Android useremo il prompt nativo del browser quando disponibile.'}</div>`;
    const app=document.getElementById('app');
    const stats=app?.querySelector('.stats');
    if(stats)stats.insertAdjacentElement('afterend',card);else document.querySelector('.wrap')?.prepend(card);
    document.getElementById('installAndroidBtn').onclick=installAndroid;
    document.getElementById('installIOSBtn').onclick=installIOS;
  }

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;document.querySelectorAll('[data-install-status]').forEach(x=>x.textContent='Android pronto: tocca Installa per aprire il popup del browser.')});
  window.addEventListener('appinstalled',()=>{deferredPrompt=null;document.querySelectorAll('[data-install-status]').forEach(x=>x.textContent='IL FANTA installato ✅')});

  ensureHead();updateVersionLabels();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{});
  const obs=new MutationObserver(()=>updateVersionLabels());obs.observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{updateVersionLabels();installCard()});else installCard();
})();
