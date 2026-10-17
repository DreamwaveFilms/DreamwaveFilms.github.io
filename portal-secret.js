(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  if (!hero || !window.HTMLDialogElement || document.getElementById('secret-portal')) return;
  const style = document.createElement('style');
  style.textContent = `
  .secret-entry{margin:22px auto 8px;text-align:center}
  .secret-trigger{font:inherit;font-size:14px;color:#d6c8ff;background:#120e20e6;border:1px solid #75609d;border-radius:999px;padding:12px 22px;cursor:pointer;box-shadow:0 0 25px #7b49c21c}
  .secret-trigger:hover{border-color:#b9a1ff;background:#211634}
  .secret-trigger:focus-visible,.secret-close:focus-visible{outline:2px solid #8be8ff;outline-offset:5px}
  .secret-mark{display:block;color:#ae97d8;font-size:12px;margin-top:9px}
  .secret-mark[hidden]{display:none}
  #secret-portal{direction:rtl;color:#f1edff;background:#080812;border:1px solid #66508c;border-radius:24px;padding:0;width:min(620px,92vw);max-height:90dvh;overflow:auto;box-shadow:0 0 90px #7536b333}
  #secret-portal::backdrop{background:#03030be8}
  .secret-panel{position:relative;text-align:center;padding:28px 24px 24px;overflow:hidden;background:radial-gradient(ellipse at 50% 48%,#2b1948 0,transparent 66%)}
  .secret-close{position:relative;display:block;margin:0 0 18px auto;font:inherit;font-size:13px;border:1px solid #52465f;border-radius:999px;background:#15121f;color:#eee;padding:9px 16px;cursor:pointer;z-index:2}
  .secret-kicker{color:#ad94d1;font-size:11px;letter-spacing:.18em;margin:0 0 8px}
  #secret-title{font-size:clamp(23px,5vw,34px);margin:0;font-weight:800}
  .secret-stage{position:relative;width:min(320px,72vw);height:clamp(220px,38dvh,360px);margin:20px auto 12px}
  .secret-aperture{position:absolute;inset:0 8%;border-radius:49% 51% 47% 53%;overflow:hidden;border:2px solid #ae8cf2;background:radial-gradient(ellipse at 50% 70%,#245069 0,#18132f 40%,#03040b 75%);box-shadow:0 0 20px #a26bdb66,inset 0 0 28px #8866d877}
  #secret-portal[open] .secret-aperture{animation:secret-open 1.6s ease-out both,secret-breathe 5s 1.6s ease-in-out infinite alternate}
  .secret-land{position:absolute;inset:0;background:linear-gradient(160deg,transparent 42%,#5b468122 43%,transparent 44%),linear-gradient(20deg,transparent 54%,#69c9df22 55%,transparent 56%)}
  .secret-wizard{position:absolute;inset:10% 5% 0;width:90%;height:90%;filter:drop-shadow(0 0 12px #8066aa44)}
  .secret-gaze{transform:translate(var(--gaze-x,0px),var(--gaze-y,0px));transition:transform .15s ease-out}
  .secret-mist{position:absolute;inset:60% -30% -20%;background:radial-gradient(ellipse,#9a76cf30,transparent 65%);pointer-events:none}
  #secret-portal[open] .secret-mist{animation:secret-mist 7s ease-in-out infinite alternate}
  #secret-message{min-height:3.2em;margin:12px 0 0;color:#d6c5f2;font-size:clamp(17px,4vw,22px);font-weight:700}
  .secret-hint{font-size:12px;color:#9b91ab;margin:4px 0 0}
  #secret-portal.secret-sealing .secret-aperture{animation:secret-shut 1.1s ease-in both}
  @keyframes secret-open{from{transform:scaleX(.035);opacity:.25}to{transform:scaleX(1);opacity:1}}
  @keyframes secret-shut{to{transform:scaleX(.015);opacity:0}}
  @keyframes secret-breathe{from{transform:scale(1)}to{transform:scale(1.025)}}
  @keyframes secret-mist{from{transform:translateX(-12px)}to{transform:translateX(12px)}}
  .motion-paused #secret-portal *{animation:none!important;transition:none!important}
  @media(prefers-reduced-motion:reduce){#secret-portal *{animation:none!important;transition:none!important}}
  `;
  document.head.append(style);
  const entry = document.createElement('div');
  entry.className = 'secret-entry';
  entry.innerHTML = '<button type="button" class="secret-trigger" aria-haspopup="dialog" aria-controls="secret-portal">אל תפתחו את זה</button><span class="secret-mark" hidden>✧ הסדק זוכר אתכם</span>';
  hero.append(entry);
  const dialog = document.createElement('dialog');
  dialog.id = 'secret-portal';
  dialog.setAttribute('aria-labelledby', 'secret-title');
  dialog.innerHTML = `<div class="secret-panel">
    <button type="button" class="secret-close" autofocus>סגירת הפורטל ✕</button>
    <p class="secret-kicker">DREAMWAVE FILMS · מעבר לסדק</p>
    <h2 id="secret-title">משהו מסתכל מהצד השני.</h2>
    <div class="secret-stage" aria-hidden="true"><div class="secret-aperture"><div class="secret-land"></div>
    <svg class="secret-wizard" viewBox="0 0 240 320" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="secret-cloak" x1="0" x2="1"><stop stop-color="#04050c"/><stop offset=".5" stop-color="#1c192b"/><stop offset="1" stop-color="#05060c"/></linearGradient></defs>
      <path d="M20 320 43 206 66 168 59 112Q61 48 120 10Q179 48 181 112L174 168 199 206 220 320Z" fill="url(#secret-cloak)" stroke="#716082" stroke-opacity=".45"/>
      <path d="M120 26Q72 65 75 119L92 169 120 185 148 169 165 119Q168 65 120 26" fill="#02030a"/>
      <path d="M120 52 91 83 87 123 103 151 120 164 137 151 153 123 149 83Z" fill="#272535" stroke="#61576d" stroke-width="1"/>
      <path d="m95 96 20 7-16 8-9-7m55-8-20 7 16 8 9-7" fill="#070810"/>
      <g class="secret-gaze" fill="#b6e5ee"><ellipse cx="102" cy="103" rx="4" ry="2"/><ellipse cx="138" cy="103" rx="4" ry="2"/></g>
      <path d="m120 107-5 23 10 0m-19 13 14 5 14-5M66 179 90 320m84-141-24 141M120 187v133" fill="none" stroke="#73617f" stroke-opacity=".3" stroke-width="2"/>
    </svg><div class="secret-mist"></div></div></div>
    <p id="secret-message" role="status" aria-live="polite"></p>
    <p class="secret-hint">הזיזו את העכבר או החליקו אצבע בתוך הפורטל</p>
  </div>`;
  document.body.append(dialog);
  const trigger = entry.querySelector('button');
  const mark = entry.querySelector('.secret-mark');
  const message = dialog.querySelector('#secret-message');
  const stage = dialog.querySelector('.secret-stage');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timers = [], previousOverflow = '', active = false;
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  function cleanup() {
    if (!active) return;
    active = false;
    clearTimers();
    document.body.style.overflow = previousOverflow;
    dialog.classList.remove('secret-sealing');
    mark.hidden = false;
    trigger.focus({preventScroll:true});
  }
  function close() { if (dialog.open) dialog.close(); cleanup(); }
  trigger.addEventListener('click', () => {
    if (dialog.open) return;
    clearTimers();
    dialog.classList.remove('secret-sealing');
    stage.style.setProperty('--gaze-x', '0px');
    stage.style.setProperty('--gaze-y', '0px');
    message.textContent = 'לא הייתם אמורים לפתוח את זה.';
    dialog.showModal();
    active = true;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    timers.push(setTimeout(() => { message.textContent = 'עכשיו הוא יודע שאתם כאן.'; }, 5500));
    timers.push(setTimeout(() => { dialog.classList.add('secret-sealing'); }, 11000));
    timers.push(setTimeout(close, 12200));
  });
  dialog.querySelector('.secret-close').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', cleanup);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
  stage.addEventListener('pointermove', event => {
    if (!dialog.open || reduced.matches || document.documentElement.classList.contains('motion-paused')) return;
    const rect = stage.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    stage.style.setProperty('--gaze-x', (x * 3).toFixed(2) + 'px');
    stage.style.setProperty('--gaze-y', (y * 2).toFixed(2) + 'px');
  });
  stage.style.touchAction = 'none';
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--gaze-x', '0px'); stage.style.setProperty('--gaze-y', '0px'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && active) close(); });
})();
