"use client"

import { motion } from "framer-motion"

export default function UnifiedBackground({ mobile = false }: { mobile?: boolean }) {
  // On mobile, use static gradients for better performance
  if (mobile) {
    return (
      <>
        <div className="fixed inset-0 bg-[#020102] pointer-events-none" />
        {/* Static gradients on mobile - no animations */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(91, 33, 182, 0.3), transparent 70%)",
              top: "20%",
              left: "10%",
            }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full blur-[100px] opacity-15"
            style={{
              background: "radial-gradient(circle, rgba(168, 85, 247, 0.25), transparent 70%)",
              bottom: "20%",
              right: "10%",
            }}
          />
        </div>
      </>
    )
  }

  // Desktop - full animated experience
  return (
    <>
      {/* Base sophisticated background */}
      <div className="fixed inset-0 bg-[#020202] pointer-events-none" />

      {/* Large animated gradient orbs - top-tier color scheme */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary orb - deep violet */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full blur-[150px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(91, 33, 182, 0.4), transparent 70%)",
            top: "10%",
            left: "20%",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Secondary orb - sophisticated magenta */}
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-[150px] opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.35), transparent 70%)",
            top: "40%",
            right: "15%",
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Tertiary orb - warm amber for depth */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-12"
          style={{
            background: "radial-gradient(circle, rgba(180, 83, 9, 0.3), transparent 70%)",
            bottom: "20%",
            left: "30%",
          }}
          animate={{
            x: [0, 60, 0],
            y: [0, -30, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Quaternary orb - teal for dimension */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(15, 118, 110, 0.25), transparent 70%)",
            bottom: "40%",
            right: "25%",
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Subtle animated mesh gradient overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none opacity-30"
        animate={{
          background: [
            "radial-gradient(ellipse at 30% 20%, rgba(91, 33, 182, 0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse at 70% 60%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse at 40% 80%, rgba(180, 83, 9, 0.06) 0%, transparent 50%)",
            "radial-gradient(ellipse at 30% 20%, rgba(91, 33, 182, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Fine grain texture for premium feel */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </>
  )
}
