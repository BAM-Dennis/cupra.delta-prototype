# CUPRA Training Experience – Pitch-Prototyp

Mobiler Klick-Prototyp für den Tender-Pitch (Konzept: `cupra-pitch-prototyp-konzept.md`).
Statische Web-App ohne Build-Schritt: `index.html`, `css/styles.css`, `js/config.js`, `js/app.js`.

## Lokal starten

```sh
npx serve -s . -l 4173
# oder
python3 -m http.server 4173
```

Dann `http://localhost:4173` auf dem Smartphone (gleiches WLAN, IP statt localhost) oder am Desktop öffnen.
Am Desktop erscheint der Inhalt in einem zentrierten Phone-Frame (480 px).

`serve -s` liefert für jeden Pfad `index.html` aus (SPA-Modus). Bei `python3 -m http.server` funktionieren Deep-Links wie `/badge` nicht, der Einstieg über `/` schon.

## Journey

Intro → Home → ORIGIN → Content Drop → Challenge-Interstitial → **Streak Challenge (extern)** → Result → Badge → Home (Rückkehrzustand) · Profil · Teaser bei gesperrten Kapiteln

## Konfiguration (`js/config.js`)

| Schlüssel | Bedeutung |
|---|---|
| `challengeUrl` | Deploy-URL der Streak Challenge. **Vor dem Pitch eintragen.** |
| `returnBase` | Basis der Rückkehr-URL, `null` = eigene Origin |
| `unlock.*` | Freischaltzeitpunkte der gesperrten Kapitel (ISO 8601). Countdowns laufen echt. |
| `points` | Drop-Bonus, Punkte pro Streak, Cap, Demo-Fallback |
| `intro` / `drop` | Timings der Intro-Animation und des Content-Drop-Mockups |
| `chapters` / `copy` | Texte |

## Integration Streak Challenge

Der Prototyp öffnet die Challenge im selben Tab mit

```
{challengeUrl}?return={origin}/?completed=spirit
```

Die Challenge zeigt am Ende „Back to training" und hängt den Streak-Wert an:

```
{origin}/?completed=spirit&streak=8
```

Punkte = `min(challengeMax, streak × perStreak)`, also 8 × 30 = 240. Alternativ wird `&score=240` direkt übernommen. Ohne Parameter gilt `fallbackScore` (240). Bei mehrfachem Spielen zählt der beste Wert.

Die passende Anpassung der Streak Challenge liegt im Repo `cupra.streak-challenge` auf dem Branch `feature/return-link`.

## Zustand und Reset

Zustand liegt in `localStorage` unter `cte.state` (`introSeen`, `dropSeen`, `spiritDone`, `challengeScore`, `badgeEarned`).

Reset für den nächsten Pitch:

- `/?reset=1` aufrufen, oder
- 5× auf das Logo oben links auf Home tippen (innerhalb 2 Sekunden).

Testabkürzung ohne Challenge: `/?completed=spirit&streak=8`

## Deployment

Vercel, statisches Projekt ohne Build (Framework Preset „Other", Output Directory `.`). `vercel.json` enthält den SPA-Rewrite.
QR-Code auf die Produktions-URL erzeugen.

## Vor dem Pitch

- [x] `challengeUrl` in `js/config.js` auf die Vercel-URL der Streak Challenge gesetzt
- [ ] Streak-Challenge-Branch `feature/return-link` mergen und deployen
- [ ] `unlock.*` relativ zum Pitch-Tag prüfen (aktuell 21.09., 25.09., 28.09.2026)
- [ ] CI-Assets tauschen: Farb-Tokens in `css/styles.css` (`:root`), Font-Link in `index.html`, Key-Visual (`.card__thumb--barcelona`, `.video__still--barcelona`), Logo und Badges in `assets/`
- [ ] Dreifach-Test iPhone / Android / Desktop ohne Sackgasse
- [ ] QR-Code erzeugen, Reset ausführen

## Stand-ins

Es liegen noch keine CI-Assets vor. Kupfer `#C1875A`, Barlow Condensed (Google Fonts) und die abstrakten SVG-Grafiken sind Platzhalter und zentral tauschbar.
