import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ theme, onThemeChange }) {
  const reducedMotion = useReducedMotion()
  const busy = useRef(false)
  const [burst, setBurst] = useState(null)

  function toggleTheme(event) {
    if (busy.current) return

    const nextTheme = theme === 'dark' ? 'light' : 'dark'

    if (reducedMotion) {
      onThemeChange(nextTheme)
      return
    }

    busy.current = true

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = bounds.left + bounds.width / 2
    const y = bounds.top + bounds.height / 2

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    ) + 40

    setBurst({
      x,
      y,
      radius,
      nextTheme,
      phase: 'expand',
    })
  }

  function completePhase() {
    if (!burst) return

    if (burst.phase === 'expand') {
      onThemeChange(burst.nextTheme)
      setBurst((current) => ({ ...current, phase: 'fade' }))
      return
    }

    setBurst(null)
    busy.current = false
  }

  return (
    <>
      <button
        type="button"
        className="theme-toggle"
        data-theme={theme}
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label="Dark mode"
        aria-busy={Boolean(burst)}
        onClick={toggleTheme}
      >
        <span className="theme-toggle-thumb" aria-hidden="true" />
        <Sun className="theme-toggle-sun" size={18} aria-hidden="true" />
        <Moon className="theme-toggle-moon" size={18} aria-hidden="true" />
      </button>

      {burst && createPortal(
        <div className="login-theme-overlay" aria-hidden="true">
          <motion.div
            className="login-theme-burst"
            data-next-theme={burst.nextTheme}
            style={{
              width: burst.radius * 2,
              height: burst.radius * 2,
              left: burst.x - burst.radius,
              top: burst.y - burst.radius,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 1,
              opacity: burst.phase === 'fade' ? 0 : 1,
            }}
            transition={
              burst.phase === 'expand'
                ? {
                    duration: 0.65,
                    ease: [0.65, 0, 0.35, 1],
                  }
                : {
                    duration: 0.5,
                    ease: 'easeOut',
                  }
            }
            onAnimationComplete={completePhase}
          />
        </div>,
        document.body
      )}
    </>
  )
}