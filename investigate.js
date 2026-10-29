 'use strict';
const allCases = window.CYBERTRACE_CASES || [];
const paramsIn = new URLSearchParams(window.location.search);
const caseId = Math.max(1, Math.min(allCases.length || 1, parseInt(paramsIn.get('case') || '1', 10) || 1));
const activeCase = allCases.find(c => c.id === caseId) || allCases[0];
const selected = new Set();
let verdict = null;
const evidenceList = document.getElementById('evidence-list');
const count = document.getElementById('count');
const progress = document.getElementById('progress');
const submit = document.getElementById('submit-case');
const V = window.Vibe || { sfx(){}, toast(){}, shake(){}, flash(){}, confetti(){}, reduce:false };
const startedAt = Date.now();
const panel = document.querySelector('.clues-panel');
const hud = document.createElement('div'); hud.className='v-hud';
hud.innerHTML='<div>TIME<b id="v-time">00:00</b></div><div>CLUES<b id="v-clues">0</b></div><div>RANK<b id="v-rank">N00B</b></div>';
const threat=document.createElement('div'); threat.innerHTML='<div class="v-threat"><span>THREAT CONFIDENCE</span><span id="v-threat-pct">0%</span></div><div class="v-threat-bar"><i id="v-threat-fill" style="width:0%"></i></div>';
const term=document.createElement('div'); term.className='v-term'; term.setAttribute('aria-hidden','true');
if(panel) panel.append(hud,threat,term);
function log(msg){const row=document.createElement('div');row.textContent='> '+msg;term.appendChild(row);while(term.children.length>6)term.firstChild.remove();}
const pad=n=>String(n).padStart(2,'0');
setInterval(()=>{const t=Math.floor((Date.now()-startedAt)/1000);const el=document.getElementById('v-time');if(el)el.textContent=pad(Math.floor(t/60))+':'+pad(t%60);},1000);
const ranks=['N00B','TRACKER','ANALYST','HUNTER','ELITE'];
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function buildMessage(){
  document.title=`Case ${String(caseId).padStart(3,'0')} — ${activeCase.title} | CyberTrace`;
  document.getElementById('case-number-label').textContent=`CASE ${String(caseId).padStart(3,'0')}`;
  document.getElementById('case-title-heading').innerHTML=escapeHTML(activeCase.title).replace(/(looked too good|held for a small fee|account suspension threat|never entered to win|charges you first)/i,'<em>$1</em>');
  document.getElementById('case-instructions').textContent=`Case ${String(caseId).padStart(3,'0')} · ${activeCase.type}. Inspect the message, collect evidence, and decide whether it is suspicious or likely legitimate.`;
  document.getElementById('sequence-label').textContent=`CASE ${caseId} OF ${allCases.length}`;
  document.getElementById('sequence-progress').style.width=`${caseId/allCases.length*100}%`;
  document.getElementById('case-difficulty').textContent=`DIFFICULTY: ${activeCase.difficulty}`;
  document.getElementById('case-image-caption').textContent=`CASE ${String(caseId).padStart(3,'0')} / ${activeCase.type.toUpperCase()}`;
  document.getElementById('message-status').textContent=activeCase.answer==='suspicious'?'UNVERIFIED':'CONTEXT CHECK';
  const body=document.getElementById('case-message');
  const sender=`<button type="button" class="clue" data-clue="0" aria-pressed="false">${escapeHTML(activeCase.sender)} <span class="inspect-icon">⌕</span></button>`;
  const intro=escapeHTML(activeCase.intro);
  const partButtons=activeCase.parts.map((p,i)=>`<button type="button" class="clue message-highlight" data-clue="${i+1}" aria-pressed="false">${escapeHTML(p.text)} <span class="inspect-icon">⌕</span></button>`);
  body.innerHTML=`<div class="email-row"><span>From</span>${sender}</div><div class="email-row"><span>To</span><strong>${escapeHTML(activeCase.recipient)}</strong></div><div class="email-row"><span>Subject</span><strong>${escapeHTML(activeCase.subject)}</strong></div><hr><span class="fake-logo">${escapeHTML(activeCase.brand)}</span><h3>${escapeHTML(activeCase.greeting)}</h3><p>Dear recipient,</p><p>${intro}</p>${partButtons.map((b,i)=>`<p>${b}</p>`).join('')}<p class="email-signature">Regards,<br>${escapeHTML(activeCase.channel==='SMS'?'Message notification team':activeCase.channel==='DIRECT MESSAGE'?'Rewards team':'Support team')}</p>`;
  document.getElementById('case-note').textContent=`DEMO ONLY · ${activeCase.note} Nothing is sent or opened.`;
  log(`case_${String(caseId).padStart(3,'0')} loaded. awaiting input...`);
}
function render(){
 count.textContent=`${selected.size} / 4`;progress.style.width=`${selected.size*25}%`;
 document.querySelectorAll('[data-clue]').forEach(button=>{const active=selected.has(Number(button.dataset.clue));button.classList.toggle('collected',active);button.setAttribute('aria-pressed',String(active));});
 document.querySelectorAll('[data-verdict]').forEach(button=>{const active=button.dataset.verdict===verdict;button.classList.toggle('chosen',active);button.setAttribute('aria-pressed',String(active));});
 evidenceList.replaceChildren();
 if(!selected.size){const p=document.createElement('div');p.className='empty-evidence';p.textContent='No evidence collected yet. Start by inspecting the sender.';evidenceList.appendChild(p);}
 else for(const idx of selected){const clue=idx===0?{title:'Sender identity',description:'Review the sender address and whether it matches the context.'}:activeCase.parts[idx-1];const item=document.createElement('div');item.className='evidence-item';const title=document.createElement('strong');title.textContent=`✓ ${clue.title}`;const detail=document.createElement('p');detail.textContent=clue.description;item.append(title,detail);evidenceList.appendChild(item);}
 submit.disabled=!verdict;const pct=selected.size*25;const set=(id,fn)=>{const el=document.getElementById(id);if(el)fn(el);};
 set('v-clues',el=>el.textContent=String(selected.size));set('v-rank',el=>el.textContent=ranks[selected.size]);set('v-threat-pct',el=>el.textContent=pct+'%');set('v-threat-fill',el=>el.style.width=pct+'%');
 const pill=document.querySelector('.email-panel .pill');if(pill){pill.classList.toggle('cleared',selected.size===4);pill.textContent=selected.size===4?'FULLY ANALYSED':activeCase.answer==='suspicious'?'UNVERIFIED':'CONTEXT CHECK';}
}
buildMessage();
document.querySelectorAll('[data-clue]').forEach(button=>button.addEventListener('click',()=>{const id=Number(button.dataset.clue);if(selected.has(id)){selected.delete(id);V.sfx('off');log('evidence removed: clue '+id);}else{selected.add(id);V.sfx('ping');const clue=id===0?{title:'Sender identity'}:activeCase.parts[id-1];log('CAPTURED '+clue.title.toUpperCase());V.toast('◆ EVIDENCE CAPTURED: '+clue.title.toUpperCase());if(id>0&&/otp|password|credential|fee|payment|identity/i.test(clue.title)){V.shake();V.sfx('alarm');}if(selected.size===4){V.flash();V.confetti(90);V.sfx('win');V.toast('★ ALL CLUES FOUND — CASE ANALYSED',false,3200);log('ALL EVIDENCE SECURED. submit verdict.');}}render();}));
document.querySelectorAll('[data-verdict]').forEach(button=>button.addEventListener('click',()=>{verdict=button.dataset.verdict;V.sfx('click');log('verdict locked: '+verdict.toUpperCase());render();}));
document.getElementById('reset-case').addEventListener('click',()=>{selected.clear();verdict=null;V.sfx('off');log('workspace wiped.');render();});
submit.addEventListener('click',()=>{if(!verdict)return;const query=new URLSearchParams({case:String(caseId),decision:verdict,answer:activeCase.answer,clues:Array.from(selected).join(','),t:String(Math.floor((Date.now()-startedAt)/1000))});submit.disabled=true;submit.textContent='DECRYPTING REPORT...';log('compiling case report...');V.flash();V.sfx('boot');setTimeout(()=>{window.location.href=`report.html?${query.toString()}`;},V.reduce?0:750);});
render();