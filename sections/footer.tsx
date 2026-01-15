"use client"

import { motion } from "framer-motion"
import { Mail, MapPin, Phone, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import { scrollToSection } from "@/lib/utils"

const socialLinks = [
  { name: "Twitter", icon: "𝕏", href: "#", color: "#8b5cf6" },
  { name: "GitHub", icon: "⌘", href: "#", color: "#f472b6" },
  { name: "Dribbble", icon: "◉", href: "#", color: "#f59e0b" },
  { name: "LinkedIn", icon: "in", href: "#", color: "#06b6d4" },
]

const quickLinks = [
  { num: "01", name: "Home", href: "#hero" },
  { num: "02", name: "About", href: "#about" },
  { num: "03", name: "Services", href: "#services" },
  { num: "04", name: "Process", href: "#process" },
]

const contactInfo = [
  { icon: Mail, label: "Email", text: "hello@lumina.design", href: "mailto:hello@lumina.design" },
  { icon: MapPin, label: "Location", text: "San Francisco, CA", href: "#" },
  { icon: Phone, label: "Phone", text: "+1 (555) 123-4567", href: "tel:+15551234567" },
]

const legalLinks = [
  { name: "Privacy Policy", href: "#" },
  { name: "Terms of Service", href: "#" },
  { name: "Cookie Policy", href: "#" },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)

  return (
    <footer className="relative py-16 overflow-hidden">
      {/* Large background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[42vw] font-bold text-white/[0.015] leading-none tracking-tighter select-none">
          CONNECT
        </span>
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16">
        {/* Editorial CTA section - horizontal layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-violet-400">
                  — Let's connect
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-none tracking-tighter">
                <span className="block text-white">Ready to start</span>
                <span className="block text-white/20">your project?</span>
              </h2>
            </div>
            <button
              onClick={() => scrollToSection("#contact")}
              className="group/btn relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black rounded-full font-semibold text-base transition-all hover:gap-5 hover:shadow-2xl hover:shadow-violet-500/20 shrink-0"
              data-hoverable
            >
              <span>Get in touch</span>
              <span className="transition-transform group-hover/btn:translate-x-1">→</span>
            </button>
          </div>
        </motion.div>

        {/* Main footer content - more compact */}
        <div className="grid grid-cols-12 gap-6 lg:gap-12 mb-12">
          {/* Brand column */}
          <motion.div
            className="col-span-12 md:col-span-4 lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="mb-4"
              animate={{ y: hoveredSocial !== null ? -2 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-3xl font-black text-white tracking-tighter">
                LUMINA
              </h3>
            </motion.div>
            <p className="text-white/40 text-sm leading-relaxed mb-4 max-w-[200px]">
              Crafting digital experiences that inspire, innovate.
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 transition-colors"
                  data-hoverable
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    borderColor: hoveredSocial === index ? link.color : 'rgba(255,255,255,0.1)',
                    backgroundColor: hoveredSocial === index ? `${link.color}15` : 'rgba(255,255,255,0.05)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm">{link.icon}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            className="col-span-6 md:col-span-4 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-5 bg-violet-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                Navigate
              </span>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={link.name}>
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className="group flex items-center gap-2 text-left w-full"
                    onMouseEnter={() => setHoveredLink(index)}
                    onMouseLeave={() => setHoveredLink(null)}
                    data-hoverable
                  >
                    <motion.span
                      className="text-white/20 text-xs font-bold tabular-nums"
                      animate={{
                        color: hoveredLink === index ? '#8b5cf6' : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {link.num}
                    </motion.span>
                    <span className="text-white/50 group-hover:text-white transition-colors text-sm">
                      {link.name}
                    </span>
                    <motion.span
                      className="w-1 h-1 rounded-full bg-violet-400 ml-auto"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: hoveredLink === index ? 1 : 0, opacity: hoveredLink === index ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="col-span-6 md:col-span-4 lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-5 bg-pink-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                Contact
              </span>
            </div>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => {
                const Icon = item.icon
                const color = index === 0 ? '#8b5cf6' : index === 1 ? '#f472b6' : '#06b6d4'
                return (
                  <motion.li
                    key={item.label}
                    className="group"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href={item.href} className="block">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      <div className="flex items-center gap-2">
                        <Icon size={13} className="text-white/40" />
                        <span className="text-white/60 group-hover:text-white transition-colors text-sm">
                          {item.text}
                        </span>
                        <ArrowUpRight size={11} className="text-white/0 group-hover:text-white/60 transition-all ml-auto" />
                      </div>
                      <motion.div
                        className="h-px mt-1.5"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
                      />
                    </a>
                  </motion.li>
                )
              })}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="col-span-12 md:col-span-4 lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-5 bg-amber-400" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                Newsletter
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-3">
              Weekly insights on design, technology, and creativity.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-400/50 focus:bg-white/[0.08] transition-all peer"
                />
                <label className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none transition-all peer-focus:-top-1.5 peer-focus:left-3 peer-focus:text-[10px] peer-focus:text-white/30 peer-not-placeholder-shown:-top-1.5 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-white/30">
                  Your email
                </label>
              </div>
              <motion.button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 flex items-center justify-center text-white"
                data-hoverable
                whileHover={{ scale: 1.05, rotate: -10 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUpRight size={16} />
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          className="pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-xs">
              © 2025 LUMINA. Crafted with passion in San Francisco.
            </p>

            <div className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/30 hover:text-white transition-colors text-xs"
                  data-hoverable
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Back to top button */}
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
              data-hoverable
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Top gradient line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400 via-pink-400 via-amber-400 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Bottom gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 via-violet-400 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </footer>
  )
}
