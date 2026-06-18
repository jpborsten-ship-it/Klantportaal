import { getSelectableDaysForLine, formatDayLabel } from '../../utils/deliveryCost'

export default function DeliveryDayPicker({ line, order, onSelect }) {
  const days = getSelectableDaysForLine(line, order)

  return (
    <select value={line.plannedDeliveryDate ?? ''} onChange={(e) => onSelect(line.id, e.target.value || null)}>
      <option value="">Nog niet gepland</option>
      {days.map((day) => (
        <option key={day} value={day}>
          {formatDayLabel(day)}
        </option>
      ))}
    </select>
  )
}
