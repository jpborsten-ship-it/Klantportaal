import Card from '../ui/Card'

const SUPPORT_LINKS = [
  { label: 'Vraag over order', subject: 'Vraag over mijn order' },
  { label: 'Vraag over factuur', subject: 'Vraag over een factuur' },
  { label: 'Vraag over levering', subject: 'Vraag over een levering' },
  { label: 'Retour starten', subject: 'Ik wil een retour starten' },
  { label: 'Onderdeel aanvragen', subject: 'Onderdeel aanvragen' },
]

export default function SupportCard() {
  return (
    <Card title="Hulp nodig?">
      <p className="support-card-intro">
        Kom je er niet uit? Stel je vraag direct vanuit je portaal. Dan weten wij meteen over welke order, factuur of
        levering het gaat.
      </p>
      <div className="support-card-links">
        {SUPPORT_LINKS.map((link) => (
          <a key={link.label} href={`mailto:support@partsprofi.nl?subject=${encodeURIComponent(link.subject)}`}>
            {link.label}
          </a>
        ))}
      </div>
    </Card>
  )
}
