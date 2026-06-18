import { createContext, useContext, useState } from 'react'
import { orderLines as initialOrderLines, orders } from '../data/mockData'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'
import { getEarliestDeliveryDate } from '../utils/deliveryCost'

// Eén gedeelde bron voor plannedDeliveryDate per regel, zodat de leveragenda en
// de levermoment-keuze per order dezelfde state lezen/schrijven.
const DeliveryPlanningContext = createContext(null)

export const DEFAULT_DELIVERY_PREFERENCE = 'zo_snel_mogelijk'

const ordersById = new Map(orders.map((order) => [order.id, order]))
const customerOrderIds = new Set(orders.filter((order) => order.customerId === CURRENT_CUSTOMER_ID).map((order) => order.id))

// Vaste standaardinstelling: elke regel krijgt haar vroegst-mogelijke
// leverdatum op basis van levertijdcategorie (groen/oranje) — er staat dus
// nooit een product "niet ingepland". Bij 'compleet' krijgen alle regels van
// een order de traagste (laatste) vroegst-mogelijke datum binnen die order:
// 1 jasje. Bij 'zo_snel_mogelijk' krijgt elke regel haar eigen datum, dus een
// order met zowel groen als oranje regels valt vanzelf in 2 jasjes.
function applyPreferenceToLines(lines, preference) {
  const latestEarliestByOrder = {}
  lines.forEach((line) => {
    if (!customerOrderIds.has(line.orderId)) return
    const order = ordersById.get(line.orderId)
    const earliest = getEarliestDeliveryDate(order.orderDate, line.leadTimeCategory)
    const current = latestEarliestByOrder[line.orderId]
    if (!current || earliest > current) {
      latestEarliestByOrder[line.orderId] = earliest
    }
  })

  return lines.map((line) => {
    if (!customerOrderIds.has(line.orderId)) return line
    const order = ordersById.get(line.orderId)
    const ownEarliest = getEarliestDeliveryDate(order.orderDate, line.leadTimeCategory)
    const newDate = preference === 'compleet' ? latestEarliestByOrder[line.orderId] : ownEarliest
    return { ...line, plannedDeliveryDate: newDate }
  })
}

export function DeliveryPlanningProvider({ children }) {
  const [deliveryPreference, setDeliveryPreferenceState] = useState(DEFAULT_DELIVERY_PREFERENCE)
  const [lines, setLines] = useState(() => applyPreferenceToLines(initialOrderLines, DEFAULT_DELIVERY_PREFERENCE))

  function updateLineDeliveryDate(lineId, date) {
    setLines((prev) => prev.map((line) => (line.id === lineId ? { ...line, plannedDeliveryDate: date } : line)))
  }

  // Verplaatst een heel jasje. Een regel die de doeldatum niet toelaat (eigen
  // vroegst-mogelijke datum ligt later) blijft op haar huidige datum staan —
  // dat is precies hoe een jasje vanzelf weer splitst als je het te vroeg neerzet.
  function updateLinesDeliveryDate(lineIds, date) {
    const idSet = new Set(lineIds)
    setLines((prev) =>
      prev.map((line) => {
        if (!idSet.has(line.id)) return line
        const order = ordersById.get(line.orderId)
        const earliest = getEarliestDeliveryDate(order.orderDate, line.leadTimeCategory)
        if (date < earliest) return line
        return { ...line, plannedDeliveryDate: date }
      })
    )
  }

  function setDeliveryPreference(preference) {
    setDeliveryPreferenceState(preference)
    setLines((prev) => applyPreferenceToLines(prev, preference))
  }

  return (
    <DeliveryPlanningContext.Provider
      value={{ lines, updateLineDeliveryDate, updateLinesDeliveryDate, deliveryPreference, setDeliveryPreference }}
    >
      {children}
    </DeliveryPlanningContext.Provider>
  )
}

export function useDeliveryPlanning() {
  const ctx = useContext(DeliveryPlanningContext)
  if (!ctx) throw new Error('useDeliveryPlanning must be used within DeliveryPlanningProvider')
  return ctx
}
