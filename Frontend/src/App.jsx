
import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Bell,
  CreditCard,
  Percent,
  Search,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Settings as SettingsIcon,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'
import TransactionTable from './components/TransactionTable'
import SettingsPanel from './components/SettingsPanel'
import {
  predictTransaction,
  getModelStatus,
} from './services/api'

const chartData = [
  { day: 'Mon', legitimate: 210, flagged: 18 },
  { day: 'Tue', legitimate: 260, flagged: 24 },
  { day: 'Wed', legitimate: 225, flagged: 15 },
  { day: 'Thu', legitimate: 290, flagged: 31 },
  { day: 'Fri', legitimate: 245, flagged: 22 },
  { day: 'Sat', legitimate: 180, flagged: 12 },
  { day: 'Sun', legitimate: 205, flagged: 19 },
]

const DEFAULT_SETTINGS = {
  profileName: 'FraudShield Admin',
  email: 'admin@example.com',
  theme: 'light',
  notifyHighRisk: true,
  notifyFraud: true,
  mediumThreshold: 30,
  highThreshold: 70,
}

function loadSettings() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('fraudshield-settings') || '{}'
    )

    return { ...DEFAULT_SETTINGS, ...saved }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export default function App() {
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('TRANSFER')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [settings, setSettings] = useState(loadSettings)

  const [modelStatus, setModelStatus] = useState({
    loading: false,
    online: false,
    modelConnected: false,
    error: '',
  })

  useEffect(() => {
  document.documentElement.classList.toggle(
    'dark',
    settings.theme === 'dark'
  )

  document.documentElement.style.colorScheme = settings.theme
}, [settings.theme])

  async function refreshModelStatus() {
    setModelStatus((previous) => ({
      ...previous,
      loading: true,
      error: '',
    }))

    try {
      const data = await getModelStatus()

      setModelStatus({
        loading: false,
        online: data.status === 'healthy',
        modelConnected: data.model_connected === true,
        error: '',
      })
    } catch {
      setModelStatus({
        loading: false,
        online: false,
        modelConnected: false,
        error: 'Could not connect to the backend.',
      })
    }
  }

  useEffect(() => {
    refreshModelStatus()
  }, [])

  function saveSettings() {
    const medium = Number(settings.mediumThreshold)
    const high = Number(settings.highThreshold)

    if (
      !Number.isFinite(medium) ||
      !Number.isFinite(high) ||
      medium < 1 ||
      high > 100 ||
      medium >= high
    ) {
      setMessage(
        'Invalid risk thresholds. Medium must be at least 1%, high must be at most 100%, and medium must be lower than high.'
      )
      return
    }

    const normalizedSettings = {
      ...settings,
      mediumThreshold: medium,
      highThreshold: high,
    }

    setSettings(normalizedSettings)

    try {
      localStorage.setItem(
        'fraudshield-settings',
        JSON.stringify(normalizedSettings)
      )
      setMessage('Settings saved successfully.')
    } catch {
      setMessage('Could not save settings in this browser.')
    }
  }

  async function analyze(e) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setResult(null)

    try {
      const data = await predictTransaction({
        amount: Number(amount),
        transaction_type: type,
        step: 1,
      })

      const probability = Number(data.fraud_probability)

      if (!Number.isFinite(probability)) {
        throw new Error('The backend returned an invalid fraud probability.')
      }

      const medium = Number(settings.mediumThreshold) / 100
      const high = Number(settings.highThreshold) / 100

      const risk =
        probability >= high
          ? 'High'
          : probability >= medium
            ? 'Medium'
            : 'Low'

      const updatedResult = {
        ...data,
        risk_level: risk,
      }

      setResult(updatedResult)

      const shouldAlert =
        (risk === 'High' && settings.notifyHighRisk) ||
        (data.prediction === 'Fraudulent' && settings.notifyFraud)

      setMessage(
        shouldAlert
          ? `Alert: ${data.prediction} transaction detected.`
          : 'Transaction analysis completed.'
      )
    } catch (error) {
      setMessage(
        error.message || 'Could not connect to the backend.'
      )
    } finally {
      setLoading(false)
    }
  }

  const isFraud = result?.prediction === 'Fraudulent'

  const pageButtonClass = (page) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
      activePage === page
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 md:flex">
      <aside className="w-full border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h2 className="font-bold">FraudShield</h2>
            <p className="text-xs text-slate-500">Risk monitoring</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto md:flex-col">
          <button
            type="button"
            onClick={() => setActivePage('Dashboard')}
            className={pageButtonClass('Dashboard')}
          >
            <Activity size={18} />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePage('Analyze')
              document.getElementById('analyze')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
            className={pageButtonClass('Analyze')}
          >
            <Search size={18} />
            Analyze
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePage('Transactions')
              document.getElementById('transactions')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
            className={pageButtonClass('Transactions')}
          >
            <CreditCard size={18} />
            Transactions
          </button>

          <button
            type="button"
            onClick={() => {
              setActivePage('Settings')
              document.getElementById('settings')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
            className={pageButtonClass('Settings')}
          >
            <SettingsIcon size={18} />
            Settings
          </button>
        </nav>

        <div className="mt-6 hidden rounded-xl bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 md:block">
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Model status
          </p>
          <p className="mt-1">
            {modelStatus.loading
              ? 'Checking...'
              : modelStatus.modelConnected
                ? 'Connected'
                : 'Not connected'}
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        <header className="mb-7 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {activePage === 'Settings' ? 'Settings' : 'Dashboard'}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Financial transaction monitoring
            </p>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => {
              setActivePage('Settings')
              document.getElementById('settings')?.scrollIntoView({
                behavior: 'smooth',
              })
            }}
            className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
          >
            <Bell size={19} />
          </button>
        </header>

        {activePage === 'Settings' ? (
          <SettingsPanel
            settings={settings}
            onChange={setSettings}
            modelStatus={modelStatus}
            onRefreshModel={refreshModelStatus}
            onSave={saveSettings}
          />
        ) : (
          <>
            <section
              id="overview"
              className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 xl:grid-cols-4"
            >
              <StatCard
                title="Total transactions"
                value="12,480"
                icon={CreditCard}
              />
              <StatCard
                title="Flagged transactions"
                value="186"
                icon={ShieldAlert}
                color="red"
              />
              <StatCard
                title="Flagged rate"
                value="1.49%"
                icon={Percent}
                color="violet"
              />
              <StatCard
                title="High-risk cases"
                value="42"
                icon={AlertTriangle}
                color="amber"
              />
            </section>

            <p className="mt-2 text-xs text-slate-400">
              Dashboard cards and chart use illustrative sample data.
            </p>

            <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <Activity size={19} className="text-blue-600" />
                  <h2 className="font-semibold">Transaction activity</h2>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Last 7 days · sample data
                </p>

                <div className="mt-5 h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="legitimate"
                        name="Legitimate"
                        fill="#2563eb"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="flagged"
                        name="Flagged"
                        fill="#93c5fd"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article
                id="analyze"
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <h2 className="font-semibold">Analyze a transaction</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter transaction details for model-based analysis.
                </p>

                <form onSubmit={analyze} className="mt-5 space-y-4">
                  <label className="block text-sm font-medium">
                    Amount (₹)
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-transparent px-3.5 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="block text-sm font-medium">
                    Transaction type
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {[
                        'TRANSFER',
                        'PAYMENT',
                        'CASH_OUT',
                        'CASH_IN',
                        'DEBIT',
                      ].map((item) => (
                        <option key={item} value={item}>
                          {item.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    <Search size={17} />
                    {loading ? 'Analyzing...' : 'Analyze transaction'}
                  </button>
                </form>

                {message && (
                  <div
                    role="status"
                    className="mt-4 rounded-xl bg-blue-50 p-3 text-sm leading-5 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                  >
                    {message}
                  </div>
                )}

                {result && (
                  <div className="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      {isFraud ? (
                        <XCircle className="text-red-600" size={22} />
                      ) : (
                        <CheckCircle className="text-green-600" size={22} />
                      )}
                      <h3 className="font-semibold">
                        {result.prediction}
                      </h3>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="text-xs text-slate-500">
                          Fraud probability
                        </p>
                        <p className="mt-1 text-lg font-bold">
                          {(Number(result.fraud_probability) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                        <p className="text-xs text-slate-500">Risk level</p>
                        <p className="mt-1 text-lg font-bold">
                          {result.risk_level}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Experimental prediction from a model trained on synthetic
                      data. It is not proof of fraud.
                    </p>
                  </div>
                )}
              </article>
            </section>

            <div id="transactions" className="mt-6">
              <TransactionTable />
            </div>
          </>
        )}

        {message && activePage === 'Settings' && (
          <p role="status" className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            {message}
          </p>
        )}

        <footer className="py-6 text-center text-xs text-slate-400">
          FraudShield · Machine Learning Financial Monitoring
        </footer>
      </main>
    </div>
  )
}
