/* ---------- 뉴스 ---------- */
let BRIEFS=[], sample=null;
const CATC={'세제':'tax','시장':'market'};
function renderNews(){
  const sel=document.getElementById('week'), body=document.getElementById('newsbody');
  if(!BRIEFS.length){
    sel.hidden=true;
    body.innerHTML='<div class="empty">첫 브리핑이 아직 없어요. 매주 월요일 아침에 자동으로 채워져요.</div>';return;}
  sel.hidden=false;
  if(!sel.options.length || sel.options.length!==BRIEFS.length){
    sel.innerHTML=BRIEFS.map((b,i)=>`<option value="${i}">${esc(b.title)}</option>`).join('');
  }
  const b=BRIEFS[+sel.value||0];
  document.getElementById('ntitle').textContent=b.title;
  document.getElementById('nmeta').textContent=b.generatedAt?`${b.generatedAt} 정리 · 기사 ${(b.items||[]).length}건`:'';
  let h=b.headline?`<div class="lead"><b>이번 주 한 줄</b> ${esc(b.headline)}</div>`:'';
  h+='<div class="news">'+(b.items||[]).map((it,i)=>`
    <article class="ncard">
      <div class="meta"><span class="cat ${CATC[it.category]||''}">${esc(it.category)}</span><span>${esc(it.source)}</span><span>${esc(it.date)}</span></div>
      <h4>${esc(it.title)}</h4>
      <div class="ai"><small>AI 요약</small>${linkTerms(esc(it.summary))}</div>
      ${it.impact?`<div class="impact"><b>나한테는</b> ${esc(it.impact)}</div>`:''}
      <div class="explain" id="ex-${i}" hidden></div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:auto">
        ${it.url?`<a href="${esc(it.url)}" target="_blank" rel="noopener">원문 보기 ↗</a>`:''}
        ${sample?`<button class="btn ghost" data-ex="${i}">용어 풀어서 설명</button>`:''}
      </div>
    </article>`).join('')+'</div>';
  body.innerHTML=h;
  body.querySelectorAll('[data-ex]').forEach(btn=>btn.addEventListener('click',()=>explain(b.items[+btn.dataset.ex],+btn.dataset.ex,btn)));
}
async function explain(it,i,btn){
  const out=document.getElementById('ex-'+i); out.hidden=false; out.textContent='설명을 쓰는 중이에요…'; btn.disabled=true;
  try{
    await sample(`부동산·금융 용어를 처음 접하는 직장인에게 아래 뉴스를 설명해 주세요. 어려운 용어(예: 코픽스, LTV, 장기보유특별공제)는 괄호로 쉽게 풀고, 3~4문장, 한국어 존댓말 해요체로만 답하세요.\n\n제목: ${it.title}\n요약: ${it.summary}`,
      {modelTier:'quick',onText:({text})=>{out.textContent=text;}});
  }catch(e){ out.textContent = e&&e.code==='not_granted' ? '설명 기능 사용이 허용되지 않았어요.' : '지금은 설명을 만들 수 없어요. 잠시 후 다시 눌러 주세요.'; }
  btn.disabled=false;
}
document.getElementById('week').addEventListener('change',renderNews);

/* ---------- 데이터 연결 ---------- */
(async()=>{
  legend(); renderNews();
  const timer=setTimeout(()=>{ if(!APTS.length) document.getElementById('alist').innerHTML='<p style="font-size:13px;color:var(--muted);margin:6px 0">단지 정보를 불러오지 못했어요. 로그인한 상태에서 다시 열어 주세요.</p>'; if(!BRIEFS.length) renderNews(); },10000);
  try{ sample = window.claude ? await claude.use('sample') : null; }catch(e){ sample=null; }
  let db=null;
  try{ db = window.claude ? await claude.use('db') : null; }catch(e){ db=null; }
  if(!db){ clearTimeout(timer); document.getElementById('alist').innerHTML='<p style="font-size:13px;color:var(--muted);margin:6px 0">로그인하면 단지와 브리핑이 보여요.</p>'; renderNews(); return; }
  db.collection('apts').onSnapshot(s=>{ clearTimeout(timer); APTS=s.docs.map(d=>d.data()).filter(a=>a&&a.lon&&a.lat); renderList(); if(!document.getElementById('v-map').hidden) drawMap(); },()=>{});
  db.collection('briefings').orderBy('week','desc').onSnapshot(s=>{ clearTimeout(timer); BRIEFS=s.docs.map(d=>d.data()); document.getElementById('week').innerHTML=''; renderNews(); renderHome(); },()=>{});
})();
