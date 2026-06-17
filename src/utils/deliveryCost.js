export const PLANNING_HORIZON_DAYS = 14
export const AGENDA_PAGE_SIZE = 10

// PartsProfi levert alleen op werkdagen.
const WEEKDAY_LABELS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']

function isWeekday(date) {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

// isoDate is altijd via toISOString() gegenereerd (UTC); met de UTC-getters
// lezen we 'm terug zodat de weergave niet verschuift door de lokale tijdzone.
export function formatDayLabel(isoDate) {
  const date = new Date(isoDate)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${WEEKDAY_LABELS[date.getUTCDay()]} ${day}-${month}`
}

// Levert per werkdag in de planningshorizon de regels op die dan al bij
// PartsProfi binnen zouden zijn, zodat we per dag kunnen tonen wat er
// geleverd kan worden.
export function getAvailableDeliveryDays(lines, daysAhead = PLANNING_HORIZON_DAYS) {
  const days = []
  const cursor = new Date()
  let collected = 0
  while (collected < daysAhead) {
    if (isWeekday(cursor)) {
      const iso = cursor.toISOString().slice(0, 10)
      const availableLines = lines.filter((line) => line.expectedArrivalAtPartsProfi && line.expectedArrivalAtPartsProfi <= iso)
      days.push({ date: iso, availableLines })
      collected++
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

// Eén pagina werkdagen voor de leveragenda (standaard 10), met paginering
// zodat je verder de toekomst in kunt bladeren zonder alle dagen in één keer
// te tonen.
export function getAgendaWeekdayPage(pageIndex, pageSize = AGENDA_PAGE_SIZE) {
  const days = []
  const cursor = new Date()
  let weekdayCount = 0
  const targetStart = pageIndex * pageSize
  while (days.length < pageSize) {
    if (isWeekday(cursor)) {
      if (weekdayCount >= targetStart) {
        days.push(cursor.toISOString().slice(0, 10))
      }
      weekdayCount++
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

// Voor de leveragenda: gegeven een set werkdagen, welke regels staan er per dag gepland.
export function buildAgendaDays(lines, isoDates) {
  return isoDates.map((iso) => ({
    date: iso,
    plannedLines: lines.filter((line) => line.plannedDeliveryDate === iso),
  }))
}

// Werkdagen waarop een specifieke regel geleverd kan worden: nooit vóór de
// verwachte aankomst bij PartsProfi.
export function getSelectableDaysForLine(line, daysAhead = PLANNING_HORIZON_DAYS) {
  const days = []
  const cursor = new Date()
  let collected = 0
  while (collected < daysAhead) {
    if (isWeekday(cursor)) {
      const iso = cursor.toISOString().slice(0, 10)
      if (line.expectedArrivalAtPartsProfi && line.expectedArrivalAtPartsProfi <= iso) days.push(iso)
      collected++
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}
