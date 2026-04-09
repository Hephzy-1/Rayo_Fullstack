import type { Metadata } from "next";
import { AudienceCard } from "@/components/about/AudienceCard";
import { Badge } from "@/components/about/Badge";
import Link from "next/link";
import {
  Zap,
  GraduationCap,
  Briefcase,
  Lock,
  Check,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About – Rayo AI",
  description:
    "Rayo AI is your financial co-pilot built for the modern economy, empowering the next generation to master their money.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-rayo-beige text-rayo-text overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="animate-fade-up-1 text-center pt-32 pb-24 px-6 max-w-[760px] mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-rayo-orange/10 text-rayo-orange border border-rayo-orange/25 rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-[0.12em] uppercase mb-7">
          <span className="w-1.5 h-1.5 bg-rayo-orange rounded-full" />
          Our Mission
        </div>

        <h1 className="font-display text-[clamp(44px,7vw,72px)] font-black leading-[1.02] tracking-tight text-rayo-green mb-7">
          Empowering the{" "}
          <em className="italic underline decoration-rayo-orange decoration-[3px] underline-offset-[6px]">
            next generation
          </em>{" "}
          to master their money.
        </h1>

        <p className="text-[17px] text-rayo-text-muted leading-[1.65] max-w-[480px] mx-auto">
          Rayo AI isn&apos;t just a tool — it&apos;s your financial co-pilot built for the modern
          economy. We are bridging the gap between complex finance and intuitive daily habits.
        </p>
      </section>

      <div className="max-w-[1100px] mx-auto border-t border-rayo-green/10" />

      {/* ── WHO IS RAYO FOR ── */}
      <section className="animate-fade-up-2 py-28 px-6 max-w-[1100px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-[36px] font-bold text-rayo-green mb-3">
            Who is Rayo for?
          </h2>
          <p className="text-rayo-grey text-[15px]">
            Designed for the unique financial lives of the modern earner.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <AudienceCard
            icon={<Zap className="w-6 h-6" />}
            title="Gen Z & Digital Natives"
            description="Built for those who expect instant, seamless, and mobile-first experiences. No bank queues, just pure control."
          />
          <AudienceCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Students"
            description="Smart budgeting tools for tuition, rent, and life. Learn financial literacy while managing your first real expenses."
          />
          <AudienceCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Freelancers & Creators"
            description="Smoothing out irregular income streams. Tools designed to handle taxes, invoices, and gig-economy volatility."
          />
        </div>
      </section>

      <div className="max-w-[1100px] mx-auto border-t border-rayo-green/10" />

      {/* ── SECURITY ── */}
      <section className="animate-fade-up-3 py-12 px-6 pb-28 max-w-[820px] mx-auto">
        <div className="relative overflow-hidden bg-rayo-green rounded-3xl px-10 py-16 text-center">
          <div
            className="absolute -top-16 -right-16 w-[200px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(245,130,74,0.18) 0%, transparent 70%)" }}
          />

          <div className="w-14 h-14 bg-rayo-orange/20 rounded-full flex items-center justify-center text-rayo-orange mx-auto mb-6">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-display text-[32px] font-bold text-white mb-4">
            Uncompromising Security
          </h2>
          <p className="text-[15px] text-rayo-beige/70 leading-[1.7] max-w-[400px] mx-auto mb-8">
            Your trust is our currency. We employ defense-grade infrastructure to ensure your
            personal data and assets never fall into the wrong hands.
          </p>

          <div className="flex justify-center gap-5 flex-wrap">
            <Badge icon={<Check className="w-4 h-4" />}       label="Bank-level Encryption (AES-256)" />
            <Badge icon={<ShieldCheck className="w-4 h-4" />} label="SOC2 Compliant" />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="animate-fade-up-4 text-center px-6 pt-12 pb-32">
        <h2 className="font-display text-[40px] font-bold text-rayo-green tracking-tight mb-8">
          Ready to take control?
        </h2>
        <a href={process.env.WAITLIST_FORM_URL} className="btn-accent text-base px-9 py-4">
          Join Rayo Today
          <ArrowRight className="w-4 h-4" />
        </a>
      </section>

    </main>
  );
}