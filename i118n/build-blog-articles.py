# -*- coding: utf-8 -*-
"""Genereert vertaalde blog-artikelen. Los script omdat de content
lange, doorlopende tekst is (geen korte UI-strings)."""
import json, os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build import build_header, build_footer, SITE_ROOT, LANGS, URL_PREFIX

OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

ARTICLES = json.load(open(os.path.join(os.path.dirname(__file__), 'blog-articles.json'), encoding='utf-8'))

def build_article(lang, slug):
    a = ARTICLES[slug][lang]
    prefix = URL_PREFIX[lang]
    canonical = f"{SITE_ROOT}{prefix}/blog/{slug}"
    og_locale = {'nl':'nl_NL','en':'en_US','de':'de_DE'}[lang]
    header_html = build_header(lang)
    footer_html = build_footer(lang)

    hreflang = "\n".join(
        f'  <link rel="alternate" hreflang="{l}" href="{SITE_ROOT}{URL_PREFIX[l]}/blog/{slug}">'
        for l in LANGS
    ) + f'\n  <link rel="alternate" hreflang="x-default" href="{SITE_ROOT}/blog/{slug}">'

    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{a['title']} | S. van Wijk Solutions</title>
  <meta name="description" content="{a['meta_description']}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
  <link rel="canonical" href="{canonical}">
{hreflang}
  <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
  <link rel="manifest" href="/assets/images/site.webmanifest">
  <meta property="og:title" content="{a['title']}">
  <meta property="og:description" content="{a['meta_description']}">
  <meta property="og:url" content="{canonical}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="{a['img']}">
  <meta property="og:locale" content="{og_locale}">
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{a['title']}",
    "description": "{a['meta_description']}",
    "image": "{a['img']}",
    "author": {{ "@type": "Person", "name": "Sem van Wijk" }},
    "publisher": {{ "@type": "Organization", "name": "S. van Wijk Solutions" }},
    "datePublished": "{a['date_published']}"
  }}
  </script>
</head>
<body>

  <div id="header-placeholder">{header_html}</div>

  <main>
    <article>

      <section class="blog-hero" style="background-image:linear-gradient(rgba(15,10,60,.74),rgba(15,10,60,.78)),url('{a['img']}');">
        <div class="container">
          <a href="{prefix}/blog.html" class="blog-back">{a['back']}</a>
          <span class="tag">{a['tag']}</span>
          <h1>{a['title']}</h1>
          <div class="blog-hero__meta">
            <span>📅 {a['date']}</span>
            <span>⏱ {a['min']} {a['min_read']}</span>
            <span>✍️ Sem van Wijk</span>
          </div>
        </div>
      </section>

      <section class="section section--alt">
        <div class="container" style="max-width:1040px;">
          <div class="blog-article-base">

{a['body_html']}

            <div class="blog-article-cta">
              <h3 style="margin-top:0;">{a['cta_title']}</h3>
              <p style="margin-bottom:14px;">{a['cta_text']}</p>
              <a href="{prefix}/concept.html" class="btn btn--primary">{a['cta_button']}</a>
            </div>

          </div>
        </div>
      </section>

    </article>
  </main>

  <div id="footer-placeholder">{footer_html}</div>
  <script src="/js/script.js"></script>
</body>
</html>'''


if __name__ == '__main__':
    for slug in ARTICLES:
        for lang in ['en', 'de']:  # nl bestaat al
            html = build_article(lang, slug)
            prefix = URL_PREFIX[lang].lstrip('/')
            outdir = os.path.join(OUT, prefix, 'blog')
            os.makedirs(outdir, exist_ok=True)
            path = os.path.join(outdir, slug)
            open(path, 'w', encoding='utf-8').write(html)
            print("Gegenereerd:", path)