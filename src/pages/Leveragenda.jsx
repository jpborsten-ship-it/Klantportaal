import Card from '../components/ui/Card'
import AgendaDay from '../components/agenda/AgendaDay'
import AgendaProductCard from '../components/agenda/AgendaProductCard'
import { orders } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { linesForCustomer } from '../utils/orderStatus'
import { buildAgendaDays } from '../utils/deliveryCost'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

export default function Leveragenda() {
  const { lines, updateLineDeliveryDate } = useDeliveryPlanning()
  const klantLines = linesForCustomer(lines, orders, CURRENT_CUSTOMER_ID)
  const days = buildAgendaDays(klantLines)
  const nietIngepland = klantLines.filter(
    (line) => !line.plannedDeliveryDate && !['geleverd', 'retour_aangevraagd'].includes(line.status)
  )

  return (
    <div className="leveragenda">
      {nietIngepland.length > 0 && (
        <Card title="Nog niet ingepland" className="agenda-unplanned">
          {nietIngepland.map((line) => (
            <AgendaProductCard
              key={line.id}
              line={line}
              order={orders.find((o) => o.id === line.orderId)}
              onMove={updateLineDeliveryDate}
            />
          ))}
        </Card>
      )}

      <Card title="Leveragenda">
        <div className="agenda-days">
          {days.map((day) => (
            <AgendaDay key={day.date} day={day} orders={orders} onMove={updateLineDeliveryDate} />
          ))}
        </div>
      </Card>
    </div>
  )
}
