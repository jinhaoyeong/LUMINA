"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export default function TextScramble({
  text,
  className = "",
  delay = 0,
  speed = 50,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isAnimating) {
          setIsAnimating(true)
          setTimeout(() => {
            scrambleText(text)
          }, delay)
        }
      },
      { threshold: 0.5 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [text, delay, isAnimating])

  const scrambleText = (targetText: string) => {
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`"
    let iterations = 0
    const maxIterations = 10

    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (index < iterations / 2) {
              return targetText[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      iterations += 1

      if (iterations > maxIterations) {
        clearInterval(interval)
        setDisplayText(targetText)
      }
    }, speed)
  }

  return (
    <motion.div
      ref={containerRef}
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {displayText || text}
    </motion.div>
  )
}
