# Veluwe Vastgoedonderhoud — website met afzonderlijke pagina’s

Deze versie bevat 17 echte HTML-pagina’s plus een eigen 404-pagina:

- Home, Over ons, Diensten, Projecten, Contact en Privacy.
- Zes dienstenpagina’s: binnenschilderwerk, buitenschilderwerk, latex spuiten, stukadoorswerk, betonlook/beton ciré en behang/renovlies.
- Vijf projectpagina’s: karakteristieke woning, witte gevelwoning, interieur met haard, warme accentwand en zwarte trap.

## Naar Netlify slepen

Download de branch `netlify-download` via GitHub **Code → Download ZIP** en pak die uit. Sleep alleen de map **netlify** naar Netlify Drop. In die map staat `index.html` direct op het hoogste niveau; alle andere pagina’s, foto’s, lettertypen en scripts zitten erbij. Er is geen installatie, bouwstap of server nodig voor deze map. Open de gepubliceerde website via HTTPS, niet met `file://`.

Bij een Git-koppeling gebruikt Netlify de meegeleverde `netlify.toml` en publiceert het de al gebouwde map `netlify`.

## Ontwikkelen en bouwen

Gebruik Node.js 24 en de bestaande checkout. Elke cloudtaak draait al geïsoleerd; maak geen extra Git-worktree.

```sh
npm ci --cache /tmp/veluwe-npm-cache --no-audit --no-fund
npm run dev -- --port 5173
```

`data/site.mjs` bevat de diensten, projectgroepen en routes. `scripts/generate-pages.mjs` genereert de HTML-pagina’s. Wijzig de inhoud daar, niet alleen in de gegenereerde HTML.

`npm run build` genereert de pagina’s, bouwt ze met Vite en vervangt daarna de gegenereerde map `netlify` door de nieuwe productieversie. Wijzig niets handmatig in `netlify`.

## Bronnen en beeldindeling

De openbare homepage van https://www.veluwe-vastgoedonderhoud.nl/ is op 19 oktober 2026 opgehaald. De oorspronkelijke zichtbare teksten staan in `sources/original-content.txt`; de 39 unieke beeldverwijzingen in `sources/original-images.json`. `data/media.json` koppelt de originele URL’s aan lokaal geoptimaliseerde WebP-bestanden, met behoud van beeldverhouding en correcte EXIF-oriëntatie. Alle beelden en lettertypen staan lokaal in de distributie. De lettertypelicenties staan in `public/fonts`.

De projectgroepen zijn visueel gecontroleerd. De woning met luiken en de entree zijn één groep; de witte gevelwoning met zijaanzicht en steiger een andere. De woonkamer met haard, de roodbruine accentwand en de zwarte trap zijn aparte reeksen. Er worden geen onbevestigde plaatsnamen, opdrachtgevers, jaartallen of voor-en-na-volgordes toegevoegd. De projecttitels zijn beschrijvende redactietitels. De bron bevestigt niet voor alle beelden een specifieke afwerkingstechniek; bij diensten zonder een aantoonbaar gekoppelde projectreeks gebruiken we een algemeen sfeerbeeld met een passende toelichting, geen verzonnen case.

Het originele beeldmerk uit de bestaande site wordt gebruikt naast een leesbaar gezet woordmerk. Het rood van het beeldmerk is verwerkt in het nieuwe ontwerp.

## Contact en privacy

WhatsApp en telefoon: +31 6 58843114, bevestigd door de opdrachtgever en op de bestaande site vermeld. Het zichtbare e-mailadres op de bron is `info@veluwevastgoedonderhoud.nl`; de foutieve oorspronkelijke mailto-link naar `info@mysite.com` is niet overgenomen.

Het contactformulier bereidt een bericht voor en opent WhatsApp of het e-mailprogramma met het gekozen onderwerp. De bezoeker bevestigt daar zelf het versturen. Er is geen berichtenbackend en er worden geen formuliergegevens op de site opgeslagen. De website bevat geen analytics of advertentietrackers. De privacytekst beschrijft dit concrete gedrag.

## Beweging en navigatie

Alle hoofdroutes zijn echte links naar aparte documenten en ondersteunen direct openen, vernieuwen, browsergeschiedenis en terugnavigatie. Reveals bestaan uit tekst per woord, lijnbeweging, opkomst en penseelachtige beeldmaskers. De website respecteert `prefers-reduced-motion`. De korte verftrail is alleen voor muisgebruikers en stopt zodra hij is uitgedoofd. Mobiele navigatie en fotovergroting gebruiken native dialogen met focusbeheer en Escape. Content blijft zonder JavaScript zichtbaar.

## Controleren

```sh
npm run build
node scripts/check-site.mjs
python -m http.server 4173 --bind 0.0.0.0 --directory netlify
```

Voer in een tweede sessie `node scripts/browser-smoke.cjs` uit met een beschikbare Playwright-runtime en systeem-Chromium. De cloudomgeving heeft beide al beschikbaar. Eventueel zijn `CHROMIUM_PATH` en `SITE_URL` instelbaar. De browsercheck controleert alle routes op 320, 390, 768 en 1440 pixels, afbeeldingsbeschikbaarheid, filters, projectdetails, fotovergroting, diensten naar contact, het WhatsApp-nummer en onderwerp, mobiel menu en de scrollreveal-volgorde. De externe WhatsApp-route wordt in de test onderschept; er worden geen berichten verstuurd.

Publicatie naar de echte bedrijfswebsite is niet uitgevoerd. Na Netlify-publicatie kan de eigenaar het eigen domein koppelen en de definitieve tekst en inhoud laten beoordelen.
