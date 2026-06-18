import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Table from '../components/ui/Table'
import StatusBadge from '../components/ui/StatusBadge'
import Button from '../components/ui/Button'
import { invoices } from '../data/mockData'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function InvoiceTable({ title, rows, emptyMessage, tone }) {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('date')
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

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase()
    const filtered = term ? rows.filter((inv) => inv.invoiceNumber.toLowerCase().includes(term)) : rows

    const dir = sortDirection === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      if (sortField === 'amount') return (a.amount - b.amount) * dir
      if (sortField === 'dueDate') return (a.dueDate < b.dueDate ? -1 : 1) * dir
      return (a.date < b.date ? -1 : 1) * dir
    })
  }, [rows, search, sortField, sortDirection])

  const columns = [
    {
      key: 'invoiceNumber',
      header: 'Factuurnummer',
      headerContent: () => (
        <div className="orders-th">
          <span>Factuurnummer</span>
          <input
            type="text"
            placeholder="zoeken..."
            value={search}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Factuurdatum',
      headerContent: () => (
        <button type="button" className="orders-th-sort" onClick={() => toggleSort('date')}>
          Factuurdatum <span className="orders-th-sort-arrow">{sortArrow('date')}</span>
        </button>
      ),
    },
    {
      key: 'dueDate',
      header: 'Vervaldatum',
      headerContent: () => (
        <button type="button" className="orders-th-sort" onClick={() => toggleSort('dueDate')}>
          Vervaldatum <span className="orders-th-sort-arrow">{sortArrow('dueDate')}</span>
        </button>
      ),
    },
    {
      key: 'amount',
      header: 'Bedrag',
      render: (row) => `€ ${row.amount.toFixed(2)}`,
      headerContent: () => (
        <button type="button" className="orders-th-sort" onClick={() => toggleSort('amount')}>
          Bedrag <span className="orders-th-sort-arrow">{sortArrow('amount')}</span>
        </button>
      ),
    },
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

  return (
    <Card title={title} className={`finance-table--${tone}`}>
      <Table columns={columns} rows={filteredRows} getRowKey={(row) => row.id} emptyMessage={emptyMessage} />
    </Card>
  )
}

export default function Finance() {
  const today = todayIso()
  const customerInvoices = useMemo(() => invoices.filter((inv) => inv.customerId === CURRENT_CUSTOMER_ID), [])

  const betaald = customerInvoices.filter((inv) => inv.status === 'betaald')
  const teLaat = customerInvoices.filter((inv) => inv.status === 'open' && inv.dueDate < today)
  const nogTeBetalen = customerInvoices.filter((inv) => inv.status === 'open' && inv.dueDate >= today)

  return (
    <div className="finance-page">
      <InvoiceTable title="Te laat" rows={teLaat} emptyMessage="Niets te laat." tone="laat" />
      <InvoiceTable title="Nog te betalen" rows={nogTeBetalen} emptyMessage="Niets dat nog betaald moet worden." tone="open" />
      <InvoiceTable title="Betaalde facturen" rows={betaald} emptyMessage="Nog geen betaalde facturen." tone="betaald" />
    </div>
  )
}
