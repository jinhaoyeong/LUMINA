"use client"

import { ReactNode, useEffect, useRef } from "react"
import Lenis from "lenis"

export default function SmoothScroll({ children = null }: { children?: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rafRef = useRef<number | undefined>(undefined)

  const createLenis = () => {
    if (lenisRef.current) {
      lenisRef.current.destroy()
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      lerp: 0.12, // Smooth but responsive
    })

    lenisRef.current = lenis

    // Expose lenis instance globally for navigation and modal control
    if (typeof window !== 'undefined') {
      (window as any).lenis = lenis
      ;(window as any).pauseLenis = () => lenis.stop()
      ;(window as any).resumeLenis = () => lenis.start()
    }

    // Improved scroll snap behavior
    let lastScrollTime = 0
    let scrollVelocity = 0

    const onScroll = ({ scroll, limit, velocity, direction, progress }: {
      scroll: number
      limit: number
      velocity: number
      direction: number
      progress: number
    }) => {
      const currentScroll = scroll
      scrollVelocity = Math.abs(velocity)
      lastScrollTime = Date.now()

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }

      // Set new timeout for snap behavior
      scrollTimeoutRef.current = setTimeout(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTime

        // Only snap if scroll has settled (velocity is low and time has passed)
        if (timeSinceLastScroll > 100 && scrollVelocity < 0.5) {
          // Find sections
          const sections = document.querySelectorAll('.snap-section, .process-step, .milestone-card')
          const viewportHeight = window.innerHeight
          const scrollCenter = scroll + viewportHeight / 2

          let nearestElement: Element | null = null
          let minDistance = Infinity

          sections.forEach((element) => {
            const rect = element.getBoundingClientRect()
            const elementTop = rect.top + scroll
            const elementCenter = elementTop + rect.height / 2
            const distance = Math.abs(elementCenter - scrollCenter)

            if (distance < minDistance) {
              minDistance = distance
              nearestElement = element
            }
          })

          // Snap to nearest element if close enough
          if (nearestElement && minDistance < viewportHeight * 0.35) {
            const targetScroll = (nearestElement as HTMLElement).offsetTop
            const distanceToScroll = Math.abs(targetScroll - scroll)

            // Only snap if the distance is reasonable (avoid long snaps)
            if (distanceToScroll < viewportHeight * 0.7) {
              lenis.scrollTo(targetScroll, {
                duration: 0.6,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              })
            }
          }
        }
      }, 120) // Wait for scroll to settle
    }

    lenis.on('scroll', onScroll)

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)
  }

  useEffect(() => {
    createLenis()

    // Listen for recreate event from modals
    const handleRecreate = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      createLenis()
    }

    window.addEventListener('recreateLenis', handleRecreate)

    return () => {
      window.removeEventListener('recreateLenis', handleRecreate)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      // Clean up global references
      if (typeof window !== 'undefined') {
        (window as any).lenis = null
        ;(window as any).pauseLenis = null
        ;(window as any).resumeLenis = null
      }
    }
  }, [])

  return <>{children}</>
}
