import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import DeliveryDayPicker from '../components/delivery/DeliveryDayPicker'
import { orders } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'

export default function DeliveryChoice() {
  const { orderId } = useParams()
  const { lines, updateLineDeliveryDate } = useDeliveryPlanning()
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

  const columns = [
    { key: 'productNumber', header: 'Product' },
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
      <p>
        Deze order volgt standaard de leverinstelling uit de <Link to="/leveragenda">leveragenda</Link>. Hier kun je
        een product los naar een andere dag verplaatsen.
      </p>

      <Table columns={columns} rows={orderLinesForOrder} getRowKey={(row) => row.id} emptyMessage="Deze order heeft geen productregels." />
    </Card>
  )
}
