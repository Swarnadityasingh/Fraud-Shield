import { useEffect, useState, useRef } from 'react'
import { flushSync } from 'react-dom'
import {
  ShieldAlert,
  LogOut
} from 'lucide-react'

import SettingsPanel from './components/SettingsPanel'
import PlansModal from './components/PlansModal'
import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'
import DashboardHome from './pages/DashboardHome'

import './Dashboard.css'

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
  const safeHistory = Array.isArray(history) ? history : []
  const safeNotifications = Array.isArray(notifications) ? notifications : []

  const totalTransactions = safeHistory.length

  const flaggedTransactions = safeHistory.filter(
    (item) => item.prediction === 'Fraudulent'
  ).length

  const legitimateTransactions = totalTransactions - flaggedTransactions

  const highRiskCases = safeHistory.filter(
    (item) => item.risk_level === 'High'
  ).length

  const userName = settings.profileName?.split(' ')[0] || 'there'
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
      ? 72
      : 240
  )
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    window.localStorage.getItem('fraudshield-sidebar-collapsed') === 'true'
  )
  const sidebarRef = useRef(null)
  const expandedSidebarWidthRef = useRef(240)

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
        next ? 72 : Math.max(240, expandedSidebarWidthRef.current)
      )
      return next
    })
  }

  function handleSidebarDoubleClick(event) {
    if (event.target.closest('button')) return
    toggleSidebar()
  }

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

      <dialog
        ref={logoutDialogRef}
        className="logout-confirm-dialog"
        aria-labelledby="logout-confirm-title"
        aria-describedby="logout-confirm-description"
        onClick={event => { if (event.target === event.currentTarget) logoutDialogRef.current.close() }}
      >
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

      <Sidebar
        activePage={activePage}
        userName={userName}
        sidebarCollapsed={sidebarCollapsed}
        sidebarWidth={sidebarWidth}
        sidebarRef={sidebarRef}
        onNavigate={navigateTo}
        onDoubleClick={handleSidebarDoubleClick}
        onOpenPlans={() => setPlansOpen(true)}
        onLogoutRequest={() => logoutDialogRef.current.showModal()}
        onShowMessage={setThemeToast}
        onToggleSidebar={toggleSidebar}
      />

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

        <DashboardHeader
          activePage={activePage}
          settings={settings}
          onToggleTheme={toggleDashboardTheme}
          notificationsEnabled={notificationsEnabled}
          notificationsOpen={notificationsOpen}
          setNotificationsOpen={setNotificationsOpen}
          notificationWrapperRef={notificationWrapperRef}
          notifications={safeNotifications}
          onMarkNotificationRead={markNotificationRead}
          onMarkAllNotificationsRead={markAllNotificationsRead}
          themeToast={themeToast}
          themeToastPhase={themeToastPhase}
        />

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
          <DashboardHome
            userName={userName}
            totalTransactions={totalTransactions}
            legitimateTransactions={legitimateTransactions}
            flaggedTransactions={flaggedTransactions}
            highRiskCases={highRiskCases}
            notifications={safeNotifications}
            history={safeHistory}
            onNavigate={navigateTo}
          />
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