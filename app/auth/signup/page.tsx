"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { ZodError } from "zod";

function InputField({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  suffix,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-rayo-green mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-rayo-green placeholder:text-rayo-green/30",
            "transition-all outline-none focus:ring-2 focus:ring-rayo-green/30",
            error ? "border-rayo-alert" : "border-rayo-beige-dark focus:border-rayo-green",
            suffix && "pr-11"
          )}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rayo-alert">{error}</p>}
    </div>
  );
}

type FieldErrors = Partial<Record<string, string>>;

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (key: keyof typeof form) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError("");

    const parsed = signUpSchema.safeParse(form);
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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName },
      },
    });

    if (authError) {
      setServerError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // Upsert profile
      await supabase.from("profiles").upsert({
        user_id: authData.user.id,
        full_name: parsed.data.fullName,
      } as any);
    }

    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-md text-center space-y-4">
        <CheckCircle2 size={48} className="text-rayo-green mx-auto" />
        <h2 className="font-display font-black text-3xl text-rayo-green">
          Check your email!
        </h2>
        <p className="text-rayo-green/70">
          We sent a confirmation link to{" "}
          <span className="font-semibold">{form.email}</span>. Click it to
          activate your account.
        </p>
        <Link href="/auth/login" className="btn-primary inline-flex mx-auto">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl bg-white border border-rayo-beige-dark shadow-card-lg p-8">
        <h1 className="font-display font-black text-3xl text-rayo-green mb-1">
          Create your account
        </h1>
        <p className="text-sm text-rayo-green/60 mb-8">
          Join 10,000+ smart savers. It's free.
        </p>

        {serverError && (
          <div className="mb-5 rounded-xl bg-rayo-alert/10 border border-rayo-alert/20 px-4 py-3 text-sm text-rayo-alert">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <InputField
            label="Full Name"
            id="fullName"
            value={form.fullName}
            onChange={set("fullName")}
            placeholder="Adaeze Okafor"
            error={errors.fullName}
          />
          <InputField
            label="Email address"
            id="email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="adaeze@example.com"
            error={errors.email}
          />
          <InputField
            label="Password"
            id="password"
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
            placeholder="Min. 8 characters"
            error={errors.password}
            suffix={
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="text-rayo-green/40 hover:text-rayo-green transition-colors"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <InputField
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            placeholder="Repeat password"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              // <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              <><Loader2 size={16} className="animate-spin" /> Saving details</>
            ) : (
              "Join the waitlist →"
            )}
          </button>
        </form>

        {/* <p className="mt-6 text-center text-sm text-rayo-green/60">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-rayo-green hover:text-rayo-orange transition-colors"
          >
            Log in
          </Link>
        </p> */}
      </div>
    </div>
  );
}
