/* Temporary production maintenance gate. Automatically returns to the app after the scheduled window. */
(function(){
  'use strict';
  const END=Date.parse('2026-08-29T21:32:00+05:30');
  const scripts=['question-bank.js','question-bank-expansion.js','security.js','stable-fix.js','practice-lab-v2.js','analysis.js','exam-lock.js'];
  const app=document.getElementById('app');
  function boot(){
    document.title='Test Engine';
    app.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#080a0f;color:#f7f8fa;font-family:Inter,system-ui,sans-serif;font-size:18px"><section style="width:min(620px,100%);padding:56px 40px;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:#11141c"><div style="color:#9b91ff;font-weight:800;letter-spacing:.12em;font-size:12px">TEST ENGINE</div><h1 style="font-size:42px;margin:16px 0 10px">Loading Test Engine…</h1></section></main>';
    let i=0;function next(){if(i>=scripts.length)return;const s=document.createElement('script');s.src='./'+scripts[i++];s.onload=next;s.onerror=next;document.body.appendChild(s)}next();
  }
  function render(){
    const remaining=Math.max(0,END-Date.now());
    const mins=Math.floor(remaining/60000), secs=Math.floor(remaining/1000)%60;
    app.innerHTML='<main style="min-height:100vh;display:grid;place-items:center;padding:24px;background:#080a0f;color:#f7f8fa;font-family:Inter,system-ui,sans-serif;font-size:18px"><section style="width:min(680px,100%);padding:56px 40px;text-align:center;border:1px solid rgba(255,255,255,.1);border-radius:24px;background:linear-gradient(145deg,#11141c,#0c0e14);box-shadow:0 25px 80px rgba(0,0,0,.35)"><div style="display:inline-block;padding:7px 12px;border-radius:999px;background:rgba(124,108,255,.12);color:#9b91ff;font-size:11px;font-weight:800;letter-spacing:.12em">SCHEDULED MAINTENANCE</div><h1 style="font-size:clamp(34px,6vw,52px);margin:20px 0 12px;letter-spacing:-.04em">We’ll be back shortly.</h1><p style="color:#9da4b4;line-height:1.7;max-width:520px;margin:0 auto">Test Engine is temporarily unavailable while we perform production maintenance and improvements.</p><div id="count" style="font-size:32px;font-weight:800;letter-spacing:.04em;margin-top:28px">'+String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0')+'</div><small style="display:block;color:#70798b;margin-top:8px">Maintenance window · 3 hours</small></section></main>';
  }
  if(Date.now()>=END){boot();return}
  render();
  const timer=setInterval(function(){if(Date.now()>=END){clearInterval(timer);boot();}else{const r=END-Date.now(),m=Math.floor(r/60000),s=Math.floor(r/1000)%60;const c=document.getElementById('count');if(c)c.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}},1000);
})();
