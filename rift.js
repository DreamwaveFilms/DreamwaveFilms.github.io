(() => {
  const scene = document.querySelector('.cinema-scene');
  const toggle = document.getElementById('motion-toggle');
  if (!scene) return;
  // Same Israeli premiere instant as the existing countdown. Growth is date-based,
  // not visit-based: refreshing the page never resets the opening.
  const start = Date.parse('2026-10-12T00:00:00+03:00');
  const release = Date.parse('2027-01-08T18:00:00+02:00');
  let waveAmplitude = 4;
  let wavePeriod = 12;
  function updateRift() {
    const progress = Math.max(0, Math.min(1, (Date.now() - start) / (release - start)));
    const growth = progress * progress * (3 - 2 * progress);
    waveAmplitude = 4 + 16 * growth;
    wavePeriod = 12 - 7.5 * growth;
    scene.style.setProperty('--rift-width', (.16 + .84 * growth).toFixed(4));
    scene.style.setProperty('--rift-height', (.68 + .32 * growth).toFixed(4));
    scene.style.setProperty('--rift-opacity', (.5 + .25 * growth).toFixed(4));
  }
  updateRift();
  setInterval(() => { if (!document.hidden) updateRift(); }, 60000);
  let paused = false;
  try { paused = localStorage.getItem('dreamwave-motion-paused') === 'true'; } catch (_) {}

  // Deform the original SVG points together: the glow, edges and branches stay joined.
  // Geometry is parsed once; no filters, libraries or layout reads in the frame loop.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Layered graphic treatment; the existing motion system deforms all planes together.
  const face = scene.querySelector('.rift-opening svg > path');
  if(face){
    const defs=face.ownerSVGElement.querySelector('defs');
    function gradient(id,colors){const g=document.createElementNS(face.namespaceURI,'linearGradient');g.id=id;
      g.setAttribute('x2','1');g.setAttribute('y2','.15');colors.forEach(([offset,color])=>{const s=document.createElementNS(face.namespaceURI,'stop');s.setAttribute('offset',offset);s.setAttribute('stop-color',color);g.append(s)});defs.append(g);}
    gradient('dw-abyss',[[0,'#9393cd'],[.08,'#383354'],[.25,'#121124'],[.56,'#02050d'],[.78,'#0b1e2b'],[.96,'#376377'],[1,'#a7d7d3']]);
    gradient('dw-stone',[[0,'#383340'],[.24,'#817990'],[.5,'#262535'],[.78,'#405566'],[1,'#8eaaae']]);
    face.setAttribute('fill','url(#dw-abyss)');
    const banks=[[[210,10],[188,138],[145,222],[163,278],[105,371],[125,417],[95,502],[152,565],[140,630],[185,732],[193,860]],[[210,10],[228,133],[260,208],[249,280],[298,342],[269,436],[290,492],[238,582],[246,642],[221,737],[193,860]]];
    let paths=Array(6).fill('');const pt=(x,y)=>Math.round(x)+' '+Math.round(y);
    banks.forEach((bank,b)=>{const dir=b?1:-1;bank.slice(1).forEach(([x,y],i)=>{let [a,h]=bank[i];
      const seed=(i*13+b*7)%11, k=.32+seed*.028, my=h+(y-h)*k, mx=a+(x-a)*k;
      const w=Math.sin(Math.PI*my/900)*(13+seed);const A=pt(a,h),B=pt(x,y),C=pt(mx+dir*w,my),D=pt(mx+dir*w*.45,my+7),E=pt(mx-dir*w*.65,my+11);
      paths[0]+='M'+A+'L'+C+' '+B+'Z';paths[1]+='M'+A+'L'+C+' '+D+'Z';
      paths[2]+='M'+A+'L'+E+' '+B+'Z';paths[3]+='M'+A+'L'+D+' '+E+'Z';
      if(i%3!==1) paths[4]+='M'+pt(mx+dir*w*.8,my-4)+'L'+C+' '+pt(mx+dir*w*.55,my+(y-my)*.38);
      if(i%3===1)paths[5]+='M'+C+'L'+pt(mx+dir*(w+12),my-8)+' '+pt(mx+dir*(w+18),my-6)+' '+pt(mx+dir*(w+29),my-24);
    })});
    let last=face;paths.forEach((d,i)=>{let p=document.createElementNS(face.namespaceURI,'path');p.setAttribute('d',d);p.setAttribute('fill',['url(#dw-stone)','#a7a3ba','#060b16','#374158','none','none'][i]);p.setAttribute('opacity',[.92,.62,.93,.84,.88,.65][i]);if(i>=4){p.setAttribute('stroke',i===4?'#c2e7ed':'#76809c');p.setAttribute('stroke-width',i===4?'2.3':'1.4')}last.after(p);last=p});
  }
  const wavePaths = Array.from(scene.querySelectorAll('.rift-opening svg path')).map(node => {
    const original = node.getAttribute('d');
    const tokens = original.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/g);
    const points = [];
    let command = '', x = 0, y = 0, sx = 0, sy = 0, i = 0;
    while (i < tokens.length) {
      if (/^[a-zA-Z]$/.test(tokens[i])) command = tokens[i++];
      if (command === 'Z' || command === 'z') {
        points.push({command:'Z'}); x = sx; y = sy; command = ''; continue;
      }
      // This scene uses only move/line/close commands. Leave any future curves intact.
      if (!/^[mMlL]$/.test(command) || i + 1 >= tokens.length) return null;
      const relative = command === command.toLowerCase();
      x = Number(tokens[i++]) + (relative ? x : 0);
      y = Number(tokens[i++]) + (relative ? y : 0);
      const move = command.toUpperCase() === 'M';
      if (move) { sx = x; sy = y; }
      points.push({command:move ? 'M' : 'L', x, y});
      command = relative ? 'l' : 'L';
    }
    return {node, original, points};
  }).filter(Boolean);
  let waveFrame = null, lastWaveTime = null, phase = 0;
  function renderWave(time) {
    if (lastWaveTime === null) lastWaveTime = time;
    const elapsed = time - lastWaveTime;
    // Cap SVG updates at 30 fps, including on high-refresh phones.
    if (elapsed >= 1000 / 30) {
      phase = (phase + Math.min(elapsed, 100) / 1000 * Math.PI * 2 / wavePeriod) % (Math.PI * 2);
      lastWaveTime = time;
      for (const path of wavePaths) {
        path.node.setAttribute('d', path.points.map(point => {
          if (point.command === 'Z') return 'Z';
          // Taper at both tips; differing phases along the height create a travelling wave.
          const envelope = Math.sin(Math.PI * Math.max(0, Math.min(1, point.y / 900)));
          const offset = waveAmplitude * envelope * Math.sin(point.y / 900 * Math.PI * 3 - phase);
          return point.command + (point.x + offset).toFixed(2) + ' ' + point.y;
        }).join(' '));
      }
    }
    waveFrame = requestAnimationFrame(renderWave);
  }
  function syncWave() {
    if (waveFrame !== null) cancelAnimationFrame(waveFrame);
    waveFrame = null;
    lastWaveTime = null;
    if (reducedMotion.matches) {
      wavePaths.forEach(path => path.node.setAttribute('d', path.original));
    } else if (!paused && !document.hidden && wavePaths.length) {
      waveFrame = requestAnimationFrame(renderWave);
    }
  }
  reducedMotion.addEventListener('change', syncWave);

  function updateMotion() {
    syncWave();
    document.documentElement.classList.toggle('motion-paused', paused || document.hidden);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.textContent = paused ? 'הפעלת אנימציה' : 'השהיית אנימציה';
    }
  }
  if (toggle) {
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      paused = !paused;
      try { localStorage.setItem('dreamwave-motion-paused', String(paused)); } catch (_) {}
      updateMotion();
    });
  }
  document.addEventListener('visibilitychange', () => { updateMotion(); if (!document.hidden) updateRift(); });
  updateMotion();
})();
