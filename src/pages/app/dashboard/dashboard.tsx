import { Helmet } from 'react-helmet-async'

import { DayOrdersAmountCard } from './day-orders-amount-card'
import { MonthOrdersAmountCard } from './month-orders-amount-card'
import { MonthRevenueCard } from './month-revenue-card'

export function Dashboard() {
 

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <DayOrdersAmountCard />
          <MonthOrdersAmountCard />
          <MonthRevenueCard />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-9">
          {/* <MonthTransactionOutcomeCategory
            from={period?.from}
            to={period?.to}
          />
          <MonthTransactionOutcomeReservation
            from={period?.from}
            to={period?.to}
          /> */}
        </div>
      </div>
    </>
  )
}
