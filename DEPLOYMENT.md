# AI Data Center Operations Virtual Office — Deployment Guide

## Prerequisites

- Node.js 18+
- npm 9+
- Supabase account
- Vercel account

---

## 1. Supabase Setup

### 1.1 Create a Project

1. Go to [supabase.com](https://supabase.com) → New project
2. Choose a region close to your users
3. Copy your **Project URL** and **anon/public key** from Settings → API

### 1.2 Run Migrations

In the Supabase SQL Editor, run:

```sql
-- Run in order:
-- 1. supabase/migrations/001_initial_schema.sql
-- 2. supabase/seed.sql  (optional: loads demo data)
```

Or use the Supabase CLI:

```bash
npx supabase db push
npx supabase db seed
```

### 1.3 Authentication Setup

In Supabase Dashboard → Authentication → Providers:
- Enable **Email** provider
- (Optional) Enable Google/GitHub OAuth

---

## 2. Local Development

```bash
# 1. Clone the repository
git clone <your-repo>
cd virtual-office

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
npm run dev
# Visit http://localhost:3000
```

---

## 3. Vercel Deployment

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy to production
vercel --prod
```

### Option B: GitHub Integration (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import Git Repository
3. Select your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

---

## 4. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Service role for admin operations |
| `NEXT_PUBLIC_APP_URL` | No | Your deployment URL |

---

## 5. Post-Deployment Checklist

- [ ] Supabase migrations applied
- [ ] Seed data loaded (optional)
- [ ] Environment variables set in Vercel
- [ ] Auth redirect URLs configured in Supabase (Settings → Auth → URL Configuration)
  - Site URL: `https://your-domain.vercel.app`
  - Redirect URLs: `https://your-domain.vercel.app/**`
- [ ] RLS policies verified
- [ ] Custom domain configured (optional)

---

## 6. Architecture Overview

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Global KPI dashboard
│   ├── office/             # Isometric virtual office
│   ├── agents/             # AI Agents center
│   ├── incidents/          # Incident management
│   ├── maintenance/        # PM/CM scheduling
│   ├── assets/             # Asset tracking
│   ├── reports/            # Analytics & reports
│   ├── settings/           # User settings
│   └── auth/login/         # Authentication
├── components/
│   ├── layout/             # AppLayout, Sidebar, TopBar
│   ├── dashboard/          # KpiCard, Charts
│   ├── office/             # IsometricOffice, DepartmentPanel
│   ├── agents/             # AgentCard, AgentChat
│   └── ui/                 # Shared UI primitives
├── store/                  # Zustand global state
├── lib/supabase/           # Supabase client (browser + server)
├── data/mock.ts            # Mock data for demo
└── types/                  # TypeScript types + Database schema

supabase/
├── migrations/001_initial_schema.sql   # Full schema + RLS
└── seed.sql                            # Demo data
```

---

## 7. User Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Full access, user management, settings |
| **Manager** | View all, create/update incidents & tasks |
| **Engineer** | View all, update assigned tasks |
| **Viewer** | Read-only access to all modules |

---

## 8. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI primitives + custom |
| Icons | Lucide React |
| Animation | Framer Motion |
| Charts | Recharts |
| State | Zustand |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |
