"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const projects = [
  {
    id: 1,
    title: "Nebula Dashboard",
    category: "Web Application",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    size: "large",
    color: "#FF6B35",
  },
  {
    id: 2,
    title: "Aurora Brand",
    category: "Branding",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80",
    size: "normal",
    color: "#39FF14",
  },
  {
    id: 3,
    title: "Quantum UI",
    category: "Design System",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    size: "normal",
    color: "#FF3366",
  },
  {
    id: 4,
    title: "Velocity App",
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80",
    size: "normal",
    color: "#3366FF",
  },
  {
    id: 5,
    title: "Spectrum",
    category: "Motion",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    size: "normal",
    color: "#FF6B35",
  },
  {
    id: 6,
    title: "Horizon",
    category: "3D Design",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    size: "normal",
    color: "#39FF14",
  },
];

export default function MediaGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative py-32 px-8 bg-[var(--bg-primary)]">
      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <span className="text-sm tracking-[0.3em] text-[var(--accent-green)] uppercase">
            Selected Work
          </span>
          <h2 className="text-display text-6xl md:text-8xl mt-4">
            Featured Projects
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-xl text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          A curated selection of our most impactful work, showcasing innovation
          and craftsmanship across digital experiences.
        </motion.p>
      </div>

      {/* Bento Grid */}
      <div ref={ref} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 auto-rows-[200px]">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`bento-item group relative overflow-hidden rounded-2xl ${
                project.size === "large"
                  ? "col-span-4 row-span-2 md:col-span-4 md:row-span-2"
                  : "col-span-4 md:col-span-2"
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              data-cursor-hover
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: hoveredId === project.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(to top, ${project.color}40 0%, transparent 60%)`,
                    opacity: hoveredId === project.id ? 1 : 0.6,
                  }}
                />

                {/* Full Overlay on Hover */}
                <motion.div
                  className="absolute inset-0 bg-[var(--bg-primary)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredId === project.id ? 0.7 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                {/* Category */}
                <motion.span
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ color: project.color }}
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                >
                  {project.category}
                </motion.span>

                {/* Title */}
                <h3 className="text-headline text-2xl md:text-4xl text-white mb-2">
                  {project.title}
                </h3>

                {/* Arrow Icon */}
                <motion.div
                  className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center mt-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  animate={
                    hoveredId === project.id
                      ? { x: 0, opacity: 1 }
                      : { x: -20, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>

              {/* Border Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: hoveredId === project.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: `inset 0 0 0 2px ${project.color}`,
                }}
              />

              {/* Corner Decoration */}
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <button className="magnetic-button" data-cursor-hover>
            <span className="relative z-10">View All Projects</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}