import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import AgendaDay from '../components/agenda/AgendaDay'
import { orders } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { linesForCustomer } from '../utils/orderStatus'
import { buildAgendaDays, getAgendaWeekdayPage } from '../utils/deliveryCost'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'
import { useColumnsPerRow } from '../utils/useColumnsPerRow'

const AGENDA_COLUMN_MIN_WIDTH = 220
const AGENDA_COLUMN_GAP = 16

export default function Leveragenda() {
  const { lines, updateLineDeliveryDate, updateLinesDeliveryDate, deliveryPreference, setDeliveryPreference } = useDeliveryPlanning()
  const [pageIndex, setPageIndex] = useState(0)
  const [draggingEarliestDate, setDraggingEarliestDate] = useState(null)
  const [agendaDaysRef, pageSize] = useColumnsPerRow(AGENDA_COLUMN_MIN_WIDTH, AGENDA_COLUMN_GAP)

  const klantLines = linesForCustomer(lines, orders, CURRENT_CUSTOMER_ID)
  const weekdayPage = getAgendaWeekdayPage(pageIndex, pageSize)
  const days = buildAgendaDays(klantLines, weekdayPage)

  return (
    <div className="leveragenda">
      <Card title="Standaardinstelling">
        <p className="form-hint">
          Deze instelling geldt voor al je producten en kan altijd weer gewijzigd worden — zo staat er nooit een
          product zonder leverdag.
        </p>
        <div className="preference-toggle">
          <Button
            variant={deliveryPreference === 'zo_snel_mogelijk' ? 'primary' : 'secondary'}
            onClick={() => setDeliveryPreference('zo_snel_mogelijk')}
          >
            Alles zo snel mogelijk
          </Button>
          <Button
            variant={deliveryPreference === 'compleet' ? 'primary' : 'secondary'}
            onClick={() => setDeliveryPreference('compleet')}
          >
            Wanneer compleet
          </Button>
        </div>
      </Card>

      <Card title="Leveragenda" action={<span className="agenda-page-hint">we leveren op werkdagen</span>}>
        <div className="agenda-days" ref={agendaDaysRef}>
          {days.map((day) => (
            <AgendaDay
              key={day.date}
              day={day}
              orders={orders}
              onMoveLine={updateLineDeliveryDate}
              onMoveBlock={updateLinesDeliveryDate}
              onDragStateChange={setDraggingEarliestDate}
              draggingEarliestDate={draggingEarliestDate}
            />
          ))}
        </div>
        <div className="agenda-pagination">
          {pageIndex > 0 && (
            <Button variant="secondary" onClick={() => setPageIndex((i) => Math.max(0, i - 1))}>
              ↑ Vorige {pageSize} {pageSize === 1 ? 'dag' : 'dagen'}
            </Button>
          )}
          <Button variant="secondary" onClick={() => setPageIndex((i) => i + 1)}>
            ↓ Volgende {pageSize} {pageSize === 1 ? 'dag' : 'dagen'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
