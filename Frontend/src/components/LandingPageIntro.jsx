import React, { useState, useEffect } from 'react';
import './LandingPageIntro.css';

const LandingPageIntro = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const DURATION = 3000;
    const intervalTime = 30;
    const increment = 100 / (DURATION / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    // Trigger blur & fade-out effect at 2.4s
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2400);

    // Trigger completion at 3.0s
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeOutTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`intro-container ${isFadingOut ? 'blur-out' : ''}`}>
      {/* Background Grid & Radar Sweep */}
      <div className="radar-sweep"></div>

      <div className="intro-content">
        {/* FraudShield Logo Area */}
        <div className="fraudshield-logo-brand">
          <svg
            className="shield-check-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
          <span className="fraudshield-title">FraudShield</span>
        </div>

        <p className="status-text">
          {progress < 40 && "Initializing threat detection..."}
          {progress >= 40 && progress < 80 && "Scanning secure network layers..."}
          {progress >= 80 && "Access Granted. Welcome."}
        </p>

        {/* 3-Second Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Digital Countdown Timer */}
        <div className="timer-display">
          {Math.max(0, (3 - (progress * 3) / 100)).toFixed(1)}s
        </div>
      </div>
    </div>
  );
};

export default LandingPageIntro;