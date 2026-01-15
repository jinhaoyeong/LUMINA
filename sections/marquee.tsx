"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Three.js",
  "GSAP",
  "Framer Motion",
  "Tailwind CSS",
  "Node.js",
  "WebGL",
  "GraphQL",
  "PostgreSQL",
  "Redis",
]

const clients = [
  "Google",
  "Meta",
  "Apple",
  "Amazon",
  "Netflix",
  "Spotify",
  "Airbnb",
  "Stripe",
]

export default function Marquee() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Gradient overlays for fade effect - matches unified background */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#020202] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#020202] to-transparent z-10" />

      {/* Technologies Marquee - premium colors */}
      <div className="mb-12">
        <motion.div
          className="flex whitespace-nowrap"
          animate={mounted ? { x: [0, -1000] } : {}}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...technologies, ...technologies, ...technologies].map(
            (tech, index) => (
              <div
                key={`${tech}-${index}`}
                className="mx-8 flex items-center gap-2 text-white/40 text-lg font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {tech}
              </div>
            )
          )}
        </motion.div>
      </div>

      {/* Clients Marquee - opposite direction */}
      <div>
        <motion.div
          className="flex whitespace-nowrap"
          animate={mounted ? { x: [-1000, 0] } : {}}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[...clients, ...clients, ...clients].map((client, index) => (
            <div
              key={`${client}-${index}`}
              className="mx-12 text-2xl font-bold text-white/20 hover:text-white/60 transition-colors cursor-default"
            >
              {client}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
