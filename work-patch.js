/* 상세별 시각화 보정. 데이터 파일은 건드리지 않고 화면에 그리기 직전에 바꾼다. */
window.PATCH = {
  consent: function (c) {
    c.title = '가입 화면 마케팅 수신 동의 개선';
    var s = c.sections;
    s[0].blocks = [{ type: 'split', title: '가입한 사람 100% 중 수신에 동의한 비율 (개편 전 14일)', items: [{ l: '마케팅 수신', v: 19.7 }, { l: '채용 추천 수신', v: 24.2 }], note: '동의하지 않으면 맞춤 포지션 추천이 멈춰요' }];
    (s[1].blocks || []).forEach(function (b) { if (b.type === 'flow') b.steps[2].on = true; });
    s[3].blocks = [{ type: 'lane', title: '누가 무엇을 했는지', rows: [
      { who: '나', steps: ['문제 정의', '화면·문구 디자인', '구현·배포', 'PostHog로 결과 확인'] },
      { who: '뉴스레터 담당자', ghost: true, steps: ['', '', '', '다음 목표치 논의'] }] }];
    s[4].blocks = [
      { type: 'delta', items: [
        { title: '마케팅 수신 동의율', from: '19.7%', to: '44.52%', note: '개편 전 14일 → 개편 후 8일' },
        { title: '채용 추천 수신 동의율', from: '24.2%', to: '45.51%', note: '개편 전 14일 → 개편 후 8일' }] },
      { type: 'bars', title: '동의율 전후 비교', items: [
        { l: '마케팅 · 전', v: 19.7, t: '19.7%', dim: true }, { l: '마케팅 · 후', v: 44.52, t: '44.52%' },
        { l: '채용 추천 · 전', v: 24.2, t: '24.2%', dim: true }, { l: '채용 추천 · 후', v: 45.51, t: '45.51%' }] },
      { type: 'dots', title: '가입한 열 명 중 마케팅 수신에 동의한 사람', rows: [
        { l: '개편 전', fill: [100, 97], label: '두 명 가까이' }, { l: '개편 후', fill: [100, 100, 100, 100, 45.2], label: '네 명 넘게' }] },
      { type: 'period', title: '비교한 기간 (4월 5일부터 26일까지, 날짜 길이에 맞춤)', a: { l: '개편 전 14일', days: 14 }, b: { l: '개편 후 8일', days: 8 }, ticks: ['4.5', '4.19 2차안 적용', '4.26'] }
    ];
  }
};
