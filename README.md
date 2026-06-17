“Maak nog geen definitieve API-koppelingen. Gebruik mockdata en zorg dat de code later makkelijk te koppelen is aan echte systemen.”


Je bent mijn senior full-stack developer voor PartsProfi.

Ik wil een klantportaal bouwen voor PartsProfi. PartsProfi is een B2B-platform voor mobiliteitsonderdelen. De kern van het klantportaal is niet alleen tonen van orders, maar vooral klanten grip geven op planning: wat komt wanneer binnen, wat kan wanneer geleverd worden en hoe kunnen leveringen slim gecombineerd worden.

Belangrijk:

* Bouw eerst een MVP.
* Maak het modulair en uitbreidbaar.
* Gebruik duidelijke componenten.
* Maak waar nodig eerst mockdata.
* Denk vanuit een B2B-garageklant.
* Focus op overzicht, planning, eenvoud en minder losse communicatie.

## Doel van het klantportaal

Klanten moeten in één omgeving kunnen zien:

* Welke facturen openstaan, betaald zijn of nog betaald moeten worden.
* Welke orders lopen.
* Wat de status is per productregel, niet alleen per order.
* Welke producten wanneer bij PartsProfi binnenkomen.
* Welke producten wanneer bij de klant geleverd worden.
* Welke levermomenten gekozen of aangepast kunnen worden.
* Wat de bezorgkosten per leverdag zijn.
* Welke retouren zijn aangevraagd of nog aangevraagd kunnen worden.
* Welke klantgegevens bekend zijn.

De belangrijkste gedachte:
Maak het klantportaal vooral een planningstool. Niet alleen gegevens tonen, maar klanten laten sturen op levermomenten, beschikbaarheid en bezorgkosten.

---

# MVP / versie 1

Bouw eerst deze onderdelen:

## 1. Dashboard

Startscherm na inloggen.

Toon:

* openstaande facturen
* orders onderweg
* geplande levermomenten
* producten die nog een leverkeuze nodig hebben
* acties die nog nodig zijn

Snelle acties:

* factuur betalen
* levermoment kiezen
* order bekijken
* retour aanvragen

## 2. Finance omgeving

Klanten moeten kunnen zien:

* openstaande facturen
* te betalen facturen
* betaalde facturen
* verzamelfacturen
* losse facturen

Acties:

* factuur downloaden
* betalen via betaallink
* status bekijken

Velden per factuur:

* factuurnummer
* factuurdatum
* vervaldatum
* bedrag
* status
* type: losse factuur of verzamelfactuur
* betaallink indien openstaand

## 3. Orders en status per product

Niet alleen orderstatus tonen, maar status per artikelregel.

Per order tonen:

* ordernummer
* besteldatum
* klantreferentie
* totaalbedrag
* algemene status

Per productregel tonen:

* artikelnummer
* omschrijving
* aantal
* prijs
* status
* verwachte aankomstdatum bij PartsProfi
* geplande leverdag naar klant
* trackingcode indien verzonden
* DHL tracking indien beschikbaar

Mogelijke statussen:

* besteld
* bevestigd
* onderweg naar PartsProfi
* binnen bij PartsProfi
* ingepland
* verzonden
* geleverd
* vertraagd
* retour aangevraagd

## 4. Levermoment kiezen per product

Klanten moeten per product een levermoment kunnen kiezen op basis van wanneer het product bij PartsProfi binnenkomt.

Belangrijk:

* producten kunnen los worden ingepland
* producten hoeven dus niet verplicht per complete order geleverd te worden
* producten uit meerdere orders mogen gecombineerd worden
* klant moet kunnen kiezen tussen:

  1. alles zo snel mogelijk
  2. leveren zodra de hele order compleet is
  3. zelf plannen per product

Toon bij het kiezen:

* beschikbare leverdagen
* producten die op die dag geleverd kunnen worden
* bezorgkosten per leverdag
* waarschuwing als opsplitsen extra bezorgkosten geeft
* melding als combineren voordeliger is

## 5. Leveragenda

Maak een agendaweergave per dag of week.

In de agenda staan producten ingedeeld per leverdag.

Functionaliteit:

* producten per dag bekijken
* producten verplaatsen naar andere leverdag
* bezorgkosten per dag tonen
* producten uit meerdere orders combineren
* zien welke producten nog niet ingepland zijn
* plannen tot een vooraf ingesteld aantal dagen vooruit

Belangrijk onderscheid:

* beschikbaar bij PartsProfi
* gewenste leverdag bij klant
* verzendactie vanuit PartsProfi

## 6. Mijn gegevens

Klanten moeten hun gegevens kunnen bekijken en waar toegestaan aanpassen.

Velden:

* bedrijfsnaam
* voornaam
* achternaam
* e-mailadres
* telefoonnummer
* btw-nummer
* factuuradres
* afleveradressen

Functionaliteit:

* meerdere afleveradressen tonen
* standaard afleveradres kiezen
* gegevens wijzigen of wijzigingsverzoek indienen

## 7. Retour aanvragen

Retour aanvragen per product.

Functionaliteit:

* retour aanvragen vanuit order/productregel
* retourreden kiezen
* foto uploaden
* retourstatus volgen

Belangrijk:

* retourtermijn is 21 dagen vanaf moment van bestellen
* toon duidelijk of een product nog retour kan
* toon retourkosten transparant
* vermeld mogelijkheid om gratis langs te brengen indien van toepassing

Mogelijke retourstatussen:

* aangevraagd
* in behandeling
* goedgekeurd
* afgewezen
* ontvangen
* verwerkt

## 8. FAQ / hulp

Maak een simpele FAQ-omgeving.

Onderwerpen:

* bestellen
* levertijden
* levermomenten
* bezorgkosten
* retouren
* betalen
* accountgegevens

FAQ-teksten mogen voorlopig mockdata zijn.

---

# Datamodel

Maak minimaal modellen/entities voor:

## Customer

* id
* companyName
* contactName
* email
* phone
* vatNumber
* billingAddress
* deliveryAddresses
* defaultDeliveryAddressId

## Invoice

* id
* invoiceNumber
* customerId
* date
* dueDate
* amount
* status
* type
* downloadUrl
* paymentUrl

## Order

* id
* orderNumber
* customerId
* orderDate
* customerReference
* totalAmount
* status

## OrderLine

* id
* orderId
* productNumber
* description
* quantity
* unitPrice
* status
* expectedArrivalAtPartsProfi
* plannedDeliveryDate
* trackingCode
* carrier
* canReturnUntil

## DeliveryMoment

* id
* customerId
* deliveryDate
* deliveryAddressId
* deliveryCost
* status

## DeliveryMomentLine

* id
* deliveryMomentId
* orderLineId

## ReturnRequest

* id
* orderLineId
* customerId
* reason
* photoUrl
* status
* createdAt

## FAQItem

* id
* category
* question
* answer

---

# Belangrijke UX-regels

* Gebruik duidelijke taal.
* Maak het simpel voor een garagehouder.
* Geen ingewikkelde platformtaal.
* Laat altijd zien welke actie de klant kan doen.
* Toon kosten en planning duidelijk.
* Maak combineren van leveringen logisch en zichtbaar.
* Gebruik de PartsProfi-stijl: helder, menselijk, praktisch.
* Vermijd het woord “duur”. Gebruik “voordeliger”, “scherper geprijsd” of “prijsbewust”.

---

# Technische opdracht

Maak eerst:

1. de datastructuur
2. mockdata
3. routes/pagina’s
4. basiscomponenten
5. interactieve leveragenda
6. eenvoudige statusflows

Werk in kleine stappen.

Begin met een analyse van de gewenste architectuur. Stel daarna een concreet bouwplan op in fases. Bouw vervolgens fase 1.
:

* welke bestanden je aanmaakt of wijzigt
* waarom je dat doet
* welke aannames je maakt
* wat later gekoppeld moet worden aan echte systemen zoals boekhouding, orderdatabase, DHL tracking en betaalprovider

Start nu met het maken van het technische plan en de eerste implementatie voor de MVP.
“Maak nog geen definitieve API-koppelingen. Gebruik mockdata en zorg dat de code later makkelijk te koppelen is aan echte systemen.”
