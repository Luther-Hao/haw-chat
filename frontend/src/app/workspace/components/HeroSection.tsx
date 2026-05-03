"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";

const wordVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const letterVariants: Variants = {
  hidden: { y: "100%", rotateX: -90, opacity: 0 },
  visible: (i: number) => ({
    y: "0%",
    rotateX: 0,
    opacity: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const FloatingShape = ({
  size,
  color,
  top,
  bottom,
  left,
  right,
  delay,
  shape = "circle",
}: {
  size: number;
  color: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: number;
  shape?: "circle" | "square";
}) => (
  <motion.div
    className={`floating-shape ${shape}`}
    style={{
      width: size,
      height: size,
      ...(top !== undefined && { top }),
      ...(bottom !== undefined && { bottom }),
      ...(left !== undefined && { left }),
      ...(right !== undefined && { right }),
      borderColor: color,
    }}
    animate={{
      y: [0, -30, 0],
      rotate: [0, 10, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 6 + delay,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  const headline = "CREATE";
  const subheadline = "THE FUTURE";

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity, scale, y }}
    >
      {/* Gradient Mesh Background */}
      <div className="gradient-mesh" />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Floating Shapes */}
      <FloatingShape
        size={120}
        color="rgba(255, 107, 53, 0.2)"
        top="15%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        size={80}
        color="rgba(57, 255, 20, 0.15)"
        top="25%"
        right="15%"
        delay={1}
        shape="square"
      />
      <FloatingShape
        size={200}
        color="rgba(255, 51, 102, 0.1)"
        bottom="20%"
        left="20%"
        delay={2}
      />
      <FloatingShape
        size={60}
        color="rgba(51, 102, 255, 0.2)"
        bottom="30%"
        right="25%"
        delay={0.5}
        shape="square"
      />
      <FloatingShape
        size={150}
        color="rgba(255, 107, 53, 0.1)"
        top="60%"
        left="60%"
        delay={1.5}
      />

      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
        <motion.div
          className="text-display text-xl tracking-tight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          HAO<span className="text-[var(--accent-primary)]">FLOW</span>
        </motion.div>

        <div className="flex items-center gap-8">
          {["Work", "About", "Contact"].map((item, i) => (
            <motion.a
              key={item}
              href="#"
              className="text-sm font-medium tracking-wide text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              data-cursor-hover
            >
              {item}
            </motion.a>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        {/* Main Headline - Brutalist Typography */}
        <div className="overflow-hidden mb-4">
          <motion.div
            className="flex justify-center"
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            custom={0}
          >
            <h1 className="text-headline-brutal text-[clamp(80px,15vw,200px)]">
              {headline.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  style={{
                    display: "inline-block",
                    perspective: "1000px",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        </div>

        {/* Subheadline - Brutalist Typography */}
        <div className="overflow-hidden">
          <motion.div
            className="flex justify-center"
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            custom={1}
          >
            <h2
              className="text-headline-brutal text-[clamp(40px,8vw,120px)] gradient-text-vibrant"
              style={{ letterSpacing: "-0.05em", lineHeight: "0.85" }}
            >
              {subheadline.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  style={{ display: "inline-block" }}
                >
                  {letter}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.p
          className="mt-8 text-lg md:text-xl text-[var(--text-secondary)] max-w-xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Crafting digital experiences that push boundaries and inspire creativity
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <button className="magnetic-button" data-cursor-hover>
            <span className="relative z-10">Explore Work</span>
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-[var(--text-secondary)] rounded-full flex justify-center p-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-[var(--accent-primary)] rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Lines */}
      <motion.div
        className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-20"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-green)] to-transparent opacity-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
      />
      <motion.div
        className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent opacity-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 2, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.section>
  );
}