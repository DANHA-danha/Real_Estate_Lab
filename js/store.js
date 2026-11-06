/* 데이터 저장소
 * - 공용 데이터(지표·신호등·시세·단지·브리핑)는 data/*.json 파일에서 읽어요.
 * - 개인 데이터(저장한 시나리오, 임장 노트)는 브라우저 localStorage에 저장해요.
 * 나중에 Supabase 같은 실제 DB로 바꾸려면 이 파일만 고치면 돼요.
 * 다른 화면 코드는 window.claude.use('db') 형태로 이 저장소를 불러요. */
(function () {
  const SHARED = { apts: 'data/apts.json', briefings: 'data/briefings.json' };
  const DOCS = { 'indicators/latest': 'data/indicators.json', 'districts/latest': 'data/districts.json' };
  const cache = {};
  const load = (url) => (cache[url] ||= fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  const snap = (id, data) => ({ id, exists: data != null, data: () => data });
  const KEY = (path) => 'budongsan-lab:' + path;
  const readLocal = (path) => { try { return JSON.parse(localStorage.getItem(KEY(path)) || '{}'); } catch (e) { return {}; } };
  const writeLocal = (path, obj) => { try { localStorage.setItem(KEY(path), JSON.stringify(obj)); } catch (e) {} };
  const listeners = {};
  const emit = (path) => (listeners[path] || []).forEach((f) => f());

  function collection(path) {
    let order = null;
    const q = {
      orderBy(field, dir) { order = [field, dir || 'asc']; return q; },
      doc(id) {
        return {
          async set(data) { const o = readLocal(path); o[id] = data; writeLocal(path, o); emit(path); },
          async delete() { const o = readLocal(path); delete o[id]; writeLocal(path, o); emit(path); },
        };
      },
      onSnapshot(cb) {
        const run = async () => {
          let docs;
          if (SHARED[path]) docs = ((await load(SHARED[path])) || []).map((d) => snap(d.id, d.data));
          else docs = Object.entries(readLocal(path)).map(([k, v]) => snap(k, v));
          if (order) {
            const [f, dir] = order;
            docs.sort((a, b) => { const x = a.data()[f], y = b.data()[f]; return (x > y ? 1 : x < y ? -1 : 0) * (dir === 'desc' ? -1 : 1); });
          }
          cb({ docs });
        };
        (listeners[path] ||= []).push(run);
        run();
        return () => {};
      },
    };
    return q;
  }
  function doc(path) {
    return { onSnapshot(cb) { load(DOCS[path]).then((d) => cb(snap(path.split('/').pop(), d))); return () => {}; } };
  }
  const db = { collection, doc };
  const user = { id: async () => 'local' };
  // 'sample'(AI 용어 설명)은 API 키가 필요해서 로컬에서는 꺼 둬요.
  window.claude = { use: async (name) => (name === 'db' ? db : name === 'user' ? user : null) };
})();
