import { getEarliestDeliveryDate } from './deliveryCost'

// Groepeert de regels die op een dag staan tot "jasjes": puur op orderId.
// Als groene en oranje regels van dezelfde order toevallig op dezelfde dag
// staan, vormen ze automatisch samen één jasje (samenvoegen). Verplaats je
// het jasje weer naar een dag vóór de eigen datum van een regel, dan blijft
// die regel achter op haar oude dag — het jasje splitst dan vanzelf weer,
// want ze delen dan niet meer dezelfde plannedDeliveryDate.
export function buildBlocksForDay(plannedLines, orders) {
  const groups = new Map()

  plannedLines.forEach((line) => {
    const order = orders.find((o) => o.id === line.orderId)
    if (!groups.has(line.orderId)) {
      groups.set(line.orderId, { order, lines: [] })
    }
    groups.get(line.orderId).lines.push(line)
  })

  return [...groups.values()].map((group) => {
    const earliestDates = group.lines.map((line) => getEarliestDeliveryDate(group.order.orderDate, line.leadTimeCategory))
    return {
      ...group,
      // 'vanaf' deze datum is het jasje compleet/klaar als geheel.
      earliestDeliveryDate: earliestDates.reduce((latest, date) => (date > latest ? date : latest)),
      // hardste grens: vóór deze datum kan geen enkele regel uit dit jasje, dus is een drop daar volledig zinloos.
      minEarliestDeliveryDate: earliestDates.reduce((earliest, date) => (date < earliest ? date : earliest)),
    }
  })
}
