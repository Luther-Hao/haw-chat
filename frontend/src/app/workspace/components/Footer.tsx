"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, useSpring, useScroll } from "framer-motion";
import { useRef } from "react";
import { ArrowUp, Check } from "lucide-react";

// Magnetic Button Component
function MagneticButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.button>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDist = 30;

    if (distance < maxDist) {
      x.set(distX * 0.3);
      y.set(distY * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x, y }}>
        <motion.button
          className={className}
          {...props}
        >
          {children}
        </motion.button>
      </motion.div>
    </div>
  );
}

// Magnetic Link Component
function MagneticLink({
  href,
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.a>) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 300, damping: 20 });
  const y = useSpring(0, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    const maxDist = 30;

    if (distance < maxDist) {
      x.set(distX * 0.3);
      y.set(distY * 0.3);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ x, y }}>
        <motion.a
          href={href}
          className={className}
          {...props}
        >
          {children}
        </motion.a>
      </motion.div>
    </div>
  );
}

// Custom SVG Icons for Social Links
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const DribbbleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.424 25.424 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.32 35.32 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" />
  </svg>
);

const socialLinks = [
  { icon: XIcon, href: "#", label: "X (Twitter)" },
  { icon: GitHubIcon, href: "#", label: "GitHub" },
  { icon: LinkedInIcon, href: "#", label: "LinkedIn" },
  { icon: DribbbleIcon, href: "#", label: "Dribbble" },
];

const footerLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
  { label: "Blog", href: "#blog" },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const [isCopied, setIsCopied] = useState(false);
  const [isHoveringEmail, setIsHoveringEmail] = useState(false);
  const [marqueeSpeed, setMarqueeSpeed] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@hawchat.com");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy email");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrollPercentage = scrollPosition / scrollHeight;

      if (scrollPercentage > 0.7) {
        setMarqueeSpeed("slow");
      } else if (scrollPercentage > 0.85) {
        setMarqueeSpeed("slower");
      } else {
        setMarqueeSpeed("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      ref={ref}
      className="relative bg-[var(--bg-secondary)] overflow-hidden"
    >
      {/* Top Gradient Line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent-primary)] to-transparent" />

      {/* Main Footer Content */}
      <div className="px-8 py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Massive Typography Section */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="overflow-hidden">
              <motion.h2
                className="text-headline-brutal text-[clamp(60px,12vw,160px)]"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                LET&apos;S CREATE
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                className="text-headline-brutal text-[clamp(60px,12vw,160px)] gradient-text-vibrant"
                initial={{ y: "100%" }}
                whileInView={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                TOGETHER
              </motion.h2>
            </div>
          </motion.div>

          {/* CTA and Links */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12">
            {/* CTA Button - Click to Copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button
                onClick={copyEmail}
                onMouseEnter={() => setIsHoveringEmail(true)}
                onMouseLeave={() => setIsHoveringEmail(false)}
                className="group relative inline-flex items-center gap-4 bg-transparent border-none p-0 cursor-none"
                data-cursor-hover
              >
                <span className="text-headline-brutal text-[clamp(24px,4vw,48px)] hover:text-[var(--accent-primary)] transition-colors duration-300">
                  hello@hawchat.com
                </span>
                <motion.div
                  className="w-12 h-12 rounded-full bg-[var(--accent-primary)] flex items-center justify-center relative"
                  animate={{
                    scale: isHoveringEmail ? 1.1 : 1,
                    rotate: isHoveringEmail ? 45 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isCopied ? (
                    <Check size={20} className="text-white" />
                  ) : (
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
                  )}
                </motion.div>
                {/* Copied Tooltip */}
                <motion.div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-[var(--accent-green)] text-[var(--bg-primary)] text-sm font-bold rounded-none"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isCopied ? 1 : 0,
                    y: isCopied ? 0 : 10
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Copied!
                </motion.div>
              </button>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              className="flex flex-wrap gap-x-12 gap-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {footerLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  className="text-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 relative group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  viewport={{ once: true }}
                  data-cursor-hover
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent-primary)] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Divider */}
          <div className="my-16 h-px bg-[var(--bg-tertiary)]" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo and Copyright */}
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-display text-2xl tracking-tight">
                HAW<span className="text-[var(--accent-primary)]">CHAT</span>
              </span>
              <span className="text-[var(--text-muted)] text-sm">
                © 2026 All rights reserved
              </span>
            </motion.div>

            {/* Social Links - Magnetic Hover, Brutalist Design */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <MagneticLink
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 border border-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all duration-300"
                  data-cursor-hover
                >
                  <social.icon />
                </MagneticLink>
              ))}
            </motion.div>

            {/* Back to Top - Magnetic Hover, Brutalist Design */}
            <MagneticButton
              onClick={scrollToTop}
              className="group flex items-center gap-3 px-6 py-3 bg-[var(--bg-card)] border border-[var(--bg-tertiary)] hover:border-[var(--accent-primary)] transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              data-cursor-hover
            >
              <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                Back to top
              </span>
              <motion.div
                className="w-8 h-8 bg-[var(--accent-primary)] flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowUp size={16} className="text-white" />
              </motion.div>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[var(--accent-primary)] blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[var(--accent-green)] blur-[100px]" />
      </div>

      {/* Marquee - Scroll Speed Dampening */}
      <div className="border-t border-b border-[var(--bg-tertiary)] py-4 overflow-hidden">
        <div className={`marquee ${marqueeSpeed}`}>
          <div className="marquee-content">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 pr-8">
                <span className="text-display text-2xl text-[var(--text-muted)] whitespace-nowrap">
                  Creative Design
                </span>
                <span className="w-2 h-2 bg-[var(--accent-primary)]" />
                <span className="text-display text-2xl text-[var(--text-muted)] whitespace-nowrap">
                  Web Development
                </span>
                <span className="w-2 h-2 bg-[var(--accent-green)]" />
                <span className="text-display text-2xl text-[var(--text-muted)] whitespace-nowrap">
                  Motion Design
                </span>
                <span className="w-2 h-2 bg-[var(--accent-primary)]" />
                <span className="text-display text-2xl text-[var(--text-muted)] whitespace-nowrap">
                  Branding
                </span>
                <span className="w-2 h-2 bg-[var(--accent-green)]" />
                <span className="text-display text-2xl text-[var(--text-muted)] whitespace-nowrap">
                  Digital Products
                </span>
                <span className="w-2 h-2 bg-[var(--accent-primary)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}