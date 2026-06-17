// Afgeleide orderstatus op basis van de regelstatussen, zodat we geen losse
// orderstatus moeten bijhouden die uit sync kan lopen met de regels zelf.
const TERMINAL_STATUSES = ['geleverd', 'retour_aangevraagd']

export function deriveOrderStatus(lines) {
  if (lines.length === 0) return 'besteld'
  const statuses = new Set(lines.map((line) => line.status))

  if (statuses.has('vertraagd')) return 'vertraagd'
  if ([...statuses].every((s) => TERMINAL_STATUSES.includes(s))) return 'geleverd'
  if (statuses.size > 1) return 'deels_verzonden'
  return [...statuses][0]
}

export function getOrderLines(orderLines, orderId) {
  return orderLines.filter((line) => line.orderId === orderId)
}

export function linesForCustomer(orderLines, orders, customerId) {
  const orderIds = new Set(orders.filter((order) => order.customerId === customerId).map((order) => order.id))
  return orderLines.filter((line) => orderIds.has(line.orderId))
}
