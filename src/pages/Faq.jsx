import Card from '../components/ui/Card'
import { faqItems } from '../data/mockData'

export default function Faq() {
  const categories = [...new Set(faqItems.map((item) => item.category))]

  return (
    <div className="faq">
      {categories.map((category) => (
        <Card key={category} title={category}>
          <div className="faq-list">
            {faqItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div key={item.id} className="faq-item">
                  <p className="faq-question">{item.question}</p>
                  <p className="faq-answer">{item.answer}</p>
                </div>
              ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
