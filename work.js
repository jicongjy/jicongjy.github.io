/* 작업 상세 렌더러 (2026-11 개편). 내용은 data-*.js, 순서는 order.js, 보조 정보(대표 이미지·기여도)와 시각화 보정은 work-extra.js */
(function () {
  var CASES = window.CASES || {};
  var ORDER = window.ORDER || Object.keys(CASES);
  var EX = window.EXTRA || {};
  var id = new URLSearchParams(location.search).get('id');
  if (!CASES[id]) id = ORDER[0];
  if (window.PATCH && window.PATCH[id]) window.PATCH[id](CASES[id]);
  var c = CASES[id];
  var ex = EX[id] || {};
  var idx = ORDER.indexOf(id);
  var prev = CASES[ORDER[(idx - 1 + ORDER.length) % ORDER.length]];
  var next = CASES[ORDER[(idx + 1) % ORDER.length]];

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function md(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/&lt;(\/?)i&gt;/g, '<$1i>'); }
  function lis(a, cls) { return (a || []).map(function (t, i) { return '<li' + (cls && cls(i) ? ' class="' + cls(i) + '"' : '') + '>' + esc(t) + '</li>'; }).join(''); }
  function panel(title, body) { return '<div class="panel">' + (title ? '<h3>' + esc(title) + '</h3>' : '') + body + '</div>'; }

  function figure(f) {
    if (!f) return '';
    var cls = 'figure' + (f.phone ? ' phone' : '') + (f.scroll ? ' tall' : '');
    var media = f.kind === 'video'
      ? '<video controls preload="metadata" playsinline' + (f.poster ? ' poster="' + esc(f.poster) + '"' : '') + '><source src="' + esc(f.src) + '" type="video/mp4" />영상을 재생할 수 없는 브라우저입니다.</video>'
      : '<img src="' + esc(f.src) + '" alt="' + esc(f.alt || f.caption || '') + '" loading="lazy" />';
    return '<figure class="' + cls + '"><div class="frame">' + media + '</div>' + (f.caption ? '<figcaption>' + md(f.caption) + '</figcaption>' : '') + '</figure>';
  }
  /* "19.7% → 44.52%" 같은 숫자는 앞은 옅게, 뒤는 포인트 레드로 */
  function bigNum(n) {
    var m = String(n).split(/\s*→\s*/);
    if (m.length === 2) return '<b' + (String(n).length > 18 ? ' class="sm"' : '') + '><span class="from">' + esc(m[0]) + '</span><span class="arr">→</span><span class="to">' + esc(m[1]) + '</span></b>';
    return '<b' + (String(n).length > 12 ? ' class="sm"' : '') + '>' + md(n) + '</b>';
  }

  var BLOCKS = {
    figure: figure,
    gallery: function (b) { return '<div class="gallery">' + b.items.map(figure).join('') + '</div>'; },
    stats: function (b) {
      return '<div class="stats">' + b.items.map(function (s) { return '<div class="stat">' + bigNum(s.n) + '<span>' + md(s.l) + '</span></div>'; }).join('') + '</div>';
    },
    delta: function (b) {
      return '<div class="cols2">' + b.items.map(function (d) {
        return panel(d.title, '<div class="delta"><span class="from">' + esc(d.from) + '</span><span class="arr">→</span><span class="to">' + esc(d.to) + '</span></div><span class="delta-l">' + esc(d.note || '') + '</span>');
      }).join('') + '</div>';
    },
    split: function (b) {
      return panel(b.title, b.items.map(function (i, k) {
        return '<div class="split-row"><b>' + esc(i.l) + '</b><div class="split"><div class="a" style="width:' + i.v + '%">' + i.v + '%</div><div class="b" style="width:' + (100 - i.v) + '%">동의하지 않음 ' + (Math.round((100 - i.v) * 10) / 10) + '%</div></div></div>';
      }).join('') + (b.note ? '<p class="split-n">→ ' + esc(b.note) + '</p>' : ''));
    },
    flow: function (b) {
      return '<div class="flow">' + b.steps.map(function (s) { return '<div class="step' + (s.on ? ' on' : '') + '"><b>' + md(s.t) + '</b>' + (s.d ? '<span>' + md(s.d) + '</span>' : '') + '</div>'; }).join('') + '</div>';
    },
    compare: function (b) {
      var n = Math.max(b.before.items.length, b.after.items.length), rows = '';
      for (var i = 0; i < n; i++) rows += '<tr><td class="dim">' + (b.before.items[i] ? md(b.before.items[i]) : '—') + '</td><td class="k">' + (b.after.items[i] ? md(b.after.items[i]) : '—') + '</td></tr>';
      return '<div class="tbl-wrap"><table class="compare"><thead><tr><th>' + esc(b.before.title) + '</th><th>' + esc(b.after.title) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
    },
    quote: function (b) { return '<blockquote class="quote"><p>“' + md(b.text) + '”</p>' + (b.by ? '<cite>' + esc(b.by) + '</cite>' : '') + '</blockquote>'; },
    bars: function (b) {
      var pct = b.items.every(function (i) { return /%$/.test(String(i.t || '')); });
      var max = pct ? 100 : (b.max || Math.max.apply(null, b.items.map(function (i) { return i.v; })));
      return panel(b.title, '<div class="bars">' + b.items.map(function (i) {
        return '<div class="bar' + (i.dim ? ' dim' : '') + '"><span>' + esc(i.l) + '</span><div class="tr"><i style="width:' + Math.min(100, Math.round(i.v / max * 1000) / 10) + '%"></i></div><b>' + esc(i.t || i.v) + '</b></div>';
      }).join('') + '</div>');
    },
    dots: function (b) {
      return panel(b.title, b.rows.map(function (r) {
        return '<div class="iso"><span>' + esc(r.l) + '</span><div class="dots">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return '<i' + (r.fill[k] ? ' style="--f:' + r.fill[k] + '%"' : '') + '></i>'; }).join('') + '</div><b>' + esc(r.label) + '</b></div>';
      }).join(''));
    },
    period: function (b) {
      var t = b.a.days + b.b.days;
      return panel(b.title, '<div class="tline"><div class="seg"><div class="p" style="width:' + (b.a.days / t * 100) + '%">' + esc(b.a.l) + '</div><div class="q" style="width:' + (b.b.days / t * 100) + '%">' + esc(b.b.l) + '</div></div><div class="tk"><span style="left:0">' + esc(b.ticks[0]) + '</span><span style="left:' + (b.a.days / t * 100) + '%">' + esc(b.ticks[1]) + '</span><span style="left:100%">' + esc(b.ticks[2]) + '</span></div></div>');
    },
    lane: function (b) {
      var n = Math.max.apply(null, b.rows.map(function (r) { return r.steps.length; }));
      return panel(b.title, b.rows.map(function (r) {
        return '<div class="lane' + (r.ghost ? ' g' : '') + '" style="--n:' + n + '"><div class="ln">' + esc(r.who) + '</div>' + r.steps.map(function (s) { return '<div class="st' + (s ? '' : ' e') + '">' + esc(s) + '</div>'; }).join('') + '</div>';
      }).join(''));
    },
    table: function (b) {
      return '<div class="tbl-wrap"><table class="table"><thead><tr>' + b.head.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        b.rows.map(function (r) { return '<tr>' + r.map(function (d, i) { return '<td data-l="' + esc(b.head[i] || '') + '">' + md(d) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    },
    timeline: function (b) {
      return '<div class="timeline">' + b.items.map(function (i) { return '<div class="item"><div class="when">' + esc(i.when) + '</div><div><b>' + md(i.t) + '</b>' + (i.d ? '<span>' + md(i.d) + '</span>' : '') + '</div></div>'; }).join('') + '</div>';
    },
    callout: function (b) { return '<div class="callout"><b>' + esc(b.title) + '</b><p>' + md(b.text) + '</p></div>'; },
    roles: function (b) {
      function col(t, a) { return '<div class="col2"><h4>' + esc(t) + '</h4><ul>' + a.map(function (i) { return '<li>' + md(i) + '</li>'; }).join('') + '</ul></div>'; }
      return '<div class="roles">' + col(b.mine.title || '내가 맡은 일', b.mine.items) + col(b.others.title || '함께한 사람이 맡은 일', b.others.items) + '</div>';
    },
    swatches: function (b) {
      return '<div class="swatches">' + b.items.map(function (i) { return '<div class="sw"><span class="chipc" style="background:' + esc(i.c) + '"></span><b>' + esc(i.n) + '</b><span>' + esc(i.c) + ' · ' + esc(i.d) + '</span></div>'; }).join('') + '</div>';
    },
    code: function (b) {
      return '<figure class="codeblock"><figcaption>' + esc(b.title || '') + '</figcaption><pre><code>' + esc(b.text) + '</code></pre>' + (b.caption ? '<p class="cc">' + md(b.caption) + '</p>' : '') + '</figure>';
    },
    proto: function (b) {
      var icon = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M17 8v21l-3.6-3.2a3 3 0 0 0-4.3.3 3 3 0 0 0 .3 4.2l10 9.1A9 9 0 0 0 25.4 41H32a8 8 0 0 0 8-8V24a3 3 0 0 0-3-3 3 3 0 0 0-2.6 1.5A3 3 0 0 0 28 21a3 3 0 0 0-2.6 1.5A3 3 0 0 0 23 21V8a3 3 0 0 0-6 0z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>';
      return '<figure class="proto' + (b.phone ? ' phone' : '') + '"><div class="pbar"><span>' + esc(b.title || '프로토타입') + '</span><a href="' + esc(b.src) + '" target="_blank" rel="noreferrer">새 창에서 열기 ↗</a></div>' +
        '<p class="pguide" hidden><b></b><span></span></p>' +
        '<div class="pwrap"><iframe src="' + esc(b.src) + '" title="' + esc(b.title || '프로토타입') + '" loading="lazy" style="height:' + (b.height || 640) + 'px"></iframe>' +
        (b.autoplay ? '' : '<button class="pdim" type="button" aria-label="프로토타입 사용해 보기"><span class="pic">' + icon + '</span><b>직접 눌러 보세요</b><small>여기를 클릭하면 프로토타입이 열려요</small></button>') + '</div>' +
        (b.caption ? '<figcaption>' + md(b.caption) + '</figcaption>' : '') + '</figure>';
    },
    note: function (b) { return '<p class="note">' + md(b.text) + '</p>'; }
  };
  function renderBlock(b) { var fn = BLOCKS[b.type]; return fn ? fn(b) : ''; }
  function section(s) {
    return '<section class="sec"><h2>' + md(s.title) + '</h2>' + (s.paras || []).map(function (p) { return '<p>' + md(p) + '</p>'; }).join('') +
      ((s.blocks && s.blocks.length) ? '<div class="blocks">' + s.blocks.map(renderBlock).join('') + '</div>' : '') + '</section>';
  }

  /* 왼쪽 열 */
  var tags = [c.kicker, c.org].filter(Boolean);
  var side = '<a class="back" href="index.html#work"><span class="ar" aria-hidden="true">←</span>작업 목록</a>' +
    '<ul class="tags">' + lis(tags, function (i) { return i ? 'o' : ''; }) + '</ul>' +
    '<dl class="key"><dt>핵심 결과</dt><dd>' + md(c.result.main) + (c.result.sub ? '<small>' + md(c.result.sub) + '</small>' : '') + '</dd></dl>' +
    (c.live ? '<a class="live" href="' + esc(c.live) + '" target="_blank" rel="noreferrer">운영 사이트 보기 ↗</a>' : '');

  /* 담당 정보 */
  var meta = '<header class="hd"><h1>' + (c.tone === 'client' ? esc(c.title) : md(c.headline)) + '</h1><div class="hr"><dl class="hm">' +
    '<div><dt>역할</dt><dd><ul class="pl">' + lis(c.roles) + '</ul></dd></div>' +
    '<div><dt>도구</dt><dd><ul class="pl o">' + lis(c.tools) + '</ul></dd></div>' +
    '<div><dt>기간</dt><dd>' + esc(c.period) + '</dd></div>' +
    (ex.share ? '<div><dt>기여도</dt><dd><span class="share">' + esc(ex.share) + '</span></dd></div>' : '') +
    (c.domains && c.domains.length ? '<div class="w2"><dt>경험한 기능</dt><dd><ul class="pl o">' + lis(c.domains) + '</ul></dd></div>' : '') +
    (c.team && c.team.length ? '<div class="w2"><dt>팀 구성</dt><dd><ul class="pl o">' + lis(c.team) + '</ul></dd></div>' : '') + '</dl>' +
    (c.lede ? '<p class="lede">' + md(c.lede) + '</p>' : '') + '</div></header>';

  var hero = ex.img ? '<div class="hero"><img src="' + esc(ex.img) + '" alt="' + esc(c.title) + ' 대표 화면" /></div>' : '';

  function nav() {
    return '<nav class="next" aria-label="다른 프로젝트"><a href="work.html?id=' + prev.slug + '"><small>← 이전 프로젝트</small><b>' + esc(prev.title) + '</b></a><a href="work.html?id=' + next.slug + '"><small>다음 프로젝트 →</small><b>' + esc(next.title) + '</b></a></nav>';
  }

  var main;
  if (c.tone === 'client') {
    main = meta + '<div class="shots">' + c.shots.map(figure).join('') + '</div><p class="one">' + md(c.one) + '</p>' + nav();
    side = side.replace(/<dl class="key">.*?<\/dl>/, '<dl class="key"><dt>핵심 결과</dt><dd>' + md(c.result.main) + '</dd></dl>');
  } else {
    main = meta + hero +
      '<div class="summary">' + c.summary.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><p>' + md(s[1]) + '</p></div>'; }).join('') + '</div>' +
      (c.sideNote ? '<p class="side-note">' + md(c.sideNote) + '</p>' : '') + c.sections.map(section).join('') + nav();
  }

  document.getElementById('app').innerHTML =
    '<header class="gh"><a class="gh-b" href="index.html">홍지영</a><nav class="gh-m" aria-label="섹션 이동"><a href="index.html#work" class="on">작업</a><a href="index.html#career">이력</a><a href="index.html#tools">도구</a><a href="index.html#others">수상·배움</a></nav><a class="gh-c" href="index.html#contact">문의</a></header>' +
    '<div class="page"><aside class="side">' + side + '</aside><main class="main">' + main + '</main></div>' +
    '<footer class="foot"><b>홍지영</b><span>프로덕트 디자이너</span><a href="index.html">포트폴리오 홈</a></footer>';

  /* 줄이 바뀌는 흐름은 줄 끝의 화살표를 숨긴다 */
  function arrows() {
    document.querySelectorAll('.flow').forEach(function (f) {
      var s = [].slice.call(f.children);
      s.forEach(function (el, i) { el.classList.toggle('eol', !!s[i + 1] && s[i + 1].offsetTop > el.offsetTop + 4); });
    });
  }
  arrows(); window.addEventListener('resize', arrows); window.addEventListener('load', arrows);

  document.title = c.title + ' | 홍지영';
  var m0 = document.querySelector('meta[name="description"]'); if (m0) m0.setAttribute('content', (c.lede || c.one || c.title).slice(0, 150));

  window.addEventListener('message', function (e) {
    if (e.data && e.data.protoGuide) {
      document.querySelectorAll('.proto').forEach(function (fg) {
        var f = fg.querySelector('iframe');
        if (!f || f.contentWindow !== e.source) return;
        var g = fg.querySelector('.pguide'), d = e.data.protoGuide;
        g.hidden = false; g.querySelector('b').textContent = '안내 ' + d.step + '/' + d.total; g.querySelector('span').textContent = d.text;
      });
      return;
    }
    if (!e.data || !e.data.protoHeight) return;
    document.querySelectorAll('.pwrap iframe').forEach(function (f) { if (f.contentWindow === e.source) f.style.height = Math.ceil(e.data.protoHeight) + 'px'; });
  });
  document.querySelectorAll('.pdim').forEach(function (btn) { btn.addEventListener('click', function () { btn.remove(); }); });

  /* 세로로 긴 이미지: 고정 프레임 안에서 스크롤하고, 처음 보일 때 한 번 훑어 보여 준다 */
  function makeScrollable(fig) {
    if (fig.querySelector('.scrollhint')) return;
    fig.classList.add('tall');
    var frame = fig.querySelector('.frame');
    var hint = document.createElement('span'); hint.className = 'scrollhint'; hint.textContent = '스크롤해서 전체 보기';
    frame.appendChild(hint); frame.tabIndex = 0;
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
        if (p < 1) requestAnimationFrame(step); else setTimeout(function () { if (!stop) frame.scrollTo({ top: 0, behavior: 'smooth' }); }, 900);
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
})();
