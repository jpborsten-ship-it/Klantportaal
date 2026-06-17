import { useState } from 'react'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import { orders, returnRequests as initialReturnRequests } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { linesForCustomer } from '../utils/orderStatus'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

const REASONS = ['Verkeerd onderdeel ontvangen', 'Onderdeel beschadigd', 'Niet meer nodig', 'Past niet']

export default function Retouren() {
  const { lines } = useDeliveryPlanning()
  const [requests, setRequests] = useState(initialReturnRequests)
  const [selectedLineId, setSelectedLineId] = useState('')
  const [reason, setReason] = useState(REASONS[0])

  const today = new Date().toISOString().slice(0, 10)
  const customerLines = linesForCustomer(lines, orders, CURRENT_CUSTOMER_ID)
  const requestedLineIds = new Set(requests.map((r) => r.orderLineId))
  const eligibleLines = customerLines.filter(
    (line) => line.status === 'geleverd' && line.canReturnUntil >= today && !requestedLineIds.has(line.id)
  )
  const customerRequests = requests.filter((r) => r.customerId === CURRENT_CUSTOMER_ID)

  function handleSubmit(e) {
    e.preventDefault()
    if (!selectedLineId) return
    setRequests((prev) => [
      ...prev,
      {
        id: `ret-${prev.length + 1}`,
        orderLineId: selectedLineId,
        customerId: CURRENT_CUSTOMER_ID,
        reason,
        photoUrl: null,
        status: 'aangevraagd',
        createdAt: today,
      },
    ])
    setSelectedLineId('')
  }

  const columns = [
    {
      key: 'orderLineId',
      header: 'Product',
      render: (row) => customerLines.find((line) => line.id === row.orderLineId)?.description ?? row.orderLineId,
    },
    { key: 'reason', header: 'Reden' },
    { key: 'createdAt', header: 'Aangevraagd op' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  ]

  return (
    <div className="retouren">
      <Card title="Retour aanvragen">
        {eligibleLines.length === 0 ? (
          <p>Geen producten die nu in aanmerking komen voor een retour (geleverd en binnen 21 dagen na bestellen).</p>
        ) : (
          <form className="return-form" onSubmit={handleSubmit}>
            <select value={selectedLineId} onChange={(e) => setSelectedLineId(e.target.value)} required>
              <option value="">Kies een product...</option>
              {eligibleLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.description} (retour mogelijk t/m {line.canReturnUntil})
                </option>
              ))}
            </select>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input type="file" accept="image/*" title="Foto-upload is nu een mock, opslag volgt met een echte backend" />
            <Button type="submit">Retour aanvragen</Button>
          </form>
        )}
      </Card>

      <Card title="Mijn retouraanvragen">
        <Table columns={columns} rows={customerRequests} getRowKey={(row) => row.id} emptyMessage="Je hebt nog geen retouren aangevraagd." />
      </Card>
    </div>
  )
}
