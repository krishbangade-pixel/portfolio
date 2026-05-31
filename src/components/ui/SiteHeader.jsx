"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const links = [
  { href: "home", label: "Home" },
  { href: "projects", label: "Projects" },
  { href: "about", label: "About" },
  { href: "services", label: "Services" },
  { href: "resume", label: "Resume" },
  { href: "personal-info", label: "Info" },
  { href: "contact", label: "Contact" },
];

export default function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-6 py-5 md:px-12">
      <nav className="glass-card mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3">
        <Link href="/" className="text-sm font-semibold tracking-[0.25em] text-cyan-300">
          KRISH
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1">
          {links.map((link) => (
            <motion.button
              key={link.href}
              type="button"
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => scrollToSection(link.href)}
              className="rounded-full px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10 hover:text-white md:text-sm"
            >
              {link.label}
            </motion.button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <div className="w-5 h-5 flex flex-col justify-center items-center">
            <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`} />
            <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block w-4 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`} />
          </div>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-6 right-6 mt-2 glass-card rounded-2xl p-4"
          >
            <div className="flex flex-col gap-2">
              {links.map((link, index) => (
                <motion.button
                  key={link.href}
                  type="button"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
