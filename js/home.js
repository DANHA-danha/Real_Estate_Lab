function drawSkyline(){
  const svg=document.getElementById('skyline'); if(!svg) return;
  let s=1; const rnd=()=>{s=(s*9301+49297)%233280;return s/233280;};
  let g='';
  g+=`<path d="M0 205 C120 150 210 175 300 160 C390 145 470 120 560 150 C650 178 720 140 820 150 C920 160 1010 130 1100 150 L1200 160 L1200 320 L0 320Z" fill="var(--hill)"/>`;
  const base=245; let x=500;
  const back=[], front=[];
  while(x<1200){const w=18+rnd()*34, h=30+rnd()*70; back.push(`<rect x="${x.toFixed(0)}" y="${(base-h-12).toFixed(0)}" width="${w.toFixed(0)}" height="${(h+12).toFixed(0)}" fill="var(--bldg2)"/>`); x+=w+2+rnd()*6;}
  x=520;
  while(x<1200){const w=22+rnd()*40, h=25+rnd()*95; let b=`<rect x="${x.toFixed(0)}" y="${(base-h).toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" fill="var(--bldg)"/>`;
    for(let wy=base-h+8; wy<base-10; wy+=11){ for(let wx=x+5; wx<x+w-6; wx+=8){ if(rnd()>.55) b+=`<rect x="${wx.toFixed(0)}" y="${wy.toFixed(0)}" width="3" height="4" fill="var(--win)"/>`; } }
    front.push(b); x+=w+3+rnd()*10;}
  g+=back.join('');
  const tx=900;
  g+=`<path d="M${tx-26} ${base} L${tx-9} 40 L${tx} 18 L${tx+9} 40 L${tx+26} ${base}Z" fill="var(--tower)"/><path d="M${tx} 18 L${tx} 4" stroke="var(--tower)" stroke-width="2"/>`;
  g+=front.join('');
  g+=`<rect x="0" y="${base}" width="1200" height="${320-base}" fill="var(--river)"/>`;
  g+=`<g stroke="var(--bridge)" stroke-width="3" fill="none"><path d="M470 268 L1200 262"/>`;
  for(let bx=500;bx<1200;bx+=70) g+=`<path d="M${bx} 268 Q${bx+35} 248 ${bx+70} 267"/><path d="M${bx} 267 L${bx} 290"/>`;
  g+=`</g>`;
  for(let i=0;i<14;i++){const yy=275+rnd()*40, xx=520+rnd()*640; g+=`<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="${(20+rnd()*60).toFixed(0)}" height="2" fill="var(--panel)" opacity=".35"/>`;}
  svg.innerHTML=g;
}
function renderHeroCard(){
  const it=(IND&&IND.items||[]).find(x=>/서울/.test(x.label));
  if(it){ $('herov').textContent=it.value; $('heros').textContent=`${it.asOf} · ${it.change}`; }
  const sg=IND&&IND.signals||[];
  $('herodots').innerHTML=sg.map(s=>`<span><i style="background:var(--${s.state==='red'?'cost':s.state==='green'?'gain':'warn'})"></i>${esc(s.label)}</span>`).join('');
}

drawSkyline(); setupPan(); drawMini();
route();
