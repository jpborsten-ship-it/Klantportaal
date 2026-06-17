import { useState } from 'react'
import AgendaProductCard from './AgendaProductCard'
import { formatDayLabel } from '../../utils/deliveryCost'

export default function AgendaDay({ day, orders, onMove }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const lineCount = day.plannedLines.length

  return (
    <div
      className={`agenda-day${isDragOver ? ' agenda-day--dragover' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragOver(true)
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragOver(false)
        const lineId = e.dataTransfer.getData('text/plain')
        if (lineId) onMove(lineId, day.date)
      }}
    >
      <div className="agenda-day-header">
        <strong>{formatDayLabel(day.date)}</strong>
      </div>

      {lineCount === 0 ? (
        <p className="agenda-day-empty">Sleep hier een product naartoe.</p>
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
    </div>
  )
}
