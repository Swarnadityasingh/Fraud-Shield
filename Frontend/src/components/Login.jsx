import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import AccessTicket from './AccessTicket'
import { FraudInvestigationScene } from './LandingPage'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Ban,
  LoaderCircle,
  LockKeyhole,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Check,
} from 'lucide-react'
import './Login.css'
import ThemeToggle from './ThemeToggle'
import ForgotPassword from './ForgotPassword'

const PASSWORD_REQUIREMENTS = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8,
  },
  {
    label: 'One uppercase letter (A–Z)',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    label: 'One lowercase letter (a–z)',
    test: (password) => /[a-z]/.test(password),
  },
  {
    label: 'One number (0–9)',
    test: (password) => /[0-9]/.test(password),
  },
  {
    label: 'At least one special character',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
]

export default function Login({
  onLogin,
  theme,
  onThemeChange,
  onNavigateForgot
}) {
  const reduceMotion = false

  const [isFlipped, setIsFlipped] = useState(false)
  const [showForgot, setShowForgot] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [googleMessage, setGoogleMessage] = useState('')

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  const passedPasswordRequirements = PASSWORD_REQUIREMENTS.filter((requirement) =>
    requirement.test(regPassword)
  ).length
  const isRegPasswordStrong =
    passedPasswordRequirements === PASSWORD_REQUIREMENTS.length

  const [status, setStatus] = useState('idle')
  const [authError, setAuthError] = useState('')
  const [loginFailure, setLoginFailure] = useState(false)

  useEffect(() => {
    if (status !== 'error') return undefined

    const timer = window.setTimeout(() => {
      setStatus('idle')
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [status])

  const isLoginView = !isFlipped && !showForgot

  async function handleLoginSubmit(e) {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      setLoginFailure(true)
      setStatus('error')
      return
    }

    setLoginFailure(false)
    setStatus('processing')
    setAuthError('')

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed.')
      }

      if (!data.access_token || !data.user) {
        throw new Error('Invalid authentication response.')
      }

      setStatus('success')

      if (reduceMotion) {
        onLogin?.(data)
      } else {
        window.setTimeout(() => {
          onLogin?.(data)
        }, 3000)
      }

    } catch (error) {
      console.error('Login error:', error)
      setLoginFailure(true)
      setStatus('error')
      setAuthError(
        error.message || 'Could not verify your credentials.'
      )
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setStatus('error')
      setAuthError('Please fill all registration fields.')
      return
    }

    if (!isRegPasswordStrong) {
      setStatus('error')
      setAuthError(
        'Please meet all five password requirements before creating your account.'
      )
      return
    }

    setStatus('processing')
    setAuthError('')

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed.')
      }

      setAuthError(
        'Account created! Please check your email and verify your account before signing in.'
      )
      setStatus('verification-sent')

    } catch (error) {
      console.error('Registration error:', error)
      setStatus('unavailable')
      setAuthError(
        error.message || 'Could not connect to the authentication server.'
      )
    }
  }

  async function handleGoogleLogin(credentialResponse) {
    const credential = credentialResponse?.credential

    if (!credential) {
      setLoginFailure(true)
      setStatus('error')
      setGoogleMessage('Google did not provide an authentication credential.')
      setAuthError('Google authentication credential is missing.')
      return
    }

    setLoginFailure(false)
    setStatus('processing')
    setAuthError('')
    setGoogleMessage('')

    try {
      const response = await fetch('http://localhost:8000/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Google authentication failed.')
      }

      if (!data.access_token || !data.user) {
        throw new Error('Invalid authentication response from server.')
      }

      setStatus('success')

      if (reduceMotion) {
        onLogin?.(data)
      } else {
        window.setTimeout(() => {
          onLogin?.(data)
        }, 3000)
      }

    } catch (error) {
      console.error('Google login error:', error)
      setLoginFailure(true)
      setStatus('error')
      setAuthError(error.message || 'Google authentication was denied.')
      setGoogleMessage(error.message || 'Google authentication failed.')
    }
  }

  async function handleGoogleRegister(credentialResponse) {
    const credential = credentialResponse?.credential

    if (!credential) {
      setStatus('unavailable')
      setAuthError('Google did not provide an authentication credential.')
      return
    }

    setStatus('processing')
    setAuthError('')
    setGoogleMessage('')

    try {
      const response = await fetch(
        'http://localhost:8000/auth/google/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ credential }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Google registration failed.')
      }

      if (!data.requires_login || !data.user) {
        throw new Error('Invalid registration response from server.')
      }

      setIsFlipped(false)
      setStatus('idle')
      setLoginFailure(false)
      setGoogleMessage(
        'Account created successfully! Please continue with Google to sign in.'
      )

    } catch (error) {
      console.error('Google registration error:', error)
      setStatus('unavailable')
      setAuthError(
        error.message || 'Could not create your account.'
      )
    }
  }

  function handleCardPointerMove(event) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const card = event.currentTarget
    const bounds = card.getBoundingClientRect()
    const pointerX = (event.clientX - bounds.left) / bounds.width
    const pointerY = (event.clientY - bounds.top) / bounds.height
    const rotateX = (0.5 - pointerY) * 10
    const rotateY = (pointerX - 0.5) * 10

    card.style.setProperty('--card-rotate-x', `${rotateX}deg`)
    card.style.setProperty('--card-rotate-y', `${rotateY}deg`)
    card.style.setProperty('--card-pointer-x', `${pointerX * 100}%`)
    card.style.setProperty('--card-pointer-y', `${pointerY * 100}%`)
  }

  function handleCardPointerLeave(event) {
    const card = event.currentTarget

    card.style.setProperty('--card-rotate-x', '0deg')
    card.style.setProperty('--card-rotate-y', '0deg')
    card.style.setProperty('--card-pointer-x', '50%')
    card.style.setProperty('--card-pointer-y', '50%')
  }

  return (
    <main
      className={`login-page ${isFlipped ? 'register-layout' : ''}`}
      data-theme={theme}
    >
      <button
        type="button"
        className="continue-exploring-btn"
        onClick={() => {
          window.location.href = '/'
        }}
      >
        <ArrowLeft size={18} />
        <span>Continue Exploring</span>
      </button>

      <section className="login-visual">
        <div
          className="login-carousel-layer"
          aria-hidden="true"
          inert=""
        >
          <FraudInvestigationScene />
        </div>

        <div className="visual-content">
          <p className="visual-eyebrow">FINANCIAL INTELLIGENCE PLATFORM</p>

          <h1>
            Trust every transaction
            <span> Detect every risk.</span>
          </h1>

          <p className="visual-description">
            Intelligent financial monitoring powered by machine learning and
            risk intelligence.
          </p>

          <div className="login-ticket-wrapper"></div>
        </div>
      </section>

      <section className="login-form-section">
        {showForgot ? (
          <ForgotPassword
            theme={theme}
            onThemeChange={onThemeChange}
            onBackToLogin={() => setShowForgot(false)}
          />
        ) : (
          <div
            className="card-flip-perspective"
            onPointerMove={handleCardPointerMove}
            onPointerLeave={handleCardPointerLeave}
          >
            <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>

              <div className="login-form-container card-face card-front">
                <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
                <div className="atm-terminal-status" aria-hidden="true">
                  <span>
                    <i />
                    FS-ATM 024
                  </span>
                  <span>ENCRYPTED LINK</span>
                </div>

                <div className="mobile-brand">
                  <ShieldCheck size={35} aria-hidden="true" />
                  <span>FraudShield</span>
                </div>

                {(status === 'success' || status === 'error') && (
                  <motion.div
                    className={`success-ticket-overlay ${
                      status === 'success'
                        ? 'success-ticket-granted'
                        : 'success-ticket-denied'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.45,
                      ease: 'easeOut',
                    }}
                  >
                    <motion.div
                      className="success-ticket-shadow"
                      initial={
                        reduceMotion
                          ? false
                          : { opacity: 0, scale: 0.7 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: reduceMotion ? 0 : 1.1,
                        delay: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    />

                    <motion.div
                      className="success-ticket-sheet"
                      initial={
                        reduceMotion
                          ? false
                          : { y: '-115%', opacity: 0, rotateX: 10 }
                      }
                      animate={{ y: '0%', opacity: 1, rotateX: 0 }}
                      transition={{
                        y: {
                          duration: reduceMotion ? 0 : 1.55,
                          ease: [0.16, 1, 0.3, 1],
                        },
                        opacity: { duration: reduceMotion ? 0 : 0.25 },
                        rotateX: { duration: reduceMotion ? 0 : 1.2 },
                      }}
                    >
                      <div className="success-ticket-scale">
                        <AccessTicket
                          status={status === 'success' ? 'granted' : 'denied'}
                          name={email || 'FRAUDSHIELD USER'}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                <div className="form-heading">
                  <p>SECURE ACCESS</p>
                  <h2>Welcome back</h2>
                  <span>Sign in to access your monitoring workspace.</span>
                </div>

                {googleMessage && (
                  <div
                    role="status"
                    style={{
                      marginBottom: '16px',
                      padding: '12px 14px',
                      border: '1px solid #16a34a',
                      borderRadius: '10px',
                      color: '#16a34a',
                      fontSize: '13px',
                      lineHeight: 1.5,
                      textAlign: 'center',
                    }}
                  >
                    {googleMessage}
                  </div>
                )}

                <div className="oauth-google-btn">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      setLoginFailure(true)
                      setStatus('unavailable')
                      setAuthError('Google Sign-In was cancelled or failed.')
                    }}
                    theme="filled_black"
                    size="large"
                    shape="pill"
                    text="continue_with"
                    width="400"
                  />
                </div>

                <div className="auth-divider">
                  <span>or sign in with email</span>
                </div>

                <form onSubmit={handleLoginSubmit}>
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
                        if (['error', 'unavailable'].includes(status)) {
                          setStatus('idle')
                          setLoginFailure(false)
                        }
                      }}
                    />
                  </div>

                  <label htmlFor="password">Password</label>
                  <div className="login-password-scene">
                    <div className="login-input">
                      <LockKeyhole size={18} />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (['error', 'unavailable'].includes(status)) {
                            setStatus('idle')
                            setLoginFailure(false)
                          }
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
                      className="forgot-password"
                      onClick={onNavigateForgot}
                    >
                      Forgot Password?
                    </button>
                  </div>

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

                <div className="flip-toggle-footer">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    className="flip-switch-btn"
                    onClick={() => {
                      setStatus('idle')
                      setLoginFailure(false)
                      setGoogleMessage('')
                      setIsFlipped(true)
                    }}
                  >
                    Create account
                  </button>
                </div>
              </div>

              <div className="login-form-container card-face card-back">
                <ThemeToggle theme={theme} onThemeChange={onThemeChange} />

                <div className="atm-terminal-status" aria-hidden="true">
                  <span>
                    <i />
                    FS-ATM 024
                  </span>
                  <span>ENCRYPTED LINK</span>
                </div>

                <div className="mobile-brand">
                  <ShieldCheck size={35} aria-hidden="true" />
                  <span>FraudShield</span>
                </div>

                <div className="form-heading">
                  <p>JOIN PLATFORM</p>
                  <h2>Create account</h2>
                  <span>Get started with intelligent financial risk monitoring.</span>
                </div>

                <div className="oauth-google-btn">
                  <GoogleLogin
                    onSuccess={handleGoogleRegister}
                    onError={() => {
                      setStatus('unavailable')
                      setAuthError('Google registration was cancelled or failed.')
                    }}
                    theme="filled_black"
                    size="large"
                    shape="pill"
                    text="signup_with"
                    width="400"
                  />
                </div>

                <div className="auth-divider">
                  <span>or register with email</span>
                </div>

                <form onSubmit={handleRegisterSubmit}>
                  <label htmlFor="regName">Full Name</label>
                  <div className="login-input">
                    <User size={18} />
                    <input
                      id="regName"
                      type="text"
                      placeholder="Enter your full name"
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value)
                        if (['error', 'unavailable', 'verification-sent'].includes(status)) {
                          setStatus('idle')
                          setLoginFailure(false)
                        }
                      }}
                    />
                  </div>

                  <label htmlFor="regEmail">Work Email address</label>
                  <div className="login-input">
                    <Mail size={18} />
                    <input
                      id="regEmail"
                      type="email"
                      placeholder="Enter work email"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value)
                        if (['error', 'unavailable', 'verification-sent'].includes(status)) {
                          setStatus('idle')
                          setLoginFailure(false)
                        }
                      }}
                    />
                  </div>

                  <label htmlFor="regPassword">Password</label>
                  <div className="login-input">
                    <LockKeyhole size={18} />
                    <input
                      id="regPassword"
                      type={showRegPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value)
                        if (['error', 'unavailable', 'verification-sent'].includes(status)) {
                          setStatus('idle')
                          setLoginFailure(false)
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {regPassword.length > 0 && (
                    <div className="password-requirements">
                      <div className="password-requirements-heading">
                        Password requirements
                        <span>
                          {passedPasswordRequirements}/5 completed
                        </span>
                      </div>

                      {PASSWORD_REQUIREMENTS.map((requirement, index) => {
                        const passed = requirement.test(regPassword)

                        return (
                          <div
                            key={index}
                            className={`password-requirement ${
                              passed ? 'requirement-met' : ''
                            }`}
                          >
                            {passed ? (
                              <Check size={15} />
                            ) : (
                              <AlertTriangle size={15} />
                            )}

                            <span>{requirement.label}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {['error', 'unavailable', 'verification-sent'].includes(status) && (
                    <div className="atm-receipt-error" style={{ marginTop: '16px' }}>
                      <div className="receipt-header">
                        <AlertTriangle size={16} />
                        <span>
                          {status === 'error'
                            ? 'REGISTRATION FAILED'
                            : status === 'verification-sent'
                            ? 'CHECK YOUR EMAIL'
                            : 'AUTHENTICATION UNAVAILABLE'}
                        </span>
                      </div>
                      <div className="receipt-body">
                        {status === 'error'
                          ? authError || 'Please fill all registration fields.'
                          : status === 'verification-sent'
                          ? authError
                          : authError || 'Authentication failed. Please try again.'}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="login-submit"
                    style={{ marginTop: '22px' }}
                    disabled={
                      status === 'processing' ||
                      status === 'success' ||
                      !isRegPasswordStrong
                    }
                  >
                    {status === 'processing' ? (
                      <>
                        Creating Account...
                        <LoaderCircle size={18} className="animate-spin" />
                      </>
                    ) : !isRegPasswordStrong ? (
                      <>
                        Create Account
                        <Ban size={19} />
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                <div className="flip-toggle-footer">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    className="flip-switch-btn"
                    onClick={() => {
                      setStatus('idle')
                      setLoginFailure(false)
                      setGoogleMessage('')
                      setIsFlipped(false)
                    }}
                  >
                    Sign in
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </section>
    </main>
  )
}
