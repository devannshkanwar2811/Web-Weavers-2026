 'use strict';
const params=new URLSearchParams(window.location.search);
const caseId=Math.max(1,Math.min((window.CYBERTRACE_CASES||[]).length||1,parseInt(params.get('case')||'1',10)||1));
const activeCase=(window.CYBERTRACE_CASES||[]).find(c=>c.id===caseId);
const decision=params.get('decision');
if(!activeCase||!['suspicious','legitimate'].includes(decision)){
 document.getElementById('no-result').hidden=false;
}else{
 document.getElementById('report-content').hidden=false;
 const clueParam=params.get('clues')||'';const found=[...new Set(clueParam?clueParam.split(',').map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<=3):[])];
 const correct=decision===activeCase.answer;
 const score=found.length*15+(correct?40:0);
 const V=window.Vibe;const secs=Math.max(0,parseInt(params.get('t')||'0',10)||0);
 const rank=score>=100?'ELITE DETECTIVE':score>=75?'SENIOR ANALYST':score>=40?'JUNIOR TRACKER':'ROOKIE // RETRY';
 const num=document.getElementById('score-number');num.textContent='0';
 if(V){V.countUp(num,score,1500,()=>{if(score>=75){V.confetti(score===100?260:150);V.flash();V.sfx('win');V.toast('★ RANK UNLOCKED: '+rank);}else{V.shake();V.sfx('lose');V.toast('✕ '+rank,true);}});}else num.textContent=String(score);
 document.getElementById('report-case-number').textContent=`#${String(caseId).padStart(3,'0')} / 010`;
 const badge=document.createElement('span');badge.className='v-rank';badge.textContent='◆ '+rank+(secs?' · '+Math.floor(secs/60)+'m '+(secs%60)+'s':'');document.getElementById('result-status').after(badge);
 document.getElementById('found-count').textContent=`${found.length} / 4`;
 document.getElementById('result-heading').textContent=correct?'Correct judgement.':'Review your judgement.';
 const expected=activeCase.answer==='suspicious'?'suspicious':'likely legitimate';
 document.getElementById('result-subtitle').textContent=correct?`You correctly assessed this ${activeCase.type.toLowerCase()} scenario. Review what you spotted and what you missed.`:`This scenario is best assessed as ${expected}. Review the evidence below, then continue to the next case.`;
 document.getElementById('result-status').textContent=`YOUR VERDICT: ${decision.toUpperCase()} ${correct?'✓':'✕'}`;
 document.getElementById('report-case-explanation-title').textContent=`Case ${String(caseId).padStart(3,'0')}: ${activeCase.title}`;
 document.getElementById('report-case-explanation').textContent=activeCase.note;
 const list=document.getElementById('report-evidence');
 const clues=[{title:'Sender identity',description:'Review the sender address and whether it matches the context.'},...activeCase.parts];
 clues.forEach((clue,i)=>{const row=document.createElement('div');row.className='report-clue';const mark=document.createElement('span');mark.className=found.includes(i)?'found':'missed';mark.textContent=found.includes(i)?'✓':'○';const body=document.createElement('div');const strong=document.createElement('strong');strong.textContent=clue.title;const p=document.createElement('p');p.textContent=found.includes(i)?'Evidence collected. '+clue.description:'Missed clue. '+clue.description;body.append(strong,p);row.append(mark,body);list.append(row);});
 const next=document.getElementById('next-case-action');
 if(caseId<10){next.href=`investigate.html?case=${caseId+1}`;next.textContent=`Continue to case ${String(caseId+1).padStart(3,'0')} →`;document.getElementById('completion-note').hidden=true;}
 else{next.href='index.html';next.textContent='Finish training →';document.getElementById('completion-note').hidden=false;document.getElementById('completion-note').textContent='TRAINING COMPLETE · You reached the end of all 10 investigation cases. Return to the lab to practise again.';}
 const tryAgain=document.getElementById('retry-case');tryAgain.href=`investigate.html?case=${caseId}`;tryAgain.textContent='Retry this case ↺';
}