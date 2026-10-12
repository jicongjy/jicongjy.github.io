/* 로고가 그려지는 로딩 화면. 처음 방문에만 길게, 이후에는 짧게 */
(function () {
  var first = true;
  try { first = !sessionStorage.getItem('hj-seen'); sessionStorage.setItem('hj-seen', '1'); } catch (e) {}
  var el = document.createElement('div');
  el.id = 'loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<svg viewBox="0 0 40 40"><path class="s p1" pathLength="1" d="M10 7V29"/><path class="s p2" pathLength="1" d="M10 20H30"/><path class="s p3" pathLength="1" d="M30 7V27a7 7 0 0 1-7 7h-3"/><circle class="d" cx="14.5" cy="34.5" r="2.4"/></svg>';
  document.documentElement.appendChild(el);
  var min = first ? 1700 : 450, t0 = Date.now(), done = false;
  function hide() {
    if (done) return; done = true;
    var wait = Math.max(0, min - (Date.now() - t0));
    setTimeout(function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 600); }, wait);
  }
  if (document.readyState === 'complete') hide(); else window.addEventListener('load', hide);
  setTimeout(hide, 6000);
})();
