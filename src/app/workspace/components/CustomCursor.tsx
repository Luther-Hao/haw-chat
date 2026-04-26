"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);

  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // Track mouse position
  const mousePosition = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);
  const isHovering = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // Current animated position
  const currentPos = useRef({ x: 0, y: 0 });

  // High-performance lerp parameters for snappy response
  // Higher lerp factor = faster catch-up = less latency
  const LERP_FACTOR = 0.5; // 0.5 = 50% interpolation per frame (very snappy)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const cursorRing = cursorRingRef.current;
    const cursorDot = cursorDotRef.current;

    if (!cursorRing || !cursorDot) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Use clientX/clientY for viewport-relative coordinates
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isVisible.current = true;
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
    };

    const checkHoverTargets = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      isHovering.current = !!(
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor-hover]")
      );
    };

    // High-performance animation loop
    const updateCursor = () => {
      const targetX = mousePosition.current.x;
      const targetY = mousePosition.current.y;

      // Fast linear interpolation for snappy response
      currentPos.current.x += (targetX - currentPos.current.x) * LERP_FACTOR;
      currentPos.current.y += (targetY - currentPos.current.y) * LERP_FACTOR;

      // Snap to target if within threshold (prevents infinite small updates)
      const dx = Math.abs(targetX - currentPos.current.x);
      const dy = Math.abs(targetY - currentPos.current.y);
      if (dx < 0.1 && dy < 0.1) {
        currentPos.current.x = targetX;
        currentPos.current.y = targetY;
      }

      // Calculate scale based on hover state
      const scale = isHovering.current ? 2.5 : 1;
      const ringWidth = 20 * scale;
      const ringMargin = -ringWidth / 2;

      // Apply GPU-accelerated transforms
      // Using translate3d for hardware acceleration and will-change hint
      cursorRing.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(${scale})`;
      cursorRing.style.width = `${ringWidth}px`;
      cursorRing.style.height = `${ringWidth}px`;
      cursorRing.style.marginLeft = `${ringMargin}px`;
      cursorRing.style.marginTop = `${ringMargin}px`;
      cursorRing.style.opacity = isVisible.current ? "1" : "0";
      cursorRing.style.borderColor = isHovering.current ? "#FF6B35" : "#ffffff";
      cursorRing.style.backgroundColor = isHovering.current ? "rgba(255, 107, 53, 0.3)" : "transparent";

      // Update dot (hidden when hovering)
      const dotScale = isHovering.current ? 0 : 1;
      cursorDot.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(${dotScale})`;
      cursorDot.style.opacity = isVisible.current ? "1" : "0";

      animationFrameId.current = requestAnimationFrame(updateCursor);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", checkHoverTargets);

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(updateCursor);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", checkHoverTargets);

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <>
      {/* Main cursor ring - GPU optimized with will-change */}
      <div
        ref={cursorRingRef}
        className="custom-cursor"
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
          willChange: "transform, opacity, width, height, margin",
        }}
      />

      {/* Cursor dot - GPU optimized */}
      <div
        ref={cursorDotRef}
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
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
