'use strict';
// Client-side educational simulation. No live phishing emails or external requests.
const clues = {
  sender: { title: 'Unverified sender', description: 'The sender uses a domain that does not itself prove an affiliation with a recognised scholarship provider.' },
  urgency: { title: 'Artificial urgency', description: 'The 30-minute deadline pressures recipients to act without verifying the message.' },
  secrets: { title: 'Request for secret credentials', description: 'A message asking for your password and one-time code is a major warning sign.' },
  link: { title: 'Untrusted verification link', description: 'The link points to a separate domain. Verify claims using a trusted, independently located website.' }
};
const selected = new Set();
let verdict = null;
const evidenceList = document.getElementById('evidence-list');
const count = document.getElementById('count');
const progress = document.getElementById('progress');
const submit = document.getElementById('submit-case');
const V = window.Vibe || { sfx(){}, toast(){}, shake(){}, flash(){}, confetti(){} };
const startedAt = Date.now();
// --- vibe HUD: timer, clue counter, threat-confidence meter, live terminal ---
const panel = document.querySelector('.clues-panel');
const hud = document.createElement('div');
hud.className = 'v-hud';
hud.innerHTML = '<div>TIME<b id="v-time">00:00</b></div><div>CLUES<b id="v-clues">0</b></div><div>RANK<b id="v-rank">N00B</b></div>';
const threat = document.createElement('div');
threat.innerHTML = '<div class="v-threat"><span>THREAT CONFIDENCE</span><span id="v-threat-pct">0%</span></div><div class="v-threat-bar"><i id="v-threat-fill" style="width:0%"></i></div>';
const term = document.createElement('div');
term.className = 'v-term'; term.setAttribute('aria-hidden', 'true');
if (panel) panel.append(hud, threat, term);
function log(msg) {
  const row = document.createElement('div');
  row.textContent = '> ' + msg;
  term.appendChild(row);
  while (term.children.length > 6) term.firstChild.remove();
}
log('case_001 loaded. awaiting input...');
const pad = n => String(n).padStart(2, '0');
setInterval(() => {
  const t = Math.floor((Date.now() - startedAt) / 1000);
  const el = document.getElementById('v-time');
  if (el) el.textContent = pad(Math.floor(t / 60)) + ':' + pad(t % 60);
}, 1000);
const ranks = ['N00B', 'TRACKER', 'ANALYST', 'HUNTER', 'ELITE'];
const clueSounds = { sender: 'ID spoofing suspected', urgency: 'psychological pressure detected', secrets: 'CREDENTIAL HARVEST ATTEMPT', link: 'malicious redirect flagged' };
function render() {
  count.textContent = `${selected.size} / 4`;
  progress.style.width = `${selected.size * 25}%`;
  document.querySelectorAll('[data-clue]').forEach(button => {
    const active = selected.has(button.dataset.clue);
    button.classList.toggle('collected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-verdict]').forEach(button => {
    const active = button.dataset.verdict === verdict;
    button.classList.toggle('chosen', active);
    button.setAttribute('aria-pressed', String(active));
  });
  evidenceList.replaceChildren();
  if (!selected.size) {
    const placeholder = document.createElement('div');
    placeholder.className = 'empty-evidence';
    placeholder.textContent = 'No evidence collected yet. Start by inspecting the sender.';
    evidenceList.appendChild(placeholder);
  } else {
    for (const id of selected) {
      const item = document.createElement('div');
      item.className = 'evidence-item';
      const title = document.createElement('strong');
      title.textContent = `✓ ${clues[id].title}`;
      const detail = document.createElement('p');
      detail.textContent = clues[id].description;
      item.append(title, detail);
      evidenceList.appendChild(item);
    }
  }
  submit.disabled = !verdict;
  const pct = selected.size * 25;
  const set = (id, fn) => { const el = document.getElementById(id); if (el) fn(el); };
  set('v-clues', el => el.textContent = String(selected.size));
  set('v-rank', el => el.textContent = ranks[selected.size]);
  set('v-threat-pct', el => el.textContent = pct + '%');
  set('v-threat-fill', el => el.style.width = pct + '%');
  const pill = document.querySelector('.email-panel .pill');
  if (pill) { pill.classList.toggle('cleared', selected.size === 4); pill.textContent = selected.size === 4 ? 'FULLY ANALYSED' : 'UNVERIFIED'; }
}
document.querySelectorAll('[data-clue]').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.clue;
    if (selected.has(id)) { selected.delete(id); V.sfx('off'); log('evidence removed: ' + id); }
    else {
      selected.add(id); V.sfx('ping');
      log('CAPTURED ' + id.toUpperCase() + ' // ' + clueSounds[id]);
      V.toast('◆ EVIDENCE CAPTURED: ' + clues[id].title.toUpperCase());
      if (id === 'secrets') { V.shake(); V.sfx('alarm'); V.toast('⚠ CREDENTIAL THEFT ATTEMPT', true); }
      if (selected.size === 4) { V.flash(); V.confetti(90); V.sfx('win'); V.toast('★ ALL CLUES FOUND — CASE CRACKED', false, 3200); log('ALL EVIDENCE SECURED. submit verdict.'); }
    }
    render();
  });
});
document.querySelectorAll('[data-verdict]').forEach(button => {
  button.addEventListener('click', () => { verdict = button.dataset.verdict; V.sfx('click'); log('verdict locked: ' + verdict.toUpperCase()); render(); });
});
document.getElementById('reset-case').addEventListener('click', () => {
  selected.clear(); verdict = null; V.sfx('off'); log('workspace wiped.'); render();
});
submit.addEventListener('click', () => {
  if (!verdict) return;
  const params = new URLSearchParams({ decision: verdict, clues: Array.from(selected).join(','), t: String(Math.floor((Date.now() - startedAt) / 1000)) });
  // Query parameters provide an offline-safe fallback when localStorage is disabled for file:// pages.
  submit.disabled = true; submit.textContent = 'DECRYPTING REPORT...';
  log('compiling case report...'); V.flash(); V.sfx('boot');
  setTimeout(() => { window.location.href = `report.html?${params.toString()}`; }, V.reduce ? 0 : 750);
});
render();
