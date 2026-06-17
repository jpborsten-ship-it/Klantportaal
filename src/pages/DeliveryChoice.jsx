import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import DeliveryDayPicker from '../components/delivery/DeliveryDayPicker'
import { orders } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { calculateDeliveryCost, getCombineMessage } from '../utils/deliveryCost'

export default function DeliveryChoice() {
  const { orderId } = useParams()
  const { lines, updateLineDeliveryDate, applyPreferenceToOrder } = useDeliveryPlanning()
  const order = orders.find((o) => o.id === orderId)
  const orderLinesForOrder = lines.filter((line) => line.orderId === orderId)

  if (!order) {
    return (
      <Card title="Order niet gevonden">
        <p>
          Ga terug naar <Link to="/orders">het orderoverzicht</Link>.
        </p>
      </Card>
    )
  }

  const plannedDates = orderLinesForOrder.map((line) => line.plannedDeliveryDate).filter(Boolean)
  const uniqueDates = [...new Set(plannedDates)]

  const columns = [
    { key: 'description', header: 'Product' },
    { key: 'expectedArrivalAtPartsProfi', header: 'Verwacht bij PartsProfi', render: (row) => row.expectedArrivalAtPartsProfi || '—' },
    {
      key: 'plannedDeliveryDate',
      header: 'Leverdag',
      render: (row) => (
        <DeliveryDayPicker line={row} orderLines={orderLinesForOrder} onSelect={updateLineDeliveryDate} />
      ),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ]

  return (
    <Card title={`Levermoment kiezen — order ${order.orderNumber}`}>
      <p>Kies hoe deze order geleverd wordt. Je kunt onderdelen ook los naar een andere dag verplaatsen.</p>

      <div className="delivery-choice-actions">
        <Button onClick={() => applyPreferenceToOrder(order.id, 'zo_snel_mogelijk')}>Alles zo snel mogelijk</Button>
        <Button onClick={() => applyPreferenceToOrder(order.id, 'compleet')}>Leveren zodra compleet</Button>
        <Button variant="secondary" onClick={() => {}}>Zelf plannen per product (kies hieronder per regel)</Button>
      </div>

      <Table columns={columns} rows={orderLinesForOrder} getRowKey={(row) => row.id} emptyMessage="Deze order heeft geen productregels." />

      {uniqueDates.length > 0 && (
        <div className="delivery-summary">
          <h4>Bezorgkosten per leverdag</h4>
          <ul>
            {uniqueDates.map((date) => {
              const lineCount = orderLinesForOrder.filter((line) => line.plannedDeliveryDate === date).length
              const cost = calculateDeliveryCost(lineCount)
              const message = getCombineMessage(lineCount)
              return (
                <li key={date}>
                  <strong>{date}</strong> — {lineCount} product{lineCount > 1 ? 'en' : ''}, bezorgkosten:{' '}
                  {cost === 0 ? 'gratis' : `€ ${cost.toFixed(2)}`}
                  {message && <span className="delivery-hint"> · {message}</span>}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Card>
  )
}
