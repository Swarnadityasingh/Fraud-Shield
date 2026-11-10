import { useState } from 'react'
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  X
} from 'lucide-react'
import { motion } from 'framer-motion'
import './ResetPassword.css'

const VALIDATION_ERRORS = [
  "Nice try, but you can't reuse your old vault passcode! 🔒🚫",
  "Same password? We need a brand-new security upgrade for your account. 🆙🛡️",
  "Recycling is great for green energy, but not for financial security! Pick a new one. ♻️❌",
  "That's your current password! Upgrade to something fresher and stronger. ⚡🧠",
  "Security protocol: Your new passcode must be different from the old one. 🗝️🎯"
]

const SUCCESS_MESSAGES = [
  "Vault secured! Your new passcode is officially locked in. 🏦✨",
  "Glow-up complete! You can now access your money matrix. 💸🚀",
  "All set! Now back to making smart financial moves. 📈🎯",
  "Security updated! Your account is safer than ever. 🛡️💎",
  "Success! Login with your new password and control the cash flow. 💰😎"
]

const PASSWORD_REQUIREMENTS = [
  {
    label: 'At least 8 characters',
    test: (password) => password.length >= 8
  },
  {
    label: 'One uppercase letter',
    test: (password) => /[A-Z]/.test(password)
  },
  {
    label: 'One lowercase letter',
    test: (password) => /[a-z]/.test(password)
  },
  {
    label: 'One number',
    test: (password) => /[0-9]/.test(password)
  },
  {
    label: 'One special character',
    test: (password) => /[^A-Za-z0-9]/.test(password)
  }
]

export default function ResetPassword({ theme, token, onNavigateLogin }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [isLeaving, setIsLeaving] = useState(false)

  const passedRequirements = PASSWORD_REQUIREMENTS.filter(
    (requirement) => requirement.test(newPassword)
  ).length

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword

  const isPasswordStrong = passedRequirements === PASSWORD_REQUIREMENTS.length

  function handleBackToLogin() {
    if (isLeaving) return

    setIsLeaving(true)

    setTimeout(() => {
      onNavigateLogin?.()
    }, 250)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!newPassword || !confirmPassword) {
      setStatus('error')
      setErrorMessage('Please fill in all password fields.')
      return
    }

    if (!isPasswordStrong) {
      setStatus('error')
      setErrorMessage('Your new passcode does not meet all security requirements. 🔐')
      return
    }

    if (newPassword !== confirmPassword) {
      setStatus('error')
      setErrorMessage('Passwords do not match. Check both fields and try again.')
      return
    }

    if (!token) {
      setStatus('error')
      setErrorMessage('Invalid or missing password reset token.')
      return
    }

    setStatus('processing')
    setErrorMessage('')

    try {
      const response = await fetch('http://localhost:8000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          new_password: newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.detail && data.detail.toLowerCase().includes('same')) {
          const randomErr =
            VALIDATION_ERRORS[Math.floor(Math.random() * VALIDATION_ERRORS.length)]

          throw new Error(randomErr)
        }

        throw new Error(data.detail || 'Could not reset password.')
      }

      const randomSuccess =
        SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]

      setSuccessMsg(randomSuccess)
      setStatus('success')

    } catch (error) {
      console.error('Reset password error:', error)
      setStatus('error')
      setErrorMessage(
        error.message ||
        VALIDATION_ERRORS[Math.floor(Math.random() * VALIDATION_ERRORS.length)]
      )
    }
  }

  return (
    <motion.main
      className={`rp-page ${isLeaving ? 'rp-leaving' : ''}`}
      data-theme={theme}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      <div className="rp-card">
        <span className="rp-eyebrow">SECURITY MATRIX</span>

        <div className="form-heading">
          <h1>Set New Password 🛡️</h1>
          <span className="rp-description">
            Establish a secure new passcode for your financial matrix.
          </span>
        </div>

        {status === 'success' ? (
          <div className="rp-success-card">
            <div style={{
              padding: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px dashed #10B981',
              borderRadius: '12px',
              color: '#34D399',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {successMsg}
            </div>

            <button
              type="button"
              className="rp-submit"
              onClick={handleBackToLogin}
            >
              Proceed to Sign in <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="new-password" className="rp-label">
              New Passcode
            </label>

            <div className="rp-input-wrap">
              <LockKeyhole size={18} />

              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
              />

              <button
                type="button"
                className="rp-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="rp-requirements">
              <div className="rp-requirements-heading">
                <span>Password Strength</span>
                <span style={{
                  color: newPassword.length === 0
                    ? '#94A3B8'
                    : passedRequirements === 5
                      ? '#34D399'
                      : passedRequirements >= 3
                        ? '#FBBF24'
                        : '#FB7185',
                  fontWeight: '700'
                }}>
                  {newPassword.length === 0
                    ? 'Not entered'
                    : passedRequirements === 5
                      ? 'Strong'
                      : passedRequirements >= 3
                        ? 'Getting there'
                        : 'Weak'}
                </span>
              </div>

              <div className="rp-strength-track">
                <div
                  className={`rp-strength-fill ${passedRequirements === 5 ? 'rp-strength-5' : ''}`}
                  style={{ width: `${(passedRequirements / 5) * 100}%` }}
                />
              </div>

              <div style={{
                color: '#AAB8C7',
                fontSize: '11px',
                fontWeight: '600',
                marginBottom: '10px'
              }}>
                Security requirements
              </div>

              <div className="rp-checklist">
                {PASSWORD_REQUIREMENTS.map((requirement) => {
                  const passed = requirement.test(newPassword)

                  return (
                    <div
                      key={requirement.label}
                      className={`rp-requirement ${passed ? 'passed' : ''}`}
                    >
                      {passed
                        ? <Check size={13} />
                        : <X size={13} />}
                      <span>{requirement.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <label htmlFor="confirm-password" className="rp-label">
              Confirm New Passcode
            </label>

            <div className="rp-input-wrap">
              <LockKeyhole size={18} />

              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new passcode"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (status === 'error') setStatus('idle')
                }}
              />

              <button
                type="button"
                className="rp-eye"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            </div>

            {confirmPassword && (
              <div className={`rp-match ${passwordsMatch ? 'matched' : ''}`}>
                {passwordsMatch
                  ? '✓ Passcodes match!'
                  : '✕ Passcodes do not match yet.'}
              </div>
            )}

            {status === 'error' && (
              <div className="rp-error">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="rp-submit"
              disabled={status === 'processing'}
            >
              {status === 'processing'
                ? 'Encrypting New Key...'
                : 'Update & Secure Vault →'}
            </button>

            <button
              type="button"
              className="rp-back"
              onClick={handleBackToLogin}
            >
              Remembered your password? Back to Login
            </button>
          </form>
        )}
      </div>
    </motion.main>
  )
}