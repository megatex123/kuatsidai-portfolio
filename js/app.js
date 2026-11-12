/* ── Year ── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── Theme toggle ── */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
}
themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
  themeToggle.textContent = current === 'dark' ? '🌙' : '☀️';
});

/* ── Mobile nav ── */
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

/* ── Cert tab filtering ── */
document.querySelectorAll('.cert-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    document.querySelectorAll('.cert-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#certs-list .cert-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});

/* ── Typewriter on hero role ── */
const roleEl = document.querySelector('.role');
if (roleEl) {
  const text   = roleEl.textContent.trim();
  const cursor = document.createElement('span');
  cursor.className = 'type-cursor';
  cursor.textContent = '|';
  roleEl.textContent = '';
  roleEl.appendChild(cursor);
  let i = 0;
  const type = () => {
    if (i < text.length) {
      roleEl.insertBefore(document.createTextNode(text[i++]), cursor);
      setTimeout(type, 38 + Math.random() * 22);
    }
  };
  setTimeout(type, 600);
}

/* ── Scroll-reveal ── */
const revealTargets = [
  '.skill-card', '.timeline-item', '.project-card',
  '.edu-card', '.cert-card', '.contact-card',
  '.lang-card', '.ref-card', '.about-card',
];
document.querySelectorAll(revealTargets.join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 60}ms`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Scrollspy — active nav link ── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = mainNav.querySelectorAll('a[href^="#"]');

const spyObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('nav-active'));
      const link = mainNav.querySelector(`a[href="#${e.target.id}"]`);
      if (link) link.classList.add('nav-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ── Smooth counter for hero meta numbers ── */
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1200;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const metaObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('[data-count]').forEach(el => {
      animateCount(el, +el.dataset.count, el.dataset.suffix || '');
    });
    metaObserver.unobserve(e.target);
  });
}, { threshold: 0.5 });

const heroMeta = document.querySelector('.hero-meta');
if (heroMeta) metaObserver.observe(heroMeta);
