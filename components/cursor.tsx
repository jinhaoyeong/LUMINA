"use client"

import { useEffect, useRef, useState, useCallback, memo } from "react"
import { motion } from "framer-motion"

interface TrailPoint {
  x: number
  y: number
  id: number
}

type CursorState = "default" | "hover" | "blend"

type MagneticTarget = {
  element: HTMLElement
  x: number
  y: number
  strength: number
}

// Memoized cursor components for better performance
const CursorTrail = memo(({ trail }: { trail: TrailPoint[] }) => (
  <>
    {trail.map((point) => (
      <motion.div
        key={point.id}
        className="fixed top-0 left-0 pointer-events-none z-[50]"
        initial={false}
        animate={{
          x: point.x - 8,
          y: point.y - 8,
          opacity: 0,
          scale: 0.5,
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        style={{
          width: 16,
          height: 16,
        }}
      >
        <div className="w-full h-full rounded-full border border-white/20" />
      </motion.div>
    ))}
  </>
))
CursorTrail.displayName = "CursorTrail"

const MainCursor = memo(({
  magneticPos,
  clicked,
  isHovered,
  blendMode,
}: {
  magneticPos: { x: number; y: number }
  clicked: boolean
  isHovered: boolean
  blendMode: boolean
}) => (
  <motion.div
    className="fixed top-0 left-0 pointer-events-none z-[100]"
    animate={{
      x: magneticPos.x - 16,
      y: magneticPos.y - 16,
      scale: clicked ? 0.85 : isHovered ? 1.4 : 1,
    }}
    transition={{
      type: "spring",
      stiffness: 120,
      damping: 20,
      mass: 0.4,
    }}
    style={{ mixBlendMode: blendMode ? "difference" : "normal" }}
  >
    <div className="relative w-8 h-8">
      {/* Outer ring - premium metallic */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, rgba(167,139,250,0.4), rgba(255,255,255,0.8), rgba(251,191,36,0.4))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[1px] bg-[#030303] rounded-full" />

      {/* Inner accent ring */}
      <motion.div
        className="absolute inset-2 rounded-full border border-white/15"
        animate={{
          scale: isHovered ? [1, 0.9, 1] : 1,
          opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle glow - very refined */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)",
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  </motion.div>
))
MainCursor.displayName = "MainCursor"

const CenterPoint = memo(({
  position,
  clicked,
}: {
  position: { x: number; y: number }
  clicked: boolean
}) => (
  <motion.div
    className="fixed top-0 left-0 pointer-events-none z-[100]"
    animate={{
      x: position.x - 2,
      y: position.y - 2,
      scale: clicked ? 0.6 : 1,
    }}
    transition={{
      type: "spring",
      stiffness: 500,
      damping: 28,
      mass: 0.2,
    }}
  >
    <div
      className="w-1 h-1 bg-white rounded-full"
      style={{
        boxShadow: "0 0 6px rgba(255,255,255,0.5)",
      }}
    />
  </motion.div>
))
CenterPoint.displayName = "CenterPoint"

const MagneticIndicator = memo(({ magneticTarget }: { magneticTarget: MagneticTarget }) => (
  <motion.div
    className="fixed top-0 left-0 pointer-events-none z-[50]"
    animate={{
      x: magneticTarget.x - 24,
      y: magneticTarget.y - 24,
      opacity: [0, 0.15, 0],
      scale: [0.8, 1.2, 1.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeOut",
    }}
  >
    <div className="w-12 h-12 rounded-full border border-white/10" />
  </motion.div>
))
MagneticIndicator.displayName = "MagneticIndicator"

function CustomCursor() {
  const [isTouch, setIsTouch] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [magneticPos, setMagneticPos] = useState({ x: 0, y: 0 })
  const [cursorState, setCursorState] = useState<CursorState>("default")
  const [clicked, setClicked] = useState(false)
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [magneticTarget, setMagneticTarget] = useState<MagneticTarget | null>(null)
  const [blendMode, setBlendMode] = useState(false)

  const trailCounter = useRef(0)
  const rafRef = useRef<number | undefined>(undefined)

  // Throttle utility for performance
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }, [])

  // Detect touch device
  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    )
  }, [])

  // Detect touch device
  useEffect(() => {
    setIsTouch(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    )
  }, [])

  useEffect(() => {
    if (isTouch) return

    let lastX = 0
    let lastY = 0
    let velocity = 0
    let lastTime = Date.now()

    // Optimized mouse move handler with RAF
    let ticking = false
    const handleMouseMove = (e: MouseEvent) => {
      if (ticking) return

      ticking = true
      requestAnimationFrame(() => {
        const now = Date.now()
        const dt = now - lastTime
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        const dist = Math.sqrt(dx * dx + dy * dy)

        velocity = dt > 0 ? dist / dt : 0
        lastX = e.clientX
        lastY = e.clientY
        lastTime = now

        // Check if we have a magnetic target
        if (magneticTarget) {
          const targetDx = e.clientX - magneticTarget.x
          const targetDy = e.clientY - magneticTarget.y
          const distance = Math.sqrt(targetDx * targetDx + targetDy * targetDy)
          const influenceRadius = 120

          if (distance < influenceRadius) {
            const pullStrength = magneticTarget.strength * (1 - distance / influenceRadius)
            const pullAmount = pullStrength * 0.15

            setMagneticPos({
              x: e.clientX - targetDx * pullAmount,
              y: e.clientY - targetDy * pullAmount,
            })
          } else {
            setMagneticPos({ x: e.clientX, y: e.clientY })
          }
        } else {
          setMagneticPos({ x: e.clientX, y: e.clientY })
        }

        setPosition({ x: e.clientX, y: e.clientY })

        // Add trail point on fast movement (reduced frequency)
        if (velocity > 2) {
          const newPoint: TrailPoint = {
            x: e.clientX,
            y: e.clientY,
            id: trailCounter.current++,
          }
          setTrail(prev => [newPoint, ...prev].slice(0, 2)) // Reduced from 3 to 2
        }

        ticking = false
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Detect interactive elements
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-hoverable]")

      // Detect blend mode areas
      const isBlendArea = target.closest("[data-blend]") !== null

      setCursorState(isInteractive ? "hover" : "default")
      setBlendMode(isBlendArea)

      // Check for magnetic elements
      const magneticEl = target.closest("[data-magnetic]") as HTMLElement
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect()
        setMagneticTarget({
          element: magneticEl,
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          strength: parseFloat(magneticEl.dataset.magnetic || "0.6"),
        })
      } else {
        setMagneticTarget(null)
      }
    }

    const handleMouseDown = () => setClicked(true)
    const handleMouseUp = () => setClicked(false)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseover", handleMouseOver, { passive: true })
    window.addEventListener("mousedown", handleMouseDown, { passive: true })
    window.addEventListener("mouseup", handleMouseUp, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseover", handleMouseOver)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isTouch, magneticTarget])

  // Don't render custom cursor on touch devices
  if (isTouch) {
    return null
  }

  const isHovered = cursorState === "hover"

  return (
    <>
      {/* Minimal trail - single fading echo */}
      <CursorTrail trail={trail} />

      {/* Main cursor - elegant thin ring */}
      <MainCursor
        magneticPos={magneticPos}
        clicked={clicked}
        isHovered={isHovered}
        blendMode={blendMode}
      />

      {/* Center point - crisp and minimal */}
      <CenterPoint position={position} clicked={clicked} />

      {/* Subtle magnetic indicator */}
      {magneticTarget && <MagneticIndicator magneticTarget={magneticTarget} />}
    </>
  )
}

export default memo(CustomCursor)
