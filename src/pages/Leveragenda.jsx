import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import AgendaDay from '../components/agenda/AgendaDay'
import { orders } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { linesForCustomer } from '../utils/orderStatus'
import { buildAgendaDays, getAgendaWeekdayPage } from '../utils/deliveryCost'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

export default function Leveragenda() {
  const { lines, updateLineDeliveryDate, deliveryPreference, setDeliveryPreference } = useDeliveryPlanning()
  const [pageIndex, setPageIndex] = useState(0)

  const klantLines = linesForCustomer(lines, orders, CURRENT_CUSTOMER_ID)
  const weekdayPage = getAgendaWeekdayPage(pageIndex)
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
        <div className="agenda-days">
          {days.map((day) => (
            <AgendaDay key={day.date} day={day} orders={orders} onMove={updateLineDeliveryDate} />
          ))}
        </div>
        <div className="agenda-pagination">
          <Button variant="secondary" onClick={() => setPageIndex((i) => i + 1)}>
            ↓ Volgende 10 dagen
          </Button>
        </div>
      </Card>
    </div>
  )
}
