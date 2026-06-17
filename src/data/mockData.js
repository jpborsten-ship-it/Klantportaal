// Mockdata voor fase 1. Dekt bewust meerdere scenario's: vertraagde regel,
// niet-ingepland product, open/betaalde/verzamelfactuur, retouraanvraag,
// klant met meerdere afleveradressen, gecombineerd levermoment.

export const customers = [
  {
    id: 'cust-1',
    companyName: 'Garage Van Dijk',
    contactName: 'Mark van Dijk',
    email: 'mark@garagevandijk.nl',
    phone: '06-12345678',
    vatNumber: 'NL123456789B01',
    billingAddress: { id: 'addr-1-bill', label: 'Factuuradres', straat: 'Industrieweg 4', postcode: '3811AB', plaats: 'Amersfoort' },
    deliveryAddresses: [
      { id: 'addr-1-werkplaats', label: 'Werkplaats', straat: 'Industrieweg 4', postcode: '3811AB', plaats: 'Amersfoort' },
      { id: 'addr-1-magazijn', label: 'Magazijn Noord', straat: 'Handelskade 12', postcode: '3812CD', plaats: 'Amersfoort' },
    ],
    defaultDeliveryAddressId: 'addr-1-werkplaats',
  },
  {
    id: 'cust-2',
    companyName: 'AutoService Bakker',
    contactName: 'Linda Bakker',
    email: 'linda@autoservicebakker.nl',
    phone: '06-87654321',
    vatNumber: 'NL987654321B02',
    billingAddress: { id: 'addr-2-bill', label: 'Factuuradres', straat: 'Dorpsstraat 22', postcode: '7411EE', plaats: 'Deventer' },
    deliveryAddresses: [
      { id: 'addr-2-werkplaats', label: 'Werkplaats', straat: 'Dorpsstraat 22', postcode: '7411EE', plaats: 'Deventer' },
    ],
    defaultDeliveryAddressId: 'addr-2-werkplaats',
  },
];

export const invoices = [
  { id: 'inv-1', invoiceNumber: 'F2026-1001', customerId: 'cust-1', date: '2026-06-01', dueDate: '2026-06-15', amount: 482.5, status: 'open', type: 'losse_factuur', downloadUrl: '#mock-download', paymentUrl: '#mock-pay' },
  { id: 'inv-2', invoiceNumber: 'F2026-0987', customerId: 'cust-1', date: '2026-05-10', dueDate: '2026-05-24', amount: 1290.0, status: 'betaald', type: 'verzamelfactuur', downloadUrl: '#mock-download', paymentUrl: null },
  { id: 'inv-3', invoiceNumber: 'F2026-1002', customerId: 'cust-2', date: '2026-06-05', dueDate: '2026-06-19', amount: 156.75, status: 'open', type: 'losse_factuur', downloadUrl: '#mock-download', paymentUrl: '#mock-pay' },
];

export const orders = [
  { id: 'ord-1', orderNumber: 'O-3001', customerId: 'cust-1', orderDate: '2026-06-02', customerReference: 'WO-554', totalAmount: 482.5, status: 'ingepland' },
  { id: 'ord-2', orderNumber: 'O-3002', customerId: 'cust-1', orderDate: '2026-06-10', customerReference: 'WO-560', totalAmount: 210.0, status: 'vertraagd' },
  { id: 'ord-3', orderNumber: 'O-3003', customerId: 'cust-2', orderDate: '2026-06-12', customerReference: '', totalAmount: 156.75, status: 'binnen_bij_partsprofi' },
];

export const orderLines = [
  // Order 1 (cust-1) — al ingepland op een gecombineerd levermoment
  { id: 'ol-1', orderId: 'ord-1', productNumber: 'REM-2245', description: 'Remschijfset voorzijde', quantity: 1, unitPrice: 142.5, status: 'ingepland', expectedArrivalAtPartsProfi: '2026-06-18', plannedDeliveryDate: '2026-06-22', trackingCode: null, carrier: null, canReturnUntil: '2026-06-23' },
  { id: 'ol-2', orderId: 'ord-1', productNumber: 'FLT-0099', description: 'Oliefilter set (x10)', quantity: 1, unitPrice: 90.0, status: 'verzonden', expectedArrivalAtPartsProfi: '2026-06-10', plannedDeliveryDate: '2026-06-15', trackingCode: '3SDHL00012345', carrier: 'DHL', canReturnUntil: '2026-06-23' },
  { id: 'ol-3', orderId: 'ord-1', productNumber: 'ACC-1180', description: 'Accu 12V 70Ah', quantity: 2, unitPrice: 125.0, status: 'geleverd', expectedArrivalAtPartsProfi: '2026-06-05', plannedDeliveryDate: '2026-06-08', trackingCode: '3SDHL00011111', carrier: 'DHL', canReturnUntil: '2026-06-23' },

  // Order 2 (cust-1) — vertraagde regel + een regel die nog geen leverkeuze heeft (niet-ingepland)
  { id: 'ol-4', orderId: 'ord-2', productNumber: 'BAND-2055', description: 'Bandenset 205/55R16', quantity: 4, unitPrice: 45.0, status: 'vertraagd', expectedArrivalAtPartsProfi: '2026-06-25', plannedDeliveryDate: null, trackingCode: null, carrier: null, canReturnUntil: '2026-07-01' },
  { id: 'ol-5', orderId: 'ord-2', productNumber: 'WIS-0334', description: 'Ruitenwisserset', quantity: 1, unitPrice: 30.0, status: 'binnen_bij_partsprofi', expectedArrivalAtPartsProfi: '2026-06-14', plannedDeliveryDate: null, trackingCode: null, carrier: null, canReturnUntil: '2026-07-01' },

  // Order 3 (cust-2) — onderweg + een geleverde regel met retouraanvraag
  { id: 'ol-6', orderId: 'ord-3', productNumber: 'KOP-7712', description: 'Koppelingsset', quantity: 1, unitPrice: 110.75, status: 'onderweg_naar_partsprofi', expectedArrivalAtPartsProfi: '2026-06-20', plannedDeliveryDate: null, trackingCode: null, carrier: null, canReturnUntil: '2026-07-03' },
  { id: 'ol-7', orderId: 'ord-3', productNumber: 'LMP-0456', description: 'LED koplampset', quantity: 1, unitPrice: 46.0, status: 'retour_aangevraagd', expectedArrivalAtPartsProfi: '2026-06-08', plannedDeliveryDate: '2026-06-11', trackingCode: '3SDHL00099887', carrier: 'DHL', canReturnUntil: '2026-07-03' },
];

export const deliveryMoments = [
  // Gecombineerd levermoment: bundelt regels uit potentieel meerdere orders van dezelfde klant
  { id: 'dm-1', customerId: 'cust-1', deliveryDate: '2026-06-22', deliveryAddressId: 'addr-1-werkplaats', deliveryCost: 0, status: 'gepland' },
  { id: 'dm-2', customerId: 'cust-1', deliveryDate: '2026-06-15', deliveryAddressId: 'addr-1-werkplaats', deliveryCost: 7.5, status: 'gepland' },
];

export const deliveryMomentLines = [
  { id: 'dml-1', deliveryMomentId: 'dm-1', orderLineId: 'ol-1' },
  { id: 'dml-2', deliveryMomentId: 'dm-2', orderLineId: 'ol-2' },
];

export const returnRequests = [
  { id: 'ret-1', orderLineId: 'ol-7', customerId: 'cust-2', reason: 'Verkeerd model ontvangen', photoUrl: null, status: 'in_behandeling', createdAt: '2026-06-13' },
];

export const faqItems = [
  { id: 'faq-1', category: 'Bestellen', question: 'Hoe plaats ik een order?', answer: 'Bestel via je vaste contactpersoon of het portaal; je ziet de status direct per onderdeel terug.' },
  { id: 'faq-2', category: 'Levertijden', question: 'Hoe weet ik wanneer een onderdeel binnenkomt?', answer: 'Op de orderregel zie je de verwachte aankomstdatum bij PartsProfi, nog voordat er een leverdag gekozen is.' },
  { id: 'faq-3', category: 'Bezorgkosten', question: 'Hoe bespaar ik op bezorgkosten?', answer: 'Combineer onderdelen op één leverdag — dat is vaak prijsbewuster dan losse leveringen.' },
  { id: 'faq-4', category: 'Retouren', question: 'Hoelang kan ik een onderdeel retourneren?', answer: 'Tot 21 dagen na bestellen, zolang het onderdeel niet gemonteerd of beschadigd is.' },
];
