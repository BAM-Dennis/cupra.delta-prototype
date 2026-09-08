# CUPRA Training Experience – Pitch-Prototyp

**Konzept v1.0 · Stand 08.09.2026 · Sapered GmbH**

---

## Projektname und Kurzbeschreibung

**CUPRA Training Experience – Pitch-Prototyp**

Ein mobiler Klick-Prototyp, der die Journey der geplanten Trainings-Microsite erlebbar macht: vom Intro über Home und Kapitel bis zum Badge. Eine echte Challenge (die bestehende CUPRA Streak Challenge) ist spielbar eingebunden, alles andere ist hochwertig gemockt. Zuhörer scannen im Pitch einen QR-Code und laufen den Prototypen selbst auf ihrem Smartphone durch.

## Problem und Ziel

Das vollständige Konzept ist abstrakt und im Tender schwer zu vermitteln. CUPRA soll in 3–5 Minuten spüren, wie sich das Programm anfühlt: Dramaturgie, Tonalität, Interaktionsqualität. Ziel ist Überzeugung, nicht Funktionsnachweis. Der Prototyp muss unbegleitet funktionieren, weil niemand beim Scannen daneben steht. Den Einstieg über Push und Tribe-App-Banner kennt der Kunde, er wird nicht nachgebaut.

## Zielnutzer und Einsatzkontext

CUPRA-Entscheider im Pitch-Raum (ca. 5–15 Personen), eigenes Smartphone, mobile Daten oder WLAN, keine Vorbereitung. Zweitnutzung: Link im Angebotsdokument, unbegleitet, evtl. am Desktop.

## User Stories

| # | Story | Prio |
|---|---|---|
| S1 | Als Zuhörer möchte ich den QR-Code scannen und sofort im Erlebnis sein, damit ich der Präsentation folgen kann statt zu warten. | Muss |
| S2 | Als Zuhörer möchte ich direkt nach dem Scan im Intro landen und mit einem Tap auf Home kommen, damit der Einstieg ohne Umweg gelingt. | Muss |
| S3 | Als Zuhörer möchte ich auf Home vier Kapitel mit Claim-Fragmenten und Countdown sehen, damit ich die Programm-Dramaturgie verstehe. | Muss |
| S4 | Als Zuhörer möchte ich das Kapitel ORIGIN öffnen, einen Content-Drop-Mockup sehen und eine echte Challenge spielen, damit ich Gameplay-Qualität erlebe. | Muss |
| S5 | Als Zuhörer möchte ich nach dem Spiel zurück im Prototypen landen und einen Badge-Moment erleben, damit der Bogen sich schließt. | Muss |
| S6 | Als Zuhörer möchte ich an jeder Stelle einen Weg weiter haben, damit ich nie feststecke. | Muss |
| S7 | Als Präsentierender möchte ich den Prototypen jederzeit zurücksetzen können, damit er vor dem nächsten Pitch frisch ist. | Muss |
| S8 | Als Zuhörer möchte ich das Profil mit Punkten und Badges ansehen, damit ich das Sichtbarkeitsprinzip (kein Leaderboard) verstehe. | Kann |
| S9 | Als Zuhörer möchte ich den KI-Coach als Screen-Sequenz sehen, damit ich den USP erahne. | Kann |
| S10 | Als Zuhörer möchte ich die gesperrten Kapitel antippen und einen Teaser sehen, damit auch Neugier belohnt wird. | Kann |

## Akzeptanzkriterien

**S1**
- Das Intro ist auf einem Mittelklasse-Android über 4G in unter 2 Sekunden sichtbar.
- Keine Ladeanimation länger als 1 Sekunde.
- Kein Cookie-Banner, kein Login, kein Start-Button.

**S2**
- Das Intro startet automatisch, der Skip-Button erscheint nach 2 Sekunden.
- Ende oder Skip führt mit einem Tap auf Home.
- Beim erneuten Öffnen (Intro bereits gesehen) landet der Nutzer direkt auf Home.

**S3**
- Home zeigt vier Kapitel-Karten. ORIGIN ist offen, drei sind gesperrt mit laufendem Countdown und Claim-Fragment.
- Der Countdown läuft echt, die Zielzeitpunkte sind in einer Konfigurationsdatei änderbar.

**S4**
- Aus Kapitel-Detail ORIGIN führt ein Tap in den Content-Drop-Mockup, ein weiterer in die Streak Challenge (externe URL).
- Die Streak Challenge öffnet im selben Tab.

**S5**
- Nach dem Spiel führt ein Link „Back to training" zurück in den Prototypen.
- Der Prototyp erkennt die Rückkehr über einen URL-Parameter, markiert die Challenge als erledigt, zeigt Punkte und den Badge-Moment „The one who knows the roots."

**S6**
- Jeder Screen hat mindestens einen sichtbaren Weiter- oder Zurück-Weg.
- Der Browser-Back-Button führt zum vorherigen Screen und zerstört keinen Zustand.

**S7**
- Ein versteckter Reset (5× Tap auf das Logo oder `/?reset=1`) löscht den lokalen Zustand und startet beim Intro.

## Kernablauf (Schritt für Schritt aus Sicht der Nutzer)

1. **QR-Code scannen** → Intro startet direkt: animierter Aufbau des Claims „BE THE ONE THEY FOLLOW." (CSS-Motion, 10–15 Sek., ohne Ton), Skip-Button nach 2 Sek.
2. **Home:** Kurzer Introtext, CTA „Start: ORIGIN", vier Kapitel-Karten (eine offen, drei mit Countdown), Mystery-Zeile, Profil-Icon oben rechts.
3. **Kapitel-Detail ORIGIN:** Hero mit Claim-Fragment, Karte „Story Capsule · +40 bonus", zwei Challenge-Karten: „The Spirit Check" (spielbar, führt zur Streak Challenge) und „Born in Barcelona" (als „Coming soon" gemockt).
4. **Content Drop:** Gemockter Video-Screen (Standbild + Play-Overlay), nach 3 Sek. oder Tap erscheint „+40 pts". Weiter zur Challenge.
5. **Challenge:** Weiterleitung zur Streak Challenge mit Return-Parameter. Nutzer spielt.
6. **Rückkehr + Result:** Streak Challenge zeigt am Ende „Back to training" → Prototyp `/?completed=spirit`. Result-Screen: Punkte, Feedback-Zeile.
7. **Badge-Moment:** Fullscreen, Badge animiert ein, „The one who knows the roots.", Vibration auf Android. Button „Back to home".
8. **Home (Rückkehrzustand):** Fortschrittsring ORIGIN gefüllt, Punkte-Kachel, Badge-Reihe mit einem verdienten Badge. Ende der Demo, weitere Kapitel bleiben gesperrt.
9. **Kann:** Profil-Screen, KI-Coach-Sequenz (3 statische Screens), Teaser bei gesperrten Kapiteln.

## Nutzereingabe und Personalisierung

Keine. Der Prototyp fragt nichts ab. Fortschritt (Intro gesehen, Content Drop gesehen, Challenge erledigt, Badge verdient) liegt im localStorage des Geräts, kein Login, keine Server-Daten. Damit funktionieren 15 gleichzeitige Nutzer ohne Backend.

## Inhalte und Beispieldaten

Alle Texte Englisch, Modellname überall als „the new model" (namensagnostisch).

**Intro**
Claim-Aufbau in vier Zeilen, die nacheinander erscheinen:
- „The one who knows the roots."
- „The one who masters the craft."
- „The one who feels the drive."
- „The one they follow. You."
→ fügt sich zu „BE THE ONE THEY FOLLOW."

**Introtext Home**
„Four chapters. Two weeks. One goal: Become the CUPRA 1st. Every point counts – the reveal comes with the Competition."

**Kapitel-Karten**

| Kapitel | Claim-Fragment | Zustand |
|---|---|---|
| ORIGIN | The one who knows the roots. | open · 0 / 400 pts |
| CRAFTSMANSHIP | The one who masters the craft. | Unlocks in 3 d |
| PERFORMANCE | The one who feels the drive. | Unlocks in 7 d |
| TRIBE | The one they follow. You. | Unlocks in 10 d |

**Content Drop**
„Story Capsule · 1:20 min · +40 bonus pts" – Standbild Barcelona-Motiv (Stock oder CUPRA-Asset)

**Challenge-Karten**
- „The Spirit Check · Swipe · ~3 min · up to 300 pts"
- „Born in Barcelona · Explore · ~4 min · Coming soon"

**Result**
Punkte aus der Streak Challenge übernehmen, falls die App sie im Return-Parameter mitgibt (`&score=240`), sonst fester Demo-Wert 240 pts.
Feedback: „Strong start. You know what CUPRA stands for."

**Badge**
„ORIGIN · The one who knows the roots."

**Mystery-Zeile**
„Every point counts. The reveal comes with the Competition."

Die Quizfragen selbst liegen bereits in der Streak Challenge, keine neuen Fragen für den Prototypen nötig.

## Look and Feel

CUPRA CI: dunkler Hintergrund, Kupfer-Akzente, kantige Typografie, viel Weißraum, ruhige Motion (Fade, Slide, Fortschrittsringe). Mobile-only Portrait, Desktop zeigt den Inhalt in einem zentrierten Phone-Frame (480 px), damit der Angebotslink am Rechner nicht zerfällt. Kein Text in Grafiken. Streak Challenge und Prototyp sollten sich in Farbwelt und Typo möglichst decken, ggf. kleine Anpassung der Streak Challenge auf CUPRA-Tokens.

## Tech-Stack-Empfehlung

**Statische Web-App: HTML, CSS, Vanilla JS, ohne Build-Schritt.**

- Alle Screens als Sections in einer `index.html`
- Navigation über JS und `history.pushState` (damit Browser-Back funktioniert)
- Zustand im localStorage
- Countdown-Ziele und Streak-Challenge-URL in einer kleinen `config.js`

Begründung: Der Prototyp hat keine Serverlogik, kein Datenmodell und muss vor allem schnell laden und stabil sein; jede Framework-Schicht wäre hier nur Risiko. Die Streak Challenge bleibt ihr eigenes Next.js-Projekt; die Integration ist ein Link mit Return-Parameter, dafür braucht die Streak Challenge eine kleine Anpassung (Return-Link am Ende, optional Score-Übergabe).

**Ablage:** GitHub-Repo `cupra-training-prototype`
**Deployment:** Vercel, automatisch aus `main`
**QR-Code:** auf die Vercel-URL (oder eine kurze Custom-Domain, falls vorhanden)

## Erfolgskriterium

Im Pitch scannen alle Anwesenden, mindestens die Hälfte kommt ohne Hilfe bis zum Badge-Moment, und in der anschließenden Diskussion geht es um Inhalte und Dramaturgie statt um „was passiert, wenn ich hier tippe".

Vorher intern: drei Kollegen laufen den Prototypen auf drei verschiedenen Geräten (iPhone, Android, Desktop) ohne Sackgasse durch.

## Was bewusst nicht dabei ist

- Push-Notification und Tribe-App-Banner (kennt der Kunde)
- Echte Tribe-API-Anbindung, Token, Notifications, Points API
- Mehrsprachigkeit und CMS, alle Texte hartcodiert Englisch
- Weitere Challenge-Mechaniken (Hotspot, Sequence, Memory, Slider, Media-Match)
- KI-Coach mit echter Bewertung (höchstens als statische Screens)
- Team-Challenge, Profil-Tiefe, Phase 1, Delta Scan, Leaderboards
- HQ-Dashboard
- Echtes Intro-Video, Ton, echte Content-Drops
- Serverseitige Speicherung, Analytics

## Offene Fragen und Annahmen

**Offene Fragen**

1. **Return-Link in der Streak Challenge:** Kann die App am Ende einen „Back to training"-Button mit Return-URL anzeigen und optional den Score mitgeben? Kleinster, aber kritischster Eingriff.
2. **CI-Assets:** Liegen CUPRA-Fonts, Farbwerte und ein nutzbares Key-Visual vor, oder arbeiten wir mit Stand-ins und tauschen später?
3. **QR-Ziel-URL:** Vercel-Standard-URL oder Custom-Domain? Beeinflusst QR-Erstellung und Angebotsdokument.

**Annahmen**

4. Der Pitch-Raum hat brauchbares Mobilfunknetz. Falls unsicher: Prototyp zusätzlich auf einem eigenen Gerät bereithalten und per Beamer zeigen.
5. Countdown-Zieldaten werden für den Pitch-Tag gesetzt (Freischaltung „in 3 / 7 / 10 Tagen" relativ zum 18.09.).
6. Das Intro läuft ohne Ton, deshalb ist Autostart ohne vorherigen Tap unproblematisch. Soll ein Audio-Logo dazu, braucht es einen Start-Button.
