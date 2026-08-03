"use client";

import { HERO } from "@/data/content";
import { TextTicker } from "@/components/TextTicker";
import { MapPinIcon } from "@/components/Icons";

export function NeonHero() {
  return (
    <section className="relative min-h-screen sm:min-h-[100svh] flex items-center bg-ink overflow-hidden">
      {/* Subtle glow in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,46,166,0.08)_0%,transparent_70%)]" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-2 sm:py-24 text-center">
        {/* Logo */}
        <div className="mt-[90px] mb-1 sm:mb-8 flex justify-center">
          <img
            src="/brand/logo.png"
            alt="Frosted Fork"
            className="h-[clamp(110px,24vh,400px)] sm:h-64 md:h-[20rem] lg:h-[26rem] w-auto animate-neon-flicker"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          />
        </div>

        {/* Headline */}
        <h1
          className="font-display font-bold text-[clamp(20px,5.5vw,80px)] sm:text-5xl md:text-7xl text-white leading-[1.05] tracking-tight mb-1 sm:mb-6 animate-neon-flicker"
          style={{ animationDelay: "0.4s", animationFillMode: "both" }}
        >
          {HERO.headline}
        </h1>

        {/* Animated Ticker */}
        <div className="mb-1 sm:mb-10" style={{ animationDelay: "0.8s", animationFillMode: "both" }}>
          <TextTicker />
        </div>

        {/* Location badge */}
        <p className="mt-2 sm:mt-4 text-[clamp(14px,2.4vw,22px)] sm:text-xl font-script neon-text tracking-wide">
          <span className="inline-flex items-center justify-center gap-2"><MapPinIcon className="h-5 w-5 sm:h-6 sm:w-6" /> {HERO.kicker}</span>
        </p>
      </div>
    </section>
  );
}
