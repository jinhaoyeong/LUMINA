"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

interface Project {
  id: number
  title: string
  category: string
  image: string
  description: string
  tags: string[]
  year: string
  demoType: "constellation" | "aurora" | "wave" | "floating" | "vortex" | "grid"
  demoColor: string
}

// Demo component for each project type
function ProjectDemo({ project, onClose }: { project: Project; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [instructions, setInstructions] = useState("")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
    }
    resizeCanvas()
    const resizeHandler = () => resizeCanvas()
    window.addEventListener("resize", resizeHandler)

    // Viewport detection to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    let animationFrameId: number
    let time = 0
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let isMouseDown = false
    let lastMouseX = mouseX
    let lastMouseY = mouseY

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX = mouseX
      lastMouseY = mouseY
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleMouseDown = () => { isMouseDown = true }
    const handleMouseUp = () => { isMouseDown = false }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)

    // Helper function for safe hex to rgba
    const hexToRgba = (hex: string, alpha: number): string => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // ============================================================
    // NEON DREAMS - Light & Sound Experience
    // ============================================================
    if (project.demoType === "constellation") {
      setInstructions("Click to create light pulses • Move to guide the flow • Double-click for burst")

      interface LightParticle {
        x: number
        y: number
        vx: number
        vy: number
        size: number
        alpha: number
        life: number
      }

      const particles: LightParticle[] = []
      const connections: Array<{ x1: number; y1: number; x2: number; y2: number; alpha: number }> = []

      // Initial particles
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 1 + Math.random() * 2,
          alpha: 0.3 + Math.random() * 0.7,
          life: 1
        })
      }

      const handleClick = (e: MouseEvent) => {
        for (let i = 0; i < 8; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 1 + Math.random() * 2
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 2 + Math.random() * 2,
            alpha: 1,
            life: 1
          })
        }
      }

      const handleDoubleClick = (e: MouseEvent) => {
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2
          const speed = 2 + Math.random() * 3
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1 + Math.random() * 1.5,
            alpha: 1,
            life: 1
          })
        }
      }

      canvas.addEventListener("click", handleClick)
      canvas.addEventListener("dblclick", handleDoubleClick)

      const animate = () => {
        ctx.fillStyle = "rgba(3, 3, 8, 0.1)"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]

          // Gentle attraction to mouse
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 50 && dist < 300) {
            p.vx += (dx / dist) * 0.01
            p.vy += (dy / dist) * 0.01
          }

          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.99
          p.vy *= 0.99

          // Wrap
          if (p.x < 0) p.x = window.innerWidth
          if (p.x > window.innerWidth) p.x = 0
          if (p.y < 0) p.y = window.innerHeight
          if (p.y > window.innerHeight) p.y = 0

          // Fade old particles
          p.life -= 0.001
          p.alpha = p.life * (0.5 + Math.sin(time * 2 + i * 0.1) * 0.3)

          if (p.life <= 0) {
            particles.splice(i, 1)
            continue
          }

          // Draw particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, p.alpha)
          ctx.fill()

          // Glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, p.alpha * 0.15)
          ctx.fill()
        }

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 150) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = hexToRgba(project.demoColor, (1 - dist / 150) * 0.2)
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }

        // Connect to mouse
        particles.forEach(p => {
          const dx = p.x - mouseX
          const dy = p.y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouseX, mouseY)
            ctx.strokeStyle = hexToRgba(project.demoColor, (1 - dist / 200) * 0.3)
            ctx.lineWidth = 0.5 + (1 - dist / 200) * 1
            ctx.stroke()
          }
        })

        // Mouse glow
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 30)
        gradient.addColorStop(0, hexToRgba(project.demoColor, 0.3))
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fill()

        time += 0.016
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", resizeHandler)
        canvas.removeEventListener("click", handleClick)
        canvas.removeEventListener("dblclick", handleDoubleClick)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        cancelAnimationFrame(animationFrameId)
      }
    }

    // ============================================================
    // QUANTUM FLUX - Quantum Mechanics Visualization
    // ============================================================
    else if (project.demoType === "aurora") {
      setInstructions("Click to create quantum particles • Move to influence field • Hold to superposition")

      interface QuantumParticle {
        x: number
        y: number
        vx: number
        vy: number
        phase: number
        frequency: number
        amplitude: number
        inSuperposition: boolean
      }

      const particles: QuantumParticle[] = []
      const waveFunction: number[] = []

      // Initialize
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          phase: Math.random() * Math.PI * 2,
          frequency: 0.5 + Math.random() * 2,
          amplitude: 5 + Math.random() * 10,
          inSuperposition: false
        })
      }

      for (let i = 0; i < window.innerWidth; i += 5) {
        waveFunction.push(0)
      }

      canvas.addEventListener("click", (e) => {
        for (let i = 0; i < 10; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 0.5 + Math.random()
          particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            phase: Math.random() * Math.PI * 2,
            frequency: 0.5 + Math.random() * 2,
            amplitude: 5 + Math.random() * 10,
            inSuperposition: isMouseDown
          })
        }
      })

      const animate = () => {
        ctx.fillStyle = "rgba(5, 5, 12, 0.08)"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        const superposition = isMouseDown ? 2 : 1

        // Draw probability wave
        ctx.beginPath()
        ctx.moveTo(0, window.innerHeight / 2)

        for (let x = 0; x < window.innerWidth; x += 5) {
          let amplitude = 0
          particles.forEach(p => {
            const dx = x - p.x
            const dist = Math.abs(dx)
            if (dist < 200) {
              const contribution = Math.sin(dist * p.frequency * 0.02 + time * p.frequency + p.phase) *
                                  p.amplitude * (1 - dist / 200)
              amplitude += contribution
            }
          })

          // Mouse influence
          const mouseInfluence = Math.sin((x - mouseX) * 0.02 + time * 2) * 20 * (1 - Math.abs(x - mouseX) / window.innerWidth)
          amplitude += mouseInfluence * superposition

          const y = window.innerHeight / 2 + amplitude
          ctx.lineTo(x, y)
        }

        ctx.strokeStyle = hexToRgba(project.demoColor, 0.3)
        ctx.lineWidth = 2
        ctx.stroke()

        // Fill wave
        ctx.lineTo(window.innerWidth, window.innerHeight)
        ctx.lineTo(0, window.innerHeight)
        ctx.closePath()
        const waveGradient = ctx.createLinearGradient(0, window.innerHeight / 2 - 50, 0, window.innerHeight)
        waveGradient.addColorStop(0, hexToRgba(project.demoColor, 0.1))
        waveGradient.addColorStop(1, "transparent")
        ctx.fillStyle = waveGradient
        ctx.fill()

        // Update and draw particles
        particles.forEach((p, i) => {
          p.x += p.vx
          p.y += p.vy
          p.phase += 0.02 * p.frequency

          // Mouse influence
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            p.vx += (dx / dist) * 0.02
            p.vy += (dy / dist) * 0.02
          }

          p.vx *= 0.99
          p.vy *= 0.99

          // Wrap
          if (p.x < 0) p.x = window.innerWidth
          if (p.x > window.innerWidth) p.x = 0
          if (p.y < 0) p.y = window.innerHeight
          if (p.y > window.innerHeight) p.y = 0

          // Draw particle
          const size = p.inSuperposition ? 3 : 2
          const alpha = p.inSuperposition ? 0.8 : 0.5
          const pulse = Math.sin(time * p.frequency + p.phase) * 0.3 + 0.7

          ctx.beginPath()
          ctx.arc(p.x, p.y, size * pulse, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, alpha * pulse)
          ctx.fill()

          // Probability cloud
          ctx.beginPath()
          ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, 0.1 * pulse)
          ctx.fill()
        })

        // Entanglement lines between nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (dist < 100 && (particles[i].inSuperposition || particles[j].inSuperposition)) {
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.strokeStyle = hexToRgba(project.demoColor, (1 - dist / 100) * 0.2)
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }

        time += 0.016
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", resizeHandler)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        cancelAnimationFrame(animationFrameId)
      }
    }

    // ============================================================
    // ECHO CHAMBER - Audio Reactive Art
    // ============================================================
    else if (project.demoType === "wave") {
      setInstructions("Click for sound pulse • Move to influence frequency • Hold for resonance")

      interface Ripple {
        x: number
        y: number
        radius: number
        strength: number
        frequency: number
      }

      const ripples: Ripple[] = []
      const frequencies: number[] = []

      // Initialize frequency bands
      for (let i = 0; i < 64; i++) {
        frequencies.push(0)
      }

      canvas.addEventListener("click", (e) => {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          strength: 1,
          frequency: 0.5 + Math.random() * 2
        })
      })

      const animate = () => {
        ctx.fillStyle = "rgba(8, 8, 12, 0.1)"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        // Generate simulated frequencies
        for (let i = 0; i < frequencies.length; i++) {
          const baseFreq = Math.sin(time * (1 + i * 0.1)) * 0.3 + 0.3
          const mouseInfluence = Math.max(0, 1 - Math.abs(i / frequencies.length - mouseX / window.innerWidth))
          frequencies[i] = baseFreq * mouseInfluence * (isMouseDown ? 1.5 : 1)
        }

        // Continuous ripples when holding
        if (isMouseDown && Math.random() > 0.9) {
          ripples.push({
            x: mouseX + (Math.random() - 0.5) * 50,
            y: mouseY + (Math.random() - 0.5) * 50,
            radius: 0,
            strength: 0.3,
            frequency: 1 + Math.random()
          })
        }

        // Draw ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const r = ripples[i]
          r.radius += 3 * r.frequency
          r.strength *= 0.97

          if (r.strength < 0.01) {
            ripples.splice(i, 1)
            continue
          }

          ctx.beginPath()
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
          ctx.strokeStyle = hexToRgba(project.demoColor, r.strength * 0.5)
          ctx.lineWidth = 2 * r.strength
          ctx.stroke()

          // Inner echo
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2)
          ctx.strokeStyle = hexToRgba(project.demoColor, r.strength * 0.3)
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Draw frequency visualization
        const barWidth = window.innerWidth / frequencies.length
        for (let i = 0; i < frequencies.length; i++) {
          const x = i * barWidth
          const height = frequencies[i] * 200 * (isMouseDown ? 1.3 : 1)
          const y = window.innerHeight / 2

          // Mirror bars
          ctx.fillStyle = hexToRgba(project.demoColor, 0.15)
          ctx.fillRect(x, y - height / 2, barWidth - 1, height)

          // Peak indicator
          const peak = Math.sin(time * 3 + i * 0.2) * frequencies[i] * 30
          ctx.beginPath()
          ctx.arc(x + barWidth / 2, y - height / 2 - Math.abs(peak), 2, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, 0.5)
          ctx.fill()
        }

        // Center waveform
        ctx.beginPath()
        ctx.moveTo(0, window.innerHeight / 2)

        for (let x = 0; x < window.innerWidth; x += 3) {
          const freqIndex = Math.floor((x / window.innerWidth) * frequencies.length)
          const freq = frequencies[freqIndex] || 0
          const y = window.innerHeight / 2 +
            Math.sin(x * 0.02 + time * 2) * 30 +
            Math.sin(x * 0.05 + time) * 20 * freq
          ctx.lineTo(x, y)
        }

        ctx.strokeStyle = hexToRgba(project.demoColor, 0.4)
        ctx.lineWidth = 2
        ctx.stroke()

        // Mouse glow
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 40, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 40)
        gradient.addColorStop(0, hexToRgba(project.demoColor, 0.3))
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.fill()

        time += 0.02
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", resizeHandler)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        cancelAnimationFrame(animationFrameId)
      }
    }

    // ============================================================
    // DIGITAL ZEN - Meditation with Generative Ambient Soundscapes
    // ============================================================
    else if (project.demoType === "floating") {
      setInstructions("Click to add ambient tones • Move to influence soundscape • Scroll for tranquility level")

      // Ambient soundscape visualization
      interface SoundWave {
        y: number
        amplitude: number
        frequency: number
        phase: number
        speed: number
      }

      interface ToneParticle {
        x: number
        y: number
        vx: number
        vy: number
        size: number
        alpha: number
        tone: number
      }

      const soundWaves: SoundWave[] = []
      const toneParticles: ToneParticle[] = []
      let tranquilityLevel = 1.0
      let ambiance = 0

      // Create layered sound waves
      for (let i = 0; i < 8; i++) {
        soundWaves.push({
          y: window.innerHeight / 2 + (i - 4) * 40,
          amplitude: 30 + Math.random() * 40,
          frequency: 0.005 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1
        })
      }

      // Initial ambient particles
      for (let i = 0; i < 40; i++) {
        toneParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 2 + Math.random() * 4,
          alpha: 0.1 + Math.random() * 0.3,
          tone: Math.random()
        })
      }

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        tranquilityLevel = Math.max(0.3, Math.min(2.0, tranquilityLevel - e.deltaY * 0.001))
      }

      canvas.addEventListener("wheel", handleWheel, { passive: false })

      canvas.addEventListener("click", (e) => {
        // Add new ambient tone particle
        for (let i = 0; i < 5; i++) {
          const angle = Math.random() * Math.PI * 2
          const speed = 0.2 + Math.random() * 0.5
          toneParticles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 3 + Math.random() * 5,
            alpha: 0.6,
            tone: Math.random()
          })
        }
        if (toneParticles.length > 80) {
          toneParticles.splice(0, 5)
        }
      })

      const animate = () => {
        // Serene background
        ctx.fillStyle = `rgba(8, 12, 8, ${0.02 / tranquilityLevel})`
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        ambiance = (Math.sin(time * 0.3) + Math.cos(time * 0.7)) * 0.5 + 0.5

        // Draw ambient sound waves
        soundWaves.forEach((wave, i) => {
          ctx.beginPath()
          ctx.moveTo(0, wave.y)

          for (let x = 0; x < window.innerWidth; x += 3) {
            // Mouse influence on the soundscape
            const mouseInfluence = Math.sin((x - mouseX) * 0.01 + time) *
                                  (1 - Math.abs(x - mouseX) / window.innerWidth) * 20 * tranquilityLevel

            const waveY = wave.y +
              Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude * tranquilityLevel +
              Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7) * wave.amplitude * 0.5 +
              mouseInfluence

            ctx.lineTo(x, waveY)
          }

          const waveAlpha = (0.08 + (i / soundWaves.length) * 0.05) * tranquilityLevel
          ctx.strokeStyle = hexToRgba(project.demoColor, waveAlpha)
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Soft glow under waves
          ctx.lineTo(window.innerWidth, wave.y + 50)
          ctx.lineTo(0, wave.y + 50)
          ctx.closePath()

          const gradient = ctx.createLinearGradient(0, wave.y - 20, 0, wave.y + 50)
          gradient.addColorStop(0, "transparent")
          gradient.addColorStop(0.5, hexToRgba(project.demoColor, waveAlpha * 0.3))
          gradient.addColorStop(1, "transparent")
          ctx.fillStyle = gradient
          ctx.fill()

          // Evolve wave parameters
          wave.phase += wave.speed * 0.01 * tranquilityLevel
        })

        // Draw ambient tone particles
        toneParticles.forEach((p, i) => {
          p.x += p.vx * tranquilityLevel
          p.y += p.vy * tranquilityLevel

          // Gentle floating motion
          p.vy += Math.sin(time * 0.5 + p.tone * Math.PI * 2) * 0.01 * tranquilityLevel
          p.vx += Math.cos(time * 0.3 + p.tone * Math.PI * 2) * 0.005 * tranquilityLevel

          // Mouse attraction (gentle)
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 50 && dist < 250) {
            p.vx += (dx / dist) * 0.005
            p.vy += (dy / dist) * 0.005
          }

          p.vx *= 0.99
          p.vy *= 0.99

          // Wrap around
          if (p.x < 0) p.x = window.innerWidth
          if (p.x > window.innerWidth) p.x = 0
          if (p.y < 0) p.y = window.innerHeight
          if (p.y > window.innerHeight) p.y = 0

          // Fade particles over time
          p.alpha = Math.max(0.05, p.alpha - 0.0005)

          // Draw tone particle with glow
          const pulseSize = p.size * (1 + Math.sin(time * 2 + p.tone * Math.PI * 2) * 0.2)

          ctx.beginPath()
          ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, p.alpha * tranquilityLevel)
          ctx.fill()

          // Outer glow
          ctx.beginPath()
          ctx.arc(p.x, p.y, pulseSize * 3, 0, Math.PI * 2)
          ctx.fillStyle = hexToRgba(project.demoColor, p.alpha * 0.2 * tranquilityLevel)
          ctx.fill()
        })

        // Central meditation mandala
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        const mandalaSize = 60 + ambiance * 30 * tranquilityLevel
        const rotation = time * 0.2

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(rotation)

        // Draw mandala petals
        for (let i = 0; i < 8; i++) {
          ctx.save()
          ctx.rotate((i / 8) * Math.PI * 2)

          const petalSize = mandalaSize * (0.8 + Math.sin(time + i) * 0.2)
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petalSize)
          gradient.addColorStop(0, hexToRgba(project.demoColor, 0.15 * tranquilityLevel))
          gradient.addColorStop(1, "transparent")

          ctx.beginPath()
          ctx.ellipse(0, petalSize / 2, petalSize / 3, petalSize / 2, 0, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          ctx.restore()
        }

        ctx.restore()

        // Center glow
        const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, mandalaSize)
        centerGradient.addColorStop(0, hexToRgba(project.demoColor, 0.2 * tranquilityLevel))
        centerGradient.addColorStop(1, "transparent")
        ctx.beginPath()
        ctx.arc(centerX, centerY, mandalaSize, 0, Math.PI * 2)
        ctx.fillStyle = centerGradient
        ctx.fill()

        // Tranquility indicator
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * tranquilityLevel})`
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`Tranquility: ${Math.round(tranquilityLevel * 100)}%`, 20, 30)
        ctx.fillText(`Tones: ${toneParticles.length}`, 20, 50)

        time += 0.016
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        window.removeEventListener("resize", resizeHandler)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        canvas.removeEventListener("wheel", handleWheel)
        cancelAnimationFrame(animationFrameId)
      }
    }

    // ============================================================
    // VOID WALKER - VR Experience of Nothingness
    // ============================================================
    else if (project.demoType === "vortex") {
      setInstructions("Move to navigate the void • Click to create singularities • Experience emptiness")

      interface VoidParticle {
        x: number
        y: number
        vx: number
        vy: number
        size: number
        life: number
        maxLife: number
      }

      interface Singularity {
        x: number
        y: number
        strength: number
        eventHorizon: number
      }

      const particles: VoidParticle[] = []
      const singularities: Singularity[] = []

      // Main singularity follows mouse
      singularities.push({
        x: mouseX,
        y: mouseY,
        strength: 1.5,
        eventHorizon: 30
      })

      // Initialize particles
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: 0.5 + Math.random() * 1.5,
          life: 1,
          maxLife: 1
        })
      }

      canvas.addEventListener("click", (e) => {
        singularities.push({
          x: e.clientX,
          y: e.clientY,
          strength: 1,
          eventHorizon: 25
        })
        // Keep max 5 singularities
        while (singularities.length > 5) {
          singularities.shift()
        }
      })

      const animate = () => {
        // Deep void background
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)"
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        // Update main singularity position
        if (singularities.length > 0) {
          singularities[0].x += (mouseX - singularities[0].x) * 0.05
          singularities[0].y += (mouseY - singularities[0].y) * 0.05
        }

        // Draw singularities
        singularities.forEach((s, idx) => {
          const pulsePhase = time * 2 + idx
          const pulse = 1 + Math.sin(pulsePhase) * 0.1
          const horizonSize = s.eventHorizon * pulse

          // Event horizon (pure black core)
          const horizonGradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, horizonSize)
          horizonGradient.addColorStop(0, "black")
          horizonGradient.addColorStop(0.8, "black")
          horizonGradient.addColorStop(1, hexToRgba(project.demoColor, 0.1))

          ctx.beginPath()
          ctx.arc(s.x, s.y, horizonSize, 0, Math.PI * 2)
          ctx.fillStyle = horizonGradient
          ctx.fill()

          // Accretion disk glow
          const diskSize = horizonSize * (2 + idx * 0.3) * s.strength
          const diskGradient = ctx.createRadialGradient(s.x, s.y, horizonSize, s.x, s.y, diskSize)
          diskGradient.addColorStop(0, hexToRgba(project.demoColor, 0.15))
          diskGradient.addColorStop(0.5, hexToRgba(project.demoColor, 0.05))
          diskGradient.addColorStop(1, "transparent")

          ctx.beginPath()
          ctx.arc(s.x, s.y, diskSize, 0, Math.PI * 2)
          ctx.fillStyle = diskGradient
          ctx.fill()

          // Subtle gravitational lensing effect
          ctx.strokeStyle = hexToRgba(project.demoColor, 0.1)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(s.x, s.y, diskSize * 1.1, 0, Math.PI * 2)
          ctx.stroke()
        })

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]

          // Find nearest singularity
          let nearestSingularity = singularities[0]
          let minDist = Infinity

          singularities.forEach(s => {
            const dx = s.x - p.x
            const dy = s.y - p.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < minDist) {
              minDist = dist
              nearestSingularity = s
            }
          })

          if (!nearestSingularity) continue

          // Gravitational pull
          const dx = nearestSingularity.x - p.x
          const dy = nearestSingularity.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const pullStrength = nearestSingularity.strength * 0.5

          // Spiral into singularity
          if (dist > nearestSingularity.eventHorizon) {
            // Tangential velocity for spiral
            const tangentX = -dy / dist
            const tangentY = dx / dist

            p.vx += (dx / dist) * pullStrength * 0.02
            p.vy += (dy / dist) * pullStrength * 0.02
            p.vx += tangentX * pullStrength * 0.01
            p.vy += tangentY * pullStrength * 0.01
          } else {
            // Consumed by void - respawn at edge
            const side = Math.floor(Math.random() * 4)
            switch(side) {
              case 0: // top
                p.x = Math.random() * window.innerWidth
                p.y = 0
                break
              case 1: // right
                p.x = window.innerWidth
                p.y = Math.random() * window.innerHeight
                break
              case 2: // bottom
                p.x = Math.random() * window.innerWidth
                p.y = window.innerHeight
                break
              case 3: // left
                p.x = 0
                p.y = Math.random() * window.innerHeight
                break
            }
            p.vx = (Math.random() - 0.5) * 0.2
            p.vy = (Math.random() - 0.5) * 0.2
            p.life = 1
          }

          p.x += p.vx
          p.y += p.vy
          p.vx *= 0.99
          p.vy *= 0.99

          // Fade based on distance from singularities
          const distRatio = Math.min(1, dist / 400)
          p.life = p.life * 0.999 + distRatio * 0.001
          p.life = Math.max(0.1, Math.min(1, p.life))

          // Draw particle
          if (p.life > 0.05) {
            const size = p.size * p.life
            ctx.beginPath()
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
            ctx.fillStyle = hexToRgba(project.demoColor, p.life * 0.5)
            ctx.fill()
          }
        }

        // Spawn new particles occasionally (emergence from nothingness)
        if (Math.random() > 0.92 && particles.length < 200) {
          const side = Math.floor(Math.random() * 4)
          const newParticle: VoidParticle = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 0.5 + Math.random() * 1.5,
            life: 0.3,
            maxLife: 1
          }

          switch(side) {
            case 0:
              newParticle.x = Math.random() * window.innerWidth
              newParticle.y = 0
              newParticle.vy = 0.5 + Math.random() * 0.5
              break
            case 1:
              newParticle.x = window.innerWidth
              newParticle.y = Math.random() * window.innerHeight
              newParticle.vx = -(0.5 + Math.random() * 0.5)
              break
            case 2:
              newParticle.x = Math.random() * window.innerWidth
              newParticle.y = window.innerHeight
              newParticle.vy = -(0.5 + Math.random() * 0.5)
              break
            case 3:
              newParticle.x = 0
              newParticle.y = Math.random() * window.innerHeight
              newParticle.vx = 0.5 + Math.random() * 0.5
              break
          }

          particles.push(newParticle)
        }

        // Philosophical text that fades
        const textAlpha = (Math.sin(time * 0.2) * 0.5 + 0.5) * 0.15
        if (textAlpha > 0.05 && singularities.length > 0) {
          ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`
          ctx.font = "14px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("in the void, everything begins", singularities[0].x, singularities[0].y + 120)
        }

        // Singularity count
        if (singularities.length > 1) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
          ctx.font = "12px monospace"
          ctx.textAlign = "left"
          ctx.fillText(`Singularities: ${singularities.length}`, 20, 30)
        }

        time += 0.016
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        observer.disconnect()
        window.removeEventListener("resize", resizeHandler)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        cancelAnimationFrame(animationFrameId)
      }
    }

    // ============================================================
    // SYNTHWAVE - 80s Retro Aesthetics
    // ============================================================
    else if (project.demoType === "grid") {
      setInstructions("Arrow keys/WASD to drive • Click for color theme • Scroll for speed • Collect orbs")

      let gridOffset = 0
      let speed = 1
      let colorScheme = 0

      // Color schemes
      const schemes = [
        { primary: 180, secondary: 220 }, // Cyan
        { primary: 320, secondary: 280 }, // Pink
        { primary: 40, secondary: 60 },   // Orange
        { primary: 120, secondary: 160 }, // Green
      ]

      // Car position
      let carX = 0
      let carSpeed = 0

      const keys: { [key: string]: boolean } = {}

      const handleKeyDown = (e: KeyboardEvent) => {
        keys[e.key.toLowerCase()] = true
        if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
          e.preventDefault()
        }
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        keys[e.key.toLowerCase()] = false
      }

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        speed = Math.max(0.5, Math.min(3, speed - e.deltaY * 0.001))
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      canvas.addEventListener("wheel", handleWheel, { passive: false })

      canvas.addEventListener("click", () => {
        colorScheme = (colorScheme + 1) % schemes.length
      })

      // Collectibles
      const collectibles: Array<{ x: number; z: number; collected: boolean }> = []
      for (let i = 0; i < 8; i++) {
        collectibles.push({
          x: (Math.random() - 0.5) * 300,
          z: Math.random() * 400 + 100,
          collected: false
        })
      }

      const animate = () => {
        // Dark gradient background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight)
        bgGradient.addColorStop(0, "#0a0015")
        bgGradient.addColorStop(0.5, "#150030")
        bgGradient.addColorStop(1, "#0a0015")
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

        const horizon = window.innerHeight * 0.45
        const centerX = window.innerWidth / 2

        // Update car position
        if (keys["a"] || keys["arrowleft"]) carX -= 4
        if (keys["d"] || keys["arrowright"]) carX += 4
        if (keys["w"] || keys["arrowup"]) carSpeed = Math.min(carSpeed + 0.1, 2)
        if (keys["s"] || keys["arrowdown"]) carSpeed = Math.max(carSpeed - 0.1, -1)

        carX = Math.max(-200, Math.min(200, carX))
        carSpeed *= 0.98

        gridOffset = (gridOffset + speed * 2 + carSpeed) % 80

        const scheme = schemes[colorScheme]

        // Sun
        const sunX = centerX + (mouseX - window.innerWidth / 2) * 0.05
        const sunY = horizon + (mouseY - window.innerHeight / 2) * 0.02
        const sunPulse = 1 + Math.sin(time * 0.5) * 0.05

        const sunGradient = ctx.createLinearGradient(0, sunY - 100, 0, sunY + 100)
        sunGradient.addColorStop(0, `hsla(${scheme.primary}, 80%, 50%, 0)`)
        sunGradient.addColorStop(0.4, `hsla(${scheme.primary}, 80%, 50%, 0.2)`)
        sunGradient.addColorStop(0.5, `hsla(${scheme.secondary}, 90%, 60%, 1)`)
        sunGradient.addColorStop(0.6, `hsla(${scheme.primary}, 80%, 50%, 0.2)`)
        sunGradient.addColorStop(1, `hsla(${scheme.primary}, 80%, 50%, 0)`)

        ctx.beginPath()
        ctx.ellipse(sunX, sunY, 140 * sunPulse, 90 * sunPulse, 0, 0, Math.PI * 2)
        ctx.fillStyle = sunGradient
        ctx.fill()

        // Sun stripes
        for (let i = 0; i < 8; i++) {
          const stripeY = sunY + i * 12
          const stripeAlpha = (1 - i / 8) * 0.25
          ctx.beginPath()
          ctx.ellipse(sunX, stripeY, 140 * sunPulse, 6, 0, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${scheme.secondary}, 80%, 60%, ${stripeAlpha})`
          ctx.fill()
        }

        // Horizontal grid lines
        for (let i = 1; i <= 12; i++) {
          const progress = i / 12
          const y = horizon + Math.pow(progress, 2) * (window.innerHeight - horizon - 40)

          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(window.innerWidth, y)
          ctx.strokeStyle = `hsla(${scheme.primary}, 70%, 50%, ${progress * 0.4})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Vertical perspective lines
        const numLines = 16
        for (let i = -numLines / 2; i < numLines / 2; i++) {
          const lineProgress = (i + numLines / 2) / numLines
          const baseX = (lineProgress - 0.5) * window.innerWidth * 3
          const xOffset = baseX + gridOffset * 3 - carX * 3

          const topX = centerX + xOffset * 0.1
          const bottomX = centerX + xOffset

          ctx.beginPath()
          ctx.moveTo(topX, horizon)
          ctx.lineTo(bottomX, window.innerHeight)

          const distFromCenter = Math.abs(lineProgress - 0.5) * 2
          const alpha = (1 - distFromCenter) * 0.4
          ctx.strokeStyle = `hsla(${scheme.primary}, 70%, 50%, ${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Mountains
        ctx.fillStyle = "#050010"
        ctx.beginPath()
        ctx.moveTo(0, window.innerHeight)
        for (let x = 0; x <= window.innerWidth; x += 30) {
          const mountainHeight = 25 + Math.sin(x * 0.01) * 15 + Math.sin(x * 0.02) * 10
          ctx.lineTo(x, window.innerHeight - mountainHeight)
        }
        ctx.lineTo(window.innerWidth, window.innerHeight)
        ctx.fill()

        // Draw collectibles
        collectibles.forEach(c => {
          if (c.collected) return

          c.z -= (speed * 2 + carSpeed) * 1.5
          if (c.z < 20) {
            c.z = 400 + Math.random() * 150
            c.x = (Math.random() - 0.5) * 300
          }

          if (c.z < 60 && Math.abs(c.x - carX) < 40) {
            c.collected = true
            setTimeout(() => {
              c.collected = false
              c.z = 400 + Math.random() * 150
              c.x = (Math.random() - 0.5) * 300
            }, 1500)
          }

          const scale = 80 / (c.z + 80)
          const screenX = centerX + (c.x - carX) * scale * 6
          const screenY = horizon + (c.z * scale) * 2.2

          if (screenY > horizon && screenY < window.innerHeight) {
            ctx.beginPath()
            ctx.arc(screenX, screenY, 10 * scale, 0, Math.PI * 2)
            ctx.fillStyle = `hsla(${scheme.secondary}, 90%, 70%, 0.9)`
            ctx.fill()

            ctx.beginPath()
            ctx.arc(screenX, screenY, 18 * scale, 0, Math.PI * 2)
            ctx.fillStyle = `hsla(${scheme.secondary}, 90%, 70%, 0.3)`
            ctx.fill()
          }
        })

        // Draw car
        const carScreenY = window.innerHeight - 70
        const carWidth = 70
        const carHeight = 35

        // Car shadow
        ctx.fillStyle = `hsla(${scheme.primary}, 50%, 20%, 0.5)`
        ctx.beginPath()
        ctx.ellipse(centerX + carX, carScreenY + carHeight, carWidth / 2, 8, 0, 0, Math.PI * 2)
        ctx.fill()

        // Car body
        ctx.fillStyle = `hsla(${scheme.secondary}, 70%, 40%, 0.9)`
        ctx.beginPath()
        ctx.moveTo(centerX + carX - carWidth / 2, carScreenY)
        ctx.lineTo(centerX + carX + carWidth / 2, carScreenY)
        ctx.lineTo(centerX + carX + carWidth / 2 - 8, carScreenY + carHeight)
        ctx.lineTo(centerX + carX - carWidth / 2 + 8, carScreenY + carHeight)
        ctx.closePath()
        ctx.fill()

        // Windshield
        ctx.fillStyle = `hsla(${scheme.primary}, 60%, 30%, 0.7)`
        ctx.beginPath()
        ctx.moveTo(centerX + carX - carWidth / 4, carScreenY)
        ctx.lineTo(centerX + carX + carWidth / 4, carScreenY)
        ctx.lineTo(centerX + carX + carWidth / 4 - 5, carScreenY + carHeight * 0.5)
        ctx.lineTo(centerX + carX - carWidth / 4 + 5, carScreenY + carHeight * 0.5)
        ctx.closePath()
        ctx.fill()

        // Taillights
        ctx.fillStyle = `hsla(${scheme.secondary}, 90%, 60%, 1)`
        ctx.beginPath()
        ctx.arc(centerX + carX - carWidth / 2 + 10, carScreenY + carHeight - 8, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(centerX + carX + carWidth / 2 - 10, carScreenY + carHeight - 8, 4, 0, Math.PI * 2)
        ctx.fill()

        // Engine glow
        ctx.beginPath()
        ctx.moveTo(centerX + carX - carWidth / 2 + 12, carScreenY + carHeight)
        ctx.lineTo(centerX + carX + carWidth / 2 - 12, carScreenY + carHeight)
        ctx.strokeStyle = `hsla(${scheme.primary}, 80%, 60%, ${0.5 + Math.abs(carSpeed) * 0.3})`
        ctx.lineWidth = 3 + Math.abs(carSpeed) * 2
        ctx.stroke()

        // Speed indicator
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
        ctx.font = "13px monospace"
        ctx.textAlign = "left"
        ctx.fillText(`SPEED: ${(speed + carSpeed).toFixed(1)}x`, 20, 30)
        ctx.fillText(`WASD/ARROWS to drive`, 20, 50)

        time += 0.016
        animationFrameId = requestAnimationFrame(animate)
      }
      animate()

      return () => {
        window.removeEventListener("resize", resizeHandler)
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
        canvas.removeEventListener("wheel", handleWheel)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        canvas.removeEventListener("click", () => {})
        cancelAnimationFrame(animationFrameId)
      }
    }

  }, [project])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 pointer-events-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
            <p className="text-white/60">{project.category}</p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
            data-hoverable
          >
            <X size={24} />
          </button>
        </div>

        {/* Instructions */}
        <div className="flex-1 flex items-start justify-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-white/70 text-sm">{instructions}</p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 flex justify-between items-center pointer-events-auto">
          <p className="text-white/40 text-sm">Press ESC to close</p>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform"
            data-hoverable
          >
            Back to Gallery
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectDemo
