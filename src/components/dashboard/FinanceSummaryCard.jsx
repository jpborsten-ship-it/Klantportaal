import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function FinanceSummaryCard({ summary }) {
  const navigate = useNavigate()

  return (
    <Card title="Facturen & betalingen">
      <p className="dashboard-metric">€ {summary.openstaandBedrag.toFixed(2)}</p>
      <p>
        {summary.openstaandAantal} factu{summary.openstaandAantal === 1 ? 'ur wacht' : 'ren wachten'} op betaling
        {summary.eerstvolgendeVervaldatum && <> — eerstvolgende vervaldatum {summary.eerstvolgendeVervaldatum}</>}
      </p>
      <p className="finance-summary-paid">Betaald deze maand: € {summary.betaaldDezeMaandBedrag.toFixed(2)}</p>
      <div className="finance-summary-actions">
        <Button onClick={() => navigate('/finance')}>Betaal bedrag</Button>
        <Button variant="secondary" onClick={() => navigate('/finance')}>Bekijk facturen</Button>
        {summary.verzamelfactuur && (
          <a href={summary.verzamelfactuur.downloadUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary">Verzamelfactuur</Button>
          </a>
        )}
      </div>
    </Card>
  )
}
