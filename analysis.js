/* Post-test analysis view. The stable engine stores the completed attempt in localStorage; this layer turns that result into a dedicated analysis screen. */
(function(){
  'use strict';
  const STORE='test-engine-v4';
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'null')||{attempts:[]}}catch(e){return{attempts:[]}}};
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pct=(n,d)=>d?Math.round(n/d*100):0;
  window.attempts=function(){
    const data=read(), list=Array.isArray(data.attempts)?data.attempts:[], a=list[list.length-1];
    if(!a || !window.app) return;
    const accuracy=pct(a.correct,a.total), attempted=a.correct+a.wrong;
    const verdict=accuracy>=80?'Excellent performance':accuracy>=60?'Good progress':'Focus on revision';
    const advice=accuracy>=80?'Keep your accuracy high and work on speed.':accuracy>=60?'Review incorrect questions and strengthen weak concepts.':'Prioritize concept revision before taking another full mock.';
    document.body.classList.remove('in-exam');
    app.innerHTML=`<div class="analysis-page"><header class="analysis-header"><div><span class="kicker">POST-TEST ANALYSIS</span><h1>Test completed.</h1><p>${esc(a.exam)} · ${new Date(a.date).toLocaleString()}</p></div><div class="analysis-actions"><button class="secondary" id="backDash">← Dashboard</button><button class="primary" id="again">Take Another Test →</button></div></header><section class="analysis-hero"><div class="analysis-score"><span>YOUR SCORE</span><strong>${Number(a.score).toFixed(2)}</strong><small>out of ${a.total}</small></div><div class="analysis-verdict"><span class="pill">● ${esc(verdict)}</span><h2>${accuracy}% accuracy</h2><p>${esc(advice)}</p></div></section><section class="analysis-grid"><article class="analysis-card"><span>ATTEMPTED</span><b>${attempted}</b><small>of ${a.total}</small></article><article class="analysis-card success"><span>CORRECT</span><b>${a.correct}</b><small>${pct(a.correct,a.total)}% of test</small></article><article class="analysis-card danger-card"><span>INCORRECT</span><b>${a.wrong}</b><small>${pct(a.wrong,a.total)}% of test</small></article><article class="analysis-card"><span>UNANSWERED</span><b>${a.unanswered}</b><small>${pct(a.unanswered,a.total)}% of test</small></article></section><section class="analysis-columns"><article class="analysis-panel"><div class="panel-head"><div><span class="kicker">PERFORMANCE</span><h3>Score breakdown</h3></div><strong>${accuracy}%</strong></div><div class="meter"><i style="width:${accuracy}%"></i></div><div class="breakdown"><div><span>Correct answers</span><b>${a.correct}</b></div><div><span>Wrong answers</span><b>${a.wrong}</b></div><div><span>Unanswered</span><b>${a.unanswered}</b></div></div></article><article class="analysis-panel"><div class="panel-head"><div><span class="kicker">NEXT STEP</span><h3>Recommended action</h3></div></div><div class="recommendation"><div class="recommend-icon">→</div><div><b>${esc(verdict)}</b><p>${esc(advice)}</p></div></div></article></section><section class="analysis-panel history-panel"><div class="panel-head"><div><span class="kicker">HISTORY</span><h3>Recent attempts</h3></div></div>${list.slice().reverse().slice(0,8).map((x,i)=>`<div class="analysis-history-row"><div><b>${esc(x.exam)}</b><small>${new Date(x.date).toLocaleString()}</small></div><span>${Number(x.score).toFixed(2)} / ${x.total}</span><strong>${pct(x.correct,x.total)}%</strong></div>`).join('')}</section></div>`;
    document.getElementById('backDash').onclick=()=>window.home?window.home():location.reload();
    document.getElementById('again').onclick=()=>window.builder?window.builder():location.reload();
  };
})();
