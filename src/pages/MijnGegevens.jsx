import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { customers } from '../data/mockData'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'

export default function MijnGegevens() {
  const customer = customers.find((c) => c.id === CURRENT_CUSTOMER_ID)
  const [defaultAddressId, setDefaultAddressId] = useState(customer.defaultDeliveryAddressId)
  const [wijzigingVerzonden, setWijzigingVerzonden] = useState(false)

  return (
    <div className="mijn-gegevens">
      <Card title="Bedrijfsgegevens">
        <dl className="data-list">
          <dt>Bedrijfsnaam</dt>
          <dd>{customer.companyName}</dd>
          <dt>Contactpersoon</dt>
          <dd>{customer.contactName}</dd>
          <dt>E-mailadres</dt>
          <dd>{customer.email}</dd>
          <dt>Telefoonnummer</dt>
          <dd>{customer.phone}</dd>
          <dt>Btw-nummer</dt>
          <dd>{customer.vatNumber}</dd>
          <dt>Factuuradres</dt>
          <dd>
            {customer.billingAddress.straat}, {customer.billingAddress.postcode} {customer.billingAddress.plaats}
          </dd>
        </dl>
      </Card>

      <Card title="Afleveradressen">
        {customer.deliveryAddresses.map((addr) => (
          <label key={addr.id} className="address-option">
            <input
              type="radio"
              name="defaultAddress"
              checked={defaultAddressId === addr.id}
              onChange={() => setDefaultAddressId(addr.id)}
            />
            <span>
              {addr.label} — {addr.straat}, {addr.postcode} {addr.plaats}
            </span>
          </label>
        ))}
        <p className="form-hint">Standaardadres wordt hier alvast gekozen; opslaan in een echt systeem volgt later.</p>
      </Card>

      <Card title="Gegevens wijzigen">
        {wijzigingVerzonden ? (
          <p>Je wijzigingsverzoek is verzonden. We nemen dit zo snel mogelijk over.</p>
        ) : (
          <form
            className="change-request-form"
            onSubmit={(e) => {
              e.preventDefault()
              setWijzigingVerzonden(true)
            }}
          >
            <textarea placeholder="Beschrijf de gewenste wijziging..." rows={3} required />
            <Button type="submit">Wijzigingsverzoek indienen</Button>
          </form>
        )}
      </Card>
    </div>
  )
}
