/* ============================================================
   GRATIS CONCEPT FORMULIER — S. van Wijk Solutions
   - Bedrijfstype zoekbalk met autocomplete
   - Paginavoorstel per branche (aangevinkt + reden)
   - Talen (uitgebreid + eigen invoer)
   - Kleuren (color picker + hex + EyeDropper)
   - Pakketten (dynamisch toevoegen)
   - Formspree submit met nette opmaak
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var form = document.getElementById('conceptForm');
  if (!form) return;

  /* ─────────────────────────────────────────────
     BRANCHE DATA — type + voorgestelde pagina's
     paginas = interne id's (zie PAGINA_FORM_ID)
  ───────────────────────────────────────────── */
  var BRANCHES = [
    { naam: 'Kapper / Barbershop', cat: 'Beauty en verzorging', paginas: ['home','overons','behandelingen','prijzen','reviews','contact'], reden: 'Voor een kapper draait alles om je behandelingen, tarieven en een makkelijke manier om een afspraak te maken. Reviews geven nieuwe klanten net dat extra zetje.' },
    { naam: 'Schoonheidsspecialist', cat: 'Beauty en verzorging', paginas: ['home','overons','behandelingen','prijzen','reviews','contact'], reden: 'Behandelingen, voor-en-na resultaten en een duidelijke prijslijst zijn onmisbaar. Reviews van tevreden klanten geven de doorslag.' },
    { naam: 'Nagelstudio', cat: 'Beauty en verzorging', paginas: ['home','overons','behandelingen','prijzen','portfolio','contact'], reden: 'Een portfolio met sfeervolle foto\u2019s van je werk trekt klanten aan. Behandelingen en prijzen maken meteen duidelijk wat iemand kan verwachten.' },
    { naam: 'Massagepraktijk', cat: 'Beauty en verzorging', paginas: ['home','overons','behandelingen','prijzen','reviews','contact'], reden: 'Vertrouwen staat centraal. Een persoonlijke over-ons, je behandelingen en klantreviews zijn samen het fundament van de site.' },
    { naam: 'Fysiotherapeut', cat: 'Gezondheid en zorg', paginas: ['home','overons','diensten','behandelingen','faq','contact'], reden: 'Pati\u00ebnten willen weten met wie ze te maken krijgen en wat een behandeling inhoudt. Een FAQ neemt twijfels alvast weg voor het eerste contact.' },
    { naam: 'Huisarts / praktijk', cat: 'Gezondheid en zorg', paginas: ['home','overons','diensten','faq','contact'], reden: 'Praktische informatie staat voorop: openingstijden, welke zorg je biedt en hoe iemand een afspraak maakt. Een FAQ scheelt veel telefoontjes.' },
    { naam: 'Tandarts', cat: 'Gezondheid en zorg', paginas: ['home','overons','behandelingen','prijzen','faq','contact'], reden: 'Behandelingen en tarieven nemen onzekerheid weg. Een FAQ over kosten en procedures helpt nieuwe pati\u00ebnten over de drempel.' },
    { naam: 'Psycholoog / therapeut', cat: 'Gezondheid en zorg', paginas: ['home','overons','diensten','faq','contact'], reden: 'Herkenning en vertrouwen zijn cruciaal. Een persoonlijke over-ons en een heldere uitleg van je aanpak vormen de kern.' },
    { naam: 'Di\u00ebtist / voedingscoach', cat: 'Gezondheid en zorg', paginas: ['home','overons','diensten','prijzen','reviews','contact'], reden: 'Mensen zoeken resultaat en begeleiding. Je aanpak, pakketten en ervaringen van eerdere cli\u00ebnten overtuigen het beste.' },
    { naam: 'Coach / lifecoach', cat: 'Coaching en advies', paginas: ['home','overons','diensten','prijzen','reviews','contact'], reden: 'Als coach verkoop je vertrouwen. Een sterke over-ons, jouw aanpak en klantreviews zijn het hart van de site.' },
    { naam: 'Business coach', cat: 'Coaching en advies', paginas: ['home','overons','diensten','portfolio','prijzen','contact'], reden: 'Resultaten spreken. Cases en een duidelijk aanbod met pakketten geven bedrijven het vertrouwen om contact op te nemen.' },
    { naam: 'Loopbaancoach', cat: 'Coaching en advies', paginas: ['home','overons','diensten','prijzen','reviews','faq','contact'], reden: 'Mensen in een carri\u00e8reswitch zoeken houvast. Een heldere aanpak, pakketten en veelgestelde vragen nemen twijfel weg.' },
    { naam: 'Consultant / adviseur', cat: 'Coaching en advies', paginas: ['home','overons','diensten','portfolio','blog','contact'], reden: 'Expertise tonen is alles. Cases en een kennisblog positioneren je als autoriteit in je vakgebied.' },
    { naam: 'Loodgieter', cat: 'Technische dienstverlening', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Wie een loodgieter zoekt heeft vaak snel iemand nodig. Duidelijke diensten, goede bereikbaarheid en reviews zijn doorslaggevend.' },
    { naam: 'Elektricien', cat: 'Technische dienstverlening', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Betrouwbaarheid uitstralen via eerder werk en reviews. Je diensten en contactgegevens moeten meteen duidelijk zijn.' },
    { naam: 'Schilder', cat: 'Technische dienstverlening', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Foto\u2019s van eerder werk zijn je sterkste verkoopargument. Een portfolio in combinatie met reviews levert aanvragen op.' },
    { naam: 'Klusbedrijf / handyman', cat: 'Technische dienstverlening', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Laat via een portfolio zien wat je allemaal kunt. Reviews maken duidelijk dat je afspraken nakomt.' },
    { naam: 'Aannemer / bouwbedrijf', cat: 'Bouw en renovatie', paginas: ['home','overons','diensten','portfolio','reviews','vacatures','contact'], reden: 'Bouwbedrijven leven van referenties. Een uitgebreid portfolio, reviews en openstaande vacatures maken het beeld compleet.' },
    { naam: 'Dakdekker', cat: 'Bouw en renovatie', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Portfolio en reviews geven huiseigenaren de zekerheid die ze zoeken voor zo\u2019n grote investering.' },
    { naam: 'Installatiebedrijf', cat: 'Bouw en renovatie', paginas: ['home','overons','diensten','portfolio','faq','contact'], reden: 'Uitleg over je werkgebied en diensten, samen met een FAQ over garanties en processen, wekt vertrouwen.' },
    { naam: 'Stukadoor / tegelzetter', cat: 'Bouw en renovatie', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Vakmanschap zie je pas als je het toont. Een portfolio met strak afgewerkt werk overtuigt direct.' },
    { naam: 'Hovenier / tuinman', cat: 'Groen en buitenruimte', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Mooie foto\u2019s van tuinen die je hebt aangelegd zijn je beste visitekaartje. Diensten en reviews doen de rest.' },
    { naam: 'Schoonmaakbedrijf', cat: 'Dienstverlening', paginas: ['home','overons','diensten','prijzen','reviews','contact'], reden: 'Betrouwbaarheid staat centraal. Duidelijke diensten, transparante tarieven en reviews geven nieuwe klanten vertrouwen.' },
    { naam: 'Beveiligingsbedrijf', cat: 'Dienstverlening', paginas: ['home','overons','diensten','portfolio','faq','contact'], reden: 'Klanten willen zekerheid. Uitleg over je diensten, referenties en antwoorden op veelgestelde vragen zijn essentieel.' },
    { naam: 'Restaurant / eetcafe', cat: 'Horeca', paginas: ['home','overons','behandelingen','reviews','contact'], reden: 'Een overzichtelijke kaart, sfeerbeelden en de mogelijkheid om te reserveren vormen het hart van een horecasite. Reviews trekken nieuwe gasten aan.' },
    { naam: 'Bakkerij', cat: 'Horeca en food', paginas: ['home','overons','behandelingen','portfolio','contact'], reden: 'Foto\u2019s van je producten en een duidelijk aanbod trekken klanten binnen. Voor een ambachtelijke bakkerij is het verhaal achter het bedrijf goud waard.' },
    { naam: 'Catering', cat: 'Horeca en food', paginas: ['home','overons','diensten','portfolio','prijzen','reviews','contact'], reden: 'Arrangementen met foto\u2019s, pakketten en referenties van eerdere events geven opdrachtgevers het vertrouwen om te boeken.' },
    { naam: 'Advocatenkantoor', cat: 'Juridisch en financieel', paginas: ['home','overons','diensten','blog','faq','contact'], reden: 'Expertise en betrouwbaarheid uitstralen via duidelijke vakgebieden, een kennisblog en een FAQ. Persoonlijke aanpak spreekt mensen aan.' },
    { naam: 'Accountant / boekhouder', cat: 'Juridisch en financieel', paginas: ['home','overons','diensten','blog','faq','contact'], reden: 'Ondernemers zoeken iemand die hen begrijpt. Diensten, een blog met kennis en een FAQ nemen drempels weg.' },
    { naam: 'Verzekeringsadviseur', cat: 'Juridisch en financieel', paginas: ['home','overons','diensten','faq','reviews','contact'], reden: 'Vertrouwen en duidelijkheid zijn alles. Een heldere uitleg van je diensten en een FAQ helpen twijfels wegnemen.' },
    { naam: 'Makelaar', cat: 'Vastgoed', paginas: ['home','overons','diensten','portfolio','blog','reviews','contact'], reden: 'Woningen als portfolio, marktinzicht via een blog en persoonlijkheid via over-ons zijn de pijlers van een sterke makelaarssite.' },
    { naam: 'Architectenbureau', cat: 'Ontwerp en creatief', paginas: ['home','overons','portfolio','diensten','blog','contact'], reden: 'Portfolio is alles voor een architect. Laat je werk spreken, ondersteund door je visie en een selectie diensten.' },
    { naam: 'Grafisch ontwerper', cat: 'Ontwerp en creatief', paginas: ['home','overons','portfolio','diensten','prijzen','contact'], reden: 'Je portfolio is je cv. Aanvullen met een helder dienstenoverzicht en transparante tarieven maakt de keuze makkelijk.' },
    { naam: 'Fotograaf', cat: 'Ontwerp en creatief', paginas: ['home','overons','portfolio','behandelingen','prijzen','reviews','contact'], reden: 'Beelden overtuigen. Een sterk portfolio per specialisatie, pakketten en reviews trekken de juiste klanten aan.' },
    { naam: 'Videograaf', cat: 'Ontwerp en creatief', paginas: ['home','overons','portfolio','diensten','prijzen','contact'], reden: 'Je werk tonen spreekt voor zich. Een duidelijk aanbod en een selectie eerdere projecten zijn genoeg om te overtuigen.' },
    { naam: 'Webdesigner / developer', cat: 'IT en technologie', paginas: ['home','overons','portfolio','diensten','blog','contact'], reden: 'Laat zien wat je kunt via een portfolio. Een blog over vakkennis positioneert je als expert en trekt organisch bezoekers.' },
    { naam: 'IT-bedrijf', cat: 'IT en technologie', paginas: ['home','overons','diensten','portfolio','blog','faq','contact'], reden: 'Techniek uitleggen in begrijpelijke taal is een kunst. Een FAQ en blog helpen klanten over de drempel.' },
    { naam: 'Sportschool / gym', cat: 'Sport en gezondheid', paginas: ['home','overons','behandelingen','prijzen','reviews','vacatures','contact'], reden: 'Lidmaatschappen, een overzicht van lessen en openingstijden vormen de kern. Reviews en vacatures maken het compleet.' },
    { naam: 'Personal trainer', cat: 'Sport en gezondheid', paginas: ['home','overons','diensten','prijzen','reviews','contact'], reden: 'Vertrouwen en resultaat tonen. Je aanpak, pakketten en klantresultaten via reviews zijn de sterkste overtuigers.' },
    { naam: 'Yoga / pilates studio', cat: 'Sport en gezondheid', paginas: ['home','overons','behandelingen','prijzen','reviews','contact'], reden: 'Rust en sfeer uitstralen. Een duidelijk rooster, lessen en tarieven samen met reviews trekken nieuwe leden aan.' },
    { naam: 'Kinderopvang', cat: 'Onderwijs en opvang', paginas: ['home','overons','diensten','prijzen','faq','vacatures','contact'], reden: 'Ouders willen weten wie er voor hun kind zorgt. Een warme over-ons, uitleg over de opvang, tarieven en een FAQ zijn essentieel.' },
    { naam: 'Evenementenbureau', cat: 'Evenementen', paginas: ['home','overons','diensten','portfolio','prijzen','reviews','contact'], reden: 'Cases van eerdere events zijn je sterkste verkoopargument. Diensten en pakketten maken het aanbod concreet.' },
    { naam: 'Trouwfotograaf', cat: 'Fotografie en evenementen', paginas: ['home','overons','portfolio','behandelingen','prijzen','reviews','contact'], reden: 'Koppels kiezen op gevoel en stijl. Een sterk portfolio, pakketten en reviews van eerdere bruidsparen zijn onmisbaar.' },
    { naam: 'Dierenarts / kliniek', cat: 'Dieren en natuur', paginas: ['home','overons','diensten','faq','vacatures','contact'], reden: 'Diereneigenaren willen snel weten welke zorg je biedt en hoe ze een afspraak maken. Een FAQ scheelt veel vragen.' },
    { naam: 'Dierenpension / trimsalon', cat: 'Dieren en natuur', paginas: ['home','overons','diensten','prijzen','reviews','contact'], reden: 'Vertrouwen is alles als iemand hun huisdier achterlaat. Sfeerbeelden, tarieven en reviews van tevreden baasjes geven zekerheid.' },
    { naam: 'Transportbedrijf', cat: 'Transport en logistiek', paginas: ['home','overons','diensten','reviews','vacatures','contact'], reden: 'Betrouwbaarheid en capaciteit uitstralen. Diensten, openstaande chauffeursvacatures en reviews zijn de kern.' },
    { naam: 'Verhuisbedrijf', cat: 'Transport en logistiek', paginas: ['home','overons','diensten','prijzen','reviews','contact'], reden: 'Mensen vergelijken actief. Duidelijke tarieven, diensten en veel reviews geven de doorslag.' },
    { naam: 'Autogarage / dealer', cat: 'Auto en mobiliteit', paginas: ['home','overons','diensten','portfolio','reviews','contact'], reden: 'Laat je diensten en occasions zien. Reviews over eerlijkheid en vakwerk overtuigen nieuwe klanten.' },
    { naam: 'Rijschool', cat: 'Onderwijs en opvang', paginas: ['home','overons','diensten','prijzen','reviews','faq','contact'], reden: 'Leerlingen vergelijken op slagingspercentage en prijs. Pakketten, reviews en een FAQ over het traject overtuigen het beste.' },
    { naam: 'Webshop / retail', cat: 'Retail en e-commerce', paginas: ['home','overons','behandelingen','reviews','faq','contact'], reden: 'Producten helder presenteren, vertrouwen wekken met reviews en veelgestelde vragen over levering en retour beantwoorden.' },
    { naam: 'Reisorganisatie', cat: 'Reizen en toerisme', paginas: ['home','overons','behandelingen','portfolio','reviews','blog','contact'], reden: 'Je verkoopt dromen. Mooie reisverhalen, bestemmingen als portfolio en ervaringen van reizigers maken je site onweerstaanbaar.' }
  ];

  /* Vlagcodes per taal (flagcdn) */
  var TAAL_VLAG = {
    'Engels':'gb','Duits':'de','Frans':'fr','Spaans':'es','Italiaans':'it','Portugees':'pt',
    'Pools':'pl','Turks':'tr','Arabisch':'sa','Chinees':'cn','Russisch':'ru','Oekraiens':'ua',
    'Grieks':'gr','Zweeds':'se','Noors':'no','Deens':'dk','Fins':'fi','Japans':'jp','Koreaans':'kr',
    'Hindi':'in','Roemeens':'ro','Hongaars':'hu','Tsjechisch':'cz','Slowaaks':'sk','Bulgaars':'bg',
    'Kroatisch':'hr','Servisch':'rs','Vietnamees':'vn','Thai':'th','Indonesisch':'id','Maleis':'my',
    'Hebreeuws':'il','Swahili':'ke'
  };

  var PAGINA_LABELS = {
    home:'Homepagina', overons:'Over ons', diensten:'Diensten', behandelingen:'Behandelingen/aanbod',
    portfolio:'Portfolio', prijzen:'Prijzen', blog:'Blog', faq:'FAQ', reviews:'Reviews', vacatures:'Vacatures', contact:'Contact'
  };
  var PAGINA_FORM_ID = {
    home:'pi-home', overons:'pi-overons', diensten:'pi-diensten', behandelingen:'pi-behandelingen',
    portfolio:'pi-portfolio', prijzen:'pi-prijzen', blog:'pi-blog', faq:'pi-faq', reviews:'pi-reviews',
    vacatures:'pi-vacatures', contact:'pi-contact'
  };

  /* ── DOM refs ── */
  var steps        = [document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3')];
  var stepEls      = document.querySelectorAll('.concept-step');
  var current      = 0;
  var gekozenTalen = ['Nederlands'];
  var pakketTeller = 0;

  /* ── Stap navigatie ── */
  function goTo(n) {
    steps[current].style.display = 'none';
    current = n;
    steps[current].style.display = 'block';
    stepEls.forEach(function (el, i) {
      el.classList.toggle('active',    i === current);
      el.classList.toggle('completed', i < current);
    });
    var wrap = document.querySelector('.concept-wrapper');
    if (wrap) window.scrollTo({ top: wrap.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  /* ── Validatie ── */
  function validateStep(n) {
    var ok = true;
    steps[n].querySelectorAll('[required]').forEach(function (el) {
      el.classList.remove('input-error');
      if (el.type === 'radio') {
        var checked = Array.from(form.querySelectorAll('[name="' + el.name + '"]')).some(function (r) { return r.checked; });
        if (!checked) {
          ok = false;
          form.querySelectorAll('[name="' + el.name + '"]').forEach(function (r) {
            var b = r.closest('.type-btn'); if (b) b.classList.add('type-btn--error');
          });
        }
      } else if (el.type === 'checkbox') {
        if (!el.checked) { ok = false; var lbl = el.closest('.checkbox-label'); if (lbl) lbl.classList.add('checkbox-error'); }
      } else if (!el.value.trim()) {
        el.classList.add('input-error'); ok = false;
      }
    });
    if (n === 0) {
      var hid = document.getElementById('hiddenBranche');
      if (!hid || !hid.value.trim()) {
        var zoek = document.getElementById('brancheZoek');
        if (zoek) { zoek.classList.add('input-error'); ok = false; }
      }
    }
    if (!ok) {
      var first = steps[n].querySelector('.input-error,.type-btn--error,.checkbox-error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  document.getElementById('step1Next').addEventListener('click', function () { if (validateStep(0)) goTo(1); });
  document.getElementById('step2Next').addEventListener('click', function () { if (validateStep(1)) goTo(2); });
  document.getElementById('step2Back').addEventListener('click', function () { goTo(0); });
  document.getElementById('step3Back').addEventListener('click', function () { goTo(1); });

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input',  function () { el.classList.remove('input-error'); });
    el.addEventListener('change', function () { el.classList.remove('input-error'); });
  });

  /* ─────────────────────────────────────────────
     BRANCHE ZOEKBALK
  ───────────────────────────────────────────── */
  var zoekInput      = document.getElementById('brancheZoek');
  var sugList        = document.getElementById('brancheSuggestions');
  var clearBtn       = document.getElementById('brancheClear');
  var tagWrap        = document.getElementById('brancheTagWrap');
  var hiddenBranche  = document.getElementById('hiddenBranche');
  var focusedIndex   = -1;

  function normaliseer(s) {
    return s.toLowerCase()
      .replace(/[\u00e0-\u00e6]/g,'a').replace(/[\u00e8-\u00eb]/g,'e')
      .replace(/[\u00ec-\u00ef]/g,'i').replace(/[\u00f2-\u00f6]/g,'o')
      .replace(/[\u00f9-\u00fc]/g,'u').replace(/[^a-z0-9 ]/g,'');
  }

  function showSuggestions(q) {
    sugList.innerHTML = '';
    focusedIndex = -1;
    if (!q || !q.trim()) { sugList.style.display = 'none'; return; }
    var nq = normaliseer(q);
    var results = BRANCHES.filter(function (b) {
      return normaliseer(b.naam).indexOf(nq) !== -1 || normaliseer(b.cat).indexOf(nq) !== -1;
    }).slice(0, 8);

    if (results.length === 0) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = 'Gebruik "<strong>' + q.trim() + '</strong>" als bedrijfstype';
      li.addEventListener('click', function () {
        kiesBranche({ naam: q.trim(), paginas: ['home','overons','diensten','contact'], reden: null });
      });
      sugList.appendChild(li);
      sugList.style.display = 'block';
      return;
    }
    results.forEach(function (b) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = b.naam + '<span class="sug-cat">' + b.cat + '</span>';
      li.addEventListener('click', function () { kiesBranche(b); });
      sugList.appendChild(li);
    });
    sugList.style.display = 'block';
  }

  function kiesBranche(b) {
    hiddenBranche.value = b.naam;
    zoekInput.value = '';
    sugList.style.display = 'none';
    clearBtn.style.display = 'none';
    zoekInput.classList.remove('input-error');

    tagWrap.innerHTML = '';
    var tag = document.createElement('span');
    tag.className = 'branche-tag';
    tag.innerHTML = b.naam + ' <button type="button" aria-label="Wijzig bedrijfstype">\u2715</button>';
    tag.querySelector('button').addEventListener('click', function () {
      hiddenBranche.value = '';
      tagWrap.innerHTML = '';
      resetPaginaVoorstel();
      zoekInput.focus();
    });
    tagWrap.appendChild(tag);

    laadPaginaVoorstel(b);
  }

  zoekInput.addEventListener('input', function () {
    clearBtn.style.display = this.value ? 'block' : 'none';
    showSuggestions(this.value);
  });
  zoekInput.addEventListener('keydown', function (e) {
    var items = sugList.querySelectorAll('li');
    if (e.key === 'ArrowDown') {
      e.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
      items.forEach(function (li, i) { li.classList.toggle('focused', i === focusedIndex); if (i === focusedIndex) li.scrollIntoView({ block: 'nearest' }); });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0);
      items.forEach(function (li, i) { li.classList.toggle('focused', i === focusedIndex); });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && items[focusedIndex]) items[focusedIndex].click();
      else if (this.value.trim()) kiesBranche({ naam: this.value.trim(), paginas: ['home','overons','diensten','contact'], reden: null });
    } else if (e.key === 'Escape') { sugList.style.display = 'none'; }
  });
  clearBtn.addEventListener('click', function () {
    zoekInput.value = ''; clearBtn.style.display = 'none'; sugList.style.display = 'none'; zoekInput.focus();
  });
  document.addEventListener('click', function (e) {
    if (!zoekInput.contains(e.target) && !sugList.contains(e.target)) sugList.style.display = 'none';
  });

  /* ── Paginavoorstel ── */
  function laadPaginaVoorstel(b) {
    var banner = document.getElementById('paginaVoorstelBanner');
    var tekst  = document.getElementById('paginaVoorstelTekst');
    var namen  = b.paginas.map(function (id) { return PAGINA_LABELS[id] || id; });

    if (b.reden) {
      tekst.innerHTML = '<strong>Ons voorstel voor ' + b.naam + ':</strong> ' + b.reden +
        ' Wij hebben deze pagina\u2019s vast voor je aangevinkt: <strong>' + namen.join(', ') +
        '</strong>. Je kunt alles aanpassen naar wat bij jou past.';
    } else {
      tekst.innerHTML = '<strong>Bedrijfstype: ' + b.naam + '.</strong> Hieronder staan de meest gebruikelijke pagina\u2019s. ' +
        'We hebben een logische basis aangevinkt \u2014 pas het gerust aan naar jouw wensen.';
    }
    banner.classList.add('visible');

    document.querySelectorAll('.pagina-item').forEach(function (item) {
      if (item.id === 'pi-anders') return;
      var cb    = item.querySelector('.pagina-check');
      var why   = item.querySelector('.pagina-item__why');
      var badge = item.querySelector('.pagina-item__badge');
      if (cb) cb.checked = false;
      item.classList.remove('is-recommended');
      if (why) { why.style.display = 'none'; }
      if (badge && item.id !== 'pi-anders') { badge.textContent = 'Optioneel'; badge.className = 'pagina-item__badge'; }
    });

    b.paginas.forEach(function (pid) {
      var formId = PAGINA_FORM_ID[pid];
      if (!formId) return;
      var item = document.getElementById(formId);
      if (!item) return;
      var cb    = item.querySelector('.pagina-check');
      var why   = item.querySelector('.pagina-item__why');
      var badge = item.querySelector('.pagina-item__badge');
      if (cb) cb.checked = true;
      item.classList.add('is-recommended');
      if (why) why.style.display = 'block';
      if (badge) { badge.textContent = 'Aanbevolen'; badge.className = 'pagina-item__badge badge-aanbevolen'; }
    });

    calcPrijs();
    updateHiddenPages();
  }

  function resetPaginaVoorstel() {
    var banner = document.getElementById('paginaVoorstelBanner');
    banner.classList.remove('visible');
    document.querySelectorAll('.pagina-item').forEach(function (item) {
      if (item.id === 'pi-anders') return;
      var cb    = item.querySelector('.pagina-check');
      var why   = item.querySelector('.pagina-item__why');
      var badge = item.querySelector('.pagina-item__badge');
      item.classList.remove('is-recommended');
      if (cb) cb.checked = (item.id === 'pi-home');
      if (item.id === 'pi-home') { item.classList.add('is-recommended'); if (why) why.style.display = 'block'; if (badge) { badge.textContent = 'Aanbevolen'; badge.className = 'pagina-item__badge badge-aanbevolen'; } }
      else { if (why) why.style.display = 'none'; if (badge) { badge.textContent = 'Optioneel'; badge.className = 'pagina-item__badge'; } }
    });
    calcPrijs();
    updateHiddenPages();
  }

  /* ── Pagina accordeon ── */
  document.querySelectorAll('.pagina-item__toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item   = btn.closest('.pagina-item');
      var detail = item.querySelector('.pagina-item__detail');
      var open   = detail.style.display !== 'none';
      detail.style.display = open ? 'none' : 'block';
      btn.innerHTML = open ? '\u25be' : '\u25b4';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  document.querySelectorAll('.pagina-check').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var item   = cb.closest('.pagina-item');
      var detail = item.querySelector('.pagina-item__detail');
      var btn    = item.querySelector('.pagina-item__toggle');
      if (cb.checked) {
        detail.style.display = 'block';
        if (btn) { btn.innerHTML = '\u25b4'; btn.setAttribute('aria-expanded', 'true'); }
      }
      calcPrijs();
      updateHiddenPages();
    });
  });

  /* ── Project type toggle ── */
  var urlWrap       = document.getElementById('huidigeUrlWrap');
  var logoOptieWrap = document.getElementById('logo-optie-wrap');
  var logoNaam      = document.getElementById('logoNaamPreview');
  var bedrijfInput  = document.getElementById('c-bedrijf');

  form.querySelectorAll('[name="Type project"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (urlWrap)       urlWrap.style.display       = (r.value === 'Redesign') ? 'block' : 'none';
      if (logoOptieWrap) logoOptieWrap.style.display = (r.value === 'Nieuwe website') ? 'block' : 'none';
      if (logoNaam && bedrijfInput) logoNaam.textContent = bedrijfInput.value.trim() || '\u2014';
      form.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('type-btn--error'); });
    });
  });
  if (bedrijfInput && logoNaam) bedrijfInput.addEventListener('input', function () {
    logoNaam.textContent = bedrijfInput.value.trim() || '\u2014';
  });

  /* ── Logo optie ── */
  var logoOptieCheck = document.getElementById('logoOptie');
  var logoStijlWrap  = document.getElementById('logoStijlWrap');
  if (logoOptieCheck && logoStijlWrap) {
    logoOptieCheck.addEventListener('change', function () {
      logoStijlWrap.style.display = logoOptieCheck.checked ? 'block' : 'none';
      calcPrijs();
    });
  }

  /* ── Logo chips ── */
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
  initChips('logoStijlChips', 'logoStijlChipsHidden');
  initChips('logoKleurChips', 'logoKleurChipsHidden');

  /* ── Social media toggle ── */
  var socialCheck     = document.getElementById('socialCheck');
  var socialLinksWrap = document.getElementById('socialLinksWrap');
  if (socialCheck && socialLinksWrap) {
    socialCheck.addEventListener('change', function () {
      socialLinksWrap.style.display = socialCheck.checked ? 'block' : 'none';
    });
  }

  /* ── Privacy checkbox ── */
  var privacyCheck = document.getElementById('privacyCheck');
  if (privacyCheck) privacyCheck.addEventListener('change', function () {
    var lbl = this.closest('.checkbox-label'); if (lbl) lbl.classList.remove('checkbox-error');
  });

  /* ── Zelf aanpassen -> portaal advies ── */
  var portaalAdvies = document.getElementById('portaalAdvies');
  var portaalUitleg = document.getElementById('portaalUitleg');
  form.querySelectorAll('[name="Zelf aanpassen"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var portaalCb = document.getElementById('portaalOptie');
      if (r.value === 'Ja, zelf aanpassen') {
        if (portaalAdvies) portaalAdvies.style.display = 'flex';
        if (portaalUitleg) portaalUitleg.style.display = 'none';
        // Portaal automatisch aanvinken + in prijs verwerken
        if (portaalCb && !portaalCb.checked) { portaalCb.checked = true; }
      } else if (r.value === 'Weet ik nog niet') {
        if (portaalAdvies) portaalAdvies.style.display = 'none';
        if (portaalUitleg) portaalUitleg.style.display = 'flex';
      } else { // Nee, niet nodig
        if (portaalAdvies) portaalAdvies.style.display = 'none';
        if (portaalUitleg) portaalUitleg.style.display = 'none';
      }
      form.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('type-btn--error'); });
      calcPrijs();
    });
  });

  /* ─────────────────────────────────────────────
     TALEN
  ───────────────────────────────────────────── */
  var taalTags     = document.getElementById('taalTags');
  var taalDropdown = document.getElementById('taalDropdown');
  var taalEigen    = document.getElementById('taalEigen');
  var taalEigenAdd = document.getElementById('taalEigenAdd');
  var hiddenTalen  = document.getElementById('hiddenTalen');

  function vlagHTML(taal) {
    var code = TAAL_VLAG[taal];
    if (code) return '<img class="taal-tag__vlag" src="https://flagcdn.com/' + code + '.svg" alt="" width="20" height="14" loading="lazy">';
    return '<span style="font-size:.9em;">\ud83c\udf10</span>';
  }
  function renderTaalTags() {
    Array.from(taalTags.querySelectorAll('.taal-tag:not(.taal-tag--fixed)')).forEach(function (t) { t.remove(); });
    gekozenTalen.forEach(function (taal) {
      if (taal === 'Nederlands') return;
      var tag = document.createElement('span');
      tag.className = 'taal-tag';
      tag.innerHTML = vlagHTML(taal) + ' ' + taal + ' <button type="button" class="taal-tag__remove" aria-label="Verwijder ' + taal + '">\u2715</button>';
      tag.querySelector('.taal-tag__remove').addEventListener('click', function () {
        gekozenTalen = gekozenTalen.filter(function (t) { return t !== taal; });
        renderTaalTags(); updateHiddenTalen(); calcPrijs();
      });
      taalTags.appendChild(tag);
    });
  }
  function updateHiddenTalen() { if (hiddenTalen) hiddenTalen.value = gekozenTalen.join(', '); }
  function voegTaalToe(taal) {
    taal = (taal || '').trim();
    if (!taal) return;
    // Normaliseer eerste letter hoofdletter
    taal = taal.charAt(0).toUpperCase() + taal.slice(1);
    if (gekozenTalen.indexOf(taal) !== -1) return;
    gekozenTalen.push(taal);
    renderTaalTags(); updateHiddenTalen(); calcPrijs();
  }
  if (taalDropdown) taalDropdown.addEventListener('change', function () { if (this.value) { voegTaalToe(this.value); this.value = ''; } });
  if (taalEigenAdd) taalEigenAdd.addEventListener('click', function () { if (taalEigen) { voegTaalToe(taalEigen.value); taalEigen.value = ''; } });
  if (taalEigen) taalEigen.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); voegTaalToe(taalEigen.value); taalEigen.value = ''; } });

  /* ─────────────────────────────────────────────
     KLEUREN + EYEDROPPER
  ───────────────────────────────────────────── */
  var eyedropperSupported = (typeof window.EyeDropper !== 'undefined');

  ['1','2','3'].forEach(function (n) {
    var colorInput = document.getElementById('kleur' + n);
    var hexInput   = document.getElementById('hex' + n);
    var swatch     = document.getElementById('swatch' + n);
    var eyeBtn     = document.getElementById('eye' + n);
    if (!colorInput || !hexInput || !swatch) return;

    if (!eyedropperSupported && eyeBtn) eyeBtn.classList.add('hidden');

    function paint(val) {
      hexInput.value = val.toUpperCase();
      swatch.style.background = val;
    }
    colorInput.addEventListener('input', function () { paint(this.value); });
    hexInput.addEventListener('input', function () {
      var v = this.value.trim();
      if (v && v.charAt(0) !== '#') v = '#' + v;
      if (/^#[0-9A-Fa-f]{6}$/.test(v)) { colorInput.value = v; swatch.style.background = v; }
    });
    hexInput.addEventListener('blur', function () {
      var v = this.value.trim();
      if (v && v.charAt(0) !== '#') v = '#' + v;
      if (/^#[0-9A-Fa-f]{6}$/.test(v)) this.value = v.toUpperCase();
      else this.value = colorInput.value.toUpperCase();
    });
    if (eyeBtn && eyedropperSupported) {
      eyeBtn.addEventListener('click', function () {
        try {
          var ed = new window.EyeDropper();
          ed.open().then(function (res) { colorInput.value = res.sRGBHex; paint(res.sRGBHex); }).catch(function () {});
        } catch (err) {}
      });
    }
    paint(colorInput.value);
  });

  /* ─────────────────────────────────────────────
     PAKKETTEN
  ───────────────────────────────────────────── */
  var pakketWrap = document.getElementById('pakketten-wrap');
  var pakketAdd  = document.getElementById('pakketAddBtn');
  var hiddenPak  = document.getElementById('hiddenPakketten');

  function updateHiddenPakketten() {
    if (!pakketWrap || !hiddenPak) return;
    var lines = [];
    pakketWrap.querySelectorAll('.pakket-item').forEach(function (item, i) {
      var titel   = item.querySelector('.pakket-title-input');
      var omschr  = item.querySelector('.pakket-omschr');
      var prijsCb = item.querySelector('.pakket-prijs-cb');
      var prijsIn = item.querySelector('.pakket-prijs-val');
      var t = titel ? titel.value.trim() : '';
      var o = omschr ? omschr.value.trim() : '';
      var p = '';
      if (prijsCb && prijsCb.checked && prijsIn && prijsIn.value.trim()) p = prijsIn.value.trim();
      else if (prijsCb && !prijsCb.checked) p = 'Prijs op aanvraag';
      if (!t && !o && !p) return;
      lines.push('Pakket ' + (i + 1) + ': ' + (t || 'zonder titel') + (p ? ' [' + p + ']' : '') + (o ? ' \u2014 ' + o : ''));
    });
    hiddenPak.value = lines.join('  ||  ');
  }

  function maakPakket() {
    pakketTeller++;
    var item = document.createElement('div');
    item.className = 'pakket-item';
    item.innerHTML =
      '<button type="button" class="pakket-remove" title="Verwijder dit pakket">Verwijder</button>' +
      '<div class="pakket-header">' +
        '<span class="pakket-nummer">' + pakketTeller + '</span>' +
        '<div class="pakket-title-wrap">' +
          '<input type="text" class="pakket-title-input" placeholder="Titel, bijv. Basispakket of Vanaf \u20ac750" maxlength="80">' +
        '</div>' +
      '</div>' +
      '<div class="pakket-body">' +
        '<textarea class="pakket-omschr" rows="3" placeholder="Wat zit er in dit pakket? Bijv. inclusief 4 behandelingen, kleuradvies en nabespreking."></textarea>' +
        '<div class="pakket-prijs-rij">' +
          '<label><input type="checkbox" class="pakket-prijs-cb"> Prijs vermelden</label>' +
          '<input type="text" class="pakket-prijs-val" placeholder="Bijv. \u20ac750 of Vanaf \u20ac500" style="display:none;">' +
        '</div>' +
      '</div>';

    var cb  = item.querySelector('.pakket-prijs-cb');
    var val = item.querySelector('.pakket-prijs-val');
    cb.addEventListener('change', function () { val.style.display = cb.checked ? 'block' : 'none'; updateHiddenPakketten(); });
    item.querySelector('.pakket-remove').addEventListener('click', function () { item.remove(); hernummer(); updateHiddenPakketten(); });
    item.querySelectorAll('input, textarea').forEach(function (el) { el.addEventListener('input', updateHiddenPakketten); });

    pakketWrap.appendChild(item);
    updateHiddenPakketten();
  }

  function hernummer() {
    pakketTeller = 0;
    pakketWrap.querySelectorAll('.pakket-item .pakket-nummer').forEach(function (span) { span.textContent = (++pakketTeller); });
  }

  if (pakketAdd) pakketAdd.addEventListener('click', maakPakket);

  var prijzenCheck = document.querySelector('#pi-prijzen .pagina-check');
  if (prijzenCheck) {
    prijzenCheck.addEventListener('change', function () {
      if (this.checked && pakketWrap && pakketWrap.children.length === 0) maakPakket();
    });
  }

  /* ─────────────────────────────────────────────
     PRIJSCALCULATOR
  ───────────────────────────────────────────── */
  var BASE            = 750;   // tot 5 pagina's, 1 taal, contactformulier
  var INBEGREPEN_PAGINAS = 5;
  var PER_EXTRA_PAGE  = 75;
  var PER_EXTRA_TAAL  = 200;
  var PORTAAL_PRIJS   = 350;
  var ONDERHOUD       = 29.95; // per maand
  function fmt(n) { var s = n.toFixed(2).replace('.', ','); s = s.replace(/\B(?=(\d{3})+(?!\d),)/g, '.'); return '\u20ac' + s; }
  function calcPrijs() {
    var pages = document.querySelectorAll('.pagina-check:checked').length || 1;
    var talen = gekozenTalen.length || 1;

    var once = BASE;
    once += Math.max(0, pages - INBEGREPEN_PAGINAS) * PER_EXTRA_PAGE;
    once += Math.max(0, talen - 1) * PER_EXTRA_TAAL;

    var portaalCb = document.getElementById('portaalOptie');
    if (portaalCb && portaalCb.checked) once += PORTAAL_PRIJS;

    // Overige losse prijsopties (bijv. logo) tellen mee indien aanwezig
    form.querySelectorAll('.price-option:checked').forEach(function (opt) { once += parseFloat(opt.dataset.price) || 0; });

    var el = document.getElementById('priceDisplay'); if (el) el.textContent = fmt(once);
    var hid = document.getElementById('hiddenPriceOnce'); if (hid) hid.value = fmt(once);

    // Onderhoud apart tonen als maandbedrag
    var onderhoudCb = document.getElementById('onderhoudOptie');
    var maandEl = document.getElementById('priceMaandDisplay');
    var maandHid = document.getElementById('hiddenPriceMaand');
    var maand = (onderhoudCb && onderhoudCb.checked) ? ONDERHOUD : 0;
    if (maandEl) maandEl.textContent = maand ? (fmt(maand) + ' /maand') : '\u2014';
    if (maandHid) maandHid.value = maand ? fmt(maand) : '';

    // Opbouw voor in de mail
    var opbouw = [];
    opbouw.push('Basis (tot 5 pagina\'s, 1 taal, contactformulier): ' + fmt(BASE));
    var extraP = Math.max(0, pages - INBEGREPEN_PAGINAS);
    if (extraP > 0) opbouw.push(extraP + ' extra pagina\'s x ' + fmt(PER_EXTRA_PAGE) + ': ' + fmt(extraP * PER_EXTRA_PAGE));
    var extraT = Math.max(0, talen - 1);
    if (extraT > 0) opbouw.push(extraT + ' extra taal/talen x ' + fmt(PER_EXTRA_TAAL) + ': ' + fmt(extraT * PER_EXTRA_TAAL));
    if (portaalCb && portaalCb.checked) opbouw.push('Klantportaal: ' + fmt(PORTAAL_PRIJS));
    form.querySelectorAll('.price-option:checked').forEach(function (opt) {
      var lbl = opt.value || 'Extra';
      opbouw.push(lbl + ': ' + fmt(parseFloat(opt.dataset.price) || 0));
    });
    if (maand) opbouw.push('Maandelijks onderhoud: ' + fmt(ONDERHOUD) + ' /maand');
    var hidOpbouw = document.getElementById('hiddenPriceOpbouw');
    if (hidOpbouw) hidOpbouw.value = opbouw.join('  ||  ');
  }
  function updateHiddenPages() {
    var sel = Array.from(document.querySelectorAll('.pagina-check:checked')).map(function (c) { return c.value; });
    var hp = document.getElementById('hiddenPages'); if (hp) hp.value = sel.join(', ');
  }

  /* ─────────────────────────────────────────────
     MAIL-OPMAAK: bundel losse checkboxes tot nette regels
     zodat je aanvraag overzichtelijk in je inbox landt
  ───────────────────────────────────────────── */
  function verwijderVeld(naam) {
    form.querySelectorAll('input[type="hidden"][data-bundle="' + naam + '"]').forEach(function (el) { el.remove(); });
  }
  function zetVeld(naam, waarde) {
    verwijderVeld(naam);
    if (!waarde) return;
    var inp = document.createElement('input');
    inp.type = 'hidden';
    inp.name = naam;
    inp.value = waarde;
    inp.setAttribute('data-bundle', naam);
    form.appendChild(inp);
  }
  function verzamelChecked(elementNaam) {
    return Array.from(form.querySelectorAll('[name="' + elementNaam + '"]:checked'))
      .map(function (c) { return c.value; }).join(', ');
  }
  function bundelVoorMail() {
    // Per pagina: bundel gekozen elementen tot een leesbare regel
    var paginaBundels = [
      { pagina: 'Homepagina',   elementNaam: 'Homepagina elementen' },
      { pagina: 'Over ons',     elementNaam: 'Over Ons elementen' },
      { pagina: 'Diensten',     elementNaam: 'Diensten elementen' },
      { pagina: 'Behandelingen',elementNaam: 'Behandelingen elementen' },
      { pagina: 'Portfolio',    elementNaam: 'Portfolio elementen' },
      { pagina: 'Prijzen',      elementNaam: 'Prijzen elementen' },
      { pagina: 'Blog',         elementNaam: 'Blog elementen' },
      { pagina: 'FAQ',          elementNaam: 'FAQ elementen' },
      { pagina: 'Reviews',      elementNaam: 'Reviews elementen' },
      { pagina: 'Vacatures',    elementNaam: 'Vacatures elementen' }
    ];
    var samenvatting = [];
    paginaBundels.forEach(function (pb) {
      var gekozen = verzamelChecked(pb.elementNaam);
      // Alleen meenemen als de pagina zelf gekozen is
      var paginaGekozen = Array.from(form.querySelectorAll('.pagina-check:checked')).some(function (c) {
        return c.value.toLowerCase().indexOf(pb.pagina.toLowerCase()) !== -1;
      });
      if (paginaGekozen && gekozen) {
        samenvatting.push(pb.pagina + ': ' + gekozen);
      }
    });
    zetVeld('Gekozen paginaonderdelen', samenvatting.join('  ||  '));

    // Bundel gewenste stijl
    zetVeld('Gewenste uitstraling', verzamelChecked('Gewenste stijl'));

    // Bundel extra opties
    zetVeld('Gekozen extras', verzamelChecked('Extras'));

    // Bundel kleuren in 1 leesbaar veld
    var k1 = form.querySelector('#hex1'), k2 = form.querySelector('#hex2'), k3 = form.querySelector('#hex3');
    var kleuren = [];
    if (k1 && k1.value) kleuren.push('Hoofdkleur ' + k1.value);
    if (k2 && k2.value) kleuren.push('Ondersteunend ' + k2.value);
    if (k3 && k3.value) kleuren.push('Extra ' + k3.value);
    zetVeld('Kleurenpalet', kleuren.join(', '));

    // Bundel social media (alleen ingevulde)
    var socialVelden = ['Instagram URL','Facebook URL','LinkedIn URL','TikTok URL','YouTube URL'];
    var socials = [];
    socialVelden.forEach(function (naam) {
      var inp = form.querySelector('[name="' + naam + '"]');
      if (inp && inp.value.trim()) socials.push(naam.replace(' URL','') + ': ' + inp.value.trim());
    });
    zetVeld('Social media', socials.join('  ||  '));

    // Contact-pagina onderdelen (los opgezet)
    var contactGekozen = Array.from(form.querySelectorAll('.pagina-check:checked')).some(function (c) { return c.value === 'Contact'; });
    var contactEl = verzamelChecked('Contact elementen');
    if (contactGekozen && contactEl) zetVeld('Contact onderdelen', contactEl);

    // Verberg de rauwe losse velden uit de mail (disabled = niet verzonden)
    var rauweNamen = [
      'Homepagina elementen','Over Ons elementen','Diensten elementen','Behandelingen elementen',
      'Portfolio elementen','Prijzen elementen','Blog elementen','FAQ elementen','Reviews elementen',
      'Vacatures elementen','Contact elementen','Gewenste stijl','Extras',
      'Instagram URL','Facebook URL','LinkedIn URL','TikTok URL','YouTube URL',
      'Kleur 1 hoofdkleur','Kleur 2 ondersteunend','Kleur 3 extra','Paginas'
    ];
    rauweNamen.forEach(function (naam) {
      form.querySelectorAll('[name="' + naam + '"]').forEach(function (el) { el.disabled = true; });
    });
    // Contact-elementen wel als leesbare regel toevoegen
    // (contact staat niet in paginaBundels omdat het losse opzet heeft)
  }

  form.querySelectorAll('.price-option').forEach(function (el) { el.addEventListener('change', calcPrijs); });
  var portaalCb = document.getElementById('portaalOptie');
  if (portaalCb) portaalCb.addEventListener('change', calcPrijs);
  var onderhoudCb = document.getElementById('onderhoudOptie');
  if (onderhoudCb) onderhoudCb.addEventListener('change', calcPrijs);
  calcPrijs();
  updateHiddenPages();

  /* ─────────────────────────────────────────────
     SUBMIT
  ───────────────────────────────────────────── */
  var successOverlay = document.getElementById('successOverlay');
  var successClose   = document.getElementById('successClose');

  function launchRockets() {
    var container = document.getElementById('successRockets');
    if (!container) return;
    var emojis = ['\ud83d\ude80','\ud83c\udf89','\u2728','\ud83c\udf1f','\ud83d\udcab','\ud83c\udf8a'];
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var honey = form.querySelector('[name="_gotcha"]');
    if (honey && honey.value) return;
    if (!validateStep(2)) return;

    // Zorg dat alle hidden velden up-to-date zijn
    updateHiddenPages();
    updateHiddenTalen();
    updateHiddenPakketten();

    // ── Consolideer alles tot nette, leesbare hidden-velden voor de mail ──
    bundelVoorMail();

    // Onderwerp persoonlijker maken
    var subject = form.querySelector('[name="_subject"]');
    var bn = (bedrijfInput && bedrijfInput.value.trim()) ? bedrijfInput.value.trim() : 'onbekend bedrijf';
    var bt = (hiddenBranche && hiddenBranche.value.trim()) ? hiddenBranche.value.trim() : '';
    if (subject) subject.value = 'Nieuwe conceptaanvraag \u2014 ' + bn + (bt ? ' (' + bt + ')' : '');

    var btn  = document.getElementById('submitBtn');
    var orig = btn.innerHTML;
    btn.textContent = 'Verzenden...';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.style.display = 'none';
        var stepsBar = document.querySelector('.concept-steps');
        if (stepsBar) stepsBar.style.display = 'none';
        var bedankt = document.getElementById('conceptBedankt');
        if (bedankt) bedankt.style.display = 'block';
        if (successOverlay) {
          successOverlay.classList.add('show');
          document.body.style.overflow = 'hidden';
          setTimeout(function () {
            var ic = document.getElementById('successIcon'); if (ic) ic.classList.add('animate');
            launchRockets();
          }, 100);
        }
        var topEl = document.querySelector('.concept-wrapper');
        if (topEl) window.scrollTo({ top: topEl.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      } else {
        alert('Er ging iets mis bij het verzenden. Probeer het opnieuw of mail ons op sem@svanwijksolutions.nl');
      }
    }).catch(function () {
      alert('Geen verbinding. Controleer je internet en probeer het opnieuw.');
    }).finally(function () {
      btn.innerHTML = orig;
      btn.disabled = false;
    });
  });

  function closeOverlay() {
    if (!successOverlay) return;
    successOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  if (successClose) successClose.addEventListener('click', closeOverlay);
  if (successOverlay) successOverlay.addEventListener('click', function (e) { if (e.target === successOverlay) closeOverlay(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

});