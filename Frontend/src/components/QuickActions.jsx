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
      <button onClick={() => onNavigate('Fraud Detection')}>
        <ShieldAlert size={18} />
        Fraud detection
        <ArrowUpRight size={16} />
      </button>

      <button onClick={() => onNavigate('Credit Risk')}>
        <TrendingUp size={18} />
        Credit delinquency
        <ArrowUpRight size={16} />
      </button>

      <button onClick={() => onNavigate('Unified Risk')}>
        <Activity size={18} />
        Unified workspace
        <ArrowUpRight size={16} />
      </button>

      <button onClick={() => onNavigate('Reports')}>
        <Download size={18} />
        Reports & exports
      </button>
    </section>
  )
}
