/*
 * CUPRA Training Experience – Pitch-Prototyp
 * Zentrale Konfiguration. Alles, was vor dem Pitch angepasst werden muss, steht hier.
 */
window.CTE_CONFIG = {
  /** Deploy-URL der Streak Challenge (ohne Slash am Ende). */
  challengeUrl: "https://cuprastreak-challenge.vercel.app",

  /** Basis für den Rückweg. null = window.location.origin (Standard). */
  returnBase: null,

  /** Pitch-Tag, nur zur Orientierung. Die Countdowns laufen auf die Werte unter `unlock`. */
  pitchDate: "2026-09-18T09:00:00+02:00",

  /** Freischaltzeitpunkte der gesperrten Kapitel (ISO 8601 mit Zeitzone). */
  unlock: {
    craftsmanship: "2026-09-21T09:00:00+02:00",
    performance: "2026-09-25T09:00:00+02:00",
    tribe: "2026-09-28T09:00:00+02:00",
  },

  points: {
    /** Bonus für den Content Drop */
    drop: 40,
    /** Umrechnung Streak-Wert der Challenge → Punkte */
    perStreak: 30,
    /** Obergrenze der Challenge-Punkte */
    challengeMax: 300,
    /** Demo-Wert, wenn die Challenge keinen Wert zurückgibt */
    fallbackScore: 240,
    /** Maximal erreichbare Punkte im Kapitel ORIGIN */
    chapterMax: 400,
  },

  intro: {
    /** Abstand, in dem die vier Claim-Zeilen erscheinen */
    lineDelayMs: 2200,
    /** Ab wann der Skip-Button sichtbar ist */
    skipAfterMs: 2000,
    /** Wie lange der zusammengesetzte Claim am Ende steht */
    holdMs: 3000,
  },

  drop: {
    /** Nach dieser Zeit erscheint „+40 pts" von selbst */
    revealAfterMs: 3000,
  },

  chapters: [
    {
      id: "origin",
      name: "ORIGIN",
      claim: "The one who knows the roots.",
      open: true,
    },
    {
      id: "craftsmanship",
      name: "CRAFTSMANSHIP",
      claim: "The one who masters the craft.",
      teaser: "Materials, seams, the hands behind the new model. You will know why every detail is there.",
    },
    {
      id: "performance",
      name: "PERFORMANCE",
      claim: "The one who feels the drive.",
      teaser: "Numbers you feel before you read them. Torque, range, and the moment the road answers.",
    },
    {
      id: "tribe",
      name: "TRIBE",
      claim: "The one they follow. You.",
      teaser: "Where knowledge becomes trust. The Competition opens here.",
    },
  ],

  copy: {
    homeIntro:
      "Four chapters. Two weeks. One goal: Become the CUPRA 1st. Every point counts – the reveal comes with the Competition.",
    mystery: "Every point counts. The reveal comes with the Competition.",
    resultFeedback: "Strong start. You know what CUPRA stands for.",
    resultFeedbackLow: "The roots run deep. Every point still counts.",
    badgeTitle: "The one who knows the roots.",
  },
};
