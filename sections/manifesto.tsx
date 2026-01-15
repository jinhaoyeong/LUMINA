"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { scrollToSection } from "@/lib/utils"

const manifestoItems = [
  {
    num: "01",
    title: "Vision",
    description: "We see beyond the ordinary, identifying opportunities where others see obstacles.",
    keywords: ["Future", "Beyond", "Horizon"],
    color: "violet",
  },
  {
    num: "02",
    title: "Precision",
    description: "Every pixel is crafted with purpose. Perfection is not a goal, it's our standard.",
    keywords: ["Quality", "Detail", "Excellence"],
    color: "pink",
  },
  {
    num: "03",
    title: "Innovation",
    description: "We embrace the unknown, creating experiences that push boundaries.",
    keywords: ["Bold", "Brave", "First"],
    color: "amber",
  },
]

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const rotationInterval = 8000 // 8 seconds per slide

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 3)
      setProgress(0)
    }, rotationInterval)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 100 / (rotationInterval / 50), 100))
    }, 50)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [isPaused, rotationInterval])

  // Reset progress when index changes manually
  useEffect(() => {
    setProgress(0)
  }, [activeIndex])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center py-32 overflow-hidden"
    >
      {/* Single large watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
        <span className="text-[35vw] font-bold text-white/5 leading-none tracking-tighter select-none">
          {manifestoItems[activeIndex].num}
        </span>
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            className="text-xs font-bold tracking-[0.4em] uppercase text-violet-400 mb-6"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            — Our Manifesto
          </motion.p>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            <span className="block text-white">The philosophy</span>
            <span className="block text-white/20">that drives us</span>
          </h2>
        </motion.div>

        {/* Main display */}
        <div
          className="max-w-5xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Active word display */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h3
              className={`text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 bg-gradient-to-br ${
                activeIndex === 0 ? 'from-violet-400 to-purple-500' :
                activeIndex === 1 ? 'from-pink-400 to-rose-500' :
                'from-amber-400 to-orange-500'
              } bg-clip-text text-transparent`}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {manifestoItems[activeIndex].title}
            </motion.h3>
            <p className="text-white/60 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto px-4">
              {manifestoItems[activeIndex].description}
            </p>
          </motion.div>

          {/* Keywords */}
          <motion.div
            key={`keywords-${activeIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-4 mb-16"
          >
            {manifestoItems[activeIndex].keywords.map((keyword, i) => (
              <motion.span
                key={keyword}
                className={`px-6 py-3 rounded-full border ${
                  activeIndex === 0 ? 'border-violet-400/30 text-violet-300' :
                  activeIndex === 1 ? 'border-pink-400/30 text-pink-300' :
                  'border-amber-400/30 text-amber-300'
                } text-sm font-semibold uppercase tracking-wider`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                {keyword}
              </motion.span>
            ))}
          </motion.div>

          {/* Navigation dots with progress */}
          <div className="flex flex-col items-center gap-4 mb-16">
            {/* Progress bar */}
            <div className="w-full max-w-md h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  activeIndex === 0 ? 'bg-violet-400' :
                  activeIndex === 1 ? 'bg-pink-400' :
                  'bg-amber-400'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-4">
              {manifestoItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index ? 'bg-white' : 'bg-white/20'
                  }`}
                  aria-label={`View manifesto item ${index + 1}`}
                >
                  {activeIndex === index && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Pause indicator */}
            <motion.span
              className="text-xs text-white/30 uppercase tracking-widest"
              animate={{ opacity: isPaused ? 1 : 0.3 }}
              transition={{ duration: 0.2 }}
            >
              {isPaused ? "Paused" : "Auto-playing"}
            </motion.span>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {manifestoItems.map((item, index) => {
              const isActive = activeIndex === index

              return (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                  onClick={() => setActiveIndex(index)}
                >
                  <motion.div
                    className={`relative p-6 rounded-xl border overflow-hidden cursor-pointer transition-all duration-500 ${
                      isActive
                        ? index === 0 ? 'bg-violet-500/10 border-violet-400/30' :
                          index === 1 ? 'bg-pink-500/10 border-pink-400/30' :
                          'bg-amber-500/10 border-amber-400/30'
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Number */}
                    <div className={`text-3xl font-black tracking-tighter mb-3 ${
                      isActive
                        ? index === 0 ? 'text-violet-400' :
                          index === 1 ? 'text-pink-400' :
                          'text-amber-400'
                        : 'text-white/20'
                    }`}>
                      {item.num}
                    </div>

                    {/* Title */}
                    <h4 className={`text-lg font-bold mb-1.5 ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}>
                      {item.title}
                    </h4>

                    {/* Description preview */}
                    <p className={`text-xs leading-relaxed ${
                      isActive ? 'text-white/50' : 'text-white/30'
                    }`}>
                      {item.description.slice(0, 50)}...
                    </p>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-16"
        >
          <button
            onClick={() => scrollToSection("#contact")}
            className="group/btn relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-semibold text-lg transition-all hover:gap-6 hover:shadow-2xl hover:shadow-violet-500/20"
            data-hoverable
          >
            <span>Work with us</span>
            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
