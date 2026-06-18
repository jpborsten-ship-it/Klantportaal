import { useMemo, useState } from 'react'
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
  const [orderNumberSearch, setOrderNumberSearch] = useState('')
  const [referenceSearch, setReferenceSearch] = useState('')
  const [sortField, setSortField] = useState('orderDate')
  const [sortDirection, setSortDirection] = useState('desc')

  function toggleSort(field) {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  function sortArrow(field) {
    if (sortField !== field) return '↕'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const filteredOrders = useMemo(() => {
    const numberTerm = orderNumberSearch.trim().toLowerCase()
    const refTerm = referenceSearch.trim().toLowerCase()

    const filtered = orders.filter(
      (order) =>
        (!numberTerm || order.orderNumber.toLowerCase().includes(numberTerm)) &&
        (!refTerm || (order.customerReference ?? '').toLowerCase().includes(refTerm))
    )

    const dir = sortDirection === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sortField === 'totalAmount') return (a.totalAmount - b.totalAmount) * dir
      return (a.orderDate < b.orderDate ? -1 : 1) * dir
    })
  }, [orderNumberSearch, referenceSearch, sortField, sortDirection])

  const columns = [
    {
      key: 'orderNumber',
      header: 'Ordernummer',
      headerContent: () => (
        <div className="orders-th">
          <span>Ordernummer</span>
          <input
            type="text"
            placeholder="zoeken..."
            value={orderNumberSearch}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setOrderNumberSearch(e.target.value)}
          />
        </div>
      ),
    },
    {
      key: 'orderDate',
      header: 'Besteldatum',
      headerContent: () => (
        <button type="button" className="orders-th-sort" onClick={() => toggleSort('orderDate')}>
          Besteldatum <span className="orders-th-sort-arrow">{sortArrow('orderDate')}</span>
        </button>
      ),
    },
    {
      key: 'customerReference',
      header: 'Klantreferentie',
      render: (row) => row.customerReference || '—',
      headerContent: () => (
        <div className="orders-th">
          <span>Klantreferentie</span>
          <input
            type="text"
            placeholder="zoeken..."
            value={referenceSearch}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setReferenceSearch(e.target.value)}
          />
        </div>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Totaalbedrag',
      render: (row) => `€ ${row.totalAmount.toFixed(2)}`,
      headerContent: () => (
        <button type="button" className="orders-th-sort" onClick={() => toggleSort('totalAmount')}>
          Totaalbedrag <span className="orders-th-sort-arrow">{sortArrow('totalAmount')}</span>
        </button>
      ),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={deriveOrderStatus(getOrderLines(lines, row.id))} /> },
  ]

  return (
    <Card title="Orders">
      <Table
        columns={columns}
        rows={filteredOrders}
        getRowKey={(row) => row.id}
        onRowClick={(row) => navigate(`/orders/${row.id}`)}
        emptyMessage="Geen orders gevonden."
      />
    </Card>
  )
}
