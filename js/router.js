/* ---------- 탭 이동 ---------- */
const VIEWS=['home','calc','plan','rent','map','notes','news','terms'];
function route(){
  const v=VIEWS.includes(location.hash.slice(1))?location.hash.slice(1):'home';
  VIEWS.forEach(n=>{document.getElementById('v-'+n).hidden=(n!==v);});
  document.querySelectorAll('nav a').forEach(a=>a.setAttribute('aria-current',a.dataset.v===v?'page':'false'));
  if(v==='map') drawMap();
}
window.addEventListener('hashchange',route);

/* ---------- 지도 ---------- */
