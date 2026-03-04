import { TrendingUp, Mic, Send } from "lucide-react";

const messages = [
  {
    from: "user",
    text: "Morning Alert! 🌤 Your paycheck just hit. Want me to move ₦200 to your Travel Fund?",
  },
  {
    from: "rayo",
    text: "Yes please! Also, how much can I spend on dinner tonight?",
  },
  {
    from: "user",
    text: "Done! ₦200 saved.\n\nBased on your goals, you have ₦45 safe-to-spend for dinner. Enjoy! 🍽",
  },
];

export default function ChatMockCard() {
  return (
    <div
      className="w-full max-w-sm rounded-3xl bg-white shadow-card-lg border border-rayo-beige-dark overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-xs font-semibold text-rayo-green/50">9:41</span>
        <div
          className="flex items-center gap-1.5 rounded-full bg-rayo-green px-3 py-1"
        >
          <TrendingUp size={11} className="text-white" />
          <span className="text-xs font-bold text-white">
            SAVINGS GROWTH
          </span>
          <span className="text-xs font-black text-rayo-orange">+24%</span>
        </div>
      </div>

      {/* Date label */}
      <p className="text-center text-[11px] text-rayo-green/40 font-medium py-1">
        Today
      </p>

      {/* Messages */}
      <div className="px-4 space-y-3 pb-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === "rayo" ? "justify-end" : "justify-start"}`}
          >
            {msg.from === "user" && (
              <span className="h-7 w-7 rounded-full bg-rayo-green/20 flex items-center justify-center text-xs font-bold text-rayo-green mr-2 mt-0.5 shrink-0">
                R
              </span>
            )}
            <div
              className={`rounded-2xl px-4 py-2.5 max-w-[75%] text-sm leading-snug whitespace-pre-line ${
                msg.from === "rayo"
                  ? "bg-rayo-green text-white rounded-tr-sm"
                  : "bg-rayo-beige text-rayo-green rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-2 rounded-xl border border-rayo-beige-dark bg-rayo-beige px-4 py-2.5">
          <Mic size={15} className="text-rayo-green/40" />
          <span className="flex-1 text-sm text-rayo-green/40">
            Ask Rayo anything…
          </span>
          <button className="h-7 w-7 rounded-lg bg-rayo-orange flex items-center justify-center">
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
