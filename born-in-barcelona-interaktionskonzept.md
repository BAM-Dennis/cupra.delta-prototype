# Born in Barcelona – Interaktionskonzept

**Challenge im Kapitel ORIGIN · Stand 17.09.2026 · Sapered GmbH**
Bezieht sich ausschließlich auf die Challenge-Interaktion. Microsite, Navigation, Punktesystem und Badge-Logik sind vorhanden und werden genutzt, nicht neu konzipiert.

---

## Kurzbeschreibung

Eine Hotspot-Challenge auf einer stilisierten Barcelona-Karte. Der Teilnehmer wählt nacheinander vier Stadtgebiete, beantwortet je eine Frage unter Zeitdruck und „claimt" das Gebiet. Richtig beantwortete Gebiete färben sich vollständig kupfer, im zweiten Versuch gelöste zur Hälfte. Sind alle vier Gebiete geclaimt, ist die Challenge abgeschlossen und das Kapitel-Badge ORIGIN wird vergeben, sofern die übrigen Kapitel-Challenges ebenfalls erledigt sind.

## Ziel

Die Herkunft der Marke spielerisch verankern: Jedes Gebiet steht für einen Ort der CUPRA-Geschichte, die Frage verknüpft Ort und Wissen. Die Karte macht den Fortschritt sichtbar, das Kupfer belohnt Genauigkeit.

## Elemente auf dem Screen

- Header: Back, Profil-Icon (Standard der Microsite)
- Kapitel-Label „ORIGIN", Titel „BORN IN BARCELONA"
- Fortschrittsbalken mit Text „0/4 districts claimed"
- Karte mit vier Gebieten: Camp Nou, Casa CUPRA, El Born, El Raval
- Unterer Bereich, zustandsabhängig: Aufforderung, Frage mit Antworten, Auflösung mit Punkten und CTA

## Ablauf

1. **Start:** Karte mit vier ungeclaimten Gebieten (dunkel, helle Kontur), unten „Select a district". Kein Timer aktiv.
2. **Gebiet antippen:** Gebiet wird hervorgehoben, Karte bleibt sichtbar. Unten erscheint das Gebiets-Label, die Frage und drei Antwortkarten. Der 10-Sekunden-Timer startet mit dem Erscheinen der Frage und ist als schrumpfender Ring oder Balken am Gebiets-Label sichtbar.
3. **Richtige Antwort im ersten Versuch:** Gebiet färbt sich vollständig kupfer, unten „Correct!", ein Satz Auflösung, Punkte-Chip („+120 points"), CTA „Next district". Haptik-Impuls (Android), Fortschritt zählt hoch.
4. **Falsche Antwort oder Timer abgelaufen:** Gewählte Antwort wird als falsch markiert (dezent, kein Rot-Flash, keine Haptik), Hinweis „Not quite. One more try." Die Frage bleibt, die falsche Antwort ist deaktiviert, der Timer startet neu mit 10 Sekunden.
5. **Richtige Antwort im zweiten Versuch:** Gebiet färbt sich zur Hälfte kupfer (Schraffur oder halbe Fläche), unten „Claimed.", Auflösung, Punkte-Chip mit reduzierten Punkten, CTA „Next district".
6. **Zweiter Versuch ebenfalls falsch:** Gebiet gilt als geclaimt, bleibt aber ohne Kupfer (nur Kontur wird kupfer, Fläche dunkel). Auflösung mit richtiger Antwort, 0 Punkte, CTA „Next district". Damit ist die Challenge immer abschließbar.
7. **Nächstes Gebiet:** Unterer Bereich klappt zu, Karte zeigt „Select a district", Reihenfolge frei wählbar. Bereits geclaimte Gebiete sind nicht mehr antippbar.
8. **Alle vier geclaimt:** Kurzer Moment auf der Karte (alle Gebiete pulsieren einmal), dann Result-Screen der Microsite mit Gesamtpunkten der Challenge. Ist Born in Barcelona die letzte offene Challenge des Kapitels, folgt direkt der Badge-Screen „ORIGIN COMPLETE · The one who knows the roots."

## Regeln

- Genau eine Frage pro Gebiet, drei Antwortoptionen, eine richtig.
- 10 Sekunden pro Versuch, maximal zwei Versuche pro Gebiet.
- Punkte: erster Versuch voll, zweiter Versuch halb, kein Treffer null. Konkrete Werte aus dem bestehenden Punktesystem des Kapitels.
- Timer-Ablauf zählt als falscher Versuch.
- Verlassen der Challenge während einer laufenden Frage: Standard-Exit-Dialog der Microsite; das angefangene Gebiet gilt als nicht begonnen, bereits geclaimte Gebiete bleiben gespeichert.
- Wiederholung der Challenge nach Abschluss folgt der Kapitelregel der Microsite (wiederholbar, keine neuen Punkte).

## Zustände der Gebiete

| Zustand | Darstellung | Antippbar |
|---|---|---|
| Ungeclaimt | dunkle Fläche, helle Kontur | ja |
| Aktiv (Frage läuft) | Fläche aufgehellt, Timer am Label | nein |
| Geclaimt, voll | Fläche kupfer | nein |
| Geclaimt, halb | Fläche halb kupfer | nein |
| Geclaimt, ohne Treffer | Kontur kupfer, Fläche dunkel | nein |

## Inhalte (Beispiel)

| Gebiet | Frage | Antworten (richtig fett) |
|---|---|---|
| El Born | Which CUPRA model took its name from this district? | **CUPRA Born**, CUPRA Leon, CUPRA Formentor |
| El Raval | Which CUPRA model carries the name of this district? | **CUPRA Raval**, CUPRA Terramar, CUPRA Tavascan |
| Casa CUPRA | What is Casa CUPRA? | **The brand's flagship experience space in Barcelona**, The CUPRA design studio, The first CUPRA dealership |
| Camp Nou | Which club has CUPRA partnered with as official automotive partner? | **FC Barcelona**, RCD Espanyol, Real Madrid |

Fragen sind Platzhalter, Freigabe durch CUPRA HQ. Alle Texte CMS-gepflegt, Gebietsnamen als Text-Layer über der Karte, nicht in der Grafik.

## Nicht Teil dieses Konzepts

Kartengrafik und visuelle Ausarbeitung (liegt vor), Punkthöhen, Badge-Logik, Result-Screen, Navigation.

## Offene Punkte

1. Wie exakt sind die Gebiete auf dem Smartphone antippbar? Mindestgröße der Tap-Fläche prüfen, ggf. unsichtbare Vergrößerung der Hit-Area.
2. Soll der zweite Versuch dieselbe Frage mit der deaktivierten falschen Antwort zeigen (wie hier vorgeschlagen) oder eine alternative Frage zum selben Gebiet?
3. Zählen halb geclaimte Gebiete für ein späteres „Perfect run"-Element, oder reicht „claimed" für den Abschluss? Hier angenommen: reicht.
