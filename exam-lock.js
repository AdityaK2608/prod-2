/* Exam-mode interaction lock: disables common text extraction/edit shortcuts. */
(function(){
  'use strict';
  document.documentElement.classList.add('exam-lock');
  const blockedKeys=new Set(['c','x','v','a','u','s','p']);
  const isEditable=el=>el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
  document.addEventListener('contextmenu',e=>e.preventDefault(),true);
  document.addEventListener('selectstart',e=>e.preventDefault(),true);
  document.addEventListener('dragstart',e=>e.preventDefault(),true);
  document.addEventListener('copy',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
  document.addEventListener('cut',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
  document.addEventListener('paste',e=>{e.preventDefault();e.stopImmediatePropagation();},true);
  document.addEventListener('keydown',e=>{
    const k=String(e.key||'').toLowerCase();
    if((e.ctrlKey||e.metaKey)&&blockedKeys.has(k)){e.preventDefault();e.stopImmediatePropagation();return false;}
    if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&['i','j','c'].includes(k))){e.preventDefault();e.stopImmediatePropagation();return false;}
  },true);
  window.addEventListener('beforeprint',e=>e.preventDefault());
})();
