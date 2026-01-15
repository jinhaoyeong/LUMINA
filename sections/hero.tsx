"use client"

import { useEffect, useRef, useState } from "react"
import { motion, Variants, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { scrollToSection } from "@/lib/utils"

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (particlesRef.current) {
        const isMobile = window.innerWidth < 768
        const particleCount = isMobile ? 30 : 80
        const particles: HTMLDivElement[] = []

        // Create multiple types of particles
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div")
          const type = Math.random()
          const size = Math.random() * 3 + 1

          if (type < 0.3) {
            // Small white dots
            particle.className = "absolute rounded-full bg-white"
            particle.style.width = `${size}px`
            particle.style.height = `${size}px`
            particle.style.opacity = `${Math.random() * 0.5 + 0.2}`
            particle.style.boxShadow = `0 0 ${size * 2}px rgba(255,255,255,0.3)`
          } else if (type < 0.6) {
            // Violet particles
            particle.className = "absolute rounded-full"
            particle.style.width = `${size}px`
            particle.style.height = `${size}px`
            particle.style.background = `rgba(139, 92, 246, ${Math.random() * 0.6 + 0.3})`
            particle.style.boxShadow = `0 0 ${size * 3}px rgba(139, 92, 246, 0.5)`
          } else if (type < 0.8) {
            // Pink particles
            particle.className = "absolute rounded-full"
            particle.style.width = `${size}px`
            particle.style.height = `${size}px`
            particle.style.background = `rgba(244, 114, 182, ${Math.random() * 0.6 + 0.3})`
            particle.style.boxShadow = `0 0 ${size * 3}px rgba(244, 114, 182, 0.5)`
          } else {
            // Large glowing orbs
            particle.className = "absolute rounded-full bg-white/10"
            particle.style.width = `${size * 8}px`
            particle.style.height = `${size * 8}px`
            particle.style.filter = "blur(8px)"
          }

          particle.style.left = `${Math.random() * 100}%`
          particle.style.top = `${Math.random() * 100}%`
          particlesRef.current.appendChild(particle)
          particles.push(particle)

          gsap.to(particle, {
            x: "random(-150, 150)",
            y: "random(-150, 150)",
            opacity: "random(0.2, 0.8)",
            scale: "random(0.5, 1.5)",
            duration: "random(4, 10)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        }

        // Mouse interaction with particles
        const handleMouseMove = (e: MouseEvent) => {
          const rect = sectionRef.current?.getBoundingClientRect()
          if (!rect) return

          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          setMousePos({ x: x / rect.width, y: y / rect.height })

          particles.forEach((particle, i) => {
            const particleX = parseFloat(particle.style.left) / 100 * rect.width
            const particleY = parseFloat(particle.style.top) / 100 * rect.height
            const dist = Math.sqrt(Math.pow(x - particleX, 2) + Math.pow(y - particleY, 2))

            if (dist < 200) {
              const force = (200 - dist) / 200
              const angle = Math.atan2(particleY - y, particleX - x)
              gsap.to(particle, {
                x: `+=${Math.cos(angle) * force * 100}`,
                y: `+=${Math.sin(angle) * force * 100}`,
                duration: 0.5,
                ease: "power2.out",
              })
            }
          })
        }

        sectionRef.current?.addEventListener("mousemove", handleMouseMove)

        return () => {
          sectionRef.current?.removeEventListener("mousemove", handleMouseMove)
        }
      }

      // Enhanced glitch effect with chromatic aberration
      if (titleRef.current) {
        const glitchInterval = setInterval(() => {
          if (Math.random() > 0.85) {
            const intensity = Math.random() * 5 + 2
            gsap.fromTo(
              titleRef.current,
              {
                x: () => (Math.random() - 0.5) * intensity,
                skewX: () => (Math.random() - 0.5) * intensity * 2,
              },
              {
                x: 0,
                skewX: 0,
                duration: 0.15,
                ease: "power4.out",
              }
            )
          }
        }, 1500)

        return () => clearInterval(glitchInterval)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const wordVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 50,
        damping: 15,
      },
    }),
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-violet-500/20 blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-pink-500/20 blur-[120px]"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px]"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Particles container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 w-full"
        style={{ opacity, scale }}
      >
        {/* Decorative top line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-violet-400/50 to-transparent"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 128, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        <motion.h1
          ref={titleRef}
          className="text-[15vw] md:text-[12vw] font-bold leading-none tracking-[-0.05em] mb-8"
          initial="hidden"
          animate="visible"
        >
          {"LUMINA".split("").map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={wordVariants}
              className="inline-block relative perspective-500"
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{
                color: i % 2 === 0 ? '#8b5cf6' : '#f472b6',
                textShadow: i % 2 === 0
                  ? '0 0 60px rgba(139, 92, 246, 0.8)'
                  : '0 0 60px rgba(244, 114, 182, 0.8)',
                rotateY: [0, -15, 15, 0],
                rotateX: [0, 10, -10, 0],
                scale: [1, 1.1, 1.15, 1],
                y: [0, -8, 0],
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated tagline */}
        <motion.p
          className="text-base md:text-2xl lg:text-3xl text-white/60 max-w-3xl mx-auto px-4 mb-12"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          Where digital art meets{" "}
          <motion.span
            className="inline-block relative font-medium"
            animate={{
              color: ['#a78bfa', '#f472b6', '#fbbf24', '#a78bfa'],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            human emotion
            <motion.span
              className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ delay: 1.2, duration: 1 }}
            />
          </motion.span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <button
            onClick={() => scrollToSection("#contact")}
            className="group/btn relative px-10 py-4 bg-white text-black rounded-full font-semibold text-base overflow-hidden transition-all hover:shadow-2xl hover:shadow-violet-500/30"
            data-hoverable
            aria-label="Start your project - scroll to contact section"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Project
              <motion.span
                className="transition-transform"
                whileHover={{ x: 4 }}
                aria-hidden="true"
              >
                →
              </motion.span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 opacity-0 group-hover/btn:opacity-100 transition-opacity"
              aria-hidden="true"
            />
          </button>
          <button
            onClick={() => scrollToSection("#gallery")}
            className="group/btn relative px-10 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold text-base transition-all hover:bg-white/10 hover:border-white/40"
            data-hoverable
            aria-label="View our work - scroll to gallery section"
          >
            <span className="flex items-center gap-3">
              View Work
              <motion.span
                className="transition-transform"
                whileHover={{ x: 4 }}
                aria-hidden="true"
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative corner elements */}
      <motion.div
        className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-violet-400/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      />
      <motion.div
        className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-pink-400/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-amber-400/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-cyan-400/30"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      />

      {/* Enhanced scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">
          Scroll
        </span>
        <motion.div
          className="w-6 h-10 relative rounded-full border-2 border-white/20"
          animate={{ borderColor: ['rgba(255,255,255,0.2)', 'rgba(139,92,246,0.4)', 'rgba(255,255,255,0.2)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.div
            className="absolute left-1/2 top-2 w-1 h-3 bg-gradient-to-b from-violet-400 to-pink-400 rounded-full -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
