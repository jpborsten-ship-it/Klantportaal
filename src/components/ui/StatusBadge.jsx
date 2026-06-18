// Eén generieke badge voor alle status-enums (OrderLine, Invoice, ReturnRequest).
// Onbekende statussen vallen terug op de ruwe waarde zodat niets stil verdwijnt.
const STATUS_CONFIG = {
  // OrderLineStatus
  besteld: { label: 'Besteld', tone: 'neutral' },
  bevestigd: { label: 'Bevestigd', tone: 'neutral' },
  onderweg_naar_partsprofi: { label: 'Onderweg naar PartsProfi', tone: 'info' },
  binnen_bij_partsprofi: { label: 'Binnen bij PartsProfi', tone: 'info' },
  ingepland: { label: 'Ingepland', tone: 'info' },
  verzonden: { label: 'Verzonden', tone: 'success' },
  geleverd: { label: 'Geleverd', tone: 'success' },
  vertraagd: { label: 'Vertraagd', tone: 'warning' },
  retour_aangevraagd: { label: 'Retour aangevraagd', tone: 'warning' },
  deels_verzonden: { label: 'Deels verzonden', tone: 'info' },
  // InvoiceStatus
  open: { label: 'Open', tone: 'warning' },
  betaald: { label: 'Betaald', tone: 'success' },
  vervallen: { label: 'Vervallen', tone: 'danger' },
  // ReturnRequestStatus
  aangevraagd: { label: 'Aangevraagd', tone: 'neutral' },
  in_behandeling: { label: 'In behandeling', tone: 'info' },
  goedgekeurd: { label: 'Goedgekeurd', tone: 'success' },
  afgewezen: { label: 'Afgewezen', tone: 'danger' },
  ontvangen: { label: 'Ontvangen', tone: 'info' },
  verwerkt: { label: 'Verwerkt', tone: 'success' },
  // Urgentie (dashboard: acties nodig)
  hoog: { label: 'Hoog', tone: 'danger' },
  middel: { label: 'Middel', tone: 'warning' },
  laag: { label: 'Laag', tone: 'info' },
}

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? { label: status, tone: 'neutral' }
  return <span className={`status-badge status-badge--${config.tone}`}>{config.label}</span>
}
