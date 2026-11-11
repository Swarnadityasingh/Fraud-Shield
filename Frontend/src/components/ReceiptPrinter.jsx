import { motion, useReducedMotion } from 'framer-motion'
import {
  BookOpenCheck,
  CheckCircle2,
  LoaderCircle,
  ShieldAlert,
} from 'lucide-react'
import AccessTicket from './AccessTicket'
import './ReceiptPrinter.css'

export default function ReceiptPrinter({
  stage = 'idle',
  reason = 'ACCESS DENIED',
}) {
  const shouldReduceMotion = useReducedMotion()

  const isIdle = stage === 'idle'
  const isProcessing = stage === 'processing'
  const isPrinting = stage === 'printing'
  const isComplete = stage === 'complete'
  const ticketVisible = isPrinting || isComplete

  const statusText = {
    idle: 'SYSTEM READY — AWAITING TRANSACTION',
    processing: 'Validating secure credentials...',
    printing: 'Printing access decision...',
    complete: 'Identity verified — access granted',
  }

  return (
    <section
      className="receipt-printer"
      data-stage={stage}
      aria-label="FraudShield access terminal"
    >
      <div className="printer-machine">
        <div className="printer-header">
          <div className="printer-brand">
            <ShieldAlert size={17} />
            <span>FRAUDSHIELD BANK</span>
          </div>

          <div className="printer-indicator">
            <span
              className={`printer-light ${
                isIdle || isComplete ? 'is-active' : ''
              }`}
            />
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
              <LoaderCircle
                size={19}
                className="printer-spinner"
              />
            )}
          </div>

          <div className="printer-screen-info">
            <span className="printer-screen-label">
              TERMINAL STATUS
            </span>

            <span className="printer-screen-status">
              {statusText[stage] || statusText.printing}
            </span>
          </div>
        </div>

        <div className="printer-slot">
          <div className="printer-slot-inner" />
        </div>

        <div className="receipt-output access-ticket-output">
          <motion.div
            className="printer-access-ticket"
            initial={{
              opacity: 0,
              y: '-100%',
            }}
            animate={
              ticketVisible
                ? {
                    opacity: 1,
                    y: '0%',
                  }
                : {
                    opacity: 0,
                    y: '-100%',
                  }
            }
            transition={{
              opacity: {
                duration: shouldReduceMotion ? 0 : 0.25,
              },
              y: {
                duration: shouldReduceMotion ? 0 : 2.2,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
          >
            <AccessTicket
              status={isComplete ? 'granted' : 'denied'}
              name={
                isComplete
                  ? 'FRAUDSHIELD USER'
                  : reason
              }
            />
          </motion.div>
        </div>

        <div className="printer-cutter" />

        <div className="printer-footer">
          <span>TERM-BANK-01</span>
          <span>ACCESS MODULE</span>
        </div>
      </div>
    </section>
  )
}