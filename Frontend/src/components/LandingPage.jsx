import { useEffect, useRef, useState } from 'react'
import {
  SiReact,
  SiVite,
  SiTailwindcss,
  SiFramer,
  SiPython,
  SiFastapi,
  SiScikitlearn,
} from 'react-icons/si'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Search,
  Landmark,
  ChartNoAxesCombined,
  History,
  ListFilter,
  FileSearch,
  Menu,
  Linkedin,
  Mail,
  Github,
  ChevronDown,
  CheckCircle2,
  X
} from 'lucide-react'
import { useWorkspaceTransition } from './WorkspaceTransition'
import './LandingPage.css'

const features = [
  {
    id: 'fraud-detection',
    icon: ShieldAlert,
    title: 'Intelligent Fraud Detection',
    text: 'Identify potentially fraudulent transactions through machine-learning predictions.',
    label: 'IEEE-CIS MODEL',
    accent: 'blue',
    cta: 'Run Fraud Analysis',
    description: 'Powered by advanced Random Forest models trained on IEEE-CIS transaction benchmarks to catch anomalous payments instantly.',
    highlights: [
      'Real-time probability scoring and risk classification.',
      'Automatic prediction record logging in PostgreSQL database.',
      'Strict feature schema validation to prevent payload mismatches.',
      'Detailed breakdown of suspicious vs. legitimate indicators.'
    ],
  },
  {
    id: 'credit-risk',
    icon: Landmark,
    title: 'Credit Risk Assessment',
    text: 'Evaluate credit-related risk using a dedicated machine-learning model.',
    label: 'CREDIT RISK MODEL',
    accent: 'amber',
    cta: 'Assess Credit Risk',
    description: 'Assess borrower reliability and serious delinquency risks using benchmark financial datasets.',
    highlights: [
      'Give Me Some Credit dataset training architecture.',
      'Granular risk-level tiering (Low, Medium, High).',
      'Seamless database persistence with transaction rollback safety.',
      'FastAPI backend endpoint integration.'
    ],
  },
  {
    id: 'prediction-insights',
    icon: ChartNoAxesCombined,
    title: 'Prediction Insights',
    text: 'Understand prediction outcomes through probability scores and risk classifications.',
    label: 'MODEL OUTPUTS',
    accent: 'blue',
    cta: 'Explore Performance Metrics',
    description: 'Deep dive into probability metrics and model confidence thresholds for every executed prediction.',
    highlights: [
      'Precise probability percentage calculations.',
      'Visual risk-level badges and labels.',
      'Instant model status health verification.',
      'Transparent feature importance mapping.'
    ],
  },
  {
    id: 'investigation-history',
    icon: History,
    title: 'Investigation History',
    text: 'Revisit previously recorded fraud and credit risk prediction results.',
    label: 'RECORD ARCHIVE',
    accent: 'amber',
    cta: 'View Investigation History',
    description: 'Maintain a complete audit trail of all historical model predictions executed across your sessions.',
    highlights: [
      'Chronological record sorting by creation timestamp.',
      'Model type segregation (Fraud vs. Credit Risk).',
      'Quick retrieval of past history IDs and results.',
      'Secure database state management.'
    ],
  },
  {
    id: 'history-filters',
    icon: ListFilter,
    title: 'Advanced History Filters',
    text: 'Find relevant prediction records using filtering and pagination.',
    label: 'RECORD MANAGEMENT',
    accent: 'blue',
    cta: 'Refine Your Investigation',
    description: 'Easily navigate through extensive prediction logs using robust filtering parameters and pagination controls.',
    highlights: [
      'Customizable limits and offsets for record browsing.',
      'Model-specific query filtering.',
      'High-performance SQL query optimization.',
      'Clean tabular data rendering.'
    ],
  },
  {
    id: 'analysis-records',
    icon: FileSearch,
    title: 'Detailed Analysis Records',
    text: 'Open individual prediction records and inspect their stored results.',
    label: 'CASE DETAILS',
    accent: 'amber',
    cta: 'Access Case Details',
    description: 'Inspect individual investigation case files with complete metadata and probability breakdowns.',
    highlights: [
      'Direct endpoint lookups via unique history IDs.',
      'Comprehensive JSON response payload inspection.',
      'Detailed error handling and 404 safeguards.',
      'Export-ready investigation logs.'
    ],
  },
]

const faqs = [
  {
    question: 'What does FraudShield offer?',
    answer:
      'FraudShield analyzes transaction amounts and types using a machine-learning model. It presents a predicted classification and fraud probability while helping you review risk thresholds, flagged analyses, and recent activity.',
  },
  {
    question: 'How does FraudShield detect suspicious transactions?',
    answer:
      'The application sends transaction details to a trained machine-learning model, which examines patterns in the supplied data and returns a risk prediction with an estimated fraud probability.',
  },
  {
    question: 'Are FraudShield predictions definitive proof of fraud?',
    answer:
      'No. Predictions are risk signals intended to support investigation and learning. A flagged transaction should be reviewed with additional information before any decision is made.',
  },
  {
    question: 'Do I need to provide bank or card details?',
    answer:
      'No. FraudShield only requires the transaction information shown in the workspace, such as the amount and transaction type. It does not require bank credentials or card numbers.',
  },
  {
    question: 'Who is FraudShield designed for?',
    answer:
      'FraudShield is designed for students, developers, analysts, and teams who want to explore how machine learning can support financial risk analysis through a clear and interactive interface.',
  },
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

function TechStack() {
  const marketingPhrases = [
    'INVESTIGATE',
    'VALIDATE',
    'ANALYZE',
    'UNDERSTAND',
    'DETECT ANOMALIES',
    'ASSESS RISK',
    'SECURE TRANSACTIONS'
  ]

  return (
    <section className="fs-tech-section" aria-label="Platform highlights">
      <div
        className="fs-tech-window"
        tabIndex={0}
        aria-label="Platform highlights ticker. Focus or hover to pause scrolling."
      >
        <div className="fs-tech-track">
          {[0, 1].map((copy) => (
            <ul
              className="fs-tech-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {marketingPhrases.map((phrase, index) => (
                <li className="fs-tech-item" key={index}>
                  <span className="fs-ticker-dot" />
                  <span>{phrase}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
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

const investigationSlides = [
  {
    image: '/images/fraud-investigation-hero.png',
    eyebrow: 'FRAUD INVESTIGATION',
    title: 'Trace the hidden pattern',
    text: 'Every suspicious signal leaves a trail.',
  },
  {
    image: '/images/fraudshield-transaction-network.png',
    eyebrow: 'TRANSACTION NETWORK',
    title: 'Connect every signal',
    text: 'Follow relationships across financial activity.',
  },
  {
    image: '/images/fraud-investigation-network.png',
    eyebrow: 'RISK INTELLIGENCE',
    title: 'See risk before it spreads',
    text: 'Turn complex behavior into clearer insight.',
  },
]

export function FraudInvestigationScene() {
  const reducedMotion = useReducedMotion()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (reducedMotion) return undefined

    const interval = window.setInterval(() => {
      setActiveSlide((current) =>
        (current + 1) % investigationSlides.length
      )
    }, 3000)

    return () => window.clearInterval(interval)
  }, [reducedMotion])

  return (
    <div
      className="fs-case-slider"
      role="region"
      aria-label="FraudShield intelligence carousel"
    >
      <div className="fs-case-cards">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={investigationSlides[activeSlide].image}
            className="fs-case-card fs-case-card-active"
            initial={
              reducedMotion
                ? false
                : {
                    x: '100%',
                    opacity: 0,
                  }
            }
            animate={{
              x: '0%',
              opacity: 1,
            }}
            exit={{
              x: '-100%',
              opacity: 0,
            }}
            transition={{
              x: {
                duration: reducedMotion ? 0 : 0.9,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: reducedMotion ? 0 : 0.55,
              },
            }}
          >
            <img
              src={investigationSlides[activeSlide].image}
              alt={investigationSlides[activeSlide].title}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function LandingFraudInvestigationScene() {
  const reducedMotion = useReducedMotion()
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (reducedMotion) return undefined

    const interval = window.setInterval(() => {
      setActiveSlide(
        (current) => (current + 1) % investigationSlides.length
      )
    }, 4500)

    return () => window.clearInterval(interval)
  }, [reducedMotion])

  function getPosition(index) {
    let position =
      (index - activeSlide + investigationSlides.length) %
      investigationSlides.length

    if (position > 1) {
      position -= investigationSlides.length
    }

    return position
  }

  return (
    <div
      className="fs-case-slider"
      role="region"
      aria-label="FraudShield intelligence carousel"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={investigationSlides[activeSlide].image}
          className="fs-case-background"
          style={{
            backgroundImage: `url(${investigationSlides[activeSlide].image})`,
          }}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reducedMotion ? 0 : 0.8,
            ease: 'easeOut',
          }}
        />
      </AnimatePresence>

      <div className="fs-case-shade" />

      <div className="fs-case-cards">
        {investigationSlides.map((slide, index) => {
          const position = getPosition(index)
          const isActive = position === 0

          return (
            <motion.button
              type="button"
              key={slide.image}
              className={`fs-case-card ${
                isActive ? 'fs-case-card-active' : ''
              }`}
              onClick={() => setActiveSlide(index)}
              animate={{
                x: `${position * 78}%`,
                scale: isActive ? 1 : 0.78,
                rotateY: position * -13,
                opacity: isActive ? 1 : 0.58,
                zIndex: isActive ? 3 : 1,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-label={`Show ${slide.title}`}
            >
              <img src={slide.image} alt="" />

              <motion.div
                className="fs-case-card-content"
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 14,
                }}
                transition={{
                  duration: 0.4,
                  delay: isActive ? 0.25 : 0,
                }}
              >
                <span>{slide.eyebrow}</span>
                <strong>{slide.title}</strong>
                <p>{slide.text}</p>
              </motion.div>
            </motion.button>
          )
        })}
      </div>

      <div className="fs-case-dots">
        {investigationSlides.map((slide, index) => (
          <button
            type="button"
            key={slide.title}
            className={index === activeSlide ? 'fs-case-dot-active' : ''}
            aria-label={`Open slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

function FeatureVisual({ feature }) {
  const visuals = {
    'fraud-detection': {
      eyebrow: 'TRANSACTION INTELLIGENCE',
      heading: 'Transaction Signal Analysis',
      type: 'network',
      items: ['Transaction data', 'Feature validation', 'Fraud prediction'],
    },
    'credit-risk': {
      eyebrow: 'CREDIT INTELLIGENCE',
      heading: 'Borrower Risk Assessment',
      type: 'risk',
      items: ['Credit history', 'Financial indicators', 'Risk classification'],
    },
    'prediction-insights': {
      eyebrow: 'MODEL OUTPUTS',
      heading: 'Prediction Breakdown',
      type: 'insights',
      items: ['Predicted classification', 'Probability score', 'Risk level'],
    },
    'investigation-history': {
      eyebrow: 'RECORD ARCHIVE',
      heading: 'Prediction History',
      type: 'history',
      items: ['Fraud prediction', 'Credit risk prediction', 'Record retrieval'],
    },
    'history-filters': {
      eyebrow: 'RECORD MANAGEMENT',
      heading: 'Explore Prediction Records',
      type: 'filters',
      items: ['Model type filter', 'Record limits', 'Paginated results'],
    },
    'analysis-records': {
      eyebrow: 'CASE DETAILS',
      heading: 'Individual Case File',
      type: 'case',
      items: ['History ID', 'Prediction details', 'Stored result'],
    },
  }

  const visual = visuals[feature.id]

  if (!visual) return null

  return (
    <div className={`fs-visual fs-visual-${visual.type}`}>
      <div className="fs-visual-heading">
        <span>{visual.eyebrow}</span>
        <h3>{visual.heading}</h3>
      </div>

      {visual.type === 'network' && (
        <div className="fs-visual-network">
          <div className="fs-network-node">TRANSACTION</div>
          <div className="fs-network-lines">
            <span />
            <span />
            <span />
          </div>
          <div className="fs-network-results">
            {['FEATURES', 'MODEL', 'OUTPUT'].map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </div>
      )}

      {visual.type === 'risk' && (
        <div className="fs-visual-risk">
          <div className="fs-risk-orbit">
            <Landmark size={42} />
          </div>
          <div className="fs-risk-levels">
            {['LOW', 'MEDIUM', 'HIGH'].map((item, index) => (
              <div key={item} className={`fs-risk-level level-${index}`}>
                <span />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {visual.type === 'insights' && (
        <div className="fs-visual-insights">
          <div className="fs-insight-card">
            <ChartNoAxesCombined size={30} />
            <span>PREDICTION OUTPUT</span>
            <strong>Classification</strong>
          </div>
          <div className="fs-insight-card">
            <ShieldCheck size={30} />
            <span>RISK INDICATOR</span>
            <strong>Risk level</strong>
          </div>
        </div>
      )}

      {visual.type === 'history' && (
        <div className="fs-visual-history">
          {visual.items.map((item, index) => (
            <div className="fs-history-row" key={item}>
              <History size={19} />
              <span>{item}</span>
              <small>{`0${index + 1}`}</small>
            </div>
          ))}
        </div>
      )}

      {visual.type === 'filters' && (
        <div className="fs-visual-filters">
          <div className="fs-filter-chip">
            <ListFilter size={17} /> Model type
          </div>
          <div className="fs-filter-chip">
            <History size={17} /> Records
          </div>
          <div className="fs-filter-results">
            {visual.items.map((item) => (
              <div key={item}>
                <CheckCircle2 size={17} />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {visual.type === 'case' && (
        <div className="fs-visual-case">
          <div className="fs-case-icon">
            <FileSearch size={42} />
          </div>
          {visual.items.map((item, index) => (
            <div className="fs-case-row" key={item}>
              <span>{`0${index + 1}`}</span>
              <strong>{item}</strong>
              <ArrowRight size={17} />
            </div>
          ))}
        </div>
      )}

      <div className="fs-visual-footer">
        <span className="fs-status-dot" />
        ILLUSTRATIVE INTERFACE PREVIEW
      </div>
    </div>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY)

    function handleScroll() {
      const currentY = Math.max(0, window.scrollY)

      if (currentY <= 80) {
        setHidden(false)
        previousY = currentY
        return
      }

      if (Math.abs(currentY - previousY) < 8) return

      setHidden(currentY > previousY)
      previousY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavigation = (event, targetId) => {
    event.preventDefault()
    setOpen(false)

    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <header className={`fs-header${hidden && !open ? ' fs-header-hidden' : ''}`}>
      <div className="fs-container fs-nav">
        <a className="fs-brand" href="/" aria-label="FraudShield home">
          <img
            src="/branding/fraudshield-wordmark.png"
            alt="FraudShield - Financial Risk Intelligence"
            className="fs-brand-logo"
          />
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
              href="#faqs"
              onClick={(e) => handleNavigation(e, 'faqs')}
            >
              FAQs
            </a>
          </div>
          <div className="fs-header-actions">
  <a href="/login" className="fs-login-link">
    Login
  </a>

  <a
    href="/login?mode=signup"
    className="fs-button fs-button-small"
  >
    Open Workspace <ArrowRight size={16} />
  </a>
</div>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  const openWorkspace = useWorkspaceTransition()

  const handleNavigation = (event, targetId) => {
    event.preventDefault()
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <footer className="fs-footer">
      <div className="fs-container fs-footer-top">

        <div className="fs-footer-brand">
          <div className="fs-footer-brand-heading">
            <a className="fs-footer-brand-name" href="/">
              FraudShield
            </a>
            <span className="fs-version">Version 1.0.0</span>
          </div>

          <p>
            A clearer view of financial risk and transaction intelligence.
          </p>

          <div className="fs-footer-socials">
            <a
              href="https://github.com/Swarnadityasingh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FraudShield GitHub"
            >
              <Github size={19} />
            </a>

            <a
              href="https://www.linkedin.com/in/arpit-srivastava-wd"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <Linkedin size={19} />
            </a>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=arpitsrivastava1101@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Send an email"
            >
              <Mail size={19} />
            </a>
          </div>
        </div>

        <div className="fs-footer-column">
          <h4>EXPLORE</h4>
          <nav aria-label="Explore navigation">
            <a href="#features" onClick={(e) => handleNavigation(e, 'features')}>Features</a>
            <a href="#how-it-works" onClick={(e) => handleNavigation(e, 'how-it-works')}>How it works</a>
            <a href="/login" onClick={openWorkspace}>Workspace</a>
          </nav>
        </div>

        <div className="fs-footer-column">
          <h4>TECHNOLOGY</h4>
          <div className="fs-footer-tech">
            <span>React</span>
            <span>FastAPI</span>
            <span>PostgreSQL</span>
          </div>
        </div>

      </div>

      <div className="fs-container fs-footer-bottom">
        <span>© {new Date().getFullYear()} FraudShield</span>
        <span>Proudly Built in India 🇮🇳</span>
      </div>
    </footer>
  );
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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const featuresScrollY = useRef(0)
  const returningToFeatures = useRef(false)
  const reducedMotion = useReducedMotion()
  const { scrollY } = useScroll()

  const heroBackgroundY = useTransform(scrollY, [0, 850], reducedMotion ? [0, 0] : [0, 170])
  const heroCopyY = useTransform(scrollY, [0, 850], reducedMotion ? [0, 0] : [0, -55])
  const heroArtY = useTransform(scrollY, [0, 850], reducedMotion ? [0, 0] : [0, -105])

  useEffect(() => {
    if (selectedFeature) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    if (returningToFeatures.current) {
      const frame = requestAnimationFrame(() => {
        window.scrollTo(0, featuresScrollY.current)
        returningToFeatures.current = false
      })

      return () => cancelAnimationFrame(frame)
    }
  }, [selectedFeature])

  return (
    <div className="fs-landing" data-theme="dark">
      <a className="fs-skip-link" href="#fs-main">Skip to content</a>

      {!selectedFeature && <Header />}

      <main id="fs-main">
        {selectedFeature ? (
          <motion.section
            className="fs-section fs-container"
            initial={
              reducedMotion
                ? false
                : { opacity: 0, y: 28, scale: 0.985 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1]
            }}
            style={{
              minHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <div style={{ marginBottom: '40px' }}>
              <button
                type="button"
                className="fs-button fs-button-small"
                onClick={() => {
                  returningToFeatures.current = true
                  setSelectedFeature(null)
                }}
                style={{ background: 'var(--fs-surface)', color: 'var(--fs-text)', border: '1px solid var(--fs-border)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} /> Back to Platform
              </button>
            </div>

            <div className="fs-faq-layout" style={{ alignItems: 'center' }}>
              <div className="fs-faq-sidebar">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'var(--fs-surface)', border: '1px solid var(--fs-border)', marginBottom: '20px' }}>
                  <selectedFeature.icon size={18} style={{ color: 'var(--fs-mint)' }} />
                  <span style={{ fontSize: '12px', fontFamily: 'ui-monospace, monospace', letterSpacing: '1px' }}>{selectedFeature.label}</span>
                </div>

                <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 54px)', lineHeight: '1.1', fontWeight: 600, margin: '0 0 20px 0', letterSpacing: '-2px' }}>
                  {selectedFeature.title}
                </h1>

                <p style={{ color: 'var(--fs-muted)', fontSize: '16px', lineHeight: '1.75', marginBottom: '32px' }}>
                  {selectedFeature.description}
                </p>

                <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
                  {selectedFeature.highlights.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: 'var(--fs-text)', fontSize: '15px' }}>
                      <CheckCircle2 size={20} style={{ color: '#34D399', flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <WorkspaceLink>
                  {selectedFeature.cta} <ArrowRight size={18} />
                </WorkspaceLink>
              </div>

              <div style={{ border: '1px solid var(--fs-border)', borderRadius: '16px', background: '#070D18', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--fs-surface)', borderBottom: '1px solid var(--fs-border)' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FBBF24' }} />
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#34D399' }} />
                  </div>
                  <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: '11px', color: 'var(--fs-muted)', letterSpacing: '1px' }}>
                    fraudshield.io/features/{selectedFeature.id}
                  </span>
                  <div style={{ width: '36px' }} />
                </div>

                <div style={{ padding: '24px', background: 'radial-gradient(circle at center, #0B1424 0%, #070D18 100%)' }}>
                  <FeatureVisual feature={selectedFeature} />
                </div>
              </div>
            </div>
          </motion.section>
        ) : (
          <>
            <div className="fs-hero-stage">
              <motion.div
                className="fs-hero-parallax-background"
                style={reducedMotion ? undefined : { y: heroBackgroundY }}
                initial={reducedMotion ? false : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
              <section className="fs-container fs-hero">
                <motion.div
                  className="fs-hero-copy-motion"
                  style={{ y: heroCopyY }}
                  initial={reducedMotion ? false : { opacity: 0, x: -45 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
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
                      <a className="fs-button" href="#how-it-works" onClick={(e) => {
                        e.preventDefault()
                        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}>
                        Explore How It Works
                      </a>
                    </div>
                  </Reveal>
                </motion.div>

                <motion.div
                  className="fs-hero-art"
                  style={{ y: heroArtY }}
                  initial={reducedMotion ? false : { opacity: 0, x: 55, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <LandingFraudInvestigationScene />
                </motion.div>
              </section>
            </div>

            <TechStack />

            <section className="fs-section fs-container fs-investigation-intro">
              <div className="fs-investigation-intro-grid">
                <Reveal className="fs-investigation-intro-art">
                  <img
                    src="/images/fraudshield-transaction-network.png"
                    alt="FraudShield global transaction network and real-time anomaly detection dashboard"
                    loading="lazy"
                  />
                  <span className="fs-investigation-caption">
                    INTELLIGENCE FILE · 001
                  </span>
                </Reveal>

                <Reveal className="fs-investigation-intro-copy">
                  <p className="fs-eyebrow">
                    <span className="fs-status-dot" />
                    THE INVESTIGATION BEGINS
                  </p>

                  <h2>
                    Every clue has
                    <br />
                    a connection.
                  </h2>

                  <p>
                    Financial activity can leave behind signals that deserve
                    a closer look. FraudShield brings machine learning-based
                    fraud detection and credit risk assessment into one
                    financial intelligence workspace.
                  </p>

                  <div className="fs-investigation-signals">
                    <div>
                      <strong>01</strong>
                      <span>Transaction Signals</span>
                    </div>
                    <div>
                      <strong>02</strong>
                      <span>Pattern Analysis</span>
                    </div>
                    <div>
                      <strong>03</strong>
                      <span>Risk Indicators</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </section>

            <section id="features" className="fs-section fs-container">
              <Reveal style={{ textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '999px', border: '1px solid var(--fs-border)', background: 'var(--fs-surface)', color: 'var(--fs-mint)', fontSize: '11px', fontWeight: 650, letterSpacing: '2px', marginBottom: '20px' }}>
                  FEATURES
                </div>
                <h2>Built for modern financial intelligence.</h2>
                <p style={{ color: 'var(--fs-muted)', fontSize: '16px', marginTop: '12px' }}>
                  Everything you need to analyze, track, and secure transactions with FraudShield.
                </p>
              </Reveal>

              <div className="fs-feature-grid" style={{ marginTop: '50px' }}>
                {features.map((feature, index) => {
                  const Icon = feature.icon

                  return (
                    <Reveal key={feature.id} delay={index * 0.08}>
                      <article className={`fs-feature fs-feature-${feature.accent}`}>
                        <button
                          type="button"
                          className="fs-feature-trigger"
                          onClick={() => {
                            featuresScrollY.current = window.scrollY
                            setSelectedFeature(feature)
                          }}
                          style={{ width: '100%', background: 'transparent', border: 0, textAlign: 'left', cursor: 'pointer', color: 'inherit', padding: 0 }}
                        >
                          <span className="fs-feature-icon">
                            <Icon size={27} strokeWidth={2} aria-hidden="true" />
                          </span>

                          <span className="fs-feature-label">
                            {feature.label}
                          </span>

                          <h3>{feature.title}</h3>

                          <p>{feature.text}</p>

                          <span className="fs-feature-action">
                            <span className="fs-feature-arrow">
                              <ArrowRight size={21} />
                            </span>
                          </span>
                        </button>
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
                  <p style={{ color: 'var(--fs-muted)', fontSize: '16px', marginTop: '10px' }}>
                    From selecting an analysis model to understanding its prediction, follow a clear path through financial risk intelligence.
                  </p>
                </Reveal>

                <div className="fs-steps">
                  <Reveal>
                    <article className="fs-step">
                      <div className="fs-step-header">
                        <span className="fs-step-number">01</span>
                        <ShieldAlert size={26} />
                      </div>
                      <p className="fs-step-label">SELECT MODEL</p>
                      <h3>Choose your investigation.</h3>
                      <p>Select the type of financial analysis you want to perform.</p>
                      <div className="fs-step-models">
                        <div className="fs-step-model">
                          <ShieldAlert size={20} />
                          <div>
                            <strong>Fraud Detection</strong>
                            <span>IEEE-CIS Model</span>
                          </div>
                        </div>
                        <div className="fs-step-model">
                          <Landmark size={20} />
                          <div>
                            <strong>Credit Risk</strong>
                            <span>Give Me Some Credit</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <article className="fs-step">
                      <div className="fs-step-header">
                        <span className="fs-step-number">02</span>
                        <ChartNoAxesCombined size={26} />
                      </div>
                      <p className="fs-step-label">MODEL ANALYSIS</p>
                      <h3>Let intelligence do the work.</h3>
                      <p>Submit the required information. The selected model processes the input through its dedicated prediction pipeline.</p>
                      <div className="fs-step-process">
                        <div><span>01</span> Input validation</div>
                        <div><span>02</span> Machine learning analysis</div>
                        <div><span>03</span> Prediction generation</div>
                      </div>
                    </article>
                  </Reveal>

                  <Reveal delay={0.2}>
                    <article className="fs-step">
                      <div className="fs-step-header">
                        <span className="fs-step-number">03</span>
                        <ShieldCheck size={26} />
                      </div>
                      <p className="fs-step-label">REVIEW RESULTS</p>
                      <h3>Turn predictions into insights.</h3>
                      <p>Review the model's output and understand the risk signals generated by the analysis.</p>
                      <div className="fs-step-results">
                        <div><CheckCircle2 size={18} /> Predicted classification</div>
                        <div><CheckCircle2 size={18} /> Probability score</div>
                        <div><CheckCircle2 size={18} /> Risk level</div>
                        <div><CheckCircle2 size={18} /> Recorded prediction</div>
                      </div>
                    </article>
                  </Reveal>
                </div>
              </div>
            </section>

            <section id="faqs" className="fs-section fs-container fs-faq-section">
              <div className="fs-faq-layout">
                <Reveal className="fs-faq-sidebar">
                  <p className="fs-eyebrow">
                    <span className="fs-status-dot" />
                    INSIDE THE INVESTIGATION
                  </p>

                  <h2>Frequently Asked Questions</h2>

                  <p className="fs-faq-intro">
                    Everything you need to know about FraudShield,
                    its intelligence and financial risk analysis.
                  </p>

                  <div className="fs-faq-image-frame">
                    <img
                      src="/images/fraud-investigation-network.png"
                      alt="FraudShield investigation board with connected financial evidence and transaction network"
                      loading="lazy"
                    />
                    <div className="fs-faq-image-overlay">
                      <span>INVESTIGATION BOARD</span>
                      <strong>CASE FILE · 001</strong>
                    </div>
                  </div>
                </Reveal>

                <div className="fs-faq-content">
                  <div className="fs-faq-list">
                    {faqs.map((faq, index) => {
                      const isOpen = openFaq === index

                      return (
                        <Reveal key={faq.question} delay={index * 0.05}>
                          <div className={`fs-faq-item ${isOpen ? 'fs-faq-open' : ''}`}>
                            <button
                              type="button"
                              className="fs-faq-question"
                              aria-expanded={isOpen}
                              aria-controls={`faq-answer-${index}`}
                              onClick={() => setOpenFaq(isOpen ? null : index)}
                            >
                              <span>{faq.question}</span>

                              <motion.span
                                className="fs-faq-chevron"
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.25 }}
                              >
                                <ChevronDown size={22} aria-hidden="true" />
                              </motion.span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  id={`faq-answer-${index}`}
                                  className="fs-faq-answer"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                  <p>{faq.answer}</p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </Reveal>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="fs-container fs-cta">
              <Reveal>
                <p className="fs-eyebrow">THE NEXT MOVE IS YOURS</p>

                <h2>
                  See beyond the numbers.
                  <br />
                  Understand the risk.
                </h2>

                <p className="fs-cta-description">
                  Explore intelligent fraud detection and credit risk
                  assessment through one unified workspace.
                </p>

                <div className="fs-cta-highlights">
                  <div>
                    <ShieldAlert size={19} />
                    <span>Two Independent Models</span>
                  </div>

                  <div>
                    <ChartNoAxesCombined size={19} />
                    <span>Machine Learning Intelligence</span>
                  </div>

                  <div>
                    <ShieldCheck size={19} />
                    <span>Prediction Insights</span>
                  </div>
                </div>

                <WorkspaceLink style={{ marginTop: '30px' }}>
                  Scan a Transaction <ArrowRight size={16} />
                </WorkspaceLink>
              </Reveal>
            </section>
          </>
        )}
      </main>

      {!selectedFeature && <Footer />}
    </div>
  )
}
