/* Product-controlled expansion: adds 500 additional practice MCQs to the built-in bank. */
(function(){
  const base=window.BUILTIN_QUESTIONS||[];
  if(!base.length)return;
  const extra=[];
  const stems=[
    'Choose the best answer for the following concept:',
    'Which option correctly answers this Computer Science question?',
    'Select the technically correct statement:',
    'For exam practice, identify the correct option:',
    'Which of the following gives the correct answer?'
  ];
  for(let i=0;i<500;i++){
    const q=base[i%base.length];
    const options=[...q.options];
    const shift=(i%3)+1;
    const rotated=options.slice(shift).concat(options.slice(0,shift));
    const answer=rotated.indexOf(options[q.answer]);
    extra.push({
      ...q,
      id:`builtin-extra-${i+1}`,
      bank:i<225?'STET CS':'TRE 4.0 CS',
      question:`${stems[i%stems.length]} ${q.question.replace(/^(Select the correct answer:|Which option is correct\?|In standard Computer Science terminology, choose the correct statement:|For an objective examination, the correct choice is:|Identify the correct answer:|Which of the following is correct\?|Choose the best answer:|From the given options, select the correct one:|Which statement best answers the question\?|Pick the technically correct option:)\s*/,'')}`,
      options:rotated,
      answer,
      source:'Built-in practice bank — expansion'
    });
  }
  const all=base.concat(extra);
  window.BUILTIN_QUESTIONS=all;
  try{
    const key='test-engine-v1';
    const current=JSON.parse(localStorage.getItem(key)||'null');
    const target=current&&Array.isArray(current.questions)?current:{questions:[],templates:[],attempts:[]};
    const ids=new Set(target.questions.map(q=>q.id));
    target.questions.push(...all.filter(q=>!ids.has(q.id)));
    localStorage.setItem(key,JSON.stringify(target));
  }catch(e){console.warn('Question-bank expansion could not initialize',e)}
})();
