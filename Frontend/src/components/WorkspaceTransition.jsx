import { createContext, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import './WorkspaceTransition.css'

const WorkspaceTransitionContext = createContext(null)

export function useWorkspaceTransition() {
  return useContext(WorkspaceTransitionContext)
}

export default function WorkspaceTransition({ children }) {
  const reducedMotion = useReducedMotion()
  const busy = useRef(false)
  const [burst, setBurst] = useState(null)

  function navigate() {
    window.history.pushState({}, '', '/login')
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }

  function focusLogin() {
    const heading = document.querySelector('.login-page h2')

    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
  }

  function openWorkspace(event) {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    event.preventDefault()

    if (busy.current) return

    if (reducedMotion) {
      navigate()
      window.requestAnimationFrame(focusLogin)
      return
    }

    busy.current = true

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.detail === 0
      ? bounds.left + bounds.width / 2
      : event.clientX
    const y = event.detail === 0
      ? bounds.top + bounds.height / 2
      : event.clientY

    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    ) + 40

    setBurst({ x, y, radius, phase: 'expand' })
  }

  function completePhase() {
    if (burst.phase === 'expand') {
      navigate()
      setBurst((current) => ({ ...current, phase: 'reveal' }))
      return
    }

    setBurst(null)
    busy.current = false
    focusLogin()
  }

  return (
    <WorkspaceTransitionContext.Provider value={openWorkspace}>
      {children}

      {burst && createPortal(
        <div className="fs-page-transition" aria-hidden="true">
          <motion.div
            className="fs-page-burst"
            style={{
              width: burst.radius * 2,
              height: burst.radius * 2,
              left: burst.x - burst.radius,
              top: burst.y - burst.radius,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: 1,
              opacity: burst.phase === 'reveal' ? 0 : 1,
            }}
            transition={
              burst.phase === 'expand'
                ? {
                    duration: 0.65,
                    ease: [0.76, 0, 0.24, 1],
                  }
                : {
                    duration: 0.45,
                    ease: 'easeOut',
                  }
            }
            onAnimationComplete={completePhase}
          />
        </div>,
        document.body
      )}
    </WorkspaceTransitionContext.Provider>
  )
}