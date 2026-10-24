R-Net OV Bordbouwer voor JouwWeb Pro
=====================================

Bestanden
- index.html: zelfstandige app met beheerscherm, meerdere borden, kleuren/layout, halte zoeken, live data en deelbare openbare kijklink.
- worker.js: Cloudflare Worker die OVapi via HTTPS beschikbaar maakt aan de webapp.
- README.txt: installatiehandleiding.

Belangrijke eerlijkheid
- De app is een werkende eerste versie, maar niet vooraf live getest in jouw account of in productie.
- De live verbinding vereist eerst een Cloudflare Worker. OVapi REST is HTTP-only, daarom gebruiken we een HTTPS-proxy.
- De app zoekt haltes in de OVapi timingpoint-index. Sommige haltebenamingen kunnen dubbel voorkomen; controleer de code en richting.
- Openbare bordlinks bevatten de gekozen bordinstellingen in de URL-hash. Bezoekers zien het bord, niet het beheerscherm. Deel de link niet als je de instellingen niet openbaar wilt maken.
- De beheerinstellingen en proxy-URL worden lokaal in je browser opgeslagen. Gebruik Exporteer back-up voor behoud/verplaatsen.
- De openbare kijklink kan op elke pagina geopend worden. De kijklink wordt niet automatisch op een eigen domein gehost; daarvoor heb je statische hosting nodig.
- Geen officiële R-Net- of vervoerderswebsite. Vertrektijden kunnen veranderen.

Deel A - Publiceer de app gratis met GitHub Pages
1. Maak een account op https://github.com en maak een openbare repository, bv. rnet-ov-bordbouwer.
2. Upload index.html naar de hoofdmap van de repository.
3. Ga naar Settings > Pages.
4. Kies Deploy from a branch, branch main, map /(root), klik Save.
5. Wacht op het github.io-adres. Open het en bewaar de URL.

Deel B - Zet de HTTPS-proxy live met Cloudflare Workers
1. Maak een account op https://dash.cloudflare.com (Workers & Pages).
2. Open Workers & Pages en kies Create > Worker (interface kan iets verschillen).
3. Geef de Worker een naam, bv. rnet-ovapi-proxy, en deploy een eenvoudige Worker.
4. Open Edit code en vervang de code door de volledige inhoud van worker.js uit dit pakket.
5. Klik Deploy.
6. Open de Worker-URL, bijvoorbeeld https://rnet-ovapi-proxy.<jouw-subdomein>.workers.dev/health
   Verwacht: {"ok":true,"service":"R-Net OV Bordbouwer proxy"}
7. Test haltezoekfunctie via /search?q=Bornholm. De eerste zoekopdracht kan wat langer duren doordat de volledige timingpoint-index opgehaald wordt.

Deel C - Koppel en maak je eerste bord
1. Open je GitHub Pages website.
2. Vul links bij HTTPS API-proxy URL de Worker-URL in, zonder pad zoals /health.
3. Zoek "Bornholm" en kies de juiste halte in de resultaten. Let goed op de haltecode en eventuele dubbele richtingen.
4. Kies aantal regels, layout en kleuren.
5. Klik Instellingen opslaan en daarna Ververs live data.
6. Klik Maak openbare bordlink en kopieer de link. Deze URL opent alleen het vertrekbord en kan gedeeld worden.

Meerdere borden
- Klik Nieuw bord, configureer andere halte en sla op.
- Borden worden in de lokale browser bewaard.
- Exporteer instellingen om een JSON-back-up te maken. De export is een back-up, niet bedoeld om rechtstreeks in GitHub te uploaden.

JouwWeb Pro
Optie 1 (meest betrouwbaar): maak op JouwWeb een pagina met een knop/link naar de openbare bordlink of de GitHub Pages beheerapp.
Optie 2 (insluiten): sleep in JouwWeb het Embed Code-element op een pagina en gebruik bijvoorbeeld:
<iframe src="PLAK_HIER_DE_OPENBARE_BORDLINK" title="OV vertrekbord" style="width:100%;height:620px;border:0;border-radius:12px" loading="lazy"></iframe>
Vervang PLAK_HIER_DE_OPENBARE_BORDLINK door de link die de app maakt. Controleer de gepubliceerde website. JouwWeb laat HTML-embed toe bij Pro, maar waarschuwt dat aangepaste API-koppelingen via HTML niet worden ondersteund; als iframe of scripts worden geblokkeerd, gebruik de gewone link.

Problemen oplossen
- /health werkt niet: Worker niet goed gedeployed of verkeerde URL.
- Zoeken geeft fout: open /search?q=Bornholm rechtstreeks; probeer later opnieuw als OVapi tijdelijk niet reageert.
- Live data fout: controleer of code een OVapi timingpoint-code is en of Worker URL exact klopt.
- Geen vertrektijden: controleer andere richting/haltecode en kijk later opnieuw.
