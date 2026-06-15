# PluginLive Landing Page: Narration and Story Walkthrough

A plain-language guide to how the homepage is built, what each section is doing,
why it sits where it sits, and which copywriting frameworks hold the whole story
together.

This document describes the live production homepage (`src/app/(marketing)/page.tsx`,
which renders `MarketingLanding` with the gradient-bar hero). Read it top to
bottom and you will understand the page the way a visitor experiences it: as one
continuous argument that moves a stranger from "who are you" to "book a
walkthrough".

---

## 1. The one-line story

> **PluginLive turns hiring from guesswork into proof. It sources talent, its AI
> assesses real ability, and it helps them upskill the gap on the same platform,
> so corporates hire with proof, institutes place with proof, and every learner
> becomes role-ready, from campus freshers all the way up to the C-suite.**

Everything on the page is in service of that single sentence. The headline word
that carries it is **Altitude**: one platform that works at every level of hire,
the way a single aircraft can operate at every altitude.

---

## 2. Who the page is talking to

The page speaks to three audiences at once and never makes them feel like an
afterthought:

| Audience | What they want | Where the page speaks to them |
|---|---|---|
| **Corporate HR / Recruiters** | Quality and speed of hire, proof, audit trail | Hero, "Hire" pillar, case studies |
| **Institutes / TPOs** | Placement rate, batch onboarding, outcomes they can show | "Place" pillar, institute voices, closing band |
| **Students / Freshers** | A fair shot, readiness, opportunity | "Train" pillar, upskilling card |

The clever move is that all three are framed as one network. Corporates bring
demand, institutes bring supply, students are the talent flowing between them.
The page sells the network, not three separate products.

---

## 3. Site map and information architecture

This is the order a visitor scrolls through. Read it as a story spine, where
each block hands off to the next.

```
┌─────────────────────────────────────────────────────────────────┐
│  NAV       Stack · Why Us · Platform ·          [Schedule a       │
│  (sticky)  Case Studies                          Walkthrough]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1 · HERO  (dark)                                                 │
│     "Hire / Assess / Grow at every ALTITUDE."                     │
│     Animated gradient bars + two CTAs                             │
│     ▸ HOOK + PROMISE                                              │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  2 · PROBLEM → SOLUTION  (light, scroll-fill text)                │
│     "Hiring still runs on guesswork..."                           │
│        → "PluginLive's AI assesses talent on real ability..."    │
│     ▸ THE PAIN, THEN THE TURN                                     │
├─────────────────────────────────────────────────────────────────┤
│  3 · THE HIRING STACK  (light, flip cards) — nav "Stack"          │
│     "The hiring stack, assembled."                                │
│     Sourcing · Evaluation · Upskilling  +  proof stats           │
│     ▸ WHAT WE DO, AT EVERY LEVEL                                  │
├─────────────────────────────────────────────────────────────────┤
│  4 · INFRASTRUCTURE  (dark, scroll-pinned layers)                 │
│     "The infrastructure behind every outcome."                    │
│     Intelligence → Data → Network                                 │
│     ▸ WHY IT WORKS / HOW IT'S BUILT                               │
├─────────────────────────────────────────────────────────────────┤
│  5 · PLATFORM  (light, stacked cards) — nav "Platform"            │
│     Hire / Place / Train pillars, each with its own page link    │
│     ▸ PICK YOUR DOOR IN                                           │
├─────────────────────────────────────────────────────────────────┤
│  6 · CORPORATE CASE STUDIES  (light, proof)                     │
│     "Hires that closed because of the network."                 │
│     Logo marquee ("Trusted by recruiters at") + HDFC, Kotak,    │
│     Mahindra, NSE, Infosys outcomes                             │
│     Desktop: framed featured+grid · Mobile: swipe carousel      │
│     ▸ PROOF IT WORKS (corporate side)                           │
├─────────────────────────────────────────────────────────────────┤
│  7 · INSTITUTE CASE STUDIES  (light, proof)                     │
│     "And on the Institutes side." Logo marquee ("Trusted by     │
│     placement teams at") + TPO testimonials                     │
│     Desktop: 4×2 bento · Mobile: swipe carousel                 │
│     ▸ PROOF IT WORKS (institute side)                           │
├─────────────────────────────────────────────────────────────────┤
│  8 · CLOSING CTA  (dark)                                          │
│     "Hire, place, or train, we'll meet you there."               │
│     Two-card audience split + Schedule a Walkthrough             │
│     ▸ THE ASK                                                     │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER         link grid + wordmark                              │
└─────────────────────────────────────────────────────────────────┘
```

### The dark / light reading rhythm

Notice the alternation: dark hero, light, light, dark, light, light, light,
dark. The near-black bands act like chapter breaks. They signal "now we are
talking about the big idea" (hero, infrastructure, the final ask), while the
white bands carry the practical, scannable content (what we do, the proof). This
rhythm keeps a long scroll from feeling like one flat wall of text.

---

## 4. Section-by-section narration

### Section 1 — Hero: the hook and the promise

**What the visitor sees:** A near-black screen with fifteen vertical bars that
breathe and shimmer, tallest in the centre. The headline lands in two beats: a
rotating verb cycles **Hire / Assess / Grow** above "at every", then a huge
serif **Altitude** holds beneath it. A subhead follows, then two buttons: a
solid **Schedule a Walkthrough** and an outline **See how it works**.

**The exact copy:**
- Headline: *Hire / Assess / Grow at every Altitude* (the verb rotates)
- Subhead: *One AI-powered platform that sources talent, assesses real ability,
  upskills the gaps, and lands ranked shortlists in 48 hours.*

**Significance:** This is the whole pitch compressed into one screen. The word
"Altitude" is the page's signature hook. It does triple duty: it implies range
(every level of hire), it implies ascent (people and companies moving up), and
it gives the page a memorable single word to own. The gradient bars are not
decoration for its own sake. They read as a rising chart, a visual stand-in for
measured capability and growth.

The subhead leads with **AI-powered** on purpose, and the rotating verbs give
all three pillars a turn above the fold: Hire (corporates), Assess (the
platform's engine), Grow (upskilling, phrased so it covers every level rather
than just freshers). AI is the engine the whole page runs on, so it is named in
the first screen rather than left as an under-the-hood detail. The same claim
recurs at the problem→solution turn ("PluginLive's AI assesses talent"), in the
Evaluation stage card ("AI-proctored assessments"), on all three offering
pillars, in the case-studies subhead ("Same AI assessment engine underneath"),
and as the Intelligence layer of the infrastructure section, so the AI thread
runs the full length of the page. The companion thread is **assess then
upskill**: the platform scores real ability first, then helps the candidate
close the gap, and that pairing repeats in the hero, the solution statement,
the stages, the Place and Train pillars, and the closing CTA.

**How it connects:** It makes a big claim on purpose. A big claim creates a small
doubt ("can they really do all of that?"), and the next section is built to
answer that doubt before it hardens.

**Focus point:** One dominant action, **Schedule a Walkthrough**. The second
button is quieter (outline) so the eye is never split.

---

### Section 2 — Problem then solution: the turn

**What the visitor sees:** A calm light band of large text. As you scroll, the
words "fill in" one at a time, from a faint grey to full ink. The problem
sentence resolves first in black, then the solution sentence resolves in cobalt.

**The exact copy:**
- Problem: *Hiring still runs on guesswork. Resumes hide real ability, ready
  talent goes unseen, and the roles that matter stay open.*
- Solution: *PluginLive's AI assesses talent on real ability, then helps them
  upskill the gap on one platform, so employers hire with proof and every
  learner walks in role-ready.*

**Significance:** This is the emotional core of the page and the clearest single
use of a framework on the whole site. It names the pain (guesswork, hidden
ability, unfilled roles) and then turns to the fix. The scroll-fill animation is
doing narrative work: the grey-to-ink reveal makes the reader feel the shift from
fog to clarity, and the cobalt colour on the solution literally brands the
resolution.

**How it connects:** The hero made the promise; this section earns the right to
make it by first agreeing with the reader's frustration. People accept a solution
faster once they feel understood. From here on, the page is allowed to talk about
features because it has paid for that right with empathy.

**Focus point:** The colour change. Black problem, cobalt solution. The reader
absorbs "the cobalt one is the way out" without being told.

---

### Section 3 — The hiring stack: what we do, at every level

**What the visitor sees:** Three cards on white under the heading *The hiring
stack, assembled.*, each with a large isometric icon. A small plus button flips
each card to reveal a plain-language explanation. Below them, four big proof
numbers.

**The three cards:**

| Card | Front line | What it means |
|---|---|---|
| **Sourcing** | "Scored on merit." | Source across 540+ campuses into one pre-vetted pool, every candidate traceable to the institution that sourced them |
| **Evaluation** | "One objective bar." | AI-proctored assessments score and rank every candidate on the same standard, so shortlists are comparable, traceable, and defensible |
| **Upskilling** | "Ready for interviews." | AI maps each candidate's gaps against what the role demands, then helps them upskill on live benchmarks until they clear the assessment |

**The proof numbers:** 2.4M+ candidates onboarded, 800+ corporate partners,
1,200+ institutes and NGOs connected, 62% faster time to offer.

**Significance:** This is the assess-then-upskill engine shown as machinery.
Sourcing fills the pool, Evaluation puts every candidate through the same
AI-proctored bar, and Upskilling closes the gaps the assessment found, which is
the proof that "assesses real ability, upskills the gaps" is a pipeline and not
a slogan. The flip interaction respects the reader: the headline is for
skimmers, the back of the card is for people who want detail. Nobody is forced
to read more than they want.

**How it connects:** The previous section promised "AI assesses on real ability,
then helps them upskill the gap". This section shows the machinery of exactly
that, then immediately backs it with hard numbers so the claim does not float.

**Focus point:** Evaluation sits in the middle on purpose. Assessment is the
hinge of the stack: everything before it feeds candidates in, everything after
it acts on what the assessment found.

---

### Section 4 — Infrastructure: why it works

**What the visitor sees:** Back to the dark band. The section pins to the screen
while you scroll, and three layers reveal one at a time next to an isometric cube
whose faces lift and glow as each layer becomes active.

**The three layers:**

| Layer | The claim | The supporting tags |
|---|---|---|
| **Intelligence** | Every candidate scored before you see them; AI separates signal from noise | AI-Scoring, Unified Framework, 48hr Shortlist |
| **Data** | 2.4M+ candidates assessed, 540+ colleges, 28 states, scored on one AI-calibrated scale | 2.4M+ candidates, 540+ colleges, 28 states |
| **Network** | Corporate demand and institutional supply joined in one coordinated layer: drives confirmed, candidates upskilled, placements closed | Corporate pipelines, Real-time outcomes, 540+ institutes |

Heading: *The infrastructure behind every outcome.*
Supporting line: *Built in layers, so every assessment makes the next outcome
faster.*

**Significance:** This is the credibility and defensibility section. The earlier
blocks said "we score and upskill"; this one explains the stack that makes it
possible, and why a competitor cannot easily copy it. The "built in layers"
message hints at a flywheel: more assessments produce more data, which produces
better intelligence, which produces faster hires, placements, and upskilling
outcomes. That is the moat, shown rather than boasted.

**How it connects:** It converts interest into belief. By now the reader likes
the idea; this section gives the analytical buyer (the corporate HR head) the
reasons to trust it. The dark surface signals "this is the serious, under-the-hood
part".

**Focus point:** The flywheel idea. Each layer feeds the next, which is also why
the visual is a single cube with three faces rather than three separate objects.

---

### Section 5 — Platform (Hire / Place / Train): pick your door in

**What the visitor sees:** Three large cards on white that stack and gently scale
as you scroll, each with its own colour accent and a small illustrative graphic
(a ranked shortlist, a live placements feed, a skill-readiness checklist).

**The three pillars:**

| Pillar | Colour | Headline | The AI beat | Links to |
|---|---|---|---|---|
| **Hire** | Cobalt | "Hire proven talent, from campus to C-suite" | An AI-assessed talent network that scores and ranks every candidate; a hire-train-deploy track that upskills people to day-one ready | `/hire` |
| **Place** | Amber | "Place more students, and prove the outcome" | Onboard a batch once, AI assesses every student and helps them upskill to recruiter readiness | `/place` |
| **Train** | Orange | "Upskill anyone into role-ready talent" | AI maps each learner's gaps to courses recruiters actually screen for, then re-assesses until they're role-ready | `/train` |

All three pillars carry the AI thread explicitly: the recruiter door leads with
AI-assessed ranking, the institute door with assess-and-upskill to readiness,
and the learner door with AI-mapped gap closing. No audience gets a version of
the product without the engine.

**Significance:** This is the page's routing table. Up to now everyone read the
same story. Here the single network splits cleanly into the three doors that
match the three audiences, each with its own colour, its own proof stat, and its
own page. The top nav points here with the "Platform" link, and the footer
repeats the three pillar links, so the navigation and the page tell the same
story.

**How it connects:** The page has earned trust; now it gives each visitor a
specific next step that fits them. A recruiter takes the cobalt door, a TPO takes
amber, a learner takes orange. This is the moment the page turns from "here is what
we are" into "here is your path".

**Focus point:** Colour-as-audience. The same three colours (cobalt, amber,
orange) recur across the audience surfaces, so the reader is being quietly
taught a colour language for the brand.

---

### Section 6 and 7 — Proof: it actually works

**What the visitor sees:** Two light proof bands, one per buyer. Each opens with a
heading, runs a **horizontal logo marquee** (recognised marks scrolling and fading
toward a pinned label on the left), then presents case-study outcomes with named
people and real numbers, and closes on a one-line social-proof bar. The two bands
share one framing device: faint hairline **rails** with small **"+" corner
crosses** marking the cell intersections (the same detached-cross treatment used
across the marketing surfaces).

**Section 6 — Corporate case studies (`CaseStudiesShowcase`).**
- Heading: *Hires that closed because of the network.*
- Subhead: *Three domains. Five hiring problems. Same AI assessment engine
  underneath.*
- Logo marquee, labelled *Trusted by recruiters at*: 360 ONE, Goldman Sachs,
  KPMG, NSE (greyscale, brightening on hover).
- Five outcomes, one per hiring problem (HDFC Bank leads as the featured card):
  - **HDFC Bank** — "Three weeks of shortlisting became two days, and every
    decision carried an audit trail our risk team could sign off." *48 hr JD to
    ranked shortlist · 8,000+ candidates per drive.* (Rohan Mehta, Head of Talent
    Acquisition)
  - **Kotak** — "Ten wealth hires in two quarters, each one assessed on client
    conversations, not just the résumé." (Shruti Nair, Head, Wealth Hiring)
  - **Mahindra** — "A Tier-3 engineer out-scored every IIT résumé on file. We made
    the hire." *6.8× wider sourcing pool.* (Karthik Iyer, VP Talent)
  - **NSE** — "From JD to a proctored campus drive in 48 hours. Compliance didn't
    raise a single follow-up." (Vikram Shah, VP Human Resources)
  - **Infosys** — "We ran a 12,000-candidate drive with two coordinators and zero
    compliance gaps." (Rhea Kapoor, Head of Campus Hiring)
- Social-proof bar: *10,000+ candidates assessed per drive · 4.9 from 500+
  assessments.*

**Section 7 — Institute case studies (`CandidateVoices`).**
- Heading: *And on the Institutes side.*
- Logo marquee, labelled *Trusted by placement teams at*: JBIMS, Naralkar
  Institute, Swadha Foundation.
- Four TPO / placement-director testimonials:
  - **NIT Trichy** — *+34% placement rate lift.* (Dr. Rajesh Menon, Training &
    Placement Officer)
  - **BVCE Pune** — *12 new companies in year one.* (Prof. Sunita Deshmukh,
    Placement Director)
  - **PSG Tech** — *2 wk scheduling time saved.* (Arun Krishnamurthy, Training &
    Placement Officer)
  - **Christ University** — *Real-time, board-ready reporting.* (Dr. Meera Iyer,
    Dean of Placements)
- Social-proof bar: *540+ partner institutes across India · 4.8 from TPO
  feedback* (amber rating stars).

**Responsive shape:** on desktop both bands lay their cases out as one connected
framed block (Section 6: a full-width featured card over a four-card grid;
Section 7: a 4×2 bento), every cell sharing the rails and corner crosses, each
card snap-filling its cell on hover. **Below `lg` both collapse to a swipeable
carousel**: one uniform fixed-height card at a time inside a single cross-framed
cell, with swipe plus prev / dot / next controls. Same proof, re-flowed so a
phone shows one clean card instead of a cramped grid.

**Significance:** Claims are cheap; proof is expensive. After the page has
explained itself, it hands the microphone to customers. Splitting corporate proof
from institute proof matters because the two buyers trust different evidence: a
recruiter wants brand-name logos and time-to-offer, a TPO wants placement rate
and a named peer at another college. The marquee borrows recognition fast; the
named cases do the slow convincing.

**How it connects:** This is the de-risking step right before the ask. The reader
is close to acting but wants reassurance that other people like them already did
and it worked. The two-sided proof covers both buyers without diluting either.

**Focus point:** Named humans with real titles and specific numbers, not generic
five-star blurbs. Specifics read as true.

---

### Section 8 — Closing CTA: the ask

**What the visitor sees:** The final dark band with a soft cobalt glow. One
centred line, then two cards (one for hirers, one for placement seekers), then a
single shared button.

**The exact copy:**
- Heading: *Hire, place, or train, we'll meet you there.*
- Hire card: *Campus to senior mandates. Hire from a network that's AI-assessed
  and upskilled before you see them... Your first drive ships in days.*
- Place card: *Onboard your batch once. Upskill and assess them to recruiter
  readiness, then track invitations and outcomes in one dashboard. Built for
  accredited institutions and NGOs.*

**Significance:** This is the conversion moment, and it deliberately echoes the
hero's rotating verbs (Hire, Assess, Grow become hire, place, train) so the page
closes the loop it opened. The two cards re-confirm the audience split one last
time, then collapse into one action so there is no decision paralysis about which
button to press.

**How it connects:** It returns to the dark surface of the hero, which makes the
page feel like a complete circle: it began with a promise on black and ends with
the ask on black. The reader has travelled the full argument and arrives back
where they started, now ready to say yes.

**Focus point:** A single shared CTA (Schedule a Walkthrough) even though there
are two audience cards. One ask, one click.

---

## 5. The frameworks at work

The page is not built on one framework but layered with several, each doing a
different job. Here is how they map.

### AIDA (Attention, Interest, Desire, Action)

The macro spine of the whole page.

| AIDA stage | Where it lives | How it shows up |
|---|---|---|
| **Attention** | Hero | Animated bars + the "Altitude" hook grab the eye |
| **Interest** | Problem→Solution, Stages | Names a real pain, then shows what the platform does about it |
| **Desire** | Infrastructure, Pillars, Proof | Builds belief (the stack), gives a path (3 doors), removes doubt (logos) |
| **Action** | Closing CTA | One clear ask: Schedule a Walkthrough |

### PAS / PSA (Problem, Agitate, Solution)

The micro engine inside Section 2, and the logic of the first half of the page.

| PAS stage | Copy on the page |
|---|---|
| **Problem** | "Hiring still runs on guesswork." |
| **Agitate** | "Resumes hide real ability, ready talent goes unseen, and the roles that matter stay open." |
| **Solution** | "PluginLive's AI assesses talent on real ability, then helps them upskill the gap on one platform..." |

### Hook, Story, Offer

The three-act shape of the page as a whole.

| Act | Section | Job |
|---|---|---|
| **Hook** | Hero | The "Altitude" promise that stops the scroll |
| **Story** | Sections 2 to 7 | Problem, capability, proof, the journey from fog to confidence |
| **Offer** | Closing CTA | The walkthrough invitation |

### StoryBrand (the customer is the hero, the brand is the guide)

The page never makes PluginLive the hero. The buyer is the hero with a problem
(hiring guesswork); PluginLive is the guide with a plan (source, assess, upskill)
that leads to success (proof-based hires, higher placements, ready careers). The
closing line "we'll meet you there" is pure guide language.

### Supporting techniques

| Technique | Where | Why it helps |
|---|---|---|
| **Rule of three** | 3 stage cards, 3 infra layers, 3 pillars | Three is the most memorable, most complete-feeling count |
| **Social proof / authority** | Logos + named testimonials | Borrowed trust from recognised brands and real peers |
| **Specificity over adjectives** | "48 hr", "62% faster", "2.4M+" | Concrete numbers read as honest; vague praise does not |
| **Colour as language** | Cobalt = hire, amber = place, orange = train | Teaches an audience map the reader absorbs without effort |
| **Progressive disclosure** | Flip cards, scroll-pinned layers | Skimmers get headlines, the curious get depth, nobody is overloaded |
| **Visual metaphor** | Rising bars, layered cube | The animation argues the point (growth, a stacked moat) silently |

---

## 6. How the dots connect: the argument in one paragraph

The page makes a promise (hire, assess, and grow at every altitude), admits the
reader's pain (hiring is guesswork), turns that pain into a fix (AI assesses
real ability, then helps them upskill the gap), proves the fix is a pipeline
(sourcing into evaluation into upskilling, backed by numbers), explains why it
works and cannot be
easily copied (intelligence, data, and network compounding on each other), hands
each audience a door that fits them (hire, place, train), removes the last doubt
with named proof from both buyer types, and then asks for the one action it has
been building toward the entire time (schedule a walkthrough). Every section is a
link in that chain, and removing any one of them would leave a gap the reader
would feel.

---

## 7. The main hooks and focus points at a glance

| Element | Type | Why it matters |
|---|---|---|
| **"Altitude"** | Primary hook | One word that owns range, ascent, and memorability |
| **Gradient bars** | Visual hook | A rising chart that means measured growth |
| **Grey-to-cobalt fill** | Emotional hook | Makes the reader feel the shift from guesswork to proof |
| **"Built in layers, so every assessment makes the next outcome faster"** | Strategic hook | Signals the flywheel and the moat |
| **Assess then upskill** | Narrative thread | The platform scores real ability first, then helps close the gap; repeats in hero, solution, stack, pillars, and close |
| **Hire / Place / Train** | Routing hook | Three clear doors matching three audiences |
| **"We'll meet you there"** | Closing hook | Guide language that lowers the barrier to acting |
| **Schedule a Walkthrough** | Primary CTA | The single action repeated at top, hero, and close |

---

*This document describes the homepage as it ships today (`MarketingLanding`
with the gradient-bar hero, June 2026 AI-forward narration; the two proof bands
run logo marquees and collapse to swipe carousels below `lg`). If the section
order, copy, or hero variant changes, update the site map in Section 3 and the
section narration in Section 4 to match.*
