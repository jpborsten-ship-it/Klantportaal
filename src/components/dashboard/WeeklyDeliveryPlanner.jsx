import { useNavigate } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'
import DeliveryDayCard from './DeliveryDayCard'
import { buildBlocksForDay } from '../../utils/agendaBlocks'

const DAYS_AHEAD = 7

export default function WeeklyDeliveryPlanner({ days, orders }) {
  const navigate = useNavigate()
  const visibleDays = days.slice(0, DAYS_AHEAD)

  return (
    <Card
      title="Leverplanning deze week"
      className="dashboard-weekly-planner"
      action={<Button variant="secondary" onClick={() => navigate('/leveragenda')}>Open leveragenda</Button>}
    >
      <div className="delivery-day-strip">
        {visibleDays.map((day) => (
          <DeliveryDayCard key={day.date} day={day.date} blocks={buildBlocksForDay(day.plannedLines, orders)} />
        ))}
      </div>
    </Card>
  )
}
