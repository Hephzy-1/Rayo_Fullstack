import { createClient } from "@/lib/supabase/server";
import { formatNaira, relativeTime } from "@/lib/utils";
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
  Bot,
  AlertCircle,
  Sparkles,
} from "lucide-react";

async function getDashboardData(userId: string) {
  const supabase = createClient();

  const [accountsRes, transactionsRes, savingsRes, insightsRes] =
    await Promise.all([
      supabase
        .from("accounts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at"),
      supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("savings")
        .select("*")
        .eq("user_id", userId)
        .single(),
      supabase
        .from("ai_insights")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  return {
    accounts: accountsRes.data ?? [],
    transactions: transactionsRes.data ?? [],
    savings: savingsRes.data,
    insights: insightsRes.data ?? [],
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-rayo-orange/15 text-rayo-orange",
  Transport: "bg-rayo-green/15 text-rayo-green",
  Entertainment: "bg-purple-100 text-purple-700",
  Utilities: "bg-blue-100 text-blue-700",
  Health: "bg-red-100 text-red-700",
  Savings: "bg-rayo-green/20 text-rayo-green",
  Salary: "bg-emerald-100 text-emerald-700",
  Other: "bg-rayo-beige-dark text-rayo-green/70",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { accounts, transactions, savings, insights } = await getDashboardData(user!.id);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const checkingBalance = accounts.find((a) => a.type === "checking")?.balance ?? 0;
  const savingsBalance = accounts.find((a) => a.type === "savings")?.balance ?? 0;
  const totalAutoSaved = savings?.auto_saved_amount ?? 0;

  const stats = [
    {
      label: "Total Balance",
      value: formatNaira(totalBalance),
      icon: Wallet,
      change: "+₦3,200 this month",
      positive: true,
    },
    {
      label: "Savings",
      value: formatNaira(savingsBalance),
      icon: PiggyBank,
      change: `₦${totalAutoSaved.toLocaleString()} auto-saved`,
      positive: true,
    },
    {
      label: "Checking",
      value: formatNaira(checkingBalance),
      icon: TrendingUp,
      change: "Available to spend",
      positive: true,
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page title */}
      <div>
        <h1 className="font-display font-black text-3xl text-rayo-green">
          Dashboard
        </h1>
        <p className="text-rayo-green/60 text-sm mt-1">
          Here's what's happening with your money today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, change, positive }) => (
          <div key={label} className="feature-card">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-rayo-green/10 flex items-center justify-center">
                <Icon size={20} className="text-rayo-green" />
              </div>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  positive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rayo-alert/10 text-rayo-alert"
                }`}
              >
                {positive ? "↑" : "↓"} Active
              </span>
            </div>
            <p className="text-xs font-semibold text-rayo-green/50 uppercase tracking-widest mb-1">
              {label}
            </p>
            <p className="font-display font-black text-2xl text-rayo-green mb-1">
              {value}
            </p>
            <p className="text-xs text-rayo-green/50">{change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent transactions */}
        <div className="lg:col-span-2 feature-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-lg text-rayo-green">
              Recent Transactions
            </h2>
            <button className="text-xs font-semibold text-rayo-orange hover:underline">
              View all
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="text-center py-10 text-rayo-green/40">
              <Wallet size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No transactions yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2.5 border-b border-rayo-beige last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                        tx.type === "credit"
                          ? "bg-emerald-100"
                          : "bg-rayo-alert/10"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownLeft size={16} className="text-emerald-600" />
                      ) : (
                        <ArrowUpRight size={16} className="text-rayo-alert" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-rayo-green">
                        {tx.description || tx.category}
                      </p>
                      <p className="text-xs text-rayo-green/40">
                        {relativeTime(tx.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold font-mono ${
                        tx.type === "credit"
                          ? "text-emerald-600"
                          : "text-rayo-green"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatNaira(tx.amount)}
                    </p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS.Other
                      }`}
                    >
                      {tx.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights panel */}
        <div className="space-y-4">
          <div className="feature-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-rayo-green flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <h2 className="font-display font-bold text-base text-rayo-green">
                AI Insights
              </h2>
            </div>

            {insights.length === 0 ? (
              <div className="text-center py-6 text-rayo-green/40">
                <Sparkles size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">
                  Insights will appear as Rayo learns your habits.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`rounded-xl p-3 text-sm border ${
                      insight.type === "alert"
                        ? "bg-rayo-alert/8 border-rayo-alert/20 text-rayo-alert"
                        : insight.type === "achievement"
                        ? "bg-rayo-orange/8 border-rayo-orange/20 text-rayo-orange"
                        : "bg-rayo-green/8 border-rayo-green/20 text-rayo-green"
                    }`}
                  >
                    <div className="flex gap-2">
                      {insight.type === "alert" ? (
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles size={14} className="shrink-0 mt-0.5" />
                      )}
                      <p className="leading-snug">{insight.message}</p>
                    </div>
                    <p className="text-[10px] opacity-60 mt-1.5 ml-5">
                      {relativeTime(insight.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget summary mini card */}
          <div className="feature-card bg-rayo-green text-white border-0">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
              Monthly Budget
            </p>
            <p className="font-display font-black text-2xl mb-1">₦45,000</p>
            <div className="h-2 rounded-full bg-white/20 mb-2">
              <div
                className="h-2 rounded-full bg-rayo-orange transition-all"
                style={{ width: "62%" }}
              />
            </div>
            <p className="text-white/60 text-xs">62% used · ₦17,100 remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}
