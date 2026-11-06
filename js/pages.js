/* ---------- 용어사전 ---------- */
const TERMS=[
 ['대출·금리','기준금리','Base rate','한국은행이 정하는 정책금리예요. 은행 예금·대출 금리가 모두 이 숫자에서 출발해요.','올리면 대출이자가 오르고, 내리면 집값에 우호적인 환경이 돼요.'],
 ['대출·금리','코픽스','COFIX','은행들이 돈을 끌어올 때 드는 평균 비용(자금조달비용지수)이에요. 매달 15일쯤 은행연합회가 발표해요.','변동형 주담대 금리 = 코픽스 + 가산금리'],
 ['대출·금리','가산금리','','은행이 기준 금리 위에 얹는 금리예요. 신용도와 은행 마진이 반영되고, 급여이체 같은 우대조건으로 깎을 수 있어요.',''],
 ['대출·금리','LTV','Loan To Value','집값 대비 대출 비율이에요. 서울 규제지역은 40%, 생애최초는 70%까지예요.','10억 집, LTV 40% → 최대 4억'],
 ['대출·금리','DSR','Debt Service Ratio','1년 소득 중 모든 대출의 원금+이자로 나가는 비율이에요. 은행은 40%까지만 허용해요.','연봉 1억 → 모든 대출 상환액이 연 4천만 원 이하'],
 ['대출·금리','스트레스 DSR','','앞으로 금리가 오를 수 있다고 보고, DSR을 계산할 때 실제보다 높은 금리를 넣는 제도예요. 그래서 한도가 줄어요.','수도권 주담대는 최대 3%p를 더해 계산'],
 ['대출·금리','원리금균등상환','','매달 원금과 이자를 합쳐 같은 금액을 갚는 방식이에요. 초반엔 이자 비중이 크고 갈수록 원금 비중이 커져요.',''],
 ['대출·금리','변동·고정·혼합금리','','변동은 코픽스 따라 바뀌고, 고정은 정해진 금리 그대로예요. 혼합(주기형)은 처음 5년 정도 고정 후 변동으로 바뀌어요.',''],
 ['대출·금리','여신·수신','','여신은 돈을 빌려주는 일(대출), 수신은 돈을 맡아두는 일(예금)이에요. 수신이 없는 캐피탈·카드사는 채권(여전채)을 발행해 돈을 구해요.',''],
 ['대출·금리','생애최초','','본인과 배우자 모두 평생 집을 가진 적이 없는 사람이에요. 규제지역에서도 LTV 70%까지 받을 수 있어요.',''],
 ['세금','취득세','','집을 살 때 한 번 내는 지방세예요. 1주택은 6억 이하 1%, 9억 초과 3%이고, 지방교육세가 따로 붙어요.','20억 1주택 → 약 6천만 원 + 교육세'],
 ['세금','재산세','','매년 6월 1일에 집을 가진 사람이 내는 세금이에요. 공시가격에 공정시장가액비율을 곱한 금액이 기준이에요.','7월·9월에 나눠서 고지'],
 ['세금','종합부동산세','종부세','가진 집의 공시가격 합계가 공제액(1주택 12억, 그 외 9억)을 넘으면 넘는 부분에 붙는 국세예요. 소득과는 상관없어요.','12월에 고지'],
 ['세금','양도소득세','양도세','집을 팔 때 남긴 차익에 붙는 세금이에요. 취득세·중개보수·인테리어 같은 필요경비는 빼고 계산해요.',''],
 ['세금','1세대 1주택 비과세','','집 한 채를 2년 이상 보유(서울처럼 조정지역에서 샀다면 2년 거주도)하면 매도가 12억까지 양도세가 없어요.','12억 넘으면 넘는 비율만큼만 과세'],
 ['세금','장기보유특별공제','장특공','오래 보유·거주할수록 양도차익의 일부를 빼주는 제도예요. 1주택은 보유·거주 각 연 4%씩 최대 80%예요.','2026 세제개편안은 거주기간 중심으로 바꾸려는 중'],
 ['세금','공시가격','','정부가 매년 발표하는 집 가격이에요. 재산세·종부세·건강보험료 계산 기준이 돼요.',''],
 ['세금','공시가격 현실화율','시세반영률','공시가격이 실제 시세의 몇 %인지예요. 2026년 아파트는 69%예요. 이게 오르면 세금이 티 안 나게 올라요.',''],
 ['세금','공정시장가액비율','','공시가격에 곱해서 세금 매길 금액(과세표준)을 정하는 비율이에요. 이것만 올려도 법 개정 없이 세금이 늘어요.',''],
 ['세금','국민주택채권','','집을 등기할 때 의무로 사야 하는 채권이에요. 대부분 바로 팔고, 그때 생기는 할인 손실만 부담해요.',''],
 ['시장·거래','중개보수','복비','부동산 중개 수수료예요. 가격 구간별 상한이 있어서 15억 이상은 0.7%까지예요.',''],
 ['시장·거래','전세가율','','매매가 대비 전세가 비율이에요. 높을수록 적은 돈으로 전세 끼고 살 수 있어요.','전세가율 80%면 10억 집을 2억으로 전세 끼고 살 수 있어요'],
 ['시장·거래','갭투자','','전세를 끼고 매매가와 전세가의 차이(갭)만 내 돈으로 사는 방식이에요. 지금 서울은 실거주 의무 때문에 어려워요.',''],
 ['시장·거래','규제지역','조정대상지역·투기과열지구','정부가 집값 과열을 막으려 지정한 지역이에요. 대출 한도가 줄고 세금이 무거워져요. 서울은 전역이 해당돼요.',''],
 ['시장·거래','토지거래허가구역','','거래 전에 구청 허가를 받아야 하는 지역이에요. 사면 직접 들어가 살아야 해요.',''],
 ['시장·거래','임장','','직접 동네와 단지를 둘러보는 일이에요. 역까지 실제 걸리는 시간, 경사, 채광은 지도로는 안 보여요.',''],
 ['투자','채권','','돈을 빌려주고 이자를 받기로 한 증서예요. 나라가 발행하면 국채, 회사가 발행하면 회사채예요.','금리가 오르면 이미 가진 채권 가격은 떨어져요'],
 ['투자','미국채 10년물','','미국 정부가 10년 뒤 갚는 채권의 금리예요. 전 세계 금리의 기준이라 다른 투자와 비교할 때 많이 써요.',''],
 ['투자','무위험 수익률','','떼일 걱정이 거의 없는 곳(국채, 예금)에서 받는 수익률이에요. 다른 투자는 이보다 더 벌어야 의미가 있어요.',''],
 ['투자','IRR','내부수익률','돈이 들어가고 나온 시점까지 반영한 연 수익률이에요. 계산기의 "연 수익률"이 이 값이에요.',''],
 ['투자','레버리지','','빌린 돈으로 투자 규모를 키우는 거예요. 오르면 수익이 커지고, 떨어지면 손실도 커져요.',''],
 ['투자','파생상품','','주식·채권·환율 같은 기초자산 가격에 연동되는 계약이에요. 적은 돈으로 큰 금액을 움직일 수 있어 위험도 커요.','']
];
function renderTerms(){
  const q=(document.getElementById('tq').value||'').trim().toLowerCase();
  const groups={};
  TERMS.forEach(t=>{ const hay=(t[1]+t[2]+t[3]).toLowerCase(); if(q && !hay.includes(q)) return; (groups[t[0]]=groups[t[0]]||[]).push(t); });
  const keys=Object.keys(groups);
  document.getElementById('tlist').innerHTML = keys.length ? keys.map(g=>`<div class="tgroup"><h3>${g}</h3><div class="terms">${groups[g].map(t=>`<div class="term" id="term-${t[1].replace(/\s/g,'')}"><h4>${esc(t[1])}${t[2]?`<small>${esc(t[2])}</small>`:''}</h4><p>${esc(t[3])}</p>${t[4]?`<div class="ex">${esc(t[4])}</div>`:''}</div>`).join('')}</div></div>`).join('')
    : '<div class="empty">찾는 용어가 없어요. 다른 말로 검색해 보세요.</div>';
}
document.getElementById('tq').addEventListener('input',renderTerms);
const TERM_KEYS=[]; TERMS.forEach((t,i)=>{TERM_KEYS.push([t[1],i]); if(t[2] && /[가-힣]/.test(t[2]) && !t[2].includes('·')) TERM_KEYS.push([t[2],i]); else if(t[2] && /^[A-Z]{2,6}$/.test(t[2])) TERM_KEYS.push([t[2],i]);});
TERM_KEYS.push(['DSR',4],['LTV',3]);
TERM_KEYS.sort((a,b)=>b[0].length-a[0].length);
function linkTerms(html){
  const used=new Set(); let out=html;
  TERM_KEYS.forEach(([k,i])=>{ if(used.has(i)) return; const p=out.indexOf(k); if(p<0) return;
    if(out.slice(0,p).lastIndexOf('<')>out.slice(0,p).lastIndexOf('>')) return;
    used.add(i); out=out.slice(0,p)+`<button class="tm" type="button" data-term="${i}">${k}</button>`+out.slice(p+k.length); });
  return out;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('.tm'); if(!b) return;
  const t=TERMS[+b.dataset.term]; const card=b.closest('.ncard'); if(!card) return;
  let pop=card.querySelector('.termpop'); if(!pop){pop=document.createElement('div');pop.className='termpop';b.closest('.ai').after(pop);}
  pop.innerHTML=`<b>${esc(t[1])}</b> ${esc(t[3])} <a href="#terms" style="font-size:12px">용어사전 →</a>`;
});

/* ---------- 자금계획 ---------- */
function buyCosts(p){
  const ar=acqRate(p,1), acq=p*ar, edu=p*ar*.1, br=broker(p,false).fee, legal=50+p*.0005, pub=p*.69, bond=pub*bondRatio(pub)*.07;
  return acq+edu+br+legal+bond+stampTax(p)+7.5+300;
}
function annuityFactor(rate,years){const r=rate/12,n=years*12;return r>0?12*r/(1-Math.pow(1+r,-n)):12/n;}
function loanLimit(p,o){
  const ltv = o.region==='reg' ? (o.first?.7:.4) : (o.first?.8:.7);
  let cap=Infinity; if(o.region==='reg') cap = p<=150000?60000:p<=250000?40000:20000; if(o.first) cap=Math.min(cap,60000);
  const dsr=Math.max(0,(o.inc*.4-o.debt))/annuityFactor(o.rate+o.stress,o.term);
  const parts=[['LTV '+Math.round(ltv*100)+'%',p*ltv],['가격대 상한',cap],['DSR 40%',dsr]];
  let min=parts[0]; parts.forEach(x=>{if(x[1]<min[1]) min=x;});
  return {loan:Math.max(0,min[1]),bind:min[0],parts,ltv,cap,dsr};
}
function plan(){
  const o={inc:num('p_inc'),debt:num('p_debt'),cash:num('p_cash'),save:num('p_save'),ret:num('p_ret')/100,target:num('p_target'),grow:num('p_grow')/100,
    region:$('p_region').value,first:$('p_first').value==='first',rate:num('p_rate')/100,stress:num('p_stress')/100,term:Math.max(1,num('p_term'))};
  $('p_targetc').textContent=won(o.target);
  let lo=0,hi=1000000;
  for(let k=0;k<60;k++){const m=(lo+hi)/2; const need=m+buyCosts(m)-loanLimit(m,o).loan; if(need<=o.cash) lo=m; else hi=m;}
  const maxNow=lo;
  const L=loanLimit(o.target,o), needT=o.target+buyCosts(o.target)-L.loan;
  $('pl1').textContent=won(maxNow); $('pl1s').textContent=`모은 돈 ${won(o.cash)} 기준`;
  $('pl2').textContent=won(L.loan); $('pl2s').innerHTML=`가장 작은 기준: ${L.bind}`;
  $('pl3').textContent=won(needT); $('pl3s').textContent=`집값 + 부대비용 ${won(buyCosts(o.target))} − 대출`;
  const rm=Math.pow(1+o.ret,1/12)-1; let s=o.cash, month=-1; const pts=[];
  for(let k=0;k<=360;k++){
    const price=o.target*Math.pow(1+o.grow,k/12); const need=price+buyCosts(price)-loanLimit(price,o).loan;
    if(k%12===0) pts.push([k/12,s,need]);
    if(month<0 && s>=need) month=k;
    s=s*(1+rm)+o.save;
  }
  if(month===0){$('pl4').textContent='지금 가능'; $('pl4s').textContent='모은 돈으로 충분해요';}
  else if(month>0){const d=new Date(); d.setMonth(d.getMonth()+month); $('pl4').textContent=`${Math.floor(month/12)}년 ${month%12}개월`; $('pl4s').textContent=`${d.getFullYear()}년 ${d.getMonth()+1}월쯤`;}
  else {$('pl4').textContent='30년 이상'; $('pl4s').textContent='저축액이나 목표를 조정해 보세요';}
  const yrs=Math.min(pts.length-1, month>0? Math.ceil(month/12)+2 : 15), sl=pts.slice(0,Math.max(yrs,5)+1);
  const maxV=Math.max(...sl.map(p=>Math.max(p[1],p[2])),1)*1.08, X=i=>50+i*(570/(sl.length-1)), Y=v=>200-v/maxV*180;
  let g='';
  for(let t=0;t<=4;t++){const v=maxV*t/4;g+=`<line x1="50" x2="620" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="44" y="${Y(v)+4}" text-anchor="end">${(v/10000).toFixed(0)}억</text>`;}
  sl.forEach((p,i)=>{ if(i%Math.ceil(sl.length/8)===0) g+=`<text x="${X(i)}" y="218" text-anchor="middle">${i}년</text>`;});
  g+=`<polyline fill="none" stroke="var(--cost)" stroke-width="2.5" points="${sl.map((p,i)=>X(i)+','+Y(p[2])).join(' ')}"/>`;
  g+=`<polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="${sl.map((p,i)=>X(i)+','+Y(p[1])).join(' ')}"/>`;
  if(month>0 && month/12<sl.length-1){const xi=50+(month/12)*(570/(sl.length-1)); g+=`<line x1="${xi}" x2="${xi}" y1="20" y2="200" stroke="var(--gain)" stroke-dasharray="4 3"/><text x="${xi+4}" y="30" style="fill:var(--gain)">도달</text>`;}
  $('plchart').innerHTML=g;
  $('plwhy').innerHTML=L.parts.map(p=>item(p[0]+(p[0]===L.bind?' <span class="bind">이 값이 한도</span>':''),p[1]===Infinity?0:p[1],
    p[0].startsWith('LTV')?`목표 집값 ${won(o.target)} × ${Math.round(L.ltv*100)}%`:p[0]==='가격대 상한'?(p[1]===Infinity?'비규제지역은 가격대 상한 없음':'수도권·규제지역 15억 이하 6억, 25억 이하 4억, 초과 2억'):
    `(연소득 ${won(o.inc)} × 40% − 다른 대출 ${won(o.debt)}) ÷ 금리 ${((o.rate+o.stress)*100).toFixed(2)}%(스트레스 포함), ${o.term}년 원리금균등`)).join('')
    + item('실제로 내는 월 상환액',L.loan*annuityFactor(o.rate,o.term)/12,`스트레스 금리 없이 ${(o.rate*100).toFixed(2)}%로 계산`);
}
$('pf').addEventListener('input',plan); $('pf').addEventListener('submit',e=>e.preventDefault());

/* ---------- 저장 (시나리오·노트) ---------- */
let DB=null, UID=null, SCEN=[], NOTES=[];
const pdate=s=>s?String(s).slice(0,10):'';
function renderScen(){
  const el=$('sctbl');
  if(!DB||!UID){el.innerHTML='<p class="msg" style="margin:10px 0 0">로그인한 상태에서 열면 저장할 수 있어요.</p>';}
  else if(!SCEN.length){el.innerHTML='<p class="msg" style="margin:10px 0 0">아직 저장한 시나리오가 없어요.</p>';}
  else el.innerHTML=`<table class="sctbl"><thead><tr><th>이름</th><th>매수 → 매도</th><th>보유</th><th>순이익</th><th>연 수익률</th><th>부대비용</th><th></th></tr></thead><tbody>${SCEN.map(s=>`<tr><td>${esc(s.name)}</td><td>${won(s.buy)} → ${won(s.sell)}</td><td>${s.years}년</td><td class="${s.profit>=0?'pos':'neg'}">${won(s.profit,true)}</td><td>${pct(s.irr,2)}</td><td>${won(s.cost)}</td><td><button type="button" data-load="${s.id}">불러오기</button><button type="button" class="del" data-del="${s.id}">삭제</button></td></tr>`).join('')}</tbody></table>`;
  el.querySelectorAll('[data-load]').forEach(b=>b.addEventListener('click',()=>{const s=SCEN.find(x=>x.id===b.dataset.load); if(!s) return;
    Object.entries(s.inputs||{}).forEach(([k,v])=>{const f=document.getElementById(k); if(!f) return; if(f.type==='checkbox') f.checked=!!v; else f.value=v;}); calc(); $('scmsg').textContent=`"${s.name}" 조건을 불러왔어요.`; window.scrollTo({top:0,behavior:'smooth'});}));
  el.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',async()=>{
    if(b.dataset.armed!=='1'){b.dataset.armed='1';b.textContent='정말 삭제';return;}
    try{await DB.collection(`data/users/${UID}/scenarios/items`).doc(b.dataset.del).delete();}catch(e){$('scmsg').textContent='삭제하지 못했어요. 다시 시도해 주세요.';}}));
  const h=$('homesc');
  h.innerHTML = SCEN.length ? SCEN.slice(0,3).map(s=>`<button type="button" data-hs="${s.id}"><span>${esc(s.name)}</span><span>${won(s.profit,true)} · ${pct(s.irr,1)}</span></button>`).join('') : '<p class="msg">계산기에서 "지금 조건 저장"을 누르면 여기 보여요.</p>';
  h.querySelectorAll('[data-hs]').forEach(b=>b.addEventListener('click',()=>{location.hash='calc'; setTimeout(()=>document.querySelector(`[data-load="${b.dataset.hs}"]`)?.click(),50);}));
}
$('scsave').addEventListener('click',async()=>{
  const name=$('scname').value.trim();
  if(!name){$('scmsg').textContent='시나리오 이름을 먼저 적어 주세요.';$('scname').focus();return;}
  if(!DB||!UID){$('scmsg').textContent='로그인한 상태에서만 저장할 수 있어요.';return;}
  const inputs={}; document.querySelectorAll('#f input,#f select').forEach(f=>{inputs[f.id]= f.type==='checkbox'?f.checked:f.value;});
  const L=window.LAST||{}; const id='s'+Date.now();
  try{ await DB.collection(`data/users/${UID}/scenarios/items`).doc(id).set({name,inputs,buy:L.buy,sell:L.sell,years:L.Y,profit:L.profit,irr:isFinite(L.R)?L.R:null,cost:L.costTotal,createdAt:new Date().toISOString()});
    $('scname').value=''; $('scmsg').textContent=`"${name}" 저장했어요.`; }
  catch(e){ $('scmsg').textContent='저장하지 못했어요. 잠시 후 다시 눌러 주세요.'; }
});
const CHECKS=['역까지 도보 10분 이내','언덕 없음','채광 좋음','소음 적음','학교·마트 가까움','주차 여유','단지 관리 좋음','실매물 확인'];
let STAR=0;
function setupNoteForm(){
  $('n_stars').innerHTML=[1,2,3,4,5].map(n=>`<button type="button" data-s="${n}" aria-label="${n}점">${n}</button>`).join('');
  $('n_stars').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{STAR=+b.dataset.s; $('n_stars').querySelectorAll('button').forEach(x=>x.classList.toggle('on',+x.dataset.s<=STAR));}));
  $('n_checks').innerHTML=CHECKS.map((c,i)=>`<label><input type="checkbox" id="nc${i}">${c}</label>`).join('');
  $('n_date').value=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);
  $('n_apt').addEventListener('change',()=>{$('n_customw').hidden=$('n_apt').value!=='__custom';});
}
function fillAptSelect(){
  const cur=$('n_apt').value;
  $('n_apt').innerHTML='<option value="__custom">직접 입력</option>'+APTS.map(a=>`<option value="${esc(a.name)}">${esc(a.name)}</option>`).join('');
  if(cur) $('n_apt').value=cur; else if(APTS.length) $('n_apt').value=APTS[0].name;
  $('n_customw').hidden=$('n_apt').value!=='__custom';
}
$('nf').addEventListener('submit',async e=>{
  e.preventDefault();
  const apt=$('n_apt').value==='__custom'?$('n_custom').value.trim():$('n_apt').value;
  if(!apt){$('nmsg').textContent='단지 이름을 적어 주세요.';return;}
  if(!DB||!UID){$('nmsg').textContent='로그인한 상태에서만 저장할 수 있어요.';return;}
  const checks={}; CHECKS.forEach((c,i)=>checks[c]=$('nc'+i).checked);
  try{ await DB.collection(`data/users/${UID}/notes/items`).doc('n'+Date.now()).set({apt,date:$('n_date').value,stars:STAR,checks,memo:$('n_memo').value.trim(),createdAt:new Date().toISOString()});
    $('n_memo').value=''; CHECKS.forEach((c,i)=>$('nc'+i).checked=false); STAR=0; $('n_stars').querySelectorAll('button').forEach(x=>x.classList.remove('on'));
    $('nmsg').textContent='저장했어요.'; }
  catch(err){ $('nmsg').textContent='저장하지 못했어요. 잠시 후 다시 눌러 주세요.'; }
});
function renderNotes(){
  const el=$('nlist');
  if(!DB||!UID){el.innerHTML='<div class="empty" style="grid-column:1/-1">로그인한 상태에서 열면 노트를 쓸 수 있어요.</div>';}
  else if(!NOTES.length){el.innerHTML='<div class="empty" style="grid-column:1/-1">첫 임장 노트를 남겨 보세요. 지도에서 단지를 누르고 "임장 노트 쓰기"를 눌러도 돼요.</div>';}
  else el.innerHTML=NOTES.map(n=>`<article class="ncard"><div class="meta"><span class="cat market">${'★'.repeat(n.stars||0)||'점수 없음'}</span><span>${esc(n.date)}</span></div><h4>${esc(n.apt)}</h4>
    <div class="tags">${Object.entries(n.checks||{}).map(([k,v])=>`<span class="${v?'':'x'}">${esc(k)}</span>`).join('')}</div>
    ${n.memo?`<div class="memo">${esc(n.memo)}</div>`:''}
    <div style="margin-top:auto"><button class="btn ghost" type="button" data-nd="${n.id}">삭제</button></div></article>`).join('');
  el.querySelectorAll('[data-nd]').forEach(b=>b.addEventListener('click',async()=>{
    if(b.dataset.armed!=='1'){b.dataset.armed='1';b.textContent='정말 삭제';return;}
    try{await DB.collection(`data/users/${UID}/notes/items`).doc(b.dataset.nd).delete();}catch(e){b.textContent='삭제 실패';}}));
  const h=$('homent');
  h.innerHTML = NOTES.length ? NOTES.slice(0,3).map(n=>`<a href="#notes"><span>${esc(n.apt)}</span><span>${esc(n.date)} · ${'★'.repeat(n.stars||0)}</span></a>`).join('') : '<p class="msg">임장 노트를 쓰면 여기 보여요.</p>';
}

/* ---------- 홈 ---------- */
let IND=null;
function renderHome(){
  renderHeroCard();
  if(BRIEFS.length){ $('homehead').innerHTML=linkTermsPlain(esc(BRIEFS[0].headline||'')); }
  else $('homehead').textContent='아직 브리핑이 없어요.';
  if(!IND){ return; }
  $('homeasof').textContent=`지표 ${IND.updatedAt||''} 기준 · 매주 월요일 갱신`;
  $('nums').innerHTML=(IND.items||[]).map(n=>{const c=n.change||'';const cls=/^[+▲]/.test(c)?(n.upIsBad?'neg':'pos'):/^[−\-▼]/.test(c)?(n.upIsBad?'pos':'neg'):'';
    return `<div class="num"><div class="l">${esc(n.label)}${n.tag?`<em>${esc(n.tag)}</em>`:''}</div><div class="v">${esc(n.value)}</div><div class="d ${cls}">${esc(c)}</div>${n.why?`<div class="s" style="color:var(--accent)">${esc(n.why)}</div>`:''}<div class="s">${esc(n.asOf||'')} · ${esc(n.source||'')}</div></div>`;}).join('');
  const sg=IND.signals||[];
  $('signals').innerHTML=sg.map(s=>`<div class="sig"><span class="dot ${esc(s.state)}" aria-label="${s.state==='green'?'초록':s.state==='yellow'?'노랑':'빨강'}"></span><b>${esc(s.label)}</b><p>${esc(s.reason)}</p></div>`).join('')+(IND.verdict?`<div class="verdict">${esc(IND.verdict)}</div>`:'');
}
function linkTermsPlain(h){return h;}

/* ---------- 연결 ---------- */
const _pick=pick;
pick=function(i){ _pick(i); const a=APTS[i]; const row=document.querySelector('#aptcard div[style*="margin-top:10px"]');
  if(row && !row.querySelector('#tonote')){ const b=document.createElement('button'); b.className='btn ghost'; b.id='tonote'; b.type='button'; b.textContent='임장 노트 쓰기';
    b.addEventListener('click',()=>{ fillAptSelect(); $('n_apt').value=a.name; $('n_customw').hidden=true; location.hash='notes'; $('n_memo').focus(); }); row.appendChild(b);
    const cnt=NOTES.filter(n=>n.apt===a.name).length; if(cnt){const s=document.createElement('span');s.className='msg';s.textContent=`노트 ${cnt}개`;row.appendChild(s);} } };
setupNoteForm(); renderTerms(); plan();
(async()=>{
  try{ DB = window.claude ? await claude.use('db') : null; }catch(e){DB=null;}
  let user=null; try{ user = window.claude ? await claude.use('user') : null; }catch(e){user=null;}
  if(user){ try{ UID=await user.id(); }catch(e){UID=null;} }
  renderScen(); renderNotes();
  if(!DB) return;
  DB.doc('districts/latest').onSnapshot(d=>{ DIST=d.data()||null; const lab=DIST?`${DIST.label||''}`:''; const dl=document.getElementById('distlabel'); if(dl) dl.textContent=lab; $('minilabel').textContent=lab; drawMini(); renderMovers(); if(!document.getElementById('v-map').hidden) drawMap(); },()=>{});
  DB.doc('indicators/latest').onSnapshot(d=>{ IND=d.data()||null; renderHome(); },()=>{});
  DB.collection('apts').onSnapshot(()=>{ setTimeout(fillAptSelect,0); },()=>{});
  if(UID){
    DB.collection(`data/users/${UID}/scenarios/items`).orderBy('createdAt','desc').onSnapshot(s=>{SCEN=s.docs.map(d=>({id:d.id,...d.data()}));renderScen();},()=>{});
    DB.collection(`data/users/${UID}/notes/items`).orderBy('createdAt','desc').onSnapshot(s=>{NOTES=s.docs.map(d=>({id:d.id,...d.data()}));renderNotes();},()=>{});
  }
})();
