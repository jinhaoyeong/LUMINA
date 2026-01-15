"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowUpRight, Play, ExternalLink } from "lucide-react"
import { scrollToSection } from "@/lib/utils"

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

const projects: Project[] = [
  {
    id: 1,
    title: "Neon Dreams",
    category: "Immersive Web",
    image: "linear-gradient(135deg, #8b5cf6 0%, #764ba2 100%)",
    description: "An immersive web experience exploring the intersection of light and sound.",
    tags: ["WebGL", "Three.js", "Audio"],
    year: "2024",
    demoType: "constellation",
    demoColor: "#8b5cf6"
  },
  {
    id: 2,
    title: "Quantum Flux",
    category: "3D Experience",
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    description: "Interactive 3D visualization of quantum mechanics concepts.",
    tags: ["Blender", "WebGL", "Physics"],
    year: "2024",
    demoType: "aurora",
    demoColor: "#f093fb"
  },
  {
    id: 3,
    title: "Echo Chamber",
    category: "Digital Art",
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    description: "Audio-reactive digital art piece that responds to your voice.",
    tags: ["Web Audio", "Canvas", "AI"],
    year: "2023",
    demoType: "wave",
    demoColor: "#4facfe"
  },
  {
    id: 4,
    title: "Digital Zen",
    category: "Wellness App",
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    description: "A meditation app with generative ambient soundscapes.",
    tags: ["React", "AI", "Audio"],
    year: "2023",
    demoType: "floating",
    demoColor: "#43e97b"
  },
  {
    id: 5,
    title: "Void Walker",
    category: "VR Experience",
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    description: "VR experience exploring the concept of nothingness.",
    tags: ["WebXR", "Three.js", "Shader"],
    year: "2024",
    demoType: "vortex",
    demoColor: "#fa709a"
  },
  {
    id: 6,
    title: "Synthwave",
    category: "Retro Art",
    image: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    description: "Nostalgic journey through 80s aesthetics with modern technology.",
    tags: ["Retro", "Shader", "Animation"],
    year: "2023",
    demoType: "grid",
    demoColor: "#30cfd0"
  },
]

import ProjectDemo from "./gallery-demo"

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [demoProject, setDemoProject] = useState<Project | null>(null)
  const [caseStudyProject, setCaseStudyProject] = useState<Project | null>(null)
  const [filter, setFilter] = useState<"all" | "web" | "art" | "3d">("all")
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 })

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category.toLowerCase().includes(filter))

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (demoProject) setDemoProject(null)
        else if (caseStudyProject) setCaseStudyProject(null)
        else if (selectedProject) setSelectedProject(null)
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [demoProject, caseStudyProject, selectedProject])

  // Pause Lenis and lock body scroll when modals are open
  useEffect(() => {
    const isModalOpen = Boolean(demoProject || caseStudyProject || selectedProject)

    if (isModalOpen) {
      // Destroy Lenis completely when modal is open
      if (typeof window !== "undefined" && (window as any).lenis) {
        const lenis = (window as any).lenis
        lenis.destroy()
        ;(window as any).lenis = null
      }
      // Lock body scroll
      document.body.style.overflow = "hidden"
      // Prevent scroll on main content
      const mainContent = document.querySelector('main')
      if (mainContent) {
        ;(mainContent as HTMLElement).style.overflow = 'hidden'
      }
    } else {
      // Recreate Lenis when modal closes
      if (typeof window !== "undefined") {
        // Trigger a custom event to recreate Lenis
        window.dispatchEvent(new CustomEvent('recreateLenis'))
      }
      // Unlock body scroll
      document.body.style.overflow = ""
      // Restore scroll on main content
      const mainContent = document.querySelector('main')
      if (mainContent) {
        ;(mainContent as HTMLElement).style.overflow = ''
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ""
      const mainContent = document.querySelector('main')
      if (mainContent) {
        ;(mainContent as HTMLElement).style.overflow = ''
      }
    }
  }, [demoProject, caseStudyProject, selectedProject])

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative min-h-screen py-32 overflow-hidden"
    >
      {/* Large background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span className="text-[40vw] font-bold text-white/[0.015] leading-none tracking-tighter select-none">
          WORKS
        </span>
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16">
        {/* Editorial header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-baseline gap-6 mb-8">
            <span className="text-xs font-bold tracking-[0.5em] uppercase text-violet-400">
              — Selected Works
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tighter">
                <span className="block text-white">Featured</span>
                <span className="block text-white/20">projects</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-end">
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                A curated selection of our finest digital experiences, pushing creative boundaries.
              </p>

              {/* Filter tabs */}
              <div className="flex flex-wrap gap-3">
                {(["all", "web", "art", "3d"] as const).map((f) => (
                  <motion.button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`relative px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide overflow-hidden transition-all duration-300 ${
                      filter === f
                        ? "text-black"
                        : "text-white/60 hover:text-white border border-white/10"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-hoverable
                  >
                    {filter === f && (
                      <motion.div
                        className="absolute inset-0 bg-white"
                        layoutId="activeFilter"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{f === "all" ? "All Work" : f.toUpperCase()}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="relative group perspective-1000"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => {
                setHoveredId(null)
                setTilt({ rotateX: 0, rotateY: 0 })
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - rect.left) / rect.width
                const y = (e.clientY - rect.top) / rect.height
                const rotateX = (0.5 - y) * 12 // Max 12deg rotation
                const rotateY = (x - 0.5) * 12
                setTilt({ rotateX, rotateY })
              }}
            >
              {/* Card with 3D tilt effect */}
              <motion.div
                className="relative cursor-pointer overflow-hidden rounded-3xl bg-white/5 border border-white/5 transform-style-3d"
                onClick={() => setSelectedProject(project)}
                data-hoverable
                animate={{
                  rotateX: hoveredId === project.id ? tilt.rotateX : 0,
                  rotateY: hoveredId === project.id ? tilt.rotateY : 0,
                  scale: hoveredId === project.id ? 1.02 : 1,
                }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                  style={{ background: project.image }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-tr-3xl" />

                {/* Content */}
                <div className="relative p-6 md:p-8 min-h-[360px] flex flex-col">
                  {/* Top: Year and Category */}
                  <div className="flex items-start justify-between mb-auto">
                    <motion.span
                      className="text-white/40 text-xs font-medium tracking-wider"
                      animate={{ opacity: hoveredId === project.id ? 0.6 : 1 }}
                    >
                      {project.year}
                    </motion.span>
                    <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[10px] font-bold tracking-wider uppercase">
                      {project.category}
                    </span>
                  </div>

                  {/* Middle: Title */}
                  <div className="py-5">
                    <motion.h3
                      className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight"
                      animate={{
                        y: hoveredId === project.id ? -6 : 0,
                      }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {project.title}
                    </motion.h3>
                  </div>

                  {/* Bottom: Reveal on hover */}
                  <div className="space-y-4">
                    {/* Tags - REVEAL ON HOVER */}
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: hoveredId === project.id ? 1 : 0,
                        y: hoveredId === project.id ? 0 : 20,
                      }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-[10px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </motion.div>

                    {/* View link - REVEAL ON HOVER */}
                    <motion.div
                      className="flex items-center gap-2 text-white font-semibold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: hoveredId === project.id ? 1 : 0,
                        x: hoveredId === project.id ? 0 : -20,
                      }}
                      transition={{ duration: 0.4, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <span className="text-sm">View Project</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Hover indicator line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400"
                    initial={{ width: 0 }}
                    animate={{ width: hoveredId === project.id ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  initial={false}
                  animate={{
                    background: [
                      "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                      "linear-gradient(120deg, transparent 50%, rgba(255,255,255,0.1) 70%, transparent 90%)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <button className="group/btn relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-semibold text-lg transition-all hover:gap-6 hover:shadow-2xl hover:shadow-violet-500/20" data-hoverable>
            <span>View all projects</span>
            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
          </button>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && !demoProject && !caseStudyProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative max-w-4xl w-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                data-hoverable
              >
                <X size={24} />
              </motion.button>

              {/* Hero gradient */}
              <div
                className="h-80 md:h-96 w-full relative"
                style={{ background: selectedProject.image }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                {/* Project number */}
                <div className="absolute bottom-8 left-8">
                  <span className={`text-[120px] font-black leading-none text-white/5 tracking-tighter`}>
                    0{selectedProject.id}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold tracking-wider uppercase">
                    {selectedProject.category}
                  </span>
                  <span className="text-white/40 text-sm">{selectedProject.year}</span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  {selectedProject.title}
                </h3>

                <p className="text-xl text-white/60 leading-relaxed mb-8">
                  {selectedProject.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-10">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    onClick={() => setDemoProject(selectedProject)}
                    className="group px-10 py-4 rounded-full bg-white text-black font-bold text-base hover:shadow-2xl hover:shadow-violet-500/20 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-hoverable
                  >
                    <Play size={18} />
                    <span>View Live Demo</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setCaseStudyProject(selectedProject)}
                    className="px-10 py-4 rounded-full border border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    data-hoverable
                  >
                    <ExternalLink size={18} />
                    Case Study
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Demo Overlay */}
      <AnimatePresence>
        {demoProject && (
          <ProjectDemo project={demoProject} onClose={() => setDemoProject(null)} />
        )}
      </AnimatePresence>

      {/* Case Study Modal */}
      <AnimatePresence>
        {caseStudyProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-black">
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${caseStudyProject.demoColor}22, transparent 50%)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1/2"
                style={{
                  background: `linear-gradient(to top, ${caseStudyProject.demoColor}11, transparent)`,
                }}
              />
            </div>

            {/* Scrollable content */}
            <div
              className="relative h-full overflow-y-auto"
              style={{ touchAction: 'auto', overscrollBehavior: 'contain' }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative min-h-[70vh] flex items-center justify-center px-6 py-20"
              >
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        background: caseStudyProject.demoColor,
                        width: Math.random() * 4 + 2 + "px",
                        height: Math.random() * 4 + 2 + "px",
                        left: Math.random() * 100 + "%",
                        top: Math.random() * 100 + "%",
                      }}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

                <div className="text-center max-w-5xl mx-auto relative z-10">
                  {/* Category badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-3 mb-8"
                  >
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
                    <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-widest uppercase">
                      {caseStudyProject.category}
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50">
                      {caseStudyProject.title}
                    </span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed"
                  >
                    {caseStudyProject.description}
                  </motion.p>

                  {/* Quick stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-8 md:gap-16"
                  >
                    {[
                      { label: "Year", value: caseStudyProject.year },
                      { label: "Technologies", value: caseStudyProject.tags.length },
                      { label: "Duration", value: "8 weeks" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                        <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                  <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
                  <motion.div
                    className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
                  >
                    <motion.div
                      className="w-1 h-2 bg-white/60 rounded-full"
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Content sections */}
              <div className="relative z-10 max-w-6xl mx-auto px-6 pb-32 space-y-32">
                {/* Overview Section - Full width card */}
                <motion.section
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  {/* Decorative background */}
                  <div className="absolute -inset-8 bg-gradient-to-br from-white/5 to-transparent rounded-3xl -z-10" />

                  <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                    {/* Animated corner accent */}
                    <motion.div
                      className="absolute top-0 right-0 w-64 h-64 rounded-bl-full"
                      style={{ background: `radial-gradient(circle at top right, ${caseStudyProject.demoColor}33, transparent)` }}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="p-8 md:p-16">
                      {/* Section header */}
                      <div className="flex items-center gap-6 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20" />
                        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">
                          Project Overview
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20" />
                      </div>

                      {/* Content grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Challenge */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                              <span className="text-violet-400 text-lg">⚡</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">The Challenge</h3>
                          </div>
                          <p className="text-white/60 text-lg leading-relaxed">
                            Pushing the boundaries of web technology to create an immersive digital experience that captivates users while maintaining optimal performance across all devices.
                          </p>
                          <div className="space-y-3">
                            {[
                              "Seamless cross-platform compatibility",
                              "Real-time performance optimization",
                              "Intuitive user interface design",
                            ].map((item, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 text-white/70"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                                <span>{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Solution */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                              <span className="text-pink-400 text-lg">✨</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Our Solution</h3>
                          </div>
                          <p className="text-white/60 text-lg leading-relaxed">
                            Leveraging cutting-edge WebGL, advanced animation techniques, and modern frameworks to deliver an unforgettable experience that drives engagement and conversion.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            {caseStudyProject.tags.map((tag, i) => (
                              <motion.div
                                key={tag}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-xl bg-white/5 border border-white/10 text-center hover:border-pink-500/30 transition-colors"
                              >
                                <span className="text-white font-semibold text-sm">{tag}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* Metrics Section - Animated numbers */}
                <motion.section
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Impact & Results</h2>
                    <p className="text-white/50 text-lg">Measurable success delivered</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { value: "98", suffix: "%", label: "Performance Score", color: "violet", desc: "Lighthouse score" },
                      { value: "250", suffix: "%", label: "Engagement", color: "pink", desc: "Increase in user interaction" },
                      { value: "4.9", suffix: "★", label: "User Rating", color: "amber", desc: "Average customer rating" },
                    ].map((metric, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        className="relative group"
                      >
                        <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${
                          metric.color === "violet" ? "from-violet-500/10 to-transparent border-violet-500/20" :
                          metric.color === "pink" ? "from-pink-500/10 to-transparent border-pink-500/20" :
                          "from-amber-500/10 to-transparent border-amber-500/20"
                        } border overflow-hidden`}>
                          {/* Animated background */}
                          <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: `radial-gradient(circle at center, ${caseStudyProject.demoColor}11, transparent 70%)`,
                            }}
                          />

                          {/* Content */}
                          <div className="relative z-10 text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.1 + 0.2, type: "spring", stiffness: 150 }}
                            >
                              <span className={`text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br ${
                                metric.color === "violet" ? "from-violet-400 to-purple-500" :
                                metric.color === "pink" ? "from-pink-400 to-rose-500" :
                                "from-amber-400 to-orange-500"
                              }`}>
                                {metric.value}
                              </span>
                              <span className="text-4xl md:text-5xl font-black text-white/80 ml-1">{metric.suffix}</span>
                            </motion.div>
                            <p className="text-xl font-bold text-white mt-4 mb-2">{metric.label}</p>
                            <p className="text-white/40 text-sm">{metric.desc}</p>
                          </div>

                          {/* Progress ring */}
                          <svg className="absolute -bottom-20 -right-20 w-40 h-40 opacity-20 transform rotate-180">
                            <circle
                              cx="80"
                              cy="80"
                              r="70"
                              fill="none"
                              stroke={metric.color === "violet" ? "#8b5cf6" : metric.color === "pink" ? "#f472b6" : "#f59e0b"}
                              strokeWidth="2"
                              strokeDasharray={440}
                              strokeDashoffset={440 * (1 - parseFloat(metric.value) / 100)}
                              className="transform -rotate-90"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>

                {/* Timeline Section - Interactive */}
                <motion.section
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  {/* Timeline line */}
                  <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-pink-500 to-amber-500 hidden md:block" />

                  <div className="space-y-24">
                    {[
                      {
                        step: "01",
                        title: "Discovery Phase",
                        duration: "Week 1-2",
                        description: "Deep dive into user research, market analysis, and technical requirements gathering.",
                        color: "violet",
                        items: ["User research", "Competitor analysis", "Technical audit"],
                      },
                      {
                        step: "02",
                        title: "Design & Prototype",
                        duration: "Week 3-4",
                        description: "Creating wireframes, high-fidelity designs, and interactive prototypes for validation.",
                        color: "pink",
                        items: ["UI/UX design", "Prototype testing", "Design systems"],
                      },
                      {
                        step: "03",
                        title: "Development",
                        duration: "Week 5-6",
                        description: "Building the production application with cutting-edge technologies and best practices.",
                        color: "amber",
                        items: ["Frontend development", "API integration", "Performance optimization"],
                      },
                      {
                        step: "04",
                        title: "Launch & Scale",
                        duration: "Week 7-8",
                        description: "Deploying to production, monitoring performance, and iterating based on user feedback.",
                        color: "cyan",
                        items: ["Production deployment", "Analytics setup", "Continuous improvement"],
                      },
                    ].map((phase, i) => {
                      const isLeft = i % 2 === 0

                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ delay: i * 0.1 }}
                          className="relative"
                        >
                          {/* Timeline dot */}
                          <div
                            className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full items-center justify-center z-10"
                            style={{
                              background: phase.color === "violet" ? "#0a0a0a" : "#0a0a0a",
                              borderWidth: "2px",
                              borderStyle: "solid",
                              borderColor: phase.color === "violet" ? "#8b5cf6" : phase.color === "pink" ? "#f472b6" : phase.color === "amber" ? "#f59e0b" : "#06b6d4",
                            }}
                          >
                            <motion.span
                              className="text-xs font-bold"
                              style={{ color: phase.color === "violet" ? "#8b5cf6" : phase.color === "pink" ? "#f472b6" : phase.color === "amber" ? "#f59e0b" : "#06b6d4" }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                            >
                              {phase.step}
                            </motion.span>
                          </div>

                          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${isLeft ? "" : "md:flex-row-reverse"}`}>
                            {/* Content side */}
                            <div className={`${isLeft ? "md:text-right" : "md:text-left"} space-y-4`}>
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                phase.color === "violet" ? "bg-violet-500/20 text-violet-300" :
                                phase.color === "pink" ? "bg-pink-500/20 text-pink-300" :
                                phase.color === "amber" ? "bg-amber-500/20 text-amber-300" :
                                "bg-cyan-500/20 text-cyan-300"
                              }`}>
                                {phase.duration}
                              </span>
                              <h3 className="text-3xl font-bold text-white">{phase.title}</h3>
                              <p className="text-white/50">{phase.description}</p>
                              <div className={`flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : "md:justify-start"}`}>
                                {phase.items.map((item, j) => (
                                  <span key={j} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Spacer for timeline */}
                            <div className="hidden md:block" />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.section>

                {/* Testimonial / Quote Section */}
                <motion.section
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="relative"
                >
                  <div className="relative bg-gradient-to-br from-white/[0.05] to-transparent rounded-3xl border border-white/10 p-12 md:p-20 text-center overflow-hidden">
                    {/* Animated quote background */}
                    <motion.div
                      className="absolute top-0 left-0 text-[40vw] font-bold leading-none opacity-[0.02] select-none pointer-events-none"
                      style={{ color: caseStudyProject.demoColor }}
                      animate={{ opacity: [0.02, 0.04, 0.02] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      "
                    </motion.div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                      <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center">
                          <span className="text-6xl">"</span>
                        </div>
                      </div>
                      <blockquote className="text-2xl md:text-4xl font-bold text-white mb-8 leading-relaxed">
                        An exceptional experience that exceeded all expectations. The attention to detail and innovative approach truly set this project apart.
                      </blockquote>
                      <cite className="text-white/50 text-lg not-italic">
                        — Sarah Chen, Creative Director at TechCorp
                      </cite>
                    </div>
                  </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8 }}
                  className="text-center"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to create something amazing?</h2>
                  <p className="text-white/50 text-xl mb-12 max-w-2xl mx-auto">
                    Let's bring your vision to life with our cutting-edge design and development expertise.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setCaseStudyProject(null)
                        scrollToSection("#contact")
                      }}
                      className="group px-12 py-5 rounded-full bg-white text-black font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/20 transition-all flex items-center gap-3"
                      data-hoverable
                    >
                      <span>Start Your Project</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </button>
                    <button
                      onClick={() => {
                        setCaseStudyProject(null)
                        setSelectedProject(caseStudyProject)
                      }}
                      className="px-12 py-5 rounded-full border border-white/20 text-white font-bold text-lg hover:bg-white/10 transition-all"
                      data-hoverable
                    >
                      View Live Demo
                    </button>
                  </div>
                </motion.section>
              </div>

              {/* Close button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setCaseStudyProject(null)}
                className="fixed top-6 right-6 z-50 w-14 h-14 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all group"
                data-hoverable
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
