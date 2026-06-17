// Mock-aannames voor fase 4, te bevestigen door PartsProfi voor een echte uitrol:
// vast bedrag per leverdag, gratis zodra er genoeg producten gecombineerd worden.
export const MOCK_DELIVERY_COST = 7.5
export const FREE_FROM_LINE_COUNT = 2
export const PLANNING_HORIZON_DAYS = 14

export function calculateDeliveryCost(lineCount) {
  if (lineCount === 0) return 0
  return lineCount >= FREE_FROM_LINE_COUNT ? 0 : MOCK_DELIVERY_COST
}

export function getCombineMessage(lineCount) {
  if (lineCount >= FREE_FROM_LINE_COUNT) {
    return 'Deze leverdag is scherper geprijsd: bezorgen is gratis omdat je producten combineert.'
  }
  if (lineCount === 1) {
    return `Combineer met nog een product op deze dag en bezorgen wordt gratis (vanaf ${FREE_FROM_LINE_COUNT} producten).`
  }
  return ''
}

// Levert per dag in de planningshorizon de regels op die dan al bij PartsProfi
// binnen zouden zijn, zodat we per dag kunnen tonen wat er geleverd kan worden.
export function getAvailableDeliveryDays(lines, daysAhead = PLANNING_HORIZON_DAYS) {
  const today = new Date()
  const days = []
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const iso = date.toISOString().slice(0, 10)
    const availableLines = lines.filter((line) => line.expectedArrivalAtPartsProfi && line.expectedArrivalAtPartsProfi <= iso)
    days.push({ date: iso, availableLines })
  }
  return days
}

// Voor de leveragenda: elke dag in de horizon met de regels die er al op gepland staan.
export function buildAgendaDays(lines, daysAhead = PLANNING_HORIZON_DAYS) {
  const today = new Date()
  const days = []
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const iso = date.toISOString().slice(0, 10)
    const plannedLines = lines.filter((line) => line.plannedDeliveryDate === iso)
    days.push({ date: iso, plannedLines })
  }
  return days
}

// Dagen waarop een specifieke regel geleverd kan worden: nooit vóór de
// verwachte aankomst bij PartsProfi.
export function getSelectableDaysForLine(line, daysAhead = PLANNING_HORIZON_DAYS) {
  const today = new Date()
  const days = []
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const iso = date.toISOString().slice(0, 10)
    if (line.expectedArrivalAtPartsProfi && line.expectedArrivalAtPartsProfi <= iso) days.push(iso)
  }
  return days
}
