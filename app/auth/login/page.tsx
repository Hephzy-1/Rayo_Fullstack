"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { ZodError } from "zod";

type FieldErrors = Partial<Record<string, string>>;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const parsed = signInSchema.safeParse(form);
    if (!parsed.success) {
      const fe: FieldErrors = {};
      (parsed.error as ZodError).errors.forEach((err) => {
        if (err.path[0]) fe[err.path[0] as string] = err.message;
      });
      setErrors(fe);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error) {
      setServerError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white border border-rayo-beige-dark shadow-card-lg p-8">
        <h1 className="font-display font-black text-3xl text-rayo-green mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-rayo-green/60 mb-8">
          Log in to your Rayo account.
        </p>

        {serverError && (
          <div className="mb-5 rounded-xl bg-rayo-alert/10 border border-rayo-alert/20 px-4 py-3 text-sm text-rayo-alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-rayo-green mb-1.5">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => set("email")(e.target.value)}
              placeholder="adaeze@example.com"
              className={cn(
                "w-full rounded-xl border bg-white px-4 py-3 text-sm text-rayo-green placeholder:text-rayo-green/30",
                "transition-all outline-none focus:ring-2 focus:ring-rayo-green/30",
                errors.email ? "border-rayo-alert" : "border-rayo-beige-dark focus:border-rayo-green"
              )}
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-rayo-alert">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-rayo-green">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-rayo-orange hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password")(e.target.value)}
                placeholder="Enter your password"
                className={cn(
                  "w-full rounded-xl border bg-white px-4 py-3 pr-11 text-sm text-rayo-green placeholder:text-rayo-green/30",
                  "transition-all outline-none focus:ring-2 focus:ring-rayo-green/30",
                  errors.password ? "border-rayo-alert" : "border-rayo-beige-dark focus:border-rayo-green"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-rayo-green/40 hover:text-rayo-green transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rayo-alert">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Logging in…</>
            ) : (
              "Log in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-rayo-green/60">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-rayo-green hover:text-rayo-orange transition-colors">
            Start for free
          </Link>
        </p>
      </div>
    </div>
  );
}
