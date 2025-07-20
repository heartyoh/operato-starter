
# My Starter Template

This is a monorepo template for modern frontend development:
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- TanStack Table scaffold
- Expo + Nativewind (optional mobile app)
- Shared UI/hooks/utils packages
- Turborepo-based workspace
- API Proxy template for Spring backend

## Getting Started

1️⃣ Install dependencies:
```
pnpm install
```

2️⃣ Run web:
```
pnpm dev --filter web
```

3️⃣ Run mobile:
```
pnpm dev --filter mobile
```

## Project structure
- `apps/web`: Next.js app
- `apps/mobile`: Expo + Nativewind
- `packages/ui`: Shared UI components
- `packages/hooks`: Shared hooks
- `packages/utils`: Shared utilities
