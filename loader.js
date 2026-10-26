/* 로고가 그려지는 로딩 화면. 처음 방문에만 길게, 이후에는 짧게 */
(function () {
  var first = true;
  try { first = !sessionStorage.getItem('hj-seen'); sessionStorage.setItem('hj-seen', '1'); } catch (e) {}
  var el = document.createElement('div');
  el.id = 'loader';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<svg  viewBox="0 0 48 48" aria-hidden="true"><rect class="bg" width="48" height="48" rx="10"/><rect class="b1" x="11" y="9" width="8" height="30" rx="1.5"/><rect class="b2" x="29" y="9" width="8" height="30" rx="1.5"/><rect class="b3" x="19" y="21" width="10" height="6"/></svg>';
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
