import { useEffect, useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import {
  Activity,
  AlertTriangle,
  Bell,
  BellOff,
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
  FileDown,
  TrendingUp,
  ShieldCheck,
  Clock3,
  LayoutGrid,
  ChartColumn,
  FileChartColumn,
  Folder,
  Crown,
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
import PlansModal from './components/PlansModal'

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
  accessToken,
  currentUser,
  onCurrentUserChange,
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
      color: '#D9DADC',
    },
    {
      name: 'Medium',
      value: safeHistory.filter((item) => item.risk_level === 'Medium').length,
      color: '#FFC93C',
    },
    {
      name: 'High',
      value: highRiskCases,
      color: '#2B2D31',
    },
  ].filter((item) => item.value > 0)

  const transactionDistribution = [
    { name: 'Legitimate', value: legitimateTransactions, color: '#D9DADC' },
    { name: 'Flagged', value: flaggedTransactions, color: '#FFC93C' },
  ].filter((item) => item.value > 0)

  const userName =
    settings.profileName?.split(' ')[0] || 'there'
  const notificationsEnabled = settings.notifyHighRisk || settings.notifyFraud
  const accountCreatedAt = currentUser?.created_at
    ? new Date(currentUser.created_at)
    : null
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const isEstablishedUser = Boolean(
    accountCreatedAt &&
    !Number.isNaN(accountCreatedAt.getTime()) &&
    accountCreatedAt <= oneMonthAgo
  )

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [themeToast, setThemeToast] = useState('')
  const [themeToastPhase, setThemeToastPhase] = useState('hidden')
  const themeInitialized = useRef(false)
  const notificationWrapperRef = useRef(null)
  const [sidebarWidth, setSidebarWidth] = useState(() =>
    window.localStorage.getItem('fraudshield-sidebar-collapsed') === 'true'
      ? 76
      : 200
  )
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    window.localStorage.getItem('fraudshield-sidebar-collapsed') === 'true'
  )
  const sidebarRef = useRef(null)
  const expandedSidebarWidthRef = useRef(200)

  useEffect(() => {
    window.localStorage.setItem(
      'fraudshield-sidebar-collapsed',
      String(sidebarCollapsed)
    )
  }, [sidebarCollapsed])

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
  }, [settings.theme])

  useEffect(() => {
    if (!themeToast) {
      setThemeToastPhase('hidden')
      return
    }

    setThemeToastPhase('visible')

    const exitTimer = setTimeout(() => {
      setThemeToastPhase('exiting')
    }, 1900)

    const dismissTimer = setTimeout(() => {
      setThemeToast('')
      setThemeToastPhase('hidden')
    }, 2450)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(dismissTimer)
    }
  }, [themeToast])

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current

      setSidebarWidth(
        next ? 76 : Math.max(220, expandedSidebarWidthRef.current)
      )

      return next
    })
  }

  function handleSidebarDoubleClick(event) {
    if (event.target.closest('button')) return
    toggleSidebar()
  }

  const pageButtonClass = (page) =>
    `dashboard-nav-item ${
      activePage === page ? 'active' : ''
    }`

  function navigateTo(page, sectionId) {
    setActivePage(page)

    if (page === 'Dashboard' || page === 'Settings') {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        })
      })
      return
    }

    if (sectionId) {
      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }

  const themeTransitionRef = useRef(false)
  const logoutDialogRef = useRef(null)
  const [plansOpen, setPlansOpen] = useState(false)
  const currentPlan = 'free'

  function handlePlanRequest(plan) {
    setPlansOpen(false)
    setThemeToast(
      plan === 'enterprise'
        ? 'Enterprise enquiries are not connected yet.'
        : plan === 'pro'
          ? 'Pro subscriptions are coming soon.'
          : 'Subscription management is not connected yet.'
    )
  }

  async function toggleDashboardTheme(event) {
    if (themeTransitionRef.current) return
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark'
    const applyTheme = () => {
      flushSync(() => setSettings(previous => ({ ...previous, theme: nextTheme })))
      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    }
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyTheme()
      return
    }
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = bounds.left + bounds.width / 2
    const y = bounds.top + bounds.height / 2
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    themeTransitionRef.current = true
    document.documentElement.classList.add('dashboard-theme-reveal')
    try {
      const transition = document.startViewTransition(applyTheme)
      await transition.ready
      await document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
      ).finished
      await transition.finished
    } catch {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    } finally {
      document.documentElement.classList.remove('dashboard-theme-reveal')
      themeTransitionRef.current = false
    }
  }

  return (
    <div
      className={`dashboard-layout dashboard-enter ${
        sidebarCollapsed ? 'dashboard-sidebar-is-collapsed' : ''
      }`}
      style={{ '--dashboard-sidebar-width': `${sidebarWidth}px` }}
    >
      <PlansModal
        open={plansOpen}
        onClose={() => setPlansOpen(false)}
        currentPlan={currentPlan}
        onUpgrade={handlePlanRequest}
      />
      <dialog ref={logoutDialogRef} className="logout-confirm-dialog" aria-labelledby="logout-confirm-title" aria-describedby="logout-confirm-description" onClick={event => { if (event.target === event.currentTarget) logoutDialogRef.current.close() }}>
        <div className="logout-confirm-content">
          <div className="logout-confirm-icon"><LogOut size={24} aria-hidden="true" /></div>
          <h2 id="logout-confirm-title">Log out of FraudShield?</h2>
          <p id="logout-confirm-description">You’ll need to sign in again to access your workspace.</p>
          <div className="logout-confirm-actions">
            <button type="button" className="logout-confirm-cancel" autoFocus onClick={() => logoutDialogRef.current.close()}>Cancel</button>
            <button type="button" className="logout-confirm-submit" onClick={() => { logoutDialogRef.current.close(); onLogout() }}>Log out</button>
          </div>
        </div>
      </dialog>
      <button
        type="button"
        className="dashboard-sidebar-resizer"
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        onClick={toggleSidebar}
      />
      <aside
        ref={sidebarRef}
        className={`dashboard-sidebar ${
          sidebarCollapsed ? 'dashboard-sidebar-collapsed' : ''
        }`}
        style={{ '--dashboard-sidebar-width': `${sidebarWidth}px` }}
        onDoubleClick={handleSidebarDoubleClick}
      >
        <div className="dashboard-brand">
          <div className="dashboard-brand-copy">
            <h2>FraudShield</h2>
            <p>Financial risk intelligence</p>
          </div>
          <span className="dashboard-brand-short" aria-hidden="true">FS</span>
        </div>

        <nav className="dashboard-navigation">
          <button
            type="button"
            data-label="Dashboard"
            onClick={() => navigateTo('Dashboard')}
            className={pageButtonClass('Dashboard')}
          >
            <LayoutGrid size={17} />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            data-label="Dashboard"
            onClick={() => navigateTo('Analytics', 'analytics')}
            className={pageButtonClass('Analytics')}
          >
            <ChartColumn size={17} />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            data-label="Dashboard"
            onClick={() => navigateTo('Reports', 'transactions')}
            className={pageButtonClass('Reports')}
          >
            <FileChartColumn size={17} />
            <span>Reports</span>
          </button>

          <button
            type="button"
            onClick={() => setThemeToast('File management is not available yet.')}
            title="File management coming soon"
            className={pageButtonClass('Files')}
          >
            <Folder size={17} />
            <span>Files</span>
          </button>

          <button
            type="button"
            data-label="Dashboard"
            onClick={() => navigateTo('Settings', 'settings')}
            className={pageButtonClass('Settings')}
          >
            <SettingsIcon size={19} />
            <span>Settings</span>
          </button>

          <button
            type="button"
            className="dashboard-nav-item sidebar-nav-logout"
            onClick={() => logoutDialogRef.current.showModal()}
            title="Logout"
            aria-label="Logout from FraudShield"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="sidebar-account-footer">
          <div className="sidebar-upgrade-card">
            <span>Running on Free Tier</span>
            <button type="button" onClick={() => setPlansOpen(true)} aria-label="Upgrade plan" title="Upgrade plan">
              <Crown size={16} aria-hidden="true" />
              <span>Upgrade Plan</span>
            </button>
          </div>
          <button className="sidebar-user-profile" type="button" onClick={() => navigateTo('Settings', 'settings')} aria-label="Open account settings">
            <span className="sidebar-user-avatar" aria-hidden="true">{userName.trim().slice(0, 1).toUpperCase()}</span>
            <span className="sidebar-user-details">
              <strong>{userName}</strong>
              <small>Personal workspace</small>
            </span>
          </button>
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
              <strong>
                {isEstablishedUser
                  ? 'Welcome back to FraudShield!'
                  : 'Welcome to FraudShield!'}
              </strong>
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
              className={`theme-toggle-button ${settings.theme === 'dark' ? 'is-dark' : ''}`}
              onClick={toggleDashboardTheme}
              aria-label={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={settings.theme === 'dark'}
              title={settings.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="theme-toggle-thumb" aria-hidden="true" />
              <Sun className="theme-toggle-sun" size={16} aria-hidden="true" />
              <Moon className="theme-toggle-moon" size={16} aria-hidden="true" />
            </button>

            <div ref={notificationWrapperRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className={`notification-button ${notificationsEnabled ? '' : 'is-disabled'}`}
                aria-label={notificationsEnabled ? 'Notifications' : 'Notifications disabled'}
                aria-expanded={notificationsOpen}
                title={notificationsEnabled ? 'Notifications' : 'Notifications are disabled in Settings'}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                {notificationsEnabled ? (
                  <Bell size={17} aria-hidden="true" />
                ) : (
                  <BellOff size={17} aria-hidden="true" />
                )}

                {notificationsEnabled && safeNotifications.some((item) => !item.read) && (
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

            {themeToast && (
              <div
                key={themeToast}
                className={`theme-toast theme-toast-${themeToastPhase}`}
                role="status"
              >
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
              currentUser={currentUser}
              accessToken={accessToken}
              onCurrentUserChange={onCurrentUserChange}
              modelStatus={modelStatus}
              onRefreshModel={refreshModelStatus}
            />
          </section>
        ) : (
          <>
            <div className="reference-dashboard-grid">
            <section className="dashboard-welcome">
              <div>
                <span className="dashboard-eyebrow">
                  EXECUTIVE OVERVIEW
                </span>

                <h1>Welcome back, {userName}.</h1>

                <p>
                  You’ve analysed <strong className="overview-summary-count">{totalTransactions.toLocaleString('en-IN')}</strong> transactions in your workspace.
                </p>
              </div>

              <div className="overview-header-actions">
                <button type="button" className="overview-export" onClick={() => window.print()}>
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
                {safeNotifications.length === 0 && <p>No activity yet.</p>}
                {safeNotifications.slice(0, 5).map((item, index) => (
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
                color="amber"
              />

              <StatCard
                title="High Risk Cases"
                value={highRiskCases.toLocaleString('en-IN')}
                icon={AlertTriangle}
                color="red"
              />
            </section>

            <section id="analytics" className="dashboard-analytics">
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
                      <BarChart data={activityData} barGap={6} barCategoryGap="22%">
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="var(--dashboard-chart-grid)"
                        />

                        <XAxis dataKey="day" />

                        <YAxis allowDecimals={false} />

                        <Tooltip />

                        <Legend />

                        <Bar
                          dataKey="legitimate"
                          name="Legitimate"
                          fill="#7DD3FC"
                          maxBarSize={36}
                          radius={[5, 5, 0, 0]}
                        />

                        <Bar
                          dataKey="flagged"
                          name="Flagged"
                          fill="#4F46E5"
                          maxBarSize={36}
                          radius={[5, 5, 0, 0]}
                        />
                      </BarChart>
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

              <section id="analyze" className="dashboard-panel analyze-panel">
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

              <article className="smart-insights-card">
                <span>NEW INSIGHTS</span>
                <h2>Identify high-risk transactions</h2>
                <p>{totalTransactions > 0
                  ? `${flaggedTransactions} of ${totalTransactions} analysed transactions were flagged. Review their risk scores before taking action.`
                  : 'Analyse a transaction to uncover risk signals and review the model’s assessment.'}</p>
                <button type="button" onClick={() => navigateTo('Analyze', 'analyze')}>View Smart Analysis</button>
              </article>

              <section id="transactions" className="dashboard-transactions overview-transactions">
                <div className="transactions-section-heading">
                  <div><h2>Recent Transactions</h2><p>Your analysed transaction history</p></div>
                </div>
                <TransactionTable history={safeHistory} />
              </section>

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

              <article className="dashboard-panel daily-volume-panel">
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
                          fill="#D9DADC"
                          name="Legitimate"
                        />

                        <Bar
                          dataKey="flagged"
                          stackId="a"
                          fill="#FFC93C"
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
            </div>

          </>
        )}

        <footer className="dashboard-footer">
          <span>FraudShield</span>
          <span>Machine Learning Financial Monitoring</span>
          <span>Educational prototype · Synthetic data</span>
        </footer>
      </main>
      <aside className="insights-rail">
        <span className="dashboard-eyebrow">PERSONAL OVERVIEW</span>
        <h2>Your insights</h2>
        <p>Financial risk at a glance.</p>
        <div className="rail-summary"><span>TRANSACTIONS ANALYSED</span><strong>{totalTransactions.toLocaleString('en-IN')}</strong></div>
        <div className="rail-metrics"><div><span>Legitimate</span><strong>{legitimateTransactions}</strong></div><div><span>Flagged</span><strong>{flaggedTransactions}</strong></div></div>
        <div className="rail-highlight"><span>HIGH RISK CASES</span><strong>{highRiskCases}</strong></div>
        <h3>Transaction trends</h3>
        <div className="rail-chart"><ResponsiveContainer width="100%" height={150}><BarChart data={activityData}><Bar dataKey="legitimate" fill="#dcd9ff" radius={[3,3,0,0]} /><Bar dataKey="flagged" fill="#635bff" radius={[3,3,0,0]} /></BarChart></ResponsiveContainer></div>
        <h3>Recent activity</h3>
        {safeNotifications.length === 0 ? <p>No activity yet.</p> : safeNotifications.slice(0,5).map(item => <div className="rail-event" key={item.id}><strong>{item.title}</strong><p>{item.description}</p></div>)}
      </aside>
    </div>
  )
}
