import { motion, useReducedMotion } from 'framer-motion'
import {
  Check,
  ShieldCheck,
  ShieldX,
  X,
} from 'lucide-react'
import './AccessTicket.css'

const pixels = Array.from({ length: 99 }, (_, index) => {
  const row = Math.floor(index / 11)
  const column = index % 11
  const rowDistance = Math.abs(row - 4)
  const columnDistance = Math.abs(column - 5)
  const distance = rowDistance + columnDistance

  if (distance <= 2) return 'strong'
  if (distance <= 4) return 'medium'
  return 'soft'
})

function createReference() {
  return `FS-${Date.now().toString().slice(-8)}`
}

export default function AccessTicket({
  status = 'granted',
  name = 'AUTHORIZED USER',
  reference = createReference(),
}) {
  const reducedMotion = useReducedMotion()
  const granted = status === 'granted'

  const currentDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date())

  const currentTime = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())

  return (
    <motion.article
      className={`access-ticket ${
        granted
          ? 'access-ticket-granted'
          : 'access-ticket-denied'
      }`}
      initial={
        reducedMotion
          ? false
          : {
              opacity: 0,
              y: 35,
              rotateX: 12,
              scale: 0.92,
            }
      }
      animate={
        reducedMotion
          ? undefined
          : granted
            ? {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
              }
            : {
                opacity: 1,
                y: 0,
                rotateX: 0,
                scale: 1,
                x: [0, -7, 7, -4, 4, 0],
              }
      }
      transition={{
        duration: granted ? 0.7 : 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      aria-live="polite"
      aria-label={granted ? 'Access granted' : 'Access denied'}
    >
      <section className="access-ticket-main">
        <header className="access-ticket-header">
          <span>SERIES NO. FS-024</span>
          <span>FRAUDSHIELD · IN</span>
        </header>

        <div className="access-ticket-pixels" aria-hidden="true">
          {pixels.map((strength, index) => (
            <span
              key={index}
              className={`access-ticket-pixel access-ticket-pixel-${strength}`}
            />
          ))}
        </div>

        <div className="access-ticket-result">
          <div className="access-ticket-result-icon">
            {granted ? (
              <ShieldCheck size={34} strokeWidth={1.8} />
            ) : (
              <ShieldX size={34} strokeWidth={1.8} />
            )}
          </div>

          <p>
            {granted
              ? 'IDENTITY VERIFIED'
              : 'AUTHENTICATION FAILED'}
          </p>

          <h2>
            ACCESS
            <br />
            {granted ? 'GRANTED' : 'DENIED'}
          </h2>

          <span>
            {granted
              ? 'Your identity has been confirmed. The secure FraudShield workspace is ready.'
              : 'Your credentials could not be verified. Check your information and try again.'}
          </span>
        </div>

        <div className="access-ticket-details">
          <div>
            <span>DATE</span>
            <strong>{currentDate}</strong>
          </div>

          <div>
            <span>TIME</span>
            <strong>{currentTime}</strong>
          </div>
        </div>
      </section>

      <section className="access-ticket-stub">
        <div className="access-ticket-admit">
          <span>{granted ? 'ADMIT' : 'STATUS'}</span>

          <strong>
            {granted ? (
              <>
                <Check size={16} strokeWidth={3} />
                ONE
              </>
            ) : (
              <>
                <X size={16} strokeWidth={3} />
                BLOCKED
              </>
            )}
          </strong>
        </div>

        <div className="access-ticket-reference">
          <span>REFERENCE</span>
          <strong>{reference}</strong>
        </div>

        <div className="access-ticket-name">
          <span>ACCESS HOLDER</span>
          <strong>{name}</strong>
        </div>

        <div className="access-ticket-barcode" aria-hidden="true" />

        <div className="access-ticket-number">
          {reference.replaceAll('-', ' ')}
        </div>
      </section>
    </motion.article>
  )
}