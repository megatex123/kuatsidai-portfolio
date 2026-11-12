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

/* ── Custom cursor ── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = -100, my = -100, rx = -100, ry = -100;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.querySelectorAll('a,button,.skill-card,.project-card,.cert-card,.edu-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('ring-hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('ring-hover'));
});
(function animateCursor() {
  dot.style.transform  = `translate(${mx}px,${my}px)`;
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx}px,${ry}px)`;
  requestAnimationFrame(animateCursor);
})();

/* ── Matrix rain canvas ── */
(function matrixRain() {
  const canvas  = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  const chars   = '01アイウエオカキクケコサシスセソ</>{}[]()=+-*&^%$#@!;:,.?';
  const fontSize = 13;
  let cols, drops;

  function resize() {
    const hero = canvas.parentElement;
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = Array(cols).fill(0).map(() => Math.random() * -50);
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    ctx.fillStyle = 'rgba(10,14,20,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
    for (let i = 0; i < cols; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x    = i * fontSize;
      const y    = drops[i] * fontSize;
      const alpha = 0.08 + Math.random() * 0.12;
      ctx.fillStyle = `rgba(74,222,128,${alpha})`;
      ctx.fillText(char, x, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.4;
    }
  }
  setInterval(draw, 50);
})();

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
      setTimeout(type, 36 + Math.random() * 20);
    }
  };
  setTimeout(type, 700);
}

/* ── Hero terminal ── */
(function heroTerminal() {
  const body = document.getElementById('term-body');
  if (!body) return;

  const lines = [
    { prompt: '$ ', cmd: 'whoami', delay: 500 },
    { out: '→ Megat Amirul · Full Stack Developer', delay: 400, cls: 'term-out' },
    { prompt: '$ ', cmd: 'cat stack.txt', delay: 700 },
    { out: '→ PHP · Laravel · Vue.js · Ionic · Python', delay: 200, cls: 'term-out' },
    { out: '→ Node.js · FastAPI · MySQL · MongoDB · Go', delay: 200, cls: 'term-out' },
    { prompt: '$ ', cmd: 'cat focus.txt', delay: 700 },
    { out: '→ Government Systems · API Design · ETL', delay: 200, cls: 'term-out' },
    { out: '→ Security Hardening · AI Automation', delay: 200, cls: 'term-out' },
    { prompt: '$ ', cmd: 'uptime', delay: 700 },
    { out: '→ 6+ years in production  ✓', delay: 200, cls: 'term-out accent' },
    { prompt: '$ ', cmd: '_', delay: 700, idle: true },
  ];

  let totalDelay = 0;

  lines.forEach(line => {
    totalDelay += line.delay || 300;
    const d = totalDelay;

    if (line.idle) {
      setTimeout(() => {
        const row = document.createElement('div');
        row.className = 'term-line';
        const p = document.createElement('span'); p.className = 'term-prompt'; p.textContent = line.prompt;
        const c = document.createElement('span'); c.className = 'type-cursor'; c.textContent = '█';
        row.append(p, c);
        body.appendChild(row);
        body.scrollTop = body.scrollHeight;
      }, d);
      return;
    }

    if (line.cmd !== undefined) {
      setTimeout(() => {
        const row = document.createElement('div');
        row.className = 'term-line';
        const p = document.createElement('span'); p.className = 'term-prompt'; p.textContent = line.prompt;
        const t = document.createElement('span'); t.className = 'term-cmd';
        row.append(p, t);
        body.appendChild(row);

        let ci = 0;
        const typeCmd = () => {
          if (ci < line.cmd.length) {
            t.textContent += line.cmd[ci++];
            setTimeout(typeCmd, 55);
          }
        };
        typeCmd();
        body.scrollTop = body.scrollHeight;
      }, d);
    }

    if (line.out !== undefined) {
      setTimeout(() => {
        const row = document.createElement('div');
        row.className = `term-line ${line.cls || ''}`;
        row.textContent = line.out;
        body.appendChild(row);
        body.scrollTop = body.scrollHeight;
      }, d);
    }
  });
})();

/* ── 3-D card tilt ── */
document.querySelectorAll('.skill-card,.project-card,.edu-card,.cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r   = card.getBoundingClientRect();
    const cx  = r.left + r.width  / 2;
    const cy  = r.top  + r.height / 2;
    const dx  = (e.clientX - cx) / (r.width  / 2);
    const dy  = (e.clientY - cy) / (r.height / 2);
    card.style.transform = `perspective(600px) rotateX(${-dy * 6}deg) rotateY(${dx * 6}deg) scale(1.025)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

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

/* ── Scrollspy ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = mainNav.querySelectorAll('a[href^="#"]');

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
