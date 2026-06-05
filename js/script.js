document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LAAD HEADER & FOOTER
  ============================================================ */
  const loadComponents = async () => {
    const headerEl = document.getElementById('header-placeholder');
    const footerEl = document.getElementById('footer-placeholder');

    try {
      const [hRes, fRes] = await Promise.all([
        fetch('components/header.html'),
        fetch('components/footer.html')
      ]);
      if (!hRes.ok || !fRes.ok) throw new Error('Component niet gevonden');

      const [hHTML, fHTML] = await Promise.all([hRes.text(), fRes.text()]);
      if (headerEl) headerEl.innerHTML = hHTML;
      if (footerEl) footerEl.innerHTML = fHTML;

      setActiveNavLink();
      initMobileMenu();
      initStickyHeader();

      const yr = document.getElementById('footer-year');
      if (yr) yr.textContent = new Date().getFullYear();

    } catch (err) {
      console.error('Fout bij laden componenten:', err);
    }
  };

  loadComponents();


  /* ============================================================
     2. ACTIEVE NAV-LINK
     Vergelijkt het huidige bestandsnaam met data-page attribuut
  ============================================================ */
  const setActiveNavLink = () => {
    // Haal bestandsnaam op, strip .html, fallback naar 'index'
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '') || 'index';

    document.querySelectorAll('.nav__links a[data-page]').forEach(link => {
      const page = link.dataset.page;
      if (page === file) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  };


  /* ============================================================
     3. MOBIEL HAMBURGERMENU
  ============================================================ */
  const initMobileMenu = () => {
    const tryInit = (attempts = 0) => {
      const burger   = document.querySelector('.nav__burger');
      const overlay  = document.querySelector('.mobile-overlay');
      const closeBtn = document.querySelector('.mobile-overlay__close');
      const links    = document.querySelectorAll('.mobile-overlay a');

      if (!burger || !overlay) {
        if (attempts < 10) setTimeout(() => tryInit(attempts + 1), 50);
        return;
      }

      const open  = () => { overlay.classList.add('active');    burger.setAttribute('aria-expanded', 'true');  document.body.style.overflow = 'hidden'; };
      const close = () => { overlay.classList.remove('active'); burger.setAttribute('aria-expanded', 'false'); document.body.style.overflow = '';       };

      burger.addEventListener('click', open);
      if (closeBtn) closeBtn.addEventListener('click', close);
      links.forEach(l => l.addEventListener('click', close));
      overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    };
    tryInit();
  };



  /* ============================================================
     4. STICKY HEADER SCHADUW
  ============================================================ */
  const initStickyHeader = () => {
    const tryInit = (attempts = 0) => {
      const header = document.querySelector('header');
      if (!header) {
        if (attempts < 10) setTimeout(() => tryInit(attempts + 1), 50);
        return;
      }
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    };
    tryInit();
  };


  /* ============================================================
     5. REVEAL ON SCROLL
  ============================================================ */
  const initReveal = () => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
  };
  setTimeout(initReveal, 100);


  /* ============================================================
     6. TYPEWRITER EFFECT (alleen homepage)
  ============================================================ */
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const phrases = ['Moderne Websites', 'Sterke Logo’s', 'Converterende Landingspagina’s', 'SEO Succes', 'Website Redesigns', 'Maatwerk Code'];
    let i = 0, j = 0, deleting = false;
    const type = () => {
      const cur = phrases[i];
      twEl.textContent = deleting ? cur.substring(0, j - 1) : cur.substring(0, j + 1);
      deleting ? j-- : j++;
      if (!deleting && j === cur.length) { deleting = true; setTimeout(type, 1800); return; }
      if (deleting && j === 0)           { deleting = false; i = (i + 1) % phrases.length; }
      setTimeout(type, deleting ? 70 : 130);
    };
    type();
  }


  /* ============================================================
     7. COUNTER ANIMATIE (homepage stats)
  ============================================================ */
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const animate = el => {
      const target = parseFloat(el.dataset.count);
      const dec    = el.dataset.count.includes('.') ? 1 : 0;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = target / 60;
      const upd = () => {
        cur = Math.min(cur + step, target);
        el.textContent = (dec ? cur.toFixed(1) : Math.floor(cur)) + suffix;
        if (cur < target) requestAnimationFrame(upd);
      };
      requestAnimationFrame(upd);
    };
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); } });
    }, { threshold: 0.5 });
    counterEls.forEach(el => obs.observe(el));
  }


  /* ============================================================
     8. HOVER-TILT OP EXPERTISE-KAARTEN (3D effect)
  ============================================================ */
  const initCardTilt = () => {
    const cards = document.querySelectorAll('.exp-card');
    if (!cards.length) return;
    // Niet op touch-apparaten (geen muis)
    if (window.matchMedia('(hover: none)').matches) return;

    const MAX = 7; // max graden kanteling
    cards.forEach(card => {
      // Voeg glow-laag toe als die er nog niet is
      if (!card.querySelector('.exp-card__glow')) {
        const glow = document.createElement('span');
        glow.className = 'exp-card__glow';
        card.insertBefore(glow, card.firstChild);
      }
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;   // 0..1
        const py = (e.clientY - r.top) / r.height;   // 0..1
        const rx = (py - 0.5) * -2 * MAX;
        const ry = (px - 0.5) *  2 * MAX;
        card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        card.style.setProperty('--mx', (px * 100) + '%');
        card.style.setProperty('--my', (py * 100) + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  };
  setTimeout(initCardTilt, 200);


  /* ============================================================
     9. HERO-PODIUM — zachte glow volgt de cursor (lichtgewicht)
  ============================================================ */
  const initHeroStage = () => {
    const stage = document.getElementById('heroStage');
    const glow  = document.getElementById('heroGlow');
    if (!stage || !glow) return;
    if (window.matchMedia('(hover: none)').matches) return; // niet op touch
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 60;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 60;
      glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
    stage.addEventListener('pointerleave', () => {
      glow.style.transform = 'translate(-50%, -50%)';
    });
  };
  initHeroStage();

});