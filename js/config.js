/*
 * CUPRA Training Experience – Pitch-Prototyp (Konzept v2.0)
 * Zentrale Konfiguration. Alles, was vor dem Pitch angepasst werden muss, steht hier.
 */
window.CTE_CONFIG = {
  /** Deploy-URL der Streak Challenge (ohne Slash am Ende). */
  challengeUrl: "https://cuprastreak-challenge.vercel.app",

  /** Basis für den Rückweg. null = window.location.origin (Standard). */
  returnBase: null,

  /** Pitch-Tag, nur zur Orientierung. Die Countdowns laufen auf die Werte unter `unlock`. */
  pitchDate: "2026-09-18T09:00:00+02:00",

  /** Freischaltzeitpunkte der Kapitel mit echtem Countdown (ISO 8601 mit Zeitzone). */
  unlock: {
    k3: "2026-09-23T09:00:00+02:00",
    k4: "2026-09-27T09:00:00+02:00",
  },

  points: {
    /** Bonus für den Nugget (Content Drop) */
    nugget: 40,
    /** Fester Demo-Wert der K1-Challenge „Known or New?" */
    challenge: 240,
    /** Punkte pro richtiger Karte in der gemockten Challenge (2 richtige = 240) */
    perCard: 120,
    /** Maximal erreichbare Punkte pro Kapitel */
    chapterMax: 400,
    /** Gesamtpunkte der abgeschlossenen Phase 0 (Archiv) */
    phase0Total: 1240,
  },

  demo: {
    rank: 47,
    streakBest: 12,
    streakGlobalBest: 31,
    avgTime: "1.8s",
  },

  opener: {
    /** Abstand, in dem die vier Claim-Zeilen erscheinen */
    lineDelayMs: 1500,
    /** Ab wann der Skip-Button sichtbar ist */
    skipAfterMs: 2000,
    /** Standzeit des zusammengesetzten Claims */
    claimHoldMs: 2400,
    /** Standzeit der Phase-0-Badges */
    badgesHoldMs: 2400,
    /** Standzeit der Schlusszeile, danach automatisch Home */
    outroHoldMs: 3200,
  },

  nugget: {
    /** Nach dieser Zeit erscheint „+40 pts" von selbst */
    revealAfterMs: 3000,
  },

  /** Delta-Profil, feste Demo-Werte. band: solid | sharpen | delta */
  delta: {
    dimensions: [
      { id: "product", name: "Product knowledge", band: "sharpen" },
      { id: "segment", name: "Segment & customer", band: "delta" },
      { id: "competition", name: "Competition", band: "sharpen" },
      { id: "brand", name: "Brand & conviction", band: "solid" },
      { id: "fleet", name: "Fleet", band: "delta" },
    ],
    feedback: "Your biggest lever right now: Segment & customer. K2 is built for exactly that.",
    k1Chip: "Your Delta: Product knowledge · Sharpen",
  },

  /** Home-Karten der Phase 1 */
  chapters: [
    { id: "delta", kind: "scan", index: "Delta Scan", name: "Your starting point", hint: "Completed · 5 dimensions", nav: "/profile", image: "/assets/figma/thumb-born-in-barcelona.jpg" },
    { id: "k1", index: "K1", name: "Refresher", sub: "Prepares all three workshops", nav: "/k1", image: "/assets/figma/card-origin.jpg" },
    {
      id: "k2", index: "K2", name: "Segment & Target Customer", lock: "after-k1", lockText: "Unlocks after K1", image: "/assets/figma/card-craftsmanship.jpg",
      teaser: "Who buys the new model, and why. Built for your biggest Delta: Segment & customer.",
    },
    {
      id: "k3", index: "K3", name: "Competition", lock: "countdown", image: "/assets/figma/card-performance.jpg",
      teaser: "The three cars your customers compare against, and the one argument that wins.",
    },
    {
      id: "k4", index: "K4", name: "Brand & Conviction", lock: "countdown", image: "/assets/figma/card-tribe.jpg",
      teaser: "What CUPRA stands for when nobody is reading the spec sheet.",
    },
    {
      id: "pc", index: "Final", name: "Performance Check", lock: "after-k4", lockText: "Unlocks after K4", image: "/assets/figma/thumb-born-in-barcelona.jpg",
      teaser: "Your Delta Scan, played again. See how far you moved.",
    },
  ],

  /** K1-Challenge „Known or New?", gemockt als Screen-Sequenz */
  k1: {
    nugget: {
      title: "Tech Overview",
      meta: "1:30 min",
      eyebrow: "K1 Refresher · Nugget",
      thumb: "/assets/figma/card-performance.jpg",
      headline: "What changed under the skin.",
      body: "Ninety seconds on the new model's platform, battery and cockpit. Watch it once, keep the bonus.",
    },
    challenge: {
      title: "Known or New?",
      meta: "Swipe · ~3 min",
      points: "up to 300 pts",
      thumb: "/assets/figma/card-craftsmanship.jpg",
      rule: "Three features of the new model. Decide for each: known from the previous model, or new? One tap per card.",
      cards: [
        {
          feature: "Coast-to-coast light bar",
          detail: "A single light signature running the full width of the rear.",
          outcome: "correct",
          verdict: "New",
          explain: "Correct. The previous model had separate tail lights.",
        },
        {
          feature: "Digital cockpit 12.3''",
          detail: "Fully digital instrument display behind the wheel.",
          outcome: "wrong",
          verdict: "Known",
          explain: "Known from the previous model. The 12.3'' cockpit was already on board.",
        },
        {
          feature: "Bidirectional charging",
          detail: "The car feeds energy back into the home or the grid.",
          outcome: "correct",
          verdict: "New",
          explain: "Correct. Vehicle-to-home arrives with the new model.",
        },
      ],
    },
    result: { headline: "Strong recall", line: "You know more than you think." },
    badge: { name: "Refresher", state: "Complete", line: "You're ready for the workshops." },
  },

  /** Phase 0 im Archiv */
  phase0: {
    title: "Become the CUPRA 1st",
    chapters: [
      { name: "Origin", claim: "The one who knows the roots.", image: "/assets/figma/card-origin.jpg" },
      { name: "Craftsmanship", claim: "The one who masters the craft.", image: "/assets/figma/card-craftsmanship.jpg" },
      { name: "Performance", claim: "The one who feels the drive.", image: "/assets/figma/card-performance.jpg" },
      { name: "Tribe", claim: "The one they follow. You.", image: "/assets/figma/card-tribe.jpg" },
    ],
    finalBadge: "CUPRA 1st",
  },

  /** Leaderboard-Demo (Kann): 8 fiktive Zeilen pro Sicht, eigene Position 47 */
  leaderboard: {
    views: [
      {
        id: "global", label: "Global",
        rows: [["Marta L.", 2860], ["Jonas K.", 2795], ["Aitor E.", 2740], ["Sophie R.", 2690], ["Luca B.", 2655], ["Nina P.", 2610], ["Diego M.", 2580], ["Emma S.", 2545]],
        me: [47, 1520],
      },
      {
        id: "market", label: "Market",
        rows: [["Jonas K.", 2795], ["Sophie R.", 2690], ["Nina P.", 2610], ["Emma S.", 2545], ["Felix W.", 2490], ["Lea H.", 2430], ["Tim B.", 2380], ["Mara V.", 2340]],
        me: [12, 1520],
      },
      {
        id: "role", label: "Role",
        rows: [["Marta L.", 2860], ["Aitor E.", 2740], ["Luca B.", 2655], ["Diego M.", 2580], ["Felix W.", 2490], ["Ines C.", 2455], ["Tim B.", 2380], ["Paul N.", 2310]],
        me: [31, 1520],
      },
    ],
  },

  /** Startzustand des Prototyps: 0 = Phase 0 nach Figma (Become the CUPRA 1st), 1 = Phase 1 (Digital Campaign, Konzept v2). Umschalten per /?phase=0|1 oder im Profil. */
  phaseDefault: 0,

  /** Videodateien (MP4/WebM unter /assets/video/). Leer = gemockter Screen ohne echtes Video. */
  video: {
    intro: "",
    storyCapsule: "",
    /** Dauer des Intro-Platzhalters, wenn kein Video hinterlegt ist */
    introFallbackMs: 6000,
  },

  /** Phase 0 nach Figma CUPRA-GLT-27 (Intro, Dashboard, Kapitel ORIGIN) */
  p0: {
    introFixed: "The one",
    introLines: ["who knows the roots.", "who masters the craft.", "who feels the drive.", "they follow. you."],
    intro: { lineDelayMs: 1500, skipAfterMs: 2000 },
    copy: {
      eyebrow: "Training experience",
      headline: "Be the one they follow",
      intro: "Four chapters. One goal: Become the CUPRA 1st. Every point counts.",
      programLabel: "Delta",
    },
    unlock: {
      craftsmanship: "2026-09-21T09:00:00+02:00",
      performance: "2026-09-25T09:00:00+02:00",
      tribe: "2026-09-28T09:00:00+02:00",
    },
    chapters: [
      { id: "origin", index: "Chapter 01", name: "Origin", claim: "The one who knows the roots.", image: "/assets/figma/card-origin.jpg", open: true },
      { id: "craftsmanship", index: "Chapter 02", name: "Craftmanship", claim: "The one who masters the craft.", image: "/assets/figma/card-craftsmanship.jpg", teaser: "Materials, seams, the hands behind the new model." },
      { id: "performance", index: "Chapter 03", name: "Performance", claim: "The one who feels the drive.", image: "/assets/figma/card-performance.jpg", teaser: "Numbers you feel before you read them." },
      { id: "tribe", index: "Chapter 04", name: "Tribe", claim: "The one they follow. You.", image: "/assets/figma/card-tribe.jpg", teaser: "Where knowledge becomes trust. The Competition opens here." },
    ],
    nugget: {
      title: "Story Capsule",
      meta: "1:20 min",
      eyebrow: "Origin · Content Nugget",
      headline: "Where the new model comes from.",
      body: "Ninety seconds on the roots: Barcelona, the racing spirit, the people who shaped it. Watch it once, keep the bonus.",
      thumb: "/assets/figma/card-origin.jpg",
    },
    challenge: {
      title: "Born in Barcelona",
      meta: "~ 3 min",
      points: "up to 300 pts",
      thumb: "/assets/figma/thumb-born-in-barcelona.jpg",
    },
    points: { perStreak: 30, challengeMax: 300, fallbackScore: 240 },
    result: { eyebrow: "Born in Barcelona · Completed", headline: "Strong start", line: "You know what CUPRA stands for." },
    badge: { name: "Origin", state: "Complete", line: "The one who knows the roots." },
  },

  copy: {
    openerLines: [
      "The one who knows the roots.",
      "The one who masters the craft.",
      "The one who feels the drive.",
      "The one they follow. You.",
    ],
    openerOutro1: "Chapter one is complete.",
    openerOutro2: "The Digital Campaign begins.",
    homeEyebrow: "Training experience",
    homeHeadline: "The Digital Campaign",
    homeProgramLabel: "Delta",
    homeIntro: "Four chapters, one Performance Check. Every point counts – the reveal comes with the Competition.",
    archiveRow: "Become the CUPRA 1st · Completed",
    noLeaderboard: "Positions stay hidden until the Competition. Preview with demo data.",
  },
};
