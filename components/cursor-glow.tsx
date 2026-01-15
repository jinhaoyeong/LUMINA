"use client"

import { useRef, useEffect, useState, memo, useCallback } from "react"

// Memoized glow component for better performance
const GlowOrb = memo(({
  mousePos,
  size,
  color,
  duration,
  delay,
  opacity,
}: {
  mousePos: { x: number; y: number }
  size: number
  color: string
  duration: number
  delay: number
  opacity: number
}) => (
  <div
    className="absolute rounded-full blur-3xl"
    style={{
      width: size,
      height: size,
      background: color,
      left: mousePos.x - size / 2,
      top: mousePos.y - size / 2,
      opacity,
      animation: `glowPulse${duration} ${duration}s ease-in-out ${delay}s infinite`,
    }}
  />
))
GlowOrb.displayName = "GlowOrb"

function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [isMounted, setIsMounted] = useState(false)
  const [isLowEnd, setIsLowEnd] = useState(false)

  // Detect low-end device
  useEffect(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4
    const isLowEndDevice = cores <= 2 || window.innerWidth < 1024
    setIsLowEnd(isLowEndDevice)
  }, [])

  const rafRef = useRef<number | null>(null)
  const lastPosRef = useRef({ x: 0, y: 0 })

  // Optimized mouse move handler with RAF
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current !== null) return

    rafRef.current = requestAnimationFrame(() => {
      const dx = e.clientX - lastPosRef.current.x
      const dy = e.clientY - lastPosRef.current.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      // Only update if moved significantly (throttling)
      if (dist > 5 || lastPosRef.current.x === 0) {
        setMousePos({ x: e.clientX, y: e.clientY })
        lastPosRef.current = { x: e.clientX, y: e.clientY }
      }

      rafRef.current = null
    })
  }, [])

  useEffect(() => {
    setIsMounted(true)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleMouseMove])

  if (!isMounted || isLowEnd) return null

  // Reduce number of orbs on lower-end devices
  const orbCount = isLowEnd ? 1 : 3

  return (
    <>
      <style>{`
        @keyframes glowPulse4 {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        @keyframes glowPulse5 {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
        @keyframes glowPulse6 {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.3); opacity: 0.15; }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary cursor glow - large violet - reduced size */}
        {orbCount >= 1 && (
          <GlowOrb
            mousePos={mousePos}
            size={500}
            color="radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%)"
            duration={4}
            delay={0}
            opacity={0.2}
          />
        )}

        {/* Secondary cursor glow - pink - reduced size */}
        {orbCount >= 2 && (
          <GlowOrb
            mousePos={mousePos}
            size={350}
            color="radial-gradient(circle, rgba(244, 114, 182, 0.5), transparent 70%)"
            duration={5}
            delay={1}
            opacity={0.15}
          />
        )}

        {/* Tertiary cursor glow - amber - reduced size */}
        {orbCount >= 3 && (
          <GlowOrb
            mousePos={mousePos}
            size={250}
            color="radial-gradient(circle, rgba(251, 146, 60, 0.5), transparent 70%)"
            duration={6}
            delay={2}
            opacity={0.1}
          />
        )}
      </div>
    </>
  )
}

export default memo(CursorGlow)
