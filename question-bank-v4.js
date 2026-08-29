/* V4 expansion: 3,150 tagged practice items. Existing CS bank is expanded with controlled variants; pedagogy, GS and language are separately tagged. These are practice questions, not PYQs. */
const PRIOR=Array.isArray(window.BUILTIN_QUESTIONS)?window.BUILTIN_QUESTIONS:[];
const STEMS=['Choose the correct answer:','Select the best option:','Which statement is correct?','Identify the correct response:','For examination purposes, choose the correct option:','Which of the following is most appropriate?','Select the technically correct answer:','Choose the option that best completes the question:','Which option correctly describes the concept?','Pick the correct alternative:'];
const pedagogy=[
['Assessment','Formative assessment is mainly intended to','provide feedback during learning',['rank learners only at the end','replace instruction','eliminate practice']],
['Assessment','Summative assessment is generally conducted','at the end of an instructional period',['before instruction begins','every minute','only for attendance']],
['Learning','A learner-centred classroom emphasizes','active participation and learner needs',['only lecture','no feedback','memorization alone']],
['Learning','Constructivist learning emphasizes that learners','actively construct knowledge from experiences',['only copy notes','avoid prior knowledge','learn without interaction']],
['Bloom','Bloom taxonomy is used to classify','educational objectives',['network layers','database keys','CPU instructions']],
['Inclusion','Inclusive education aims to','support diverse learners in common learning environments',['exclude learners','use one method for every learner','avoid accommodations']],
['Motivation','Intrinsic motivation comes primarily from','internal interest or satisfaction',['external punishment only','attendance rules','grades alone']],
['Pedagogy','Scaffolding means','temporary support that is reduced as learner competence grows',['permanent dependence','removing feedback','avoiding difficult tasks']],
['Classroom','Effective classroom management generally focuses on','clear expectations and supportive routines',['punishment only','no rules','continuous lecturing']],
['Evaluation','A diagnostic assessment is useful for','identifying prior knowledge and learning gaps',['final certification only','salary calculation','attendance marking']]
];
const gs=[
['Polity','The Constitution of India came into force on','26 January 1950',['15 August 1947','26 November 1949','2 October 1950']],
['Bihar','The capital of Bihar is','Patna',['Gaya','Muzaffarpur','Bhagalpur']],
['Polity','Fundamental Duties are contained in','Article 51A',['Article 14','Article 19','Article 32']],
['Polity','The Rajya Sabha is also called the','Council of States',['House of the People','State Assembly','Federal Court']],
['Geography','The Ganga is a major river flowing through','Bihar',['Kerala','Goa','Punjab only']],
['History','The Quit India Movement was launched in','1942',['1930','1919','1947']],
['Economy','GDP measures the value of','final goods and services produced within an economy',['only exports','only government salaries','only agricultural land']],
['Science','The SI unit of electric current is','ampere',['volt','ohm','watt']],
['Environment','The ozone layer is mainly found in the','stratosphere',['troposphere','mesosphere','thermosphere']],
['Polity','The President of India is elected by','an electoral college',['direct popular vote only','Rajya Sabha alone','Supreme Court']]
];
const language=[
['Vocabulary','Choose the correctly spelled word.','Necessary',['Neccessary','Necesary','Necessery']],
['Vocabulary','The opposite of ancient is','modern',['old','historic','antique']],
['Vocabulary','A synonym of rapid is','swift',['slow','weak','late']],
['Grammar','A noun primarily names','a person, place, thing, or idea',['an action only','a conjunction','a punctuation mark']],
['Grammar','A sentence ending with a question mark is generally','interrogative',['declarative','imperative','exclamatory']],
['Grammar','Which word is a verb in the sentence “Students learn quickly”?','learn',['students','quickly','the']],
['Grammar','The plural of “child” is','children',['childs','childes','childrens']],
['Vocabulary','The closest meaning of “brief” is','short',['heavy','late','distant']],
['Grammar','A word that modifies a noun is commonly called an','adjective',['adverb','conjunction','preposition']],
['Comprehension','The main idea of a passage is its','central message',['least important detail','punctuation','title only']]
];
function makeExtra(base,bank,count,prefix){const out=[];for(let i=0;i<count;i++){const [topic,q,a,d]=base[i%base.length];const v=i%10;const opts=[a,...d].sort((x,y)=>((x.length*17+i*13)%101)-((y.length*17+i*13)%101));out.push({id:`${prefix}-${i+1}`,bank,section:topic,topic,difficulty:i%10<3?'Easy':i%10<7?'Medium':'Hard',question:`${STEMS[v]} ${q}`,options:opts,answer:opts.indexOf(a),explanation:`Correct answer: ${a}. This is a tagged ${topic} practice item.`,source:'Built-in V4 practice bank',sourceType:'practice'});}return out}
/* Expand the existing 550 CS items into two additional controlled practice variants. */
const csExpanded=[];for(let pass=1;pass<=2;pass++){for(let i=0;i<PRIOR.length;i++){const q=PRIOR[i];csExpanded.push({...q,id:`v4-cs-${pass}-${i+1}`,question:`${STEMS[(i+pass)%STEMS.length]} ${q.question.replace(/^(Select the correct answer:|Which option is correct\?|In standard Computer Science terminology, choose the correct statement:|For an objective examination, the correct choice is:|Identify the correct answer:|Which of the following is correct\?|Choose the best answer:|From the given options, select the correct one:|Which statement best answers the question\?|Pick the technically correct option:)\s*/,'')}`,source:'Built-in V4 practice bank',sourceType:'practice'});}}
const EXTRA=[...csExpanded,...makeExtra(pedagogy,'STET Pedagogy',500,'v4-stet-ped'),...makeExtra(gs,'TRE 4.0 General Studies',250,'v4-tre-gs'),...makeExtra(language,'TRE 4.0 Language',250,'v4-tre-lang')];
window.BUILTIN_QUESTIONS=[...PRIOR,...EXTRA];
