# CUPRA Training Experience – Pitch-Prototyp

Mobiler Klick-Prototyp für den Tender-Pitch mit **zwei umschaltbaren Zuständen**:

- **Phase 0 „The Brand Chapters"** (Standard) nach Figma CUPRA-GLT-27: Intro mit Textkarussell → Intro-Video → Dashboard mit vier Bild-Kacheln (ORIGIN offen) → Kapitel ORIGIN mit Origin Story und Born in Barcelona → Result → Badge.
- **Phase 1 „The Digital Campaign"** nach Konzept v2.0 (`cupra-pitch-prototyp-konzept-v2.md`): Opener → Home → Delta Scan, K1 Refresher, Archiv, Leaderboard. Optisch im selben Figma-Stil wie Phase 0 (Himmel-Hintergründe, DELTA-Kopf, Bild-Kacheln, Glas-Buttons), zusätzlich mit Bottom-Navigation.

Umschalten per URL `/?phase=0` bzw. `/?phase=1` oder im Profil-Screen unter „Prototype view". Beide Phasen teilen sich das Delta-Profil.

Statische Web-App ohne Build-Schritt: `index.html`, `css/styles.css`, `js/config.js`, `js/app.js`.
Design nach Figma CUPRA-GLT-27, Referenz ist das Repo `cupra.streak-challenge` (Cupra-Font, Tokens, Hintergründe, Glas-Zeilen, Kupfer-Verlaufsbuttons).

## Lokal starten

```sh
npx serve -s . -l 4173
```

Dann `http://localhost:4173` öffnen. Am Smartphone im gleichen WLAN die IP des Rechners statt localhost verwenden.
Am Desktop erscheint der Inhalt in einem zentrierten Phone-Frame (430 px, wie die Streak Challenge).

## Journeys

**Phase 0:** `/` Intro → `/intro/video` → `/` Dashboard → `/chapter/origin` → `/chapter/origin/nugget` (Origin Story) → `/chapter/origin/challenge` (Born in Barcelona) → `/chapter/origin/result` → `/chapter/origin/badge` → Dashboard mit ORIGIN completed. Gesperrte Kapitel zeigen einen Teaser mit Countdown.

## Born in Barcelona (Hotspot-Challenge)

Umsetzung von `born-in-barcelona-interaktionskonzept.md` nach Figma 343:18367 ff. Vier Gebiete auf der Barcelona-Karte (Camp Nou, Casa CUPRA, El Born, El Raval), je eine Frage mit drei Antworten, 10 Sekunden pro Versuch, maximal zwei Versuche.

- Erster Versuch richtig: Gebiet voll kupfer, volle Punkte (75). Zweiter Versuch richtig: Schraffur, halbe Punkte (35). Kein Treffer: Kupfer-Kontur, 0 Punkte, richtige Antwort wird gezeigt.
- Timer-Ablauf zählt als falscher Versuch. Back während einer laufenden Frage öffnet den Exit-Dialog, geclaimte Gebiete bleiben.
- Alle vier geclaimt: Karte pulsiert, dann Result-Screen und Badge „Origin Complete".
- Fragen, Antworten, Auflösungen, Punkte und Timer stehen in `js/config.js` unter `p0.bib`. Die Karte ist eine Inline-SVG aus den Figma-Pfaden in `index.html`, die Gebietszustände werden per CSS-Klasse gefärbt.

**Phase 1:** `/` Opener → Home → `/profile` `/chapter/refresher` `/chapter/refresher/nugget` `/chapter/refresher/challenge` `/chapter/refresher/challenge/play` `/chapter/refresher/result` `/chapter/refresher/badge` `/archive` `/leaderboard`. Streak-Kachel öffnet die Challenge, Rückkehr aktualisiert den Bestwert mit Toast.

## Videos

Das Intro-Video liegt webtauglich unter `assets/video/intro.mp4` (H.264, 720×1280, 3,9 MB, aus dem 34-MB-Original transkodiert) mit Poster `intro-poster.jpg`. Das Original bleibt lokal in `assets/` und ist per `.gitignore` ausgeschlossen. Neu transkodieren:

```sh
ffmpeg -i "assets/Be the one to follow-tall-no-bullring.mp4" -vf scale=720:1280 -c:v libx264 -crf 24 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k assets/video/intro.mp4
```

Die Story Capsule hat noch kein Video. Datei nach `assets/video/` legen und in `js/config.js` unter `video.storyCapsule` eintragen. Ohne Eintrag läuft der Mock (Fortschrittsbalken, +40 nach 3 s). Mit Video startet es per Tap und vergibt den Bonus am Ende.

## Konfiguration (`js/config.js`)

| Schlüssel | Bedeutung |
|---|---|
| `challengeUrl` | Deploy-URL der Streak Challenge |
| `phaseDefault` | Startzustand 0 oder 1 |
| `video` | Pfade zu Intro- und Story-Capsule-Video |
| `p0` | Phase 0: Intro-Zeilen, Dashboard-Texte, Kapitel mit Bildern und Freischaltdaten, Story Capsule, Born in Barcelona, Result, Badge |
| `returnBase` | Basis der Rückkehr-URL, `null` = eigene Origin |
| `unlock.k3` / `unlock.k4` | Freischaltzeitpunkte mit echtem Countdown (ISO 8601) |
| `points` | Challenge-Demo-Wert, Kapitel-Maximum (300), Phase-0-Summe |
| `dev.showReplay` | „Replay reveal" auf dem Leaderboard, per `/?dev=1` einschaltbar |
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

Phase 0: Der Wert wird in Punkte umgerechnet (`p0.points.perStreak` × Streak, Cap 300, Fallback 240), Born in Barcelona gilt als erledigt und der Result-Screen erscheint.
Phase 1: Der Wert wird als neue Bestleistung übernommen (Streak-Kachel „Your best: 17"), Toast, Home. Ohne Wert bleibt der Demo-Bestwert 12.

## Zustand und Reset

## Textstand

Umgesetzt nach `Prototyp_Textaenderungen_Entwicklung.md` (18.09.2026). Die vier Regeln daraus:

1. **Kein CUPRA 1st.** Keine Gesamtauszeichnung, keine fünfte Badge. Das Archiv heißt „The Brand Chapters".
2. **Keine Punkte auf Content.** Content Nuggets vergeben keine Punkte, auch mechanisch nicht. Punkte kommen nur aus Challenges, das Kapitel-Maximum ist damit 300.
3. **Kein K im Interface.** Durchgehend CHAPTER 01 bis CHAPTER 04. Die Phase-1-Routen liegen unter `/chapter/refresher`.
4. **Delta nur für das Fahrzeug.** Die Profilstufe heißt TRAIN statt DELTA, der Chip auf der Kapitelseite FOCUS statt DELTA. Der Screenname Delta Scan bleibt.

Offen laut Dokument: finale Punkthöhen, Phasendauer für den Countdown, Punktabschlag bei Zweitversuchen, Integration der Streak Challenge.

## Zustand und Reset

Zustand in `localStorage` unter `cte.v3`: `phase`, Phase 1 (`openerSeen`, `nuggetSeen`, `k1Done`, `k1Score`, `badgeEarned`, `streakBest`) und Phase 0 unter `p0` (`introSeen`, `nuggetSeen`, `challengeDone`, `challengeScore`, `badgeEarned`).

Reset für den nächsten Pitch:

- `/?reset=1` aufrufen, oder
- 5× auf das Emblem tippen (Phase 0: DELTA-Dreieck auf dem Dashboard, Phase 1: oben links auf Home), innerhalb 2 Sekunden. Die gewählte Phase bleibt erhalten.
- `/?reset=1&phase=1` setzt zurück und wählt die Phase.

Testabkürzung: `/?completed=streak&streak=17` simuliert die Rückkehr aus der Challenge.

## Deployment

Vercel, statisches Projekt ohne Build (Framework Preset „Other", Build Command leer). `vercel.json` enthält den SPA-Rewrite auf `index.html`.

## Assets

- `assets/fonts/` Cupra Light / Book / Regular / Medium (woff2, aus der Streak Challenge)
- `assets/design/` Figma-Export der Streak Challenge: Emblem, Hintergründe, Verlaufsform, Icons, Logo-Dekoration
- `assets/figma/` Figma-Export der Phase-0-Screens (CUPRA-GLT-27): Himmel-Hintergründe, Barcelona-Stadt, Kapitelbilder, Thumbnails, Icons. Bilder auf Webgröße verkleinert (JPEG)
- `assets/badge-*.svg` Badges mit CUPRA-Emblem in Kupfer (Kapitel), Teal (CUPRA 1st) und gesperrt

## Vor dem Pitch

- [x] `challengeUrl` auf die Vercel-URL der Streak Challenge gesetzt
- [x] Return-Link in der Streak Challenge deployt
- [ ] Freischaltdaten prüfen: Phase 0 `p0.unlock` (21.09., 25.09., 28.09.2026), Phase 1 `unlock.k3/k4` (23.09., 27.09.2026)
- [x] Intro-Video eingebunden
- [ ] Story-Capsule-Video anfordern und in `video.storyCapsule` eintragen
- [ ] Dreifach-Test iPhone / Android / Desktop inkl. Hin- und Rückweg zur Streak Challenge
- [ ] QR-Code auf Produktions-URL erzeugen, Reset ausführen

## Bewusst nicht umgesetzt (Kann-Stories)

- S12 KI-Coach als statische Screens im Archiv
