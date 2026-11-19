import { useMemo } from 'react'
import { Layers, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Database, RefreshCw } from 'lucide-react'
import DashboardWelcome from '../components/DashboardWelcome'
import QuickActions from '../components/QuickActions'
import StatCard from '../components/StatCard'
import TransactionTable from '../components/TransactionTable'
import DashboardCharts from '../components/DashboardCharts'
import { summarizeHistory } from '../services/dashboardSummary'

export default function DashboardHome({ userName, notifications, history, historyState, historyError, onReload, onNavigate }) {
  const ready = historyState === 'ready'
  const summary = useMemo(() => ready ? summarizeHistory(history) : null, [history, ready])
  const fraud = summary?.pipelines.find(p => p.key === 'fraud')
  return <div className="executive-home">
    <DashboardWelcome userName={userName} totalTransactions={summary?.total} ready={ready} notifications={notifications} onNavigate={onNavigate} />
    <QuickActions onNavigate={onNavigate} />
    {!ready ? <section className={`history-state history-state-${historyState}`} role={historyState === 'error' ? 'alert' : 'status'} aria-live="polite">
      <span className="state-icon"><Database size={24} /></span>
      <h2>{historyState === 'error' ? 'Prediction history is unavailable' : 'Loading your workspace'}</h2>
      <p>{historyState === 'error' ? historyError : 'Retrieving your saved predictions. Statistics will appear when the complete history is available.'}</p>
      {historyState === 'error' && <button className="dashboard-button" onClick={onReload}><RefreshCw size={15} /> Retry loading history</button>}
      {historyState !== 'error' && <div className="loading-lines" aria-hidden="true"><i /><i /><i /></div>}
    </section> : <>
      <section id="overview" className="dashboard-stats-grid" aria-label="Saved prediction totals">
        <StatCard title="Predictions analysed" value={summary.total.toLocaleString('en-IN')} description="All saved model predictions" icon={Layers} />
        <StatCard title="Legitimate transactions" value={fraud.negative.toLocaleString('en-IN')} description="Transaction fraud pipeline only" icon={ShieldCheck} color="blue" />
        <StatCard title="Flagged fraud predictions" value={fraud.positive.toLocaleString('en-IN')} description="Transaction fraud pipeline only" icon={ShieldAlert} color="red" />
        <StatCard title="High risk cases" value={summary.highRisk.toLocaleString('en-IN')} description="Saved High display band · both pipelines" icon={AlertTriangle} color="red" />
      </section>
      {summary.total ? <DashboardCharts summary={summary} /> : <section className="history-state history-empty">
        <span className="state-icon"><Layers size={25} /></span><span className="dashboard-eyebrow">A CLEAR START</span>
        <h2>Your next prediction starts here.</h2><p>No saved predictions were returned for your account. Analyse a transaction or assess credit delinquency to build your workspace history.</p>
        <div className="empty-actions"><button className="dashboard-button primary" onClick={() => onNavigate('Fraud Detection')}>Fraud detection <ArrowRight size={15} /></button><button className="dashboard-button" onClick={() => onNavigate('Credit Risk')}>Credit delinquency <ArrowRight size={15} /></button></div>
      </section>}
      <section id="transactions" className="dashboard-panel overview-transactions">
        <div className="panel-heading"><div><h2>Recent predictions</h2><p> Most recent saved records · model scores are not verified as calibrated probabilities</p></div><button className="text-action" onClick={() => onNavigate('Reports')}>View all records <ArrowRight size={14} /></button></div>
        <TransactionTable history={summary.recent.slice(0, 8)} />
        {summary.total > 8 && <p className="chart-note">Showing 8 of {summary.total.toLocaleString('en-IN')} records. Full history is available in Reports.</p>}
      </section>
    </>}
  </div>
}
