/**
 * @typedef {'nieuw' | 'in_behandeling' | 'verzonden' | 'afgeleverd'} OrderStatus
 */

/**
 * @typedef {'zo_snel_mogelijk' | 'compleet'} LeverVoorkeur
 * - 'zo_snel_mogelijk': elk onderdeel wordt geleverd zodra het beschikbaar is
 * - 'compleet': de order wordt in één keer geleverd zodra alles compleet is
 */

/**
 * @typedef {Object} Klant
 * @property {string} id
 * @property {string} naam
 * @property {string} bedrijfsnaam
 * @property {string} email
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} orderId
 * @property {string} naam
 * @property {string} sku
 * @property {number} aantal
 * @property {number} prijs - fictieve mockprijs in euro's, excl. btw
 * @property {string|null} leverdatum - ISO-datum; null = volgt de leverVoorkeur van de order
 * @property {string|null} trackingCode - TODO koppeling: DHL-tracking, nu altijd null
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} ordernummer
 * @property {string} klantId
 * @property {OrderStatus} status
 * @property {LeverVoorkeur} leverVoorkeur
 * @property {string|null} gewenstLeverdatum - ISO-datum; basis voor de leveragenda, null = nog niet gepland
 * @property {string} aangemaaktOp - ISO-datum
 * @property {OrderItem[]} items
 */

export {};
