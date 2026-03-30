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
    const phrases = ['Moderne Websites', 'Snelle Webshops', 'SEO Succes', 'Maatwerk Code'];
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

});