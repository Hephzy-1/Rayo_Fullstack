import Link from "next/link";
import { CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

const AUTO_SAVES = [
  { label: "Auto-Save", time: "Today",       amount: "+₦1,250" },
  { label: "Auto-Save", time: "Yesterday",   amount: "+₦820"   },
  { label: "Auto-Save", time: "Tue, Oct 24", amount: "+₦1,500" },
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
      className="relative bg-rayo-green overflow-hidden py-24 lg:py-32"
    >
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/2 -translate-y-1/2 h-96 w-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #F5824A 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── Left: copy ── */}
          <div>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight text-balance">
              Set it and forget it.{" "}
              <span className="text-rayo-orange">The effortless way to wealth.</span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-md">
              Our Smart Stash algorithm detects 'safe-to-save' money in your
              checking account and moves it automatically. No math required.
            </p>

            <ul className="space-y-3 mb-10">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                  <CheckCircle2 size={18} className="text-rayo-orange shrink-0" />
                  {b}
                </li>
              ))}
            </ul>

            <Link
              href="/waitlist"
              className="btn-primary bg-white text-rayo-green inline-flex hover:bg-rayo-beige-light"
            >
              Activate Smart Stash
            </Link>
          </div>

          {/* ── Right: savings mock card ── */}
          <div className="flex justify-center lg:justify-center">
            <div className="w-full max-w-xs rounded-3xl bg-rayo-muted/70 p-6 shadow-card-lg">

              {/* Header: total + trend icon */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-rayo-grey">
                    Total Saved
                  </p>
                  <p className="font-poppins font-black text-4xl leading-none text-rayo-green">
                    ₦32,400
                  </p>
                </div>

                <div className="h-9 w-9 rounded-full bg-rayo-lemon/80 flex items-center justify-center shrink-0">
                  <TrendingUp size={16} className="text-rayo-green-light" strokeWidth={2.5} />
                </div>
              </div>

              {/* Auto-save rows — last one fades out */}
              <div className="space-y-2.5">
                {AUTO_SAVES.map((item, i) => {
                  const isLast = i === AUTO_SAVES.length - 1;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-2xl bg-white px-4 py-3 transition-opacity ${
                        isLast ? "opacity-50" : "opacity-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-rayo-muted flex items-center justify-center shrink-0">
                          <Sparkles size={13} className="text-rayo-green" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold leading-none mb-0.5 text-rayo-green-dark">
                            {item.label}
                          </p>
                          <p className="text-xs leading-none text-rayo-text-muted">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      <span className="font-poppins font-black text-sm text-rayo-green-light">
                        {item.amount}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}