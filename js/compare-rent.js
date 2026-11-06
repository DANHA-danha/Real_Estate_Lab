/* ---------- 단지 비교 ---------- */
let CMP=[];
renderList=function(){
  const el=document.getElementById('alist');
  if(!APTS.length){el.innerHTML='<p style="font-size:13px;color:var(--muted);margin:6px 0">아직 등록된 단지가 없어요.</p>';return;}
  const order=APTS.map((a,i)=>[a,i]).sort((x,y)=>(y[0].zone?1:0)-(x[0].zone?1:0)||x[0].name.localeCompare(y[0].name,'ko'));
  el.innerHTML=order.map(([a,i])=>{const on=CMP.includes(a.name);return `<div class="arow2"><button class="arow" data-i="${i}" type="button"><span>${esc(a.name)}</span><span>${a.price?priceLabel(a):esc((a.hood||'').split(' ')[0])}</span></button><button class="cmpb${on?' on':''}" type="button" data-c="${esc(a.name)}" aria-pressed="${on}">${on?'비교 중':'비교'}</button></div>`;}).join('');
  el.querySelectorAll('.arow').forEach(b=>b.addEventListener('click',()=>pick(+b.dataset.i)));
  el.querySelectorAll('.cmpb').forEach(b=>b.addEventListener('click',()=>toggleCmp(b.dataset.c)));
};
function toggleCmp(name){
  if(CMP.includes(name)) CMP=CMP.filter(n=>n!==name);
  else { if(CMP.length>=3){ $('cmpmsg').textContent='한 번에 3곳까지 비교할 수 있어요. 하나를 빼고 골라 주세요.'; return; } CMP.push(name); }
  $('cmpmsg').textContent=''; renderList(); renderCmp();
}
function renderCmp(){
  const el=$('cmpbody');
  const list=CMP.map(n=>APTS.find(a=>a.name===n)).filter(Boolean);
  if(!list.length){ el.innerHTML='<p class="msg" style="margin:0">단지 목록에서 "비교"를 눌러 2~3곳을 골라 보세요.</p>'; return; }
  const yr=new Date().getFullYear();
  const notesOf=a=>NOTES.filter(n=>n.apt===a.name);
  const avg=a=>{const ns=notesOf(a).filter(n=>n.stars);return ns.length?(ns.reduce((s,n)=>s+n.stars,0)/ns.length):null;};
  const rows=[
    ['동네',a=>esc(a.hood||'—')],
    ['업무지구 사이 벨트',a=>a.zone?'<span class="pos">안</span>':'밖'],
    ['가까운 역',a=>esc(a.station||'—')],
    ['3호선 역세권',a=>/3호선/.test(a.station||'')?'<span class="pos">예</span>':'아니요'],
    ['세대수',a=>a.units?a.units.toLocaleString()+'세대':'—'],
    ['연식',a=>a.built?`${a.built}년 (${yr-a.built}년차)`:'—'],
    ['최근 실거래가',a=>a.price?priceLabel(a)+(a.deal?` <small class="msg">${esc(a.deal)}</small>`:''):'<span class="msg">연동 전</span>'],
    ['가까운 업무지구',a=>{const d=CBD.map(c=>[c[0],Math.hypot((a.lon-c[1])*88.2,(a.lat-c[2])*111)]).sort((x,y)=>x[1]-y[1])[0];return `${d[0]} 약 ${d[1].toFixed(1)}km`;}],
    ['내 임장 점수',a=>{const v=avg(a);return v?'★'.repeat(Math.round(v))+` <small class="msg">${v.toFixed(1)}</small>`:'<span class="msg">노트 없음</span>';}],
    ['임장 노트',a=>notesOf(a).length+'개']
  ];
  el.innerHTML=`<div class="tbl"><table class="cmpt"><thead><tr><th></th>${list.map(a=>`<th>${esc(a.name)} <button type="button" class="cmpx" data-x="${esc(a.name)}" aria-label="${esc(a.name)} 빼기">빼기</button></th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td>${list.map(a=>`<td>${r[1](a)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  el.querySelectorAll('.cmpx').forEach(b=>b.addEventListener('click',()=>toggleCmp(b.dataset.x)));
}
const _renderNotes=renderNotes; renderNotes=function(){_renderNotes(); renderCmp();};

/* ---------- 주거비 비교 ---------- */
function cgt1(buy,sell,years,expense){
  const gain=sell-buy-expense; if(gain<=0||years<2) return 0;
  if(sell<=120000) return 0;
  const part=gain*(sell-120000)/sell, ltd=years>=3?Math.min(.4,.04*Math.min(years,10))*2:0;
  const base=Math.max(0,part*(1-ltd)-250); return progTax(base).t*1.1;
}
function rentCalc(o){
  const N=o.years, r=o.dep;
  const P=o.price, sell=P*Math.pow(1+o.grow,N), loan=Math.min(o.loan,P);
  const acq=buyCosts(P), interest=loan*o.mrate*N;
  let hold=0; for(let y=1;y<=N;y++){const pub=(P*Math.pow(1+o.grow,y-.5))*.69; hold+=propertyTax(pub,true).total+compTax(pub,1,y).total;}
  const maint=o.maint*N, sb=broker(sell,false).fee, tax=cgt1(P,sell,N,acq-300+sb);
  const ownB=P-loan+acq, oppB=ownB*(Math.pow(1+r,N)-1);
  const buy={label:'매수',own:ownB,items:[['취득 비용',acq],['대출이자',interest],['보유세',hold],['수선·유지',maint],['팔 때 중개보수·양도세',sb+tax],['내 돈의 기회비용',oppB],['집값 상승분',-(sell-P)]]};
  const jl=Math.min(o.jloan,o.jeonse), ownJ=o.jeonse-jl, renew=Math.ceil(N/2);
  const jeonse={label:'전세',own:ownJ,items:[['전세대출 이자',jl*o.jrate*N],['내 보증금의 기회비용',ownJ*(Math.pow(1+r,N)-1)],['중개보수(계약 '+renew+'번)',broker(o.jeonse,false).fee*renew*.75],['이사비',300*renew]]};
  const wolse={label:'월세',own:o.wdep,items:[['월세',o.wrent*12*N],['보증금의 기회비용',o.wdep*(Math.pow(1+r,N)-1)],['중개보수(계약 '+renew+'번)',Math.max(30,(o.wdep+o.wrent*100)*.004)*renew],['이사비',300*renew]]};
  [buy,jeonse,wolse].forEach(x=>x.total=x.items.reduce((s,i)=>s+i[1],0));
  return {buy,jeonse,wolse,sell};
}
function rentView(){
  const o={price:num('r_price'),jeonse:num('r_jeonse'),wdep:num('r_wdep'),wrent:num('r_wrent'),loan:num('r_loan'),jloan:num('r_jloan'),
    years:Math.max(1,Math.round(num('r_years'))),grow:num('r_grow')/100,dep:num('r_dep')/100,mrate:num('r_mrate')/100,jrate:num('r_jrate')/100,maint:200};
  ['r_price','r_jeonse'].forEach(id=>$(id+'c').textContent=won(num(id)));
  const R=rentCalc(o), opts=[R.buy,R.jeonse,R.wolse], best=opts.reduce((a,b)=>a.total<b.total?a:b);
  let lo=-0.1,hi=0.2; const other=Math.min(R.jeonse.total,R.wolse.total);
  for(let k=0;k<50;k++){const m=(lo+hi)/2; const t=rentCalc({...o,grow:m}).buy.total; if(t>other) lo=m; else hi=m;}
  const be=(lo+hi)/2;
  $('rtiles').innerHTML=opts.map(x=>`<div class="tile${x===best?' main':''}"><div class="l">${x.label}${x===best?' <span class="badge">가장 적게 듦</span>':''}</div><div class="v">${won(x.total)}</div><div class="s">월 평균 ${won(x.total/(o.years*12))} · 처음 필요한 돈 ${won(x.own)}</div></div>`).join('')
    +`<div class="tile"><div class="l">매수가 유리해지는 집값 상승률</div><div class="v">${(be*100).toFixed(1)}%</div><div class="s">연 ${(be*100).toFixed(1)}% 넘게 오르면 매수 쪽 비용이 더 적어요</div></div>`;
  const maxV=Math.max(...opts.map(x=>Math.abs(x.total)),1);
  $('rbars').innerHTML=opts.map(x=>`<div class="wfr${x===best?' total':''}"><span>${x.label}</span><div class="track"><div class="bar" style="left:0;width:${Math.max(0,x.total)/maxV*100}%;background:${x===best?'var(--gain)':'var(--accent)'}"></div></div><span class="amt">${won(x.total)}</span></div>`).join('');
  $('rdetail').innerHTML=opts.map(x=>`<details${x===R.buy?' open':''}><summary><span class="chev"></span><span class="t">${x.label}</span><span class="c">${o.years}년 동안</span><span class="a">${won(x.total)}</span></summary><div class="items">${x.items.map(i=>item(i[0],i[1],'',i[1]<0?'pos':'')).join('')}${x===R.buy?`<div class="it"><div class="n" style="color:var(--muted)">참고: ${o.years}년 뒤 예상 시세</div><div class="m">${won(R.sell)}</div></div>`:''}</div></details>`).join('');
}
$('rf').addEventListener('input',rentView); $('rf').addEventListener('submit',e=>e.preventDefault());
rentView(); renderCmp();
