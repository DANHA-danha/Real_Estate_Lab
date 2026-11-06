const $=id=>document.getElementById(id);
const num=id=>{const v=parseFloat($(id).value);return isFinite(v)?v:0};
function won(v,sign){
  const neg=v<0, a=Math.round(Math.abs(v));
  const eok=Math.floor(a/10000), man=a%10000;
  let s = eok ? eok+'억'+(man?' '+man.toLocaleString()+'만':'') : man.toLocaleString()+'만';
  if(a===0) s='0원';
  return (neg?'−':(sign&&v>0?'+':''))+s;
}
const pct=(v,d=1)=>(isFinite(v)?(v*100).toFixed(d):'—')+'%';

function acqRate(price,houses){
  if(houses>=3) return .12;
  if(houses===2) return .08;
  if(price<=60000) return .01;
  if(price<=90000) return (price/10000*2/3-3)/100;
  return .03;
}
function brokerRate(p){
  if(p<5000) return {r:.006,cap:25};
  if(p<20000) return {r:.005,cap:80};
  if(p<90000) return {r:.004,cap:Infinity};
  if(p<120000) return {r:.005,cap:Infinity};
  if(p<150000) return {r:.006,cap:Infinity};
  return {r:.007,cap:Infinity};
}
function broker(p,vat){const b=brokerRate(p);let f=Math.min(p*b.r,b.cap);if(vat)f*=1.1;return {fee:f,r:b.r};}
function bondRatio(pub){
  if(pub<2000) return 0;
  if(pub<5000) return .013; if(pub<10000) return .019; if(pub<16000) return .021;
  if(pub<26000) return .023; if(pub<60000) return .026; return .031;
}
function stampTax(p){ if(p<=1000) return 0; if(p<=3000) return 2; if(p<=5000) return 4; if(p<=10000) return 7; if(p<=100000) return 15; return 35; }

function propertyTax(pub,one){
  const ratio = one ? (pub<=30000?.43:pub<=60000?.44:.45) : .60;
  const base=pub*ratio;
  let t;
  if(base<=6000) t=base*.001;
  else if(base<=15000) t=6+(base-6000)*.0015;
  else if(base<=30000) t=19.5+(base-15000)*.0025;
  else t=57+(base-30000)*.004;
  const city=base*.0014, edu=t*.2;
  return {t,city,edu,total:t+city+edu,base,ratio};
}
function compTax(pub,houses,heldYears){
  const ded = houses===1?120000:90000;
  if(pub<=ded) return {t:0,agri:0,total:0,base:0,credit:0};
  const base=(pub-ded)*.6;
  const lo=[[30000,.005],[60000,.007],[120000,.01],[250000,.013],[500000,.015],[940000,.02],[Infinity,.027]];
  const hi=[[30000,.005],[60000,.007],[120000,.01],[250000,.02],[500000,.03],[940000,.04],[Infinity,.05]];
  const br = houses>=3?hi:lo;
  let t=0,prev=0;
  for(const [cap,r] of br){ if(base>prev){t+=(Math.min(base,cap)-prev)*r;} prev=cap; }
  let credit=0;
  if(houses===1){ credit = heldYears>=15?.5:heldYears>=10?.4:heldYears>=5?.2:0; }
  t*= (1-credit);
  const agri=t*.2;
  return {t,agri,total:t+agri,base,credit};
}
function progTax(base){
  const br=[[1400,.06,0],[5000,.15,126],[8800,.24,576],[15000,.35,1544],[30000,.38,1994],[50000,.40,2594],[100000,.42,3594],[Infinity,.45,6594]];
  for(const [cap,r,d] of br) if(base<=cap) return {t:Math.max(0,base*r-d),r};
}

function irr(cfs){
  const npv=r=>cfs.reduce((s,c,i)=>s+c/Math.pow(1+r,i),0);
  let lo=-0.05,hi=0.05;
  if(npv(lo)*npv(hi)>0) return NaN;
  for(let k=0;k<200;k++){const m=(lo+hi)/2; if(npv(lo)*npv(m)<=0) hi=m; else lo=m;}
  return Math.pow(1+(lo+hi)/2,12)-1;
}

function item(name,amt,why,cls){
  return `<div class="it"><div class="n">${name}</div><div class="m ${cls||''}">${won(amt)}</div>${why?`<div class="w">${why}</div>`:''}</div>`;
}

function calc(){
  const buy=num('buy'), sell=num('sell'), Y=Math.max(1,Math.round(num('years')));
  const loan=Math.min(num('loan'),buy), rate=num('rate')/100, term=Math.max(1,num('term'));
  const houses=+$('houses').value, live=Math.min(num('live'),Y), rent=num('rent');
  const big=$('big').checked, vat=$('vat').checked, intexp=$('intexp').checked;
  const interior=num('interior'), move=num('move'), maint=num('maint');
  const real=num('real')/100, bdisc=num('bdisc')/100;
  const dep=num('dep')/100, bond=num('bond')/100, itax=num('itax')/100;
  const region=$('region').value, btype=$('btype').value;

  $('buyc').textContent=won(buy); $('sellc').textContent=won(sell);

  /* 대출 한도 안내 */
  let ltv = region==='reg' ? (btype==='first'?.7:.4) : (btype==='first'?.8:.7);
  let cap = Infinity;
  if(region==='reg'){ cap = buy<=150000?60000: buy<=250000?40000:20000; }
  if(btype==='first') cap=Math.min(cap,60000);
  let lim = houses>=2 && region==='reg' ? 0 : Math.min(buy*ltv,cap);
  $('ltvhint').innerHTML = houses>=2 && region==='reg'
    ? '규제지역 다주택자는 주택구입 목적 주담대가 막혀 있어요.'
    : `LTV ${Math.round(ltv*100)}%${cap<Infinity?`, 가격대 상한 ${won(cap)}`:''} 기준 최대 <b>${won(lim)}</b>까지예요. 소득(DSR)에 따라 더 줄 수 있어요.`;

  /* 살 때 */
  const ar=acqRate(buy,houses);
  const acq=buy*ar;
  const eduR = ar<=.03 ? ar*.1 : .004;
  const edu=buy*eduR;
  const agriR = big ? (houses>=3?.01:houses===2?.006:.002) : 0;
  const agri=buy*agriR;
  const bb=broker(buy,vat);
  const legal=50+buy*.0005;
  const pub0=buy*real;
  const bR=bondRatio(pub0), bondCost=pub0*bR*bdisc;
  const stamp=stampTax(buy)+7.5;
  const buyItems=[
    ['취득세',acq,`${won(buy)} × ${(ar*100).toFixed(2)}% (${houses===1?'1주택 세율':houses+'주택 중과'})`],
    ['지방교육세',edu,`${won(buy)} × ${(eduR*100).toFixed(2)}%`],
    ['농어촌특별세',agri,big?`${won(buy)} × ${(agriR*100).toFixed(1)}% (85㎡ 초과)`:'전용 85㎡ 이하는 면제'],
    ['중개보수',bb.fee,`${won(buy)} × ${(bb.r*100).toFixed(1)}% 상한${vat?' + 부가세':''}`],
    ['법무사·등기 수수료',legal,'기본 50만 + 매수가의 0.05% (견적마다 다름)'],
    ['국민주택채권 할인비용',bondCost,`공시가 ${won(pub0)} × 매입비율 ${(bR*1000).toFixed(0)}/1000 × 할인 ${(bdisc*100).toFixed(1)}%`],
    ['인지세',stamp,'매매계약서 + 대출약정서 본인 부담분'],
    ['인테리어',interior,intexp?'양도세 계산 때 필요경비로 빠짐':'필요경비 미인정으로 설정'],
    ['이사비',move,'']
  ];
  const buyTotal=buyItems.reduce((s,x)=>s+x[1],0);
  const equity0=buy-loan+buyTotal;

  /* 대출 상환 */
  const m=Y*12, r=rate/12, n=term*12;
  let pay, bal=loan, intSum=0, prinSum=0;
  const yearInt=[], yearPrin=[];
  if($('rtype').value==='amort'){ pay = r>0 ? loan*r/(1-Math.pow(1+r,-n)) : loan/n; }
  else pay = loan*r;
  let yi=0,yp=0;
  for(let k=1;k<=m;k++){
    const it=bal*r; let pr=$('rtype').value==='amort'?Math.min(pay-it,bal):0;
    if(k>n){pr=0;}
    bal-=pr; intSum+=it; prinSum+=pr; yi+=it; yp+=pr;
    if(k%12===0){yearInt.push(yi);yearPrin.push(yp);yi=0;yp=0;}
  }

  /* 보유세 연도별 */
  const rows=[]; let propSum=0, compSum=0;
  for(let y=1;y<=Y;y++){
    const price=buy+(sell-buy)*(y-.5)/Y, pub=price*real;
    const pt=propertyTax(pub,houses===1), ct=compTax(pub,houses,y);
    propSum+=pt.total; compSum+=ct.total;
    rows.push({y,price,pub,pt,ct,int:yearInt[y-1]||0});
  }
  const maintSum=maint*Y;
  const holdTotal=intSum+propSum+compSum+maintSum;

  /* 팔 때 */
  const sb=broker(sell,vat);
  const necessary = acq+edu+agri+bb.fee+legal+bondCost+stamp-7.5+(intexp?interior:0)+sb.fee;
  const gain = sell-buy-necessary;
  let cgt=0, cgtWhy='', taxable=0, ltd=0, exempt=false, cgtRate=0;
  if(gain<=0){ cgtWhy='차익이 없어서 양도세가 없어요'; }
  else if(houses===1 && Y>=2 && live>=2){
    if(sell<=120000){ exempt=true; cgtWhy='1세대 1주택, 2년 보유·거주, 매도가 12억 이하라 비과세'; }
    else{
      const part = gain*(sell-120000)/sell;
      ltd = Y>=3 ? Math.min(.4,.04*Math.min(Y,10)) + Math.min(.4,.04*Math.min(live,10)) : 0;
      taxable = part*(1-ltd);
      const base=Math.max(0,taxable-250);
      const p=progTax(base); cgt=p.t*1.1; cgtRate=p.r;
      cgtWhy=`12억 초과분 비율 ${pct((sell-120000)/sell)} 만 과세 → 장기보유특별공제 ${pct(ltd,0)} → 기본공제 250만 → 최고구간 ${pct(p.r,0)} + 지방소득세 10%`;
    }
  } else {
    let surcharge=0;
    if(houses===2 && region==='reg') surcharge=.2;
    if(houses>=3 && region==='reg') surcharge=.3;
    ltd = (surcharge===0 && Y>=3) ? Math.min(.3,.02*Y) : 0;
    taxable=gain*(1-ltd);
    const base=Math.max(0,taxable-250);
    if(Y<1){cgt=base*.7*1.1;cgtWhy='1년 미만 보유 70% 단일세율';}
    else if(Y<2){cgt=base*.6*1.1;cgtWhy='2년 미만 보유 60% 단일세율';}
    else{
      const p=progTax(base); cgt=(p.t+base*surcharge)*1.1; cgtRate=p.r+surcharge;
      cgtWhy = surcharge ? `조정지역 ${houses}주택 중과 +${surcharge*100}%p, 장특공 없음` :
        (houses===1 ? `실거주 2년 미만이라 1주택 비과세 불가 → 일반 장특공 ${pct(ltd,0)}` : `일반 장특공 ${pct(ltd,0)}`);
      cgtWhy+=` → 최고구간 ${pct(cgtRate,0)} + 지방소득세 10%`;
    }
  }
  const sellTotal=sb.fee+cgt;

  /* 현금흐름 */
  const finalCash = sell-bal-sb.fee-cgt;
  const cfs=new Array(m+1).fill(0), cfsLive=new Array(m+1).fill(0);
  cfs[0]=-equity0;
  for(let k=1;k<=m;k++){
    const y=Math.ceil(k/12), rw=rows[y-1];
    const it = k<=n ? 0:0;
    const monthPay = (k<=n? (pay) : 0);
    const flow = -(monthPay + (rw.pt.total+rw.ct.total)/12 + maint/12);
    cfs[k]+=flow;
  }
  if($('rtype').value!=='amort'){ /* 이자만 냈을 때는 pay=이자 */ }
  cfs[m]+=finalCash;
  for(let k=0;k<=m;k++) cfsLive[k]=cfs[k]+(k>0?rent:0);
  const profit=cfs.reduce((s,c)=>s+c,0);
  const profitLive=profit+rent*m;
  const R=irr(cfs), RL=irr(cfsLive);
  const costTotal=buyTotal+holdTotal+sellTotal;

  /* 예금·채권 비교: 같은 시점에 같은 돈을 넣었다면 */
  const alt=(ann)=>{const ra=Math.pow(1+ann*(1-itax),1/12)-1; let fv=0, out=0;
    for(let k=0;k<m;k++){const o=k===0?equity0:-cfs[k]; if(o>0){fv+=o*Math.pow(1+ra,m-k); out+=o;}}
    const ok=-cfs[m]+finalCash; if(ok>0){fv+=ok; out+=ok;}
    return fv-out;};
  const depP=alt(dep), bondP=alt(bond);

  /* 화면 */
  $('t1').textContent=won(profit,true); $('t1').className='v '+(profit>=0?'pos':'neg');
  $('t1s').textContent = rent>0 ? `실거주 가치 포함 시 ${won(profitLive,true)}` : '실거주 가치 미포함';
  $('t2').textContent=pct(R,2);
  $('t2s').textContent = rent>0 ? `실거주 포함 ${pct(RL,2)}` : `예금 세후 ${pct(dep*(1-itax),2)}`;
  $('t3').textContent=won(costTotal);
  $('t3s').textContent=`시세차익 ${won(sell-buy)}의 ${pct(costTotal/Math.max(1,sell-buy),0)}`;
  $('t4').textContent=won(equity0);

  const diff=sell-buy;
  const segs=[['시세 차익',diff,'var(--accent)'],['살 때',-buyTotal,'var(--cost)'],['대출이자',-intSum,'var(--cost)'],['보유세',-(propSum+compSum),'var(--cost)'],['수선·유지',-maintSum,'var(--cost)'],['팔 때',-sellTotal,'var(--cost)']];
  const maxV=Math.max(diff,profitLive,1);
  let run=0, html='';
  segs.forEach(([l,v,c],i)=>{
    const start = i===0?0:run+v, w=Math.abs(v);
    html+=`<div class="wfr"><span>${l}</span><div class="track"><div class="bar" style="left:${Math.max(0,(i===0?0:start))/maxV*100}%;width:${w/maxV*100}%;background:${c}"></div></div><span class="amt ${v<0?'neg':''}">${won(v,true)}</span></div>`;
    run = i===0? v : run+v;
  });
  html+=`<div class="wfr total"><span>순이익</span><div class="track"><div class="bar" style="left:0;width:${Math.max(0,profit)/maxV*100}%;background:var(--gain)"></div></div><span class="amt ${profit>=0?'pos':'neg'}">${won(profit,true)}</span></div>`;
  if(rent>0) html+=`<div class="wfr"><span>+ 아낀 월세</span><div class="track"><div class="bar" style="left:${Math.max(0,profit)/maxV*100}%;width:${rent*m/maxV*100}%;background:var(--gain);opacity:.45"></div></div><span class="amt pos">${won(rent*m,true)}</span></div>`;
  $('wf').innerHTML=html;

  $('s-buy').textContent=won(buyTotal);
  $('i-buy').innerHTML=buyItems.map(x=>item(x[0],x[1],x[2])).join('');

  $('s-hold').textContent=won(holdTotal);
  $('c-hold').textContent=`${Y}년간`;
  let tb=`<div class="tbl"><table><thead><tr><th>연차</th><th>추정 시세</th><th>공시가</th><th>재산세 등</th><th>종부세</th><th>대출이자</th></tr></thead><tbody>`;
  rows.forEach(rw=>{tb+=`<tr><td>${rw.y}년차</td><td>${won(rw.price)}</td><td>${won(rw.pub)}</td><td>${won(rw.pt.total)}</td><td>${won(rw.ct.total)}</td><td>${won(rw.int)}</td></tr>`;});
  tb+='</tbody></table></div>';
  const ct1=rows[0].ct;
  $('i-hold').innerHTML=
    item('대출이자',intSum,`${won(loan)}, 연 ${(rate*100).toFixed(2)}%, ${$('rtype').value==='amort'?'원리금균등 '+term+'년':'이자만 납부'} · 매도 시 남은 대출 ${won(bal)} (원금 상환분 ${won(prinSum)}은 비용이 아니라 내 지분)`)+
    item('재산세 + 도시지역분 + 지방교육세',propSum,`공시가 × 공정시장가액비율 ${pct(rows[0].pt.ratio,0)} → 누진세율, 도시지역분 0.14%, 교육세 20%`)+
    item('종합부동산세 + 농어촌특별세',compSum, compSum>0?`(공시가 − ${houses===1?'12억':'9억'}) × 60% → 누진세율${houses===1?', 장기보유 세액공제 반영':''}, 농특세 20%`:`공시가가 ${houses===1?'12억':'9억'} 이하라 대상 아님`)+
    item('수선·유지비',maintSum,`연 ${won(maint)} × ${Y}년`)+tb;

  $('s-sell').textContent=won(sellTotal);
  $('i-sell').innerHTML=
    item('중개보수',sb.fee,`${won(sell)} × ${(sb.r*100).toFixed(1)}% 상한${vat?' + 부가세':''}`)+
    item('양도소득세 + 지방소득세',cgt,cgtWhy)+
    `<div class="it"><div class="n" style="color:var(--muted)">참고: 양도차익</div><div class="m">${won(gain)}</div><div class="w">매도가 − 매수가 − 필요경비 ${won(necessary)} (취득세·수수료·채권·${intexp?'인테리어·':''}매도 중개보수)</div></div>`;

  $('i-plus').innerHTML=
    `<div class="cmp">
      <div><div class="k">이 집</div><div class="x ${profit>=0?'pos':'neg'}">${won(profit,true)}</div><div class="k">연 ${pct(R,2)}</div></div>
      <div><div class="k">같은 돈을 예금에 (세후)</div><div class="x">${won(depP,true)}</div><div class="k">연 ${pct(dep*(1-itax),2)}</div></div>
      <div><div class="k">같은 돈을 채권에 (세후)</div><div class="x">${won(bondP,true)}</div><div class="k">연 ${pct(bond*(1-itax),2)}</div></div>
    </div>`+
    item('아낀 월세 (실거주 가치)',rent*m, rent>0?`월 ${won(rent)} × ${m}개월 · 직접 살면 이만큼 주거비를 안 써요`:'0으로 설정됨', 'pos')+
    `<div class="it"><div class="n">실거주까지 합친 순이익</div><div class="m ${profitLive>=0?'pos':'neg'}">${won(profitLive,true)}</div><div class="w">${profitLive>bondP?'채권보다 유리':'채권보다 불리'}<span class="badge ${profitLive>bondP?'':'c'}">${won(profitLive-bondP,true)}</span> · 집에 넣은 돈이 들어간 시점 그대로 예금·채권에 넣었다고 비교했어요</div></div>`;
  window.LAST={buy,sell,Y,profit,R,costTotal,equity0};
}
$('f').addEventListener('input',calc);
$('f').addEventListener('change',calc);
$('f').addEventListener('submit',e=>e.preventDefault());
calc();
