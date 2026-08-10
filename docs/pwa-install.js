/* IL FANTA v1.1.0 - PWA install, lightweight */
(function(){
  const VERSION='1.1.0';
  let deferredPrompt=null;
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const isStandalone=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;

  function ensureHead(){
    const add=(sel,tag,attrs)=>{if(document.querySelector(sel))return;const e=document.createElement(tag);Object.entries(attrs).forEach(([k,v])=>e[k]=v);document.head.appendChild(e)};
    add('link[rel="manifest"]','link',{rel:'manifest',href:'/manifest.webmanifest'});
    add('link[rel="apple-touch-icon"]','link',{rel:'apple-touch-icon',href:'/docs/icon-192.svg'});
    add('meta[name="apple-mobile-web-app-capable"]','meta',{name:'apple-mobile-web-app-capable',content:'yes'});
    add('meta[name="apple-mobile-web-app-status-bar-style"]','meta',{name:'apple-mobile-web-app-status-bar-style',content:'black-translucent'});
    add('meta[name="apple-mobile-web-app-title"]','meta',{name:'apple-mobile-web-app-title',content:'IL FANTA'});
  }

  function updateStaticLabels(){
    document.title='Il Fanta secondo Michele Bizzarro • v'+VERSION;
    const auth=document.getElementById('auth');
    if(auth){
      const top=auth.querySelector('.green');if(top)top.textContent='VERSIONE UFFICIALE 1.1.0 • 2026/27';
      const p=auth.querySelector('.muted');if(p&&/Beta privata/i.test(p.textContent||''))p.textContent='Release ufficiale • accesso privato fino a 10 mister • username e password personali.';
    }
    const app=document.getElementById('app');if(app){const v=app.querySelector('.top .green');if(v)v.textContent='IL FANTA • v1.1.0';}
    const footer=document.querySelector('.footer span');if(footer)footer.textContent='v1.1.0 • Creato da Michele Bizzarro';
  }

  function help(kind){
    document.getElementById('installHelp')?.remove();
    const ios=kind==='ios',ov=document.createElement('div');ov.id='installHelp';ov.style.cssText='position:fixed;inset:0;z-index:10020;background:#02080dcc;display:flex;align-items:center;justify-content:center;padding:16px';
    ov.innerHTML=`<div style="width:min(520px,100%);background:#0d1e2a;border:1px solid #2b5264;border-radius:24px;padding:20px;color:#fff"><div style="font-size:11px;font-weight:950;color:#55e4aa">📲 INSTALLA IL FANTA</div><h2>${ios?' iPhone / iPad':'🤖 Android'}</h2>${ios?'<p>Tocca <b>Condividi</b> e poi <b>Aggiungi alla schermata Home</b>.</p>':'<p>Apri il menu del browser e scegli <b>Installa app</b> o <b>Aggiungi alla schermata Home</b>.</p>'}<p style="font-size:12px;color:#9fb5c1">Nessuno store: è la web app installata dal browser.</p><button id="closeInstallHelp" style="width:100%;border:0;border-radius:13px;padding:13px;background:#55e4aa;color:#052116;font-weight:950">Ho capito</button></div>`;
    document.body.appendChild(ov);document.getElementById('closeInstallHelp').onclick=()=>ov.remove();
  }

  async function installAndroid(){
    if(isStandalone)return alert('IL FANTA è già installato ✅');
    if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;return}
    help('android');
  }

  function installCard(){
    if(document.getElementById('fantaInstallCard'))return;
    const stats=document.querySelector('#app .stats');if(!stats)return;
    const card=document.createElement('div');card.id='fantaInstallCard';card.style.cssText='margin:14px 0;background:linear-gradient(135deg,#102b39,#103b31);border:1px solid #2f6a5c;border-radius:18px;padding:14px;color:#fff';
    card.innerHTML=`<div style="font-size:11px;font-weight:950;color:#8affd4">📲 INSTALLA LA NOSTRA APP</div><div style="font-weight:900;font-size:19px;margin:4px 0">IL FANTA sul tuo smartphone</div><div style="font-size:13px;color:#b8ccd5;margin-bottom:11px">Niente store: aggiungila direttamente dalla schermata Home.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button id="installAndroidBtn" style="border:0;border-radius:12px;padding:12px;background:#55e4aa;color:#052116;font-weight:950">🤖 Android</button><button id="installIOSBtn" style="border:1px solid #507184;border-radius:12px;padding:12px;background:#102735;color:#fff;font-weight:950"> iPhone / iPad</button></div>`;
    stats.insertAdjacentElement('afterend',card);document.getElementById('installAndroidBtn').onclick=installAndroid;document.getElementById('installIOSBtn').onclick=()=>help('ios');
  }

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e});
  ensureHead();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(()=>{});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{updateStaticLabels();installCard()},{once:true});else{updateStaticLabels();installCard()}
  setTimeout(()=>{updateStaticLabels();installCard()},1200);
})();
