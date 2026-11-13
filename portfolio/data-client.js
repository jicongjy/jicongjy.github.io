/* 외주 웹사이트는 쇼케이스 형식: 운영 사이트 링크, 큰 화면, 한 문장 */
window.CASES = window.CASES || {};
Object.assign(window.CASES, {

  studiobesser: {
    slug: 'studiobesser', domains:["웹사이트", "사례·포트폴리오", "단가표", "문의 흐름"], title: 'Studio Besser', kicker: '프레이머 웹사이트', org: '클라이언트', period: '2026',
    tone: 'client', live: 'https://www.studiobesser.com/',
    roles: ['정보 구조', 'UI 디자인', 'Framer 빌드'], tools: ['Figma', 'Framer'],
    result: { main: '반응형 웹사이트 제작, 실제 운영 중' },
    shots: [
      { src: 'assets/opt/besser-hero.jpg', alt: 'Studio Besser 운영 사이트 첫 화면' },
      { src: 'assets/opt/besser-cases.jpg', alt: 'Studio Besser 단체복과 커스텀 제작 사례 영역' },
      { src: 'assets/opt/besser-portfolio.jpg', alt: 'Studio Besser 커스텀 포트폴리오 목록' },
      { src: 'assets/opt/besser-prices.jpg', alt: 'Studio Besser 단가표' },
      { src: 'assets/opt/besser-mobile.jpg', alt: 'Studio Besser 모바일 화면', phone: true }
    ],
    one: '커스텀 의류 스튜디오의 제작 사례와 문의 흐름을 정리해 Framer로 만들었어요. 정보 구조와 화면 디자인, 구축을 맡았습니다.'
  },

  finthcare: {
    slug: 'finthcare', domains:["웹사이트", "예약 서비스 소개", "블로그", "문의 흐름"], title: 'FinthCare', kicker: '프레이머 웹사이트', org: '클라이언트', period: '2026',
    tone: 'client', live: 'https://www.finthcare.com/',
    roles: ['정보 구조', 'UI 디자인', 'Framer 빌드'], tools: ['Figma', 'Framer'],
    result: { main: '반응형 웹사이트 제작, 실제 운영 중' },
    shots: [
      { src: 'assets/opt/finthcare-gallery-04.jpg', alt: 'FinthCare 운영 사이트 첫 화면과 회사 소개' },
      { src: 'assets/opt/finthcare-gallery-03.jpg', alt: 'FinthCare 기업 멤버십 서비스 화면' },
      { src: 'assets/opt/finthcare-gallery-02.jpg', alt: 'FinthCare 예약 서비스 소개 화면' },
      { src: 'assets/opt/finthcare-gallery-05.jpg', alt: 'FinthCare 블로그 화면' },
      { src: 'assets/opt/finthcare-gallery-06.jpg', alt: 'FinthCare 고객 후기와 문의 화면' }
    ],
    one: '헬스케어 예약 서비스의 신뢰 정보와 예약 전에 궁금해하는 내용을 한 흐름으로 정리해 Framer로 만들었어요. 정보 구조와 화면 디자인, 구축을 맡았습니다.'
  }

});
