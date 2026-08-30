/* GitHub Pages / static-hosting compatibility layer. No /api/* dependency. */
(function(){
  const esc2=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hostOf=s=>{try{return new URL(/^https?:\/\//i.test(s)?s:'https://'+s).hostname}catch{return null}};
  window.runModule=async function(kind){
    const q=document.getElementById(kind+'q')?.value.trim(),out=document.getElementById(kind+'out');
    if(!out)return;if(!q){out.textContent='Enter a hostname first.';return}
    const host=hostOf(q);if(!host){out.innerHTML='<b class="error">Invalid hostname.</b>';return}
    out.textContent='Collecting browser-available evidence…';
    try{
      if(kind==='dns'){
        const types=['A','AAAA','MX','NS','TXT'];
        const rows=await Promise.all(types.map(async type=>{const r=await fetch('https://dns.google/resolve?name='+encodeURIComponent(host)+'&type='+type,{headers:{accept:'application/dns-json'}});if(!r.ok)throw Error('DNS service unavailable');const d=await r.json();return [type,(d.Answer||[]).map(x=>x.data)]}));
        out.innerHTML='<b class="ok">VERIFIED · Public DNS evidence received.</b><br>'+rows.map(([t,a])=>`<span class="tag">${t}: ${a.length}</span>`).join('')+'<div style="margin-top:10px">'+rows.map(([t,a])=>a.length?`<small><b>${t}</b>: ${a.slice(0,5).map(esc2).join(', ')}</small>`:'').join('<br>')+'</div>';
      }else if(kind==='domain'){
        const u=new URL('https://'+host);out.innerHTML=`<b class="ok">VERIFIED · Hostname parsed.</b><br><span class="tag">Hostname: ${esc2(u.hostname)}</span><span class="tag">HTTPS URL: ${esc2(u.href)}</span><p style="margin-top:12px">Static hosting cannot perform server-side port scanning or authoritative HTTP reconnaissance. Those findings are therefore not reported as verified.</p>`;
      }else if(kind==='headers'){
        out.innerHTML='<b>NOT AVAILABLE · Server-side header inspection requires a same-origin or CORS-enabled target.</b><p style="margin:8px 0 0">Sentinel will not claim a header is present or missing without receiving the target response.</p>';
      }else if(kind==='tls'){
        out.innerHTML='<b>NOT AVAILABLE · Browser JavaScript cannot reliably expose a remote certificate/TLS handshake for an arbitrary hostname.</b><p style="margin:8px 0 0">No TLS finding is fabricated in the static deployment.</p>';
      }
    }catch(e){out.innerHTML='<b class="error">Live evidence unavailable.</b><br><small>'+esc2(e.message)+'</small>'}
  };
  window.searchCve=async function(){
    const q=document.getElementById('cveq')?.value.trim(),out=document.getElementById('results');if(!q||!out)return;
    out.innerHTML='<div class="cve">Querying NVD…</div>';
    try{const r=await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch='+encodeURIComponent(q)+'&resultsPerPage=6');if(!r.ok)throw Error('NVD returned HTTP '+r.status);const d=await r.json();out.innerHTML=(d.vulnerabilities||[]).map(v=>{const c=v.cve||{},m=c.metrics?.cvssMetricV40?.[0]?.cvssData||c.metrics?.cvssMetricV31?.[0]?.cvssData;return `<div class="cve"><code>${esc2(c.id||'Unknown CVE')}</code><b>${esc2(((c.descriptions||[]).find(x=>x.lang==='en')||{}).value||'No description')}</b><small>CVSS ${esc2(m?.baseScore??'N/A')} · ${esc2(m?.baseSeverity||'N/A')} · Target impact: UNVERIFIED</small></div>`}).join('')||'<div class="cve">No verified records returned.</div>'}catch(e){out.innerHTML='<div class="cve error"><b>NVD lookup unavailable.</b><br><small>'+esc2(e.message)+'</small></div>'}
  };
})();
