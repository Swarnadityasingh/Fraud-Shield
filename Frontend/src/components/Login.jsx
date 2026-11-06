import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Banknote,
  AlertTriangle,
  Landmark,
  Coins,
  ReceiptText,
} from 'lucide-react'
import './Login.css'
import ThemeToggle from './ThemeToggle'

export default function Login({ onLogin, theme, onThemeChange }) {
  const reduceMotion = false

  // Flip State: false = Login Side, true = Register Side
  const [isFlipped, setIsFlipped] = useState(false)

  // Login Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Register Form State
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPassword, setShowRegPassword] = useState(false)

  const [status, setStatus] = useState('idle')

  function handleLoginSubmit(e) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setStatus('error')
      return
    }
    setStatus('unavailable')
  }

  function handleRegisterSubmit(e) {
    e.preventDefault()
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
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
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
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
                <span>FRAUDSHIELD · DEMO</span>
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
        {/* Multi-element Blurred Background */}
        <div className="money-bg-particles" aria-hidden="true">
          <div className="particle-item note-500 float-1 blur-sm"><span>₹500</span></div>
          <div className="particle-item note-200 float-2 blur-md"><span>₹200</span></div>
          <div className="particle-item note-100 float-3 blur-sm"><span>₹100</span></div>
          <div className="particle-item note-500 float-4 blur-md"><span>₹500</span></div>
          <div className="particle-item note-200 float-5 blur-sm"><span>₹200</span></div>

          <div className="particle-item bank-cheque float-6 blur-sm">
            <div className="cheque-header">BANK CHEQUE · ₹50,000</div>
            <div className="cheque-line"></div>
          </div>
          <div className="particle-item bank-cheque float-7 blur-md">
            <div className="cheque-header">PAYEE: FRAUDSHIELD</div>
            <div className="cheque-line"></div>
          </div>
          <div className="particle-item bank-cheque float-8 blur-sm">
            <div className="cheque-header">ACCOUNT VERIFIED</div>
            <div className="cheque-line"></div>
          </div>

          <div className="particle-item coin-badge float-9 blur-sm"><Coins size={24} /></div>
          <div className="particle-item coin-badge float-10 blur-md"><b>₹</b></div>
          <div className="particle-item coin-badge float-11 blur-sm"><b>₹</b></div>
          <div className="particle-item coin-badge float-12 blur-md"><Coins size={22} /></div>

          <div className="particle-item atm-badge float-13 blur-sm">
            <Landmark size={26} />
            <span>ATM</span>
          </div>
          <div className="particle-item receipt-badge float-14 blur-md">
            <ReceiptText size={24} />
          </div>
          <div className="particle-item atm-badge float-15 blur-sm">
            <Landmark size={24} />
            <span>SECURE</span>
          </div>
        </div>

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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              <div className="receipt-footer">SECURE FINANCIAL MONITORING</div>
            </div>
          </div>
        )}

        <ThemeToggle theme={theme} onThemeChange={onThemeChange} />

        {/* 3D Flip Wrapper Container */}
        <div className="card-flip-perspective">
          <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>

            {/* FRONT FACE: LOGIN */}
            <div className="login-form-container card-face card-front">
              <div className="mobile-brand">
                <ShieldCheck size={35} aria-hidden="true" />
                <span>FraudShield</span>
              </div>

              <div className="form-heading">
                <p>SECURE ACCESS</p>
                <h2>Welcome back</h2>
                <span>Sign in to access your monitoring workspace.</span>
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
                      if (['error', 'unavailable'].includes(status)) setStatus('idle')
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
                </div>

                {['error', 'unavailable'].includes(status) && (
                  <div className="atm-receipt-error" aria-live="polite">
                    <div className="receipt-header">
                      <AlertTriangle size={16} />
                      <span>
                        {status === 'error' ? 'TRANSACTION FAILED' : 'AUTHENTICATION UNAVAILABLE'}
                      </span>
                    </div>
                    <div className="receipt-body">
                      {status === 'error'
                        ? 'Please fill all mandatory fields.'
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

              <div className="flip-toggle-footer">
                <span>Don't have an account?</span>
                <button
                  type="button"
                  className="flip-switch-btn"
                  onClick={() => {
                    setStatus('idle')
                    setIsFlipped(true)
                  }}
                >
                  Create account
                </button>
              </div>
            </div>

            {/* BACK FACE: CREATE ACCOUNT */}
            <div className="login-form-container card-face card-back">
              <div className="mobile-brand">
                <ShieldCheck size={35} aria-hidden="true" />
                <span>FraudShield</span>
              </div>

              <div className="form-heading">
                <p>JOIN PLATFORM</p>
                <h2>Create account</h2>
                <span>Get started with intelligent financial risk monitoring.</span>
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
                      if (['error', 'unavailable'].includes(status)) setStatus('idle')
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
                      if (['error', 'unavailable'].includes(status)) setStatus('idle')
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
                      if (['error', 'unavailable'].includes(status)) setStatus('idle')
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

                {['error', 'unavailable'].includes(status) && (
                  <div className="atm-receipt-error" style={{ marginTop: '16px' }}>
                    <div className="receipt-header">
                      <AlertTriangle size={16} />
                      <span>
                        {status === 'error' ? 'REGISTRATION FAILED' : 'AUTHENTICATION UNAVAILABLE'}
                      </span>
                    </div>
                    <div className="receipt-body">
                      {status === 'error'
                        ? 'Please fill all registration fields.'
                        : 'Registration service is not connected yet. Please use Demo Workspace.'}
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
                    setIsFlipped(false)
                  }}
                >
                  Sign in
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}