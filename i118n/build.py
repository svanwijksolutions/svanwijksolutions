# -*- coding: utf-8 -*-
"""
Bouwscript voor de meertalige S. van Wijk Solutions website.

Werking:
- Leest nl.json / en.json / de.json (één bron van waarheid per taal)
- Vult de HTML-sjablonen in met de juiste taal
- Genereert per taal een losse, volledig statische pagina
  (NL op de root, EN in /en/, DE in /de/)
- Voegt automatisch hreflang-tags toe die de taalversies aan elkaar koppelen

Uitbreiden naar een nieuwe pagina (bijv. diensten.html):
1. Voeg een object "diensten" toe aan nl.json / en.json / de.json
2. Maak een functie build_diensten() naar analogie van build_home()
3. Roep 'm aan onderaan dit script

Tekst wijzigen in de toekomst:
- Pas de tekst aan in nl.json (en en.json / de.json voor de vertaling)
- Draai dit script opnieuw: python3 build.py
- Alle taalversies worden opnieuw gegenereerd, gegarandeerd consistent
"""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUT  = os.path.abspath(os.path.join(BASE, '..'))

LANGS = ['nl', 'en', 'de']
URL_PREFIX = {'nl': '', 'en': '/en', 'de': '/de'}
SITE_ROOT = 'https://www.svanwijksolutions.nl'

def load(lang):
    with open(os.path.join(BASE, f'{lang}.json'), encoding='utf-8') as f:
        return json.load(f)

DATA = {lang: load(lang) for lang in LANGS}


def hreflang_tags(page_slug):
    """Genereert de <link rel=alternate hreflang> tags voor een pagina."""
    tags = []
    urls = {}
    for lang in LANGS:
        prefix = URL_PREFIX[lang]
        url = f"{SITE_ROOT}{prefix}/{page_slug}" if page_slug else f"{SITE_ROOT}{prefix}/"
        urls[lang] = url
    for lang in LANGS:
        tags.append(f'  <link rel="alternate" hreflang="{lang}" href="{urls[lang]}">')
    tags.append(f'  <link rel="alternate" hreflang="x-default" href="{urls["nl"]}">')
    return "\n".join(tags)


def asset_path(lang, path):
    """Root-relatieve asset-paden werken op elke mapdiepte, dus geen aanpassing nodig."""
    return path


def nav_html(lang, active_page):
    n = DATA[lang]['nav']
    prefix = URL_PREFIX[lang]

    def link(slug, label, page_key):
        active = ' class="active" aria-current="page"' if page_key == active_page else ''
        href = f"{prefix}/{slug}" if slug else f"{prefix}/index.html"
        return f'<a href="{href}" data-page="{page_key}"{active}>{label}</a>'

    return {
        'home': link('index.html', n['home'], 'index'),
        'diensten': link('diensten.html', n['diensten'], 'diensten'),
        'over_ons': link('over-ons.html', n['over_ons'], 'over-ons'),
        'contact': link('contact.html', n['contact'], 'contact'),
    }


def build_header(lang):
    n = DATA[lang]['nav']
    prefix = URL_PREFIX[lang]
    nav = nav_html(lang, 'index')
    lang_names = {'nl': 'Nederlands', 'en': 'English', 'de': 'Deutsch'}
    switch_items = "\n".join(
        f'            <li><a href="#" data-lang="{l}">{lang_names[l]}</a></li>' for l in LANGS
    )
    switch_items_mobile = "\n".join(
        f'      <a href="#" data-lang="{l}">{lang_names[l]}</a>' for l in LANGS
    )
    return f'''<header id="site-header">
  <div class="container">
    <nav class="nav">

      <a href="{prefix}/index.html" class="nav__logo" aria-label="{DATA[lang]['meta']['site_name']}">
        <img src="/assets/images/logowit.svg" alt="{DATA[lang]['meta']['site_name']}" width="156" height="46" class="nav__logo-img">
      </a>

      <ul class="nav__links" role="list">
        <li>{nav['home']}</li>
        <li>{nav['diensten']}</li>
        <li>{nav['over_ons']}</li>
        <li>{nav['contact']}</li>
      </ul>

      <div class="nav__right">
        <div class="lang-switch" aria-label="{'Taal wisselen' if lang=='nl' else ('Switch language' if lang=='en' else 'Sprache wechseln')}">
          <button class="lang-switch__current" aria-expanded="false" aria-haspopup="true">{lang.upper()}</button>
          <ul class="lang-switch__menu" role="list">
{switch_items}
          </ul>
        </div>
        <a href="{prefix}/concept.html" class="nav__cta--gratis"><span>{n['cta_gratis']}</span> <span class="nav__cta-arrow">→</span></a>
        <button class="nav__burger" aria-label="{n['menu_open']}" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>

    </nav>
  </div>
</header>

<div class="mobile-overlay" role="dialog" aria-modal="true" aria-label="{n['menu_open']}">
  <button class="mobile-overlay__close" aria-label="{n['menu_close']}">✕</button>
  <nav>
    <ul role="list">
      <li><a href="{prefix}/index.html">{n['home']}</a></li>
      <li><a href="{prefix}/diensten.html">{n['diensten']}</a></li>
      <li><a href="{prefix}/over-ons.html">{n['over_ons']}</a></li>
      <li><a href="{prefix}/contact.html">{n['contact']}</a></li>
    </ul>
    <a href="{prefix}/concept.html" class="announce-mobile-cta">{n['cta_gratis']}</a>
    <div class="lang-switch lang-switch--mobile">
{switch_items_mobile}
    </div>
  </nav>
</div>'''


def build_footer(lang):
    f_ = DATA[lang]['footer']
    prefix = URL_PREFIX[lang]
    return f'''<footer class="footer">
  <div class="container">
    <div class="footer__grid">

      <div class="footer__brand">
        <a href="{prefix}/index.html" class="footer__logo-link" aria-label="{DATA[lang]['meta']['site_name']}">
          <img src="/assets/images/logowit.svg" alt="{DATA[lang]['meta']['site_name']}" loading="lazy" width="180" height="60" class="footer__logo">
        </a>
        <p>{f_['tagline']}</p>
        <a href="https://www.instagram.com/svanwijksolutions" target="_blank" rel="noopener noreferrer" class="footer__social" aria-label="Instagram">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>Instagram</span>
        </a>
      </div>

      <div class="footer__col">
        <h4>{f_['links_label']}</h4>
        <ul role="list">
          <li><a href="{prefix}/index.html">{DATA[lang]['nav']['home']}</a></li>
          <li><a href="{prefix}/diensten.html">{DATA[lang]['nav']['diensten']}</a></li>
          <li><a href="{prefix}/over-ons.html">{DATA[lang]['nav']['over_ons']}</a></li>
          <li><a href="{prefix}/contact.html">{DATA[lang]['nav']['contact']}</a></li>
          <li><a href="{prefix}/blog.html">{f_['blog']}</a></li>
          <li><a href="{prefix}/concept.html">{f_['concept']}</a></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4>{f_['contact_label']}</h4>
        <ul role="list">
          <li><a href="mailto:info@svanwijksolutions.nl">info@svanwijksolutions.nl</a></li>
          <li><a href="tel:+31681835935">+31 6 81 83 59 35</a></li>
          <li><span>{f_['location']}</span></li>
        </ul>
      </div>

      <div class="footer__col">
        <h4>{f_['hours_label']}</h4>
        <ul role="list" class="footer__hours">
          <li><span>{f_['hours_weekdays']}</span><span>{f_['hours_weekday_time']}</span></li>
          <li><span>{f_['hours_saturday']}</span><span class="closed">{f_['hours_closed']}</span></li>
          <li><span>{f_['hours_sunday']}</span><span class="closed">{f_['hours_closed']}</span></li>
        </ul>
      </div>

    </div>
  </div>

  <div class="footer__bottom">
    <div class="container">
      <p>
        &copy; <span id="footer-year"></span> {DATA[lang]['meta']['site_name']}. {f_['copy_rights']}
        &nbsp;|&nbsp; KvK: 86749439
        &nbsp;|&nbsp; <a href="{prefix}/privacy.html" style="color:rgba(255,255,255,.6);text-decoration:none;">{f_['privacy']}</a>
      </p>
    </div>
  </div>
</footer>

<script>
  var yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();
</script>'''


print("Header/footer generator-functies geladen. Klaar voor paginabuild.")


def build_home(lang):
    d = DATA[lang]['home']
    prefix = URL_PREFIX[lang]
    hero = d['hero']
    stats = d['stats']
    exp = d['expertise']
    spot = d['spotlight']
    blog = d['blog_preview']
    gar = d['garanties']
    cta = d['cta_banner']

    header_html = build_header(lang)
    footer_html = build_footer(lang)
    hreflang = hreflang_tags('')
    canonical = f"{SITE_ROOT}{prefix}/"
    og_locale = {'nl': 'nl_NL', 'en': 'en_US', 'de': 'de_DE'}[lang]
    typewriter_json = json.dumps(hero['typewriter_phrases'], ensure_ascii=False)

    html = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{d['meta_title']}</title>
  <meta name="description" content="{d['meta_description']}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <link rel="canonical" href="{canonical}">
{hreflang}
  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
  <link rel="manifest" href="/assets/images/site.webmanifest">
  <meta property="og:title" content="{d['meta_title']}">
  <meta property="og:description" content="{d['meta_description']}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{SITE_ROOT}/assets/images/og-image.jpg">
  <meta property="og:locale" content="{og_locale}">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "S. van Wijk Solutions",
    "description": "{d['meta_description']}",
    "url": "{SITE_ROOT}",
    "email": "info@svanwijksolutions.nl",
    "telephone": "+31681835935",
    "address": {{ "@type": "PostalAddress", "addressRegion": "Westland", "addressCountry": "NL" }},
    "openingHours": "Mo-Fr 08:00-17:00"
  }}
  </script>
</head>
<body>

  <div id="header-placeholder">{header_html}</div>

  <main>

    <!-- HERO -->
    <section class="hero">
      <div class="hero__particles" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>

      <div class="floating-tags" aria-hidden="true">
        <span class="float-tag float-tag--1">&lt;design /&gt;</span>
        <span class="float-tag float-tag--2">&lt;build /&gt;</span>
        <span class="float-tag float-tag--3">&lt;launch /&gt;</span>
        <span class="float-tag float-tag--4">{{ code }}</span>
      </div>

      <div class="container">
        <div class="hero__grid">
          <div class="hero__content">
            <span class="hero__badge">{hero['badge']}</span>
            <h1>{hero['title_prefix']}<br><span class="typewriter" id="typewriter"></span></h1>
            <p class="hero__sub">{hero['sub']}</p>
            <div class="hero__btns">
              <a href="{prefix}/concept.html" class="btn btn--white">{hero['cta_primary']} →</a>
              <a href="{prefix}/diensten.html" class="btn btn--outline" style="border-color:rgba(255,255,255,.5);color:#fff;">{hero['cta_secondary']}</a>
            </div>
          </div>
          <div class="hero__visual">
            <div class="code-card">
              <div class="code-card__dots">
                <span></span><span></span><span></span>
              </div>
              <pre><span class="kw">const</span> <span class="fn">buildWebsite</span> = () =&gt; {{
  <span class="kw">return</span> {{
    design:  <span class="str">"Ultra Modern"</span>,
    speed:   <span class="str">"Lightning Fast"</span>,
    seo:     <span class="str">"Top Rankings"</span>,
    client:  <span class="str">"100% Happy"</span> 🚀
  }};
}};</pre>
            </div>
            <div class="hero__blob"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="stats">
      <div class="container">
        <div class="stats__grid">
          <div class="reveal reveal--delay-1">
            <div class="stat__num"><span data-count="50" data-suffix="+">0+</span></div>
            <div class="stat__label">{stats['s1_label']}</div>
          </div>
          <div class="reveal reveal--delay-2">
            <div class="stat__num"><span data-count="100" data-suffix="%">0%</span></div>
            <div class="stat__label">{stats['s2_label']}</div>
          </div>
          <div class="reveal reveal--delay-3">
            <div class="stat__num"><span data-count="5" data-suffix="{stats['s3_suffix']}">0{stats['s3_suffix']}</span></div>
            <div class="stat__label">{stats['s3_label']}</div>
          </div>
          <div class="reveal">
            <div class="stat__num"><span data-count="24" data-suffix="{stats['s4_suffix']}">0{stats['s4_suffix']}</span></div>
            <div class="stat__label">{stats['s4_label']}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- EXPERTISE -->
    <section class="section expertise-sectie" id="diensten">
      <div class="container">
        <div class="section-header reveal">
          <span class="tag tag--teal">{exp['tag']}</span>
          <h2>{exp['title']}</h2>
          <p>{exp['sub']}</p>
        </div>

        <div class="expertise-split">
          <div class="expertise-cards">
            <div class="exp-card reveal reveal--delay-1">
              <div class="exp-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </div>
              <h3>{exp['c1_title']}</h3>
              <p>{exp['c1_text']}</p>
            </div>
            <div class="exp-card reveal reveal--delay-2">
              <div class="exp-card__icon exp-card__icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
              </div>
              <h3>{exp['c2_title']}</h3>
              <p>{exp['c2_text']}</p>
            </div>
            <div class="exp-card reveal reveal--delay-3">
              <div class="exp-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="10.5" r="2.5"></circle><circle cx="8.5" cy="7.5" r="2.5"></circle><circle cx="6.5" cy="12.5" r="2.5"></circle><path d="M12 22c-7-2-9-6-9-9 0-3 3-5 6-5h6c3 0 6 2 6 5 0 3-3 9-9 9z"></path></svg>
              </div>
              <h3>{exp['c3_title']}</h3>
              <p>{exp['c3_text']}</p>
            </div>
            <div class="exp-card reveal reveal--delay-1">
              <div class="exp-card__icon exp-card__icon--teal">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h3>{exp['c4_title']}</h3>
              <p>{exp['c4_text']}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SPOTLIGHT -->
    <section class="section section--alt spotlight-sectie">
      <div class="container">
        <div class="section-header reveal">
          <span class="tag">{spot['tag']}</span>
          <h2>{spot['title']}</h2>
          <p>{spot['sub']}</p>
        </div>
        <div class="spotlight reveal">
          <div class="spotlight__visual">
            <div class="browser-frame browser-frame--after">
              <div class="browser-frame__bar">
                <span></span><span></span><span></span>
                <div class="browser-frame__url">waterfordscocktails.com</div>
              </div>
              <div class="browser-frame__screen">
                <img src="/assets/images/portfolio/waterfords.webp" alt="Waterfords Cocktails website" loading="lazy" width="1342" height="5079">
              </div>
            </div>
            <a href="https://www.waterfordscocktails.com" target="_blank" rel="noopener noreferrer" class="spotlight__live">{spot['live_link']}</a>
            <span class="spotlight__hint">{spot['hint']}</span>
          </div>
          <div class="spotlight__quote">
            <span class="spotlight__mark">&ldquo;</span>
            <div class="spotlight__stars" aria-label="5 / 5">★★★★★</div>
            <blockquote>{spot['quote']}</blockquote>
            <div class="spotlight__author">
              <span class="spotlight__avatar">T</span>
              <div>
                <strong>{spot['author_name']}</strong>
                <span>{spot['author_role']}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOG PREVIEW -->
    <section class="section section--alt blog-preview">
      <div class="container">
        <div class="section-header reveal">
          <span class="tag tag--teal">{blog['tag']}</span>
          <h2>{blog['title']}</h2>
          <p>{blog['sub']}</p>
        </div>
        <div class="blog-grid">
          <article class="blog-card reveal reveal--delay-1">
            <a href="{prefix}/blog/5-redenen-trage-website.html" class="blog-card__link">
              <div class="blog-card__img" style="background-image:url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80');"></div>
              <div class="blog-card__body">
                <span class="blog-card__cat">{blog['p1_cat']}</span>
                <h3>{blog['p1_title']}</h3>
                <p>{blog['p1_text']}</p>
                <div class="blog-card__meta">
                  <span>📅 {blog['p1_date']}</span>
                  <span>⏱ 5 {blog['min_read']}</span>
                </div>
              </div>
            </a>
          </article>
          <article class="blog-card reveal reveal--delay-2">
            <a href="{prefix}/blog/seo-basis-mkb.html" class="blog-card__link">
              <div class="blog-card__img" style="background-image:url('https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80');"></div>
              <div class="blog-card__body">
                <span class="blog-card__cat">{blog['p2_cat']}</span>
                <h3>{blog['p2_title']}</h3>
                <p>{blog['p2_text']}</p>
                <div class="blog-card__meta">
                  <span>📅 {blog['p2_date']}</span>
                  <span>⏱ 7 {blog['min_read']}</span>
                </div>
              </div>
            </a>
          </article>
          <article class="blog-card reveal reveal--delay-3">
            <a href="{prefix}/blog/mkb-westland-online-groeien.html" class="blog-card__link">
              <div class="blog-card__img" style="background-image:url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80');"></div>
              <div class="blog-card__body">
                <span class="blog-card__cat">{blog['p3_cat']}</span>
                <h3>{blog['p3_title']}</h3>
                <p>{blog['p3_text']}</p>
                <div class="blog-card__meta">
                  <span>📅 {blog['p3_date']}</span>
                  <span>⏱ 5 {blog['min_read']}</span>
                </div>
              </div>
            </a>
          </article>
        </div>
        <div class="reveal" style="text-align:center;margin-top:36px;">
          <a href="{prefix}/blog.html" class="btn btn--outline">{blog['cta']}</a>
        </div>
      </div>
    </section>

    <!-- GARANTIES -->
    <section class="section garanties-sectie">
      <div class="container">
        <div class="section-header reveal">
          <span class="tag">{gar['tag']}</span>
          <h2>{gar['title']}</h2>
          <p>{gar['sub']}</p>
        </div>
        <div class="grid--3">
          <div class="garantie-kaart garantie-kaart--teal reveal reveal--delay-1">
            <div class="garantie-kaart__icon">💯</div>
            <h3>{gar['g1_title']}</h3>
            <p>{gar['g1_text']}</p>
          </div>
          <div class="garantie-kaart reveal reveal--delay-2">
            <div class="garantie-kaart__icon">⚡</div>
            <h3>{gar['g2_title']}</h3>
            <p>{gar['g2_text']}</p>
          </div>
          <div class="garantie-kaart garantie-kaart--teal reveal reveal--delay-3">
            <div class="garantie-kaart__icon">🔒</div>
            <h3>{gar['g3_title']}</h3>
            <p>{gar['g3_text']}</p>
          </div>
          <div class="garantie-kaart reveal reveal--delay-1">
            <div class="garantie-kaart__icon">📱</div>
            <h3>{gar['g4_title']}</h3>
            <p>{gar['g4_text']}</p>
          </div>
          <div class="garantie-kaart garantie-kaart--teal reveal reveal--delay-2">
            <div class="garantie-kaart__icon">🔍</div>
            <h3>{gar['g5_title']}</h3>
            <p>{gar['g5_text']}</p>
          </div>
          <div class="garantie-kaart reveal reveal--delay-3">
            <div class="garantie-kaart__icon">🤝</div>
            <h3>{gar['g6_title']}</h3>
            <p>{gar['g6_text']}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-banner reveal">
      <div class="container">
        <h2>{cta['title']}</h2>
        <p>{cta['text']}</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
          <a href="{prefix}/concept.html" class="btn btn--white">{cta['cta_primary']}</a>
          <a href="{prefix}/start.html" class="btn btn--outline" style="border-color:rgba(255,255,255,.5);color:#fff;">{cta['cta_secondary']}</a>
        </div>
      </div>
    </section>

  </main>

  <div id="footer-placeholder">{footer_html}</div>
  <script src="/js/script.js"></script>
  <script>
    window.__TYPEWRITER_PHRASES__ = {typewriter_json};
  </script>
</body>
</html>'''
    return html


def page_shell(lang, page_slug, meta_title, meta_description, body_content, extra_head=''):
    """Genieke pagina-wrapper: head + header + main + footer + scripts.
    Gebruikt door alle pagina's behalve de homepage (die zijn eigen
    structured data / typewriter nodig heeft)."""
    prefix = URL_PREFIX[lang]
    header_html = build_header(lang)
    footer_html = build_footer(lang)
    hreflang = hreflang_tags(page_slug)
    canonical = f"{SITE_ROOT}{prefix}/{page_slug}"
    og_locale = {'nl': 'nl_NL', 'en': 'en_US', 'de': 'de_DE'}[lang]

    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{meta_title}</title>
  <meta name="description" content="{meta_description}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <link rel="canonical" href="{canonical}">
{hreflang}
  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
  <link rel="manifest" href="/assets/images/site.webmanifest">
  <meta property="og:title" content="{meta_title}">
  <meta property="og:description" content="{meta_description}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="{SITE_ROOT}/assets/images/og-image.jpg">
  <meta property="og:locale" content="{og_locale}">
{extra_head}</head>
<body>

  <div id="header-placeholder">{header_html}</div>

  <main>
{body_content}
  </main>

  <div id="footer-placeholder">{footer_html}</div>
  <script src="/js/script.js"></script>
</body>
</html>'''


def build_diensten(lang):
    d = DATA[lang]['diensten']
    prefix = URL_PREFIX[lang]
    hero, intro, sv, proc, cta = d['hero'], d['intro'], d['services'], d['process'], d['cta_banner']

    body = f'''    <section class="page-hero">
      <div class="container">
        <span class="tag">{hero['tag']}</span>
        <h1>{hero['title']}</h1>
        <p>{hero['sub']}</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="diensten-intro reveal">
          <div>
            <span class="tag">{intro['tag']}</span>
            <h2>{intro['title']}</h2>
          </div>
          <div>
            <p>{intro['p1']}</p>
            <p style="margin-top:12px;">{intro['p2']}</p>
            <a href="{prefix}/concept.html" class="btn btn--primary" style="margin-top:20px;display:inline-block;">{intro['cta']}</a>
          </div>
        </div>

        <div class="grid--3">
          <div class="exp-card reveal reveal--delay-1">
            <div class="exp-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </div>
            <h3>{sv['s1_title']}</h3>
            <p>{sv['s1_text']}</p>
          </div>
          <div class="exp-card reveal reveal--delay-2">
            <div class="exp-card__icon exp-card__icon--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <h3>{sv['s2_title']}</h3>
            <p>{sv['s2_text']}</p>
          </div>
          <div class="exp-card reveal reveal--delay-3">
            <div class="exp-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h3>{sv['s3_title']}</h3>
            <p>{sv['s3_text']}</p>
          </div>
          <div class="exp-card reveal reveal--delay-1">
            <div class="exp-card__icon exp-card__icon--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3>{sv['s4_title']}</h3>
            <p>{sv['s4_text']}</p>
          </div>
          <div class="exp-card reveal reveal--delay-2">
            <div class="exp-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            </div>
            <h3>{sv['s5_title']}</h3>
            <p>{sv['s5_text']}</p>
          </div>
          <div class="exp-card reveal reveal--delay-3">
            <div class="exp-card__icon exp-card__icon--teal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h3>{sv['s6_title']}</h3>
            <p>{sv['s6_text']}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section process">
      <div class="container">
        <div class="section-header reveal">
          <span class="tag">{proc['tag']}</span>
          <h2>{proc['title']}</h2>
          <p>{proc['sub']}</p>
        </div>
        <div class="process-steps">
          <div class="process-step reveal reveal--delay-1">
            <div class="process-step__num">1</div>
            <h3>{proc['p1_title']}</h3>
            <p>{proc['p1_text']}</p>
          </div>
          <div class="process-step reveal reveal--delay-2">
            <div class="process-step__num">2</div>
            <h3>{proc['p2_title']}</h3>
            <p>{proc['p2_text']}</p>
          </div>
          <div class="process-step reveal reveal--delay-3">
            <div class="process-step__num">3</div>
            <h3>{proc['p3_title']}</h3>
            <p>{proc['p3_text']}</p>
          </div>
          <div class="process-step reveal">
            <div class="process-step__num">4</div>
            <h3>{proc['p4_title']}</h3>
            <p>{proc['p4_text']}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-banner reveal">
      <div class="container">
        <h2>{cta['title']}</h2>
        <p>{cta['text']}</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
          <a href="{prefix}/concept.html" class="btn btn--white">{cta['cta_primary']}</a>
          <a href="{prefix}/start.html" class="btn btn--outline" style="border-color:rgba(255,255,255,.5);color:#fff;">{cta['cta_secondary']}</a>
        </div>
      </div>
    </section>'''

    return page_shell(lang, 'diensten.html', d['meta_title'], d['meta_description'], body)


def build_over_ons(lang):
    d = DATA[lang]['over_ons']
    prefix = URL_PREFIX[lang]
    hero, mis, bb, nl_, gar, cta = d['hero'], d['mission'], d['brand_band'], d['nederland'], d['garanties'], d['cta_banner']

    body = f'''    <section class="page-hero page-hero--img" style="background-image:url('/assets/images/vscode.jpg');">
      <div class="page-hero__overlay"></div>
      <div class="container" style="position:relative;z-index:1;">
        <span class="tag">{hero['tag']}</span>
        <h1>{hero['title']}</h1>
        <p>{hero['sub']}</p>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <div class="about-full reveal">
          <div class="about-text">
            <span class="tag">{mis['tag']}</span>
            <h2>{mis['title']}</h2>
            <p>{mis['p1']}</p>
            <p>{mis['p2']}</p>
            <p>{mis['p3_prefix']} <a href="mailto:info@svanwijksolutions.nl" style="color:var(--clr-accent);font-weight:600;">info@svanwijksolutions.nl</a>.</p>

            <div class="values">
              <div class="value-item">
                <span class="value-item__icon">⚡</span>
                <div><h3>{mis['v1_title']}</h3><p>{mis['v1_text']}</p></div>
              </div>
              <div class="value-item">
                <span class="value-item__icon">🤝</span>
                <div><h3>{mis['v2_title']}</h3><p>{mis['v2_text']}</p></div>
              </div>
              <div class="value-item">
                <span class="value-item__icon">📈</span>
                <div><h3>{mis['v3_title']}</h3><p>{mis['v3_text']}</p></div>
              </div>
              <div class="value-item">
                <span class="value-item__icon">🔒</span>
                <div><h3>{mis['v4_title']}</h3><p>{mis['v4_text']}</p></div>
              </div>
            </div>

            <div style="margin-top:36px;display:flex;gap:14px;flex-wrap:wrap;">
              <a href="{prefix}/concept.html" class="btn btn--primary">{mis['cta_primary']}</a>
              <a href="{prefix}/diensten.html" class="btn btn--outline">{mis['cta_secondary']}</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="brand-band">
      <div class="brand-band__overlay"></div>
      <div class="container">
        <span class="tag">{bb['tag']}</span>
        <h2>{bb['title']}</h2>
        <p>{bb['text']}</p>
        <div class="brand-band__cta">
          <a href="{prefix}/concept.html" class="btn btn--white">{bb['cta_primary']}</a>
          <a href="{prefix}/contact.html" class="btn btn--outline" style="border-color:rgba(255,255,255,.6);color:#fff;">{bb['cta_secondary']}</a>
        </div>
      </div>
    </section>

    <section class="section nederland-sectie">
      <div class="container">
        <div class="nederland-grid reveal">
          <div class="nederland-tekst">
            <span class="tag tag--fresh">{nl_['tag']}</span>
            <h2>{nl_['title']}</h2>
            <p>{nl_['p1']}</p>
            <p style="margin-top:12px;">{nl_['p2']}</p>
            <a href="{prefix}/contact.html" class="btn btn--primary" style="margin-top:24px;display:inline-block;">{nl_['cta']}</a>
          </div>
          <div class="nederland-foto reveal reveal--delay-1">
            <img src="/assets/images/holland.PNG" alt="{nl_['img_alt']}" loading="lazy" width="800" height="534" class="nederland-foto__img">
          </div>
        </div>
      </div>
    </section>

    <section class="section garanties-sectie">
      <div class="container">
        <div class="section-header reveal">
          <span class="tag">{gar['tag']}</span>
          <h2>{gar['title']}</h2>
          <p>{gar['sub']}</p>
        </div>
        <div class="grid--3">
          <div class="garantie-kaart garantie-kaart--warm reveal reveal--delay-1">
            <div class="garantie-kaart__icon">💯</div>
            <h3>{gar['g1_title']}</h3>
            <p>{gar['g1_text']}</p>
          </div>
          <div class="garantie-kaart garantie-kaart--fresh reveal reveal--delay-2">
            <div class="garantie-kaart__icon">⚡</div>
            <h3>{gar['g2_title']}</h3>
            <p>{gar['g2_text']}</p>
          </div>
          <div class="garantie-kaart garantie-kaart--cool reveal reveal--delay-3">
            <div class="garantie-kaart__icon">🔒</div>
            <h3>{gar['g3_title']}</h3>
            <p>{gar['g3_text']}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-banner reveal">
      <div class="container">
        <h2>{cta['title']}</h2>
        <p>{cta['text']}</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;">
          <a href="{prefix}/concept.html" class="btn btn--white">{cta['cta_primary']}</a>
          <a href="{prefix}/start.html" class="btn btn--outline" style="border-color:rgba(255,255,255,.5);color:#fff;">{cta['cta_secondary']}</a>
        </div>
      </div>
    </section>'''

    return page_shell(lang, 'over-ons.html', d['meta_title'], d['meta_description'], body)


def write_page(lang, relpath, html):
    prefix = URL_PREFIX[lang].lstrip('/')
    outdir = os.path.join(OUT, prefix) if prefix else OUT
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, relpath)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    return path


if __name__ == '__main__':
    for lang in LANGS:
        for slug, builder in [('index.html', build_home), ('diensten.html', build_diensten), ('over-ons.html', build_over_ons)]:
            html = builder(lang)
            path = write_page(lang, slug, html)
            print(f"Gegenereerd: {path}")