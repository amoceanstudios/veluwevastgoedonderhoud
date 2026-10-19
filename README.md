# Veluwe Vastgoedonderhoud

Een responsieve website met schilderthema, verschillende scroll-reveals, een interactief kleuratelier, projectgalerij en direct contact via WhatsApp, telefoon en e-mail.

## Ontwikkelen

Gebruik Node.js 24 en de bestaande checkout. Elke cloudtaak heeft al een geïsoleerde omgeving; maak geen extra Git-worktree.

```sh
npm ci
npm run dev -- --port 5173
```

Voor productie: `npm run build`. De map `dist` kan op een statische hostingdienst worden gepubliceerd. Controleer de productieversie met `npm run preview`.

## Inhoud en bronnen

De bestaande homepage van https://www.veluwe-vastgoedonderhoud.nl/ is op 19 oktober 2026 uitgelezen. De zichtbare tekst staat in `sources/original-content.txt`, de unieke afbeeldingsverwijzingen in `sources/original-images.json`. De diensten en contactgegevens zijn daarop gebaseerd. De oude site bevat een foutieve mailto-link naar info@mysite.com; dit ontwerp gebruikt het zichtbaar vermelde adres info@veluwevastgoedonderhoud.nl.

WhatsApp en telefoon: +31 6 58843114, bevestigd door de opdrachtgever. WhatsApp wordt pas geopend na een klik; er is geen berichtenbackend of contactformulier dat aanvragen opslaat.

De projectfoto's worden vanaf de oorspronkelijke Wix-host geladen. Die host is tijdens ontwikkeling door de cloudnetwerkpolicy geblokkeerd; beeldinhoud en beeldkwaliteit zijn daardoor nog niet visueel geverifieerd. De pagina gebruikt een als illustratie herkenbare verfstudie als terugval en vermeldt wanneer projectfoto's niet bereikbaar zijn. Verifieer de fotoselectie en uitsnede vóór publicatie. `node scripts/sync-media.mjs` downloadt de volledige gevonden beeldcollectie zodra de netwerktoegang beschikbaar is. Dit script verandert de huidige verwijzingen niet.

Het woordmerk is een nieuw typografisch ontwerpvoorstel, geen overgenomen origineel logo. De kleurstudio is een illustratie en geen kleurgetrouwe verfstaal of gerealiseerd project. Schermkleuren zijn indicatief.

## Interactie en toegankelijkheid

De kleurstudio ondersteunt toetsenbordbediening. De contact- en fotodialogen gebruiken native focusbeheer en Escape om te sluiten. Scroll- en penseelanimaties respecteren `prefers-reduced-motion`. De verftrail werkt alleen met een muis, stopt zodra hij is uitgedoofd en onderschept geen klikken. De contactknop blijft op mobiel zichtbaar.

## Gecontroleerd

Productiebuild, desktop- en mobiele browserweergave, correcte WhatsApp-bestemming en onderwerpselectie, dienstenaccordeon, galerijdialoog, toetsenbordsluiting en verminderde beweging. Beeldbeschikbaarheid van Wix en de externe lettertypen blijven afhankelijk van netwerktoegang. Publicatie naar de echte website is niet uitgevoerd.
