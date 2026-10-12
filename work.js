/* v2 작업 상세 렌더러. 내용은 data-*.js, 순서는 order.js */
(function () {
  var CASES = window.CASES || {};
  var ORDER = window.ORDER || Object.keys(CASES);
  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  if (!CASES[id]) id = ORDER[0];
  var c = CASES[id];
  var idx = ORDER.indexOf(id);
  var prev = CASES[ORDER[(idx - 1 + ORDER.length) % ORDER.length]];
  var next = CASES[ORDER[(idx + 1) % ORDER.length]];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function md(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/&lt;(\/?)i&gt;/g, '<$1i>'); }
  function chips(a) { return (a || []).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join(''); }

  function figure(f) {
    if (!f) return '';
    var cls = 'figure' + (f.phone ? ' phone' : '') + (f.scroll ? ' tall' : '');
    var media = f.kind === 'video'
      ? '<video controls preload="metadata" playsinline' + (f.poster ? ' poster="' + esc(f.poster) + '"' : '') + '><source src="' + esc(f.src) + '" type="video/mp4" />영상을 재생할 수 없는 브라우저입니다.</video>'
      : '<img src="' + esc(f.src) + '" alt="' + esc(f.alt || f.caption || '') + '" loading="lazy" />';
    return '<figure class="' + cls + '"><div class="frame">' + media + '</div>' + (f.caption ? '<figcaption>' + md(f.caption) + '</figcaption>' : '') + '</figure>';
  }

  var BLOCKS = {
    figure: figure,
    gallery: function (b) { return '<div class="gallery">' + b.items.map(figure).join('') + '</div>'; },
    stats: function (b) {
      return '<div class="stats">' + b.items.map(function (s) {
        return '<div class="stat"><b>' + md(s.n) + '</b><span>' + md(s.l) + '</span></div>';
      }).join('') + '</div>';
    },
    flow: function (b) {
      return '<div class="flow">' + b.steps.map(function (s) {
        return '<div class="step"><b>' + md(s.t) + '</b>' + (s.d ? '<span>' + md(s.d) + '</span>' : '') + '</div>';
      }).join('') + '</div>';
    },
    compare: function (b) {
      function side(s, cls) {
        return '<div class="side ' + cls + '"><h4>' + esc(s.title) + '</h4><ul>' + s.items.map(function (i) { return '<li>' + md(i) + '</li>'; }).join('') + '</ul></div>';
      }
      return '<div class="compare">' + side(b.before, 'before') + side(b.after, 'after') + '</div>';
    },
    quote: function (b) {
      return '<blockquote class="quote"><p>“' + md(b.text) + '”</p>' + (b.by ? '<cite>' + esc(b.by) + '</cite>' : '') + '</blockquote>';
    },
    bars: function (b) {
      var max = b.max || Math.max.apply(null, b.items.map(function (i) { return i.v; }));
      return '<div class="bars">' + (b.title ? '<p class="ttl">' + esc(b.title) + '</p>' : '') + b.items.map(function (i) {
        return '<div class="row"><span>' + esc(i.l) + '</span><span class="track"><span class="fill' + (i.dim ? ' dim' : '') + '" style="width:' + Math.round(i.v / max * 100) + '%"></span></span><span class="val">' + esc(i.t || i.v) + '</span></div>';
      }).join('') + '</div>';
    },
    table: function (b) {
      return '<table class="table"><thead><tr>' + b.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        b.rows.map(function (r) { return '<tr>' + r.map(function (d, i) { return '<td data-l="' + esc(b.head[i] || '') + '">' + md(d) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
    },
    timeline: function (b) {
      return '<div class="timeline">' + b.items.map(function (i) {
        return '<div class="item"><div class="when">' + esc(i.when) + '</div><div><b>' + md(i.t) + '</b>' + (i.d ? '<span>' + md(i.d) + '</span>' : '') + '</div></div>';
      }).join('') + '</div>';
    },
    callout: function (b) { return '<div class="callout"><b>' + esc(b.title) + '</b><p>' + md(b.text) + '</p></div>'; },
    roles: function (b) {
      function col(t, a) { return '<div class="col2"><h4>' + esc(t) + '</h4><ul>' + a.map(function (i) { return '<li>' + md(i) + '</li>'; }).join('') + '</ul></div>'; }
      return '<div class="roles">' + col(b.mine.title || '내가 맡은 일', b.mine.items) + col(b.others.title || '함께한 사람이 맡은 일', b.others.items) + '</div>';
    },
    swatches: function (b) {
      return '<div class="swatches">' + b.items.map(function (i) {
        return '<div class="sw"><span class="chipc" style="background:' + esc(i.c) + '"></span><b>' + esc(i.n) + '</b><span>' + esc(i.c) + ' · ' + esc(i.d) + '</span></div>';
      }).join('') + '</div>';
    },
    code: function (b) {
      return '<figure class="codeblock"><figcaption>' + esc(b.title || '') + '</figcaption><pre><code>' + esc(b.text) + '</code></pre>' + (b.caption ? '<p class="cc">' + md(b.caption) + '</p>' : '') + '</figure>';
    },
    proto: function (b) {
      var icon = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 8v21l-3.6-3.2a3 3 0 0 0-4.3.3 3 3 0 0 0 .3 4.2l10 9.1A9 9 0 0 0 25.4 41H32a8 8 0 0 0 8-8V24a3 3 0 0 0-3-3 3 3 0 0 0-2.6 1.5A3 3 0 0 0 28 21a3 3 0 0 0-2.6 1.5A3 3 0 0 0 23 21V8a3 3 0 0 0-6 0z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M8 8a8 8 0 0 1 8-6M40 8a8 8 0 0 0-8-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" opacity=".6"/></svg>';
      return '<figure class="proto' + (b.phone ? ' phone' : '') + '"><div class="pbar"><span>' + esc(b.title || '프로토타입') + '</span><a href="' + esc(b.src) + '" target="_blank" rel="noreferrer">새 창에서 열기 ↗</a></div>' +
        '<div class="pwrap"><iframe src="' + esc(b.src) + '" title="' + esc(b.title || '프로토타입') + '" loading="lazy" style="height:' + (b.height || 640) + 'px"></iframe>' +
        (b.autoplay ? '' : '<button class="pdim" type="button" aria-label="프로토타입 사용해 보기"><span class="pic">' + icon + '</span><b>직접 눌러 보세요</b><small>여기를 클릭하면 프로토타입이 열려요</small></button>') + '</div>' +
        (b.caption ? '<figcaption>' + md(b.caption) + '</figcaption>' : '') + '</figure>';
    },
    note: function (b) { return '<p class="note">' + md(b.text) + '</p>'; },
    consentDemo: function () {
      return '<div class="demo"><div class="phone" id="demo"><h5>이용 약관 및 수집</h5>' +
        '<label><input type="checkbox" checked disabled><span>(필수) 서비스 이용약관 동의</span></label>' +
        '<label><input type="checkbox" checked disabled><span>(필수) 개인정보 수집 및 이용 동의</span></label>' +
        '<label><input type="checkbox" data-k="info" checked><span>(선택) 채용 소식 · 커뮤니티 · 뉴스레터 등 맞춤 정보 수신<small>이메일 · 알림톡</small></span></label>' +
        '<div class="warn" data-w="info" hidden>채용 소식과 맞춤 정보를 받을 수 없게 돼요. <button type="button" data-r="info">다시 받기</button></div>' +
        '<label><input type="checkbox" data-k="rec" checked><span>(선택) 맞춤 추천 포지션 정보 수신<small>경력과 스킬에 맞는 포지션을 보내 드려요</small></span></label>' +
        '<div class="warn" data-w="rec" hidden>맞춤 포지션을 받을 수 없게 돼요. 경력과 스킬을 바탕으로 한 추천 안내를 보내지 않습니다. <button type="button" data-r="rec">다시 받기</button></div>' +
        '</div><p class="cap">화면 구성을 재현한 예시입니다. 선택 항목을 해제하면 어떤 안내를 받지 못하는지 바로 보여요.</p></div>';
    }
  };

  function renderBlock(b) {
    var fn = BLOCKS[b.type];
    return fn ? fn(b) : '';
  }

  function section(s, i) {
    var no = String(i + 1).padStart(2, '0');
    return '<section class="sec" id="s' + no + '"><p class="no">' + no + '</p><h2>' + md(s.title) + '</h2>' +
      (s.paras || []).map(function (p) { return '<p>' + md(p) + '</p>'; }).join('') +
      ((s.blocks && s.blocks.length) ? '<div class="blocks">' + s.blocks.map(renderBlock).join('') + '</div>' : '') + '</section>';
  }

  /* 왼쪽 패널 */
  var rail = '<a class="wordmark" href="index.html" aria-label="포트폴리오 홈"><svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><path class="s" d="M10 7V29M10 20H30M30 7V27a7 7 0 0 1-7 7h-3"/><circle class="d" cx="14.5" cy="34.5" r="2.4"/></svg></a>' +
    '<p class="kicker">' + [c.kicker, c.org, c.period].filter(Boolean).map(esc).join(' · ') + '</p>' +
    '<p class="rtitle">' + esc(c.title) + '</p><dl>' +
    '<div><dt>역할</dt><dd>' + chips(c.roles) + '</dd></div>' +
    (c.domains && c.domains.length ? '<div><dt>경험한 기능</dt><dd>' + chips(c.domains) + '</dd></div>' : '') +
    (c.team && c.team.length ? '<div><dt>팀 구성</dt><dd>' + chips(c.team) + '</dd></div>' : '') +
    (c.tools && c.tools.length ? '<div><dt>도구</dt><dd>' + chips(c.tools) + '</dd></div>' : '') + '</dl>' +
    '<div class="result"><p>핵심 결과</p><strong>' + md(c.result.main) + '</strong>' + (c.result.sub ? '<span>' + md(c.result.sub) + '</span>' : '') + '</div>' +
    (c.live ? '<a class="live" href="' + esc(c.live) + '" target="_blank" rel="noreferrer">운영 사이트 보기 ↗</a>' : '') +
    '<a class="back" href="index.html#work">← 작업 목록</a>';
  document.getElementById('rail').innerHTML = rail;

  /* 본문 */
  var main = '';
  if (c.tone === 'client') {
    main = '<div class="col showcase"><h1 class="sr">' + esc(c.title) + '</h1>' +
      '<a class="live-btn" href="' + esc(c.live) + '" target="_blank" rel="noreferrer"><span>' + esc(c.title) + ' 사이트 보기 ↗</span><small>LIVE SITE</small></a>' +
      '<div class="shots">' + c.shots.map(figure).join('') + '</div><p class="one">' + md(c.one) + '</p>' + nav() + '</div>';
  } else {
    main = '<div class="col"><header class="top"><h1 class="title">' + md(c.headline) + '</h1><p class="lede">' + md(c.lede) + '</p></header>' +
      (c.hero ? '<div class="hero">' + figure(c.hero) + '</div>' : '') +
      '<div class="summary">' + c.summary.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><p>' + md(s[1]) + '</p></div>'; }).join('') + '</div>' +
      (c.sideNote ? '<p class="side-note">' + md(c.sideNote) + '</p>' : '') +
      c.sections.map(section).join('') + nav() + '</div>';
  }
  function nav() {
    return '<nav class="next"><a href="work.html?id=' + prev.slug + '">← 이전<b>' + esc(prev.title) + '</b></a><a href="work.html?id=' + next.slug + '" style="text-align:right">다음 →<b>' + esc(next.title) + '</b></a></nav>';
  }
  document.getElementById('stage').innerHTML = main;
  document.title = c.title + ' | 홍지영';
  var md0 = document.querySelector('meta[name="description"]'); if (md0) md0.setAttribute('content', (c.lede || c.one || c.title).slice(0, 150));
  document.querySelectorAll('.pdim').forEach(function (btn) { btn.addEventListener('click', function () { btn.remove(); }); });


  /* 세로로 긴 이미지: 고정 프레임 안에서 스크롤, 처음 보일 때 한 번 자동으로 훑어 보여 준다 */
  function makeScrollable(fig) {
    if (fig.classList.contains('tall') && fig.querySelector('.scrollhint')) return;
    fig.classList.add('tall');
    var frame = fig.querySelector('.frame');
    var hint = document.createElement('span');
    hint.className = 'scrollhint'; hint.textContent = '스크롤해서 전체 보기';
    frame.appendChild(hint);
    frame.tabIndex = 0;
    var stop = false;
    function cancel() { stop = true; hint.remove(); }
    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (ev) { frame.addEventListener(ev, cancel, { passive: true, once: true }); });
    frame.addEventListener('scroll', function () { if (frame.scrollTop > 8) hint.classList.add('off'); }, { passive: true });
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      var max = frame.scrollHeight - frame.clientHeight, t0 = null, dur = Math.min(9000, Math.max(3500, max * 6));
      function step(t) {
        if (stop) return;
        if (t0 === null) t0 = t;
        var p = Math.min(1, (t - t0) / dur), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        frame.scrollTop = max * e;
        if (p < 1) requestAnimationFrame(step);
        else setTimeout(function () { if (!stop) frame.scrollTo({ top: 0, behavior: 'smooth' }); }, 900);
      }
      setTimeout(function () { if (!stop) requestAnimationFrame(step); }, 500);
    }, { threshold: .7 });
    io.observe(frame);
  }
  document.querySelectorAll('.figure').forEach(function (fig) {
    var img = fig.querySelector('img'); if (!img) return;
    function check() { if (img.naturalWidth && img.naturalHeight / img.naturalWidth > 2.4) makeScrollable(fig); else if (fig.classList.contains('tall')) makeScrollable(fig); }
    if (img.complete && img.naturalWidth) check(); else img.addEventListener('load', check);
  });

  /* 동의 화면 */
  var demo = document.getElementById('demo');
  if (demo) {
    demo.addEventListener('change', function (e) {
      var k = e.target.getAttribute('data-k');
      if (!k) return;
      demo.querySelector('[data-w="' + k + '"]').hidden = e.target.checked;
    });
    demo.addEventListener('click', function (e) {
      var k = e.target.getAttribute('data-r');
      if (!k) return;
      demo.querySelector('[data-k="' + k + '"]').checked = true;
      demo.querySelector('[data-w="' + k + '"]').hidden = true;
    });
  }
})();
