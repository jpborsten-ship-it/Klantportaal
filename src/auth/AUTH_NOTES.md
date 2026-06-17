# Auth — nog niet geïmplementeerd

Bewuste keuze in fase 1-6: geen login, open demo op mockdata. Deze map markeert waar een login-laag later wordt ingevoegd, zodat de rest van de code daar niet voor hoeft te worden herschreven.

Wat er straks bij komt:
- Een `AuthProvider`/context, naar het patroon van `src/state/DeliveryPlanningContext.jsx`, die de ingelogde klant levert.
- `src/utils/currentCustomer.js` (`CURRENT_CUSTOMER_ID`) wordt vervangen door de klant-ID uit die auth-context — dat is de enige plek in de pagina's die hiervoor aangepast moet worden, omdat alle pagina's al via deze constante filteren.
- Route-guards in `src/App.jsx` rond de huidige `<Routes>`.
- Keuze tussen een eigen klant-login of koppeling aan bestaande CRM-contacten (`CRM-2.0`) — nog met de gebruiker te bespreken.
