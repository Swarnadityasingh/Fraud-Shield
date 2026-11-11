import { useEffect, useState, useRef } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  LoaderCircle,
} from 'lucide-react'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

export default function VerifyEmail({ onNavigateLogin }) {
  const token = new URLSearchParams(window.location.search).get('token')

  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState(
    'Verifying your email address...'
  )

  const verificationRequest = useRef(null)

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Verification token is missing.')
      return
    }

    let cancelled = false

    async function verifyEmail() {
      try {
        if (!verificationRequest.current) {
          verificationRequest.current = fetch(
            `${API_URL}/auth/verify-email?token=${encodeURIComponent(token)}`,
            { method: 'GET' }
          ).then(async (response) => {
            const data = await response.json()

            if (!response.ok) {
              throw new Error(
                data.detail || 'Email verification failed.'
              )
            }

            return data
          })
        }

        const data = await verificationRequest.current

        if (!cancelled) {
          setStatus('success')
          setMessage(
            data.message ||
            'Email verified successfully. You can now log in.'
          )
        }
      } catch (error) {
        if (!cancelled) {
          setStatus('error')
          setMessage(
            error.message || 'Could not verify your email.'
          )
        }
      }
    }

    verifyEmail()

    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <main className="verify-email-page">
      <section className="verify-email-card">
        {status === 'loading' && (
          <LoaderCircle size={42} />
        )}

        {status === 'success' && (
          <ShieldCheck size={42} />
        )}

        {status === 'error' && (
          <ShieldAlert size={42} />
        )}

        <h1>
          {status === 'loading'
            ? 'Verifying email'
            : status === 'success'
              ? 'Email verified'
              : 'Verification failed'}
        </h1>

        <p>{message}</p>

        {status !== 'loading' && (
          <button onClick={onNavigateLogin}>
            Continue to Login
          </button>
        )}
      </section>
    </main>
  )
}
