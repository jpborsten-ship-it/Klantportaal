import { createContext, useContext, useState } from 'react'
import { orderLines as initialOrderLines, orders } from '../data/mockData'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

// Eén gedeelde bron voor plannedDeliveryDate per regel, zodat de leveragenda en
// de levermoment-keuze per order dezelfde state lezen/schrijven.
const DeliveryPlanningContext = createContext(null)

export const DEFAULT_DELIVERY_PREFERENCE = 'zo_snel_mogelijk'

// Vaste standaardinstelling: zolang een regel bij PartsProfi is aangekomen,
// krijgt hij altijd een leverdag — er staat dus nooit een product "niet
// ingepland". Bij 'compleet' krijgen alle regels van een order de laatste
// aankomstdatum binnen die order.
function applyPreferenceToLines(lines, preference) {
  const customerOrderIds = new Set(orders.filter((order) => order.customerId === CURRENT_CUSTOMER_ID).map((order) => order.id))
  const latestArrivalByOrder = {}
  lines.forEach((line) => {
    if (!customerOrderIds.has(line.orderId) || !line.expectedArrivalAtPartsProfi) return
    const current = latestArrivalByOrder[line.orderId]
    if (!current || line.expectedArrivalAtPartsProfi > current) {
      latestArrivalByOrder[line.orderId] = line.expectedArrivalAtPartsProfi
    }
  })

  return lines.map((line) => {
    if (!customerOrderIds.has(line.orderId) || !line.expectedArrivalAtPartsProfi) return line
    const newDate = preference === 'compleet' ? latestArrivalByOrder[line.orderId] : line.expectedArrivalAtPartsProfi
    return { ...line, plannedDeliveryDate: newDate }
  })
}

export function DeliveryPlanningProvider({ children }) {
  const [deliveryPreference, setDeliveryPreferenceState] = useState(DEFAULT_DELIVERY_PREFERENCE)
  const [lines, setLines] = useState(() => applyPreferenceToLines(initialOrderLines, DEFAULT_DELIVERY_PREFERENCE))

  function updateLineDeliveryDate(lineId, date) {
    setLines((prev) => prev.map((line) => (line.id === lineId ? { ...line, plannedDeliveryDate: date } : line)))
  }

  function setDeliveryPreference(preference) {
    setDeliveryPreferenceState(preference)
    setLines((prev) => applyPreferenceToLines(prev, preference))
  }

  return (
    <DeliveryPlanningContext.Provider value={{ lines, updateLineDeliveryDate, deliveryPreference, setDeliveryPreference }}>
      {children}
    </DeliveryPlanningContext.Provider>
  )
}

export function useDeliveryPlanning() {
  const ctx = useContext(DeliveryPlanningContext)
  if (!ctx) throw new Error('useDeliveryPlanning must be used within DeliveryPlanningProvider')
  return ctx
}
