"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"

const testimonials = [
  {
    quote: "LUMINA transformed our digital presence completely. The attention to detail and creative vision exceeded all expectations.",
    author: "Sarah Chen",
    role: "CEO, TechVision",
    avatar: "SC",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    quote: "Working with this team was an absolute pleasure. They delivered beyond what we imagined possible.",
    author: "Michael Rodriguez",
    role: "Founder, Artistry Labs",
    avatar: "MR",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    quote: "The level of craftsmanship and innovation in their work is unmatched. Highly recommended!",
    author: "Emma Thompson",
    role: "Creative Director, Studio X",
    avatar: "ET",
    gradient: "from-amber-400 to-yellow-500",
  },
  {
    quote: "Incredible talent and professionalism. Our project was delivered on time with stunning results.",
    author: "James Wilson",
    role: "Product Lead, Innovate Co",
    avatar: "JW",
    gradient: "from-indigo-400 to-violet-500",
  },
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? -15 : 15,
    }),
  }

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="text-pink-400 text-sm font-medium tracking-widest uppercase"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Testimonials
          </motion.span>
          <h2 className="text-5xl md:text-6xl font-bold text-white mt-4">
            What Clients Say
          </h2>
        </motion.div>

        {/* Testimonial Carousel */}
        <div ref={containerRef} className="relative perspective-1000">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
                rotateY: { duration: 0.4 },
              }}
              className="relative"
            >
              {/* Quote */}
              <div className="text-center mb-12">
                <motion.div
                  className="text-8xl mb-6 opacity-20"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  "
                </motion.div>
                <blockquote className="text-2xl md:text-4xl text-white/90 font-light leading-relaxed max-w-4xl mx-auto">
                  {testimonials[activeIndex].quote}
                </blockquote>
              </div>

              {/* Author */}
              <div className="flex flex-col items-center gap-4">
                <motion.div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${testimonials[activeIndex].gradient} flex items-center justify-center text-2xl font-bold text-white`}
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    scale: { duration: 3, repeat: Infinity },
                    rotate: { duration: 4, repeat: Infinity },
                  }}
                >
                  {testimonials[activeIndex].avatar}
                </motion.div>
                <div className="text-center">
                  <motion.div
                    className="text-xl font-semibold text-white"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {testimonials[activeIndex].author}
                  </motion.div>
                  <motion.div
                    className="text-white/60"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {testimonials[activeIndex].role}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              data-hoverable
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ←
            </motion.button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "w-8 bg-white"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  data-hoverable
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              data-hoverable
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              →
            </motion.button>
          </div>

          {/* Auto-play indicator */}
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              Auto-playing
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
