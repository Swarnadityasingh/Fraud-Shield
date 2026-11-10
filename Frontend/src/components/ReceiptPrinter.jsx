import { motion, useReducedMotion } from 'framer-motion'
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  BookOpenCheck,
  ShieldAlert,
} from 'lucide-react'
import './ReceiptPrinter.css'

export default function ReceiptPrinter({
  stage = 'idle',
  title = 'AUTHENTICATION FAILED',
  reason = 'ACCESS DENIED',
  message = 'Please verify your credentials and try again.',
}) {
  const shouldReduceMotion = useReducedMotion()

  const isIdle = stage === 'idle'
  const isProcessing = stage === 'processing'
  const isPrinting = stage === 'printing'
  const isComplete = stage === 'complete'

  const statusText = {
    idle: 'SYSTEM READY — AWAITING TRANSACTION',
    processing: 'Validating bank ledger...',
    printing: 'Printing passbook entry...',
    complete: 'Passbook synchronized',
  }

  return (
    <section
      className="receipt-printer"
      data-stage={stage}
      aria-label="FraudShield Passbook Terminal"
    >
      <div className="printer-machine">
        <div className="printer-header">
          <div className="printer-brand">
            <ShieldAlert size={17} />
            <span>FRAUDSHIELD BANK</span>
          </div>

          <div className="printer-indicator">
            <span className={`printer-light ${isIdle || isComplete ? 'is-active' : ''}`} />
            <span>CORE LEDGER</span>
          </div>
        </div>

        <div className="printer-screen">
          <div className="printer-screen-icon">
            {isIdle || isComplete ? (
              <CheckCircle2 size={19} />
            ) : isPrinting ? (
              <BookOpenCheck size={19} />
            ) : (
              <LoaderCircle size={19} className="printer-spinner" />
            )}
          </div>

          <div className="printer-screen-info">
            <span className="printer-screen-label">TERMINAL STATUS</span>
            <span className="printer-screen-status">
              {statusText[stage] || statusText.printing}
            </span>
          </div>
        </div>

        <div className="printer-slot">
          <div className="printer-slot-inner" />
        </div>

        <div className="receipt-output">
          <motion.article
            className="receipt-paper passbook-page"
            initial={{ opacity: 0, y: '-100%' }}
            animate={
              isIdle || isProcessing
                ? { opacity: 0, y: '-100%' }
                : isPrinting && !shouldReduceMotion
                ? { opacity: 1, y: ['-100%', '-50%', '0%'] }
                : { opacity: 1, y: '0%' }
            }
            transition={{
              opacity: { duration: 0.2 },
              y: { duration: shouldReduceMotion ? 0 : 2.5, ease: 'easeOut' },
            }}
          >
            <div className="passbook-header">
              <span className="passbook-bank-title">FRAUDSHIELD CENTRAL BANK</span>
              <span className="passbook-subtitle">PASSBOOK ENTRY TERMINAL</span>
            </div>

            <div className="receipt-divider">
              ================================
            </div>

            <div className="passbook-table-header">
              <span>DATE / TIME</span>
              <span>PARTICULARS</span>
              <span>STATUS</span>
            </div>

            <div className="receipt-divider">
              --------------------------------
            </div>

            <div className="passbook-entry-row">
              <span className="entry-date">11/11/2026</span>
              <span className="entry-desc">SECURE LOGIN PORTAL</span>
              <span className={isComplete ? 'entry-success' : 'entry-failed'}>
                {isComplete ? 'SUCCESS' : 'DECLINED'}
              </span>
            </div>

            <div className="receipt-divider">
              --------------------------------
            </div>

            <div className="receipt-error-heading">
              <CircleAlert size={14} />
              <span>{title}</span>
            </div>

            <div className="receipt-reason">{reason}</div>

            <p className="receipt-message">{message}</p>

            <div className="receipt-divider">
              --------------------------------
            </div>

            <div className="receipt-footer">
              <p className="receipt-footer-brand">AUTHORIZED BANKING SYSTEM</p>
              <p className="receipt-footer-note">AUTOMATED PASSBOOK LOG V1.2</p>
            </div>
          </motion.article>
        </div>

        <div className="printer-cutter" />

        <div className="printer-footer">
          <span>TERM-BANK-01</span>
          <span>PASSBOOK MODULE</span>
        </div>
      </div>
    </section>
  )
}