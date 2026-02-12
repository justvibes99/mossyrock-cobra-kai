"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-cobra-black px-4">
      {/* Subtle background pattern only */}
      <div
        className="absolute inset-0 opacity-[0.03] overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, #FFE66D 20px, #FFE66D 22px)",
        }}
      />
      {/* Dark vignette edges */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent to-black/60" />

      {/* Logo with glow */}
      <div
        className={`relative z-10 mb-0 transition-all duration-1000 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
      >
        {/* Red glow behind logo */}
        <div
          className="absolute inset-[-40px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(196, 30, 30, 0.6) 0%, rgba(196, 30, 30, 0.2) 35%, transparent 65%)" }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cobra-logo-v2.png"
          alt="Mossyrock Cobra Kai Logo"
          className="relative w-[22rem] md:w-[36rem] h-auto"
        />
      </div>

      {/* Tagline */}
      <div className={`relative z-10 -mt-4 transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-lg md:text-2xl font-mono tracking-widest uppercase text-center text-foreground">
          Strike First. Strike Hard.{" "}
          <span className="text-cobra-red font-bold">No Mercy.</span>
        </p>
        <p className="text-sm md:text-base font-mono tracking-wider uppercase text-center text-cobra-gold mt-3">
          Mossyrock, Washington &bull; Est. 2016
        </p>
      </div>

      {/* CTA */}
      <div className={`relative z-10 mt-12 transition-all duration-1000 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <a
          href="#enroll"
          className="brutal-btn inline-block bg-cobra-yellow text-black font-bold text-lg uppercase tracking-wider px-8 py-4 border-3 border-black"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          Join the Dojo
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFE66D" strokeWidth="3">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
