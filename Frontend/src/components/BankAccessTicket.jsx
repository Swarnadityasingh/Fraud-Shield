import {
  CheckCircle2,
  Landmark,
  ShieldCheck,
} from 'lucide-react'
import Ticket from './Ticket'
import './BankAccessTicket.css'

export default function BankAccessTicket() {
  const body = (
    <div className="bank-ticket-body">
      <div className="bank-ticket-brand">
        <div>
          <ShieldCheck size={17} aria-hidden="true" />
          <strong>
            FRAUDSHIELD
            <span>BANK</span>
          </strong>
        </div>

        <span className="bank-ticket-online">
          <i />
          CORE LEDGER
        </span>
      </div>

      <div className="bank-ticket-terminal">
        <span className="bank-ticket-status-icon">
          <CheckCircle2 size={19} aria-hidden="true" />
        </span>

        <div>
          <small>TERMINAL STATUS</small>
          <strong>SYSTEM READY — AWAITING TRANSACTION</strong>
        </div>
      </div>

      <div className="bank-ticket-slot">
        <span />
      </div>
    </div>
  )

  const stub = (
    <div className="bank-ticket-stub">
      <span>TERM-BANK-01</span>

      <Landmark size={20} aria-hidden="true" />

      <span>PASSBOOK MODULE</span>
    </div>
  )

  return (
    <Ticket
      ariaLabel="FraudShield secure banking terminal"
      className="bank-access-ticket"
      body={body}
      stub={stub}
      paper="#182334"
      ink="#e2e8f0"
      cornerSize={18}
      notchSize={11}
      stubHeight="18%"
    />
  )
}