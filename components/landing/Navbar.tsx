"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import RayoLogo from "@/components/icons/RayoLogo";

const NAV_LINKS = [
  { label: "Features",    href: "#features" },
  { label: "How it Works",href: "#how-it-works" },
  { label: "Pricing",     href: "#pricing" },
  { label: "About",       href: "#about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-rayo-beige/95 backdrop-blur-md shadow-sm border-b border-rayo-beige-dark"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-rayo-green group-hover:scale-105 transition-transform">
              <RayoLogo className="text-rayo-beige" size={26} />
            </div>
            <span className="font-display font-bold text-rayo-green text-lg tracking-tight">
              Rayo AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm font-medium text-rayo-green/80 hover:text-rayo-green transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4">
            {/* <Link
              href="/auth/login"
              className="text-sm font-medium text-rayo-green hover:text-rayo-green-dark transition-colors"
            >
              Log in
            </Link> */}
            <Link href="/auth/waitlist" className="btn-primary text-sm px-5 py-2.5">
              Start Free
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-rayo-green"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-rayo-beige border-t border-rayo-beige-dark px-4 pb-6 pt-2 space-y-4 animate-slide-up">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-rayo-green py-2"
            >
              {label}
            </a>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            {/* <Link href="/auth/login" className="btn-secondary text-center">
              Log in
            </Link> */}
            <Link href="/auth/waitlist" className="btn-primary text-center">
              Start Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
