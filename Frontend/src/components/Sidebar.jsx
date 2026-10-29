
import {
  ShieldCheck, LayoutDashboard, Search,
  CreditCard, Settings
} from 'lucide-react'

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '#overview' },
    { name: 'Analyze', icon: Search, href: '#analyze' },
    { name: 'Transactions', icon: CreditCard, href: '#transactions' },
    { name: 'Settings', icon: Settings, href: '#settings' },
  ]

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white p-5 md:sticky md:top-0 md:h-screen md:w-60 md:border-b-0 md:border-r">
      <a href="#overview" className="mb-8 flex items-center gap-2 text-xl font-bold">
        <ShieldCheck className="text-blue-600" size={28} />
        <span>Fraud<span className="text-blue-600">Shield</span></span>
      </a>

      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Workspace
      </p>

      <nav className="flex flex-wrap gap-1 md:flex-col">
        {links.map(({ name, icon: Icon, href }, index) => (
          <a
            key={name}
            href={href}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
              index === 0
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <Icon size={18} />
            {name}
          </a>
        ))}
      </nav>

      <div className="mt-auto hidden rounded-xl bg-blue-50 p-4 md:block">
        <p className="text-sm font-semibold text-blue-900">Fraud monitoring</p>
        <p className="mt-1 text-xs text-blue-700">ML dashboard prototype</p>
      </div>
    </aside>
  )
}
