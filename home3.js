// 표지 분야 탭: 탭을 누르면 둘째 줄 문장과 작업 링크가 바뀐다. 같은 탭을 다시 누르면 처음 문장으로 돌아간다.
// JS가 없으면 모든 분야가 세로로 이어서 보인다.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var tabx = document.querySelector('.tabx');
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  function show(name) {
    panels.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-tab') === name); });
    document.dispatchEvent(new CustomEvent('field', { detail: name }));
    tabs.forEach(function (t) { t.setAttribute('aria-pressed', t.getAttribute('data-tab') === name ? 'true' : 'false'); });
    if (tabx) tabx.hidden = (name === 'default');
    place();
  }
  var holder = document.querySelector('.tabs');
  var bar = document.createElement('span');
  bar.className = 'bar';
  bar.setAttribute('aria-hidden', 'true');
  holder.appendChild(bar);
  function place() {
    var on = tabs.filter(function (t) { return t.getAttribute('aria-pressed') === 'true'; })[0];
    if (!on) { bar.classList.remove('on'); return; }
    bar.style.width = on.offsetWidth + 'px';
    bar.style.transform = 'translateX(' + on.offsetLeft + 'px)';
    bar.classList.add('on');
  }
  var current = 'default';
  show(current);
  window.addEventListener('resize', place);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  function reset() { current = 'default'; show(current); }
  if (tabx) tabx.addEventListener('click', reset);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && current !== 'default') reset(); });
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var name = t.getAttribute('data-tab');
      current = current === name ? 'default' : name;
      show(current);
    });
  });
})();

// 작업 요소(표의 행과 격자의 타일)를 data-pid로 찾는 도우미. 둘 다 같은 프로젝트를 가리킨다.
var PJ = {
  all: function (id) { return [].slice.call(document.querySelectorAll('[data-pid="' + id + '"]')); },
  visible: function (id) {
    var a = PJ.all(id);
    return a.filter(function (e) { return e.offsetParent !== null; })[0] || a[0];
  },
  clear: function () {
    [].slice.call(document.querySelectorAll('.pj.is-match')).forEach(function (c) {
      c.classList.remove('is-match');
      var bd = c.querySelector('.bd');
      if (bd) bd.textContent = '';
    });
    [].slice.call(document.querySelectorAll('.tl3.is-on')).forEach(function (t) { t.classList.remove('is-on'); });
  },
  mark: function (id, label) {
    PJ.all(id).forEach(function (c) {
      c.classList.add('is-match');
      var bd = c.querySelector('.bd');
      if (bd) bd.textContent = label;
    });
  }
};

// 표지·이력 문장 속 링크 → 작업으로 이동하고 잠깐 강조한다.
// 표지 분야 문장의 링크를 누르면 가리키는 프로젝트에 분야 이름표와 검은 표시가 붙는다(다음 링크를 누를 때까지 유지).
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#c-"]') : null;
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var el = PJ.visible(id);
    if (!el) return;
    e.preventDefault();
    var panel = a.closest('.panel');
    if (panel) { PJ.clear(); PJ.mark(id, panel.getAttribute('data-tab')); }
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    el.classList.remove('hit');
    void el.offsetWidth;
    el.classList.add('hit');
    if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
  });
  // 미리보기에서는 상세 페이지가 없어서 작업 링크를 막는다
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#detail-"]') : null;
    if (a) e.preventDefault();
  });
})();

// 작업 보기 방식: 목록(기본)과 격자
(function () {
  var btns = [].slice.call(document.querySelectorAll('.vtb'));
  var list = document.getElementById('view-list'), grid = document.getElementById('view-grid');
  if (!btns.length || !list || !grid) return;
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-view');
      list.hidden = v !== 'list';
      grid.hidden = v !== 'grid';
      btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });
})();

// 목록의 행에 마우스를 올리면 커서를 따라다니는 미리보기 카드가 나온다(마우스가 있는 화면만)
(function () {
  if (!(window.matchMedia && window.matchMedia('(hover: hover)').matches)) return;
  var pv = document.querySelector('.pv'), table = document.getElementById('view-list');
  if (!pv || !table) return;
  var img = pv.querySelector('img'), res = pv.querySelector('.pv-r'), box = pv.querySelector('.pv-i');
  var x = 0, y = 0, tx = 0, ty = 0, raf = 0;
  function srcOf(r) {
    var t = document.querySelector('#view-grid [data-pid="' + r.getAttribute('data-pid') + '"] img');
    return t ? (t.currentSrc || t.src) : '';
  }
  function place() {
    raf = 0;
    var w = pv.offsetWidth, h = pv.offsetHeight;
    var px = Math.min(Math.max(12, tx - w / 2), window.innerWidth - w - 12);
    var py = Math.min(Math.max(12, ty - h / 2), window.innerHeight - h - 12);
    pv.style.transform = 'translate3d(' + px + 'px,' + py + 'px,0)';
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(place); }
  table.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; schedule(); });
  [].slice.call(table.querySelectorAll('.prow')).forEach(function (r) {
    r.addEventListener('mouseenter', function (e) {
      img.src = srcOf(r);
      img.alt = '';
      res.textContent = r.getAttribute('data-res');
      box.style.setProperty('--pc', getComputedStyle(r).getPropertyValue('--oc'));
      tx = e.clientX; ty = e.clientY; schedule();
      pv.classList.add('on');
    });
  });
  table.addEventListener('mouseleave', function () { pv.classList.remove('on'); });
  [].slice.call(table.querySelectorAll('.prow')).forEach(function (r) {
    r.addEventListener('focus', function () {
      var b = r.getBoundingClientRect();
      img.src = srcOf(r); res.textContent = r.getAttribute('data-res');
      box.style.setProperty('--pc', getComputedStyle(r).getPropertyValue('--oc'));
      tx = b.left + b.width * 0.55; ty = b.top; schedule(); pv.classList.add('on');
    });
    r.addEventListener('blur', function () { pv.classList.remove('on'); });
  });
})();

// 떠 있는 목차: 표지를 지나면 나타나고, 지금 보고 있는 섹션을 표시한다
(function () {
  var dock = document.querySelector('.dock');
  if (!dock) return;
  var links = [].slice.call(dock.querySelectorAll('a'));
  var map = {};
  var order = ['work', 'career', 'tools', 'others', 'contact'];
  var ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY + 140, cur = '';
    order.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = map[id] || id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = 'contact';
    var secs = ['work', 'career', 'tools', 'others', 'contact'], tops = secs.map(function (id) { var el = document.getElementById(id); return el ? el.getBoundingClientRect().top + window.scrollY : 0; });
    var pi = 0; for (var k = 0; k < tops.length; k++) if (tops[k] <= y) pi = k;
    var pf = pi < tops.length - 1 ? Math.max(0, Math.min(1, (y - tops[pi]) / (tops[pi + 1] - tops[pi]))) : 0;
    var p = (y < tops[0]) ? 0 : (pi + pf) / (tops.length - 1);
    if (cur === 'contact') p = 1;
    dock.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + cur;
      a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  var btn = dock.querySelector('.dk-btn');
  function setOpen(o) { dock.classList.toggle('open', o); if (btn) btn.setAttribute('aria-expanded', o ? 'true' : 'false'); }
  if (btn) btn.addEventListener('click', function () { setOpen(!dock.classList.contains('open')); });
  links.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  document.addEventListener('click', function (e) { if (!dock.contains(e.target)) setOpen(false); });
  update();
})();

// 도구 타일을 누르면 그 도구를 쓴 작업(표의 행, 격자의 타일)에 이름표가 붙고, 작업 영역으로 이동한다.
(function () {
  var tiles = [].slice.call(document.querySelectorAll('.tl3'));
  if (!tiles.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function pick(tile) {
    var ids = (tile.getAttribute('data-projects') || '').split(',').filter(Boolean);
    PJ.clear();
    if (!ids.length) return;
    var first = null;
    ids.forEach(function (id) {
      PJ.mark(id, tile.getAttribute('data-tool'));
      var c = PJ.visible(id);
      if (c && (!first || c.getBoundingClientRect().top < first.getBoundingClientRect().top)) first = c;
    });
    tile.classList.add('is-on');
    var work = document.getElementById('work');
    var target = ids.length > 3 ? work : first;
    if (target) {
      var y = target.getBoundingClientRect().top + window.scrollY - (ids.length > 3 ? 0 : 140);
      window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
    }
  }
  tiles.forEach(function (t) {
    t.addEventListener('click', function () { pick(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(t); }
    });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') PJ.clear(); });
})();
