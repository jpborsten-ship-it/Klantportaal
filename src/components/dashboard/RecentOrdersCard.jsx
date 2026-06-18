import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import StatusBadge from '../ui/StatusBadge'

export default function RecentOrdersCard({ recentOrders }) {
  const navigate = useNavigate()

  return (
    <Card title="Recente orders">
      {recentOrders.length === 0 ? (
        <p>Nog geen orders.</p>
      ) : (
        <div className="recent-orders-list">
          {recentOrders.map(({ order, lines, status }) => (
            <div key={order.id} className="recent-order-row">
              <div className="recent-order-row-top">
                <strong>{order.orderNumber}</strong>
                <StatusBadge status={status} />
              </div>
              <p className="recent-order-meta">
                {order.orderDate} · {lines.length} product{lines.length !== 1 ? 'en' : ''}
              </p>
              <Button variant="secondary" onClick={() => navigate(`/orders/${order.id}`)}>
                Bekijk order
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
