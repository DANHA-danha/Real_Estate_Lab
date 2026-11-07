const W=900,H=726,L0=126.755,L1=127.20,A0=37.42,A1=37.705;
const px=(lon,lat)=>[ (lon-L0)/(L1-L0)*W, (A1-lat)/(A1-A0)*H ];
const KM=W/((L1-L0)*88.2);
const CBD=[['광화문',126.9769,37.5720],['여의도',126.9246,37.5240],['강남',127.0276,37.4979]];
const RIVERPTS=[[126.755,37.628],[126.80,37.600],[126.835,37.583]].concat(HANRIVER.slice().sort((a,b)=>a[0]-b[0])).concat([[127.15,37.565],[127.20,37.578]]);
const LINES=[
 {n:'2호선',c:'#3a9e47',loop:true,s:[['시청',126.9772,37.5658],['을지로3가',126.9917,37.5663],['동대문역사문화공원',127.0074,37.5654],['왕십리',127.0373,37.5612],['성수',127.0560,37.5446],['건대입구',127.0703,37.5404],['잠실',127.1001,37.5133],['삼성',127.0631,37.5089],['강남',127.0276,37.4979],['교대',127.0142,37.4934],['사당',126.9816,37.4766],['신림',126.9296,37.4842],['신도림',126.8913,37.5088],['당산',126.9024,37.5343],['홍대입구',126.9245,37.5572],['신촌',126.9367,37.5552],['충정로',126.9637,37.5598]]},
 {n:'3호선',c:'#e8761c',s:[['구파발',126.9188,37.6369],['불광',126.9298,37.6103],['독립문',126.9577,37.5744],['경복궁',126.9733,37.5759],['안국',126.9853,37.5762],['종로3가',126.9917,37.5715],['충무로',126.9944,37.5612],['약수',127.0108,37.5543],['금호',127.0201,37.5481],['옥수',127.0186,37.5404],['압구정',127.0285,37.5270],['신사',127.0203,37.5163],['잠원',127.0118,37.5127],['고속터미널',127.0049,37.5048],['교대',127.0142,37.4934],['남부터미널',127.0160,37.4850],['양재',127.0343,37.4841],['수서',127.1017,37.4873]]},
 {n:'5호선',c:'#8f63b8',s:[['김포공항',126.8013,37.5624],['발산',126.8378,37.5585],['까치산',126.8467,37.5313],['목동',126.8648,37.5260],['영등포구청',126.8963,37.5248],['여의도',126.9242,37.5215],['마포',126.9461,37.5395],['공덕',126.9518,37.5440],['서대문',126.9663,37.5657],['광화문',126.9765,37.5711],['종로3가',126.9917,37.5715],['동대문역사문화공원',127.0074,37.5654],['왕십리',127.0373,37.5612],['군자',127.0794,37.5571],['천호',127.1238,37.5386],['강동',127.1323,37.5358]]},
 {n:'9호선',c:'#b39d5e',s:[['김포공항',126.8013,37.5624],['가양',126.8545,37.5614],['염창',126.8750,37.5469],['당산',126.9024,37.5343],['국회의사당',126.9180,37.5281],['여의도',126.9242,37.5215],['노량진',126.9425,37.5134],['흑석',126.9636,37.5087],['동작',126.9797,37.5026],['고속터미널',127.0049,37.5048],['신논현',127.0250,37.5045],['선정릉',127.0435,37.5103],['종합운동장',127.0736,37.5109],['올림픽공원',127.1213,37.5165]]}
];
let layers={sub:true,cbd:true,apt:true};
let APTS=[], sel=null, DIST=null, selDist=null, VB=[0,0,W,H];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function priceLabel(a){ return a.price ? (a.price>=10000?(a.price/10000).toFixed(1)+'억':a.price.toLocaleString()+'만') : '—'; }
const fmtChg=v=>v==null?'—':(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(2)+'%';
function distFill(v){
  if(v==null) return 'var(--land)';
  const t=Math.round(18+Math.min(1,Math.abs(v)/0.4)*52);
  return `color-mix(in srgb, ${v>=0?'var(--up)':'var(--down)'} ${t}%, var(--land))`;
}
const pathOf=r=>'M'+r.map(p=>px(p[0],p[1]).map(n=>n.toFixed(1)).join(',')).join('L')+'Z';
function baseMap(opts){
  const vals=(DIST&&DIST.values)||{};
  let g=`<rect x="-200" y="-200" width="${W+400}" height="${H+400}" fill="var(--sea)"/>`;
  GEO.forEach(d=>{const v=vals[d.n]; g+=`<path class="dist${selDist===d.n?' dsel':''}" data-d="${d.n}" d="${d.r.map(pathOf).join('')}" fill="${distFill(v)}"><title>${d.n} ${fmtChg(v)}</title></path>`;});
  g+=`<polyline class="river" points="${RIVERPTS.map(p=>px(p[0],p[1]).join(',')).join(' ')}" fill="none" stroke="var(--river)" stroke-linecap="round" stroke-linejoin="round" stroke-width="${(0.9*KM).toFixed(1)}"/>`;
  if(opts.mini){
    GEO.forEach(d=>{const v=vals[d.n]; if(v==null) return; const p=px(d.c[0],d.c[1]); g+=`<text class="mlab" x="${p[0]}" y="${p[1]+4}" text-anchor="middle">${fmtChg(v)}</text>`;});
    return g;
  }
  return g;
}
function drawMap(){
  const svg=document.getElementById('map'); if(!svg) return;
  const vals=(DIST&&DIST.values)||{};
  let g=baseMap({});
  if(layers.cbd){ CBD.forEach(c=>{const p=px(c[1],c[2]); g+=`<circle class="ring" cx="${p[0]}" cy="${p[1]}" r="${3*KM}"/>`;});
    const cp=CBD.map(c=>px(c[1],c[2])); g+=`<polygon class="tri" points="${cp.map(p=>p.join(',')).join(' ')}"/>`; }
  if(layers.sub){
    LINES.forEach(l=>{const pts=l.s.map(s=>px(s[1],s[2])); if(l.loop) pts.push(pts[0]); g+=`<polyline class="line" stroke="${l.c}" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;});
    LINES.forEach(l=>l.s.forEach(s=>{const p=px(s[1],s[2]); g+=`<circle class="st" cx="${p[0]}" cy="${p[1]}" r="2.6" stroke="${l.c}"><title>${s[0]} (${l.n})</title></circle>`;}));
  }
  GEO.forEach(d=>{const v=vals[d.n], p=px(d.c[0],d.c[1]);
    if(v==null){ g+=`<text class="dname" x="${p[0]}" y="${p[1]+4}" text-anchor="middle" data-d="${d.n}">${d.n}</text>`; return; }
    g+=`<g class="bub${v>=0?' up':' dn'}" data-d="${d.n}" tabindex="0" role="button" aria-label="${d.n} ${fmtChg(v)}"><circle cx="${p[0]}" cy="${p[1]}" r="27"/><text class="bn" x="${p[0]}" y="${p[1]-3}" text-anchor="middle">${d.n}</text><text class="bv" x="${p[0]}" y="${p[1]+12}" text-anchor="middle">${fmtChg(v)}</text></g>`;});
  if(layers.cbd) CBD.forEach(c=>{const p=px(c[1],c[2]); g+=`<g class="cbdm"><rect x="${p[0]-26}" y="${p[1]-36}" width="52" height="20" rx="10"/><text x="${p[0]}" y="${p[1]-22}" text-anchor="middle">${c[0]}</text><circle cx="${p[0]}" cy="${p[1]}" r="5"/></g>`;});
  if(layers.apt) APTS.forEach((a,i)=>{const p=px(a.lon,a.lat);
    const lab=sel===i||a.price?`<text x="${p[0]+8}" y="${p[1]+4}">${esc(a.short||a.name)}${a.price?' '+priceLabel(a):''}</text>`:'';
    g+=`<g class="apt${a.zone?' zone':''}${sel===i?' sel':''}" data-i="${i}" tabindex="0" role="button" aria-label="${esc(a.name)}"><circle cx="${p[0]}" cy="${p[1]}" r="${sel===i?7:5}"/>${lab}</g>`;});
  svg.innerHTML=g; svg.setAttribute('viewBox',VB.join(' '));
  svg.querySelectorAll('.apt').forEach(el=>{
    el.addEventListener('click',e=>{e.stopPropagation();pick(+el.dataset.i);});
    el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(+el.dataset.i);}});
  });
  svg.querySelectorAll('[data-d]').forEach(el=>{
    el.addEventListener('click',()=>{ if(svg._dragged) return; pickDist(el.dataset.d);});
    if(el.classList.contains('bub')) el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pickDist(el.dataset.d);}});
  });
  renderMovers();
}
function zoom(f,cx,cy){
  const w=VB[2]*f, h=VB[3]*f; if(w<W/6||w>W*1.05) return;
  cx=cx??VB[0]+VB[2]/2; cy=cy??VB[1]+VB[3]/2;
  VB=[cx-(cx-VB[0])*f, cy-(cy-VB[1])*f, w, h];
  document.getElementById('map').setAttribute('viewBox',VB.join(' '));
}
function setupPan(){
  const svg=document.getElementById('map'); let st=null;
  svg.addEventListener('pointerdown',e=>{ if(e.button!==0) return; st={x:e.clientX,y:e.clientY,vb:VB.slice()}; svg._dragged=false; });
  window.addEventListener('pointermove',e=>{ if(!st) return; const r=svg.getBoundingClientRect(); const s=VB[2]/r.width;
    const dx=(e.clientX-st.x)*s, dy=(e.clientY-st.y)*s; if(Math.abs(e.clientX-st.x)+Math.abs(e.clientY-st.y)>4) svg._dragged=true;
    if(svg._dragged){ VB=[st.vb[0]-dx,st.vb[1]-dy,VB[2],VB[3]]; svg.setAttribute('viewBox',VB.join(' ')); } });
  window.addEventListener('pointerup',()=>{ st=null; setTimeout(()=>svg._dragged=false,0); });
  document.getElementById('zin').addEventListener('click',()=>zoom(0.7));
  document.getElementById('zout').addEventListener('click',()=>zoom(1/0.7));
  document.getElementById('zreset').addEventListener('click',()=>{VB=[0,0,W,H];document.getElementById('map').setAttribute('viewBox',VB.join(' '));});
}
function pickDist(n){
  selDist=n; const v=DIST&&DIST.values?DIST.values[n]:null;
  const inside=APTS.map((a,i)=>[a,i]).filter(([a])=>(a.hood||'').startsWith(n));
  const card=document.getElementById('aptcard');
  card.innerHTML=`<h3>${esc(n)}</h3><div style="font-size:12px;color:var(--muted)">${DIST?esc(DIST.label||''):''}</div>
    <div style="font:500 24px var(--mono);margin:6px 0" class="${v==null?'':v>=0?'neg':'pos2'}">${fmtChg(v)}</div>
    <div style="font-size:13px;color:var(--muted)">${v==null?'이번 주 이 구의 변동률은 아직 수집되지 않았어요.':'지난주 대비 아파트 매매가격 변동률이에요.'}</div>
    <div style="margin-top:10px;font-size:13px;font-weight:500">이 구의 단지</div>
    <div class="mini">${inside.length?inside.map(([a,i])=>`<button type="button" data-pi="${i}"><span>${esc(a.name)}</span><span>${a.price?priceLabel(a):(a.built||'')}</span></button>`).join(''):'<p class="msg">등록된 단지가 없어요.</p>'}</div>`;
  card.querySelectorAll('[data-pi]').forEach(b=>b.addEventListener('click',()=>pick(+b.dataset.pi)));
  drawMap();
}
function renderMovers(){
  const el=document.getElementById('movers'); if(!el) return;
  const vals=(DIST&&DIST.values)||{}; const arr=Object.entries(vals).filter(e=>e[1]!=null).sort((a,b)=>b[1]-a[1]);
  if(!arr.length){el.innerHTML='<p class="msg">이번 주 구별 변동률을 불러오는 중이에요.</p>';return;}
  const row=(e,i)=>`<button type="button" class="mv" data-md="${e[0]}"><span class="rk">${i+1}</span><span>${e[0]}</span><span class="${e[1]>=0?'neg':'pos2'}">${fmtChg(e[1])}</span></button>`;
  el.innerHTML=`<div class="mvh">많이 오른 구</div>${arr.filter(e=>e[1]>0).slice(0,5).map(row).join('')}<div class="mvh">내린 구</div>${arr.filter(e=>e[1]<0).reverse().slice(0,5).map(row).join('')||'<p class="msg">없어요</p>'}`;
  el.querySelectorAll('[data-md]').forEach(b=>b.addEventListener('click',()=>{ if(location.hash!=='#map') location.hash='map'; setTimeout(()=>pickDist(b.dataset.md),30);}));
}
function legend(){
  const el=document.getElementById('legend');
  el.innerHTML=`<span class="scale"><span>내림</span><i style="background:${distFill(-0.4)}"></i><i style="background:${distFill(-0.1)}"></i><i style="background:var(--land)"></i><i style="background:${distFill(0.1)}"></i><i style="background:${distFill(0.4)}"></i><span>오름</span></span>
   <label><input type="checkbox" data-ly="sub" ${layers.sub?'checked':''}>지하철</label>
   <label><input type="checkbox" data-ly="cbd" ${layers.cbd?'checked':''}>업무지구</label>
   <label><input type="checkbox" data-ly="apt" ${layers.apt?'checked':''}>주요 단지</label>
   <span id="distlabel" class="msg"></span>`;
  el.querySelectorAll('[data-ly]').forEach(c=>c.addEventListener('change',()=>{layers[c.dataset.ly]=c.checked;drawMap();}));
}
function drawMini(){
  const svg=document.getElementById('minimap'); if(!svg) return;
  svg.innerHTML=baseMap({mini:true});
}

function pick(i){
  sel=i; const a=APTS[i]; drawMap();
  const card=document.getElementById('aptcard');
  card.innerHTML=`<h3>${esc(a.name)}</h3>
   <div style="font-size:12px;color:var(--muted)">${esc(a.hood||'')}${a.zone?' · <span style="color:var(--gain)">업무지구 사이 벨트</span>':''}</div>
   <dl class="kv"><dt>최근 실거래가</dt><dd>${a.price?priceLabel(a):'연동 전'}</dd>
   <dt>거래 시점·면적</dt><dd>${a.deal?esc(a.deal):'—'}${a.area?' · '+esc(a.area)+'㎡':''}</dd>
   <dt>세대수</dt><dd>${a.units?a.units.toLocaleString()+'세대':'—'}</dd>
   <dt>준공</dt><dd>${a.built||'—'}</dd>
   <dt>가까운 역</dt><dd>${esc(a.station||'—')}</dd></dl>
   ${a.price?'':'<div class="pending">실거래가 API가 연결되면 매주 자동으로 최신 거래가가 들어와요.</div>'}
   <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
     <button class="btn" id="tocalc">손익계산기로 계산</button>
   </div>`;
  document.getElementById('tocalc').addEventListener('click',()=>{
    if(a.price){ document.getElementById('buy').value=a.price; }
    calc(); location.hash='calc';
  });
}
function renderList(){
  const el=document.getElementById('alist');
  if(!APTS.length){el.innerHTML='<p style="font-size:13px;color:var(--muted);margin:6px 0">아직 등록된 단지가 없어요.</p>';return;}
  const order=APTS.map((a,i)=>[a,i]).sort((x,y)=>(y[0].zone?1:0)-(x[0].zone?1:0)||x[0].name.localeCompare(y[0].name,'ko'));
  el.innerHTML=order.map(([a,i])=>`<button class="arow" data-i="${i}"><span>${esc(a.name)}</span><span>${a.price?priceLabel(a):esc(a.hood||'')}</span></button>`).join('');
  el.querySelectorAll('.arow').forEach(b=>b.addEventListener('click',()=>pick(+b.dataset.i)));
}
