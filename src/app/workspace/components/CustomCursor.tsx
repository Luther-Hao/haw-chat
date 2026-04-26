"use client";

import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  // Track mouse position
  const mousePosition = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);
  const animationFrameId = useRef<number | null>(null);

  // Current animated position (for smooth interpolation)
  const currentPos = useRef({ x: 0, y: 0 });

  // Spring physics parameters
  const springConfig = { stiffness: 150, damping: 18, mass: 0.8 };
  const velocity = useRef({ x: 0, y: 0 });
  const lastTime = useRef(performance.now());

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
      // These are independent of scroll position
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

    // Spring physics update function
    const updateCursor = (time: number) => {
      const deltaTime = Math.min((time - lastTime.current) / 16.67, 2); // Normalize to ~60fps, cap at 2x
      lastTime.current = time;

      // Spring physics interpolation
      const targetX = mousePosition.current.x;
      const targetY = mousePosition.current.y;

      // Calculate spring force
      const dx = targetX - currentPos.current.x;
      const dy = targetY - currentPos.current.y;

      // Spring acceleration
      const ax = dx * springConfig.stiffness * 0.001 * deltaTime;
      const ay = dy * springConfig.stiffness * 0.001 * deltaTime;

      // Apply damping
      velocity.current.x = (velocity.current.x + ax) * Math.pow(0.85, deltaTime);
      velocity.current.y = (velocity.current.y + ay) * Math.pow(0.85, deltaTime);

      // Update position
      currentPos.current.x += velocity.current.x * deltaTime;
      currentPos.current.y += velocity.current.y * deltaTime;

      // Snap to target if close enough
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.5) {
        currentPos.current.x = targetX;
        currentPos.current.y = targetY;
        velocity.current.x = 0;
        velocity.current.y = 0;
      }

      // Apply position using translate3d for GPU acceleration
      const posX = currentPos.current.x;
      const posY = currentPos.current.y;

      // Update cursor ring
      cursorRing.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      cursorRing.style.opacity = isVisible.current ? "1" : "0";

      // Update cursor dot
      cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
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
      {/* Main cursor ring - using position fixed + translate3d */}
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
          willChange: "transform, opacity",
        }}
      />

      {/* Cursor dot */}
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
