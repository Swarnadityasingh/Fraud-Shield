import { useEffect, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'
import {
  ArrowRight,
  ShieldCheck,
  ScanLine,
  Search,
  SlidersHorizontal,
  BellRing,
  Menu,
  X,
  Github
} from 'lucide-react'
import { useWorkspaceTransition } from './WorkspaceTransition'
import './LandingPage.css'

const features = [
  {
    icon: ScanLine,
    title: 'See the risk behind the payment.',
    text: 'Analyze transaction amounts and types with a machine-learning model.',
    details: [
      'Enter a transaction amount and select its type.',
      'Get a machine-learning prediction.',
      'Review the predicted class and fraud probability.',
    ],
    label: 'TRANSACTION ANALYSIS',
  },
  {
    icon: SlidersHorizontal,
    title: 'Your thresholds. Your perspective.',
    text: 'Adjust risk thresholds and notification preferences in your workspace.',
    details: [
      'Configure risk thresholds in the workspace.',
      'Adjust notification preferences.',
      'Explore how threshold settings affect risk interpretation.',
    ],
    label: 'RISK CONFIGURATION',
  },
  {
    icon: BellRing,
    title: 'Keep important signals in view.',
    text: 'Review flagged analyses, risk classifications, and session history.',
    details: [
      'Review flagged transaction analyses.',
      'Understand risk classifications.',
      'Refer back to previous analyses in your session history.',
    ],
    label: 'ALERTS & HISTORY',
  },
]

const steps = [
  ['Enter a transaction', 'Choose a transaction type and enter its amount.'],
  ['Let the model analyze', 'Get a predicted class and fraud probability.'],
  ['Review the signal', 'Explore the result alongside your risk thresholds.'],
]

function WorkspaceLink({ children, className = '' }) {
  const openWorkspace = useWorkspaceTransition()

  return (
    <a
      href="/login"
      className={`fs-button ${className}`}
      onClick={openWorkspace}
    >
      {children}
    </a>
  )
}

function Reveal({ children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function MoneyVisual() {
  const reducedMotion = useReducedMotion()
  const animate = !reducedMotion

  return (
    <div className="fs-money-scene" aria-hidden="true">
      <div className="fs-orbit fs-orbit-outer" />
      <div className="fs-orbit fs-orbit-inner" />

      {[
        { value: '500', className: 'fs-note-one', rotation: -18 },
        { value: '200', className: 'fs-note-two', rotation: 16 },
        { value: '100', className: 'fs-note-three', rotation: -10 },
      ].map((note, index) => (
        <motion.div
          key={note.value}
          className={`fs-note ${note.className}`}
          animate={
            animate
              ? {
                  y: [0, -14, 0],
                  rotate: [
                    note.rotation,
                    note.rotation + 5,
                    note.rotation,
                  ],
                }
              : { y: 0, rotate: note.rotation }
          }
          transition={
            animate
              ? {
                  duration: 5 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.4,
                }
              : { duration: 0 }
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
        className="fs-shield"
        animate={
          animate
            ? { y: [0, -8, 0], rotate: [0, 2, 0] }
            : { y: 0, rotate: 0 }
        }
        transition={
          animate
            ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0 }
        }
      >
        <ShieldCheck size={94} strokeWidth={1.2} />
      </motion.div>

      <div className="fs-signal">
        <span className="fs-status-dot" />
        <div>
          <strong>Make every signal clearer.</strong>
          <small>Transaction risk intelligence</small>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  const handleNavigation = (event, targetId) => {
    event.preventDefault()
    setOpen(false)

    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <header className="fs-header">
      <div className="fs-container fs-nav">
        <a className="fs-brand" href="/" aria-label="FraudShield home">
          <ShieldCheck aria-hidden="true" />
          FraudShield<span>®</span>
        </a>

        <button
          className="fs-menu-toggle"
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          aria-controls="fs-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>

        <nav
          id="fs-navigation"
          className={`fs-nav-links ${open ? 'fs-nav-open' : ''}`}
          aria-label="Main navigation"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setOpen(false)
              event.currentTarget.previousElementSibling?.focus()
            }
          }}
        >
          <div className="fs-nav-pill">
            <a
              href="#features"
              onClick={(e) => handleNavigation(e, 'features')}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleNavigation(e, 'how-it-works')}
            >
              How it works
            </a>
            <a
              href="#security"
              onClick={(e) => handleNavigation(e, 'security')}
            >
              Security
            </a>
          </div>
          <div className="fs-header-actions">
            <WorkspaceLink className="fs-button-small">
              Open workspace <ArrowRight size={16} />
            </WorkspaceLink>
          </div>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="fs-footer">
      <div className="fs-container fs-footer-top">
        <div>
          <a className="fs-brand" href="/">
            <ShieldCheck aria-hidden="true" /> FraudShield
          </a>
          <p>A clearer view of financial risk.</p>
        </div>

        <nav aria-label="Footer navigation">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="/login">Workspace</a>
          <a
            className="fs-github-link"
            href="https://github.com/Swarnadityasingh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="FraudShield on GitHub (opens in a new tab)"
          >
            <Github size={18} aria-hidden="true" />
            GitHub
          </a>
        </nav>
      </div>

      <div className="fs-container fs-footer-bottom">
        <span>© {new Date().getFullYear()} FraudShield</span>
        <span>Educational prototype · Synthetic training data</span>
      </div>
    </footer>
  )
}

function TypewriterText() {
  const reducedMotion = useReducedMotion()
  const [typing, setTyping] = useState({
    wordIndex: 0,
    count: 0,
    deleting: false,
  })

  const word = typing.wordIndex === 0 ? 'risk' : 'fraud'

  useEffect(() => {
    if (reducedMotion) return

    const complete = typing.count === word.length
    const empty = typing.count === 0

    const delay = typing.deleting
      ? empty ? 250 : 85
      : complete ? 1800 : 140

    const timer = window.setTimeout(() => {
      setTyping((current) => {
        if (!current.deleting && current.count === word.length) {
          return { ...current, deleting: true }
        }

        if (current.deleting && current.count === 0) {
          return {
            wordIndex: current.wordIndex === 0 ? 1 : 0,
            count: 0,
            deleting: false,
          }
        }

        return {
          ...current,
          count: current.count + (current.deleting ? -1 : 1),
        }
      })
    }, delay)

    return () => window.clearTimeout(timer)
  }, [typing, word, reducedMotion])

  const activeWord = reducedMotion ? 'risk' : word
  const visibleWord = reducedMotion
    ? 'risk'
    : word.slice(0, typing.count)

  const effectsActive =
    !reducedMotion &&
    !typing.deleting &&
    typing.count === word.length

  return (
    <span
      className="fs-typewriter"
      aria-label="Spot the risk. Spot the fraud."
    >
      <span className="fs-typewriter-space" aria-hidden="true">
        Spot the fraud.
      </span>

      <span className="fs-typewriter-visible" aria-hidden="true">
        Spot the{' '}
        <motion.span
          className="fs-typewriter-word"
          data-word={activeWord}
          animate={
            effectsActive && activeWord === 'fraud'
              ? {
                  x: [0, -3, 3, -2, 2, 0],
                  rotate: [0, -2, 2, -1, 0],
                  textShadow: [
                    '0 0 0px #F8717100',
                    '0 0 18px #F8717199',
                    '0 0 0px #F8717100',
                  ],
                }
              : {
                  x: 0,
                  rotate: 0,
                  textShadow: '0 0 0px #F8717100',
                }
          }
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {visibleWord}
          <span className="fs-typewriter-cursor" />
          .

          {effectsActive && activeWord === 'fraud' && (
            <span className="fs-falling-money">
              {[
                { left: '10%', drift: -16, angle: -22 },
                { left: '32%', drift: 8, angle: 18 },
                { left: '54%', drift: -6, angle: -12 },
                { left: '76%', drift: 18, angle: 28 },
              ].map((note, index) => (
                <motion.span
                  key={index}
                  className="fs-falling-note"
                  style={{ left: note.left }}
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: -12,
                    rotate: 0,
                    scale: 0.65,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: note.drift,
                    y: [-12, 0, 18, 38],
                    rotate: note.angle,
                    scale: [0.65, 1, 1, 0.85],
                  }}
                  transition={{
                    duration: 1.15,
                    delay: index * 0.12,
                    ease: 'easeIn',
                  }}
                >
                  ₹
                </motion.span>
              ))}
            </span>
          )}

          {effectsActive && activeWord === 'risk' && (
            <>
              {[
                { left: '0%', x: 40, y: 0, angle: 20 },
                { left: '28%', x: -40, y: 0, angle: -20 },
                { left: '56%', x: 40, y: 0, angle: 20 },
              ].map((glass, index) => (
                <motion.span
                  key={index}
                  className="fs-risk-magnifier"
                  style={{ left: glass.left }}
                  initial={{
                    opacity: 0,
                    x: glass.x,
                    y: glass.y,
                    rotate: glass.angle,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: [0, 0.65, 0.65, 0],
                    x: [glass.x, 0, 6, glass.x * 0.4],
                    y: [glass.y, 0, 3, glass.y * 0.4],
                    rotate: [glass.angle, -8, 8, 0],
                    scale: [0.7, 1, 1, 0.85],
                  }}
                  transition={{
                    duration: 1.1,
                    delay: index * 0.3,
                    ease: 'easeInOut',
                    times: [0, 0.3, 0.75, 1],
                  }}
                >
                  <Search size={28} strokeWidth={2.4} />
                </motion.span>
              ))}
            </>
          )}
        </motion.span>
      </span>
    </span>
  )
}

export default function LandingPage({ theme }) {
  const [activeFeature, setActiveFeature] = useState(null)

  return (
    <div className="fs-landing" data-theme={theme}>
      <a className="fs-skip-link" href="#fs-main">Skip to content</a>
      <Header />

      <main id="fs-main">
        <section className="fs-container fs-hero">
          <Reveal className="fs-hero-copy">
            <p className="fs-eyebrow">
              <span className="fs-status-dot" /> FINANCIAL RISK INTELLIGENCE
            </p>

            <h1>
              Every transaction<br />
              tells a story.<br />
              <TypewriterText />
            </h1>

            <p className="fs-description">
              Turn transaction data into clearer risk signals.
              Explore machine-learning analysis in one focused workspace.
            </p>

            <div className="fs-actions">
              <WorkspaceLink>
                Explore the demo <ArrowRight size={18} />
              </WorkspaceLink>
              <a className="fs-text-link" href="#how-it-works">
                See how it works <span>↗</span>
              </a>
            </div>

            <p className="fs-caption">
              Demo access available. No real payment details needed.
            </p>
          </Reveal>

          <div className="fs-hero-art">
            <MoneyVisual />
          </div>
        </section>

        <div className="fs-capabilities">
          <div className="fs-container">
            <span>TRANSACTION ANALYSIS</span>
            <span>RISK CLASSIFICATION</span>
            <span>CONFIGURABLE ALERTS</span>
          </div>
        </div>

        <section id="features" className="fs-section fs-container">
          <Reveal>
            <p className="fs-eyebrow">A CLEARER PICTURE</p>
            <h2>Less noise.<br />More understanding.</h2>
          </Reveal>

          <div className="fs-feature-grid">
  {features.map((feature, index) => {
    const Icon = feature.icon
    const isActive = activeFeature === index

    return (
      <Reveal key={feature.title} delay={index * 0.08}>
        <article
          className={`fs-feature ${isActive ? 'fs-feature-active' : ''}`}
        >
          <button
            type="button"
            className="fs-feature-trigger"
            aria-expanded={isActive}
            onClick={() =>
              setActiveFeature(isActive ? null : index)
            }
          >
            <span className="fs-feature-icon">
              <Icon size={26} aria-hidden="true" />
            </span>

            <span className="fs-feature-label">
              {feature.label}
            </span>

            <h3>{feature.title}</h3>

            <p>{feature.text}</p>

            <span className="fs-feature-action">
              {isActive ? 'Show less' : 'Explore feature'}
              <motion.span
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                ↓
              </motion.span>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {isActive && (
              <motion.div
                className="fs-feature-details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.35,
                  ease: 'easeInOut',
                }}
              >
                <div className="fs-feature-details-inner">
                  <span>WHAT YOU CAN EXPLORE</span>

                  <ul>
                    {feature.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </article>
      </Reveal>
    )
  })}
</div>
        </section>

        <section id="how-it-works" className="fs-workflow">
          <div className="fs-container fs-section">
            <Reveal>
              <p className="fs-eyebrow">FROM INPUT TO INSIGHT</p>
              <h2>Three steps to a clearer signal.</h2>
            </Reveal>

            <div className="fs-steps">
              {steps.map(([title, text], index) => (
                <Reveal key={title} delay={index * 0.1}>
                  <span className="fs-step-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="security" className="fs-section fs-container">
          <Reveal className="fs-security">
            <div className="fs-security-icon">
              <ShieldCheck size={66} strokeWidth={1.3} aria-hidden="true" />
            </div>
            <div>
              <p className="fs-eyebrow">EXPLORE WITH CONFIDENCE</p>
              <h2>Understand the signal.<br />Know its limits.</h2>
              <p>
                Explore the demo with sample amounts and transaction types.
                No bank connection or card details are required.
                The model is trained on synthetic data: its predictions
                support exploration and are not proof of fraud.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="fs-container fs-cta">
          <Reveal>
            <p className="fs-eyebrow">SEE IT IN ACTION</p>
            <h2>Your next insight<br />starts with a transaction.</h2>
            <a className="fs-button" href="/login">
              Open demo workspace <ArrowRight size={18} />
            </a>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  )
}