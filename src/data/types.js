/**
 * @typedef {'besteld' | 'bevestigd' | 'onderweg_naar_partsprofi' | 'binnen_bij_partsprofi' | 'ingepland' | 'verzonden' | 'geleverd' | 'vertraagd' | 'retour_aangevraagd'} OrderLineStatus
 */

/**
 * @typedef {'open' | 'betaald' | 'vervallen'} InvoiceStatus
 */

/**
 * @typedef {'losse_factuur' | 'verzamelfactuur'} InvoiceType
 */

/**
 * @typedef {'gepland' | 'concept'} DeliveryMomentStatus
 */

/**
 * @typedef {'aangevraagd' | 'in_behandeling' | 'goedgekeurd' | 'afgewezen' | 'ontvangen' | 'verwerkt'} ReturnRequestStatus
 */

/**
 * @typedef {Object} DeliveryAddress
 * @property {string} id
 * @property {string} label
 * @property {string} straat
 * @property {string} postcode
 * @property {string} plaats
 */

/**
 * @typedef {Object} Customer
 * @property {string} id
 * @property {string} companyName
 * @property {string} contactName
 * @property {string} email
 * @property {string} phone
 * @property {string} vatNumber
 * @property {DeliveryAddress} billingAddress
 * @property {DeliveryAddress[]} deliveryAddresses
 * @property {string} defaultDeliveryAddressId
 */

/**
 * @typedef {Object} Invoice
 * @property {string} id
 * @property {string} invoiceNumber
 * @property {string} customerId
 * @property {string} date - ISO-datum
 * @property {string} dueDate - ISO-datum
 * @property {number} amount
 * @property {InvoiceStatus} status
 * @property {InvoiceType} type
 * @property {string} downloadUrl - TODO koppeling: boekhoudsysteem, nu mock-link
 * @property {string|null} paymentUrl - TODO koppeling: betaalprovider, null als al betaald
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} orderNumber
 * @property {string} customerId
 * @property {string} orderDate - ISO-datum
 * @property {string} customerReference
 * @property {number} totalAmount
 * @property {OrderLineStatus} status - afgeleid uit regelstatussen, zie utils/orderStatus.js (fase 3)
 */

/**
 * @typedef {Object} OrderLine
 * @property {string} id
 * @property {string} orderId
 * @property {string} productNumber
 * @property {string} description
 * @property {number} quantity
 * @property {number} unitPrice
 * @property {OrderLineStatus} status
 * @property {string|null} expectedArrivalAtPartsProfi - ISO-datum
 * @property {string|null} plannedDeliveryDate - ISO-datum; null = nog geen leverkeuze gemaakt
 * @property {string|null} trackingCode - TODO koppeling: DHL-tracking, null tot status 'verzonden'
 * @property {string|null} carrier - TODO koppeling: DHL/vervoerder, null tot verzonden
 * @property {string} canReturnUntil - ISO-datum, 21 dagen vanaf besteldatum van de order
 */

/**
 * @typedef {Object} DeliveryMoment
 * @property {string} id
 * @property {string} customerId
 * @property {string} deliveryDate - ISO-datum
 * @property {string} deliveryAddressId
 * @property {number} deliveryCost - TODO koppeling: echte tarieventabel PartsProfi, nu mockbedrag
 * @property {DeliveryMomentStatus} status
 */

/**
 * @typedef {Object} DeliveryMomentLine
 * @property {string} id
 * @property {string} deliveryMomentId
 * @property {string} orderLineId
 */

/**
 * @typedef {Object} ReturnRequest
 * @property {string} id
 * @property {string} orderLineId
 * @property {string} customerId
 * @property {string} reason
 * @property {string|null} photoUrl - mock, geen echte upload in fase 1
 * @property {ReturnRequestStatus} status
 * @property {string} createdAt - ISO-datum
 */

/**
 * @typedef {Object} FAQItem
 * @property {string} id
 * @property {string} category
 * @property {string} question
 * @property {string} answer
 */

export {};
