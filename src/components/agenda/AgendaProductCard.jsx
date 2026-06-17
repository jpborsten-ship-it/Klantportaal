import { getSelectableDaysForLine, formatDayLabel } from '../../utils/deliveryCost'

export default function AgendaProductCard({ line, order, onMove }) {
  const selectableDays = getSelectableDaysForLine(line)

  return (
    <div
      className="agenda-product-card"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', line.id)}
    >
      <div>
        <strong>{line.productNumber}</strong>
        <div className="agenda-product-meta">order {order?.orderNumber ?? '—'}</div>
      </div>
      <select value={line.plannedDeliveryDate ?? ''} onChange={(e) => onMove(line.id, e.target.value || null)}>
        <option value="">Niet ingepland</option>
        {selectableDays.map((day) => (
          <option key={day} value={day}>
            Verplaats naar {formatDayLabel(day)}
          </option>
        ))}
      </select>
    </div>
  )
}
