const cursor = document.querySelector('.cursor');

if (cursor && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });
  document.querySelectorAll('.cursor-view').forEach((item) => {
    item.addEventListener('pointerenter', () => cursor.classList.add('view'));
    item.addEventListener('pointerleave', () => cursor.classList.remove('view'));
  });
}

const navLinks = [...document.querySelectorAll('.sidebar nav a')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .25] });
  sections.forEach((section) => observer.observe(section));
}
