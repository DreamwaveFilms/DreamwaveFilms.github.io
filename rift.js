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
  // Trial: chipped rock planes share the same travelling deformation as the rim.
  const rim = scene.querySelector('.rift-opening svg > path');
  if (rim) {
    const banks = [[[210,10],[188,138],[145,222],[163,278],[105,371],[125,417],[95,502],[152,565],[140,630],[185,732],[193,860]],[[210,10],[228,133],[260,208],[249,280],[298,342],[269,436],[290,492],[238,582],[246,642],[221,737],[193,860]]];
    const planes = ['', '', '', ''];
    banks.forEach((bank,b) => bank.slice(1).forEach(([x,y],i) => {
      const [a,h]=bank[i], dir=b?1:-1;
      const tip=Math.sin(Math.PI*(h+y)/1800);
      const mid=Math.round((a+x)/2+dir*(7+i%4)*tip), level=Math.round(h+(y-h)*(.37+(i%3)*.08));
      const chip=Math.round(mid+dir*(11+i%5)*tip);
      planes[b*2]+='M'+a+' '+h+'L'+mid+' '+level+' '+x+' '+y+'Z';
      planes[b*2+1]+='M'+a+' '+h+'L'+chip+' '+(level-7)+' '+mid+' '+level+'Z';
    }));
    planes.forEach((d,i)=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);p.setAttribute('fill',['#777183','#343342','#353b46','#85919b'][i]);p.setAttribute('opacity',['.84','.88','.94','.69'][i]);rim.after(p);});
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
