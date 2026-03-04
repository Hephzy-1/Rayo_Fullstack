"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  TrendingUp,
  Bot,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard",   href: "/dashboard",             icon: LayoutDashboard },
  { label: "Accounts",    href: "/dashboard/accounts",    icon: Wallet },
  { label: "Savings",     href: "/dashboard/savings",     icon: PiggyBank },
  { label: "Investments", href: "/dashboard/investments", icon: TrendingUp },
  { label: "Ask Rayo",    href: "/dashboard/ai",          icon: Bot },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white border-r border-rayo-beige-dark min-h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-rayo-beige-dark">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rayo-green text-white font-display font-bold text-sm">
          R
        </span>
        <span className="font-display font-bold text-rayo-green text-lg">Rayo AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-rayo-green text-white"
                  : "text-rayo-green/70 hover:bg-rayo-beige hover:text-rayo-green"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-1">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rayo-green/70 hover:bg-rayo-beige hover:text-rayo-green transition-all"
        >
          <Settings size={17} />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rayo-alert/80 hover:bg-rayo-alert/10 hover:text-rayo-alert transition-all"
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </aside>
  );
}
