'use strict';
/* CYBERTRACE VIBE LAYER — pure vanilla JS, fully offline, no trackers. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, sset(k, v) { try { sessionStorage.setItem(k, v); } catch {} } };

  /* ---------- sound (WebAudio synth, no files) ---------- */
  let ctx = null, muted = store.get('ct-muted') === '1';
  function tone(freq, dur, type = 'square', vol = .05, delay = 0, slide = 0) {
    if (muted) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + .02);
    } catch {}
  }
  const sfx = name => ({
    click: () => tone(660, .06, 'square', .035),
    hover: () => tone(1200, .03, 'sine', .015),
    ping: () => { tone(880, .09, 'triangle', .07); tone(1320, .16, 'triangle', .06, .08); },
    off: () => tone(520, .12, 'sawtooth', .05, 0, -300),
    alarm: () => { tone(220, .18, 'sawtooth', .06); tone(165, .22, 'sawtooth', .06, .18); },
    win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, 'triangle', .07, i * .09)),
    lose: () => [392, 330, 262, 196].forEach((f, i) => tone(f, .22, 'sawtooth', .05, i * .12)),
    boot: () => tone(110, .5, 'sawtooth', .04, 0, 600),
    type: () => tone(1800 + Math.random() * 600, .015, 'square', .012),
  }[name] || (() => {}))();

  /* ---------- helpers ---------- */
  function toast(msg, hot = false, ms = 2600) {
    let box = $('.v-toasts'); if (!box) { box = document.createElement('div'); box.className = 'v-toasts'; box.setAttribute('aria-live', 'polite'); document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'v-toast' + (hot ? ' hot' : ''); t.textContent = msg; box.appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, ms);
  }
  function shake(el = document.querySelector('.site-shell')) { if (reduce || !el) return; el.classList.remove('v-shake'); void el.offsetWidth; el.classList.add('v-shake'); }
  function flash() { if (reduce) return; const f = document.createElement('div'); f.className = 'v-flash'; document.body.appendChild(f); setTimeout(() => f.remove(), 520); }
  function countUp(el, to, ms = 1400, done) {
    if (reduce) { el.textContent = String(to); done && done(); return; }
    const t0 = performance.now();
    (function step(t) { const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3); el.textContent = String(Math.round(to * e)); if (el.parentElement) el.parentElement.style.setProperty('--pct', String(to * e)); p < 1 ? requestAnimationFrame(step) : done && done(); })(t0);
  }
  function confetti(n = 160) {
    if (reduce) return;
    const c = document.createElement('canvas'); c.className = 'v-confetti'; c.width = innerWidth; c.height = innerHeight; document.body.appendChild(c);
    const g = c.getContext('2d'), cols = ['#39ffd8', '#ff2e93', '#b6ff3c', '#ffb45c', '#19c9ff', '#fff'];
    const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 18, vy: -Math.random() * 16 - 4, s: 4 + Math.random() * 7, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[(Math.random() * cols.length) | 0] }));
    let f = 0;
    (function tick() {
      g.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; g.save(); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.shadowColor = p.c; g.shadowBlur = 8; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); });
      (++f < 170) ? requestAnimationFrame(tick) : c.remove();
    })();
  }
  function typeInto(el, text, speed = 28, cb) {
    if (reduce) { el.textContent = text; cb && cb(); return; }
    let i = 0; el.textContent = '';
    const caret = document.createElement('span'); caret.className = 'v-caret'; el.appendChild(caret);
    (function step() { if (i < text.length) { caret.before(text[i++]); if (i % 3 === 0) sfx('type'); setTimeout(step, speed + Math.random() * 25); } else { cb && cb(); } })();
  }
  window.Vibe = { sfx, toast, shake, flash, countUp, confetti, typeInto, reduce };

  /* ---------- matrix rain ---------- */
  if (!reduce) {
    const cv = document.createElement('canvas'); cv.id = 'v-rain'; document.body.prepend(cv);
    const g = cv.getContext('2d'); let cols, drops; const sz = 16;
    const glyphs = 'アイウエオカキクケコサシスセソ01{}<>/\\|=+*#$%&@ABCDEF0123456789';
    const fit = () => { cv.width = innerWidth; cv.height = innerHeight; cols = Math.ceil(cv.width / sz); drops = Array.from({ length: cols }, () => Math.random() * -50); };
    fit(); addEventListener('resize', fit);
    let last = 0;
    (function draw(t) {
      if (t - last > 55) {
        last = t; g.fillStyle = 'rgba(5,11,20,.12)'; g.fillRect(0, 0, cv.width, cv.height); g.font = sz + 'px monospace';
        for (let i = 0; i < cols; i++) {
          const ch = glyphs[(Math.random() * glyphs.length) | 0];
          g.fillStyle = Math.random() > .975 ? '#ffffff' : (i % 11 === 0 ? '#ff2e93' : '#39ffd8');
          g.fillText(ch, i * sz, drops[i] * sz);
          if (drops[i] * sz > cv.height && Math.random() > .975) drops[i] = 0; drops[i] += .6 + (i % 3) * .2;
        }
      }
      requestAnimationFrame(draw);
    })(0);
  }

  /* ---------- cursor, trail, scroll bar ---------- */
  const bar = document.createElement('div'); bar.className = 'v-progress'; document.body.appendChild(bar);
  addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (h > 0 ? scrollY / h * 100 : 0) + '%'; }, { passive: true });
  if (fine && !reduce) {
    const dot = document.createElement('div'), ring = document.createElement('div'); dot.className = 'v-cursor'; ring.className = 'v-cursor-ring'; document.body.append(dot, ring);
    let mx = 0, my = 0, rx = 0, ry = 0, lt = 0;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`;
      if (e.timeStamp - lt > 35) { lt = e.timeStamp; const t = document.createElement('div'); t.className = 'v-trail'; t.style.left = mx + 'px'; t.style.top = my + 'px'; document.body.appendChild(t); setTimeout(() => t.remove(), 620); }
    });
    (function loop() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', e => { const hot = e.target.closest('a, button, .clue'); ring.classList.toggle('hot', !!hot); if (hot) sfx('hover'); });
    document.addEventListener('mousedown', () => { ring.style.borderColor = '#ff2e93'; sfx('click'); });
    document.addEventListener('mouseup', () => { ring.style.borderColor = ''; });
  } else { document.addEventListener('click', e => { if (e.target.closest('a, button')) sfx('click'); }); }

  /* ---------- glitch headings ---------- */
  $$('.hero h1, .page-intro h1').forEach(h => { h.classList.add('glitch'); h.dataset.text = h.innerText; });

  /* ---------- tilt + spotlight ---------- */
  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.step-card, .panel');
    if (card) { const r = card.getBoundingClientRect(); card.style.setProperty('--mx', (e.clientX - r.left) + 'px'); card.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
    if (reduce) return;
    const sf = $('.scan-frame');
    if (sf) { const r = sf.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      if (Math.abs(x) < 1 && Math.abs(y) < 1) sf.style.transform = `perspective(900px) rotateY(${x * 16}deg) rotateX(${-y * 16}deg) scale(1.02)`; else sf.style.transform = ''; }
  });

  /* ---------- scroll reveal ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 });
    $$('.section-heading, .step-card, .panel, .about-visual figure, .callout, .report-clue').forEach((el, i) => { el.classList.add('v-reveal'); el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });
  }

  /* ---------- homepage: boot sequence + typewriter ---------- */
  const hero = $('.hero-description');
  if (hero) {
    const line = document.createElement('div'); line.className = 'v-type'; line.setAttribute('aria-hidden', 'true'); hero.after(line);
    const phrases = ['> scanning inbox for threats...', '> 4 hidden clues detected', '> trust nothing. verify everything.', '> your move, detective.'];
    let pi = 0; const cycle = () => typeInto(line, phrases[pi++ % phrases.length], 34, () => setTimeout(cycle, 1900)); setTimeout(cycle, reduce ? 0 : 700);
  }
  if (document.querySelector('.hero') && !reduce && !store.sget('ct-booted')) {
    store.sset('ct-booted', '1');
    const boot = document.createElement('div'); boot.className = 'v-boot';
    boot.innerHTML = '<pre></pre><div class="v-boot-skip">CLICK OR PRESS ANY KEY TO SKIP ▸</div>'; document.body.appendChild(boot);
    const pre = boot.firstElementChild;
    const lines = ['CYBERTRACE OS v2.6.0 — forensic kernel', 'initialising secure enclave ........ <span class="ok">[ OK ]</span>', 'mounting evidence vault ............ <span class="ok">[ OK ]</span>', 'loading phishing signatures ........ <span class="ok">[ OK ]</span>', 'calibrating suspicion engine ....... <span class="warn">[ WARN ]</span>', 'tracing unknown sender ............. <span class="bad">[ FOUND ]</span>', '', '<span class="ok">ACCESS GRANTED. Welcome, detective.</span>'];
    let i = 0, ended = false; const end = () => { if (ended) return; ended = true; boot.classList.add('done'); sfx('ping'); setTimeout(() => boot.remove(), 700); };
    boot.addEventListener('click', end); addEventListener('keydown', end, { once: true });
    sfx('boot'); (function next() { if (ended) return; if (i < lines.length) { pre.innerHTML += lines[i++] + '\n'; setTimeout(next, 260); } else setTimeout(end, 650); })();
  }

  /* ---------- sound toggle ---------- */
  const mute = document.createElement('button'); mute.className = 'v-mute'; mute.type = 'button';
  const paint = () => { mute.textContent = muted ? '🔇' : '🔊'; mute.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off'); };
  mute.addEventListener('click', e => { e.stopPropagation(); muted = !muted; store.set('ct-muted', muted ? '1' : '0'); paint(); if (!muted) sfx('ping'); }); paint(); document.body.appendChild(mute);

  /* ---------- konami easter egg ---------- */
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']; let ki = 0;
  addEventListener('keydown', e => { ki = (e.key === code[ki] || e.key.toLowerCase() === code[ki]) ? ki + 1 : 0;
    if (ki === code.length) { ki = 0; document.body.classList.toggle('v-rainbow'); confetti(220); flash(); sfx('win'); toast('◆ KONAMI MODE: RAINBOW HACKER UNLOCKED'); } });
  console.log('%c CYBERTRACE ', 'background:#39ffd8;color:#04121b;font:900 20px monospace', '\nTry: ↑ ↑ ↓ ↓ ← → ← → B A');
})();
