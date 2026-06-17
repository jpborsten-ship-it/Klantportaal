import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { invoices, deliveryMoments } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'

const ONDERWEG_STATUSSEN = ['onderweg_naar_partsprofi', 'verzonden']

export default function Dashboard() {
  const navigate = useNavigate()
  const { lines } = useDeliveryPlanning()

  const openstaandeFacturen = invoices.filter((inv) => inv.status === 'open')
  const ordersOnderweg = lines.filter((line) => ONDERWEG_STATUSSEN.includes(line.status))
  const geplandeLevermomenten = deliveryMoments.filter((dm) => dm.status === 'gepland')
  const benodigdeLeverkeuze = lines.filter((line) => line.status === 'binnen_bij_partsprofi' && !line.plannedDeliveryDate)
  const eersteOrderMetLeverkeuze = benodigdeLeverkeuze[0]?.orderId

  return (
    <div className="dashboard-grid">
      <Card title="Openstaande facturen">
        <p className="dashboard-metric">{openstaandeFacturen.length}</p>
        <p>€ {openstaandeFacturen.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)} totaal</p>
        <Link to="/finance">Naar facturen</Link>
      </Card>

      <Card title="Orders onderweg">
        <p className="dashboard-metric">{ordersOnderweg.length}</p>
        <p>producten onderweg naar PartsProfi of al verzonden</p>
        <Link to="/orders">Naar orders</Link>
      </Card>

      <Card title="Geplande levermomenten">
        <p className="dashboard-metric">{geplandeLevermomenten.length}</p>
        <p>leverdagen ingepland</p>
        <Link to="/leveragenda">Naar leveragenda</Link>
      </Card>

      <Card title="Leverkeuze nodig">
        <p className="dashboard-metric">{benodigdeLeverkeuze.length}</p>
        <p>producten zijn binnen maar nog niet ingepland</p>
        {eersteOrderMetLeverkeuze && <Link to={`/orders/${eersteOrderMetLeverkeuze}/leverkeuze`}>Plan leverdag</Link>}
      </Card>

      <Card title="Snelle acties" className="dashboard-actions">
        <Button onClick={() => navigate('/finance')}>Factuur betalen</Button>
        <Button
          onClick={() => eersteOrderMetLeverkeuze && navigate(`/orders/${eersteOrderMetLeverkeuze}/leverkeuze`)}
          disabled={!eersteOrderMetLeverkeuze}
        >
          Levermoment kiezen
        </Button>
        <Button variant="secondary" onClick={() => navigate('/orders')}>Order bekijken</Button>
        <Button variant="secondary" onClick={() => navigate('/retouren')}>Retour aanvragen</Button>
      </Card>
    </div>
  )
}
