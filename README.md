# LBS MCA Prep Tracker

Progress tracking app for LBS MCA preparation — built with Next.js 15, motion/react, and Zustand.

## Stack

- **Next.js 15** — App Router, React 19
- **motion/react** — animations (formerly Framer Motion)
- **Zustand** — client state with `localStorage` persistence
- **TypeScript** — full type safety
- **Tailwind CSS** — utility classes
- **DM Sans + DM Mono** — typography

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

**Option 1 — Vercel CLI**
```bash
npm i -g vercel
vercel
```

**Option 2 — GitHub**
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo → Deploy (zero config needed)

## Structure

```
src/
├── app/
│   ├── page.tsx          # Home — 4×4 day grid
│   ├── day/[day]/
│   │   └── page.tsx      # Individual day checklist
│   ├── overview/
│   │   └── page.tsx      # Subject progress + milestones
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── Nav.tsx
│   └── ProgressRing.tsx
└── lib/
    ├── curriculum.ts     # All 16 days of topic data
    └── store.ts          # Zustand progress store
```

## Progress persistence

All progress is saved to `localStorage` under the key `lbs-tracker-progress`. It persists across browser sessions automatically via Zustand's `persist` middleware.
