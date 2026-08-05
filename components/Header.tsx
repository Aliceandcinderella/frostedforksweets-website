"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_LINKS } from "@/data/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 header-shrink transition-colors ${
        scrolled
          ? "bg-page/95 backdrop-blur shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div
        className={`mx-auto flex items-center justify-between transition-[padding] ${
          scrolled ? "px-6 py-2" : "px-6 py-4"
        } max-w-7xl`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Frosted Fork Home"
        >
          <img
            src="/brand/logo.png"
            alt="Frosted Fork"
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex flex-col items-center gap-1" aria-label="Main navigation">
          <div className="flex items-center gap-4">
            {NAV_LINKS.filter(
              (link) => link.label !== "What's Baking" && link.label !== "Meet the Baker"
            ).map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs xl:text-sm font-medium uppercase tracking-wider hover:[animation-play-state:paused] hover:text-neon-pink hover:[text-shadow:0_0_8px_var(--color-neon-pink),0_0_20px_var(--color-neon-pink)]"
                style={{
                  animation: `nav-glow 6s ease-in-out infinite`,
                  animationDelay: `${i * 0.9}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-8">
            {NAV_LINKS.filter(
              (link) => link.label === "What's Baking" || link.label === "Meet the Baker"
            ).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs xl:text-sm font-semibold uppercase tracking-[0.22em] text-electric-cyan transition-colors [text-shadow:0_0_8px_var(--color-electric-cyan),0_0_20px_var(--color-electric-cyan)] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-body/70 hover:text-neon-pink transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <nav className="lg:hidden bg-page border-t px-6 py-4 flex flex-col gap-3" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium uppercase tracking-wider py-2 hover:[animation-play-state:paused] ${
                link.label === "What's Baking" || link.label === "Meet the Baker"
                  ? "text-electric-cyan [text-shadow:0_0_8px_var(--color-electric-cyan),0_0_20px_var(--color-electric-cyan)] hover:text-white"
                  : "hover:text-neon-pink hover:[text-shadow:0_0_8px_var(--color-neon-pink),0_0_20px_var(--color-neon-pink)]"
              }`}
              style={{
                animation: link.label === "What's Baking" || link.label === "Meet the Baker" ? undefined : `nav-glow 6s ease-in-out infinite`,
                animationDelay: `${i * 0.9}s`,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
