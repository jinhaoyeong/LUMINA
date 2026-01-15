"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CursorGlow() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Primary cursor glow - large violet */}
      <motion.div
        className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent 70%)",
          left: mousePos.x - 350,
          top: mousePos.y - 350,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.25, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary cursor glow - pink */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(244, 114, 182, 0.5), transparent 70%)",
          left: mousePos.x - 250,
          top: mousePos.y - 250,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.2, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Tertiary cursor glow - amber */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(251, 146, 60, 0.5), transparent 70%)",
          left: mousePos.x - 175,
          top: mousePos.y - 175,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  )
}
