# Bau-Anleitung für alle Unterseiten (Nanu Aesthetics)

Echte Webseite eines PMU-Studios. Inhaberin: **Najra** (NIE „Naira"). Home-Studio Köln-Nippes.
Zielgruppe: Frauen, die natürliche, hochwertige PMU-Ergebnisse wollen. Ton: **Du-Form,
professionell-warm, keine Superlativ-Floskeln, keine Emojis, kein Em-Dash (—), nur „–".**

## Technik (verbindlich)

- Jede Seite ist eine eigene `.html` im Ordner `site/`.
- Head immer so (Fonts + gemeinsames CSS/JS, eigener Title/Description):
  ```html
  <!DOCTYPE html>
  <html lang="de">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEITENTITEL – Nanu Aesthetics</title>
  <meta name="description" content="...">
  <link rel="stylesheet" href="fonts/fonts.css">
  <link rel="stylesheet" href="css/styles.css">
  <script src="js/main.js" defer></script>
  </head>
  <body>
  ```
  (Fonts sind seit 2026-08-27 lokal gehostet in `fonts/` — Council-Konsens fceb3e24d2e8e8ac, DSGVO)
- **Nav und Mobile-Menü:** Inhalt von `_nav.html` 1:1 übernehmen. Dort stehen Platzhalter
  `{A_HOME} {A_LEIST} {A_PREIS} {A_ARBEIT} {A_UEBER} {A_FAQ} {A_RATGEBER} {A_KONTAKT}` — bei der eigenen
  Seite ` aria-current="page"` einsetzen, alle anderen Platzhalter **leer löschen**.
  Detailseiten (Powder Brows usw.) markieren `{A_LEIST}`.
- **Footer:** Inhalt von `_footer.html` 1:1 übernehmen (unverändert).
- **Sticky-CTA** (mobile) am Seitenende übernehmen, Markup aus `index.html` kopieren.
  Damit er erscheint, braucht die Kopf-Sektion der Seite die Klasse `hero`.
- `<main id="top">` … `</main>` um den Inhalt.
- **Nichts an `css/styles.css` oder `js/main.js` ändern.** Seitenspezifisches CSS in einen
  kleinen `<style>`-Block im Head.

## Vorhandene CSS-Bausteine (bitte nutzen, nicht neu erfinden)

`.section` `.container` `.h2` `.lead` `.kicker` (Uppercase-Label, sparsam!) · `.btn .btn--primary`
`.btn--ghost` `.wa-icon` · `.imgwrap` (Bildrahmen) · `.hl-frame` + `<span class="hl-v">` (Gold-Rahmen,
zieht sich beim Scrollen auf; muss in einem `.reveal`-Element liegen) · `.orn` (dezente Linien-SVGs,
Vorlagen in `index.html`) · `.reveal` (Scroll-Einblendung, JS hängt automatisch dran) ·
`.tiles .tile .tile__img .tile__body .tile__more .tile--wide` (Bildkacheln) ·
`.trust .trust__grid .trust__item` · `.teaser__grid` · `.svc .svc__img .svc__body .svc__row .svc__price
.svc__link` (große Leistungsblöcke) · `.chips .chip` · `.steps` · `.faq .faq__q .faq__a .plus`
(Akkordeon, JS bedient es automatisch bei gleichem Markup wie in `index.html`) ·
`.reviews .rslider .reviews__card .rtrack .review` + IDs `rtrack/rdots/rprev/rnext`
(Bewertungs-Slider — **maximal einmal pro Seite**, IDs sind einmalig) ·
`.pricing` und die Preis-Klassen · `.finalcta` `.finalcta__note`.

**Wichtig zu `js/main.js`:** Es erwartet pro Seite höchstens EINEN Vorher/Nachher-Slider
(IDs `ba`, `baAfter`, `baHandle`) und höchstens EINEN Bewertungs-Slider. Alles ist mit
Existenz-Prüfungen abgesichert, fehlende Elemente sind unproblematisch.

## Design

Dunkles, warmes Braun als Grundton (`--ivory: #2A211A`), Panels `--card: #352A20`, Text creme,
Gold `#C2A878` nur als Akzent und Hairline. Das ist bereits in `css/styles.css` gesetzt —
keine eigenen Farben hardcoden, immer die CSS-Variablen nutzen.

**Mobile-first ist oberste Priorität** (390 px): kein horizontales Scrollen, Touch-Ziele ≥ 48 px,
Text ohne Zoom lesbar. Desktop muss funktionieren, ist aber zweitrangig.

**Taste-Regeln:** max. 1–2 `.kicker`-Labels pro Seite (nicht über jeder Sektion!), Bewertungs-Zitate
kurz halten, ein einheitliches Buchungs-Label „Jetzt Termin sichern", keine erfundenen Zahlen
(keine „500+ Kundinnen", keine Fake-Zertifikate, kein Countdown).

## Bilder (alle im Ordner `bilder/`, Hochformat, `object-fit:cover`)

| Datei | Inhalt |
|---|---|
| `najra-1.jpeg` | Najra, S/W-Editorial-Porträt (Hero der Startseite) |
| `najra-2.jpeg` | Najra, zweites S/W-Porträt |
| `najra-3.jpeg` | Najra, S/W-Crop (Augen/Brauen im Fokus) |
| `powder-brows.jpeg` | abgeheilte Powder Brows, Nahaufnahme |
| `powder-brows-vorher.jpeg` | Brauen VORHER (ungestylt) |
| `powder-brows-frisch.jpeg` | Brauen NACHHER, frisch pigmentiert (gleiche Kundin wie vorher!) |
| `aquarell-lips.jpeg` | Aquarell Lips, frisch pigmentiert |
| `3d-lips.jpeg` | 3D Lips, Nahaufnahme |
| `3d-lips-frisch.jpeg` | 3D Lips frisch gestochen |
| `3d-lips-abgeheilt.jpeg` | 3D Lips abgeheilt (Paar mit „frisch"!) |
| `remover-behandlung.jpeg` | ruhiger Behandlungsmoment, Kundin liegend |

Ehrliche Alt-Texte und Bildunterschriften: dazuschreiben, ob frisch gestochen oder abgeheilt.
Es gibt kein eigenes Ombré-Brows-Foto — dort `powder-brows-frisch.jpeg` mit neutralem Alt-Text.

## Kontakt

WhatsApp-Nummer (echt, seit 2026-08-27): `https://wa.me/491772475542` — mit vorformulierter Nachricht arbeiten, z. B.
`?text=Hallo%20Najra%2C%20ich%20interessiere%20mich%20f%C3%BCr%20Powder%20Brows.`
Adresse: nur „Home-Studio in Köln-Nippes, zentral gelegen und gut mit Bus und Bahn erreichbar.
Die genaue Adresse erhältst du nach bestätigter Terminvereinbarung." Keine Straße erfinden.

## Preise (verbindlich, nichts dazuerfinden)

- **PMU Brows:** Ombré Brows 300 € · Nachbehandlung 50 € | Powder Brows 300 € · Nachbehandlung 50 €
- **PMU Lips:** Aquarell Lips 300 € · Nachbehandlung 50 € | 3D Lips 300 € · Nachbehandlung 50 €
- **Remover:** pro Sitzung 120 €
- **Liftings:** Lash Lifting ohne Färben 55 € · mit Färben 65 € | Brow Lifting ohne Färben 55 € ·
  mit Färben 65 € | Kombi-Paket Lash & Brow Lifting mit Färben 120 €

Im Preis enthalten (so darf es beschrieben werden): persönliche Beratung, Vermessung und
Vorzeichnung, Farbabstimmung auf den Hautton, die Behandlung selbst, Pflegehinweise für zuhause.
Nachbehandlung nach 4–6 Wochen, kostet 50 €. Haltbarkeit 1–3 Jahre je nach Hauttyp, Pflege und
Sonne. Dauer je PMU-Behandlung ca. 2 bis 3 Stunden.

## Fachliches (für Texte auf den Detailseiten)

- **Powder Brows:** weicher Puderlook, wie sanft geschminkte Brauen; für definierten und
  natürlichen Ausdruck; funktioniert auf den meisten Hauttypen.
- **Ombré Brows:** Farbverlauf von zart im vorderen Bereich zu intensiver hinten; wirkt
  ausdrucksstärker als Powder Brows, bleibt aber weich.
- **Aquarell Lips:** zarte, transparente Lippenpigmentierung; frischer, gesunder Farbton,
  wirkt wie ein Hauch Farbe.
- **3D Lips:** definierte Kontur plus Schattierung, dadurch wirken die Lippen optisch voller.
  NICHT mit Filler/Aufspritzen vergleichen oder abgrenzen (Werberecht, Council 85de4f90b0d0600e;
  seit 2026-10-06 überall entfernt).
- **Abheilung:** erste Tage intensiver und dunkler, dann heller werdend; nach ca. 4 Wochen
  abgeheilt; das Endergebnis ist weicher und natürlicher als direkt nach der Behandlung.
- **Vorbereitung:** am Behandlungstag kein Alkohol und wenig Koffein, blutverdünnende Mittel
  nur nach Absprache mit dem Arzt, bei Lippen-PMU Herpes-Neigung vorher ansprechen.
- **Nicht geeignet:** Schwangerschaft und Stillzeit, bestimmte Erkrankungen und Medikamente —
  im Zweifel vorher persönlich klären.
- **Schmerzen:** mit Betäubungscreme für die meisten gut aushaltbar, eher Kribbeln oder Zupfen.

## Original-Texte der Inhaberin (wörtlich verwenden, wo passend)

**Slogan:** „Weil du es verdienst, dich schön zu fühlen – jeden Tag."

**Über mich (Langtext, Absätze erhalten):**
„Meine Arbeit bedeutet für mich weit mehr als nur schöne Ergebnisse. Ich liebe es, Frauen dabei zu
helfen, sich wohler in ihrer Haut zu fühlen, ihr Selbstbewusstsein zu stärken und ihren Alltag ein
Stück leichter zu machen.

Was mich an meiner Arbeit besonders erfüllt, ist der Moment, in dem eine Kundin sich nach der
Behandlung im Spiegel sieht und sich wirklich freut. Genau dieses Gefühl möchte ich mit meiner
Arbeit schaffen – nicht nur ein schönes Ergebnis, sondern ein echtes Wohlgefühl.

Besonders wichtig ist mir, jede Kundin individuell zu beraten und jedes Ergebnis typgerecht
umzusetzen. Kein Gesicht ist wie das andere, und genau deshalb sollte auch jedes Ergebnis so
persönlich sein wie die Frau, die zu mir kommt.

Ob natürlich, soft, elegant oder etwas ausdrucksstärker – im Mittelpunkt steht immer, was zu dir
passt und womit du dich wirklich wohlfühlst. Offenheit, Ehrlichkeit und Vertrauen sind für mich
dabei genauso wichtig wie Präzision und Ästhetik.

Mit Nanu Aesthetics möchte ich einen Ort schaffen, an dem du dich gut aufgehoben fühlst und mit
einem Ergebnis nach Hause gehst, das deine natürliche Schönheit unterstreicht und dir jeden Tag
ein gutes Gefühl gibt."

**Meine Arbeit:** „Jede Behandlung wird auf dein Gesicht, deine Wünsche und deine natürliche
Ausstrahlung abgestimmt. So entsteht ein Ergebnis, das nicht nur schön aussieht, sondern sich
auch wirklich nach dir anfühlt."

**Bewertungen (Einleitung):** „Die Zufriedenheit meiner Kundinnen steht für mich an erster Stelle.
Neben einem schönen Ergebnis sind mir auch Vertrauen, Offenheit und ein gutes Gefühl während der
gesamten Behandlung besonders wichtig."

**Die 4 echten Bewertungen** (leichtes Kürzen erlaubt, Inhalt nicht verändern):
1. „Ich war das erste Mal bei ihr und bin einfach begeistert. Sie erklärt alles sehr gut und setzt
   es wirklich toll um. Ich habe meine 3D Lips machen lassen und liebe das Ergebnis." (3D Lips)
2. „Ich war super nervös, aber Najra hat mir schon vor dem Termin die Sorgen genommen und mich sehr
   gut beraten. Das Ergebnis ist wunderschön geworden. Ich kann sie nur weiterempfehlen." (Beratung)
3. „Absolut top, makellos sauber, sehr sorgfältig und super professionell ausgeführt. Ich habe mich
   rundum wohlgefühlt und liebe das Ergebnis." (Studio-Erlebnis)
4. „Ich bin super zufrieden mit meinem Permanent Make-up an den Lippen. Najra hat alles sehr gut
   erklärt, war sehr professionell und empathisch, und das Ergebnis ist genau so geworden, wie wir
   es besprochen hatten. Es sieht sehr natürlich aus, absolute Empfehlung!" (Lippen-PMU)

## Seitenstruktur der ganzen Website

`index.html` (Startseite, fertig) · `leistungen.html` · `powder-brows.html` · `ombre-brows.html` ·
`aquarell-lips.html` · `3d-lips.html` · `liftings-remover.html` · `preise.html` ·
`meine-arbeit.html` · `ueber-mich.html` · `faq.html` · `ratgeber.html` (Blog-Übersicht) ·
`permanent-make-up-koeln-guide.html` (Artikel) · `kontakt.html` · `impressum.html` · `datenschutz.html`

Neue Ratgeber-Artikel: Hülle wie `permanent-make-up-koeln-guide.html` (Klassen `.art__*`,
BlogPosting-JSON-LD), Karte in `ratgeber.html` ergänzen, URL in `sitemap.xml` eintragen.

Jede Unterseite endet mit einem Abschluss-CTA (`.finalcta`) und verlinkt sinnvoll weiter
(z. B. Detailseite → Preise, Meine Arbeit, andere Behandlungen).
