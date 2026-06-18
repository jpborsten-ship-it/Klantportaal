import { formatDayLabel } from '../../utils/deliveryCost'

export default function DeliveryDayCard({ day, blocks }) {
  const productCount = blocks.reduce((sum, block) => sum + block.lines.length, 0)
  const orderCount = blocks.length
  const heeftLevering = orderCount > 0

  return (
    <div className="delivery-day-card">
      <strong>{formatDayLabel(day)}</strong>
      {!heeftLevering ? (
        <p className="delivery-day-card-empty">Geen levering gepland</p>
      ) : (
        <p className="delivery-day-card-counts">
          {productCount} product{productCount !== 1 ? 'en' : ''} · {orderCount} order{orderCount !== 1 ? 's' : ''}
        </p>
      )}
      <span className={`delivery-day-card-status delivery-day-card-status--${heeftLevering ? 'gepland' : 'leeg'}`}>
        {heeftLevering ? 'Gepland' : 'Niets gepland'}
      </span>
    </div>
  )
}
