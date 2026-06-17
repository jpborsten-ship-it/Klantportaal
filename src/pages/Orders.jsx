import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import { orders } from '../data/mockData'
import { deriveOrderStatus, getOrderLines } from '../utils/orderStatus'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'

export default function Orders() {
  const navigate = useNavigate()
  const { lines } = useDeliveryPlanning()

  const columns = [
    { key: 'orderNumber', header: 'Ordernummer' },
    { key: 'orderDate', header: 'Besteldatum' },
    { key: 'customerReference', header: 'Klantreferentie', render: (row) => row.customerReference || '—' },
    { key: 'totalAmount', header: 'Totaalbedrag', render: (row) => `€ ${row.totalAmount.toFixed(2)}` },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={deriveOrderStatus(getOrderLines(lines, row.id))} /> },
  ]

  return (
    <Card title="Orders">
      <Table
        columns={columns}
        rows={orders}
        getRowKey={(row) => row.id}
        onRowClick={(row) => navigate(`/orders/${row.id}`)}
        emptyMessage="Je hebt nog geen orders."
      />
    </Card>
  )
}
