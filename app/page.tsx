"use client"

import { useState } from "react"
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
import Gallery from "@/sections/gallery"
import Services from "@/sections/services"
import Process from "@/sections/process"
import Testimonials from "@/sections/testimonials"
import About from "@/sections/about"
import Contact from "@/sections/contact"
import Footer from "@/sections/footer"

const sections = [
  { component: Hero, id: "hero" },
  { component: Manifesto, id: "manifesto" },
  { component: Marquee, id: "marquee", skipWrapper: true },
  { component: Gallery, id: "gallery" },
  { component: Services, id: "services" },
  { component: Process, id: "process" },
  { component: Testimonials, id: "testimonials" },
  { component: About, id: "about" },
  { component: Contact, id: "contact" },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <SmoothScroll>
      {/* Top-tier unified background */}
      <UnifiedBackground />

      {/* Premium noise overlay for texture */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-50" />

      <CustomCursor />
      <ScrollProgress />
      <Navigation />
      <FloatingCTA />

      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

      <main
        className={`transition-opacity duration-1000 ${isLoading ? "opacity-0" : "opacity-100"}`}
        initial="hidden"
        animate={isLoading ? "hidden" : "visible"}
        variants={containerVariants}
      >
        {sections.map((section, index) => {
          const SectionComponent = section.component
          const content = <SectionComponent />

          return section.skipWrapper ? (
            <div key={section.id}>{content}</div>
          ) : (
            <motion.div
              key={section.id}
              variants={sectionVariants}
              className="snap-section"
            >
              {content}
            </motion.div>
          )
        })}
        <motion.div variants={sectionVariants}>
          <Footer />
        </motion.div>
      </main>
    </SmoothScroll>
  )
}
