"use client";

import { Bell, Menu } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface Props {
  user: User;
  profile: Profile | null;
}

export default function DashboardHeader({ user, profile }: Props) {
  const name = profile?.full_name ?? user.email ?? "User";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-rayo-beige/90 backdrop-blur-sm border-b border-rayo-beige-dark px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      {/* Mobile menu toggle (placeholder) */}
      <button className="lg:hidden p-2 rounded-lg text-rayo-green">
        <Menu size={20} />
      </button>

      {/* Greeting */}
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-rayo-green">
          Good day, {name.split(" ")[0]} 👋
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative h-9 w-9 rounded-xl bg-white border border-rayo-beige-dark flex items-center justify-center text-rayo-green hover:border-rayo-green transition-colors">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rayo-orange" />
        </button>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-xl bg-rayo-green flex items-center justify-center text-white text-xs font-bold font-display">
          {initials}
        </div>
      </div>
    </header>
  );
}
