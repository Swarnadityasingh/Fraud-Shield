import React, { useState, useEffect } from 'react'
import './LandingPageIntro.css'

const diagnosticSteps = [
  { progress: 15, tag: 'SYS_INIT', text: 'Booting FraudShield Risk Kernel...' },
  { progress: 35, tag: 'NET_SCAN', text: 'Scanning financial transaction pipelines...' },
  { progress: 60, tag: 'ML_ENGINE', text: 'Loading Scikit-Learn threat detection model...' },
  { progress: 85, tag: 'SEC_AUTH', text: 'Establishing zero-trust encrypted workspace...' },
  { progress: 100, tag: 'COMPLETE', text: 'System diagnostics clean. Access Granted.' }
]

const LandingPageIntro = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const DURATION = 2800
    const intervalTime = 25
    const increment = 100 / (DURATION / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }

        const stepIdx = diagnosticSteps.findIndex((s, i) => {
          const nextStep = diagnosticSteps[i + 1]
          return next >= s.progress && (!nextStep || next < nextStep.progress)
        })
        if (stepIdx !== -1) setCurrentStepIndex(stepIdx)

        return next
      })
    }, intervalTime)

    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, 2300)

    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 2800)

    return () => {
      clearInterval(timer)
      clearTimeout(fadeOutTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  const handleSkip = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      if (onComplete) onComplete()
    }, 300)
  }

  const currentStep = diagnosticSteps[currentStepIndex]

  return (
    <div
      className={`fs-intro-overlay ${isFadingOut ? 'fs-intro-fade' : ''}`}
      onClick={handleSkip}
      role="button"
      tabIndex={0}
      aria-label="Skip introduction screen"
    >
      <div className="fs-intro-grid" />
      <div className="fs-intro-scanline" />

      <div className="fs-intro-card">
        <div className="fs-intro-shield-wrapper">
          <div className="fs-intro-ring fs-ring-outer" />
          <div className="fs-intro-ring fs-ring-inner" />

          <svg
            className="fs-intro-shield-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        <div className="fs-intro-brand">
          <h1>FraudShield</h1>
          <span className="fs-intro-version">v1.0.0 · DIAGNOSTIC MODE</span>
        </div>

        <div className="fs-intro-telemetry">
          <span className="fs-telemetry-tag">[{currentStep.tag}]</span>
          <span className="fs-telemetry-text">{currentStep.text}</span>
        </div>

        <div className="fs-intro-progress-container">
          <div
            className="fs-intro-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="fs-intro-meta">
          <span className="fs-intro-status">
            STATUS: <strong className={progress === 100 ? 'text-safe' : 'text-active'}>
              {progress === 100 ? 'SECURE' : 'ANALYZING'}
            </strong>
          </span>

          <span className="fs-intro-timer">
            {Math.min(100, Math.floor(progress))}%
          </span>
        </div>
      </div>

      <div className="fs-intro-skip-hint">
        Click anywhere to skip
      </div>
    </div>
  )
}

export default LandingPageIntro