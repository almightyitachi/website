# PluginLive Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single `pluginlive/landing/index.html` static marketing page for PluginLive and serve it on port 3001 via `npx serve`.

**Architecture:** Single self-contained HTML file — all CSS in `<style>` in `<head>`, all JS in `<script>` before `</body>`, no external JS. The file is built incrementally: Task 1 creates the skeleton and CSS token system; Tasks 2–8 fill each section; Task 9 adds all JavaScript; Task 10 adds responsive overrides; Task 11 starts the dev server.

**Tech Stack:** HTML5, embedded CSS custom properties, vanilla JS (IntersectionObserver, requestAnimationFrame), Fontshare CDN for Satoshi font, SVG for visuals, `npx serve` for dev server.

---

### Task 1: Create file scaffold with CSS design tokens

**Files:**
- Create: `pluginlive/landing/index.html`

- [ ] **Step 1: Create the directory and base file**

Create `pluginlive/landing/index.html` with this exact content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PluginLive — Hire at every altitude</title>
  <meta name="description" content="India's AI-powered talent marketplace connecting 500+ institutions, 2M+ students, and 1,000+ corporates on one intelligent platform.">
  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap" rel="stylesheet">
  <style>
    /* =========================================
       DESIGN TOKENS
    ========================================= */
    :root {
      --font-sans: 'Satoshi', system-ui, sans-serif;

      --text-xs:   13px;
      --text-sm:   14px;
      --text-base: 16px;
      --text-md:   20px;
      --text-lg:   24px;
      --text-xl:   32px;
      --text-2xl:  48px;
      --text-3xl:  64px;

      --tracking-tight:  -0.025em;
      --tracking-normal: 0em;
      --tracking-wide:   0.04em;

      /* Primary — cobalt-violet */
      --color-primary-50:  #EDEDFB;
      --color-primary-100: #D6D7F6;
      --color-primary-300: #8487E4;
      --color-primary-600: #494FDF;
      --color-primary-700: #3A40C4;
      --color-primary-800: #2E339C;
      --color-primary-900: #1F2374;

      /* Neutral — cool ink */
      --color-neutral-50:  #FAFAFA;
      --color-neutral-100: #F4F4F4;
      --color-neutral-200: #E2E2E7;
      --color-neutral-400: #8D969E;
      --color-neutral-600: #505A63;
      --color-neutral-800: #1F2226;
      --color-neutral-900: #191C1F;

      /* Brand-multi */
      --color-brand-navy:          #1A1981;
      --color-brand-navy-subtle:   #E5E5F4;
      --color-brand-amber:         #FDBA00;
      --color-brand-amber-subtle:  #FFF3D1;
      --color-brand-orange:        #FD5B02;
      --color-brand-orange-subtle: #FFE3D1;

      /* Semantic */
      --color-success: #00A87E;
      --color-warning: #EC7E00;
      --color-error:   #E23B4A;

      /* Text */
      --text-primary: #191C1F;
      --text-body:    #1F2226;
      --text-muted:   #505A63;
      --text-inverse: #FFFFFF;
      --text-brand:   #494FDF;

      /* Surfaces */
      --bg-page:         #FFFFFF;
      --bg-surface:      #F4F4F4;
      --bg-brand:        #0A0A0A;
      --bg-brand-subtle: #EDEDFB;

      /* Borders */
      --border-default: #E2E2E7;
      --border-brand:   #494FDF;

      /* Spacing — 4px grid */
      --space-2:  8px;
      --space-3:  12px;
      --space-4:  16px;
      --space-6:  24px;
      --space-8:  32px;
      --space-10: 40px;
      --space-12: 48px;
      --space-16: 64px;
      --space-20: 80px;
      --space-24: 96px;

      /* Radii — max 6px */
      --radius-sm: 4px;
      --radius-md: 6px;

      /* Shadows */
      --shadow-sm: 0 1px 2px 0 rgba(26,25,23,0.06), 0 1px 4px 0 rgba(26,25,23,0.04);
      --shadow-md: 0 4px 8px -2px rgba(26,25,23,0.08), 0 2px 6px -2px rgba(26,25,23,0.06);
    }

    /* =========================================
       RESET + BASE
    ========================================= */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font-sans);
      background: var(--bg-page);
      color: var(--text-body);
      font-size: var(--text-base);
      line-height: 24px;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    a { text-decoration: none; color: inherit; }
    ul, ol { list-style: none; }
    img, svg { display: block; }

    /* =========================================
       SHARED COMPONENTS
    ========================================= */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-8);
      border-radius: var(--radius-md);
      font-family: var(--font-sans);
      font-size: var(--text-base);
      font-weight: 600;
      cursor: pointer;
      border: none;
      min-height: 44px;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }

    .btn-primary {
      background: var(--color-primary-600);
      color: var(--text-inverse);
    }
    .btn-primary:hover { background: var(--color-primary-700); }
    .btn-primary:active { background: var(--color-primary-800); }

    .btn-ghost {
      background: transparent;
      color: var(--text-primary);
      border: 1.5px solid var(--border-default);
    }
    .btn-ghost:hover {
      border-color: var(--border-brand);
      color: var(--text-brand);
    }

    .section-overline {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: var(--space-3);
    }

    .section-heading {
      font-size: var(--text-xl);
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: var(--tracking-tight);
      line-height: 1.2;
      margin-bottom: var(--space-6);
    }

    .section-body {
      font-size: var(--text-base);
      line-height: 24px;
      color: var(--text-body);
      max-width: 580px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--space-16);
    }

    /* Fade-up entrance — class applied by JS */
    .fade-up {
      opacity: 0;
      transform: translateY(24px);
    }
    @media (prefers-reduced-motion: no-preference) {
      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .fade-up { opacity: 1; transform: none; }
    }

    /* =========================================
       SECTION STUBS — filled in Tasks 2–8
    ========================================= */
  </style>
</head>
<body>

  <!-- NAV — Task 2 -->
  <!-- HERO — Task 3 -->
  <!-- MARKETPLACE — Task 4 -->
  <!-- AI — Task 5 -->
  <!-- PLATFORM — Task 6 -->
  <!-- TRUST — Task 7 -->
  <!-- CONTACT/FOOTER — Task 8 -->

  <script>
    /* JS — Task 9 */
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify file opens in browser**

Open `pluginlive/landing/index.html` directly in a browser. Expected: blank white page with no console errors. Check DevTools > Network to confirm Fontshare CSS loads (status 200).

---

### Task 2: Sticky navigation

**Files:**
- Modify: `pluginlive/landing/index.html` — add nav CSS to `<style>`, replace `<!-- NAV — Task 2 -->` with HTML

- [ ] **Step 1: Add nav CSS inside `<style>` before the closing `</style>` tag**

```css
/* =========================================
   NAVIGATION
========================================= */
#nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-page);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

#nav.scrolled {
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-16);
  height: 64px;
  display: flex;
  align-items: center;
  gap: var(--space-10);
}

.nav-wordmark {
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  flex: 1;
  justify-content: center;
}

.nav-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.15s ease;
}
.nav-link:hover { color: var(--text-primary); }

.nav-actions { flex-shrink: 0; }

.nav-hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  min-width: 44px;
  min-height: 44px;
  margin-left: auto;
}
.nav-hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.nav-hamburger[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.nav-hamburger[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}
.nav-hamburger[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.nav-mobile {
  display: none;
  padding: var(--space-4) var(--space-16) var(--space-6);
  background: var(--bg-page);
  border-bottom: 1px solid var(--border-default);
}
.nav-mobile[aria-hidden="false"] { display: block; }
.nav-mobile ul { display: flex; flex-direction: column; gap: var(--space-4); }
.nav-mobile .nav-link {
  font-size: var(--text-base);
  display: block;
  padding: var(--space-2) 0;
}
.nav-mobile-cta { width: 100%; justify-content: center; margin-top: var(--space-2); }
```

- [ ] **Step 2: Replace `<!-- NAV — Task 2 -->` with the nav HTML**

```html
<nav id="nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-wordmark" aria-label="PluginLive home">PluginLive</a>
    <ul class="nav-links" role="list">
      <li><a href="#marketplace" class="nav-link">Marketplace</a></li>
      <li><a href="#platform" class="nav-link">Platform</a></li>
      <li><a href="#ai" class="nav-link">AI</a></li>
      <li><a href="#contact" class="nav-link">Pricing</a></li>
    </ul>
    <div class="nav-actions">
      <a href="#contact" class="btn btn-primary">Get started</a>
    </div>
    <button class="nav-hamburger" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="nav-mobile">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div id="nav-mobile" class="nav-mobile" aria-hidden="true" role="region" aria-label="Mobile navigation">
    <ul role="list">
      <li><a href="#marketplace" class="nav-link">Marketplace</a></li>
      <li><a href="#platform" class="nav-link">Platform</a></li>
      <li><a href="#ai" class="nav-link">AI</a></li>
      <li><a href="#contact" class="nav-link">Pricing</a></li>
      <li><a href="#contact" class="btn btn-primary nav-mobile-cta">Get started</a></li>
    </ul>
  </div>
</nav>
<main>
```

Also add closing `</main>` before the `<script>` tag.

- [ ] **Step 3: Verify**

Open file in browser at 1440px. Expected: nav bar 64px tall, wordmark left, links centred, "Get started" cobalt button right. Scroll down 20px — expected: bottom border + shadow appear. Resize to 390px — expected: links hidden, hamburger visible (44×44px touch target). Click hamburger — expected: mobile menu drops down.

---

### Task 3: Hero section (100vh)

**Files:**
- Modify: `pluginlive/landing/index.html`

- [ ] **Step 1: Add hero CSS inside `<style>`**

```css
/* =========================================
   HERO
========================================= */
#hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 0 var(--space-24);
  position: relative;
  overflow: hidden;
  background: var(--bg-page);
  gap: var(--space-16);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 560px;
}

.hero-eyebrow {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-brand);
  margin-bottom: var(--space-4);
}

.hero-heading {
  font-size: var(--text-3xl);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
  line-height: 1.05;
  margin: 0 0 var(--space-6);
}

.hero-sub {
  font-size: var(--text-base);
  line-height: 26px;
  color: var(--text-muted);
  margin: 0 0 var(--space-10);
  max-width: 480px;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 500px;
}

.hero-arcs {
  width: 100%;
  max-width: 640px;
}

.hero-arc {
  opacity: 0.3;
}

@media (prefers-reduced-motion: no-preference) {
  .hero-arc { animation: arc-breathe 4s ease-in-out infinite; }
  .hero-arc:nth-child(1) { animation-delay: 0s; }
  .hero-arc:nth-child(2) { animation-delay: 0.6s; }
  .hero-arc:nth-child(3) { animation-delay: 1.2s; }
  .hero-arc:nth-child(4) { animation-delay: 1.8s; }
  .hero-arc:nth-child(5) { animation-delay: 2.4s; }
  .hero-arc:nth-child(6) { animation-delay: 3.0s; }

  @keyframes arc-breathe {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.6; }
  }
}
```

- [ ] **Step 2: Replace `<!-- HERO — Task 3 -->` with the hero HTML**

```html
<section id="hero" aria-label="Hero — Hire at every altitude">
  <div class="hero-content fade-up">
    <span class="hero-eyebrow">AI-Powered Talent Marketplace</span>
    <h1 class="hero-heading">Hire at every altitude.</h1>
    <p class="hero-sub">India's AI-powered talent marketplace — connecting 500+ institutions, 2M+ students, and 1,000+ corporates on one intelligent platform.</p>
    <div class="hero-ctas">
      <a href="#contact" class="btn btn-primary">Start hiring</a>
      <a href="#contact" class="btn btn-ghost">For institutions →</a>
    </div>
  </div>
  <div class="hero-visual" aria-hidden="true">
    <svg class="hero-arcs" viewBox="0 0 700 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-25, 350, 350)">
        <ellipse cx="350" cy="350" rx="500" ry="195" stroke="#494FDF" stroke-width="1"   class="hero-arc"/>
        <ellipse cx="350" cy="350" rx="420" ry="160" stroke="#494FDF" stroke-width="1"   class="hero-arc"/>
        <ellipse cx="350" cy="350" rx="340" ry="125" stroke="#494FDF" stroke-width="1.2" class="hero-arc"/>
        <ellipse cx="350" cy="350" rx="260" ry="90"  stroke="#494FDF" stroke-width="1.2" class="hero-arc"/>
        <ellipse cx="350" cy="350" rx="180" ry="58"  stroke="#494FDF" stroke-width="1.5" class="hero-arc"/>
        <ellipse cx="350" cy="350" rx="100" ry="28"  stroke="#494FDF" stroke-width="2"   class="hero-arc"/>
      </g>
    </svg>
  </div>
</section>
```

- [ ] **Step 3: Verify at 1440px, 820px, 390px**

1440px: heading is 64px, bold, two-column layout (text left, arcs right), arcs gently pulse. 820px: layout still two-column but tighter. 390px (Task 10 handles full mobile), but heading should not overflow.

---

### Task 4: Marketplace section (~80vh)

**Files:**
- Modify: `pluginlive/landing/index.html`

- [ ] **Step 1: Add marketplace CSS inside `<style>`**

```css
/* =========================================
   MARKETPLACE
========================================= */
#marketplace {
  padding: var(--space-24) 0;
  background: var(--bg-page);
}

.marketplace-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.marketplace-header { margin-bottom: var(--space-16); }

.node-diagram-wrap {
  margin: var(--space-16) auto;
  max-width: 820px;
}

.node-diagram { width: 100%; }

.flow-dot {
  stroke-dasharray: 0.05 1;
  stroke-dashoffset: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .flow-dot {
    animation: flow-travel 3s linear infinite;
  }
  .flow-dot-delay {
    animation-delay: -1.5s;
  }
  @keyframes flow-travel {
    to { stroke-dashoffset: -1.05; }
  }
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  margin-top: var(--space-16);
}

.stat-card {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  line-height: 1;
  margin-bottom: var(--space-2);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: 20px;
}

.stat-card:nth-child(1) .stat-value { color: var(--color-primary-600); }
.stat-card:nth-child(2) .stat-value { color: var(--color-brand-navy); }
.stat-card:nth-child(3) .stat-value { color: var(--color-brand-amber); }
.stat-card:nth-child(4) .stat-value { color: var(--color-brand-orange); }
```

- [ ] **Step 2: Replace `<!-- MARKETPLACE — Task 4 -->` with HTML**

```html
<section id="marketplace" aria-label="Marketplace">
  <div class="marketplace-inner">
    <div class="marketplace-header fade-up">
      <span class="section-overline">The network</span>
      <h2 class="section-heading">Where talent finds its match. At scale.</h2>
      <p class="section-body">PluginLive is not another job board. It is the intelligent layer between institutions that produce talent and companies that need it — with AI doing the matching, scoring, and routing automatically.</p>
    </div>

    <div class="node-diagram-wrap" aria-label="Network diagram showing PluginLive connecting Corporates with Institutions and Students">
      <svg class="node-diagram" viewBox="0 0 800 260" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PluginLive marketplace network: Corporates on the left, PluginLive in the centre, Institutions and Students on the right, connected by animated arcs">
        <!-- Connection background lines -->
        <path d="M 185,130 Q 285,70 325,130" stroke="#E2E2E7" stroke-width="2" fill="none"/>
        <path d="M 475,130 Q 515,70 615,130" stroke="#E2E2E7" stroke-width="2" fill="none"/>

        <!-- Animated travelling dots -->
        <path pathLength="1" d="M 185,130 Q 285,70 325,130" stroke="#494FDF" stroke-width="5" stroke-linecap="round" fill="none" class="flow-dot"/>
        <path pathLength="1" d="M 475,130 Q 515,70 615,130" stroke="#494FDF" stroke-width="5" stroke-linecap="round" fill="none" class="flow-dot flow-dot-delay"/>

        <!-- Left node: Corporates -->
        <circle cx="120" cy="130" r="65" fill="#F4F4F4" stroke="#E2E2E7" stroke-width="1.5"/>
        <text x="120" y="126" text-anchor="middle" fill="#191C1F" font-family="Satoshi, system-ui, sans-serif" font-size="13" font-weight="600">Corporates</text>
        <text x="120" y="146" text-anchor="middle" fill="#505A63" font-family="Satoshi, system-ui, sans-serif" font-size="11">1,000+ hiring</text>

        <!-- Centre node: PluginLive -->
        <circle cx="400" cy="130" r="76" fill="#494FDF"/>
        <text x="400" y="125" text-anchor="middle" fill="white" font-family="Satoshi, system-ui, sans-serif" font-size="15" font-weight="700">PluginLive</text>
        <text x="400" y="146" text-anchor="middle" fill="rgba(255,255,255,0.65)" font-family="Satoshi, system-ui, sans-serif" font-size="11">AI Network</text>

        <!-- Right node: Institutions + Students -->
        <circle cx="680" cy="130" r="65" fill="#F4F4F4" stroke="#E2E2E7" stroke-width="1.5"/>
        <text x="680" y="118" text-anchor="middle" fill="#191C1F" font-family="Satoshi, system-ui, sans-serif" font-size="13" font-weight="600">Institutions</text>
        <text x="680" y="136" text-anchor="middle" fill="#191C1F" font-family="Satoshi, system-ui, sans-serif" font-size="13" font-weight="600">+ Students</text>
        <text x="680" y="154" text-anchor="middle" fill="#505A63" font-family="Satoshi, system-ui, sans-serif" font-size="11">500+ · 2M+</text>
      </svg>
    </div>

    <div class="stats-row">
      <div class="stat-card fade-up">
        <div class="stat-value" data-countup="40000" data-suffix="+">40,000+</div>
        <div class="stat-label">Candidates assessed simultaneously</div>
      </div>
      <div class="stat-card fade-up">
        <div class="stat-value" data-countup="500" data-suffix="+">500+</div>
        <div class="stat-label">Institutions onboarded</div>
      </div>
      <div class="stat-card fade-up">
        <div class="stat-value" data-countup="1000" data-suffix="+">1,000+</div>
        <div class="stat-label">Corporates hiring</div>
      </div>
      <div class="stat-card fade-up">
        <div class="stat-value" data-countup="48" data-suffix=" hr">48 hr</div>
        <div class="stat-label">Average time to first shortlist</div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Open at 1440px. Expected: overline + heading + body text visible, three-node SVG diagram centred with dots animating along connecting arcs, 4 stat cards in a row with cobalt / navy / amber / orange value colours.

---

### Task 5: AI Layer section (~90vh, dark)

**Files:**
- Modify: `pluginlive/landing/index.html`

- [ ] **Step 1: Add AI section CSS inside `<style>`**

```css
/* =========================================
   AI SECTION
========================================= */
#ai {
  background: var(--bg-brand);
  padding: var(--space-24) 0;
}

#ai .section-overline {
  color: rgba(255,255,255,0.45);
}

#ai .section-heading {
  color: var(--text-inverse);
}

#ai .section-body {
  color: rgba(255,255,255,0.65);
}

.ai-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.ai-header { margin-bottom: var(--space-16); }

.ai-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: start;
}

.ai-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.ai-card {
  background: #141414;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-md);
  padding: var(--space-6);
}

.ai-card-icon {
  width: 36px;
  height: 36px;
  margin-bottom: var(--space-4);
  color: var(--color-primary-300);
}

.ai-card-title {
  font-size: var(--text-md);
  font-weight: 500;
  color: var(--text-inverse);
  margin-bottom: var(--space-3);
}

.ai-card-body {
  font-size: var(--text-sm);
  line-height: 20px;
  color: rgba(255,255,255,0.55);
}

/* Signal filter dots */
.signal-wrap {
  position: relative;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#signal-dots {
  position: relative;
  width: 320px;
  height: 280px;
}

.signal-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-neutral-400);
  opacity: 0.6;
  transform: scale(1);
  transition: opacity 0.5s ease, background 0.3s ease, transform 0.3s ease;
}

.signal-dot.faded {
  opacity: 0.12;
}

.signal-dot.highlighted {
  background: var(--color-primary-600);
  opacity: 1;
  transform: scale(1.5);
  box-shadow: 0 0 8px rgba(73, 79, 223, 0.5);
}
```

- [ ] **Step 2: Replace `<!-- AI — Task 5 -->` with HTML**

```html
<section id="ai" aria-label="AI Intelligence Layer">
  <div class="ai-inner">
    <div class="ai-header fade-up">
      <span class="section-overline">Intelligence layer</span>
      <h2 class="section-heading">Cut the noise. Find the quality hiring.</h2>
      <p class="section-body">Every resume looks the same. Every role description reads the same. PluginLive's AI reads between the lines — matching on capability signals, not keyword overlap — so the right candidates surface without manual triage.</p>
    </div>

    <div class="ai-layout">
      <div class="ai-cards fade-up">
        <!-- Card 1: Smart matching -->
        <article class="ai-card">
          <svg class="ai-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="6"/>
            <circle cx="12" cy="12" r="2"/>
            <line x1="22" y1="12" x2="18" y2="12"/>
            <line x1="6"  y1="12" x2="2"  y2="12"/>
            <line x1="12" y1="2"  x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
          </svg>
          <h3 class="ai-card-title">Smart matching</h3>
          <p class="ai-card-body">Role criteria are parsed against assessed capability profiles — not just resume keywords. Ranked shortlists in minutes, not days.</p>
        </article>
        <!-- Card 2: Automated screening -->
        <article class="ai-card">
          <svg class="ai-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <h3 class="ai-card-title">Automated screening</h3>
          <p class="ai-card-body">Proctored assessments at 10,000+ concurrent candidates. Scores, flags, and recommendations delivered before a recruiter opens the inbox.</p>
        </article>
        <!-- Card 3: Predictive readiness -->
        <article class="ai-card">
          <svg class="ai-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
            <polyline points="16 7 22 7 22 13"/>
          </svg>
          <h3 class="ai-card-title">Predictive readiness</h3>
          <p class="ai-card-body">Students are scored on domain readiness before they apply. Institutions see gaps. Recruiters see signals. Everyone moves faster.</p>
        </article>
      </div>

      <div class="signal-wrap" aria-label="AI signal filter visualization — showing quality candidates emerging from a large pool" role="img">
        <div id="signal-dots"></div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Open at 1440px. Expected: near-black `#0A0A0A` section background, three cards on dark surface `#141414`, cobalt icons, muted text. Signal dots container shows (empty now — JS fills it in Task 9). On mobile 390px the layout should not overflow (Task 10 handles column stacking).

---

### Task 6: Platform section (~70vh)

**Files:**
- Modify: `pluginlive/landing/index.html`

- [ ] **Step 1: Add platform CSS inside `<style>`**

```css
/* =========================================
   PLATFORM
========================================= */
#platform {
  padding: var(--space-24) 0;
  background: var(--bg-surface);
}

.platform-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.platform-header { margin-bottom: var(--space-16); }

/* Pipeline flow */
.pipeline {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  margin-bottom: var(--space-16);
  align-items: stretch;
}

.pipeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

/* Arrow connector between steps */
.pipeline-step:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 28px;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 10px solid var(--border-default);
  z-index: 1;
}

.pipeline-card {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-6) var(--space-4);
  width: calc(100% - var(--space-4));
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.pipeline-step:nth-child(3) .pipeline-card {
  border-color: var(--border-brand);
  border-left-width: 3px;
}

.pipeline-icon {
  width: 32px;
  height: 32px;
  color: var(--color-primary-600);
}

.pipeline-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
}

/* Feature split */
.feature-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
}

.feature-col-heading {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: var(--text-base);
  color: var(--text-body);
  line-height: 24px;
}

.feature-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 3px;
  color: var(--color-primary-600);
}
```

- [ ] **Step 2: Replace `<!-- PLATFORM — Task 6 -->` with HTML**

```html
<section id="platform" aria-label="Platform features">
  <div class="platform-inner">
    <div class="platform-header fade-up">
      <span class="section-overline">The engine</span>
      <h2 class="section-heading">One pipeline. Zero chaos.</h2>
      <p class="section-body">Behind the marketplace is a full-stack hiring platform — built for the complexity of campus drives, not retrofitted from enterprise HR tools.</p>
    </div>

    <div class="pipeline fade-up" aria-label="Hiring pipeline: Post Role, Screen and Assess, Shortlist, Evaluation Rounds, Hire">
      <div class="pipeline-step">
        <div class="pipeline-card">
          <svg class="pipeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
          <span class="pipeline-label">Post Role</span>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-card">
          <svg class="pipeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span class="pipeline-label">Screen &amp; Assess</span>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-card">
          <svg class="pipeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          <span class="pipeline-label">Shortlist</span>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-card">
          <svg class="pipeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          <span class="pipeline-label">Evaluation Rounds</span>
        </div>
      </div>
      <div class="pipeline-step">
        <div class="pipeline-card">
          <svg class="pipeline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span class="pipeline-label">Hire</span>
        </div>
      </div>
    </div>

    <div class="feature-split fade-up">
      <div class="feature-col">
        <h3 class="feature-col-heading">For Corporates</h3>
        <ul class="feature-list" role="list">
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            ATS with drive management
          </li>
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Evaluation round configuration
          </li>
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Bulk candidate actions
          </li>
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Drive reports and analytics
          </li>
        </ul>
      </div>
      <div class="feature-col">
        <h3 class="feature-col-heading">For Institutions</h3>
        <ul class="feature-list" role="list">
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Student readiness tracking
          </li>
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Placement pipeline visibility
          </li>
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            College acceptance management
          </li>
          <li class="feature-item">
            <svg class="feature-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            Academic calendar-aligned dashboards
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Open at 1440px. Expected: `--bg-surface` (`#F4F4F4`) section, 5 pipeline cards in a row with arrow connectors between them, "Shortlist" card has cobalt left border (3px), two feature columns with cobalt checkmarks.

---

### Task 7: Social Proof section (~50vh)

**Files:**
- Modify: `pluginlive/landing/index.html`

- [ ] **Step 1: Add trust section CSS inside `<style>`**

```css
/* =========================================
   SOCIAL PROOF / TRUST
========================================= */
#trust {
  padding: var(--space-24) 0;
  background: var(--bg-page);
}

.trust-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.trust-header { margin-bottom: var(--space-16); }

.logo-strip {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-16);
}

.logo-slot {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-6) var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 72px;
}

.logo-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-400);
  letter-spacing: 0.02em;
}

.testimonial-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-10);
  box-shadow: var(--shadow-sm);
  max-width: 720px;
}

.testimonial-quote {
  font-size: var(--text-md);
  font-weight: 400;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.testimonial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-brand-navy-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-brand-navy);
  flex-shrink: 0;
}

.testimonial-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.testimonial-role {
  font-size: var(--text-xs);
  color: var(--text-muted);
  margin-top: 2px;
}
```

- [ ] **Step 2: Replace `<!-- TRUST — Task 7 -->` with HTML**

```html
<section id="trust" aria-label="Social proof and testimonials">
  <div class="trust-inner">
    <div class="trust-header fade-up">
      <span class="section-overline">Trusted by</span>
      <h2 class="section-heading">The people who move careers forward use PluginLive.</h2>
    </div>

    <div class="logo-strip fade-up" role="list" aria-label="Company logos">
      <div class="logo-slot" role="listitem"><span class="logo-name">Infosys</span></div>
      <div class="logo-slot" role="listitem"><span class="logo-name">HDFC Bank</span></div>
      <div class="logo-slot" role="listitem"><span class="logo-name">Bajaj Auto</span></div>
      <div class="logo-slot" role="listitem"><span class="logo-name">Capgemini</span></div>
      <div class="logo-slot" role="listitem"><span class="logo-name">L&amp;T</span></div>
      <div class="logo-slot" role="listitem"><span class="logo-name">Wipro</span></div>
    </div>

    <div class="testimonial-card fade-up">
      <blockquote>
        <p class="testimonial-quote">"We ran our entire campus drive for 18 colleges and 3,400 candidates through PluginLive. What used to take six weeks of coordination took eleven days."</p>
        <footer class="testimonial-author">
          <div class="testimonial-avatar" aria-hidden="true">PM</div>
          <div>
            <div class="testimonial-name">Priya Mehta</div>
            <div class="testimonial-role">Campus Recruitment Head, Bajaj Auto</div>
          </div>
        </footer>
      </blockquote>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Verify**

Open at 1440px. Expected: 6 grey company logo slots in a row, testimonial card with "PM" avatar in navy-subtle circle, blockquote text at `--text-md` (20px).

---

### Task 8: CTA section + Footer

**Files:**
- Modify: `pluginlive/landing/index.html`

- [ ] **Step 1: Add CTA + footer CSS inside `<style>`**

```css
/* =========================================
   CTA / FOOTER
========================================= */
#contact {
  padding: var(--space-24) 0 var(--space-20);
  background: var(--bg-brand-subtle);
}

.contact-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-16);
}

.contact-header {
  text-align: center;
  margin-bottom: var(--space-16);
}

.contact-heading {
  font-size: var(--text-2xl);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  color: var(--text-primary);
  margin-bottom: var(--space-4);
}

.contact-sub {
  font-size: var(--text-base);
  color: var(--text-muted);
  max-width: 520px;
  margin: 0 auto;
  line-height: 24px;
}

.cta-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  max-width: 780px;
  margin: 0 auto;
}

.cta-card {
  background: var(--bg-page);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-10);
  box-shadow: var(--shadow-sm);
}

.cta-card-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: var(--space-3);
}

.cta-card-heading {
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
  letter-spacing: var(--tracking-tight);
}

footer {
  background: var(--bg-surface);
  border-top: 1px solid var(--border-default);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.footer-copy {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.footer-links {
  display: flex;
  gap: var(--space-6);
}

.footer-link {
  font-size: var(--text-sm);
  color: var(--text-muted);
  transition: color 0.15s ease;
}
.footer-link:hover { color: var(--text-primary); }
```

- [ ] **Step 2: Replace `<!-- CONTACT/FOOTER — Task 8 -->` with HTML**

Place this after the closing `</main>` tag, before `<script>`:

```html
<section id="contact" aria-label="Get started with PluginLive">
  <div class="contact-inner">
    <div class="contact-header fade-up">
      <h2 class="contact-heading">Plug in. Level up.</h2>
      <p class="contact-sub">Whether you're hiring from campuses or placing students into careers, PluginLive is the platform built for what's next.</p>
    </div>

    <div class="cta-cards fade-up">
      <article class="cta-card">
        <p class="cta-card-label">For corporates</p>
        <h3 class="cta-card-heading">Start hiring smarter</h3>
        <a href="mailto:demo@pluginlive.com" class="btn btn-primary">Request a demo →</a>
      </article>
      <article class="cta-card">
        <p class="cta-card-label">For institutions</p>
        <h3 class="cta-card-heading">Get your campus placed</h3>
        <a href="mailto:join@pluginlive.com" class="btn btn-primary">Join the network →</a>
      </article>
    </div>
  </div>
</section>

<footer role="contentinfo">
  <div class="footer-inner">
    <span class="footer-copy">PluginLive &copy; 2026</span>
    <nav class="footer-links" aria-label="Footer navigation">
      <a href="#" class="footer-link">Privacy</a>
      <a href="#" class="footer-link">Terms</a>
      <a href="mailto:hello@pluginlive.com" class="footer-link">Contact</a>
    </nav>
  </div>
</footer>
```

- [ ] **Step 3: Verify**

Open at 1440px. Expected: `--bg-brand-subtle` (`#EDEDFB`) section, "Plug in. Level up." heading at 48px, two CTA cards side by side with cobalt "Request a demo" and "Join the network" buttons, footer strip below with muted copy.

---

### Task 9: JavaScript — all interactivity

**Files:**
- Modify: `pluginlive/landing/index.html` — replace `/* JS — Task 9 */` inside `<script>`

- [ ] **Step 1: Replace the `<script>` block contents with the full JS**

```javascript
(function () {
  'use strict';

  /* ── Nav scroll shadow ──────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

  /* ── Hamburger toggle ───────────────────────── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ── Signal filter dots ─────────────────────── */
  var signalAnimated = false;
  var signalContainer = document.getElementById('signal-dots');

  function buildSignalDots() {
    if (!signalContainer) return;
    var cols = 8, rows = 5;
    var colW = 100 / cols;
    var rowH = 100 / rows;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var dot = document.createElement('div');
        dot.className = 'signal-dot';
        var jitterX = (Math.random() - 0.5) * colW * 0.6;
        var jitterY = (Math.random() - 0.5) * rowH * 0.6;
        dot.style.left  = (c * colW + colW / 2 + jitterX) + '%';
        dot.style.top   = (r * rowH + rowH / 2 + jitterY) + '%';
        signalContainer.appendChild(dot);
      }
    }
  }

  function animateSignalDots() {
    if (signalAnimated || !signalContainer) return;
    signalAnimated = true;
    var dots = Array.from(signalContainer.querySelectorAll('.signal-dot'));
    var total = dots.length;
    var highlightCount = 6;
    var highlighted = new Set();
    while (highlighted.size < highlightCount) {
      highlighted.add(Math.floor(Math.random() * total));
    }
    dots.forEach(function (dot, i) {
      setTimeout(function () {
        dot.classList.add(highlighted.has(i) ? 'highlighted' : 'faded');
      }, i * 18);
    });
  }

  buildSignalDots();

  /* ── Count-up ───────────────────────────────── */
  function countUp(el, target, suffix, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var value    = Math.floor(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var countedUp = false;
  function triggerCountUp() {
    if (countedUp) return;
    countedUp = true;
    document.querySelectorAll('[data-countup]').forEach(function (el) {
      var target   = parseInt(el.getAttribute('data-countup'), 10);
      var suffix   = el.getAttribute('data-suffix') || '';
      countUp(el, target, suffix, 1500);
    });
  }

  /* ── Fade-up entrance ───────────────────────── */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      // already has opacity:0 from CSS
    });
  } else {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── IntersectionObserver ───────────────────── */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Fade-up children
        if (!prefersReducedMotion) {
          var fadeEls = entry.target.querySelectorAll('.fade-up');
          if (entry.target.classList.contains('fade-up')) {
            setTimeout(function () {
              entry.target.classList.add('visible');
            }, 0);
          }
          fadeEls.forEach(function (el, i) {
            setTimeout(function () {
              el.classList.add('visible');
            }, i * 80);
          });
        }

        // Count-up on marketplace section
        if (entry.target.id === 'marketplace') triggerCountUp();

        // Signal filter on AI section
        if (entry.target.id === 'ai') {
          setTimeout(animateSignalDots, 400);
        }

        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('section, #hero').forEach(function (el) {
      io.observe(el);
    });
  } else {
    // Fallback: show everything
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.classList.add('visible');
    });
    triggerCountUp();
    setTimeout(animateSignalDots, 500);
  }

  // Trigger hero immediately (already in viewport)
  setTimeout(function () {
    document.querySelectorAll('#hero .fade-up').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('visible'); }, i * 80);
    });
  }, 100);

}());
```

- [ ] **Step 2: Verify**

Open at 1440px. Check:
1. Hero text fades in within 0.5s of page load
2. Scroll to Marketplace — stat numbers count up (0 → 40,000+, 500+, 1,000+, 48 hr)
3. Scroll to AI section — grey dots appear, then most fade, 6 snap to cobalt with slight scale
4. Scroll past any section — headings/cards slide up from 24px below
5. Resize to 390px, click hamburger — mobile menu opens/closes

---

### Task 10: Responsive CSS (640px breakpoint)

**Files:**
- Modify: `pluginlive/landing/index.html` — add media query block to `<style>`

- [ ] **Step 1: Add responsive CSS at the end of `<style>` before `</style>`**

```css
/* =========================================
   RESPONSIVE — 640px mobile
========================================= */
@media (max-width: 640px) {
  /* Nav */
  .nav-inner { padding: 0 var(--space-6); }
  .nav-links, .nav-actions { display: none; }
  .nav-hamburger { display: flex; }

  /* Hero */
  #hero {
    grid-template-columns: 1fr;
    padding: var(--space-20) var(--space-6) var(--space-12);
    min-height: auto;
    padding-top: 100px;
  }
  .hero-heading { font-size: 40px; }
  .hero-visual { min-height: 260px; }
  .hero-visual svg { max-width: 320px; }

  /* Marketplace */
  .marketplace-inner,
  .platform-inner,
  .trust-inner,
  .ai-inner,
  .contact-inner { padding: 0 var(--space-6); }

  .node-diagram-wrap { overflow-x: auto; }
  .node-diagram { min-width: 560px; }

  .stats-row {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  /* AI */
  .ai-layout { grid-template-columns: 1fr; }
  .signal-wrap { display: none; }

  /* Platform */
  .pipeline {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  .pipeline-step::after { display: none; }
  .pipeline-card { width: 100%; flex-direction: row; gap: var(--space-4); }

  .feature-split { grid-template-columns: 1fr; }

  /* Trust */
  .logo-strip { grid-template-columns: repeat(3, 1fr); }

  /* CTA */
  .cta-cards { grid-template-columns: 1fr; }
  .contact-header { text-align: left; }
  .contact-sub { margin: 0; }

  /* Footer */
  .footer-inner { flex-direction: column; align-items: flex-start; gap: var(--space-3); }

  /* Containers */
  #marketplace, #ai, #platform, #trust, #contact { padding: var(--space-16) 0; }
}

/* =========================================
   RESPONSIVE — 820px tablet
========================================= */
@media (max-width: 820px) and (min-width: 641px) {
  .nav-inner { padding: 0 var(--space-8); }
  #hero { padding: 0 var(--space-8); }
  .marketplace-inner, .platform-inner, .trust-inner, .ai-inner, .contact-inner { padding: 0 var(--space-8); }
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .pipeline { grid-template-columns: repeat(3, 1fr); }
  .pipeline-step:nth-child(4), .pipeline-step:nth-child(5) {
    grid-column: span 1;
  }
  .logo-strip { grid-template-columns: repeat(3, 1fr); }
}
```

- [ ] **Step 2: Verify at all three viewports**

**1440px:** Full two-column hero, 4-column stats, horizontal pipeline with arrows, 6-logo strip.

**820px:** Two-column stats, three-column pipeline, three-column logos. Hero layout still two-column.

**390px:** Single-column hero (heading 40px), 2×2 stats, vertical pipeline cards, single-column features and CTAs, hamburger nav.

Confirm zero horizontal scroll at all three widths.

---

### Task 11: Create landing directory and start dev server

**Files:**
- Create: `pluginlive/landing/` directory (already done in Task 1)

- [ ] **Step 1: Confirm `pluginlive/landing/index.html` exists**

```powershell
Test-Path "pluginlive\landing\index.html"
```

Expected output: `True`

- [ ] **Step 2: Check if `serve` is available, install if not**

```powershell
npx serve --version
```

If that errors, run: `npm install -g serve`

- [ ] **Step 3: Start the dev server on port 3001**

```powershell
npx serve pluginlive\landing -p 3001 --no-clipboard
```

Expected output:
```
   ┌──────────────────────────────────────────┐
   │                                          │
   │   Serving!                               │
   │                                          │
   │   - Local:    http://localhost:3001      │
   │   - Network:  http://x.x.x.x:3001       │
   │                                          │
   └──────────────────────────────────────────┘
```

- [ ] **Step 4: Open and do final cross-viewport verification**

Open `http://localhost:3001` in a browser. Run through this checklist:

| Check | Expected |
|---|---|
| Fontshare loads | Network tab shows 200 for fontshare CDN |
| Hero heading | 64px, weight 700, arcs animating on right |
| Nav scroll | Shadow appears after scrolling 8px |
| Marketplace diagram | Dots travel along arcs in 3s loop |
| Stat count-up | Numbers count from 0 on scroll |
| AI section | Near-black bg, 3 cards, dots filter animation |
| Platform pipeline | 5 steps, cobalt left border on Shortlist |
| Testimonial | "PM" navy avatar, blockquote text |
| CTA section | bg-brand-subtle, two cobalt CTA cards |
| No horizontal scroll | At 1440px, 820px, 390px |
| prefers-reduced-motion | DevTools > Rendering > Emulate — animations disabled |

---

## Self-Review Checklist

- [x] All 6 sections present with exact copy from spec
- [x] All CSS custom properties from spec declared in `:root` with exact hex values
- [x] CTA fills: only `--color-primary-600` (#494FDF) — brand-navy/amber/orange never used as button fill
- [x] Border radius capped at 6px throughout (`--radius-md`); no pill shapes except `.testimonial-avatar` (avatar circle)
- [x] `prefers-reduced-motion` wraps all keyframe animations and fade-up transitions
- [x] ARIA labels on all SVG illustrations and icon-only buttons (`nav-hamburger`)
- [x] `id="contact"` on Section 6 so hero "Start hiring" / "For institutions →" anchor links resolve
- [x] Stat count-up: uses `data-countup` + `data-suffix` attributes, consistent with JS implementation
- [x] Signal dot animation references `signal-dots` id, consistent with HTML
- [x] Mobile: hero heading drops to 40px, stats 2×2, pipeline vertical, feature split single-column
- [x] Touch targets: `.btn` min-height 44px, `.nav-hamburger` min 44×44px
- [x] Valid HTML5 semantics: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<blockquote>`
