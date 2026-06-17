import { getAvailableDeliveryDays } from '../../utils/deliveryCost'

export default function DeliveryDayPicker({ line, orderLines, onSelect }) {
  const days = getAvailableDeliveryDays(orderLines).filter((day) =>
    day.availableLines.some((l) => l.id === line.id)
  )

  return (
    <select value={line.plannedDeliveryDate ?? ''} onChange={(e) => onSelect(line.id, e.target.value || null)}>
      <option value="">Nog niet gepland</option>
      {days.map((day) => (
        <option key={day.date} value={day.date}>
          {day.date}
        </option>
      ))}
    </select>
  )
}
