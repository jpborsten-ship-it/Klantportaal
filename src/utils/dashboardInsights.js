import { deriveOrderStatus, getOrderLines } from './orderStatus'

// "Acties nodig": alleen dingen waar de klant iets mee moet doen, op basis
// van echte signalen — geen verzonnen velden. Vertraagde regels, open
// facturen, en een retour zonder foto.
export function getActionRequiredItems(klantLines, orders, invoices, returnRequests, customerId) {
  const items = []
  const ordersById = new Map(orders.map((order) => [order.id, order]))

  const vertraagdeRegels = klantLines.filter((line) => line.status === 'vertraagd')
  vertraagdeRegels.forEach((line) => {
    const order = ordersById.get(line.orderId)
    items.push({
      id: `vertraagd-${line.id}`,
      title: `${line.productNumber} is vertraagd`,
      explanation: `Dit onderdeel uit order ${order?.orderNumber ?? '—'} duurt langer dan verwacht. Bekijk de order voor de laatste status.`,
      urgency: 'hoog',
      actionLabel: 'Bekijk order',
      actionPath: order ? `/orders/${order.id}` : '/orders',
    })
  })

  const openFacturen = invoices.filter((inv) => inv.customerId === customerId && inv.status === 'open')
  openFacturen.forEach((inv) => {
    items.push({
      id: `factuur-${inv.id}`,
      title: `Factuur ${inv.invoiceNumber} staat klaar voor betaling`,
      explanation: `€ ${inv.amount.toFixed(2)} — vervaldatum ${inv.dueDate}.`,
      urgency: 'middel',
      actionLabel: 'Betaal factuur',
      actionPath: '/finance',
    })
  })

  const retourZonderFoto = returnRequests.filter((r) => r.customerId === customerId && !r.photoUrl)
  retourZonderFoto.forEach((r) => {
    items.push({
      id: `retour-${r.id}`,
      title: 'Retouraanvraag heeft een foto nodig',
      explanation: `Voeg een foto toe aan je retouraanvraag (${r.reason}) zodat we 'm sneller kunnen afhandelen.`,
      urgency: 'middel',
      actionLabel: 'Voeg foto toe',
      actionPath: '/retouren',
    })
  })

  return items
}

export function getFinanceSummary(invoices, customerId) {
  const klantFacturen = invoices.filter((inv) => inv.customerId === customerId)
  const open = klantFacturen.filter((inv) => inv.status === 'open')
  const betaaldDezeMaand = klantFacturen.filter((inv) => inv.status === 'betaald')

  const eerstvolgendeVervaldatum = open.reduce((earliest, inv) => (!earliest || inv.dueDate < earliest ? inv.dueDate : earliest), null)

  return {
    openstaandAantal: open.length,
    openstaandBedrag: open.reduce((sum, inv) => sum + inv.amount, 0),
    eerstvolgendeVervaldatum,
    betaaldDezeMaandBedrag: betaaldDezeMaand.reduce((sum, inv) => sum + inv.amount, 0),
    verzamelfactuur: klantFacturen.find((inv) => inv.type === 'verzamelfactuur'),
  }
}

export function getRecentOrders(orders, lines, customerId, limit = 5) {
  return orders
    .filter((order) => order.customerId === customerId)
    .sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1))
    .slice(0, limit)
    .map((order) => {
      const orderLines = getOrderLines(lines, order.id)
      return { order, lines: orderLines, status: deriveOrderStatus(orderLines) }
    })
}
