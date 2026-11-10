import { useState, useEffect } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import './ForgotPassword.css'

const PROMPT_MESSAGES = [
  "Money is safe, but memory failed? Let’s get you a new key! 🏦🧠",
  "Forgot the vault key? Don't stress, your funds aren't going anywhere. 🔑✨",
  "Brain fog strike right before transaction time? We’ve got your back! 💸☁️",
  "Lost your passkey? Happens to the best investors; let's reset it. 📈🤝",
  "Security first! Let’s verify it’s actually you before opening the vault. 🛡️🔒"
]

const SUCCESS_MESSAGES = [
  "Reset link dispatched! Check your inbox faster than market dips. 📩📉",
  "Your recovery link is on its way. Keep your inbox close and your credentials closer! 🔐📬",
  "A fresh path back to your vault is ready. Check your inbox! 🏦✨",
  "Recovery request received! Your next move is in your inbox. 📈📩"
]

export default function ForgotPassword({ theme, onNavigateLogin }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [headerMsg, setHeaderMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLeaving, setIsLeaving] = useState(false)

  function handleBackToLogin() {
    if (isLeaving) return

    setIsLeaving(true)

    setTimeout(() => {
      onNavigateLogin?.()
    }, 250)
  }

  useEffect(() => {
    setHeaderMsg(
      PROMPT_MESSAGES[Math.floor(Math.random() * PROMPT_MESSAGES.length)]
    )
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setErrorMessage('Please enter your registered email address.')
      return
    }

    setStatus('processing')
    setErrorMessage('')

    try {
      const response = await fetch(
        'http://localhost:8000/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim().toLowerCase()
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Could not process password reset request.'
        )
      }

      setSuccessMsg(
        SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
      )
      setStatus('success')
    } catch (error) {
      console.error('Forgot password error:', error)
      setStatus('error')
      setErrorMessage(
        error.message || 'Network error. Please try again later.'
      )
    }
  }

  return (
    <motion.main
      className={`fp-page ${isLeaving ? 'fp-leaving' : ''}`}
      data-theme={theme}
      initial={{ opacity: 0, y: 18 }}
      animate={{
        opacity: isLeaving ? 0 : 1,
        y: isLeaving ? 12 : 0
      }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <div className="fp-card">

        <div className="fp-brand">FraudShield</div>

        <div className="fp-heading">

          <span className="fp-eyebrow">ACCOUNT RECOVERY</span>

          <h1>Recover Password 🔑</h1>

          <p className="fp-description">
            {headerMsg}
          </p>
        </div>

        {status === 'success' ? (
          <motion.div
            className="fp-success-state"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="fp-success-icon">
              <Mail size={23} />
            </div>

            <div className="fp-success-message">
              {successMsg}
            </div>

            <p className="fp-success-description">
              If an eligible account exists, recovery instructions will be
              sent to <strong>{email}</strong>. Check your inbox and spam
              folder just in case.
            </p>

            <button
              type="button"
              className="fp-submit"
              onClick={handleBackToLogin}
            >
              Return to Sign In
              <ArrowRight size={17} />
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="fp-form">

            <label htmlFor="recovery-email" className="fp-label">
              Registered Email Address
            </label>

            <div className="fp-input-wrap">
              <Mail size={18} />

              <input
                id="recovery-email"
                type="email"
                placeholder="Enter registered email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === 'error') {
                    setStatus('idle')
                    setErrorMessage('')
                  }
                }}
                autoComplete="email"
                required
              />
            </div>

            <p className="fp-hint">
              We'll send a secure, time-limited password reset link
              if your account is eligible.
            </p>

            {status === 'error' && (
              <motion.div
                className="fp-error"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errorMessage}
              </motion.div>
            )}

            <button
              type="submit"
              className="fp-submit"
              disabled={status === 'processing'}
            >
              {status === 'processing' ? (
                'Dispatching Recovery Link...'
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            <button
              type="button"
              className="fp-back"
              onClick={handleBackToLogin}
            >
              Remembered your password? <span>Back to Login</span>
            </button>

          </form>
        )}
      </div>
    </motion.main>
  )
}
