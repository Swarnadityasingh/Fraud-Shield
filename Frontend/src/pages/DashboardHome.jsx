import { CreditCard, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react'

import DashboardWelcome from '../components/DashboardWelcome'
import QuickActions from '../components/QuickActions'
import StatCard from '../components/StatCard'
import TransactionTable from '../components/TransactionTable'

export default function DashboardHome({
  userName,
  totalTransactions,
  legitimateTransactions,
  flaggedTransactions,
  highRiskCases,
  notifications,
  history,
  onNavigate,
}) {
  return (
    <div className="reference-dashboard-grid">
      <DashboardWelcome
        userName={userName}
        totalTransactions={totalTransactions}
        notifications={notifications}
      />

      <QuickActions onNavigate={onNavigate} />

      <section id="overview" className="dashboard-stats-grid">
        <StatCard
          title="Transactions Analysed"
          value={totalTransactions.toLocaleString('en-IN')}
          icon={CreditCard}
        />

        <StatCard
          title="Legitimate Transactions"
          value={legitimateTransactions.toLocaleString('en-IN')}
          icon={ShieldCheck}
          color="blue"
        />

        <StatCard
          title="Flagged Transactions"
          value={flaggedTransactions.toLocaleString('en-IN')}
          icon={ShieldAlert}
          color="amber"
        />

        <StatCard
          title="High Risk Cases"
          value={highRiskCases.toLocaleString('en-IN')}
          icon={AlertTriangle}
          color="red"
        />
      </section>

      <section
        id="transactions"
        className="dashboard-transactions overview-transactions"
      >
        <div className="transactions-section-heading">
          <div>
            <h2>Recent Transactions</h2>
            <p>Your analysed transaction history</p>
          </div>
        </div>

        <TransactionTable history={history} />
      </section>
    </div>
  )
}
