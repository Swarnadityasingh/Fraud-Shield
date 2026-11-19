import { ArrowUpRight, Printer, Activity } from 'lucide-react'

export default function DashboardWelcome({ userName, totalTransactions, notifications = [], ready, onNavigate }) {
  return <div className="executive-intro">
    <section className="dashboard-welcome">
      <span className="dashboard-eyebrow"><span className="copper-line" /> YOUR WORKSPACE, IN FOCUS</span>
      <h2>Welcome back, {userName}.</h2>
      <p>{ready
        ? <><strong>{totalTransactions.toLocaleString('en-IN')}</strong> saved predictions. Two independent perspectives on financial risk.</>
        : 'Your financial risk workspace. Transaction fraud and credit delinquency, independently assessed.'}</p>
      <div className="overview-header-actions">
        <button className="dashboard-button primary" onClick={() => onNavigate('Fraud Detection')}>Analyse a transaction <ArrowUpRight size={15} /></button>
        <button className="dashboard-button" disabled={!ready} onClick={() => window.print()}><Printer size={15} /> Print overview</button>
      </div>
    </section>
    <aside className="reference-activity-card" aria-label="Recent notifications">
      <div className="reference-activity-heading"><span className="activity-heading-icon"><Activity size={16} /></span><div><h2>Workspace activity</h2><p>Recent session notifications</p></div></div>
      {notifications.length ? <div className="reference-activity-list">{notifications.slice(0, 3).map(item => <div className="reference-activity-item" key={item.id}>
        <span className={`event-dot ${item.severity === 'warning' ? 'event-warning' : ''}`} />
        <div><strong>{item.title}</strong><p>{item.description}</p></div>
      </div>)}</div> : <div className="activity-quiet"><span className="quiet-ring"><Activity size={19} /></span><div><strong>No session alerts</strong><p>New notifications will appear here.</p></div></div>}
    </aside>
  </div>
}
