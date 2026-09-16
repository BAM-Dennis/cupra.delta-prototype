# CUPRA Training Experience – Pitch-Prototyp

Mobiler Klick-Prototyp für den Tender-Pitch nach **Konzept v2.0** (`cupra-pitch-prototyp-konzept-v2.md`): Phase 0 „Become the CUPRA 1st" ist abgeschlossen und als Archiv erreichbar, Phase 1 „The Digital Campaign" ist eingeläutet, K1 Refresher ist spielbar, die echte Streak Challenge ist eingebunden.

Statische Web-App ohne Build-Schritt: `index.html`, `css/styles.css`, `js/config.js`, `js/app.js`.
Design nach Figma CUPRA-GLT-27, Referenz ist das Repo `cupra.streak-challenge` (Cupra-Font, Tokens, Hintergründe, Glas-Zeilen, Kupfer-Verlaufsbuttons).

## Lokal starten

```sh
npx serve -s . -l 4173
```

Dann `http://localhost:4173` öffnen. Am Smartphone im gleichen WLAN die IP des Rechners statt localhost verwenden.
Am Desktop erscheint der Inhalt in einem zentrierten Phone-Frame (430 px, wie die Streak Challenge).

## Journey

Opener (Claim → Phase-0-Badges → „The Digital Campaign begins") → Home → Delta-Profil · K1 Refresher → Nugget → Challenge „Known or New?" (3 Karten, gemockt) → Result → Badge → Home (K1 completed, K2 offen) · Streak-Kachel → **Streak Challenge (extern)** → zurück mit Toast · Archiv Phase 0 · Leaderboard-Reveal (Demo) · Teaser bei gesperrten Kapiteln

Routen: `/` `/profile` `/k1` `/k1/nugget` `/k1/challenge` `/k1/challenge/play` `/k1/result` `/k1/badge` `/archive` `/leaderboard`

## Konfiguration (`js/config.js`)

| Schlüssel | Bedeutung |
|---|---|
| `challengeUrl` | Deploy-URL der Streak Challenge |
| `returnBase` | Basis der Rückkehr-URL, `null` = eigene Origin |
| `unlock.k3` / `unlock.k4` | Freischaltzeitpunkte mit echtem Countdown (ISO 8601) |
| `points` | Nugget-Bonus, Challenge-Demo-Wert, Kapitel-Maximum, Phase-0-Summe |
| `demo` | Rang, Streak-Bestwert, globaler Bestwert, Ø-Zeit |
| `opener` / `nugget` | Timings |
| `delta` | Fünf Dimensionen mit Band (solid / sharpen / delta), Feedback-Text |
| `chapters` | Home-Karten inkl. Sperr-Logik und Teaser-Texte |
| `k1` | Nugget, Challenge-Karten (Feature, Outcome, Auflösung), Result, Badge |
| `phase0` | Archiv-Kapitel und Badges |
| `leaderboard` | Demo-Zeilen für Global / Market / Role |

## Integration Streak Challenge

Streak-Kachel und Streak-Tab öffnen die Challenge im selben Tab:

```
{challengeUrl}?return={origin}/?completed=streak
```

Die Challenge zeigt am Ende „Back to training" und hängt den Streak-Wert an:

```
{origin}/?completed=streak&streak=17
```

Der Prototyp übernimmt den Wert als neue Bestleistung (Streak-Kachel „Your best: 17"), zeigt einen Toast und landet auf Home. Ohne Wert bleibt der Demo-Bestwert 12.

## Zustand und Reset

Zustand in `localStorage` unter `cte.v2`: `openerSeen`, `nuggetSeen`, `k1Done`, `k1Score`, `badgeEarned`, `streakBest`.

Reset für den nächsten Pitch:

- `/?reset=1` aufrufen, oder
- 5× auf das Emblem oben links auf Home tippen (innerhalb 2 Sekunden).

Testabkürzung: `/?completed=streak&streak=17` simuliert die Rückkehr aus der Challenge.

## Deployment

Vercel, statisches Projekt ohne Build (Framework Preset „Other", Build Command leer). `vercel.json` enthält den SPA-Rewrite auf `index.html`.

## Assets

- `assets/fonts/` Cupra Light / Book / Regular / Medium (woff2, aus der Streak Challenge)
- `assets/design/` Figma-Export der Streak Challenge: Emblem, Hintergründe, Verlaufsform, Icons, Logo-Dekoration
- `assets/badge-*.svg` Badges mit CUPRA-Emblem in Kupfer (Kapitel), Teal (CUPRA 1st) und gesperrt

## Vor dem Pitch

- [x] `challengeUrl` auf die Vercel-URL der Streak Challenge gesetzt
- [x] Return-Link in der Streak Challenge deployt
- [ ] `unlock.k3` / `unlock.k4` relativ zum Pitch-Tag prüfen (aktuell 23.09. und 27.09.2026)
- [ ] Dreifach-Test iPhone / Android / Desktop inkl. Hin- und Rückweg zur Streak Challenge
- [ ] QR-Code auf Produktions-URL erzeugen, Reset ausführen

## Bewusst nicht umgesetzt (Kann-Stories)

- S12 KI-Coach als statische Screens im Archiv
