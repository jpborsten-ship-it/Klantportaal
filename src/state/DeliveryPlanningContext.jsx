import { createContext, useContext, useState } from 'react'
import { orderLines as initialOrderLines } from '../data/mockData'

// Eén gedeelde bron voor plannedDeliveryDate per regel, zodat fase 4 (levermoment
// kiezen) en fase 5 (leveragenda) dezelfde state lezen/schrijven in plaats van
// elk hun eigen kopie te onderhouden.
const DeliveryPlanningContext = createContext(null)

export function DeliveryPlanningProvider({ children }) {
  const [lines, setLines] = useState(initialOrderLines)

  function updateLineDeliveryDate(lineId, date) {
    setLines((prev) => prev.map((line) => (line.id === lineId ? { ...line, plannedDeliveryDate: date } : line)))
  }

  function applyPreferenceToOrder(orderId, preference) {
    setLines((prev) => {
      const orderLinesForOrder = prev.filter((line) => line.orderId === orderId)
      const latestArrival = orderLinesForOrder.reduce(
        (max, line) => (line.expectedArrivalAtPartsProfi && line.expectedArrivalAtPartsProfi > max ? line.expectedArrivalAtPartsProfi : max),
        orderLinesForOrder[0]?.expectedArrivalAtPartsProfi ?? null
      )
      return prev.map((line) => {
        if (line.orderId !== orderId) return line
        if (preference === 'zo_snel_mogelijk') {
          return { ...line, plannedDeliveryDate: line.expectedArrivalAtPartsProfi }
        }
        if (preference === 'compleet') {
          return { ...line, plannedDeliveryDate: latestArrival }
        }
        return line
      })
    })
  }

  return (
    <DeliveryPlanningContext.Provider value={{ lines, updateLineDeliveryDate, applyPreferenceToOrder }}>
      {children}
    </DeliveryPlanningContext.Provider>
  )
}

export function useDeliveryPlanning() {
  const ctx = useContext(DeliveryPlanningContext)
  if (!ctx) throw new Error('useDeliveryPlanning must be used within DeliveryPlanningProvider')
  return ctx
}
