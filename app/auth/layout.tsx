import Link from "next/link";
import RayoLogo from "@/components/icons/RayoLogo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-rayo-beige">
      {/* Minimal header */}
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-rayo-green text-white font-display font-bold text-xs">
            <RayoLogo className="text-rayo-beige" size={26} />
          </span>
          <span className="font-display font-bold text-rayo-green text-lg">Rayo AI</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer note */}
      <footer className="text-center py-4 text-xs text-rayo-green/40">
        © 2026 Rayo Financial Inc. ·{" "}
        <Link href="/privacy" className="underline hover:text-rayo-green">Privacy</Link>
        {" "}·{" "}
        <Link href="/terms" className="underline hover:text-rayo-green">Terms</Link>
      </footer>
    </div>
  );
}
