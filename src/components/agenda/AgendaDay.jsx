import { useState } from 'react'
import AgendaOrderBlock from './AgendaOrderBlock'
import { formatDayLabel, isDateLocked } from '../../utils/deliveryCost'
import { buildBlocksForDay } from '../../utils/agendaBlocks'

export default function AgendaDay({ day, orders, onMoveLine, onMoveBlock, onDragStateChange, draggingEarliestDate }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const blocks = buildBlocksForDay(day.plannedLines, orders)
  const isBlocked = draggingEarliestDate != null && day.date < draggingEarliestDate
  const locked = isDateLocked(day.date)

  return (
    <div
      className={`agenda-day${isDragOver && !isBlocked ? ' agenda-day--dragover' : ''}${isBlocked ? ' agenda-day--blocked' : ''}${locked ? ' agenda-day--locked' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        if (!isBlocked) setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        // Bij een succesvolle move herrendert React en kan het versleepte
        // DOM-element verdwijnen vóórdat de browser 'dragend' afvuurt — dus
        // ruimen we de sleep-status hier op, niet pas via dragend.
        onDragStateChange(null)
        if (isBlocked) return
        let payload
        try {
          payload = JSON.parse(e.dataTransfer.getData('text/plain'))
        } catch {
          return
        }
        if (day.date < payload.earliestDeliveryDate) return
        if (payload.type === 'block') onMoveBlock(payload.lineIds, day.date)
        else if (payload.type === 'line') onMoveLine(payload.lineId, day.date)
      }}
    >
      <div className="agenda-day-header">
        <strong>{formatDayLabel(day.date)}</strong>
        {locked && <span className="agenda-day-lock" title="Al in voorbereiding, niet meer te wijzigen">🔒</span>}
      </div>

      <div className="agenda-day-body">
        {blocks.length === 0 ? (
          <p className="agenda-day-empty">Sleep hier naartoe.</p>
        ) : (
          blocks.map((block) => (
            <AgendaOrderBlock
              key={block.order?.id}
              block={block}
              currentDate={day.date}
              locked={locked}
              onMoveLine={onMoveLine}
              onMoveBlock={onMoveBlock}
              onDragStateChange={onDragStateChange}
            />
          ))
        )}
      </div>
    </div>
  )
}
