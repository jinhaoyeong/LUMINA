"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { scrollToSection } from "@/lib/utils"

const processSteps = [
  { num: "01", title: "Discovery", text: "Understanding your vision", duration: "1-2 weeks" },
  { num: "02", title: "Strategy", text: "Planning for success", duration: "1 week" },
  { num: "03", title: "Design", text: "Creating the experience", duration: "2-3 weeks" },
  { num: "04", title: "Build", text: "Bringing it to life", duration: "3-4 weeks" },
  { num: "05", title: "Launch", text: "Go live and grow", duration: "1 week" },
]

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const steps = sectionRef.current.querySelectorAll(".process-step")
      const viewportCenter = window.innerHeight / 2

      let closestIndex = -1
      let closestDistance = Infinity

      steps.forEach((step, index) => {
        const rect = step.getBoundingClientRect()
        const stepCenter = rect.top + rect.height / 2
        const distance = Math.abs(viewportCenter - stepCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }

        // Reveal steps as they enter viewport
        if (rect.top < viewportCenter + 200) {
          setRevealedIndices((prev) => new Set([...prev, index]))
        }
      })

      if (closestDistance < 300) {
        setActiveIndex(closestIndex)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Large background number */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[52vw] font-bold text-white/[0.015] leading-none tracking-tighter select-none">
          05
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <div className="flex items-baseline gap-6 mb-8">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-violet-400">
              — Process
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter">
                <span className="block text-white">How we</span>
                <span className="block text-white/20">work</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-6 flex items-end">
              <p className="text-white/50 text-lg leading-relaxed">
                A refined methodology that consistently delivers exceptional digital experiences.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Process steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-pink-500 to-amber-500 hidden md:block" />

          {/* Steps */}
          <div className="space-y-16 md:space-y-24">
            {processSteps.map((step, index) => {
              const isLeft = index % 2 === 0
              const isActive = activeIndex === index
              const isRevealed = revealedIndices.has(index)

              return (
                <motion.div
                  key={step.num}
                  className="process-step relative"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full items-center justify-center z-10 transition-all duration-300"
                    style={{
                      background: isActive ? index === 0 ? '#8b5cf6' : index === 1 ? '#f472b6' : index === 2 ? '#f59e0b' : index === 3 ? '#06b6d4' : '#8b5cf6' : '#020202',
                      borderColor: index === 0 ? '#8b5cf6' : index === 1 ? '#f472b6' : index === 2 ? '#f59e0b' : index === 3 ? '#06b6d4' : '#8b5cf6',
                      transform: isActive ? 'scale(1.8)' : isRevealed ? 'scale(1.3)' : 'scale(1)',
                      borderWidth: isActive ? '3px' : '2px',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: index === 0 ? '#8b5cf6' : index === 1 ? '#f472b6' : index === 2 ? '#f59e0b' : index === 3 ? '#06b6d4' : '#8b5cf6' }}
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 ${isLeft ? '' : 'md:flex-row-reverse'}`}>
                    {/* Number side */}
                    <div className={`${isLeft ? 'md:text-right' : 'md:text-left'} flex items-center md:items-${isLeft ? 'end' : 'start'} md:pr-8`}>
                      <motion.span
                        className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
                        animate={{
                          color: isActive ? (index === 0 ? ['#8b5cf6'] : index === 1 ? ['#f472b6'] : index === 2 ? ['#f59e0b'] : index === 3 ? ['#06b6d4'] : ['#8b5cf6']) :
                                 isRevealed ? ['#ffffff40'] : ['#ffffff15'],
                          y: isActive ? -8 : 0,
                          scale: isActive ? 1.02 : 1,
                        }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        {step.num}
                      </motion.span>
                    </div>

                    {/* Content side */}
                    <div className={`${isLeft ? 'md:pl-0' : 'md:pr-0'}`}>
                      <div className="relative group">
                        {/* Background card */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl -z-10 border border-white/5"
                          animate={{
                            opacity: isRevealed ? 1 : 0,
                            borderColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
                          }}
                          transition={{ duration: 0.4 }}
                        />

                        {/* Colored accent line */}
                        <motion.div
                          className={`absolute top-0 ${isLeft ? 'left-0' : 'right-0'} w-1 h-full rounded-l-2xl ${
                            index === 0 ? 'bg-violet-500/50' :
                            index === 1 ? 'bg-pink-500/50' :
                            index === 2 ? 'bg-amber-500/50' :
                            index === 3 ? 'bg-cyan-500/50' :
                            'bg-violet-400/50'
                          }`}
                          animate={{ opacity: isActive ? 0.6 : isRevealed ? 0.3 : 0 }}
                          transition={{ duration: 0.4 }}
                        />

                        <div className="relative p-8 md:p-12">
                          {/* Small label */}
                          <div className="flex items-center gap-3 mb-6">
                            <div className={`h-px w-12 bg-gradient-to-r ${
                              index === 0 ? 'from-violet-500' :
                              index === 1 ? 'from-pink-500' :
                              index === 2 ? 'from-amber-500' :
                              index === 3 ? 'from-cyan-500' :
                              'from-violet-400'
                            }`} />
                            <span className="text-xs font-bold tracking-widest uppercase text-white/40">
                              Step {index + 1}
                            </span>
                            <span className="text-xs text-white/30">·</span>
                            <span className="text-xs text-white/30">{step.duration}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            {step.title}
                          </h3>

                          {/* Description */}
                          <p className={`text-lg leading-relaxed ${
                            isActive ? 'text-white/70' : isRevealed ? 'text-white/40' : 'text-white/25'
                          }`}>
                            {step.text}
                          </p>

                          {/* Animated indicator */}
                          <motion.div
                            className={`mt-8 h-px bg-gradient-to-r ${
                              index === 0 ? 'from-violet-500/50 to-transparent' :
                              index === 1 ? 'from-pink-500/50 to-transparent' :
                              index === 2 ? 'from-amber-500/50 to-transparent' :
                              index === 3 ? 'from-cyan-500/50 to-transparent' :
                              'from-violet-400/50 to-transparent'
                            }`}
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <button
            onClick={() => scrollToSection("#contact")}
            className="group/btn relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-semibold text-lg transition-all hover:gap-6 hover:shadow-2xl hover:shadow-violet-500/20"
            data-hoverable
          >
            <span>Start your project</span>
            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
