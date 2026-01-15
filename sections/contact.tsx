"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    sectionRef.current?.addEventListener("mousemove", handleMouseMove)
    return () => {
      sectionRef.current?.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const MagneticField = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const element = ref.current
      if (!element) return

      const handleMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
      }

      const handleMouseLeave = () => {
        element.style.transform = "translate(0, 0)"
      }

      element.addEventListener("mousemove", handleMouseMove)
      element.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        element.removeEventListener("mousemove", handleMouseMove)
        element.removeEventListener("mouseleave", handleMouseLeave)
      }
    }, [])

    return (
      <div ref={ref} className="transition-transform duration-200 ease-out">
        {children}
      </div>
    )
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-20 overflow-hidden"
    >
      <div className="relative z-10 max-w-2xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Let&apos;s Create Something
          </h2>
          <p className="text-white/60 text-xl">Together</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="group relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="peer w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-violet-400/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="Name"
                  required
                />
                <label
                  htmlFor="name"
                  className="absolute left-6 top-4 text-white/40 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-violet-400 peer-focus:bg-[#030303] peer-focus:px-2 peer-focus:rounded"
                >
                  Name
                </label>
              </div>

              <div className="group relative">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="peer w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-pink-400/50 focus:bg-white/10 transition-all duration-300"
                  placeholder="Email"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-6 top-4 text-white/40 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-pink-400 peer-focus:bg-[#030303] peer-focus:px-2 peer-focus:rounded"
                >
                  Email
                </label>
              </div>

              <div className="group relative">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="peer w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all duration-300 resize-none"
                  placeholder="Message"
                  required
                />
                <label
                  htmlFor="message"
                  className="absolute left-6 top-4 text-white/40 text-base transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-amber-400 peer-focus:bg-[#030303] peer-focus:px-2 peer-focus:rounded"
                >
                  Message
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full py-5 rounded-2xl font-bold text-lg text-black overflow-hidden group"
                data-hoverable
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-2xl"
                      >
                        ⏳
                      </motion.span>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </span>
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-20"
            >
              {/* Confetti animation - premium colors */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ["#8b5cf6", "#f472b6", "#f59e0b"][i % 3],
                  }}
                  initial={{
                    x: "50vw",
                    y: "50vh",
                    opacity: 1,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}vw`,
                    y: `${50 + (Math.random() - 0.5) * 100}vh`,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    ease: "easeOut",
                  }}
                />
              ))}

              <div className="text-6xl mb-6">✨</div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Message Sent!
              </h3>
              <p className="text-white/60 text-lg mb-8">
                We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ name: "", email: "", message: "" })
                }}
                className="px-8 py-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                data-hoverable
              >
                Send Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
