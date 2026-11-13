import { useEffect, useRef } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { Check, X } from 'lucide-react'
import './PlansModal.css'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    description: 'Explore financial risk analysis.',
    features: [
      { label: 'Transaction analysis', included: true },
      { label: 'Risk scores and classifications', included: true },
      { label: 'Dashboard overview', included: true },
      { label: 'Transaction history', included: true },
      { label: 'Higher analysis limits', included: false },
      { label: 'Advanced reporting', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '₹599',
    description: 'For individuals who need deeper insights.',
    features: [
      { label: 'Everything in Free', included: true },
      { label: 'Higher analysis limits', included: true },
      { label: 'Advanced reporting', included: true },
      { label: 'Priority support', included: true },
      { label: 'Custom usage limits', included: false },
      { label: 'Team access requirements', included: false },
      { label: 'Integration and onboarding support', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Custom / Enterprise',
    price: 'Let’s talk',
    description: 'A tailored solution for your organisation.',
    features: [
      { label: 'Everything in Pro', included: true },
      { label: 'Custom usage limits', included: true },
      { label: 'Team access requirements', included: true },
      { label: 'Integration and onboarding support', included: true },
    ],
  },
]

function ProScanner() {
  const reducedMotion = useReducedMotion()

  return (
    <div className="fs-pro-animation" aria-hidden="true">
      <svg viewBox="0 0 280 120" fill="none">
        <path
          d="M12 60H83M197 60H268"
          stroke="currentColor"
          strokeOpacity=".2"
          strokeDasharray="4 6"
        />

        {[0, 1, 2].map(index => (
          <motion.g
            key={index}
            initial={false}
            animate={
              reducedMotion
                ? { x: 24 + index * 38, opacity: 0.7 }
                : {
                    x: [8, 100, 180, 252],
                    opacity: [0, 1, 1, 0],
                  }
            }
            transition={{
              duration: 4,
              delay: index * 1.3,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <rect
              y="49"
              width="24"
              height="22"
              rx="5"
              fill="currentColor"
              fillOpacity=".15"
              stroke="currentColor"
              strokeOpacity=".6"
            />
            <text
              x="12"
              y="64"
              textAnchor="middle"
              fill="currentColor"
              fontSize="13"
              fontFamily="sans-serif"
            >
              ₹
            </text>
          </motion.g>
        ))}

        <circle
          cx="140"
          cy="60"
          r="43"
          fill="var(--dashboard-surface, #fff)"
        />

        <motion.circle
          cx="140"
          cy="60"
          r="40"
          stroke="currentColor"
          initial={false}
          animate={
            reducedMotion
              ? { opacity: 0.2 }
              : { r: [36, 49], opacity: [0.45, 0] }
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        <path
          d="M140 27L165 38V58C165 76 153 87 140 94C127 87 115 76 115 58V38L140 27Z"
          fill="currentColor"
          fillOpacity=".12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        <motion.path
          d="M129 59L137 67L153 50"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={
            reducedMotion
              ? { pathLength: 1, opacity: 1 }
              : {
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 1, 1, 0],
                }
          }
          transition={{
            duration: 4,
            times: [0, 0.3, 0.85, 1],
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>

      <span>Every signal. A clearer picture.</span>
    </div>
  )
}

function TiltPlanCard({ children, className, index }) {
  const reducedMotion = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 180,
    damping: 24,
  })

  const smoothRotateY = useSpring(rotateY, {
    stiffness: 180,
    damping: 24,
  })

  function resetTilt() {
    rotateX.set(0)
    rotateY.set(0)
  }

  function handlePointerMove(event) {
    if (
      reducedMotion ||
      event.pointerType !== 'mouse' ||
      !window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      return
    }

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = Math.max(
      -0.5,
      Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5)
    )
    const y = Math.max(
      -0.5,
      Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5)
    )

    rotateX.set(-y * 12)
    rotateY.set(x * 12)
  }

  return (
    <motion.div
      className="fs-plan-tilt-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      initial={{
        opacity: 0,
        y: reducedMotion ? 0 : 32,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.5,
        delay: reducedMotion ? 0 : 0.1 + index * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.article
        className={className}
        style={{
          rotateX: reducedMotion ? 0 : smoothRotateX,
          rotateY: reducedMotion ? 0 : smoothRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </motion.article>
    </motion.div>
  )
}

export default function PlansModal({
  open,
  onClose,
  currentPlan = 'free',
  onUpgrade,
  salesEmail,
}) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const openRef = useRef(open)
  const reducedMotion = useReducedMotion()

  openRef.current = open

  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current

    if (!dialog.open) {
      dialog.showModal()
      closeButtonRef.current?.focus()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  function finishClosing() {
    if (!openRef.current) {
      dialogRef.current?.close()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="fs-plans-modal"
      aria-labelledby="fs-plans-title"
      onCancel={event => {
        event.preventDefault()
        onClose()
      }}
    >
      <AnimatePresence onExitComplete={finishClosing}>
        {open && (
          <motion.div
            key="plans"
            className="fs-plans-screen"
            initial={{
              opacity: 0,
              y: reducedMotion ? 0 : 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: reducedMotion ? 0 : 0.4,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: reducedMotion ? 0 : '100vh',
              transition: {
                duration: reducedMotion ? 0 : 0.65,
                ease: [0.55, 0, 1, 0.45],
              },
            }}
          >
            <header className="fs-plans-topbar">
              <strong>FraudShield</strong>

              <button
                ref={closeButtonRef}
                type="button"
                className="fs-plans-close"
                onClick={onClose}
                aria-label="Close plans and return to dashboard"
              >
                <X size={21} />
              </button>
            </header>

            <main className="fs-plans-content">
              <div className="fs-plans-intro">
                <span className="fs-plans-eyebrow">
                  YOUR NEXT CHAPTER
                </span>

                <h2 id="fs-plans-title">
                  More clarity.
                  <br />
                  <span>Greater possibilities.</span>
                </h2>

                <p>
                  Start free. Choose a plan that grows with your
                  financial monitoring needs.
                </p>
              </div>

              <div className="fs-plans-grid">
                {plans.map((plan, index) => {
                  const selected = currentPlan === plan.id

                  return (
                    <TiltPlanCard
                      key={plan.id}
                      index={index}
                      className={`fs-plan-card ${
                        plan.id === 'pro' ? 'fs-plan-featured' : ''
                      }`}
                    >
                      <div className="fs-plan-heading">
                        <h3>{plan.name}</h3>
                          {plan.id === 'pro' && (
                          <span className="fs-plan-recommended">
                            Recommended
                          </span>
                        )}

                        {selected && (
                          <span className="fs-plan-badge">
                            Current plan
                          </span>
                        )}
                      </div>

                      <strong className="fs-plan-price">
                        {plan.price}
                      </strong>

                      <p className="fs-plan-description">
                        {plan.description}
                      </p>

                      <div className="fs-plan-divider" />

                      <ul>
                        {plan.features.map(feature => (
                          <li
                            key={feature.label}
                            className={feature.included ? '' : 'fs-plan-feature-unavailable'}
                          >
                            {feature.included ? (
                              <Check size={17} aria-hidden="true" />
                            ) : (
                              <X size={17} aria-hidden="true" />
                            )}
                            <span>{feature.label}</span>
                          </li>
                        ))}
                      </ul>

                      {selected ? (
                        <button
                          type="button"
                          className="fs-plan-action"
                          disabled
                        >
                          Your current plan
                        </button>
                      ) : plan.id === 'enterprise' && salesEmail ? (
                        <a
                          className="fs-plan-action"
                          href={`mailto:${salesEmail}?subject=${encodeURIComponent(
                            'FraudShield Enterprise enquiry'
                          )}`}
                        >
                          Contact sales
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="fs-plan-action"
                          onClick={() => onUpgrade?.(plan.id)}
                        >
                          {plan.id === 'pro'
                            ? 'Request Pro'
                            : plan.id === 'enterprise'
                              ? 'Enquire about Enterprise'
                              : 'Manage subscription'}
                        </button>
                      )}
                    </TiltPlanCard>
                  )
                })}
              </div>

              <p className="fs-plans-note">
                Pro and Enterprise are proposed offerings. Selecting
                a plan does not activate a paid subscription.
              </p>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </dialog>
  )
}
