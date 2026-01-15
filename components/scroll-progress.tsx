"use client"

import { useEffect, useState, memo, useRef } from "react"
import { motion } from "framer-motion"

function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      if (ticking) return

      ticking = true
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
        setScrollProgress(progress)
        ticking = false
        rafRef.current = null
      })
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener("scroll", updateScrollProgress)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="relative h-48 w-1 bg-white/10 rounded-full">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-violet-400 via-pink-400 to-amber-400 rounded-full"
          style={{ scaleY: scrollProgress / 100, transformOrigin: "top" }}
        />
        <motion.div
          className="absolute w-5 h-5 bg-white rounded-full -left-2 shadow-lg border-2 border-violet-400"
          style={{
            top: `${scrollProgress}%`,
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)"
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <span className="absolute -right-10 top-1/2 -translate-y-1/2 text-sm text-white/40 font-mono">
        {Math.round(scrollProgress)}%
      </span>
    </div>
  )
}

export default memo(ScrollProgress)
