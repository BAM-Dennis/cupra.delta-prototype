/*
 * CUPRA Training Experience – Pitch-Prototyp
 * Struktur, Zahlen, Bilder und Zeitpunkte. Alle Teilnehmertexte stehen in js/i18n.js.
 * Die ids hier sind die Schlüssel, unter denen i18n.js die Texte liefert.
 */
window.CTE_CONFIG = {
  /** Deploy-URL der Streak Challenge (ohne Slash am Ende). */
  challengeUrl: "https://cuprastreak-challenge.vercel.app",

  /** Basis für den Rückweg. null = window.location.origin (Standard). */
  returnBase: null,

  /** Startsprache, wenn der Browser keine der angebotenen Sprachen meldet. */
  defaultLocale: "en",

  /** Pitch-Tag, nur zur Orientierung. Die Countdowns laufen auf die Werte unter `unlock`. */
  pitchDate: "2026-09-18T09:00:00+02:00",

  /** Freischaltzeitpunkte der Kapitel mit echtem Countdown (ISO 8601 mit Zeitzone). */
  unlock: {
    k3: "2026-09-23T09:00:00+02:00",
    k4: "2026-09-27T09:00:00+02:00",
  },

  points: {
    /** Fester Demo-Wert der Refresher-Challenge „Known or New?" (2 von 3 richtig) */
    challenge: 200,
    /** Punkte pro richtiger Karte in der gemockten Challenge (3 × 100 = 300 möglich) */
    perCard: 100,
    /** Maximal erreichbare Punkte pro Kapitel. Content Nuggets geben keine Punkte. */
    chapterMax: 300,
    /** Gesamtpunkte der abgeschlossenen Phase 0 (Archiv) */
    phase0Total: 1240,
  },

  /** Entwicklungsansichten. Per /?dev=1 einschaltbar, für Kundenvorführungen aus. */
  dev: {
    /** „Replay reveal" auf dem Leaderboard */
    showReplay: false,
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
    /** Nach dieser Zeit gilt der Nugget als gesehen (keine Punkte) */
    revealAfterMs: 3000,
  },

  /** Delta Scan, feste Demo-Werte. band: solid | sharpen | train */
  delta: {
    dimensions: [
      { id: "product", band: "sharpen" },
      { id: "segment", band: "train" },
      { id: "competitors", band: "sharpen" },
      { id: "brand", band: "solid" },
      { id: "sales", band: "train" },
    ],
  },

  /** Home-Karten der Phase 1 */
  chapters: [
    { id: "delta", kind: "scan", nav: "/profile", image: "/assets/figma/thumb-born-in-barcelona.jpg" },
    { id: "k1", nav: "/chapter/refresher", image: "/assets/figma/card-origin.jpg" },
    { id: "k2", lock: "after-k1", image: "/assets/figma/card-craftsmanship.jpg" },
    { id: "k3", lock: "countdown", image: "/assets/figma/card-performance.jpg" },
    { id: "k4", lock: "countdown", image: "/assets/figma/card-tribe.jpg" },
    { id: "pc", lock: "after-k4", image: "/assets/figma/thumb-born-in-barcelona.jpg" },
  ],

  /** Refresher-Challenge „Known or New?", gemockt als Screen-Sequenz */
  k1: {
    nugget: { thumb: "/assets/figma/card-performance.jpg" },
    challenge: {
      thumb: "/assets/figma/card-craftsmanship.jpg",
      /** outcome steuert den Spielverlauf, die Texte liefert i18n.js */
      cards: [
        { id: "lightbar", outcome: "correct" },
        { id: "cockpit", outcome: "wrong" },
        { id: "v2h", outcome: "correct" },
      ],
    },
  },

  /** Phase 0 im Archiv */
  phase0: {
    chapters: [
      { id: "origin", image: "/assets/figma/card-origin.jpg" },
      { id: "craftsmanship", image: "/assets/figma/card-craftsmanship.jpg" },
      { id: "performance", image: "/assets/figma/card-performance.jpg" },
      { id: "tribe", image: "/assets/figma/card-tribe.jpg" },
    ],
  },

  /** Leaderboard-Demo: 8 fiktive Zeilen pro Sicht, eigene Position 47 */
  leaderboard: {
    views: [
      {
        id: "global",
        rows: [["Marta L.", 2860], ["Jonas K.", 2795], ["Aitor E.", 2740], ["Sophie R.", 2690], ["Luca B.", 2655], ["Nina P.", 2610], ["Diego M.", 2580], ["Emma S.", 2545]],
        me: [47, 1520],
      },
      {
        id: "market",
        rows: [["Jonas K.", 2795], ["Sophie R.", 2690], ["Nina P.", 2610], ["Emma S.", 2545], ["Felix W.", 2490], ["Lea H.", 2430], ["Tim B.", 2380], ["Mara V.", 2340]],
        me: [12, 1520],
      },
      {
        id: "role",
        rows: [["Marta L.", 2860], ["Aitor E.", 2740], ["Luca B.", 2655], ["Diego M.", 2580], ["Felix W.", 2490], ["Ines C.", 2455], ["Tim B.", 2380], ["Paul N.", 2310]],
        me: [31, 1520],
      },
    ],
  },

  /** Startzustand des Prototyps: 0 = Phase 0 (The Brand Chapters), 1 = Phase 1 (Digital Campaign). Umschalten per /?phase=0|1 oder im Profil. */
  phaseDefault: 0,

  /** Videodateien (MP4/WebM unter /assets/video/). Leer = gemockter Screen ohne echtes Video. */
  video: {
    intro: "/assets/video/intro.mp4",
    introPoster: "/assets/video/intro-poster.jpg",
    storyCapsule: "",
    /** Dauer des Intro-Platzhalters, wenn kein Video hinterlegt ist */
    introFallbackMs: 6000,
  },

  /** Phase 0 nach Figma CUPRA-GLT-27 (Intro, Dashboard, Kapitel ORIGIN) */
  p0: {
    intro: { lineDelayMs: 1500, skipAfterMs: 2000 },
    unlock: {
      craftsmanship: "2026-09-21T09:00:00+02:00",
      performance: "2026-09-25T09:00:00+02:00",
      tribe: "2026-09-28T09:00:00+02:00",
    },
    chapters: [
      { id: "origin", image: "/assets/figma/card-origin.jpg", open: true },
      { id: "craftsmanship", image: "/assets/figma/card-craftsmanship.jpg" },
      { id: "performance", image: "/assets/figma/card-performance.jpg" },
      { id: "tribe", image: "/assets/figma/card-tribe.jpg" },
    ],
    nugget: { thumb: "/assets/figma/card-origin.jpg" },
    challenge: { thumb: "/assets/figma/thumb-born-in-barcelona.jpg" },

    /** Hotspot-Challenge „Born in Barcelona" (born-in-barcelona-interaktionskonzept.md) */
    bib: {
      /** Zeit pro Versuch */
      timerMs: 10000,
      /** Punkte: erster Versuch voll, zweiter halb, kein Treffer null (4 × 75 = 300) */
      points: { full: 75, half: 35 },
      /** correct ist der Index in der Antwortliste aus i18n.js, dort steht die richtige Antwort immer zuerst */
      districts: [
        { id: "campnou", correct: 0 },
        { id: "casa", correct: 0 },
        { id: "born", correct: 0 },
        { id: "raval", correct: 0 },
      ],
    },
    points: { perStreak: 30, challengeMax: 300, fallbackScore: 240 },
  },
};
