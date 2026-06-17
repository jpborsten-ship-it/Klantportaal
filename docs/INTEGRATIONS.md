# Koppelpunten — wat nu mock is en later echt moet worden

Dit document verzamelt alle plekken in het klantportaal die nu op mockdata draaien en die bij een echte uitrol gekoppeld moeten worden aan een bestaand systeem. Per koppelpunt staat aangegeven welk bestand/veld het betreft.

## Orderdatabase / CRM-backend (`CRM-2.0`)
- `Order` en `OrderLine` (`src/data/types.js`, `src/data/mockData.js`) — alle order- en regelstatussen zijn nu hardcoded. Moet een live read (en op termijn write, bv. bij verplaatsen van een leverdag) worden naar de order-/voorraadadministratie.
- `OrderLine.plannedDeliveryDate` (`src/state/DeliveryPlanningContext.jsx`) — wijzigingen vanuit Levermoment kiezen (fase 4) en de Leveragenda (fase 5) leven nu alleen in React-state (verdwijnen bij herladen). Moet een API-call worden die de planning persistent opslaat.
- `DeliveryMoment.deliveryCost` (`src/utils/deliveryCost.js`) — vast mockbedrag (`MOCK_DELIVERY_COST = 7,50`) en combineer-drempel (`FREE_FROM_LINE_COUNT = 2`). Moet vervangen worden door de echte tarieventabel en beschikbaarheidslogica van PartsProfi. **Is nog niet met de gebruiker afgestemd — bewuste aanname.**
- `OrderLine.expectedArrivalAtPartsProfi` — bepaalt nu welke dagen selecteerbaar zijn in de leveragenda/leverkeuze. Moet een live status uit het logistiek/voorraadsysteem worden.
- Klantgegevens-wijzigingen (`src/pages/MijnGegevens.jsx`, "Gegevens wijzigen") — wordt nu lokaal als "verzonden" gemarkeerd, zonder echte opslag of approval-flow. Moet naar de CRM-backend.

## Boekhoudsysteem
- `Invoice` (`src/data/types.js`, `src/pages/Finance.jsx`) — facturen (nummer, bedrag, status, type) zijn volledig mock. Moet een live read worden vanuit de boekhouding.
- `Invoice.downloadUrl` — nu `#mock-download`. Moet een echte downloadlink naar het PDF-bestand in de boekhouding worden.

## Betaalprovider
- `Invoice.paymentUrl` (`src/pages/Finance.jsx`, knop "Betalen") — nu `#mock-pay`. Moet een echte betaallink van de betaalprovider worden, inclusief het terugkoppelen van de betaalstatus naar `Invoice.status`.

## DHL-tracking
- `OrderLine.trackingCode` en `OrderLine.carrier` (`src/data/types.js`, getoond in `src/pages/OrderDetail.jsx`) — nu een vaste mockwaarde zodra status `verzonden` is. Moet een live call naar de DHL-tracking-API worden, inclusief actuele bezorgstatus.

## Overig (geen extern systeem, wel een open punt)
- Foto-upload bij een retouraanvraag (`src/pages/Retouren.jsx`) — bestandskiezer is nu UI-only, er wordt niets geüpload of opgeslagen. Hoort bij een eigen backend/opslag (S3-achtige dienst), nog te kiezen.
- `ReturnRequest`-status-updates (`src/pages/Retouren.jsx`) — nieuwe aanvragen leven alleen in React-state. Moet naar het retourproces van PartsProfi.

## Authenticatie
Er is in fase 1-6 bewust géén authenticatie gebouwd: het portaal draait open op één vaste klant (`CURRENT_CUSTOMER_ID` in `src/utils/currentCustomer.js`, ook zichtbaar in de hardcoded naam in `src/components/layout/Topbar.jsx`). Zie `src/auth/AUTH_NOTES.md` voor waar een login-laag straks wordt ingevoegd.
