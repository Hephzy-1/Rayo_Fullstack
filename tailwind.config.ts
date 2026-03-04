import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Rayo Brand Palette ── */
        rayo: {
          green:   "#254F22",   // primary / dark sections
          orange:  "#F5824A",   // accent CTAs
          alert:   "#A03A13",   // warning / error
          beige:   "#EDE4CC",   // page background
          "green-dark": "#1a3818",  // hover states on green
          "orange-dark": "#d96a34", // hover states on orange
          "beige-dark":  "#ddd3b5", // borders / dividers
          "beige-light": "#f5f0e4", // card surfaces
        },
        /* ── Semantic aliases (for shadcn compatibility) ── */
        background: "var(--background)",
        foreground:  "var(--foreground)",
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border:  "var(--border)",
        input:   "var(--input)",
        ring:    "var(--ring)",
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },
      fontFamily: {
        display: ["'Cabinet Grotesk'", "sans-serif"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card:     "0 2px 16px 0 rgba(37,79,34,0.08)",
        "card-lg":"0 8px 40px 0 rgba(37,79,34,0.12)",
        glow:     "0 0 32px 0 rgba(245,130,74,0.25)",
      },
      backgroundImage: {
        "hero-grain":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.6" },
        },
      },
      animation: {
        "slide-up":       "slide-up 0.6s ease-out both",
        "slide-up-delay": "slide-up 0.6s ease-out 0.15s both",
        "slide-up-slow":  "slide-up 0.6s ease-out 0.3s both",
        "fade-in":        "fade-in 0.8s ease-out both",
        float:            "float 4s ease-in-out infinite",
        pulse2:           "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
