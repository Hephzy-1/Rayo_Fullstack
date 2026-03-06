import Link from "next/link";
import { Lock } from "lucide-react";
import RayoLogo from "@/components/icons/RayoLogo"

export default function Footer() {
  return (
    <footer className="border-t border-rayo-beige-dark bg-rayo-beige">
      {/* Security banner */}
      <div className="flex items-center justify-center gap-2 py-5 border-b border-rayo-beige-dark">
        <Lock size={14} className="text-rayo-green" />
        <p className="text-xs text-rayo-green/60 font-medium">
          Bank-level Security — Your data is encrypted with AES-256-bit encryption.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rayo-green text-white font-display font-bold text-xs">
              <RayoLogo className="text-white" size={26} />
            </span>
            <span className="font-display font-bold text-rayo-green text-base">Rayo AI</span>
          </Link>

          {/* Copyright */}
          <p className="text-xs text-rayo-green/40 order-3 sm:order-2">
            © 2026 Rayo Financial Inc.
          </p>

          {/* Links */}
          <nav className="flex items-center gap-5 order-2 sm:order-3">
            {["Privacy", "Terms", "Security", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-xs font-medium text-rayo-green/60 hover:text-rayo-green transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
