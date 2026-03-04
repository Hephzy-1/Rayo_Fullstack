import Link from "next/link";
import { CheckCircle2, TrendingUp } from "lucide-react";

const AUTO_SAVES = [
  { label: "Auto-Save", time: "Today",       amount: "+₦1,250" },
  { label: "Auto-Save", time: "Yesterday",   amount: "+₦820"  },
  { label: "Auto-Save", time: "Aug 21–23",   amount: "+₦1,500" },
];

const BULLETS = [
  "Overdraft protection included",
  "Pause or withdraw anytime instantly",
  "Earn 4.5% APY on your savings",
];

export default function SmartStashSection() {
  return (
    <section
      id="how-it-works"
      className="relative bg-rayo-green overflow-hidden py-24 lg:py-32 bg-grain"
    >
      {/* Decorative circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #F5824A 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight text-balance">
              Set it and forget it.{" "}
              <span className="text-rayo-orange">The effortless way to wealth.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
              Our Smart Stash algorithm detects 'safe-to-save' money in your
              checking account and moves it automatically. No math required.
            </p>

            {/* Bullets */}
            <ul className="space-y-3 mb-10">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-rayo-orange shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <Link href="/auth/signup" className="btn-primary inline-flex text-base">
              Activate Smart Stash
            </Link>
          </div>

          {/* Right — savings mock UI */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-xs rounded-3xl bg-white/10 backdrop-blur border border-white/20 p-6 shadow-card-lg">
              {/* Total */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
                    Total Saved
                  </p>
                  <p className="font-display font-black text-3xl text-white">₦32,400</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-rayo-orange/20 border border-rayo-orange/30 flex items-center justify-center">
                  <TrendingUp size={18} className="text-rayo-orange" />
                </div>
              </div>

              {/* Auto-save list */}
              <div className="space-y-3">
                {AUTO_SAVES.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl bg-white/8 border border-white/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-rayo-green-dark flex items-center justify-center">
                        <TrendingUp size={13} className="text-rayo-orange" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{item.label}</p>
                        <p className="text-white/40 text-xs">{item.time}</p>
                      </div>
                    </div>
                    <span className="text-rayo-orange font-bold text-sm font-mono">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
