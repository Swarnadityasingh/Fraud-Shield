import { FileDown } from 'lucide-react'

export default function DashboardWelcome({
  userName,
  totalTransactions,
  notifications = [],
}) {
  return (
    <div className="reference-dashboard-grid">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            EXECUTIVE OVERVIEW
          </span>

          <h1>Welcome back, {userName}.</h1>

          <p>
            You’ve analysed{' '}
            <strong className="overview-summary-count">
              {totalTransactions.toLocaleString('en-IN')}
            </strong>{' '}
            transactions in your workspace.
          </p>
        </div>

        <div className="overview-header-actions">
          <button
            type="button"
            className="overview-export"
            onClick={() => window.print()}
          >
            <FileDown size={17} aria-hidden="true" />
            <span>Export Report</span>
          </button>
        </div>
      </section>

      <aside className="reference-activity-card">
        <div className="reference-activity-heading">
          <div>
            <strong>Activity</strong>
            <span>Latest risk events</span>
          </div>
          <small><i /> Live</small>
        </div>

        <div className="reference-activity-list">
          {notifications.length === 0 && (
            <p>No activity yet.</p>
          )}

          {notifications.slice(0, 5).map((item, index) => (
            <div className="reference-activity-item" key={item.id}>
              <span>{index + 1}</span>

              <div>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
