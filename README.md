# Kryonix Coaching

Monorepo for the Kryonix Coaching Sanity Studio and Next.js web app.

```text
kryonix-coaching/
├── studio/   # Standalone Sanity Studio
└── web/      # Next.js app
```

## Sanity

- Project ID: `kf6o4e7j`
- Dataset: `production`
- Studio path: `studio/`

The Studio stays standalone and is not embedded in the Next.js app.

Sanity is for editable product, marketing, onboarding, help, FAQ, and policy content. It is not the coaching platform database. Coach/client relationships, programmes, check-ins, messages, consent, Firebase Auth, Revolut subscriptions, and future Stripe Connect payments stay outside Sanity.

## Web

The Next.js app in `web/` uses `next-sanity` and reads publishable Sanity config from `NEXT_PUBLIC_SANITY_*` environment variables. Copy `web/.env.example` to `web/.env.local` if you want local overrides.

## Commands

```bash
cd studio
npm run dev
```

```bash
cd web
npm run dev
```

## Architecture Notes

- Sanity fit: `docs/SANITY_PLATFORM_FIT.md`
