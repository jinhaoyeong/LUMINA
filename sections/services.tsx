"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { scrollToSection } from "@/lib/utils"

const services = [
  { num: "01", title: "Creative", subtitle: "Development", desc: "Immersive digital experiences", tech: ["WebGL", "3D", "Motion"] },
  { num: "02", title: "Brand", subtitle: "Identity", desc: "Visual systems that resonate", tech: ["Logo", "UI", "Guidelines"] },
  { num: "03", title: "Web", subtitle: "Applications", desc: "Scalable modern solutions", tech: ["React", "Next.js", "Node"] },
  { num: "04", title: "Mobile", subtitle: "Experiences", desc: "Native cross-platform apps", tech: ["iOS", "Android", "Flutter"] },
]

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="services" className="relative py-32 overflow-hidden">
      {/* Large background typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[42vw] font-bold text-white/[0.015] leading-none tracking-tighter select-none">
          EXPERTISE
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Editorial header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-32"
        >
          <div className="flex items-baseline gap-6 mb-8">
            <span className="text-xs font-bold tracking-[0.4em] uppercase text-violet-400">
              — Services
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter">
                <span className="block text-white">What we</span>
                <span className="block text-white/20">do best</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-4 flex items-end">
              <p className="text-white/50 text-lg leading-relaxed">
                We craft digital experiences that merge innovation with elegance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.num}
              className="group relative"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              {/* Card */}
              <div className="relative aspect-[4/3] bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20">
                {/* Gradient line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${
                  index === 0 ? 'from-violet-500 to-purple-500' :
                  index === 1 ? 'from-pink-500 to-rose-500' :
                  index === 2 ? 'from-amber-500 to-orange-500' :
                  'from-cyan-500 to-blue-500'
                } transition-transform duration-500 origin-left ${hoveredIndex === index ? 'scale-x-100' : 'scale-x-0'}`} />

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${
                  index === 0 ? 'from-violet-500/20' :
                  index === 1 ? 'from-pink-500/20' :
                  index === 2 ? 'from-amber-500/20' :
                  'from-cyan-500/20'
                } to-transparent rounded-bl-3xl`} />

                {/* Content */}
                <div className="relative p-10 h-full flex flex-col">
                  {/* Large number */}
                  <motion.div
                    className={`text-8xl font-black tracking-tighter ${
                      index === 0 ? 'text-violet-500/20' :
                      index === 1 ? 'text-pink-500/20' :
                      index === 2 ? 'text-amber-500/20' :
                      'text-cyan-500/20'
                    } mb-4`}
                    animate={{
                      y: hoveredIndex === index ? -5 : 0,
                      scale: hoveredIndex === index ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {service.num}
                  </motion.div>

                  <div className="flex-1" />
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <h4 className="text-2xl md:text-3xl font-semibold text-white/40 mb-4">
                      {service.subtitle}
                    </h4>
                    <p className="text-white/60 text-lg mb-6">
                      {service.desc}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2">
                      {service.tech.map((t) => (
                        <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    index === 0 ? 'from-violet-500/10' :
                    index === 1 ? 'from-pink-500/10' :
                    index === 2 ? 'from-amber-500/10' :
                    'from-cyan-500/10'
                  } to-transparent opacity-0`}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated border on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl border-2 opacity-0`}
                  style={{
                    borderColor: index === 0 ? '#8b5cf6' : index === 1 ? '#f472b6' : index === 2 ? '#f59e0b' : '#06b6d4'
                  }}
                  animate={{ opacity: hoveredIndex === index ? 0.3 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <button
            onClick={() => scrollToSection("#contact")}
            className="group/btn relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-semibold text-lg transition-all hover:gap-6 hover:shadow-2xl hover:shadow-violet-500/20"
            data-hoverable
          >
            <span>Explore all services</span>
            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
