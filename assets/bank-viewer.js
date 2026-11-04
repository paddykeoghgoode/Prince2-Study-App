
(function(){
"use strict";
var mount=document.getElementById("question-browser");
if(!mount)return;
var dataPath=mount.getAttribute("data-source");
var all=[],view=[],page=0,pageSize=8,selected={},revealed={},topic="all",format="all",batch="all",search="",random=false;
var topics={fundamentals:"Project concepts",principles:"Principles",people:"People",businessCase:"Business case",organisation:"Organization",plans:"Plans",quality:"Quality",risk:"Risk",issues:"Issues",progress:"Progress",processes:"Processes"};
function e(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
function by(id){return document.getElementById(id)}
function choices(el,entries){el.innerHTML=entries.map(function(x){return '<option value="'+e(x[0])+'">'+e(x[1])+'</option>'}).join("")}
function apply(){
var term=search.toLowerCase().trim();
view=all.filter(function(q){
return(topic==="all"||q.topic===topic)&&(format==="all"||(q.type||"standard")===format)&&(batch==="all"||q.sourceBatch===batch)&&(!term||[q.id,q.stem,q.ref,q.topic].concat(q.options).join(" ").toLowerCase().includes(term))
});
if(random){for(var j=view.length-1;j>0;j--){var k=Math.floor(Math.random()*(j+1));var x=view[j];view[j]=view[k];view[k]=x;}}
else view.sort(function(a,b){return a.id.localeCompare(b.id,undefined,{numeric:true})});
page=Math.min(page,Math.max(0,Math.ceil(view.length/pageSize)-1));draw()
}
function rationale(q,i){return q.optionWhy&&q.optionWhy[i]?e(q.optionWhy[i]):i===q.correct?"See the main explanation for this answer.":"This earlier question has no separate explanation for this option. Use the main reasoning to distinguish the alternatives."}
function explanation(q){
return '<div class="review"><h3>'+ (selected[q.id]===undefined?'Answer revealed':selected[q.id]===q.correct?'Correct — well done':'Not quite — review the distinction') +': '+ "ABCD"[q.correct]+'. '+e(q.options[q.correct])+'</h3><p>'+e(q.why)+'</p><div class="rationales">'+q.options.map(function(option,i){return '<div class="rationale '+(i===q.correct?'right':'')+'"><strong>'+"ABCD"[i]+'. '+e(option)+(i===q.correct?' ✓ Correct':'')+'</strong><p>'+rationale(q,i)+'</p></div>'}).join("")+'</div><p class="muted">Reference: '+e(q.ref)+' · Original learning question, not an official exam item.</p></div>';
}
function draw(){
var total=view.length,first=page*pageSize,items=view.slice(first,first+pageSize);
by("result-count").textContent=total.toLocaleString()+" matching questions · "+Object.keys(revealed).length+" explanations opened";
if(!items.length){by("question-cards").innerHTML='<div class="panel">No questions match. Try clearing the filters.</div>';by("pagination").innerHTML="";return;}
by("question-cards").innerHTML=items.map(function(q){
var chosen=selected[q.id],shown=!!revealed[q.id],label=q.sourceBatchLabel||q.sourceBatch;
return '<article class="card" id="q-'+e(q.id)+'"><div class="tags"><span class="tag">'+e(topics[q.topic]||q.topic)+'</span><span class="tag teal">'+e(q.type||"standard")+'</span><span class="ref">'+e(q.id)+' · '+e(label)+'</span></div><h2>'+e(q.stem)+'</h2><div class="options">'+q.options.map(function(o,i){return '<button class="option '+(chosen===i?'selected ':'')+(shown&&i===q.correct?'right ':'')+(shown&&chosen===i&&i!==q.correct?'wrong':'')+'" data-question="'+e(q.id)+'" data-choice="'+i+'" '+(shown?'disabled':'')+'><strong>'+"ABCD"[i]+'</strong><span>'+e(o)+'</span></button>'}).join("")+'</div><div class="answer-actions"><button class="btn primary" data-reveal="'+e(q.id)+'">'+(shown?'Explanation below':'Check answer & explanations')+'</button><span class="muted">'+(shown?'Read the feedback before continuing':'Choose an option, then reveal the answer')+'</span></div>'+(shown?explanation(q):'')+'</article>';
}).join("");
var max=Math.ceil(total/pageSize);
by("pagination").innerHTML='<button class="btn" data-pager="prev" '+(page===0?'disabled':'')+'>Previous</button><span class="muted">Page '+(page+1)+' of '+max+'</span><button class="btn" data-pager="next" '+(page>=max-1?'disabled':'')+'>Next</button>'
}
mount.addEventListener("click",function(ev){
var b=ev.target.closest("button[data-choice],button[data-reveal],button[data-pager]");
if(!b)return;
if(b.hasAttribute("data-choice")){selected[b.getAttribute("data-question")]=Number(b.getAttribute("data-choice"));draw();return}
if(b.hasAttribute("data-reveal")){revealed[b.getAttribute("data-reveal")]=true;draw();return}
if(b.getAttribute("data-pager")==="next"&&page<Math.ceil(view.length/pageSize)-1)page++;
if(b.getAttribute("data-pager")==="prev"&&page>0)page--;
draw();window.scrollTo({top:mount.getBoundingClientRect().top+window.scrollY,behavior:"smooth"})
});
by("filter-search").addEventListener("input",function(ev){search=ev.target.value;page=0;apply()});
by("filter-topic").addEventListener("change",function(ev){topic=ev.target.value;page=0;apply()});
by("filter-type").addEventListener("change",function(ev){format=ev.target.value;page=0;apply()});
by("filter-batch").addEventListener("change",function(ev){batch=ev.target.value;page=0;apply()});
by("clear-filters").addEventListener("click",function(){search="";topic=format=batch="all";random=false;page=0;by("filter-search").value="";by("filter-topic").value=by("filter-type").value=by("filter-batch").value="all";apply()});
by("shuffle").addEventListener("click",function(){random=true;page=0;apply()});
fetch(dataPath).then(function(r){if(!r.ok)throw Error("HTTP "+r.status);return r.json()}).then(function(data){
all=data.questions||[];
if(all.length===0)throw Error("The question bank is empty");
choices(by("filter-topic"),[["all","All syllabus topics"]].concat(Object.keys(topics).filter(function(t){return all.some(function(q){return q.topic===t})}).map(function(t){return[t,topics[t]]})));
choices(by("filter-type"),[["all","All formats"]].concat(Array.from(new Set(all.map(function(q){return q.type||"standard"}))).map(function(t){return[t,t.replace("_"," ")]})));
choices(by("filter-batch"),[["all","All authoring batches"]].concat(Array.from(new Map(all.map(function(q){return[q.sourceBatch,q.sourceBatchLabel||q.sourceBatch]})).entries())));
by("loading").hidden=true;by("browser").hidden=false;apply();
}).catch(function(err){by("loading").innerHTML='<div class="note error">Could not load the question file: '+e(err.message)+'. Open this page through GitHub Pages or a local web server. The <a href="../index.html">main study app</a> runs as a standalone HTML file.</div>'});
})();
