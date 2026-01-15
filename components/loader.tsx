"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [exit, setExit] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setExit(true)
            setTimeout(onComplete, 800)
          }, 300)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 150)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <AnimatePresence>
      {!exit && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#030303]"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter text-white"
            >
              LUMINA
            </motion.div>

            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-3">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 4 }}
                    animate={{
                      height: progress > i * 5 ? 24 + Math.random() * 16 : 4,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    className="w-1 bg-gradient-to-t from-cyan-400 to-magenta-500 rounded-full"
                  />
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-white/40 text-sm tracking-widest"
            >
              {Math.round(progress)}%
            </motion.div>
          </div>

          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: progress >= 100 ? [0, 1, 0] : 0,
            }}
            transition={{ duration: 0.8 }}
          >
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{
                  x: "50vw",
                  y: "50vh",
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}vw`,
                  y: `${50 + (Math.random() - 0.5) * 100}vh`,
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1 + Math.random(),
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
