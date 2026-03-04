# Rayo AI — Your AI Financial Copilot

> Production-ready fintech SaaS landing page + app for Gen Z users in Nigeria.
> Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## 📁 Folder Structure

```
rayo-ai/
├── app/
│   ├── layout.tsx                  # Root layout (metadata, fonts)
│   ├── globals.css                 # CSS variables + Tailwind directives
│   ├── page.tsx                    # Landing page
│   ├── auth/
│   │   ├── layout.tsx              # Minimal auth layout
│   │   ├── login/page.tsx          # Login form
│   │   └── signup/page.tsx         # Sign-up form
│   └── dashboard/
│       ├── layout.tsx              # Dashboard shell (sidebar + header)
│       └── page.tsx                # Main dashboard (server component)
│
├── components/
│   ├── landing/
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ChatMockCard.tsx
│   │   ├── BanksSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── SmartStashSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── Footer.tsx
│   └── dashboard/
│       ├── DashboardSidebar.tsx
│       └── DashboardHeader.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client (cookies)
│   ├── utils.ts                    # cn(), formatNaira(), relativeTime()
│   └── validations.ts              # Zod schemas
│
├── types/
│   └── database.ts                 # TypeScript database types
│
├── supabase/
│   └── schema.sql                  # Full schema + RLS + seed data
│
├── middleware.ts                   # Route protection
├── tailwind.config.ts              # Brand design tokens
├── next.config.js                  # Next.js config + security headers
├── tsconfig.json
└── .env.example
```

---

## 🎨 Brand Design System

| Token              | Value     | Use                          |
|--------------------|-----------|------------------------------|
| `rayo-green`       | `#254F22` | Primary, dark sections       |
| `rayo-orange`      | `#F5824A` | Accent CTAs only             |
| `rayo-alert`       | `#A03A13` | Warnings / errors            |
| `rayo-beige`       | `#EDE4CC` | Page background              |
| `rayo-beige-light` | `#f5f0e4` | Card surfaces                |
| `rayo-beige-dark`  | `#ddd3b5` | Borders / dividers           |

**Fonts:** Cabinet Grotesk (display) · DM Sans (body) · JetBrains Mono (numbers)

---

## ⚙️ Environment Variables

Create `.env.local` (never commit this file):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Never add `SUPABASE_SERVICE_ROLE_KEY` with a `NEXT_PUBLIC_` prefix.

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- npm / pnpm / yarn
- Supabase account (free tier works)

### Steps

```bash
# 1. Clone / unzip project
cd rayo-ai

# 2. Install dependencies
npm install

# 3. Copy and fill environment variables
cp .env.example .env.local
# → Open .env.local and paste your Supabase URL + anon key

# 4. Set up the database
# → Go to Supabase Dashboard → SQL Editor
# → Open and run supabase/schema.sql in full

# 5. Configure Supabase Auth
# → Dashboard → Authentication → Settings
# → Set Site URL: http://localhost:3000
# → Add redirect URL: http://localhost:3000/auth/callback

# 6. Run dev server
npm run dev
# → Open http://localhost:3000
```

---

## 🗄️ Database Schema

### Tables

| Table          | Key columns                                                  |
|----------------|--------------------------------------------------------------|
| `profiles`     | id, user_id, full_name, avatar_url                           |
| `accounts`     | id, user_id, type (checking/savings), balance, currency      |
| `transactions` | id, user_id, account_id, amount, category, type, description |
| `savings`      | id, user_id, auto_saved_amount, target_amount, label         |
| `ai_insights`  | id, user_id, message, type (tip/alert/achievement), read     |

### RLS Policies

All tables have Row Level Security enabled. Every policy enforces:
```sql
USING (auth.uid() = user_id)
```

Users can only access their own rows. Transactions are immutable (no UPDATE/DELETE).

### Triggers

- `on_auth_user_created` → auto-creates profile, checking account, savings account, and savings record on new signup
- `handle_updated_at` → auto-sets `updated_at` on every UPDATE

---

## 🌱 Seed Data

After creating a test user via the signup flow, run the seed block in `schema.sql`:

1. Sign up with a test account
2. Copy the user's UUID from Supabase Dashboard → Authentication → Users
3. Uncomment the seed block in `supabase/schema.sql`
4. Replace `USER_UUID` with the real UUID
5. Run it in the SQL Editor

---

## 🔒 Security Checklist

- [x] All secrets in environment variables
- [x] Supabase anon key only (no service role key in client)
- [x] Server-side data fetching for protected routes
- [x] Zod input validation on all forms
- [x] RLS enabled and enforced on all tables
- [x] Middleware route protection (`/dashboard/*` requires auth)
- [x] Security headers (CSP, X-Frame-Options, etc.) in `next.config.js`
- [x] HTTPS enforced via Vercel/Supabase by default

---

## ☁️ Deployment

### Vercel (Frontend)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init: Rayo AI"
git remote add origin https://github.com/your-org/rayo-ai
git push -u origin main

# 2. Import repo at vercel.com
# 3. Add environment variables in Vercel Dashboard:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# 4. Deploy → done!
```

### Supabase (Backend)

```bash
# 1. Create project at supabase.com
# 2. Run schema.sql in SQL Editor
# 3. Authentication → Settings:
#    Site URL: https://your-domain.vercel.app
#    Redirect URLs: https://your-domain.vercel.app/auth/callback
# 4. Copy URL + anon key → Vercel env vars
```

### Custom Domain

In Vercel → Domains → Add `rayoapp.com` (or your domain).
Update Supabase Site URL to match.

---

## 📦 Key Dependencies

| Package                | Purpose                          |
|------------------------|----------------------------------|
| `next` 14              | App Router, RSC, server actions  |
| `@supabase/supabase-js`| Database + Auth client           |
| `@supabase/ssr`        | Cookie-based auth for Next.js    |
| `zod`                  | Schema validation                |
| `tailwindcss`          | Styling                          |
| `lucide-react`         | Icons                            |
| `clsx` + `tailwind-merge` | Conditional class utilities   |
| `framer-motion`        | Animations (optional extension)  |

---

## 🗺️ Roadmap

- [ ] AI chat interface (`/dashboard/ai`)
- [ ] Plaid / Mono bank connection integration  
- [ ] Push notifications for savings milestones
- [ ] Investment portfolio page
- [ ] Mobile app (React Native / Expo)

---

*© 2026 Rayo Financial Inc. All rights reserved.*
