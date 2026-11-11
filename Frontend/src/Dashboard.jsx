import { useEffect, useState, useRef } from 'react'
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
  Sun,
  Moon,
  LogOut,
  ArrowUpRight,
  Download,
  TrendingUp,
  ShieldCheck,
  Clock3,
} from 'lucide-react'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts'

import StatCard from './components/StatCard'
import TransactionTable from './components/TransactionTable'
import SettingsPanel from './components/SettingsPanel'

import './Dashboard.css'

const getGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

const getLastSevenDays = (history = []) => {
  const safeHistory = Array.isArray(history) ? history : []
  const days = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const key = date.toLocaleDateString('en-CA')

    const transactions = safeHistory.filter(
      (item) =>
        item.created_at &&
        new Date(item.created_at).toLocaleDateString('en-CA') === key
    )

    days.push({
      day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      legitimate: transactions.filter(
        (item) => item.prediction !== 'Fraudulent'
      ).length,
      flagged: transactions.filter(
        (item) => item.prediction === 'Fraudulent'
      ).length,
    })
  }

  return days
}

export default function Dashboard({
  activePage,
  setActivePage,
  settings,
  setSettings,
  modelStatus,
  refreshModelStatus,
  amount,
  setAmount,
  type,
  setType,
  analyze,
  clearAnalysis,
  loading,
  message,
  result,
  history = [],
  notifications = [],
  markNotificationRead,
  markAllNotificationsRead,
  welcomeVisible,
  onWelcomeDismiss,
  onLogout,
}) {
  const isFraud = result?.prediction === 'Fraudulent'

  const safeHistory = Array.isArray(history) ? history : []
  const safeNotifications = Array.isArray(notifications) ? notifications : []

  const totalTransactions = safeHistory.length

  const flaggedTransactions = safeHistory.filter(
    (item) => item.prediction === 'Fraudulent'
  ).length

  const legitimateTransactions =
    totalTransactions - flaggedTransactions

  const highRiskCases = safeHistory.filter(
    (item) => item.risk_level === 'High'
  ).length

  const activityData = getLastSevenDays(safeHistory)

  const riskData = [
    {
      name: 'Low',
      value: safeHistory.filter((item) => item.risk_level === 'Low').length,
      color: '#477653',
    },
    {
      name: 'Medium',
      value: safeHistory.filter((item) => item.risk_level === 'Medium').length,
      color: '#B7791F',
    },
    {
      name: 'High',
      value: highRiskCases,
      color: '#9F263B',
    },
  ].filter((item) => item.value > 0)

  const transactionDistribution = [
    { name: 'Legitimate', value: legitimateTransactions, color: '#477653' },
    { name: 'Flagged', value: flaggedTransactions, color: '#9F263B' },
  ].filter((item) => item.value > 0)

  const userName =
    settings.profileName?.split(' ')[0] || 'there'

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [themeToast, setThemeToast] = useState('')
  const themeInitialized = useRef(false)
  const notificationWrapperRef = useRef(null)

  const [welcomePhase, setWelcomePhase] = useState(
    welcomeVisible ? 'visible' : 'hidden'
  )

  useEffect(() => {
    if (!welcomeVisible) return

    setWelcomePhase('visible')

    const exitTimer = setTimeout(() => {
      setWelcomePhase('exiting')
    }, 3500)

    const dismissTimer = setTimeout(() => {
      setWelcomePhase('hidden')
      onWelcomeDismiss?.()
    }, 4100)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(dismissTimer)
    }
  }, [welcomeVisible, onWelcomeDismiss])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationWrapperRef.current &&
        !notificationWrapperRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false)
      }
    }

    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationsOpen])

  useEffect(() => {
    if (!themeInitialized.current) {
      themeInitialized.current = true
      return
    }

    setThemeToast(
      settings.theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'
    )

    const timer = setTimeout(() => setThemeToast(''), 1800)
    return () => clearTimeout(timer)
  }, [settings.theme])

  const pageButtonClass = (page) =>
    `dashboard-nav-item ${
      activePage === page ? 'active' : ''
    }`

  function navigateTo(page, sectionId) {
    setActivePage(page)

    if (sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }

  return (
    <div className="dashboard-layout dashboard-enter">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            <ShieldAlert size={23} />
          </div>

          <div>
            <h2>FraudShield</h2>
            <p>Risk monitoring</p>
          </div>
        </div>

        <nav className="dashboard-navigation">
          <button
            type="button"
            onClick={() => navigateTo('Dashboard', 'overview')}
            className={pageButtonClass('Dashboard')}
          >
            <Activity size={19} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('Analyze', 'analyze')}
            className={pageButtonClass('Analyze')}
          >
            <Search size={19} />
            <span>Analyze</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('Transactions', 'transactions')}
            className={pageButtonClass('Transactions')}
          >
            <CreditCard size={19} />
            <span>Transactions</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('Settings', 'settings')}
            className={pageButtonClass('Settings')}
          >
            <SettingsIcon size={19} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="model-status-card">
          <div className="model-status-heading">
            <span className="model-status-dot" />
            <span>Model status</span>
          </div>

          <p>
            {modelStatus.loading
              ? 'Checking connection...'
              : modelStatus.modelConnected
                ? 'Connected'
                : 'Not connected'}
          </p>

          {modelStatus.error && (
            <span className="model-status-error">
              {modelStatus.error}
            </span>
          )}
        </div>

        <div className="sidebar-footer">
          <span>FRAUDSHIELD</span>
          <span>FINANCIAL INTELLIGENCE</span>
        </div>
      </aside>

      <main className="dashboard-main">
        {welcomePhase !== 'hidden' && (
          <div
            className={`welcome-toast welcome-toast-${welcomePhase}`}
            role="status"
            aria-live="polite"
          >
            <div className="welcome-toast-icon">
              <ShieldAlert size={21} />
            </div>

            <div>
              <strong>Welcome to FraudShield!</strong>
              <p>Your financial monitoring workspace is ready.</p>
            </div>
          </div>
        )}

        <header className="dashboard-header">
          <div>
            <span className="dashboard-eyebrow">
              FINANCIAL INTELLIGENCE PLATFORM
            </span>

            <h1>
              {activePage === 'Settings' ? 'Settings' : 'Dashboard'}
            </h1>

            <p>
              {activePage === 'Settings'
                ? 'Manage your preferences, risk rules and system configuration.'
                : 'Financial transaction monitoring'}
            </p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle-button"
              onClick={() =>
                setSettings((previous) => ({
                  ...previous,
                  theme: previous.theme === 'dark' ? 'light' : 'dark',
                }))
              }
              aria-label="Toggle theme"
              title="Switch theme"
            >
              {settings.theme === 'dark' ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>

            <div ref={notificationWrapperRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className="notification-button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell size={20} />

                {safeNotifications.some((item) => !item.read) && (
                  <span className="notification-indicator" />
                )}
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-header">
                    <div>
                      <h3>Notifications</h3>
                      <p>
                        {safeNotifications.filter((item) => !item.read).length} unread
                      </p>
                    </div>

                    <button type="button" onClick={markAllNotificationsRead}>
                      Mark all read
                    </button>
                  </div>

                  {safeNotifications.length === 0 ? (
                    <div className="notification-empty">
                      <Bell size={22} />
                      <strong>You're all caught up</strong>
                      <span>Fraud and risk alerts will appear here.</span>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {safeNotifications.map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          className={`notification-item severity-${item.severity} ${
                            item.read ? 'read' : ''
                          }`}
                          onClick={() => {
                            markNotificationRead(item.id)
                          }}
                        >
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                          <small>
                            {new Date(item.createdAt).toLocaleTimeString('en-IN')}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={onLogout}
              title="Logout"
              aria-label="Logout from FraudShield"
            >
              <LogOut size={19} />
              <span>Logout</span>
            </button>

            {themeToast && (
              <div className="theme-toast" role="status">
                {themeToast}
              </div>
            )}
          </div>
        </header>

        {activePage === 'Settings' ? (
          <section id="settings" className="dashboard-settings">
            <SettingsPanel
              settings={settings}
              onChange={setSettings}
              modelStatus={modelStatus}
              onRefreshModel={refreshModelStatus}
            />
          </section>
        ) : (
          <>
            <section className="dashboard-welcome">
              <div>
                <span className="dashboard-eyebrow">
                  YOUR FINANCIAL COMMAND CENTRE
                </span>

                <h1>
                  {getGreeting()}, {userName} 👋🏻
                </h1>

                <p>
                  Here's what's happening with your financial security.
                </p>
              </div>

              <div className="welcome-date">
                <Clock3 size={16} />
                {new Date().toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </section>

            <section className="dashboard-quick-actions">
              <button onClick={() => navigateTo('Analyze', 'analyze')}>
                <ShieldAlert size={18} />
                Financial Fraud
                <ArrowUpRight size={16} />
              </button>

              <button onClick={() => navigateTo('Risk Analysis')}>
                <TrendingUp size={18} />
                Risk Analysis
                <ArrowUpRight size={16} />
              </button>

              <button onClick={() => navigateTo('Unified Intelligence')}>
                <Activity size={18} />
                Unified Intelligence
                <ArrowUpRight size={16} />
              </button>

              <button onClick={() => window.print()}>
                <Download size={18} />
                Export Report
              </button>
            </section>

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
                color="red"
              />

              <StatCard
                title="High Risk Cases"
                value={highRiskCases.toLocaleString('en-IN')}
                icon={AlertTriangle}
                color="amber"
              />
            </section>

            <section className="dashboard-analytics">
              <article className="dashboard-panel activity-panel">
                <div className="panel-heading">
                  <div className="panel-heading-icon">
                    <Activity size={19} />
                  </div>

                  <div>
                    <h2>Transaction Activity</h2>
                    <p>Transaction trends over the last 7 days</p>
                  </div>
                </div>

                {totalTransactions > 0 ? (
                  <div className="activity-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activityData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--dashboard-chart-grid)"
                        />

                        <XAxis dataKey="day" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Legend />

                        <Line
                          type="monotone"
                          dataKey="legitimate"
                          name="Legitimate"
                          stroke="#477653"
                          strokeWidth={3}
                          dot={false}
                        />

                        <Line
                          type="monotone"
                          dataKey="flagged"
                          name="Flagged"
                          stroke="#9F263B"
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="dashboard-chart-empty">
                    <Activity size={30} />
                    <strong>No transaction activity yet</strong>
                    <span>Analyse your first transaction to see trends.</span>
                  </div>
                )}
              </article>

              <article className="dashboard-panel">
                <div className="panel-heading">
                  <div className="panel-heading-icon">
                    <ShieldAlert size={19} />
                  </div>

                  <div>
                    <h2>Risk Distribution</h2>
                    <p>Breakdown of assessed transactions</p>
                  </div>
                </div>

                {riskData.length > 0 ? (
                  <div className="activity-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={4}
                        >
                          {riskData.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="dashboard-chart-empty">
                    <ShieldCheck size={30} />
                    <strong>No risk data available</strong>
                    <span>Your risk distribution will appear here.</span>
                  </div>
                )}
              </article>

              <article className="dashboard-panel">
                <div className="panel-heading">
                  <div className="panel-heading-icon">
                    <Percent size={19} />
                  </div>

                  <div>
                    <h2>Transaction Distribution</h2>
                    <p>Legitimate versus flagged transactions</p>
                  </div>
                </div>

                {transactionDistribution.length > 0 ? (
                  <div className="activity-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={transactionDistribution}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={95}
                          paddingAngle={4}
                        >
                          {transactionDistribution.map((item) => (
                            <Cell key={item.name} fill={item.color} />
                          ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="dashboard-chart-empty">
                    <Percent size={30} />
                    <strong>No distribution data yet</strong>
                    <span>Your transaction breakdown will appear here.</span>
                  </div>
                )}
              </article>

              <article className="dashboard-panel">
                <div className="panel-heading">
                  <div className="panel-heading-icon">
                    <TrendingUp size={19} />
                  </div>

                  <div>
                    <h2>Daily Transaction Volume</h2>
                    <p>Number of analysed transactions per day</p>
                  </div>
                </div>

                {totalTransactions > 0 ? (
                  <div className="activity-chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis dataKey="day" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Bar
                          dataKey="legitimate"
                          stackId="a"
                          fill="#477653"
                          name="Legitimate"
                        />

                        <Bar
                          dataKey="flagged"
                          stackId="a"
                          fill="#9F263B"
                          name="Flagged"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="dashboard-chart-empty">
                    <TrendingUp size={30} />
                    <strong>Waiting for transactions</strong>
                    <span>Volume analytics will appear here.</span>
                  </div>
                )}
              </article>
            </section>

            <section id="analyze" className="dashboard-panel analyze-panel" style={{ marginTop: '24px', marginBottom: '24px' }}>
              <div className="panel-heading">
                <div className="panel-heading-icon">
                  <ShieldAlert size={19} />
                </div>

                <div>
                  <h2>Analyze a transaction</h2>
                  <p>ML-powered financial risk assessment</p>
                </div>
              </div>

              <form onSubmit={analyze} className="analysis-form">
                <label>
                  <span>Transaction amount</span>

                  <div className="analysis-input-wrapper">
                    <span className="currency-symbol">₹</span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter transaction amount"
                    />
                  </div>
                </label>

                <label>
                  <span>Transaction type</span>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
                  className="analyze-button"
                >
                  <Search size={18} />
                  {loading
                    ? 'Analyzing transaction...'
                    : 'Analyze transaction'}
                </button>

                <button
                  type="button"
                  className="clear-analysis-button"
                  onClick={clearAnalysis}
                  disabled={loading}
                >
                  Clear / Reset
                </button>
              </form>

              {message && (
                <div role="status" className="analysis-message">
                  {message}
                </div>
              )}

              {result && (
                <div
                  className={`analysis-result ${
                    isFraud ? 'result-danger' : 'result-safe'
                  }`}
                >
                  <div className="analysis-result-heading">
                    {isFraud ? (
                      <XCircle size={22} />
                    ) : (
                      <CheckCircle size={22} />
                    )}

                    <div>
                      <span>MODEL PREDICTION</span>
                      <h3>{result.prediction}</h3>
                    </div>
                  </div>

                  <div className="analysis-result-grid">
                    <div>
                      <span>Fraud probability</span>
                      <strong>
                        {(Number(result.fraud_probability) * 100).toFixed(1)}%
                      </strong>
                    </div>

                    <div>
                      <span>Risk classification</span>
                      <strong>{result.risk_level}</strong>
                    </div>
                  </div>

                  <p>
                    Experimental prediction from a model trained on
                    synthetic data. It is not proof of fraud.
                  </p>
                </div>
              )}
            </section>

            <section id="transactions" className="dashboard-transactions">
              <TransactionTable history={safeHistory} />
            </section>
          </>
        )}

        <footer className="dashboard-footer">
          <span>FraudShield</span>
          <span>Machine Learning Financial Monitoring</span>
          <span>Educational prototype · Synthetic data</span>
        </footer>
      </main>
    </div>
  )
}