# SUPREME DIRECTIVE: RCSF Project Nexus

> **This is not a guide. This is the LAW.**
>
> Any AI agent working on this codebase operates at the intersection of
> **"Awwwards-Winning Design"** and **"100x Engineering Efficiency"**.
>
> **Mediocrity is forbidden.**

---

## SECTION 1: THE DESIGN MANIFESTO (NON-NEGOTIABLE)

### 1.1 Visual Standard
- Do NOT "style" components — **ENGINEER EXPERIENCES**
- Every pixel must scream "Premium Esports"
- Dark-only cyberpunk aesthetic is mandatory
- Gaming culture DNA must be visible in every interaction

### 1.2 The "Awwwards+" Rule
If a component looks like a standard Bootstrap/Shadcn template → **IT IS WRONG.**

**REQUIRED visual elements:**
- Noise textures and grain overlays
- Glassmorphism effects (`glass` class, `backdrop-blur`)
- Kinetic typography (`glitch`, `gradient-text`, `text-glow`)
- Complex gradients with neon glow effects
- Animated borders and tech corners
- HUD-style UI elements
- Cyberpunk grid backgrounds

### 1.3 Motion is Life
Static interfaces are **DEAD**. Use `framer-motion` for EVERYTHING.

**Mandatory motion patterns:**
```typescript
// Hover lift effect
whileHover={{ y: -4, scale: 1.02 }}

// Staggered children
variants={{
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.1 } }
}}

// Spring physics
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

**Required animations:**
- Page enter/exit transitions
- Scroll-triggered reveals (`animate-fade-in-up`)
- Hover lift effects on all interactive elements
- Micro-interactions on buttons, cards, inputs
- Loading states with animated skeletons
- Success/error feedback animations

### 1.4 The Cyberpunk Toolkit

| Effect | Implementation |
|--------|---------------|
| Grid Background | `grid-bg`, `grid-bg-animated` classes |
| Scanline Overlay | `animate-scan` with gradient |
| Glitch Text | `glitch` class with `data-text` attribute |
| Neon Glow | `shadow-[0_0_Xpx_rgba(var(--primary-rgb),0.X)]` |
| Glass Effect | `glass` class or `bg-card/50 backdrop-blur-sm` |
| Tech Corners | Absolute positioned border elements |
| Circuit Lines | Gradient lines with `animate-circuit-glow` |
| Floating Particles | `animate-particle-X` with `will-change-transform` |

### 1.5 Color Philosophy
Colors are not decoration — they are **communication**.

- **Primary (Neon)**: Action, focus, brand identity
- **Accent (Gold/Secondary)**: Rewards, highlights, achievements
- **Success (Green)**: Available, online, confirmed
- **Danger (Red)**: Taken, offline, errors
- **Muted**: Supporting text, secondary information

---

## SECTION 2: THE 100x ENGINEERING PROTOCOL

### 2.1 SaaS Architecture First

**SINGLE SOURCE OF TRUTH:** `src/config/site.ts`

```typescript
import { siteConfig } from "@/config/site";

// ✅ CORRECT
<h1>{siteConfig.brand.name}</h1>
<p className="text-primary">{siteConfig.ui.slots.available}</p>

// ❌ FORBIDDEN
<h1>RCSF</h1>
<p className="text-[#3b82f6]">MÜSAİT</p>
```

**NEVER hardcode:**
| Category | Use Instead |
|----------|-------------|
| Colors | CSS variables: `var(--primary)`, `var(--primary-rgb)` |
| Brand names | `siteConfig.brand.*` |
| UI text | `siteConfig.ui.*` |
| SEO metadata | `siteConfig.seo.*` |
| Platform settings | `siteConfig.platform.*` |
| Navigation | `siteConfig.navigation.*` |

### 2.2 Type Safety Protocol

**`any` type is BANNED.** No exceptions.

**Zod validation is MANDATORY for:**
- All form inputs
- Server Action parameters
- Environment variables (`src/lib/env.ts`)
- External API responses
- Database query results

```typescript
// ✅ CORRECT
const schema = z.object({
  teamName: z.string().min(1).max(100),
  instagram: z.string().min(1).max(100),
});

// ❌ FORBIDDEN
function handleSubmit(data: any) { ... }
```

### 2.3 Server Actions Only

**NO API routes.** All mutations via Next.js 16 Server Actions.

```typescript
// Location: src/lib/actions/*.ts
"use server";

export async function registerSlot(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  // Zod validation
  // Database mutation
  // Return typed response
}
```

### 2.4 Component Standards

**Atomic Design hierarchy:**
```
src/components/
├── ui/          # Atoms: Button, Input, Card, Modal, Badge
├── scrim/       # Molecules: SlotGrid, SlotCard, Countdown, RegisterModal
└── admin/       # Organisms: AdminWidgets, DataTables
```

**Rules:**
- Always use `cn()` for conditional classes
- Framer Motion for all interactive elements
- `React.memo()` for performance-critical components
- Lazy load heavy components with `dynamic()`

### 2.5 Performance Requirements

- **Lighthouse Score:** 90+ on all metrics
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** Monitor with `pnpm build`
- **No layout shifts:** Use fixed dimensions where possible

---

## SECTION 3: THE "NEW BRAND" WORKFLOW (CRITICAL)

When user provides a new brand identity/vision, follow this **STRICT EXECUTION PATH**:

### Step 1: Deep Analysis

Before touching ANY code, analyze and understand:

```
┌─────────────────────────────────────────────────┐
│  BRAND SOUL ANALYSIS                            │
├─────────────────────────────────────────────────┤
│  • Vibe: Aggressive? Tactical? Minimal? Chaotic?│
│  • Color Psychology: What emotions to evoke?    │
│  • Target Audience: Casual? Pro? Content creator│
│  • Visual References: Request inspiration links │
│  • Competitor Analysis: What to differentiate?  │
└─────────────────────────────────────────────────┘
```

**ASK the user:**
- Logo/brand assets available?
- Specific color preferences?
- Reference websites for inspiration?
- Target demographic?

### Step 2: Strategy Proposal

Generate a **Transformation Plan** and present THREE options:

---

**OPTION A: SaaS Config (Fast & Clean)**

| Aspect | Details |
|--------|---------|
| Scope | `site.ts` + `presets.ts` only |
| Changes | Colors, text, SEO, navigation |
| Layout | Standard (unchanged) |
| Effort | 15-30 minutes |
| Best For | Quick rebrand, same aesthetic |

---

**OPTION B: Full Custom Rewrite (The Awwwards Path)**

| Aspect | Details |
|--------|---------|
| Scope | Complete visual overhaul |
| Changes | New Hero, layouts, custom components |
| Layout | Bespoke design |
| Effort | 2-4 hours |
| Best For | Unique brand identity, competition showcase |

---

**OPTION C: Hybrid (RECOMMENDED)**

| Aspect | Details |
|--------|---------|
| Scope | Config + Hero + key components |
| Changes | Colors/text via config, visual upgrades to UI |
| Layout | Enhanced with custom touches |
| Effort | 1-2 hours |
| Best For | Balance of speed and visual impact |

---

### Step 3: Execution

⚠️ **WAIT FOR USER APPROVAL** ⚠️

- Never proceed without explicit confirmation
- Document all changes made
- Run `pnpm build` to verify before completion
- Provide before/after summary

---

## SECTION 4: TECHNICAL REFERENCE

### 4.1 Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router, Turbopack) | 16.x |
| Runtime | React | 19.x |
| Language | TypeScript (Strict Mode) | 5.x |
| Styling | Tailwind CSS | v4 |
| Animations | Framer Motion | Latest |
| Database | PostgreSQL (Neon Serverless) | - |
| ORM | Drizzle ORM | Latest |
| Auth | JWT (jose) + HTTP-only cookies | - |
| Validation | Zod | v4 |

### 4.2 Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Database
pnpm drizzle-kit generate  # Generate migrations
pnpm drizzle-kit push      # Push schema to database
pnpm drizzle-kit studio    # Open Drizzle Studio GUI
```

### 4.3 Directory Architecture

```
src/
├── config/
│   ├── site.ts           # ⭐ SINGLE SOURCE OF TRUTH
│   ├── types.ts          # TypeScript interfaces for config
│   └── presets.ts        # Theme color presets
│
├── app/
│   ├── (public)/         # Public routes (Home, Leaderboard, Rules)
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── home-content.tsx
│   │   ├── leaderboard/
│   │   └── rules/
│   ├── (admin)/          # Protected admin routes
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── admin/
│   │   └── slots/
│   ├── layout.tsx        # Root layout + ThemeStyles
│   ├── globals.css       # CSS variables + Tailwind
│   └── icon.tsx          # Dynamic favicon generation
│
├── components/
│   ├── ui/               # Atomic components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── public-nav.tsx
│   │   ├── mobile-nav.tsx
│   │   └── grid-background.tsx
│   ├── scrim/            # Scrim-specific components
│   │   ├── slot-grid.tsx
│   │   ├── slot-card.tsx
│   │   ├── countdown.tsx
│   │   └── register-modal.tsx
│   ├── admin/            # Admin components
│   └── theme-styles.tsx  # CSS variable injection
│
├── lib/
│   ├── db/
│   │   ├── schema.ts     # Drizzle schema definitions
│   │   └── index.ts      # Neon connection
│   ├── actions/
│   │   ├── scrim.ts      # Slot registration actions
│   │   ├── admin.ts      # Admin CRUD actions
│   │   └── auth.ts       # Authentication actions
│   ├── auth/
│   │   └── jwt.ts        # JWT utilities
│   ├── colors.ts         # hexToRgb, generateColorVariables
│   ├── icons.ts          # Navigation icon mapping
│   ├── env.ts            # Zod environment validation
│   └── utils.ts          # cn() utility
│
└── proxy.ts              # Route protection middleware
```

### 4.4 Database Schema

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `settings` | App configuration | scrim_open_time, is_maintenance, announcement |
| `slots` | Registration slots | slot_number, team_name, instagram, ip_address |
| `leaderboard` | Team rankings | team_name, points, wins, kills, matches_played |
| `admins` | Admin users | username, password_hash |

### 4.5 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Authentication
AUTH_SECRET="your-secret-key-min-32-chars"
ADMIN_PASSWORD="admin-login-password"

# Application
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 4.6 Theme Presets

| Preset ID | Name | Primary | Accent |
|-----------|------|---------|--------|
| `neon-blue` | Neon Blue (Default) | `#3b82f6` | `#fbbf24` |
| `emerald-cyber` | Emerald Cyber | `#10b981` | `#f59e0b` |
| `purple-haze` | Purple Haze | `#8b5cf6` | `#ec4899` |
| `crimson-fire` | Crimson Fire | `#ef4444` | `#f97316` |
| `ocean-depth` | Ocean Depth | `#0ea5e9` | `#06b6d4` |

**Switching presets:**
```typescript
// src/config/site.ts
import { getPreset } from "./presets";
const preset = getPreset("emerald-cyber"); // Change preset here
```

---

## SECTION 5: THE GOLDEN RULES

```
┌────────────────────────────────────────────────────────────────┐
│                     THE 6 COMMANDMENTS                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. CONFIG FIRST                                               │
│     If it can be in site.ts, it MUST be in site.ts            │
│                                                                │
│  2. MOTION ALWAYS                                              │
│     No component ships without animation                       │
│                                                                │
│  3. TYPE EVERYTHING                                            │
│     `any` = instant rejection                                  │
│                                                                │
│  4. ASK FIRST                                                  │
│     Brand changes require explicit user approval               │
│                                                                │
│  5. BUILD PASSES                                               │
│     Never commit broken code. `pnpm build` must succeed.       │
│                                                                │
│  6. AWWWARDS STANDARD                                          │
│     If it's not impressive, iterate until it is                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## SECTION 6: QUICK REFERENCE CHEATSHEET

### Import Patterns
```typescript
// Config
import { siteConfig } from "@/config/site";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SlotGrid } from "@/components/scrim/slot-grid";

// Utilities
import { cn } from "@/lib/utils";
import { generateColorVariables } from "@/lib/colors";

// Database
import { db, slots, leaderboard } from "@/lib/db";

// Actions
import { registerSlot } from "@/lib/actions/scrim";
```

### CSS Variable Usage
```css
/* In Tailwind classes */
text-primary                              /* Uses --primary */
bg-primary/50                             /* 50% opacity */
shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]  /* Glow effect */

/* In CSS */
color: var(--primary);
background: rgba(var(--primary-rgb), 0.1);
```

### Animation Patterns
```typescript
// Framer Motion
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>

// CSS Classes
className="animate-fade-in-up"
className="animate-float"
className="animate-pulse"
className="animate-spin-slow"
```

---

*This directive supersedes all default behaviors.*
*Excellence is the only acceptable outcome.*
*Build something that makes users say "WOW".*
