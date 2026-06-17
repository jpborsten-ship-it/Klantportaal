import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'

export default function OrderDetail() {
  const { orderId } = useParams()
  return (
    <Card title={`Order ${orderId}`}>
      <p>Binnenkort: productregels met status, aankomstdatum, geplande leverdag en trackingcode.</p>
    </Card>
  )
}
