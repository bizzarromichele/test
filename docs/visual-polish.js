/* IL FANTA v1.1.0 - visual polish */
(function(){
  function injectBallStyle(){
    if(document.getElementById('fantaVisualPolish'))return;
    const st=document.createElement('style');
    st.id='fantaVisualPolish';
    st.textContent=`
      .pitchBall{
        width:26px!important;
        height:26px!important;
        border-radius:50%!important;
        background:transparent!important;
        box-shadow:0 5px 10px #0008!important;
        display:grid!important;
        place-items:center!important;
        font-size:23px!important;
        line-height:1!important;
        filter:drop-shadow(0 2px 2px #0007);
        transition:left 1.25s cubic-bezier(.45,.05,.35,1),top 1.25s cubic-bezier(.45,.05,.35,1),transform 1.25s ease!important;
      }
      .pitchBall::before{content:'⚽';display:block;transform:translateY(-.5px)}
      .pitch.v3live .pitchBall{animation:fantaBallSpin 1.6s linear infinite}
      @keyframes fantaBallSpin{from{rotate:0deg}to{rotate:360deg}}
      @media(max-width:650px){.pitchBall{width:24px!important;height:24px!important;font-size:21px!important}}
      @media(prefers-reduced-motion:reduce){.pitch.v3live .pitchBall{animation:none}}
    `;
    document.head.appendChild(st);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectBallStyle);else injectBallStyle();
})();
