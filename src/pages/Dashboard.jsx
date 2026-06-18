import Card from '../components/ui/Card'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import ActionRequiredCard from '../components/dashboard/ActionRequiredCard'
import WeeklyDeliveryPlanner from '../components/dashboard/WeeklyDeliveryPlanner'
import FinanceSummaryCard from '../components/dashboard/FinanceSummaryCard'
import RecentOrdersCard from '../components/dashboard/RecentOrdersCard'
import SupportCard from '../components/dashboard/SupportCard'
import { invoices, orders, customers, returnRequests } from '../data/mockData'
import { useDeliveryPlanning } from '../state/DeliveryPlanningContext'
import { linesForCustomer } from '../utils/orderStatus'
import { CURRENT_CUSTOMER_ID } from '../utils/currentCustomer'
import { getAgendaWeekdayPage, buildAgendaDays, getCurrentWeekWeekdays, isDateLocked } from '../utils/deliveryCost'
import { getActionRequiredItems, getFinanceSummary, getRecentOrders } from '../utils/dashboardInsights'

const WEEK_DAYS_AHEAD = 7

export default function Dashboard() {
  const { lines } = useDeliveryPlanning()
  const klantLines = linesForCustomer(lines, orders, CURRENT_CUSTOMER_ID)
  const klant = customers.find((c) => c.id === CURRENT_CUSTOMER_ID)

  const weekDays = buildAgendaDays(klantLines, getAgendaWeekdayPage(0, WEEK_DAYS_AHEAD))
  const leveringenVandaag = klantLines.filter((line) => line.plannedDeliveryDate && isDateLocked(line.plannedDeliveryDate)).length

  const financeSummary = getFinanceSummary(invoices, CURRENT_CUSTOMER_ID)
  const actionItems = getActionRequiredItems(klantLines, orders, invoices, returnRequests, CURRENT_CUSTOMER_ID)
  const recentOrders = getRecentOrders(orders, lines, CURRENT_CUSTOMER_ID)

  const dezeWeek = getCurrentWeekWeekdays()
  const omzetDezeWeek = klantLines
    .filter((line) => dezeWeek.includes(line.plannedDeliveryDate))
    .reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)

  return (
    <div className="dashboard-grid">
      <DashboardHeader klant={klant} leveringenVandaag={leveringenVandaag} openstaandBedrag={financeSummary.openstaandBedrag} />

      <ActionRequiredCard items={actionItems} />

      <WeeklyDeliveryPlanner days={weekDays} orders={orders} />

      <Card title="Omzet deze week">
        <p className="dashboard-metric">
          € <AnimatedNumber value={omzetDezeWeek} format={(n) => n.toFixed(2)} />
        </p>
        <p>waarde van de producten die deze week bij je geleverd worden</p>
      </Card>

      <FinanceSummaryCard summary={financeSummary} />
      <RecentOrdersCard recentOrders={recentOrders} />
      <SupportCard />
    </div>
  )
}
