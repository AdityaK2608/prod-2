(() => {
  try {
    const key='te-v3';
    const current=JSON.parse(localStorage.getItem(key)||'null')||{questions:[],attempts:[],templates:[]};
    const existing=Array.isArray(current.questions)?current.questions:[];
    const ids=new Set(existing.map(q=>q.id));
    const builtins=Array.isArray(window.BUILTIN_QUESTIONS)?window.BUILTIN_QUESTIONS:[];
    current.questions=[...existing,...builtins.filter(q=>q && !ids.has(q.id))];
    current.attempts=Array.isArray(current.attempts)?current.attempts:[];
    current.templates=Array.isArray(current.templates)?current.templates:[];
    localStorage.setItem(key,JSON.stringify(current));
  } catch (e) { console.error('Test Engine bootstrap failed',e); }
})();
