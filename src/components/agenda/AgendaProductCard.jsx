import { getSelectableDaysForLine, formatDayLabel, getEarliestDeliveryDate } from '../../utils/deliveryCost'

// Een los product: sleepbaar (verplaatst alleen deze regel, niet de hele
// order) én via de dropdown te verplaatsen — dat is de "knop"-route naast het
// slepen om een regel uit een orderblok (jasje) te halen. Op een vergrendelde
// dag (vandaag/morgen) kan niets meer, want die levering is al in voorbereiding.
export default function AgendaProductCard({ line, order, onMove, locked, onDragStateChange }) {
  const earliestDate = getEarliestDeliveryDate(order.orderDate, line.leadTimeCategory)
  const selectableDays = getSelectableDaysForLine(line, order)

  return (
    <div
      className={`agenda-product-card${locked ? ' agenda-product-card--locked' : ''}`}
      draggable={!locked}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'line', lineId: line.id, earliestDeliveryDate: earliestDate }))
        onDragStateChange(earliestDate)
      }}
      onDragEnd={() => onDragStateChange(null)}
    >
      {!locked && (
        <span className="agenda-drag-handle agenda-drag-handle--line" title="Sleep om alleen dit product te verplaatsen">
          ⠿
        </span>
      )}
      <strong>{line.productNumber}</strong>
      <span className="agenda-product-meta">vanaf {formatDayLabel(earliestDate)}</span>
      <select
        className="agenda-product-select"
        value={line.plannedDeliveryDate ?? ''}
        disabled={locked}
        onChange={(e) => onMove(line.id, e.target.value)}
      >
        {selectableDays.map((day) => (
          <option key={day} value={day}>
            {formatDayLabel(day)}
          </option>
        ))}
      </select>
    </div>
  )
}
