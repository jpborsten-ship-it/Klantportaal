export const PLANNING_HORIZON_DAYS = 14
export const AGENDA_PAGE_SIZE = 10

// Levertijd per categorie: aantal werkdagen na de besteldatum dat een product
// vroegst bij de klant kan zijn.
const LEAD_TIME_WORKDAYS = { groen: 2, oranje: 3 }

// PartsProfi levert alleen op werkdagen.
const WEEKDAY_LABELS = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']

function isWeekday(date) {
  const day = date.getDay()
  return day !== 0 && day !== 6
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10)
}

// isoDate is altijd via toISOString() gegenereerd (UTC); met de UTC-getters
// lezen we 'm terug zodat de weergave niet verschuift door de lokale tijdzone.
export function formatDayLabel(isoDate) {
  const date = new Date(isoDate)
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${WEEKDAY_LABELS[date.getUTCDay()]} ${day}-${month}`
}

// Vroegst-mogelijke leverdatum: telt de werkdagen van de levertijdcategorie op
// bij de besteldatum van de order. Dit is de enige bron voor wat selecteerbaar
// is — vervangt expectedArrivalAtPartsProfi (dat blijft alleen informatief).
export function getEarliestDeliveryDate(orderDate, leadTimeCategory) {
  const workdaysToAdd = LEAD_TIME_WORKDAYS[leadTimeCategory] ?? LEAD_TIME_WORKDAYS.oranje
  const cursor = new Date(orderDate)
  let added = 0
  while (added < workdaysToAdd) {
    cursor.setDate(cursor.getDate() + 1)
    if (isWeekday(cursor)) added++
  }
  return toIsoDate(cursor)
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
        days.push(toIsoDate(cursor))
      }
      weekdayCount++
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

// Vandaag en morgen staan al te dichtbij om nog te wijzigen: die levering is
// al in voorbereiding. Geldt voor alle regels op die datum, los van status.
export function isDateLocked(isoDate) {
  const today = new Date()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isoDate === toIsoDate(today) || isoDate === toIsoDate(tomorrow)
}

// Voor de leveragenda: gegeven een set werkdagen, welke regels staan er per dag gepland.
export function buildAgendaDays(lines, isoDates) {
  return isoDates.map((iso) => ({
    date: iso,
    plannedLines: lines.filter((line) => line.plannedDeliveryDate === iso),
  }))
}

// Werkdagen vanaf een vroegst-mogelijke datum — gedeelde basis voor zowel een
// losse regel als een heel jasje.
export function getSelectableDaysFrom(earliestDate, daysAhead = PLANNING_HORIZON_DAYS) {
  const days = []
  const cursor = new Date()
  let collected = 0
  while (collected < daysAhead) {
    if (isWeekday(cursor)) {
      const iso = toIsoDate(cursor)
      if (iso >= earliestDate) days.push(iso)
      collected++
    }
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

// Werkdagen waarop een specifieke regel geleverd kan worden: nooit vóór haar
// eigen vroegst-mogelijke datum.
export function getSelectableDaysForLine(line, order, daysAhead = PLANNING_HORIZON_DAYS) {
  const earliest = getEarliestDeliveryDate(order.orderDate, line.leadTimeCategory)
  return getSelectableDaysFrom(earliest, daysAhead)
}
