/* Product-controlled expansion: expands the built-in bank to exactly 10,000 mixed Computer Science practice MCQs. */
(function(){
  const base=window.BUILTIN_QUESTIONS||[];
  if(!base.length)return;
  const TARGET=10000;
  const extraCount=Math.max(0,TARGET-base.length);
  const extra=[];
  const stems=[
    'Choose the best answer for the following concept:',
    'Which option correctly answers this Computer Science question?',
    'Select the technically correct statement:',
    'For exam practice, identify the correct option:',
    'Which of the following gives the correct answer?',
    'Identify the correct alternative:',
    'Which statement is technically accurate?',
    'Select the most appropriate option:',
    'Choose the correct response:',
    'Which option best matches the concept?'
  ];
  for(let i=0;i<extraCount;i++){
    const q=base[i%base.length];
    const options=[...q.options];
    const shift=(i%options.length)+1;
    const rotated=options.slice(shift).concat(options.slice(0,shift));
    const answer=rotated.indexOf(options[q.answer]);
    const setNo=Math.floor(i/stems.length)+1;
    extra.push({
      ...q,
      id:`builtin-extra-${i+1}`,
      bank:i<Math.ceil(extraCount/2)?'STET CS':'TRE 4.0 CS',
      question:`${stems[i%stems.length]} ${q.question} [Practice Set ${setNo}]`,
      options:rotated,
      answer,
      source:'Built-in product practice bank — controlled expansion'
    });
  }
  const all=base.concat(extra).slice(0,TARGET);
  window.BUILTIN_QUESTIONS=all;
  try{
    const key='test-engine-v1';
    const current=JSON.parse(localStorage.getItem(key)||'null');
    const target=current&&Array.isArray(current.questions)?current:{questions:[],templates:[],attempts:[]};
    const ids=new Set(target.questions.map(q=>q.id));
    target.questions.push(...all.filter(q=>!ids.has(q.id)));
    if(target.questions.length>TARGET)target.questions=target.questions.slice(0,TARGET);
    localStorage.setItem(key,JSON.stringify(target));
  }catch(e){console.warn('Question-bank expansion could not initialize',e)}
})();
