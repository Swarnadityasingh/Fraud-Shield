import { useState } from 'react'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react'
import './Login.css'
import ThemeToggle from './ThemeToggle'
import ForgotPassword from './ForgotPassword'
import ReceiptPrinter from './ReceiptPrinter'

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

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  const [status, setStatus] = useState('idle')
  const [authError, setAuthError] = useState('')
  const [loginFailure, setLoginFailure] = useState(false)

  const isLoginView = !isFlipped && !showForgot

  const printerStage = !isLoginView
    ? 'idle'
    : status === 'processing'
    ? 'processing'
    : status === 'success'
    ? 'complete'
    : loginFailure && ['error', 'unavailable'].includes(status)
    ? 'printing'
    : 'idle'

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
        }, 1800)
      }

    } catch (error) {
      console.error('Login error:', error)
      setLoginFailure(true)
      setStatus('unavailable')
      setAuthError(
        error.message || 'Could not connect to the authentication server.'
      )
    }
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault()

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setStatus('error')
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

  async function handleGoogleOAuth(credentialResponse) {
    const credential = credentialResponse?.credential

    if (!credential) {
      setLoginFailure(true)
      setStatus('unavailable')
      setAuthError('Google did not provide an authentication credential.')
      return
    }

    setLoginFailure(false)
    setStatus('processing')
    setAuthError('')

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
        throw new Error(
          data.detail || 'Google authentication failed.'
        )
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
        }, 1800)
      }

    } catch (error) {
      console.error('Google authentication error:', error)

      setLoginFailure(true)
      setStatus('unavailable')
      setAuthError(
        error.message || 'Could not connect to the authentication server.'
      )
    }
  }

  return (
    <main className="login-page" data-theme={theme}>
      <section className="login-visual">
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

          <div className="login-depth-scene" aria-hidden="true">
            <div className="login-depth-glow" />
            <div className="login-depth-orbit" />
            <div className="login-depth-orbit login-depth-orbit-inner" />

            {[
              { value: '500', position: 'one', angle: -14 },
              { value: '200', position: 'two', angle: 18 },
              { value: '100', position: 'three', angle: -9 },
            ].map((note, index) => (
              <motion.div
                key={note.value}
                className={`login-depth-note login-depth-note-${note.position}`}
                initial={{ x: 0, y: 0, rotate: note.angle, rotateX: 0, rotateY: 0 }}
                animate={
                  reduceMotion
                    ? { x: 0, y: 0, rotate: note.angle, rotateX: 0, rotateY: 0 }
                    : {
                        x: [0, index === 1 ? -6 : 6, 0, index === 1 ? 6 : -6, 0],
                        y: [0, -14, -5, -10, 0],
                        rotate: [
                          note.angle,
                          note.angle + 4,
                          note.angle,
                          note.angle - 4,
                          note.angle,
                        ],
                        rotateX: [0, 7, 0, -7, 0],
                        rotateY: [0, -9, 0, 9, 0],
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 6 + index,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.25, 0.5, 0.75, 1],
                        delay: index * 0.4,
                      }
                }
              >
                <span>FRAUDSHIELD · SECURITY</span>
                <div>
                  <b>₹</b>
                  <strong>{note.value}</strong>
                </div>
                <span>ILLUSTRATIVE NOTE</span>
              </motion.div>
            ))}

            <motion.div
              className="login-depth-shield"
              initial={{ x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0 }}
              animate={
                reduceMotion
                  ? { x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0 }
                  : {
                      x: [0, 4, 0, -4, 0],
                      y: [0, -12, -5, -10, 0],
                      rotate: [0, 3, 0, -3, 0],
                      rotateX: [0, 5, 0, -5, 0],
                      rotateY: [0, -7, 0, 7, 0],
                    }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      times: [0, 0.25, 0.5, 0.75, 1],
                    }
              }
            >
              <ShieldCheck size={76} strokeWidth={1.3} />
            </motion.div>
          </div>
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
          <div className="card-flip-perspective">
            <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>

              <div className="login-form-container card-face card-front">
                <ThemeToggle theme={theme} onThemeChange={onThemeChange} />

                <div className="mobile-brand">
                  <ShieldCheck size={35} aria-hidden="true" />
                  <span>FraudShield</span>
                </div>

                <div className="form-heading">
                  <p>SECURE ACCESS</p>
                  <h2>Welcome back</h2>
                  <span>Sign in to access your monitoring workspace.</span>
                </div>

                <div className="oauth-google-btn">
                  <GoogleLogin
                    onSuccess={handleGoogleOAuth}
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
                      setIsFlipped(true)
                    }}
                  >
                    Create account
                  </button>
                </div>
              </div>

              <div className="login-form-container card-face card-back">
                <ThemeToggle theme={theme} onThemeChange={onThemeChange} />

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
                    onSuccess={handleGoogleOAuth}
                    onError={() => {
                      setLoginFailure(true)
                      setStatus('unavailable')
                      setAuthError('Google Sign-In was cancelled or failed.')
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
                          ? 'Please fill all registration fields.'
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
                    disabled={status === 'processing' || status === 'success'}
                  >
                    Create Account
                    <ArrowRight size={18} />
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

        {isLoginView && (
          <ReceiptPrinter
            stage={printerStage}
            title={
              status === 'success'
                ? 'TRANSACTION APPROVED'
                : status === 'unavailable'
                ? 'AUTHENTICATION UNAVAILABLE'
                : 'TRANSACTION DECLINED'
            }
            reason={
              status === 'success'
                ? 'IDENTITY VERIFIED'
                : status === 'error'
                ? 'MISSING CREDENTIALS'
                : 'AUTHENTICATION FAILED'
            }
            message={
              status === 'success'
                ? 'Your secure session has been established.'
                : authError || 'Please verify your credentials and try again.'
            }
          />
        )}
      </section>
    </main>
  )
}