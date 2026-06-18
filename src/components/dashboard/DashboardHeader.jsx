import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Goedemorgen'
  if (hour < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

export default function DashboardHeader({ klant, leveringenVandaag, openstaandBedrag }) {
  const navigate = useNavigate()

  const samenvatting =
    leveringenVandaag > 0
      ? `Vandaag ${leveringenVandaag === 1 ? 'staat er 1 levering' : `staan er ${leveringenVandaag} leveringen`} gepland${
          openstaandBedrag > 0 ? ` en staat er € ${openstaandBedrag.toFixed(2)} open` : ''
        }.`
      : openstaandBedrag > 0
        ? `Vandaag staat er geen levering gepland, wel € ${openstaandBedrag.toFixed(2)} open.`
        : 'Vandaag staat er niets te wachten — helemaal bij.'

  return (
    <div className="dashboard-header">
      <div>
        <h2 className="dashboard-header-title">
          {getGreeting()}, {klant?.contactName ?? 'daar'}
        </h2>
        <p className="dashboard-header-summary">{samenvatting}</p>
      </div>
      <div className="dashboard-header-actions">
        <Button onClick={() => navigate('/leveragenda')}>Leveragenda openen</Button>
        <Button variant="secondary" onClick={() => navigate('/finance')}>Facturen betalen</Button>
        <a href="https://shop.partsprofi.nl" target="_blank" rel="noreferrer">
          <Button variant="secondary">Nieuwe bestelling plaatsen</Button>
        </a>
        <Button variant="secondary" onClick={() => navigate('/retouren')}>Retour aanvragen</Button>
      </div>
    </div>
  )
}
