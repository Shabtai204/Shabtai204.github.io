/* ═══════════════════════════════════════════════════════
   BLACKEAGLE — main.js
   Boot sequence · Matrix rain · Scroll animations
   Stats counters · Architecture accordion
   ═══════════════════════════════════════════════════════ */

'use strict';

// ── 1. BOOT SEQUENCE ──────────────────────────────────────
(function initBoot() {
  const bootLines = [
    { text: 'BLACKEAGLE OS v2.0', delay: 0 },
    { text: '> Initializing security modules...', delay: 400 },
    { text: '> Loading AES-256 encryption... [OK]', delay: 850 },
    { text: '> Establishing TLS 1.2 channels... [OK]', delay: 1280 },
    { text: '> 12 surveillance modules online... [OK]', delay: 1700 },
    { text: '> Authentication layer ready... [OK]', delay: 2100 },
    { text: '> System ready. Welcome.', delay: 2500 },
  ];

  const container = document.getElementById('boot-lines');
  const bootScreen = document.getElementById('boot-screen');
  const mainContent = document.getElementById('main-content');

  bootLines.forEach(({ text, delay }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.textContent = text;
      container.appendChild(line);
    }, delay);
  });

  // Dismiss after last line + short pause
  const totalTime = bootLines[bootLines.length - 1].delay + 900;
  setTimeout(() => {
    bootScreen.classList.add('fade-out');
    mainContent.classList.add('visible');
    // Start stats counters once hero is revealed
    setTimeout(bootComplete, 400);
    // Kill boot screen from DOM after transition
    setTimeout(() => {
      bootScreen.style.display = 'none';
    }, 900);
  }, totalTime);
})();

function bootComplete() {
  document.querySelectorAll('.stat-value[data-target]').forEach(el => animateCount(el));
}

// ── 2. MATRIX RAIN ───────────────────────────────────────
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*<>/\\|{}[]ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ';
  const FONT_SIZE = 14;
  const GREEN = '#00ff41';

  let columns;
  let drops;

  function resize() {
    const section = document.getElementById('hero');
    canvas.width  = section.offsetWidth;
    canvas.height = section.offsetHeight;
    columns = Math.floor(canvas.width / FONT_SIZE);
    drops   = Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(8, 8, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = GREEN;
    ctx.font = FONT_SIZE + 'px "JetBrains Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(char, i * FONT_SIZE, drops[i] * FONT_SIZE);

      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 40);
})();

// ── 3. STATS COUNTERS ────────────────────────────────────
function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
// Counters are triggered by bootComplete(), defined later.

// ── 4. REVEAL ON SCROLL (generic) ────────────────────────
(function initScrollReveal() {
  // Timeline nodes
  document.querySelectorAll('.timeline-node').forEach(el => {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        el.classList.add('visible');
        obs.disconnect();
      }
    }, { threshold: 0.15 }).observe(el);
  });

  // Module cards — staggered
  const moduleCards = document.querySelectorAll('.module-card');
  moduleCards.forEach((card, i) => {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => card.classList.add('visible'), i * 60);
        obs.disconnect();
      }
    }, { threshold: 0.08 }).observe(card);
  });

  // Stack cards — staggered
  const stackCards = document.querySelectorAll('.stack-card');
  stackCards.forEach((card, i) => {
    new IntersectionObserver((entries, obs) => {
      if (entries[0].isIntersecting) {
        setTimeout(() => card.classList.add('visible'), i * 100);
        obs.disconnect();
      }
    }, { threshold: 0.1 }).observe(card);
  });
})();

// ── 5. SECURITY MANIFEST ─────────────────────────────────
(function initManifest() {
  const box   = document.getElementById('manifest-box');
  const lines = document.querySelectorAll('.manifest-line');
  let fired = false;

  if (!box) return;

  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      lines.forEach(line => {
        const delay = parseInt(line.dataset.delay || '0', 10);
        setTimeout(() => line.classList.add('visible'), delay);
      });
    }
  }, { threshold: 0.2 }).observe(box);
})();

// ── 6. ARCHITECTURE ACCORDION ────────────────────────────
(function initArchAccordion() {
  document.querySelectorAll('.arch-box').forEach(box => {
    box.addEventListener('click', () => {
      const isOpen = box.classList.contains('open');
      // Close all
      document.querySelectorAll('.arch-box').forEach(b => b.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) box.classList.add('open');
    });
  });
})();

// ── 7. SMOOTH NAV ACTIVE STATE ───────────────────────────
(function initNavHighlight() {
  const sections = document.querySelectorAll('#evolution, #architecture, #modules, #security, #stack');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href').slice(1);
          link.style.color = href === id ? 'var(--green)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
})();
