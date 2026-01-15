"use client"

import { useState, useEffect, lazy, Suspense, memo } from "react"
import { motion } from "framer-motion"
import CustomCursor from "@/components/cursor"
import SmoothScroll from "@/components/smooth-scroll"
import ScrollProgress from "@/components/scroll-progress"
import Navigation from "@/components/navigation"
import FloatingCTA from "@/components/floating-cta"
import UnifiedBackground from "@/components/unified-background"
import Loader from "@/components/loader"
import Hero from "@/sections/hero"
import Manifesto from "@/sections/manifesto"
import Marquee from "@/sections/marquee"

// Lazy load heavy sections for better initial load performance
const Gallery = lazy(() => import("@/sections/gallery"))
const Services = lazy(() => import("@/sections/services"))
const Process = lazy(() => import("@/sections/process"))
const Testimonials = lazy(() => import("@/sections/testimonials"))
const About = lazy(() => import("@/sections/about"))
const Contact = lazy(() => import("@/sections/contact"))
const Footer = lazy(() => import("@/sections/footer"))

// Loading fallback for lazy-loaded components
const SectionLoader = memo(() => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <motion.div
      className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin"
    />
  </div>
))
SectionLoader.displayName = "SectionLoader"

// Detect if device is mobile for performance optimization
const isMobile = () => {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
}

// Regular sections (loaded immediately)
const regularSections = [
  { component: Hero, id: "hero" },
  { component: Manifesto, id: "manifesto" },
  { component: Marquee, id: "marquee", skipWrapper: true as const },
]

// Lazy-loaded sections (loaded on demand)
const lazySections = [
  { component: Gallery, id: "gallery" },
  { component: Services, id: "services" },
  { component: Process, id: "process" },
  { component: Testimonials, id: "testimonials" },
  { component: About, id: "about" },
  { component: Contact, id: "contact" },
]

type SectionConfig = typeof lazySections[number]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    setMobile(isMobile())
  }, [])

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const sectionVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Disable animations on mobile for better performance
  const mobileSectionVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <>
      {!mobile ? <SmoothScroll /> : null}
      <div className={!mobile ? "smooth-scroll-content" : "smooth-scroll-fallback"}>
        {/* Simplified background on mobile */}
        <UnifiedBackground mobile={mobile} />

        {/* Premium noise overlay for texture - skip on mobile */}
        {!mobile && <div className="noise-overlay pointer-events-none fixed inset-0 z-50" />}

        {/* Custom cursor only on desktop */}
        {!mobile && <CustomCursor />}

        <ScrollProgress />
        <Navigation />
        <FloatingCTA />

        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

        <motion.main
          className={`transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
          initial="hidden"
          animate={isLoading ? "hidden" : "visible"}
          variants={containerVariants}
        >
          {/* Render regular sections immediately */}
          {regularSections.map((section) => {
            const SectionComponent = section.component
            const content = <SectionComponent />

            return section.skipWrapper ? (
              <div key={section.id}>{content}</div>
            ) : (
              <motion.div
                key={section.id}
                variants={mobile ? mobileSectionVariants : sectionVariants}
                className="snap-section"
              >
                {content}
              </motion.div>
            )
          })}

          {/* Render lazy sections with Suspense */}
          {lazySections.map((section) => {
            const SectionComponent = section.component
            const skipWrapper = "skipWrapper" in section && section.skipWrapper

            return skipWrapper ? (
              <div key={section.id}>
                <Suspense fallback={<SectionLoader />}>
                  <SectionComponent />
                </Suspense>
              </div>
            ) : (
              <motion.div
                key={section.id}
                variants={mobile ? mobileSectionVariants : sectionVariants}
                className="snap-section"
              >
                <Suspense fallback={<SectionLoader />}>
                  <SectionComponent />
                </Suspense>
              </motion.div>
            )
          })}

          {/* Footer */}
          <motion.div variants={mobile ? mobileSectionVariants : sectionVariants}>
            <Suspense fallback={<SectionLoader />}>
              <Footer />
            </Suspense>
          </motion.div>
        </motion.main>
      </div>
    </>
  )
}
