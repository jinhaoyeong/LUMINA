"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

// Memoized nav links array
const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "Works", href: "#gallery" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
] as const

// Memoized nav link component
const NavLink = memo(({
  link,
  isActive,
  onClick,
}: {
  link: typeof navLinks[number]
  isActive: boolean
  onClick: (href: string) => void
}) => (
  <motion.button
    onClick={() => onClick(link.href)}
    className={`relative text-sm font-medium transition-colors ${
      isActive ? "text-white" : "text-white/60 hover:text-white"
    }`}
    data-hoverable
    whileHover={{ y: -2 }}
    role="menuitem"
    aria-label={`Navigate to ${link.name} section`}
    aria-current={isActive ? "true" : undefined}
  >
    {link.name}
    {isActive && (
      <motion.div
        layoutId="activeSection"
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-400"
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        aria-hidden="true"
      />
    )}
  </motion.button>
))
NavLink.displayName = "NavLink"

// Memoized mobile nav link component
const MobileNavLink = memo(({
  link,
  isActive,
  index,
  onClick,
}: {
  link: typeof navLinks[number]
  isActive: boolean
  index: number
  onClick: (href: string) => void
}) => (
  <motion.div
    initial={{ x: -80, opacity: 0, scale: 0.9 }}
    animate={{ x: 0, opacity: 1, scale: 1 }}
    exit={{ x: -80, opacity: 0, scale: 0.9 }}
    transition={{
      delay: 0.15 + index * 0.08,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }}
  >
    <motion.button
      onClick={() => onClick(link.href)}
      className={`text-3xl font-bold text-left w-full block transition-colors relative ${
        isActive ? "text-violet-400" : "text-white/60 hover:text-white"
      }`}
      data-hoverable
      whileHover={{ x: 10 }}
      whileTap={{ scale: 0.98 }}
    >
      {link.name}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  </motion.div>
))
MobileNavLink.displayName = "MobileNavLink"

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  // Memoized scroll handler with RAF (already optimized)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50)

          // Update active section based on scroll position
          const sections = navLinks.map((link) => link.href.substring(1))
          for (const section of sections) {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              if (rect.top <= 150 && rect.bottom >= 150) {
                setActiveSection(section)
                break
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Memoized scroll to section function
  const scrollToSection = useCallback((href: string) => {
    const id = href.substring(1) // Remove the # symbol
    const element = document.getElementById(id)

    if (element) {
      const offset = 80 // Offset for fixed navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition - offset

      // Use Lenis scrollTo if available, otherwise fallback to native
      if ((window as any).lenis) {
        (window as any).lenis.scrollTo(offsetPosition)
      } else {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        })
      }
      setIsOpen(false)
    }
  }, [])

  return (
    <>
      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#030303]/80 backdrop-blur-xl border-b border-white/[0.03]"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection("#hero")}
              className="text-2xl font-bold text-white tracking-tight relative z-50"
              whileHover={{ scale: 1.05 }}
              data-hoverable
              aria-label="LUMINA - Scroll to top"
            >
              LUMINA
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8" role="menubar">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  link={link}
                  isActive={activeSection === link.href.substring(1)}
                  onClick={scrollToSection}
                />
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => scrollToSection("#contact")}
              className="hidden md:block px-5 py-2 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition-transform"
              data-hoverable
              whileHover={{ boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}
              aria-label="Get in touch - scroll to contact section"
            >
              Let's Talk
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
              data-hoverable
              aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#030303] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.15),transparent_50%)]" />
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(244,114,182,0.08),transparent_40%)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative h-full flex flex-col overflow-hidden">
              {/* Header */}
              <motion.div
                className="flex items-center justify-between px-6 py-4 border-b border-white/[0.03]"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <motion.span
                  className="text-2xl font-bold text-white"
                  animate={{ backgroundPosition: ["0%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(90deg, #8b5cf6, #f472b6, #fbbf24, #8b5cf6)",
                    backgroundSize: "300% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  LUMINA
                </motion.span>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white"
                  data-hoverable
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.button>
              </motion.div>

              {/* Navigation Links */}
              <div className="flex-1 flex items-center justify-center px-6">
                <div className="space-y-6 w-full max-w-sm">
                  {navLinks.map((link, index) => (
                    <MobileNavLink
                      key={link.name}
                      link={link}
                      isActive={activeSection === link.href.substring(1)}
                      index={index}
                      onClick={scrollToSection}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <motion.div
                className="px-6 py-8 border-t border-white/[0.03]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.button
                  onClick={() => scrollToSection("#contact")}
                  className="w-full py-4 rounded-full bg-white text-black font-medium"
                  data-hoverable
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Let's Talk
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(Navigation)
