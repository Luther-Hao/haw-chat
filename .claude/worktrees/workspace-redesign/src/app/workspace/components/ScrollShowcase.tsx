"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    id: 1,
    number: "01",
    title: "Design",
    description:
      "We create visually stunning interfaces that captivate users and communicate brand values with precision and creativity.",
    tags: ["UI/UX", "Branding", "Visual Identity"],
    color: "#FF6B35",
  },
  {
    id: 2,
    number: "02",
    title: "Develop",
    description:
      "Building performant, scalable applications using cutting-edge technologies that deliver exceptional user experiences.",
    tags: ["React", "Next.js", "TypeScript"],
    color: "#39FF14",
  },
  {
    id: 3,
    number: "03",
    title: "Animate",
    description:
      "Bringing interfaces to life with fluid micro-interactions and cinematic transitions that delight and engage.",
    tags: ["Framer Motion", "GSAP", "CSS"],
    color: "#FF3366",
  },
  {
    id: 4,
    number: "04",
    title: "Launch",
    description:
      "Deploying digital products that make an impact, from concept to market with seamless execution.",
    tags: ["DevOps", "Cloud", "Analytics"],
    color: "#3366FF",
  },
];

export default function ScrollShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30 });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "400vh" }}
    >
      {/* Sticky Container */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden bg-[var(--bg-primary)]"
      >
        {/* Section Header */}
        <div className="absolute top-0 left-0 right-0 z-20 px-8 py-8">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div>
              <span className="text-sm tracking-[0.3em] text-[var(--accent-primary)] uppercase">
                Process
              </span>
              <h2 className="text-display text-4xl md:text-6xl mt-2">
                How We Work
              </h2>
            </div>
            <div className="hidden md:block">
              <span className="text-[var(--text-secondary)]">
                Scroll to explore
              </span>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="mt-8 h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-green)]"
              style={{ width: progressWidth }}
            />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <motion.div className="absolute inset-0 flex items-center" style={{ x: smoothX }}>
          {/* Left Spacer */}
          <div className="w-screen flex-shrink-0" />

          {/* Feature Cards */}
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="w-screen flex-shrink-0 px-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
            >
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-[var(--bg-card)] rounded-3xl p-12 border border-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] transition-colors duration-500 group">
                  {/* Background Glow */}
                  <div
                    className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(600px circle at 50% 50%, ${feature.color}20, transparent 50%)`,
                    }}
                  />

                  <div className="relative z-10">
                    {/* Number */}
                    <motion.span
                      className="text-8xl md:text-9xl font-bold text-[var(--bg-tertiary)] absolute -top-8 -left-4 select-none"
                      style={{ color: `${feature.color}15` }}
                    >
                      {feature.number}
                    </motion.span>

                    {/* Content */}
                    <div className="relative pt-12">
                      {/* Title with Line */}
                      <div className="flex items-center gap-6 mb-8">
                        <div
                          className="h-1 w-16 rounded-full"
                          style={{ backgroundColor: feature.color }}
                        />
                        <h3
                          className="text-display text-5xl md:text-7xl"
                          style={{ color: feature.color }}
                        >
                          {feature.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                        {feature.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-3 mt-10">
                        {feature.tags.map((tag, i) => (
                          <motion.span
                            key={tag}
                            className="px-4 py-2 text-sm bg-[var(--bg-secondary)] rounded-full text-[var(--text-secondary)] border border-[var(--bg-tertiary)]"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border border-[var(--bg-tertiary)] flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors duration-500">
                      <motion.div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: feature.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Right Spacer */}
          <div className="w-screen flex-shrink-0" />
        </motion.div>

        {/* Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}