"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleScroll = () => {
      // Hide cursor during scroll
      setIsScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Show cursor after scroll stops (300ms debounce)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    const checkHoverTargets = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor-hover]");
      setIsHovering(!!isHoverable);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", checkHoverTargets);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", checkHoverTargets);
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        ref={cursorRef}
        className="custom-cursor"
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isScrolling ? 0 : (isVisible ? 1 : 0),
          backgroundColor: isHovering ? "rgba(255, 107, 53, 0.3)" : "transparent",
          borderColor: isHovering ? "#FF6B35" : "#ffffff",
        }}
        transition={{
          scale: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
          opacity: { duration: 0.2 },
          backgroundColor: { duration: 0.2 },
          borderColor: { duration: 0.2 },
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          marginLeft: -10,
          marginTop: -10,
          pointerEvents: "none",
          zIndex: 99999,
          mixBlendMode: "difference",
        }}
      />

      {/* Cursor dot */}
      <motion.div
        ref={dotRef}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isScrolling ? 0 : (isVisible ? 1 : 0),
        }}
        transition={{
          scale: { duration: 0.15 },
          opacity: { duration: 0.15 },
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          backgroundColor: "#FF6B35",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </>
  );
}
