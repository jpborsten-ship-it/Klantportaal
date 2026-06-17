import Card from '../components/ui/Card'
import AgendaDay from '../components/agenda/AgendaDay'
import AgendaProductCard from '../components/agenda/AgendaProductCard'
import { customers, orders } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { linesForCustomer } from '../utils/orderStatus'
import { buildAgendaDays } from '../utils/deliveryCost'

// Fase 1-6 draaien zonder auth op één vaste klant (zie Topbar), dezelfde aanname als elders in het portaal.
const HUIDIGE_KLANT_ID = customers[0].id

export default function Leveragenda() {
  const { lines, updateLineDeliveryDate } = useDeliveryPlanning()
  const klantLines = linesForCustomer(lines, orders, HUIDIGE_KLANT_ID)
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
