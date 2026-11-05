import { motion, useReducedMotion } from 'framer-motion'

export default function LoginMascot({ covering }) {
  const reducedMotion = useReducedMotion()

  const handTransition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 180, damping: 18 }

  return (
    <div className="login-mascot" aria-hidden="true">
      <motion.svg
        viewBox="0 0 120 160"
        initial={false}
        animate={{ rotate: covering ? -4 : 6 }}
        transition={handTransition}
      >
        <ellipse cx="60" cy="138" rx="32" ry="7" fill="#00000020" />

        <path
          d="M29 103 Q27 78 60 78 Q93 78 91 103 L96 143 H24 Z"
          fill="#0D9488"
          stroke="#115E59"
          strokeWidth="2"
        />

        <path
          d="M33 28 Q14 2 29 4 Q46 7 47 23"
          fill="#5EEAD4"
          stroke="#115E59"
          strokeWidth="2"
        />

        <path
          d="M76 23 Q85 0 97 8 Q105 21 89 33"
          fill="#5EEAD4"
          stroke="#115E59"
          strokeWidth="2"
        />

        <rect
          x="18"
          y="17"
          width="84"
          height="82"
          rx="35"
          fill="#5EEAD4"
          stroke="#115E59"
          strokeWidth="2"
        />

        <ellipse cx="32" cy="68" rx="8" ry="5" fill="#FB718566" />
        <ellipse cx="88" cy="68" rx="8" ry="5" fill="#FB718566" />

        <motion.g
          initial={false}
          animate={
            reducedMotion || covering
              ? { scaleY: 1 }
              : { scaleY: [1, 1, 0.12, 1] }
          }
          transition={
            reducedMotion || covering
              ? { duration: 0 }
              : {
                  duration: 4,
                  times: [0, 0.9, 0.95, 1],
                  repeat: Infinity,
                }
          }
          style={{
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        >
          <ellipse cx="45" cy="51" rx="9" ry="12" fill="#F0FDFA" />
          <ellipse cx="75" cy="51" rx="9" ry="12" fill="#F0FDFA" />
          <ellipse cx="48" cy="53" rx="4" ry="6" fill="#0F172A" />
          <ellipse cx="78" cy="53" rx="4" ry="6" fill="#0F172A" />
          <circle cx="49" cy="50" r="1.5" fill="#FFFFFF" />
          <circle cx="79" cy="50" r="1.5" fill="#FFFFFF" />
        </motion.g>

        <path
          d={covering ? 'M48 76 Q60 87 72 76' : 'M49 73 Q60 82 71 73'}
          fill="none"
          stroke="#115E59"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <motion.g
          initial={false}
          animate={{
            x: covering ? 21 : 0,
            y: covering ? -61 : 0,
          }}
          transition={handTransition}
        >
          <ellipse
            cx="24"
            cy="112"
            rx="14"
            ry="18"
            fill="#99F6E4"
            stroke="#115E59"
            strokeWidth="2"
          />
          <path
            d="M20 101 V110 M25 100 V109 M30 103 V111"
            fill="none"
            stroke="#0D9488"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>

        <motion.g
          initial={false}
          animate={{
            x: covering ? -21 : 0,
            y: covering ? -61 : 0,
          }}
          transition={handTransition}
        >
          <ellipse
            cx="96"
            cy="112"
            rx="14"
            ry="18"
            fill="#99F6E4"
            stroke="#115E59"
            strokeWidth="2"
          />
          <path
            d="M90 103 V111 M95 100 V109 M100 101 V110"
            fill="none"
            stroke="#0D9488"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.g>
      </motion.svg>
    </div>
  )
}