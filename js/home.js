function drawSkyline(){
  const svg=document.getElementById('skyline'); if(!svg) return;
  let s=1; const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
  let g='';
  g+=`<path d="M0 205 C120 150 210 175 300 160 C390 145 470 120 560 150 C650 178 720 140 820 150 C920 160 1010 130 1100 150 L1200 160 L1200 320 L0 320Z" fill="var(--hill)"/>`;
  const base=245; let x=360;
  const back=[], front=[];
  while(x<1200){const w=18+rnd()*34, h=30+rnd()*70; back.push(`<rect x="${x.toFixed(0)}" y="${(base-h-12).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+12).toFixed(0)}" fill="var(--bldg2)"/>`); x+=w+2+rnd()*6;}
  x=380;
  while(x<1200){const w=22+rnd()*40, h=25+rnd()*95; let b=`<rect x="${x.toFixed(0)}" y="${(base-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="var(--bldg)"/>`;
    for(let wy=base-h+8; wy<base-10; wy+=11){ for(let wx=x+5; wx<x+w-6; wx+=8){ if(rnd()>.55) b+=`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="3" height="4" fill="var(--win)"/>`; } }
    front.push(b); x+=w+3+rnd()*10;}
  g+=back.join('');
  const tx=900;
  g+=`<path d="M${tx-26} ${base} L${tx-9} 40 L${tx} 18 L${tx+9} 40 L${tx+26} ${base}Z" fill="var(--tower)"/><path d="M${tx} 18 L${tx} 4" stroke="var(--tower)" stroke-width="2"/>`;
  g+=front.join('');
  g+=`<rect x="0" y="${base}" width="1200" height="${320-base}" fill="var(--river)"/>`;
  g+=`<g stroke="var(--bridge)" stroke-width="3" fill="none"><path d="M330 268 L1200 262"/>`;
  for(let bx=360;bx<1200;bx+=70) g+=`<path d="M${bx} 268 Q${bx+35} 248 ${bx+70} 267"/><path d="M${bx} 267 L${bx} 290"/>`;
  g+=`</g>`;
  for(let i=0;i<14;i++){const yy=275+rnd()*40, xx=380+rnd()*780; g+=`<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="${(20+rnd()*60).toFixed(0)}" height="2" fill="var(--panel)" opacity=".35"/>`;}
  svg.innerHTML=g;
}
const THUMBS={
 '금리':'<svg viewBox="0 0 200 64"><path d="M10 50 L50 42 L80 46 L120 28 L150 32 L190 12" fill="none" stroke="var(--accent)" stroke-width="3"/><circle cx="190" cy="12" r="5" fill="var(--accent)"/><text x="12" y="20" font-size="15" font-weight="600" fill="var(--accent)" font-family="var(--mono)">%</text></svg>',
 '세제':'<svg viewBox="0 0 200 64"><rect x="80" y="8" width="40" height="50" rx="4" fill="var(--panel)" stroke="var(--cost)" stroke-width="2"/><path d="M88 22h24M88 31h24M88 40h14" stroke="var(--cost)" stroke-width="2"/><circle cx="128" cy="46" r="10" fill="var(--cost)"/><text x="128" y="51" text-anchor="middle" font-size="12" fill="var(--panel)" font-weight="600">₩</text></svg>',
 '시장':'<svg viewBox="0 0 200 64"><g fill="var(--gain)"><rect x="60" y="30" width="14" height="30"/><rect x="78" y="18" width="16" height="42"/><rect x="98" y="8" width="12" height="52"/><rect x="114" y="24" width="18" height="36"/><rect x="136" y="36" width="12" height="24"/></g></svg>',
 '대출':'<svg viewBox="0 0 200 64"><path d="M70 36 L100 12 L130 36 V58 H70Z" fill="var(--panel)" stroke="var(--accent)" stroke-width="2.5"/><rect x="93" y="42" width="14" height="16" fill="var(--accent)"/><circle cx="140" cy="48" r="11" fill="var(--warn)"/></svg>',
 '공급':'<svg viewBox="0 0 200 64"><path d="M80 58 V10 H140 M80 14 L120 14 M130 10 V30" stroke="var(--warn)" stroke-width="3" fill="none"/><rect x="122" y="30" width="16" height="12" fill="var(--warn)"/><rect x="60" y="40" width="20" height="18" fill="var(--bldg)"/></svg>'
};
function renderHeroCard(){
  const it=(IND&&IND.items||[]).find(x=>/서울/.test(x.label));
  if(it){ $('herov').textContent=it.value; $('heros').textContent=`${it.asOf} · ${it.change}`; }
  const sg=IND&&IND.signals||[];
  $('herodots').innerHTML=sg.map(s=>`<span><i style="background:var(--${s.state==='red'?'cost':s.state==='green'?'gain':'warn'})"></i>${esc(s.label)}</span>`).join('');
}

drawSkyline(); setupPan(); drawMini();
route();
