"use client";

import { useState, useEffect } from "react";
const links = [
  { label: "Sensei", href: "#sensei" },
  { label: "Stories", href: "#stories" },
  { label: "Roster", href: "#roster" },
  { label: "Quiz", href: "#quiz" },
  { label: "Rules", href: "#rules" },
  { label: "Enroll", href: "#enroll" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-cobra-black/95 border-b-3 border-cobra-red backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="text-cobra-yellow font-bold text-lg uppercase tracking-wider">
          MRC<span className="text-cobra-red">K</span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-foreground font-mono text-xs uppercase tracking-wider px-3 py-2 hover:text-cobra-yellow hover:bg-cobra-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-cobra-yellow p-2"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cobra-black border-b-3 border-cobra-red px-4 pb-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-foreground font-mono text-sm uppercase tracking-wider px-3 py-3 hover:text-cobra-yellow hover:bg-cobra-dark transition-colors border-b border-cobra-dark"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
