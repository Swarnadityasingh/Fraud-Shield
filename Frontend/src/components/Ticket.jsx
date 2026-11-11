import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import './Ticket.css'

const ticketClipPath = `polygon(
  0 var(--ticket-corner-size),
  var(--ticket-corner-size) 0,
  calc(100% - var(--ticket-corner-size)) 0,
  100% var(--ticket-corner-size),
  100% calc(100% - var(--ticket-stub-height) - var(--ticket-notch-size)),
  calc(100% - var(--ticket-notch-size)) calc(100% - var(--ticket-stub-height)),
  100% calc(100% - var(--ticket-stub-height) + var(--ticket-notch-size)),
  100% calc(100% - var(--ticket-corner-size)),
  calc(100% - var(--ticket-corner-size)) 100%,
  var(--ticket-corner-size) 100%,
  0 calc(100% - var(--ticket-corner-size)),
  0 calc(100% - var(--ticket-stub-height) + var(--ticket-notch-size)),
  var(--ticket-notch-size) calc(100% - var(--ticket-stub-height)),
  0 calc(100% - var(--ticket-stub-height) - var(--ticket-notch-size))
)`

function toCssLength(value) {
  return typeof value === 'number' ? `${value}px` : value
}

export default function Ticket({
  body,
  stub,
  ariaLabel,
  className = '',
  bodyClassName = '',
  stubClassName = '',
  cornerSize = 16,
  notchSize = 12,
  stubHeight = '22%',
  ink = '#e2e8f0',
  paper = '#172235',
  tilt = true,
  scale = 1.025,
  style = {},
}) {
  const reducedMotion = useReducedMotion()
  const rotateXValue = useMotionValue(0)
  const rotateYValue = useMotionValue(0)

  const rotateX = useSpring(rotateXValue, {
    stiffness: 220,
    damping: 24,
  })

  const rotateY = useSpring(rotateYValue, {
    stiffness: 220,
    damping: 24,
  })

  function handlePointerMove(event) {
    if (!tilt || reducedMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const horizontal = (event.clientX - bounds.left) / bounds.width
    const vertical = (event.clientY - bounds.top) / bounds.height

    rotateXValue.set((0.5 - vertical) * 10)
    rotateYValue.set((horizontal - 0.5) * 10)
  }

  function resetTilt() {
    rotateXValue.set(0)
    rotateYValue.set(0)
  }

  const rootStyle = {
    '--ticket-corner-size': toCssLength(cornerSize),
    '--ticket-notch-size': toCssLength(notchSize),
    '--ticket-stub-height': toCssLength(stubHeight),
    '--ticket-paper': paper,
    '--ticket-ink': ink,
    ...style,
  }

  return (
    <div
      className={`ticket-root ${className}`}
      style={rootStyle}
    >
      <motion.article
        className="ticket"
        aria-label={ariaLabel}
        style={{
          clipPath: ticketClipPath,
          rotateX,
          rotateY,
        }}
        whileHover={
          tilt && !reducedMotion
            ? { scale }
            : undefined
        }
        transition={{
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div className={`ticket-body ${bodyClassName}`}>
          {body}
          <span className="ticket-divider" aria-hidden="true" />
        </div>

        <div className={`ticket-stub ${stubClassName}`}>
          {stub}
        </div>
      </motion.article>
    </div>
  )
}