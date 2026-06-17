import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import { orders, orderLines } from '../data/mockData'
import { getOrderLines } from '../utils/orderStatus'

const columns = [
  { key: 'productNumber', header: 'Artikelnummer' },
  { key: 'description', header: 'Omschrijving' },
  { key: 'quantity', header: 'Aantal' },
  { key: 'unitPrice', header: 'Prijs', render: (row) => `€ ${row.unitPrice.toFixed(2)}` },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'expectedArrivalAtPartsProfi', header: 'Verwacht bij PartsProfi', render: (row) => row.expectedArrivalAtPartsProfi || '—' },
  { key: 'plannedDeliveryDate', header: 'Geplande leverdag', render: (row) => row.plannedDeliveryDate || 'Nog te plannen' },
  { key: 'trackingCode', header: 'Tracking', render: (row) => row.trackingCode || '—' },
]

export default function OrderDetail() {
  const { orderId } = useParams()
  const order = orders.find((o) => o.id === orderId)
  const lines = getOrderLines(orderLines, orderId)

  if (!order) {
    return (
      <Card title="Order niet gevonden">
        <p>
          Deze order bestaat niet (meer). Ga terug naar <Link to="/orders">het orderoverzicht</Link>.
        </p>
      </Card>
    )
  }

  return (
    <Card title={`Order ${order.orderNumber}`}>
      <p>
        Besteld op {order.orderDate}
        {order.customerReference && <> · referentie {order.customerReference}</>} · totaal € {order.totalAmount.toFixed(2)}
      </p>
      <Table columns={columns} rows={lines} getRowKey={(row) => row.id} emptyMessage="Deze order heeft geen productregels." />
    </Card>
  )
}
