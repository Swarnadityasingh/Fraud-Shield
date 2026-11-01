import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  Sun,
  Moon,
  Banknote,
  AlertTriangle,
} from 'lucide-react'
import './Login.css'

export default function Login({ onLogin, theme, onThemeChange }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [status, setStatus] = useState('idle')

  function toggleTheme() {
    onThemeChange(theme === 'dark' ? 'light' : 'dark')
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setStatus('error')
      return
    }

    setStatus('unavailable')
  }

  function handleDemoAccess() {
    if (status === 'processing') return

    setStatus('processing')

    setTimeout(() => {
      setStatus('success')

      setTimeout(() => {
        onLogin?.()
      }, 3000)
    }, 1200)
  }

  function fillDemoCredentials() {
    setEmail('admin@fraudshield.io')
    setPassword('demo-only')
    setStatus('idle')
  }

  useEffect(() => {
    function handleKeyboardShortcut(e) {
      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase() === 'd'
      ) {
        e.preventDefault()

        if (!['processing', 'success'].includes(status)) {
          handleDemoAccess()
        }
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcut)

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcut)
    }
  }, [status])

  return (
    <main className="login-page" data-theme={theme}>
      <section className="login-visual">
        <div className="login-brand">
          <div className="brand-icon">
            <ShieldCheck size={25} />
          </div>
          <span>FraudShield</span>
        </div>

        <div className="visual-content">
          <p className="visual-eyebrow">FINANCIAL INTELLIGENCE PLATFORM</p>

          <h1>
            Trust every transaction.
            <span> Detect every risk.</span>
          </h1>

          <p className="visual-description">
            Intelligent financial monitoring powered by machine learning and
            risk intelligence.
          </p>

          <div className="security-visual">
            <div className="security-glow" />
            <div className="security-shield">
              <ShieldCheck size={76} strokeWidth={1.3} />
            </div>
            <div className="floating-coin coin-one">₹</div>
            <div className="floating-coin coin-two">₹</div>
            <div className="floating-coin coin-three">₹</div>
          </div>
        </div>

        <div className="visual-footer">
          <span>FRAUD DETECTION</span>
          <span>RISK INTELLIGENCE</span>
          <span>SECURE MONITORING</span>
        </div>
      </section>

      <section className="login-form-section">
        {status === 'success' && (
          <div className="atm-cash-slot" role="status" aria-live="polite">
            <div className="atm-machine-label">
              <ShieldCheck size={15} />
              FRAUDSHIELD SECURE ATM
            </div>

            <div className="slot-opening">
              <div className="cash-stack">
                {[0, 1, 2].map((note) => (
                  <div className={`cash-note cash-note-${note + 1}`} key={note}>
                    <div
                      style={{
                        display: 'flex',
                        justify: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span className="note-symbol">₹</span>
                      <Banknote size={16} strokeWidth={2.5} />
                    </div>
                    <span className="note-label">INDIA</span>
                    <span className="note-value">₹ 500</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="atm-receipt-success">
              <div className="success-receipt-header">
                <ShieldCheck size={18} />
                <strong>TRANSACTION APPROVED</strong>
              </div>

              <div className="success-receipt-body">
                <p>FRAUDSHIELD DEMO ACCESS</p>
                <strong>SESSION VERIFIED</strong>
                <span>ACCESS GRANTED</span>
              </div>

              <div className="receipt-footer">
                SECURE FINANCIAL MONITORING
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Moon size={19} /> : <Sun size={19} />}
          <span>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>
        </button>

        <div className="login-form-container">
          <div className="mobile-brand">
            <ShieldCheck size={27} />
            <span>FraudShield</span>
          </div>

          <div className="form-heading">
            <p>SECURE ACCESS</p>
            <h2>Welcome back</h2>
            <span>Sign in to access your monitoring workspace.</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <div className="login-input">
              <Mail size={18} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (['error', 'unavailable'].includes(status)) setStatus('idle')
                }}
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="login-input">
              <LockKeyhole size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (['error', 'unavailable'].includes(status)) setStatus('idle')
                }}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button
                type="button"
                className="demo-fill-button"
                onClick={fillDemoCredentials}
              >
                Fill Demo Details
              </button>

              <span className="forgot-password">Forgot password?</span>
            </div>

            {['error', 'unavailable'].includes(status) && (
              <div className="atm-receipt-error" aria-live="polite">
                <div className="receipt-header">
                  <AlertTriangle size={16} />
                  <span>
                    {status === 'error'
                      ? 'TRANSACTION FAILED'
                      : 'AUTHENTICATION UNAVAILABLE'}
                  </span>
                </div>

                <div className="receipt-body">
                  {status === 'error'
                    ? 'Please enter your email and password.'
                    : 'Login service is not connected yet. Please use Demo Workspace.'}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={status === 'processing' || status === 'success'}
            >
              {status === 'processing'
                ? 'Processing Transaction...'
                : status === 'success'
                ? 'Session Verified!'
                : 'Sign in'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="login-divider">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="demo-access"
            onClick={handleDemoAccess}
            disabled={status === 'processing' || status === 'success'}
          >
            Enter Demo Workspace
            <ArrowRight size={17} />
          </button>

          <p className="login-disclaimer">
            Educational demonstration prototype · Synthetic financial data
          </p>
        </div>
      </section>
    </main>
  )
}