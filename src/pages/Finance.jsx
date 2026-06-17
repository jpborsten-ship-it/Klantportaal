import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import { invoices } from '../data/mockData'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

const columns = [
  { key: 'invoiceNumber', header: 'Factuurnummer' },
  { key: 'date', header: 'Factuurdatum' },
  { key: 'dueDate', header: 'Vervaldatum' },
  { key: 'amount', header: 'Bedrag', render: (row) => `€ ${row.amount.toFixed(2)}` },
  { key: 'type', header: 'Type', render: (row) => (row.type === 'verzamelfactuur' ? 'Verzamelfactuur' : 'Losse factuur') },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  {
    key: 'acties',
    header: 'Acties',
    render: (row) => (
      <div className="finance-actions">
        <a href={row.downloadUrl} target="_blank" rel="noreferrer">
          <Button variant="secondary">Download</Button>
        </a>
        {row.paymentUrl && (
          <a href={row.paymentUrl} target="_blank" rel="noreferrer">
            <Button>Betalen</Button>
          </a>
        )}
      </div>
    ),
  },
]

export default function Finance() {
  const customerInvoices = invoices.filter((inv) => inv.customerId === CURRENT_CUSTOMER_ID)

  return (
    <Card title="Finance">
      <Table columns={columns} rows={customerInvoices} getRowKey={(row) => row.id} emptyMessage="Je hebt nog geen facturen." />
    </Card>
  )
}
