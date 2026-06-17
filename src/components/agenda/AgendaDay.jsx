import AgendaProductCard from './AgendaProductCard'
import { calculateDeliveryCost, getCombineMessage } from '../../utils/deliveryCost'

export default function AgendaDay({ day, orders, onMove }) {
  const lineCount = day.plannedLines.length
  const cost = calculateDeliveryCost(lineCount)
  const message = getCombineMessage(lineCount)

  return (
    <div className="agenda-day">
      <div className="agenda-day-header">
        <strong>{day.date}</strong>
        {lineCount > 0 && <span>{cost === 0 ? 'gratis bezorgen' : `€ ${cost.toFixed(2)} bezorgkosten`}</span>}
      </div>

      {lineCount === 0 ? (
        <p className="agenda-day-empty">Nog niets gepland.</p>
      ) : (
        day.plannedLines.map((line) => (
          <AgendaProductCard
            key={line.id}
            line={line}
            order={orders.find((o) => o.id === line.orderId)}
            onMove={onMove}
          />
        ))
      )}

      {message && <p className="delivery-hint">{message}</p>}
    </div>
  )
}
