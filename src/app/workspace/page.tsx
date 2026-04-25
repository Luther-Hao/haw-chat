"use client";

import { useState, useEffect } from "react";
import CustomCursor from "./components/CustomCursor";
import HeroSection from "./components/HeroSection";
import ScrollShowcase from "./components/ScrollShowcase";
import MediaGrid from "./components/MediaGrid";
import Footer from "./components/Footer";

export default function WorkspacePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative bg-[var(--bg-primary)]">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-[100] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-green)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Noise Overlay */}
      <div className="noise-overlay" />

      {/* Page Sections */}
      <div className={isLoaded ? "opacity-100" : "opacity-0"}>
        <HeroSection />
        <ScrollShowcase />
        <MediaGrid />
        <Footer />
      </div>

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[10000] bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 border-2 border-[var(--accent-primary)] rounded-full animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[var(--accent-primary)] rounded-full" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}