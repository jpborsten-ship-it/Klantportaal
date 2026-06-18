import AgendaProductCard from './AgendaProductCard'
import { formatDayLabel, getSelectableDaysFrom } from '../../utils/deliveryCost'

// Een "jasje": de regels van één order die samen op een dag staan. De kop is
// als geheel sleepbaar (verplaatst alle regels die dat nog toelaten), of via
// de dropdown in één keer naar een datum te zetten. Elke regel daarbinnen
// blijft ook zelf sleepbaar/verplaatsbaar om 'm los uit het jasje te halen.
// Op een vergrendelde dag (vandaag/morgen) kan niets meer.
export default function AgendaOrderBlock({ block, currentDate, locked, onMoveLine, onMoveBlock, onDragStateChange }) {
  const lineIds = block.lines.map((line) => line.id)
  const selectableDays = getSelectableDaysFrom(block.earliestDeliveryDate)

  return (
    <div className="agenda-order-block">
      <div
        className={`agenda-order-block-header${locked ? ' agenda-order-block-header--locked' : ''}`}
        draggable={!locked}
        onDragStart={(e) => {
          e.dataTransfer.setData(
            'text/plain',
            JSON.stringify({ type: 'block', lineIds, earliestDeliveryDate: block.minEarliestDeliveryDate })
          )
          onDragStateChange(block.minEarliestDeliveryDate)
        }}
        onDragEnd={() => onDragStateChange(null)}
        title={locked ? 'Al in voorbereiding, niet meer te verplaatsen' : 'Sleep om deze producten samen te verplaatsen'}
      >
        <span className="agenda-order-block-title">
          {!locked && <span className="agenda-drag-handle agenda-drag-handle--block">⠿⠿</span>}
          Order {block.order?.orderNumber ?? '—'}
        </span>
        <span className="agenda-order-block-category">vanaf {formatDayLabel(block.earliestDeliveryDate)}</span>
      </div>
      {!locked && (
        <select
          className="agenda-block-select"
          value={currentDate}
          title="Verplaats deze hele order in één keer naar een andere datum"
          onChange={(e) => onMoveBlock(lineIds, e.target.value)}
        >
          {selectableDays.map((day) => (
            <option key={day} value={day}>
              Hele order verplaatsen → {formatDayLabel(day)}
            </option>
          ))}
        </select>
      )}
      {block.lines.map((line) => (
        <AgendaProductCard
          key={line.id}
          line={line}
          order={block.order}
          locked={locked}
          onMove={onMoveLine}
          onDragStateChange={onDragStateChange}
        />
      ))}
    </div>
  )
}
