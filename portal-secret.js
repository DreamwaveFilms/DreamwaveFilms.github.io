(() => {
'use strict';
const scene=document.querySelector('.cinema-scene'),hero=document.querySelector('.hero');
const anchor=scene?.querySelector('.rift-anchor'),svg=scene?.querySelector('.rift-opening svg');
if(!scene||!hero||!svg||!anchor||!window.HTMLDialogElement)return;
const ns='http://www.w3.org/2000/svg';
const shape='M210 10 188 138 145 222 163 278 105 371 125 417 95 502 152 565 140 630 185 732 193 860 221 737 246 642 238 582 290 492 269 436 298 342 249 280 260 208 228 133Z';
const defs=svg.querySelector('defs');
const clip=document.createElementNS(ns,'clipPath');clip.id='secret-rift-clip';
const clipShape=document.createElementNS(ns,'path');clipShape.setAttribute('d',shape);clip.append(clipShape);defs.append(clip);
const world=document.createElementNS(ns,'g');world.setAttribute('class','secret-world');world.setAttribute('clip-path','url(#secret-rift-clip)');
world.innerHTML='<defs><radialGradient id="secret-depth"><stop stop-color="#607b8e"/><stop offset=".48" stop-color="#2b314e"/><stop offset="1" stop-color="#090a19"/></radialGradient><linearGradient id="secret-fog" x2="0" y2="1"><stop stop-color="#95c5df" stop-opacity="0"/><stop offset=".6" stop-color="#6a8da8" stop-opacity=".22"/><stop offset="1" stop-color="#080914" stop-opacity=".9"/></linearGradient></defs>'+
'<path d="'+shape+'" fill="url(#secret-depth)"/>'+
'<g fill="#101426" opacity=".8"><path d="M80 720 100 250 108 236 114 720ZM135 710 143 300 151 285 161 710ZM245 730 250 245 261 222 276 730ZM295 720 300 330 310 311 323 720Z"/><path d="m100 400-34-62 35 37m45 110 30-64-28 34m112-75-40-54 39 28m40 135 30-68-29 35" fill="none" stroke="#101426" stroke-width="5"/></g>'+
'<ellipse cx="200" cy="693" rx="130" ry="17" fill="#03040b" opacity=".65"/>'+
'<g class="secret-walker"><g class="secret-body">'+
'<g class="secret-leg secret-leg-back"><path d="M-13 619-19 677-29 691-6 691 7 625Z" fill="#03040a"/></g>'+
'<g class="secret-leg secret-leg-front"><path d="M5 619 10 678 3 692 28 692 23 675 23 620Z" fill="#06070d"/></g>'+
'<path d="M-37 642Q-24 596-24 541L-15 497Q-32 468-11 441L3 429Q29 444 29 469L38 480 25 486 23 505Q38 539 33 578L48 650Q6 639-37 642Z" fill="#05060d"/>'+
'<path d="M-11 441Q-25 472-15 497L-24 541Q-24 596-37 642M23 505Q38 539 33 578L48 650" fill="none" stroke="#8a9cae" stroke-opacity=".26" stroke-width="1.5"/>'+
'<path d="M-12 513Q-7 566-26 628M5 524Q19 588 28 640" fill="none" stroke="#1b2030" stroke-width="3"/>'+
'<path d="M28 534 44 581 55 591" fill="none" stroke="#05060d" stroke-width="12" stroke-linecap="round"/>'+
'<path d="m57 550-8 145" stroke="#090b12" stroke-width="4"/>'+
'</g></g><rect x="60" y="600" width="280" height="170" fill="url(#secret-fog)"/>';
const fillPath=Array.from(svg.children).find(el=>el.tagName.toLowerCase()==='path');
if(!fillPath)return;
fillPath.after(world);
const style=document.createElement('style');
style.textContent=`
.secret-entry{margin:22px auto 8px;text-align:center}.secret-trigger{font:inherit;font-size:14px;color:#d6c8ff;background:#120e20e6;border:1px solid #75609d;border-radius:999px;padding:12px 22px;cursor:pointer}.secret-trigger:hover{border-color:#b9a1ff}.secret-mark{display:block;color:#b9a1e5;font-size:12px;margin-top:9px}.secret-mark[hidden]{display:none}
.secret-world{display:none}
#secret-cinema{padding:0;margin:0;inset:0;border:0;width:100vw;max-width:none;height:100dvh;max-height:none;background:transparent;color:white;overflow:hidden}
#secret-cinema::backdrop{background:rgba(3,4,10,.93)}
#secret-cinema .cinema-scene{position:absolute;inset:0;height:100%;width:100%;z-index:0;contain:paint}
#secret-cinema .cinema-scene::after{background:linear-gradient(180deg,#03040b22,transparent 25%,transparent 72%,#03040b99)}
#secret-cinema .rift-anchor{transform:none;transition:top 2.4s ease,left 2.4s ease,width 2.4s ease,height 2.4s ease}
#secret-cinema .rift-opening{transition:transform 2.4s cubic-bezier(.22,.65,.25,1),opacity 2s ease}
#secret-cinema.secret-expanded .rift-opening{transform:scale(1.35,1)!important;opacity:1!important}
#secret-cinema .rift-opening>svg{animation:none!important}
#secret-cinema .secret-world{display:block;opacity:0;transition:opacity 2s ease}
#secret-cinema.secret-expanded .secret-world{opacity:1}
.secret-walker{transform:translateX(65px)}
.secret-body{transform-origin:0 640px;transform:scaleX(.55)}
.secret-leg{transform-box:view-box;transform-origin:0px 624px}
#secret-cinema.secret-walking .secret-walker{animation:secret-cross 6s linear both}
#secret-cinema.secret-walking .secret-body{animation:secret-step .85s ease-in-out infinite}
#secret-cinema.secret-walking .secret-leg-front{animation:secret-stride .85s ease-in-out infinite alternate}
#secret-cinema.secret-walking .secret-leg-back{animation:secret-stride .85s -.85s ease-in-out infinite alternate-reverse}
@keyframes secret-cross{from{transform:translateX(65px)}to{transform:translateX(345px)}}
@keyframes secret-step{0%,100%{transform:translateY(0) rotate(-1deg) scaleX(.55)}50%{transform:translateY(-2px) rotate(1deg) scaleX(.55)}}
@keyframes secret-stride{from{transform:rotate(-10deg)}to{transform:rotate(10deg)}}
.secret-exit{position:absolute;top:max(20px,env(safe-area-inset-top));right:20px;z-index:2;padding:11px 18px;font:inherit;font-size:13px;background:#0b0b17c9;border:1px solid #74658f;border-radius:999px;color:#e2daef;cursor:pointer}
.secret-exit:focus-visible,.secret-trigger:focus-visible{outline:2px solid #a7ddeb;outline-offset:4px}
.secret-caption{position:absolute;z-index:2;bottom:max(10%,60px);inset-inline:20px;text-align:center;font-size:clamp(23px,5.5vw,42px);font-weight:800;text-shadow:0 3px 24px #000,0 0 50px #000;opacity:0;transform:translateY(12px);transition:opacity 1.4s ease,transform 1.4s ease;pointer-events:none}
#secret-cinema.secret-reveal .secret-caption{opacity:1;transform:none}
#secret-cinema.secret-still *{animation:none!important;transition:none!important}
#secret-cinema.secret-still .secret-walker{transform:translateX(200px)}
.motion-paused #secret-cinema *{animation:none!important;transition:none!important}
@media(prefers-reduced-motion:reduce){#secret-cinema *{animation:none!important;transition:none!important}}
`;
document.head.append(style);
const entry=document.createElement('div');entry.className='secret-entry';
entry.innerHTML='<button class="secret-trigger" type="button" aria-haspopup="dialog" aria-controls="secret-cinema">אל תפתחו את זה</button><span class="secret-mark" hidden>✧ הסדק זוכר אתכם</span>';
hero.append(entry);
const trigger=entry.querySelector('button'),mark=entry.querySelector('span');
const dialog=document.createElement('dialog');dialog.id='secret-cinema';
dialog.setAttribute('aria-label','הצצה לעולם שמעבר לסדק');
dialog.innerHTML='<button class="secret-exit" type="button" autofocus>סגירה ✕</button><div class="secret-caption" role="status" aria-live="polite"></div>';
document.body.append(dialog);
const caption=dialog.querySelector('.secret-caption');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let timers=[],active=false,closing=false,placeholder=null,originalAnchorStyle=null,oldOverflow='',initialRect=null;
function schedule(f,ms){timers.push(setTimeout(f,ms));}
function clear(){timers.forEach(clearTimeout);timers=[];}
function restore(){
 if(!active)return;
 clear();active=false;closing=false;
 if(placeholder){placeholder.replaceWith(scene);placeholder=null;}
 if(originalAnchorStyle===null)anchor.removeAttribute('style');else anchor.setAttribute('style',originalAnchorStyle);
 document.body.style.overflow=oldOverflow;
 dialog.className='';caption.textContent='';mark.hidden=false;
 trigger.focus({preventScroll:true});
}
function finish(){if(dialog.open)dialog.close();restore();}
function close(immediate=false){
 if(!active)return;
 if(immediate){clear();finish();return;}
 if(closing)return;
 closing=true;clear();
 if(immediate||dialog.classList.contains('secret-still')){finish();return;}
 dialog.classList.remove('secret-expanded','secret-reveal');
 if(initialRect)Object.assign(anchor.style,{top:initialRect.top+'px',left:initialRect.left+'px',width:initialRect.width+'px',height:initialRect.height+'px'});
 schedule(finish,2450);
}
trigger.addEventListener('click',()=>{
 if(active)return;
 initialRect=anchor.getBoundingClientRect();originalAnchorStyle=anchor.getAttribute('style');
 placeholder=document.createComment('original cinematic background');scene.before(placeholder);
 oldOverflow=document.body.style.overflow;
 dialog.prepend(scene);
 Object.assign(anchor.style,{top:initialRect.top+'px',left:initialRect.left+'px',width:initialRect.width+'px',height:initialRect.height+'px'});
 const still=reduced.matches||document.documentElement.classList.contains('motion-paused');
 dialog.classList.toggle('secret-still',still);
 active=true;closing=false;caption.textContent='';dialog.showModal();document.body.style.overflow='hidden';
 anchor.getBoundingClientRect();
 schedule(()=>{
  if(!active||closing)return;
  const width=Math.min(900,window.innerWidth*1.3);
  Object.assign(anchor.style,{top:'0px',left:(window.innerWidth-width)/2+'px',width:width+'px',height:window.innerHeight+'px'});
  dialog.classList.add('secret-expanded');
 },60);
 schedule(()=>dialog.classList.add('secret-walking'),2600);
 schedule(()=>{caption.textContent='עכשיו הוא יודע שאתם כאן.';dialog.classList.add('secret-reveal');},8700);
 schedule(()=>close(),13000);
});
dialog.querySelector('.secret-exit').addEventListener('click',()=>close(true));
dialog.addEventListener('cancel',event=>{event.preventDefault();close(true)});
dialog.addEventListener('close',restore);
document.addEventListener('visibilitychange',()=>{if(document.hidden)close(true)});
})();
