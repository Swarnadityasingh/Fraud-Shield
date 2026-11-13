import { useEffect, useState, useCallback, useRef } from 'react'

import Login from './components/Login'
import Dashboard from './Dashboard'
import LandingPage from './components/LandingPage'
import LandingPageIntro from './components/LandingPageIntro'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import VerifyEmail from './components/VerifyEmail'

import {
  predictTransaction,
  getModelStatus,
} from './services/api'

const DEFAULT_SETTINGS = {
  profileName: 'FraudShield Admin',
  email: 'admin@example.com',
  theme: 'light',
  notifyHighRisk: true,
  notifyFraud: true,
  mediumThreshold: 30,
  highThreshold: 70,
  soundEnabled: false,
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

  const [showIntro, setShowIntro] = useState(() => {
  return !sessionStorage.getItem('fraudshield-intro-seen')
})

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const sessionRestoreStarted = useRef(false)

  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname
  )

  const [welcomeVisible, setWelcomeVisible] = useState(false)

  const [amount, setAmount] = useState('')
  const [type, setType] = useState('TRANSFER')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState([])
  const [notifications, setNotifications] = useState([])

  const [activePage, setActivePage] = useState('Dashboard')
  const [settings, setSettings] = useState(loadSettings)

  const [modelStatus, setModelStatus] = useState({
    loading: false,
    online: false,
    modelConnected: false,
    error: '',
  })

  useEffect(() => {
    function handlePopState() {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  function navigate(path, replace = false) {
    if (replace) {
      window.history.replaceState({}, '', path)
    } else {
      window.history.pushState({}, '', path)
    }

    setCurrentPath(path)
  }

  function handleLogin(authData) {
    if (!authData?.access_token || !authData?.user) {
      return
    }

    setAccessToken(authData.access_token)
    setCurrentUser(authData.user)
    setIsAuthenticated(true)
    setWelcomeVisible(true)

    setSettings((previous) => ({
      ...previous,
      profileName: authData.user.full_name,
      email: authData.user.email,
    }))

    navigate('/dashboard')
  }

  useEffect(() => {
    if (sessionRestoreStarted.current) return

    sessionRestoreStarted.current = true

    async function restoreSession() {
      try {

        const refreshResponse = await fetch(
          'http://localhost:8000/auth/refresh',
          {
            method: 'POST',
            credentials: 'include',
          }
        )

        if (!refreshResponse.ok) {
          return
        }

        const refreshData = await refreshResponse.json()

        if (!refreshData.access_token) {
          return
        }

        const userResponse = await fetch(
          'http://localhost:8000/auth/me',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${refreshData.access_token}`,
            },
          }
        )

        if (!userResponse.ok) {
          return
        }

        const user = await userResponse.json()

        setAccessToken(refreshData.access_token)
        setCurrentUser(user)
        setIsAuthenticated(true)

        setSettings((previous) => ({
          ...previous,
          profileName: user.full_name,
          email: user.email,
        }))

      } catch (error) {
        console.error('Session restoration failed:', error)
      } finally {
        setAuthLoading(false)
      }
    }

    restoreSession()
  }, [])

  async function handleLogout() {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Backend logout failed:', error)
    } finally {
      setIsAuthenticated(false)
      setAccessToken(null)
      setCurrentUser(null)
      setWelcomeVisible(false)

      setAmount('')
      setType('TRANSFER')
      setResult(null)
      setMessage('')
      setHistory([])
      setNotifications([])

      navigate('/login', true)
    }
  }

  function handleIntroComplete() {
  sessionStorage.setItem('fraudshield-intro-seen', 'true')
  setShowIntro(false)
}

  useEffect(() => {
    if (
      !authLoading &&
      currentPath === '/dashboard' &&
      !isAuthenticated
    ) {
      navigate('/login', true)
    }
  }, [currentPath, isAuthenticated, authLoading])

  useEffect(() => {
    const activeTheme = currentPath === '/' ? 'dark' : settings.theme

    document.documentElement.classList.toggle(
      'dark',
      activeTheme === 'dark'
    )
    document.documentElement.style.colorScheme = activeTheme
  }, [currentPath, settings.theme])

  useEffect(() => {
    const medium = Number(settings.mediumThreshold)
    const high = Number(settings.highThreshold)

    const valid =
      Number.isFinite(medium) &&
      Number.isFinite(high) &&
      medium >= 1 &&
      high <= 100 &&
      medium < high

    if (!valid) return

    try {
      localStorage.setItem(
        'fraudshield-settings',
        JSON.stringify(settings)
      )
    } catch {

    }
  }, [settings])

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

  function addNotification(notification) {
    setNotifications((previous) => [
      {
        id: `NTF-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
        ...notification,
      },
      ...previous,
    ])
  }

  function clearAnalysis() {
    setAmount('')
    setType('TRANSFER')
    setResult(null)
    setMessage('')
  }

  async function analyze(e) {
    e.preventDefault()

    if (loading) return

    const submittedAmount = Number(amount)
    if (!Number.isFinite(submittedAmount) || submittedAmount <= 0) {
      setMessage('Enter a valid transaction amount.')
      return
    }

    setLoading(true)
    setMessage('')
    setResult(null)

    try {
      const data = await predictTransaction({
        amount: submittedAmount,
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

      const transactionId = `FS-${Date.now().toString().slice(-8)}`

      const updatedResult = {
        ...data,
        transaction_id: transactionId,
        amount: submittedAmount,
        transaction_type: type,
        fraud_probability: probability,
        risk_level: risk,
        created_at: new Date().toISOString(),
      }

      setResult(updatedResult)
      setHistory((previous) => [updatedResult, ...previous])

      const isFraud = data.prediction === 'Fraudulent'
      const shouldAlert =
        (risk === 'High' && settings.notifyHighRisk) ||
        (isFraud && settings.notifyFraud)

      if (shouldAlert) {
        addNotification({
          title: isFraud ? 'Potential fraud detected' : 'High-risk transaction',
          description: `${transactionId} · ₹${submittedAmount.toLocaleString('en-IN')} · ${risk} risk`,
          severity: isFraud ? 'danger' : 'warning',
          transactionId,
        })
      }

      setMessage(
        shouldAlert
          ? `Alert: ${data.prediction} transaction detected.`
          : 'Transaction analysis completed.'
      )
    } catch (error) {
      setMessage(error.message || 'Could not connect to the backend.')
    } finally {
      setLoading(false)
    }
  }

  function markNotificationRead(id) {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    )
  }

  function markAllNotificationsRead() {
    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    )
  }

  const dismissWelcome = useCallback(() => {
    setWelcomeVisible(false)
  }, [])

  if (authLoading && currentPath !== '/') {
    return (
      <div className="auth-loading">
        Restoring secure session...
      </div>
    )
  }

  if (currentPath === '/') {
    if (showIntro) {
      return <LandingPageIntro onComplete={handleIntroComplete} />
    }

    return <LandingPage />
  }

  if (currentPath === '/verify-email') {
    return (
      <VerifyEmail
        onNavigateLogin={() => navigate('/login', true)}
      />
    )
  }

  if (currentPath === '/forgot-password') {
    return (
      <ForgotPassword
        theme={settings.theme}
        onThemeChange={(theme) =>
          setSettings((previous) => ({ ...previous, theme }))
        }
        onNavigateLogin={() => navigate('/login')}
      />
    )
  }

  if (currentPath.startsWith('/reset-password')) {
    const queryParams = new URLSearchParams(window.location.search)
    const token = queryParams.get('token') || ''

    return (
      <ResetPassword
        theme={settings.theme}
        token={token}
        onNavigateLogin={() => navigate('/login')}
      />
    )
  }

  if (!isAuthenticated || currentPath !== '/dashboard') {
    return (
      <Login
        theme={settings.theme}
        onThemeChange={(theme) =>
          setSettings((previous) => ({
            ...previous,
            theme,
          }))
        }
        onLogin={handleLogin}
        onNavigateForgot={() => navigate('/forgot-password')}
      />
    )
  }

  return (
    <Dashboard
      accessToken={accessToken}
      currentUser={currentUser}
      onCurrentUserChange={setCurrentUser}
      activePage={activePage}
      setActivePage={setActivePage}
      settings={settings}
      setSettings={setSettings}
      modelStatus={modelStatus}
      refreshModelStatus={refreshModelStatus}
      amount={amount}
      setAmount={setAmount}
      type={type}
      setType={setType}
      analyze={analyze}
      clearAnalysis={clearAnalysis}
      loading={loading}
      message={message}
      result={result}
      history={history}
      notifications={notifications}
      markNotificationRead={markNotificationRead}
      markAllNotificationsRead={markAllNotificationsRead}
      welcomeVisible={welcomeVisible}
      onWelcomeDismiss={dismissWelcome}
      onLogout={handleLogout}
    />
  )
}
