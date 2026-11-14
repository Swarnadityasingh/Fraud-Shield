import {
  ShieldAlert,
  TrendingUp,
  Activity,
  Download,
  ArrowUpRight,
} from 'lucide-react'

export default function QuickActions({ onNavigate }) {
  return (
    <section className="dashboard-quick-actions">
      <button onClick={() => onNavigate('Analyze', 'analyze')}>
        <ShieldAlert size={18} />
        Financial Fraud
        <ArrowUpRight size={16} />
      </button>

      <button onClick={() => onNavigate('Risk Analysis')}>
        <TrendingUp size={18} />
        Risk Analysis
        <ArrowUpRight size={16} />
      </button>

      <button onClick={() => onNavigate('Unified Intelligence')}>
        <Activity size={18} />
        Unified Intelligence
        <ArrowUpRight size={16} />
      </button>

      <button onClick={() => window.print()}>
        <Download size={18} />
        Export Report
      </button>
    </section>
  )
}
