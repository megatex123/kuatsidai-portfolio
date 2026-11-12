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
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
});

/* ── Mobile nav ── */
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mainNav.classList.remove('open')));

/* ── Custom cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=-100,my=-100,rx=-100,ry=-100;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
document.querySelectorAll('a,button,.proj-card,.stack-col,.cert-row,.ci-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('ring-hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('ring-hover'));
});
(function loop() {
  dot.style.transform  = `translate(${mx}px,${my}px)`;
  rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
  ring.style.transform = `translate(${rx}px,${ry}px)`;
  requestAnimationFrame(loop);
})();

/* ── Matrix rain ── */
(function(){
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const chars = '01アイウエオカキクケ</>{}[]=+-*#@!;:,.?';
  const fs = 13;
  let cols, drops;
  function resize() {
    const hero = canvas.parentElement;
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    cols  = Math.floor(canvas.width / fs);
    drops = Array(cols).fill(0).map(() => Math.random() * -60);
  }
  resize();
  window.addEventListener('resize', resize);
  setInterval(() => {
    ctx.fillStyle = 'rgba(10,13,20,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fs}px 'JetBrains Mono',monospace`;
    for (let i = 0; i < cols; i++) {
      const ch = chars[Math.floor(Math.random()*chars.length)];
      ctx.fillStyle = `rgba(74,222,128,${0.06+Math.random()*0.1})`;
      ctx.fillText(ch, i*fs, drops[i]*fs);
      if (drops[i]*fs > canvas.height && Math.random()>.975) drops[i]=0;
      drops[i] += 0.35;
    }
  }, 50);
})();

/* ── Cert tab filtering ── */
document.querySelectorAll('.cert-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    document.querySelectorAll('.cert-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#certs-list .cert-row').forEach(row => {
      row.style.display = (cat==='all' || row.dataset.cat===cat) ? '' : 'none';
    });
  });
});

/* ── Scroll-reveal ── */
document.querySelectorAll('.proj-card,.stack-col,.cert-row,.exp-item,.edu-item,.ci-card,.stat-item').forEach((el,i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i%5)*70}ms`;
});
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }});
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── Scrollspy ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = mainNav.querySelectorAll('a[href^="#"]');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('nav-active'));
      const a = mainNav.querySelector(`a[href="#${e.target.id}"]`);
      if (a) a.classList.add('nav-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));

/* ── 3D card tilt ── */
document.querySelectorAll('.proj-card,.stack-col').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
    const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
    card.style.transform = `perspective(600px) rotateX(${-dy*5}deg) rotateY(${dx*5}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform=''; });
});
