import { useEffect, useRef, useState } from 'react'
import './LandingPageIntro.css'

const words = ['Check', 'before', 'you', 'trust.']

const sparkles = [
  { x: '12%', y: '23%', size: 5, delay: '0s' },
  { x: '22%', y: '67%', size: 3, delay: '0.4s' },
  { x: '31%', y: '34%', size: 4, delay: '0.8s' },
  { x: '42%', y: '75%', size: 6, delay: '0.2s' },
  { x: '51%', y: '19%', size: 3, delay: '1s' },
  { x: '61%', y: '62%', size: 5, delay: '0.6s' },
  { x: '72%', y: '29%', size: 4, delay: '1.2s' },
  { x: '81%', y: '70%', size: 3, delay: '0.3s' },
  { x: '89%', y: '39%', size: 6, delay: '0.9s' },
  { x: '17%', y: '48%', size: 3, delay: '1.4s' },
  { x: '68%', y: '82%', size: 4, delay: '0.5s' },
  { x: '38%', y: '13%', size: 3, delay: '1.1s' },
]

const moneyNotes = [
  { x: '8%', y: '72%', rotate: '-18deg', delay: '0s' },
  { x: '17%', y: '24%', rotate: '12deg', delay: '0.35s' },
  { x: '28%', y: '81%', rotate: '-8deg', delay: '0.7s' },
  { x: '39%', y: '18%', rotate: '20deg', delay: '0.2s' },
  { x: '52%', y: '76%', rotate: '-15deg', delay: '0.55s' },
  { x: '64%', y: '22%', rotate: '9deg', delay: '0.9s' },
  { x: '74%', y: '79%', rotate: '16deg', delay: '0.4s' },
  { x: '86%', y: '31%', rotate: '-12deg', delay: '0.75s' },
  { x: '93%', y: '70%', rotate: '8deg', delay: '0.1s' },
]

export default function LandingPageIntro({ onComplete }) {
  const [isLeaving, setIsLeaving] = useState(false)

  const isFinishing = useRef(false)
  const skipTimer = useRef(null)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setIsLeaving(true)
    }, 3200)

    const completeTimer = window.setTimeout(() => {
      if (!isFinishing.current) {
        isFinishing.current = true
        onComplete?.()
      }
    }, 3800)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(completeTimer)
      window.clearTimeout(skipTimer.current)
    }
  }, [onComplete])

  function finishIntro() {
    if (isFinishing.current || isLeaving) return

    setIsLeaving(true)

    skipTimer.current = window.setTimeout(() => {
      if (!isFinishing.current) {
        isFinishing.current = true
        onComplete?.()
      }
    }, 600)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      finishIntro()
    }
  }

  return (
    <div
      className={`fs-sparkle-intro ${
        isLeaving ? 'fs-sparkle-intro-leaving' : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label="Every transaction tells a story. Press to continue."
      onClick={finishIntro}
      onKeyDown={handleKeyDown}
    >
      <div className="fs-intro-aurora" />

      <div className="fs-sparkle-field" aria-hidden="true">
        {sparkles.map((sparkle, index) => (
          <span
            key={index}
            className="fs-sparkle"
            style={{
              '--sparkle-x': sparkle.x,
              '--sparkle-y': sparkle.y,
              '--sparkle-size': `${sparkle.size}px`,
              '--sparkle-delay': sparkle.delay,
            }}
          />
        ))}
      </div>

      <div className="fs-money-field" aria-hidden="true">
        {moneyNotes.map((note, index) => (
          <span
            key={index}
            className="fs-intro-money-note"
            style={{
              '--money-x': note.x,
              '--money-y': note.y,
              '--money-rotate': note.rotate,
              '--money-delay': note.delay,
            }}
          >
            <b>₹</b>
            <i />
          </span>
        ))}
      </div>

      <div className="fs-intro-sentence">
        <span className="fs-intro-kicker">
          FRAUDSHIELD PRESENTS
        </span>

        <h1 aria-label="Check before you trust.">
          {words.map((word, index) => (
            <span
              key={word}
              className="fs-intro-word"
              style={{
                '--word-delay': `${0.28 + index * 0.16}s`,
              }}
              aria-hidden="true"
            >
              {word}
            </span>
          ))}
        </h1>

        <div className="fs-intro-light-line" aria-hidden="true">
          <span />
        </div>
      </div>

      <span className="fs-intro-continue">
        Click anywhere to continue
      </span>
    </div>
  )
}