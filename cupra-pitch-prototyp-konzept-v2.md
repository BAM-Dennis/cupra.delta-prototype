# CUPRA Training Experience – Pitch-Prototyp

**Konzept v2.0 · Stand 16.09.2026 · Sapered GmbH**
Ersetzt die Fassungen „cupra-pitch-prototyp-konzept.md" und „cupra-pitch-prototyp-phase1-konzept.md".

---

## Projektname und Kurzbeschreibung

**CUPRA Training Experience – Pitch-Prototyp**

Ein mobiler Klick-Prototyp, der die Trainings-Microsite im Zustand „Phase 1 ist eingeläutet" zeigt: Phase 0 „Become the CUPRA 1st" ist abgeschlossen und unten als Archiv erreichbar, der Delta Scan ist absolviert (Profil sichtbar), K1 Refresher ist offen, alle weiteren Kapitel sind gesperrt. Der Nutzer klickt K1 komplett durch (Nugget, Challenge als Screen-Sequenz, Badge). Die bestehende CUPRA Streak Challenge ist über die Streak-Kachel als echtes Spiel eingebunden. Zuhörer scannen im Pitch einen QR-Code und laufen den Prototypen selbst auf ihrem Smartphone durch.

## Problem und Ziel

Das Konzept ist im Tender schwer zu vermitteln. CUPRA soll in 3–5 Minuten spüren, wie sich das Programm anfühlt: Dramaturgie, Tonalität, Interaktionsqualität, und wie Phase 0 und Phase 1 in einer Microsite zusammenhängen. Ziel ist Überzeugung, nicht Funktionsnachweis. Der Prototyp muss unbegleitet funktionieren, weil niemand beim Scannen daneben steht. Push und Tribe-App-Banner kennt der Kunde und werden nicht nachgebaut.

## Zielnutzer und Einsatzkontext

CUPRA-Entscheider im Pitch-Raum (ca. 5–15 Personen), eigenes Smartphone, mobile Daten oder WLAN, keine Vorbereitung. Zweitnutzung: Link im Angebotsdokument, unbegleitet, evtl. am Desktop.

## User Stories

| # | Story | Prio |
|---|---|---|
| S1 | Als Zuhörer möchte ich den QR-Code scannen und sofort im Erlebnis sein, damit ich der Präsentation folgen kann statt zu warten. | Muss |
| S2 | Als Zuhörer möchte ich nach dem Scan den Claim und den Übergang „The Digital Campaign begins" erleben und mit einem Tap auf Home kommen. | Muss |
| S3 | Als Zuhörer möchte ich das Home mit sechs Phase-1-Karten sehen, davon nur K1 offen, damit ich den Aufbau der Phase erfasse. | Muss |
| S4 | Als Zuhörer möchte ich mein gemocktes Delta-Profil sehen, damit ich das Assessment-Prinzip verstehe, ohne es zu spielen. | Muss |
| S5 | Als Zuhörer möchte ich K1 Refresher öffnen und Nugget, Challenge-Screens und Badge durchklicken, damit ich das Kapitelmuster erlebe. | Muss |
| S6 | Als Zuhörer möchte ich über die Streak-Kachel in die echte Streak Challenge springen und danach zurück im Prototypen landen, damit ich Gameplay-Qualität erlebe. | Muss |
| S7 | Als Zuhörer möchte ich Phase 0 unten als Archiv finden, damit ich sehe, dass die Phasen zusammengehören. | Muss |
| S8 | Als Zuhörer möchte ich an jeder Stelle einen Weg weiter haben, damit ich nie feststecke. | Muss |
| S9 | Als Präsentierender möchte ich den Prototypen jederzeit zurücksetzen können, damit er vor dem nächsten Pitch frisch ist. | Muss |
| S10 | Als Zuhörer möchte ich den Leaderboard-Tab öffnen und die Reveal-Sequenz mit Demo-Daten sehen. | Kann |
| S11 | Als Zuhörer möchte ich gesperrte Karten antippen und einen Teaser sehen. | Kann |
| S12 | Als Zuhörer möchte ich den KI-Coach aus Phase 0 als statische Screen-Sequenz im Archiv sehen. | Kann |

## Akzeptanzkriterien

**S1**
- Der erste Screen ist auf einem Mittelklasse-Android über 4G in unter 2 Sekunden sichtbar.
- Keine Ladeanimation länger als 1 Sekunde. Kein Cookie-Banner, kein Login, kein Start-Button.

**S2**
- Der Opener startet automatisch: Claim-Aufbau „BE THE ONE THEY FOLLOW.", danach die Zeile „Chapter one is complete. The Digital Campaign begins."
- Skip-Button nach 2 Sekunden, Ende oder Skip führt mit einem Tap auf Home.
- Beim erneuten Öffnen (Opener bereits gesehen) landet der Nutzer direkt auf Home.

**S3**
- Home zeigt Continue-CTA „Continue: K1 Refresher".
- Delta-Scan-Karte im Zustand completed mit Mini-Profil.
- K1 offen; K2–K4 und Performance Check gesperrt mit Hinweis („Unlocks after K1" bzw. echter Countdown, Zielzeitpunkte in Konfigurationsdatei).
- Streak-Kachel, Archiv-Zeile und Bottom-Navigation (Home · Streak · Leaderboard · Profile) sind sichtbar.

**S4**
- Tap auf die Delta-Scan-Karte oder den Profil-Tab öffnet den Delta-Profil-Screen mit 5 Dimensionsbalken (Solid / Sharpen / Delta), festen Demo-Werten und statischem Feedback-Text.
- Ein Zurück-Weg ist vorhanden.

**S5**
- K1-Detail → Nugget-Mockup (Standbild, nach 3 s „+40 pts") → Challenge-Intro → statische Challenge-Screens (Karte, Feedback richtig, Feedback falsch, per Tap „Next") → Result → Badge-Moment → Home mit K1 completed und K2 nun offen.
- Kein echtes Swipen erforderlich.

**S6**
- Streak-Kachel und Streak-Tab öffnen die Streak Challenge (externe URL) im selben Tab mit Return-Parameter.
- Die Streak Challenge zeigt am Ende „Back to training"; der Prototyp erkennt die Rückkehr über einen URL-Parameter und aktualisiert die Streak-Kachel („Your best: {score}").

**S7**
- Unterste Zeile auf Home: „Become the CUPRA 1st · Completed · 1.240 pts".
- Tap öffnet Archiv-Ansicht mit vier completed-Kapitel-Karten und der Badge-Reihe inkl. „CUPRA 1st", Zurück zu Home.

**S8**
- Jeder Screen hat mindestens einen sichtbaren Weiter- oder Zurück-Weg.
- Browser-Back führt zum vorherigen Screen und zerstört keinen Zustand.

**S9**
- Versteckter Reset (5× Tap auf das Logo oder `/?reset=1`) löscht den lokalen Zustand und startet beim Opener.

## Kernablauf (Schritt für Schritt aus Sicht der Nutzer)

1. **QR-Code scannen** → Opener startet direkt: Claim-Aufbau in vier Zeilen („The one who knows the roots." / „…masters the craft." / „…feels the drive." / „The one they follow. You.") → „BE THE ONE THEY FOLLOW." → Phase-0-Badges blenden kurz ein → „Chapter one is complete. The Digital Campaign begins." Skip nach 2 s. CSS-Motion, kein Ton.
2. **Home:** Continue-CTA „Continue: K1 Refresher", Delta-Scan-Karte (completed, Mini-Balken), K1 offen, K2–K4 und Performance Check gesperrt, Streak-Kachel, Archiv-Zeile unten, Bottom-Navigation.
3. **Optional:** Tap Delta-Scan-Karte → Delta-Profil-Screen → zurück.
4. **K1 Detail:** Hero, Zeile „Prepares all three workshops", Nugget-Karte, Challenge-Karte „Known or New? · Swipe · ~3 min · up to 300 pts", Dimension-Chip „Your Delta: Product knowledge · Sharpen".
5. **Nugget-Mockup:** Standbild Technik-Übersicht mit Play-Overlay, nach 3 s „+40 pts", weiter.
6. **Challenge-Screens (gemockt):** Intro mit Regel → Karte mit Feature-Text und zwei Zonen „Known from Raval" / „New" → Screen „richtig" (grün, Streak-Zähler) → Screen „falsch" (Auflösung in einer Zeile) → Result „240 pts · Strong recall".
7. **Badge-Moment:** „REFRESHER · Complete", Vibration auf Android, Zeile „You're ready for the workshops." Button „Back to home".
8. **Home danach:** K1 completed, K2 offen (die Phase geht sichtbar weiter), Punkte-Kachel erhöht.
9. **Streak:** Tap auf Streak-Kachel → Streak Challenge (extern) → „Back to training" → Home, Kachel zeigt neue Bestleistung.
10. **Archiv:** Tap auf Archiv-Zeile → Phase-0-Ansicht mit vier Kapiteln und Badges → zurück. Ende des Pfads.
11. **Kann:** Leaderboard-Tab → Reveal-Sequenz mit Demo-Daten; gesperrte Karten → Teaser-Sheet; KI-Coach-Screens im Archiv.

## Nutzereingabe und Personalisierung

Keine. Der Prototyp fragt nichts ab. Delta-Profil, Punkte und Rang sind Demo-Werte. Zustand (Opener gesehen, Nugget gesehen, K1 abgeschlossen, Streak-Bestwert) liegt im localStorage des Geräts, kein Login, keine Server-Daten. 15 gleichzeitige Nutzer ohne Backend.

## Inhalte und Beispieldaten

Alle Texte Englisch, Modellname überall als „the new model" (namensagnostisch).

**Opener**
Vier Claim-Zeilen → „BE THE ONE THEY FOLLOW." → „Chapter one is complete. The Digital Campaign begins."

**Home-Karten**

| Karte | Zustand | Hinweis |
|---|---|---|
| DELTA SCAN | Completed | „Your starting point" |
| K1 REFRESHER | Open | 0 / 400 pts |
| K2 SEGMENT & TARGET CUSTOMER | Locked | „Unlocks after K1" |
| K3 COMPETITION | Locked | „Unlocks in 5 d" |
| K4 BRAND & CONVICTION | Locked | „Unlocks in 9 d" |
| PERFORMANCE CHECK | Locked | „Unlocks after K4" |

**Delta-Profil (Demo-Werte)**

| Dimension | Band |
|---|---|
| Product knowledge | Sharpen |
| Segment & customer | Delta |
| Competition | Sharpen |
| Brand & conviction | Solid |
| Fleet | Delta |

Feedback-Text: „Your biggest lever right now: Segment & customer. K2 is built for exactly that."

**Streak-Kachel**
„Streak · Your best: 12 · Global best: 31 · Play" (Bestwert wird nach Rückkehr aus der Streak Challenge überschrieben, falls Score übergeben)

**K1 Nugget**
„Tech Overview · 1:30 min · +40 bonus pts"

**Challenge-Karten (3 Beispiele)**
- „Coast-to-coast light bar" → New
- „Digital cockpit 12.3''" → Known
- „Bidirectional charging" → New

**Result**
„240 pts · Strong recall. You know more than you think."

**Badge**
„REFRESHER · Complete"

**Archiv**
Zeile: „Become the CUPRA 1st · Completed · 1.240 pts"
Kapitel: ORIGIN „The one who knows the roots." / CRAFTSMANSHIP „The one who masters the craft." / PERFORMANCE „The one who feels the drive." / TRIBE „The one they follow. You." – alle completed, Badges verdient, plus „CUPRA 1st".

**Leaderboard-Demo (Kann)**
8 fiktive Zeilen, eigene Position 47, Wechsel Global / Market / Role ändert nur die Zahlen.

Quizfragen liegen bereits in der Streak Challenge; keine neuen Fragen für den Prototypen nötig.

## Look and Feel

CUPRA CI: dunkler Hintergrund, Kupfer-Akzente, kantige Typografie, viel Weißraum, ruhige Motion (Fade, Slide, Fortschrittsringe, Balken). Mobile-only Portrait, Desktop zeigt den Inhalt in einem zentrierten Phone-Frame (480 px). Kein Text in Grafiken. Streak Challenge und Prototyp sollten sich in Farbwelt und Typo möglichst decken, ggf. kleine Anpassung der Streak Challenge auf CUPRA-Tokens.

## Tech-Stack-Empfehlung

**Statische Web-App: HTML, CSS, Vanilla JS, ohne Build-Schritt.**

- Alle Screens als Sections in einer `index.html`
- Navigation über JS und `history.pushState` (Browser-Back funktioniert)
- Zustand im localStorage
- Demo-Daten, Countdown-Ziele und Streak-Challenge-URL in `config.js`

Begründung: Der Prototyp hat keine Serverlogik und kein Datenmodell, er muss schnell laden und stabil sein; jede Framework-Schicht wäre nur Risiko. Die Streak Challenge bleibt ihr eigenes Next.js-Projekt; die Integration ist ein Link mit Return-Parameter, dafür braucht die Streak Challenge eine kleine Anpassung (Return-Link am Ende, optional Score-Übergabe).

**Ablage:** GitHub-Repo `cupra-training-prototype`
**Deployment:** Vercel, automatisch aus `main`
**QR-Code:** auf die Vercel-URL (oder eine kurze Custom-Domain, falls vorhanden)

## Erfolgskriterium

Im Pitch scannen alle Anwesenden, mindestens die Hälfte kommt ohne Hilfe bis zum K1-Badge, und in der anschließenden Diskussion geht es um Inhalte und Dramaturgie statt um „was passiert, wenn ich hier tippe". CUPRA erkennt ohne Erklärung, dass Phase 0 und Phase 1 eine Microsite sind.

Intern vorab: drei Kollegen laufen den Prototypen auf drei Geräten (iPhone, Android, Desktop) ohne Sackgasse durch, inklusive Hin- und Rückweg zur Streak Challenge.

## Was bewusst nicht dabei ist

- Push-Notification und Tribe-App-Banner (kennt der Kunde)
- Spielbarer Phase-0-Pfad (nur Archiv-Ansicht)
- Spielbarer Delta Scan, spielbarer Performance Check, Vorher-nachher-Animation
- Echtes Swipe-Gameplay in K1, weitere Challenge-Mechaniken
- Inhalte für K2–K4, echte Leaderboard-Daten
- Echte Tribe-API-Anbindung, Token, Notifications, Points API
- Mehrsprachigkeit und CMS, alle Texte hartcodiert Englisch
- KI-Coach mit echter Bewertung (höchstens statische Screens im Archiv)
- Team-Challenge, HQ-Dashboard, echte Videos, Ton
- Serverseitige Speicherung, Analytics

## Offene Fragen und Annahmen

**Offene Fragen**

1. **Return-Link in der Streak Challenge:** Kann die App am Ende einen „Back to training"-Button mit Return-URL anzeigen und optional den Score mitgeben? Kleinster, aber kritischster Eingriff.
2. **CI-Assets:** Liegen CUPRA-Fonts, Farbwerte und ein nutzbares Key-Visual vor, oder arbeiten wir mit Stand-ins und tauschen später?
3. **QR-Ziel-URL:** Vercel-Standard-URL oder Custom-Domain?
4. **Leaderboard-Reveal als Kann:** Dramaturgisch stärkster neuer Moment. Wenn Zeit bleibt, als erstes Kann umsetzen.

**Annahmen**

5. Der Pitch-Raum hat brauchbares Mobilfunknetz. Falls unsicher: Prototyp zusätzlich auf einem eigenen Gerät bereithalten und per Beamer zeigen.
6. Countdown-Zieldaten werden für den Pitch-Tag gesetzt („in 5 / 9 Tagen" relativ zum 18.09.).
7. Der Opener läuft ohne Ton, deshalb ist Autostart ohne vorherigen Tap unproblematisch.
8. Dimensionsnamen und -anzahl (5) sind Platzhalter; im Prototyp unkritisch, im Angebot als offen kennzeichnen.
9. Bottom-Navigation zeigt vier Tabs; Leaderboard führt bei Kann-Verzicht auf einen „Coming soon"-Screen statt ins Leere.
