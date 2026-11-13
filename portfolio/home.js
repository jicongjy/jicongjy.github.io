/* 홈의 작업 목록을 data-*.js와 order.js에서 만든다 */
(function () {
  var C = window.CASES, G = window.GROUPS;
  var BLURB = {
    consent: '수신 동의율 19.7% → 44.52%, 틀린 가설을 행동 데이터로 고쳤어요',
    'biz-request': '"매칭 시작" 오해를 만드는 완료 화면을 고치고 계측까지',
    'ai-direct': '직접 구현과 규칙 문서로 기능 2주 → 1~2일(회고 기준)',
    performi: '감시 우려를 앱은 기록, 웹은 데이터로 나눈 구조로 풀었어요',
    flexwork: 'Bubble 이관, 인재 중심 3.0 요구사항 54건과 정책',
    'contract-policy': '계약 버튼을 상태 모델 문제로 다시 정의, 정책 10개 반영',
    seollal: '목표 전환 150건, 랜딩만 직접 만든 8일 캠페인',
    referral: '추천코드 66명 중 실제 추천 6명, 병목을 숫자로 진단',
    kpi: '회의 전 숫자 취합과 사전 회의를 없앤 사내 대시보드',
    'content-automation': '한 달 16건 게시, 판단은 사람에게 남긴 자동화',
    ds: '컴포넌트 41개 → 30개',
    studiobesser: '운영 중인 Framer 웹사이트 · LIVE SITE',
    finthcare: '운영 중인 Framer 웹사이트 · LIVE SITE',
    eatqo: '대상 · 보건복지부 장관상 · 급식카드 정보 앱',
    unbalance: '측정 시간 44초 → 32초, SUS 80점',
    pebbles: '랜딩 가설 검증과 9명 인터뷰, 앱스토어 출시',
    cando: '현대오토에버 제작지원팀 선정 · 북한이탈주민 언어 학습',
    boroga: '2024 대한민국 공공디자인대상 우수상 · 휠체어 공연 예매'
  };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var n = 0, html = '';
  G.forEach(function (g) {
    html += '<div class="work-group"><h3>' + esc(g.title) + ' <span>' + String(g.ids.length).padStart(2, '0') + '</span></h3><div class="work-list">';
    g.ids.forEach(function (id) {
      var c = C[id]; n++;
      html += '<a class="work-row cursor-view" href="work.html?id=' + id + '"><span class="num">' + String(n).padStart(2, '0') + '</span>' +
        '<div class="ttl"><strong>' + esc(c.title) + '</strong><p>' + esc(BLURB[id] || '') + '</p></div>' +
        '<span>' + esc(c.kicker) + '</span><span>' + esc(c.org) + ' · ' + esc(c.period) + '</span><i>↗</i></a>';
    });
    html += '</div></div>';
  });
  document.getElementById('work-groups').innerHTML = html;
})();
