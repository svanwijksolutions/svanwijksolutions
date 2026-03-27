document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. LAAD HEADER & FOOTER VIA FETCH
  ============================================================ */
  const loadComponents = async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    try {
      const [headerRes, footerRes] = await Promise.all([
        fetch('components/header.html'),
        fetch('components/footer.html')
      ]);

      if (!headerRes.ok || !footerRes.ok) throw new Error('Component niet gevonden');

      const [headerHTML, footerHTML] = await Promise.all([
        headerRes.text(),
        footerRes.text()
      ]);

      if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
      if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

      // Activeer scripts nadat componenten zijn geladen
      setActiveNavLink();
      initMobileMenu();
      initStickyHeader();

      // Footer jaar (fallback als inline script in footer niet werkt)
      const yearEl = document.getElementById('footer-year');
      if (yearEl) yearEl.textContent = new Date().getFullYear();

    } catch (err) {
      console.error('Fout bij laden van componenten:', err);
    }
  };

  loadComponents();


  /* ============================================================
     2. ACTIEVE NAV-LINK MARKEREN
  ============================================================ */
  const setActiveNavLink = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav__links a:not(.nav__cta)');
    links.forEach(link => {
      const href = link.getAttribute('href').split('/').pop();
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  };


  /* ============================================================
     3. MOBIEL HAMBURGERMENU
  ============================================================ */
  const initMobileMenu = () => {
    // Fallback: wacht maximaal 500ms extra als elementen nog niet bestaan
    const tryInit = (attempts = 0) => {
      const burger  = document.querySelector('.nav__burger');
      const overlay = document.querySelector('.mobile-overlay');
      const closeBtn = document.querySelector('.mobile-overlay__close');
      const overlayLinks = document.querySelectorAll('.mobile-overlay a');

      if (!burger || !overlay) {
        if (attempts < 10) setTimeout(() => tryInit(attempts + 1), 50);
        return;
      }

      const openMenu = () => {
        overlay.classList.add('active');
        burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      };

      const closeMenu = () => {
        overlay.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      };

      burger.addEventListener('click', openMenu);
      if (closeBtn) closeBtn.addEventListener('click', closeMenu);

      overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

      // Sluit menu bij klik buiten overlay
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeMenu();
      });

      // Sluit menu bij Escape-toets
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });
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
     5. REVEAL ON SCROLL (INTERSECTION OBSERVER)
  ============================================================ */
  const initReveal = () => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => observer.observe(el));
  };

  // Kleine vertraging zodat pagina-inhoud zeker geladen is
  setTimeout(initReveal, 100);


  /* ============================================================
     6. TYPEWRITER EFFECT (alleen op homepage)
  ============================================================ */
  const twEl = document.getElementById('typewriter');
  if (twEl) {
    const phrases = ['Moderne Websites', 'Snelle Webshops', 'SEO Succes', 'Maatwerk Code'];
    let i = 0, j = 0, deleting = false;

    const type = () => {
      const cur = phrases[i];
      twEl.textContent = deleting
        ? cur.substring(0, j - 1)
        : cur.substring(0, j + 1);

      deleting ? j-- : j++;

      if (!deleting && j === cur.length) {
        deleting = true;
        setTimeout(type, 1800); // pauzeer voor wissen
        return;
      }
      if (deleting && j === 0) {
        deleting = false;
        i = (i + 1) % phrases.length;
      }
      setTimeout(type, deleting ? 70 : 130);
    };
    type();
  }


  /* ============================================================
     7. COUNTER ANIMATIE (alleen op homepage)
  ============================================================ */
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const animateCounter = (el) => {
      const target  = parseFloat(el.dataset.count);
      const dec     = el.dataset.count.includes('.') ? 1 : 0;
      const suffix  = el.dataset.suffix || '';
      let current   = 0;
      const step    = target / 60;

      const update = () => {
        current = Math.min(current + step, target);
        el.textContent = dec ? current.toFixed(1) + suffix : Math.floor(current) + suffix;
        if (current < target) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => obs.observe(el));
  }

});