# Sanity Fit In Kryonix Coaching

## Decision

Sanity is the content operations layer for Kryonix Coaching. It should power editable product, marketing, onboarding, support, legal, and help content.

Sanity is not the coaching platform database. Live coach/client data remains in Firebase and server-owned payment providers.

## Belongs In Sanity

- Public product pages.
- Coach onboarding pages and help articles.
- FAQ content.
- Feature descriptions and marketing claims.
- Legal/policy pages once those are modeled.
- Static app copy that product/content owners need to edit without a deploy.
- CMS-managed assets for product pages and help content.

## Does Not Belong In Sanity

- Firebase Auth users or coach custom claims.
- Coach/client relationships.
- Client consent scopes.
- Programmes assigned to real clients.
- Check-in submissions.
- Message threads.
- Readiness, HealthKit, workout, progress-photo, or body-metric data.
- Revolut subscription state.
- Stripe Connect client payments.

## Platform Boundary

```text
Sanity
  Product pages
  Help/onboarding content
  FAQ/legal copy
  Editorial CMS assets

Firebase / Functions
  Auth and custom claims
  Coaches and clients
  Programmes and assignments
  Check-ins and messages
  Consent and operational rules
  Revolut entitlement projection

Stripe Connect later
  Coach-to-client payments
```

The Next.js app can read both Sanity and Firebase, but each query should make the boundary obvious. Sanity reads are content reads. Firebase reads are authenticated product/workflow reads.

## First Content Model

- `productPage`: editable page content for the public or logged-out product surface.
- `helpArticle`: coach-facing help, onboarding, support, and billing articles.
- `featureHighlight`: reusable nested feature copy inside pages.
- `faqItem`: reusable nested FAQ entries inside pages.
- `callToAction`: reusable nested CTA fields.
- `seo`: nested page-specific metadata.

## Next Slices

1. Create a `productPage` document with slug `home`.
2. Add a `/help/[slug]` route in `web/` backed by `helpArticle`.
3. Add Firebase Auth and dashboard routes separately from Sanity content.
4. Add Visual Editing only after the content model stabilizes.
