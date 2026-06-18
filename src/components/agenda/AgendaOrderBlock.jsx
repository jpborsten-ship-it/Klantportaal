import AgendaProductCard from './AgendaProductCard'
import { formatDayLabel } from '../../utils/deliveryCost'

// Een "jasje": de regels van één order die samen op een dag staan. De kop is
// als geheel sleepbaar (verplaatst alle regels die dat nog toelaten), elke
// regel daarbinnen blijft ook zelf sleepbaar/verplaatsbaar om 'm los uit het
// jasje te halen. Op een vergrendelde dag (vandaag/morgen) kan niets meer.
export default function AgendaOrderBlock({ block, locked, onMoveLine, onMoveBlock, onDragStateChange }) {
  const lineIds = block.lines.map((line) => line.id)

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
