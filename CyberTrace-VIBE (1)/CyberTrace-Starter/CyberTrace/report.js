'use strict';
const reference = {
  sender: ['Unverified sender','Check the sender identity through an official channel.'],
  urgency: ['Artificial urgency','Avoid reacting to pressure before you verify.'],
  secrets: ['Request for secret credentials','Never disclose passwords or one-time codes from unsolicited messages.'],
  link: ['Untrusted verification link','Do not follow unexpected links; navigate independently.']
};
const params = new URLSearchParams(window.location.search);
const decision = params.get('decision');
if (decision !== 'suspicious' && decision !== 'legitimate') {
  document.getElementById('no-result').hidden = false;
} else {
  document.getElementById('report-content').hidden = false;
  const found = [...new Set((params.get('clues') || '').split(',').filter(id => Object.hasOwn(reference,id)))];
  const correct = decision === 'suspicious';
  const score = found.length * 15 + (correct ? 40 : 0);
  const V = window.Vibe;
  const secs = Math.max(0, parseInt(params.get('t') || '0', 10) || 0);
  const rank = score >= 100 ? 'ELITE DETECTIVE' : score >= 75 ? 'SENIOR ANALYST' : score >= 40 ? 'JUNIOR TRACKER' : 'ROOKIE // RETRY';
  const num = document.getElementById('score-number');
  num.textContent = '0';
  if (V) {
    V.countUp(num, score, 1500, () => {
      if (score >= 75) { V.confetti(score === 100 ? 260 : 150); V.flash(); V.sfx('win'); V.toast('★ RANK UNLOCKED: ' + rank); }
      else { V.shake(); V.sfx('lose'); V.toast('✕ ' + rank, true); }
    });
  } else num.textContent = String(score);
  const badge = document.createElement('span');
  badge.className = 'v-rank';
  badge.textContent = '◆ ' + rank + (secs ? ' · ' + Math.floor(secs / 60) + 'm ' + (secs % 60) + 's' : '');
  document.getElementById('result-status').after(badge);
  document.getElementById('found-count').textContent = `${found.length} / 4`;
  document.getElementById('result-heading').textContent = correct ? 'Correct judgement.' : 'Take another look.';
  document.getElementById('result-subtitle').textContent = correct ? 'You identified the suspicious message. Review the details you spotted and any you missed.' : 'This message is suspicious. Review the warning signs and try the investigation again.';
  document.getElementById('result-status').textContent = correct ? 'VERDICT: SUSPICIOUS ✓' : 'VERDICT: LEGITIMATE ✕';
  const list = document.getElementById('report-evidence');
  for (const [id, [name, tip]] of Object.entries(reference)) {
    const row = document.createElement('div'); row.className = 'report-clue';
    const mark = document.createElement('span'); mark.className = found.includes(id) ? 'found' : 'missed'; mark.textContent = found.includes(id) ? '✓' : '○';
    const body = document.createElement('div'); const strong = document.createElement('strong'); strong.textContent = name;
    const p = document.createElement('p'); p.textContent = found.includes(id) ? 'Evidence collected. ' + tip : 'Missed clue. ' + tip;
    body.append(strong, p); row.append(mark, body); list.append(row);
  }
}
