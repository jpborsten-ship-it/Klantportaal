import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import StatusBadge from '../ui/StatusBadge'

export default function ActionRequiredCard({ items }) {
  const navigate = useNavigate()

  return (
    <Card title="Acties nodig" className="dashboard-action-required">
      {items.length === 0 ? (
        <p>Niets dat om actie vraagt — je staat helemaal bij.</p>
      ) : (
        <ul className="action-required-list">
          {items.map((item) => (
            <li key={item.id} className={`action-required-item action-required-item--${item.urgency}`}>
              <div className="action-required-item-header">
                <strong>{item.title}</strong>
                <StatusBadge status={item.urgency} />
              </div>
              <p className="action-required-explanation">{item.explanation}</p>
              <Button onClick={() => navigate(item.actionPath)}>{item.actionLabel}</Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
