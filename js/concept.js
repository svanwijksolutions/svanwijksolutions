document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('conceptForm');
  if (!form) return;

  var steps    = [document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3'), document.getElementById('step4')];
  var stepEls  = document.querySelectorAll('.concept-step');
  var current  = 0;

  /* ── Navigatie ── */
  function goTo(n) {
    steps[current].style.display = 'none';
    current = n;
    steps[current].style.display = 'block';
    stepEls.forEach(function (el, i) {
      el.classList.toggle('active',    i === current);
      el.classList.toggle('completed', i < current);
    });
    var top = document.querySelector('.concept-wrapper');
    if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  /* ── Validatie ── */
  function validateStep(n) {
    var ok = true;
    steps[n].querySelectorAll('[required]').forEach(function (el) {
      el.classList.remove('input-error');
      if (el.type === 'radio') {
        var checked = Array.from(form.querySelectorAll('[name="' + el.name + '"]')).some(function (r) { return r.checked; });
        if (!checked) { ok = false; form.querySelectorAll('[name="' + el.name + '"]').forEach(function (r) { var b = r.closest('.type-btn'); if (b) b.classList.add('type-btn--error'); }); }
      } else if (el.type === 'checkbox') {
        if (!el.checked) { ok = false; var lbl = el.closest('.checkbox-label'); if (lbl) lbl.classList.add('checkbox-error'); }
      } else if (!el.value.trim()) {
        el.classList.add('input-error'); ok = false;
      }
    });
    if (!ok) { var e = steps[n].querySelector('.input-error,.type-btn--error,.checkbox-error'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    return ok;
  }

  /* ── Navigatieknoppen ── */
  document.getElementById('step1Next').addEventListener('click', function () { if (validateStep(0)) goTo(1); });
  document.getElementById('step2Next').addEventListener('click', function () { if (validateStep(1)) goTo(2); });
  document.getElementById('step3Next').addEventListener('click', function () { goTo(3); });
  document.getElementById('step2Back').addEventListener('click', function () { goTo(0); });
  document.getElementById('step3Back').addEventListener('click', function () { goTo(1); });
  document.getElementById('step4Back').addEventListener('click', function () { goTo(2); });

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input',  function () { el.classList.remove('input-error'); });
    el.addEventListener('change', function () { el.classList.remove('input-error'); });
  });

  /* ── Project type → URL veld + logo-optie ── */
  var urlWrap       = document.getElementById('huidigeUrlWrap');
  var logoOptieWrap = document.getElementById('logo-optie-wrap');
  var logoNaam      = document.getElementById('logoNaamPreview');
  var bedrijfInput  = document.getElementById('c-bedrijf');

  form.querySelectorAll('[name="project_type"]').forEach(function (btn) {
    btn.addEventListener('change', function () {
      if (urlWrap)       urlWrap.style.display       = (btn.value === 'redesign') ? 'block' : 'none';
      if (logoOptieWrap) logoOptieWrap.style.display  = (btn.value === 'nieuwe-website') ? 'block' : 'none';
      if (logoNaam && bedrijfInput) logoNaam.textContent = bedrijfInput.value.trim() || '(nog niet ingevuld)';
      form.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('type-btn--error'); });
    });
  });

  if (bedrijfInput && logoNaam) bedrijfInput.addEventListener('input', function () {
    logoNaam.textContent = bedrijfInput.value.trim() || '(nog niet ingevuld)';
  });

  var logoOptieCheck = document.getElementById('logoOptie');
  var logoStijlWrap  = document.getElementById('logoStijlWrap');
  if (logoOptieCheck && logoStijlWrap) logoOptieCheck.addEventListener('change', function () {
    logoStijlWrap.style.display = logoOptieCheck.checked ? 'block' : 'none';
    calcPrijs();
  });

  /* ── Logo stijl chips ── */
  function initChips(containerId, hiddenId) {
    var container = document.getElementById(containerId);
    var hidden    = document.getElementById(hiddenId);
    if (!container || !hidden) return;
    var selected = [];
    container.querySelectorAll('.logo-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.dataset.waarde;
        var idx = selected.indexOf(val);
        if (idx === -1) { selected.push(val); btn.classList.add('logo-chip--active'); }
        else            { selected.splice(idx, 1); btn.classList.remove('logo-chip--active'); }
        hidden.value = selected.join(', ');
      });
    });
  }
  initChips('logoStijlChips',  'logoStijlChipsHidden');
  initChips('logoKleurChips',  'logoKleurChipsHidden');

  /* ── Social media toggle op contactpagina ── */
  var socialCheck     = document.getElementById('socialCheck');
  var socialLinksWrap = document.getElementById('socialLinksWrap');
  if (socialCheck && socialLinksWrap) {
    socialCheck.addEventListener('change', function () {
      socialLinksWrap.style.display = socialCheck.checked ? 'block' : 'none';
    });
  }

  document.getElementById('privacyCheck').addEventListener('change', function () {
    var lbl = this.closest('.checkbox-label'); if (lbl) lbl.classList.remove('checkbox-error');
  });

  /* ── Pagina accordeon ── */
  document.querySelectorAll('.pagina-item__toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item   = btn.closest('.pagina-item');
      var detail = item.querySelector('.pagina-item__detail');
      var open   = detail.style.display !== 'none';
      detail.style.display = open ? 'none' : 'block';
      btn.textContent      = open ? '▾' : '▴';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  // Checkbox pagina → open detail automatisch
  document.querySelectorAll('.pagina-check').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var item   = cb.closest('.pagina-item');
      var detail = item.querySelector('.pagina-item__detail');
      var btn    = item.querySelector('.pagina-item__toggle');
      if (cb.checked) {
        detail.style.display = 'block';
        if (btn) { btn.textContent = '▴'; btn.setAttribute('aria-expanded', 'true'); }
      }
    });
  });

  /* ── Talen systeem ── */
  var taalTags     = document.getElementById('taalTags');
  var taalDropdown = document.getElementById('taalDropdown');
  var taalEigen    = document.getElementById('taalEigen');
  var taalEigenAdd = document.getElementById('taalEigenAdd');
  var hiddenTalen  = document.getElementById('hiddenTalen');
  var gekozenTalen = ['Nederlands'];

  function renderTaalTags() {
    // Verwijder alle behalve de fixed NL tag
    Array.from(taalTags.querySelectorAll('.taal-tag:not(.taal-tag--fixed)')).forEach(function (t) { t.remove(); });
    gekozenTalen.forEach(function (taal) {
      if (taal === 'Nederlands') return;
      var tag = document.createElement('span');
      tag.className = 'taal-tag';
      tag.innerHTML = taal + ' <button type="button" class="taal-tag__remove" aria-label="Verwijder ' + taal + '">×</button>';
      tag.querySelector('.taal-tag__remove').addEventListener('click', function () {
        gekozenTalen = gekozenTalen.filter(function (t) { return t !== taal; });
        renderTaalTags(); updateHiddenTalen();
      });
      taalTags.appendChild(tag);
    });
  }

  function updateHiddenTalen() {
    if (hiddenTalen) hiddenTalen.value = gekozenTalen.join(', ');
  }

  function voegTaalToe(taal) {
    taal = taal.trim();
    if (!taal || gekozenTalen.indexOf(taal) !== -1) return;
    gekozenTalen.push(taal);
    renderTaalTags();
    updateHiddenTalen();
  }

  taalDropdown.addEventListener('change', function () {
    if (this.value) { voegTaalToe(this.value); this.value = ''; }
  });

  taalEigenAdd.addEventListener('click', function () {
    voegTaalToe(taalEigen.value);
    taalEigen.value = '';
  });

  taalEigen.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); voegTaalToe(taalEigen.value); taalEigen.value = ''; }
  });

  /* ── Prijscalculator (alleen zichtbaar op stap 4) ── */
  var BASE     = 649.95;
  var PER_PAGE = 85;

  function fmt(n) { return '€' + n.toFixed(2).replace('.', ','); }

  function calcPrijs() {
    var pages  = document.querySelectorAll('.pagina-check:checked').length || 1;
    var once   = BASE + Math.max(0, pages - 1) * PER_PAGE;
    form.querySelectorAll('.price-option:checked').forEach(function (opt) {
      once += parseFloat(opt.dataset.price) || 0;
    });
    var el = document.getElementById('priceDisplay');
    if (el) el.textContent = fmt(once);
    var hidden = document.getElementById('hiddenPriceOnce');
    if (hidden) hidden.value = fmt(once);
    // hidden pagina's
    var paginasSelected = Array.from(document.querySelectorAll('.pagina-check:checked')).map(function(c){ return c.value; });
    var hp = document.getElementById('hiddenPages');
    if (hp) hp.value = paginasSelected.join(', ');
  }

  document.querySelectorAll('.pagina-check').forEach(function (cb) {
    cb.addEventListener('change', calcPrijs);
  });
  document.querySelectorAll('.price-option').forEach(function (el) {
    el.addEventListener('change', calcPrijs);
  });
  calcPrijs();

  /* Bestandsuploads vervangen door linksvelden — geen JS nodig */

  /* ── Formulier submit + success animatie ── */
  var successOverlay = document.getElementById('successOverlay');
  var successClose   = document.getElementById('successClose');

  function launchRockets() {
    var container = document.getElementById('successRockets');
    if (!container) return;
    var emojis = ['🚀','🎉','✨','🌟','💫','🎊'];
    for (var i = 0; i < 18; i++) {
      (function (i) {
        setTimeout(function () {
          var el = document.createElement('span');
          el.className = 'rocket-particle';
          el.textContent = emojis[i % emojis.length];
          el.style.left = Math.random() * 100 + '%';
          el.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
          el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
          container.appendChild(el);
          setTimeout(function () { el.remove(); }, 1800);
        }, i * 80);
      })(i);
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var honey = form.querySelector('[name="_gotcha"]');
    if (honey && honey.value) return;

    var btn = document.getElementById('submitBtn');
    var orig = btn.textContent;
    btn.textContent = 'Verzenden…';
    btn.disabled = true;

    try {
      var res = await fetch(form.action, {
        method:  'POST',
        body:    new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Verberg het formulier en de stappen-balk, toon bedankt-paneel
        form.style.display = 'none';
        var stepsBar = document.querySelector('.concept-steps');
        if (stepsBar) stepsBar.style.display = 'none';
        var bedankt = document.getElementById('conceptBedankt');
        if (bedankt) bedankt.style.display = 'block';
        // Toon overlay-animatie erbovenop
        successOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        setTimeout(function () {
          document.getElementById('successIcon').classList.add('animate');
          launchRockets();
        }, 100);
        // Scroll naar boven zodat het bedankt-bericht in beeld komt
        var top = document.querySelector('.concept-wrapper');
        if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
        form.reset();
        gekozenTalen = ['Nederlands'];
        renderTaalTags();
        updateHiddenTalen();

      } else {
        alert('Er ging iets mis. Probeer het opnieuw of mail ons op info@svanwijksolutions.nl');
      }
    } catch (err) {
      alert('Geen verbinding. Controleer je internet en probeer het opnieuw.');
    } finally {
      btn.textContent = orig;
      btn.disabled = false;
    }
  });

  function closeOverlay() {
    successOverlay.classList.remove('show');
    document.body.style.overflow = '';
    successOverlay.classList.remove('animate');
  }
  if (successClose) successClose.addEventListener('click', closeOverlay);
  successOverlay.addEventListener('click', function (e) { if (e.target === successOverlay) closeOverlay(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

});