(() => {
  'use strict';
  if (document.getElementById('yc-entry')) return;
  const story = {
    start: {lines:['רגע… ההודעה הזאת באמת הגיעה למישהו?','אני יונתן. אני צריך עזרה. יש מישהו מחוץ לדלת.'], choices:[['אל תפתח. תנסה לשמוע מי שם.','listen'],['יש לך דרך אחרת לצאת?','window'],['איך אני יודע שזה באמת אתה?','identity']]},
    listen: {lines:['שלוש נקישות. הפסקה. ועוד שלוש.','הוא קרא בשם שלי. אבל הקול… נשמע בדיוק כמוני.'], choices:[['תתרחק מהדלת ותכבה את האור.','dark'],['תשאל אותו משהו שרק אתה יודע.','identity']]},
    window: {lines:['יש חלון בקצה המסדרון. מעבר לו אני רואה את הרחוב שלי.','אבל המכוניות לא זזות. אפילו העשן עומד במקום.'], choices:[['זה לא הרחוב שלך. חפש סימן אחר.','signal'],['תבדוק את ההשתקפות בחלון.','reflection']]},
    identity: {lines:['שאלה טובה. אני כבר לא בטוח למי אפשר להאמין פה.','כשנכנסתי לכאן, השעון שלי נעצר. עכשיו הוא מתקתק רק כשמגיעה ממך הודעה.'], choices:[['אז הקשר בינינו אמיתי. עקוב אחרי התקתוק.','signal'],['תבדוק אם גם הצל שלך זז איתך.','reflection']]},
    dark: {lines:['כיביתי. הנקישות הפסיקו.','עכשיו יש פס אור מתחת לדלת אחרת. הוא מהבהב בקצב ההודעות שלך.'], choices:[['תלך לכיוון פס האור. אני איתך.','signal'],['תישאר במקום. אל תיתן לו למצוא אותך.','quiet']]},
    reflection: {lines:['הרמתי יד. ההשתקפות לא זזה.','עכשיו היא מחייכת. אני לא.'], choices:[['אל תתקרב לזכוכית. עקוב אחרי האור בטלפון.','signal'],['תשאל את ההשתקפות איפה היציאה.','mirror']]},
    signal: {lines:['האור בטלפון מצביע על סדק בקיר. הוא נפתח קצת בכל פעם שאתה עונה.','אני שומע צעדים מאחוריי. לשלוח עוד הודעה או לנתק?'], choices:[['אני כאן. תעבור עכשיו!','escape'],['תנתק כדי שלא יעקבו אחרי האות.','quiet'],['רגע. מי באמת עומד מאחוריך?','mirror']]},
    escape: {lines:['עברתי. אני מרגיש רוח. המכוניות שוב זזות.','לא יודע מי אתה, אבל הפעם לא הייתי לבד. תודה.'], end:'אות חיים', detail:'השארת את הקשר פתוח — ויונתן מצא דרך החוצה.', number:1},
    quiet: {lines:['בסדר. מכבה את הטלפון.','אם תגיע עוד הודעה מהמספר הזה… אל תענה מיד.'], end:'דממה בצד השני', detail:'האות נעלם. האם הניתוק הסתיר את יונתן — או השאיר אותו שם?', number:2},
    mirror: {lines:['יונתן לא יכול לענות כרגע.','אבל תודה שהשארת את הקשר פתוח. עכשיו גם אנחנו יודעים שיש צד שני.'], end:'מישהו אחר ענה', detail:'הקשר נשאר פתוח. רק שמי שענה בסוף לא היה יונתן.', number:3}
  };
  const style = document.createElement('style');
  style.textContent = `
  #yc-entry{position:relative;margin:30px 0;padding:26px;border:1px solid #65518e;border-radius:22px;background:radial-gradient(ellipse at 95% 0,#49347555,transparent 65%),#0c111c;display:flex;align-items:center;justify-content:space-between;gap:22px;text-align:right}
  #yc-entry h2{font-size:clamp(21px,4vw,29px);margin:8px 0}#yc-entry p{color:#b1bed0;margin:0;max-width:570px}#yc-entry small{color:#9ee7e2;letter-spacing:.06em}
  .yc-btn{font:inherit;cursor:pointer;border-radius:12px;min-height:46px;padding:11px 17px;border:1px solid #66568e;background:#1b2033;color:#f5f3ff}.yc-btn:hover{background:#2b304b;border-color:#b5a4ed}.yc-btn:focus-visible{outline:3px solid #87e4ed;outline-offset:3px}.yc-primary{background:#7858cc;white-space:nowrap;font-weight:bold}
  #yc-dialog{padding:0;border:1px solid #605080;border-radius:22px;width:min(540px,calc(100% - 24px));height:min(760px,calc(100dvh - 32px));max-height:calc(100dvh - 32px);background:#0b1019;color:#eef3fa;overflow:hidden;box-shadow:0 24px 100px #0009;direction:rtl}
  #yc-dialog::backdrop{background:#03050ce8}#yc-dialog[open]{display:flex;flex-direction:column}
  .yc-head{display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid #273246;background:#131a29}.yc-avatar{display:grid;place-items:center;width:42px;height:42px;border:1px solid #9b80cc;border-radius:50%;background:#312449;color:#ddd2fa;font-weight:bold}.yc-person{flex:1}.yc-person strong{display:block}.yc-person small{color:#9cc9c6;font-size:12px}.yc-close{font-size:20px;padding:5px 13px}
  .yc-note{text-align:center;font-size:11px;color:#9baac2;padding:10px 16px;background:#0e1522}.yc-log{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:18px;display:flex;flex-direction:column;gap:12px}.yc-bubble{max-width:88%;padding:12px 15px;border-radius:16px 4px 16px 16px;background:#202a3b;align-self:flex-start;white-space:pre-line;line-height:1.65;overflow-wrap:anywhere}.yc-bubble.yc-me{background:#493374;align-self:flex-end;border-radius:4px 16px 16px 16px}.yc-bubble small{display:block;color:#b1bed0;font-size:10px;margin-bottom:4px}.yc-typing{color:#a2adc2;padding:0 18px;font-size:12px;min-height:22px}.yc-choices{display:grid;gap:8px;padding:12px 16px 16px;border-top:1px solid #253047;max-height:40%;overflow:auto}.yc-choices .yc-btn{text-align:right}.yc-ending{padding:20px;border:1px solid #756297;background:linear-gradient(145deg,#2c2042,#10252d);border-radius:16px}.yc-ending h3{margin:6px 0}.yc-ending p{margin:0;color:#ced6e3}.yc-ending small{color:#aee5e1}
  @media(max-width:560px){#yc-entry{display:block;padding:22px}#yc-entry>.yc-btn{margin-top:18px;width:100%}.yc-head{padding:12px}.yc-log{padding:14px}.yc-bubble{max-width:94%}.yc-choices{padding:10px 12px 12px}}
  `;
  document.head.append(style);
  const entry = document.createElement('section'); entry.id='yc-entry';
  entry.innerHTML='<div><small>שידור נכנס · מהצד השני</small><h2>יונתן מחכה לתשובה שלך.</h2><p>הודעה אחת חצתה את הסדק. הבחירות שלך יקבעו מי יענה בסוף.</p><p style="font-size:12px;margin-top:8px">סיפור אינטראקטיבי קצר · 3 סיומים · ללא ספוילרים</p></div><button type="button" class="yc-btn yc-primary">פתיחת ההודעה ←</button>';
  const anchor=document.querySelector('[aria-labelledby="trailer-2-video-title"]') || document.querySelector('.grid');
  if (!anchor) return; anchor.before(entry);
  const dialog=document.createElement('dialog'); dialog.id='yc-dialog'; dialog.setAttribute('aria-labelledby','yc-title');
  dialog.innerHTML='<div class="yc-head"><span class="yc-avatar" aria-hidden="true">י</span><div class="yc-person"><strong id="yc-title">יונתן · העולם המקביל</strong><small id="yc-signal">הקשר נפתח</small></div><button type="button" class="yc-btn yc-close" aria-label="סגירת ההתכתבות">×</button></div><div class="yc-note">סיפור צדדי בדיוני עם תשובות לבחירה, לא צ׳אט עם אדם אמיתי.</div><div class="yc-log" role="log" aria-label="ההתכתבות עם יונתן" aria-live="polite" aria-relevant="additions" tabindex="0"></div><div class="yc-typing" role="status"></div><div class="yc-choices" aria-label="בחירת תשובה"></div>';
  document.body.append(dialog);
  const log=dialog.querySelector('.yc-log'), choices=dialog.querySelector('.yc-choices'), typing=dialog.querySelector('.yc-typing'), signal=dialog.querySelector('#yc-signal');
  let generation=0, timer=null, resolver=null, busy=false, oldOverflow='';
  function cancel(){generation++;clearTimeout(timer);if(resolver){resolver();resolver=null;}}
  function wait(ms){return new Promise(resolve=>{resolver=resolve;timer=setTimeout(()=>{resolver=null;resolve();},ms);});}
  function bubble(text,me=false){const el=document.createElement('div');el.className='yc-bubble'+(me?' yc-me':'');const name=document.createElement('small');name.textContent=me?'אתה':'יונתן';el.append(name,document.createTextNode(text));log.append(el);log.scrollTop=log.scrollHeight;}
  async function play(id){
    busy=true; const token=++generation,node=story[id]; choices.replaceChildren();
    for(const line of node.lines){typing.textContent='יונתן מקליד…';await wait(matchMedia('(prefers-reduced-motion: reduce)').matches?200:1050);if(token!==generation||!dialog.open)return;typing.textContent='';bubble(line);await wait(300);if(token!==generation||!dialog.open)return;}
    busy=false;
    if(node.end){signal.textContent='השידור הסתיים';const card=document.createElement('div');card.className='yc-ending';const k=document.createElement('small');k.textContent='סיום '+node.number+' מתוך 3';const h=document.createElement('h3');h.textContent=node.end;const p=document.createElement('p');p.textContent=node.detail;card.append(k,h,p);log.append(card);log.scrollTop=log.scrollHeight;button('לנסות דרך אחרת',reset);button('חזרה לאתר',()=>dialog.close());}
    else node.choices.forEach(([text,next])=>button(text,()=>{if(busy)return;bubble(text,true);play(next);}));
  }
  function button(label,action){const b=document.createElement('button');b.type='button';b.className='yc-btn';b.textContent=label;b.addEventListener('click',action);choices.append(b);}
  function reset(){cancel();log.replaceChildren();choices.replaceChildren();typing.textContent='';signal.textContent='מחובר דרך הסדק';play('start');}
  entry.querySelector('button').addEventListener('click',()=>{if(dialog.open)return;oldOverflow=document.body.style.overflow;dialog.showModal();document.body.style.overflow='hidden';reset();});
  dialog.querySelector('.yc-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{cancel();typing.textContent='';document.body.style.overflow=oldOverflow;entry.querySelector('button').focus();});
})();
