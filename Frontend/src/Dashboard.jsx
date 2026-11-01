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

import StatCard from './components/StatCard'
import TransactionTable from './components/TransactionTable'
import SettingsPanel from './components/SettingsPanel'

import './Dashboard.css'

const chartData = [
  { day: 'Mon', legitimate: 210, flagged: 18 },
  { day: 'Tue', legitimate: 260, flagged: 24 },
  { day: 'Wed', legitimate: 225, flagged: 15 },
  { day: 'Thu', legitimate: 290, flagged: 31 },
  { day: 'Fri', legitimate: 245, flagged: 22 },
  { day: 'Sat', legitimate: 180, flagged: 12 },
  { day: 'Sun', legitimate: 205, flagged: 19 },
]

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
  history,
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
  welcomeVisible,
  onWelcomeDismiss,
  onLogout,
}) {
  const isFraud = result?.prediction === 'Fraudulent'

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

                {notifications.some((item) => !item.read) && (
                  <span className="notification-indicator" />
                )}
              </button>

              {notificationsOpen && (
                <div className="notification-panel">
                  <div className="notification-panel-header">
                    <div>
                      <h3>Notifications</h3>
                      <p>
                        {notifications.filter((item) => !item.read).length} unread
                      </p>
                    </div>

                    <button type="button" onClick={markAllNotificationsRead}>
                      Mark all read
                    </button>
                  </div>

                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <Bell size={22} />
                      <strong>You're all caught up</strong>
                      <span>Fraud and risk alerts will appear here.</span>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {notifications.map((item) => (
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
            <section id="overview" className="dashboard-stats-grid">
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

            <p className="dashboard-data-note">
              <span className="data-note-indicator" />
              Dashboard cards and chart use illustrative sample data.
            </p>

            <section className="dashboard-content-grid">
              <article className="dashboard-panel activity-panel">
                <div className="panel-heading">
                  <div className="panel-heading-icon">
                    <Activity size={19} />
                  </div>

                  <div>
                    <h2>Transaction activity</h2>
                    <p>Last 7 days · sample data</p>
                  </div>
                </div>

                <div className="activity-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={5}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="var(--dashboard-chart-grid)"
                      />

                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        stroke="var(--dashboard-muted)"
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="var(--dashboard-muted)"
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        contentStyle={{
                          background: 'var(--dashboard-surface)',
                          border: '1px solid var(--dashboard-border)',
                          borderRadius: '12px',
                          color: 'var(--dashboard-text)',
                        }}
                      />

                      <Bar
                        dataKey="legitimate"
                        name="Legitimate"
                        fill="var(--dashboard-chart-primary)"
                        radius={[5, 5, 0, 0]}
                      />

                      <Bar
                        dataKey="flagged"
                        name="Flagged"
                        fill="var(--dashboard-chart-secondary)"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-legend">
                  <span>
                    <i className="legend-legitimate" />
                    Legitimate
                  </span>

                  <span>
                    <i className="legend-flagged" />
                    Flagged
                  </span>
                </div>
              </article>

              <article id="analyze" className="dashboard-panel analyze-panel">
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
              </article>
            </section>

            <section id="transactions" className="dashboard-transactions">
              <TransactionTable history={history} />
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