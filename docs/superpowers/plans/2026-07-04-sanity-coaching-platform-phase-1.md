# Sanity Coaching Platform Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable Kryonix Coaching web slice: Sanity-backed public content, coach help content, and a static coach dashboard shell ready for Firebase/Auth integration.

**Architecture:** Sanity powers editable product/help/onboarding content only. The Next.js app renders Sanity content through typed GROQ queries and keeps operational coach/client surfaces separate so Firebase Auth, Firestore, Revolut, and Stripe Connect can be added without CMS data leakage.

**Tech Stack:** Sanity Studio, Next.js App Router, React 19, TypeScript, Tailwind CSS, next-sanity, @portabletext/react via next-sanity, Vitest, Testing Library.

---

## File Structure

- `docs/SANITY_PLATFORM_FIT.md`: source-of-truth boundary between Sanity and operational platform data.
- `studio/schemaTypes/*`: content schemas for product pages and help articles.
- `web/src/sanity/*`: Sanity client, queries, and content mapping helpers.
- `web/src/components/*`: reusable presentational UI components.
- `web/src/app/page.tsx`: Sanity-backed product homepage.
- `web/src/app/help/page.tsx`: help article index.
- `web/src/app/help/[slug]/page.tsx`: help article detail.
- `web/src/app/dashboard/page.tsx`: static coach dashboard shell.
- `web/src/**/*.test.ts(x)`: focused behavior tests.

## Task 1: Web Test Harness and Sanity Content Mappers

**Files:**
- Modify: `web/package.json`
- Create: `web/vitest.config.ts`
- Create: `web/src/test/setup.ts`
- Create: `web/src/sanity/content-mappers.ts`
- Test: `web/src/sanity/content-mappers.test.ts`

- [ ] **Step 1: Add the failing mapper tests**

Create `web/src/sanity/content-mappers.test.ts`:

```ts
import {describe, expect, it} from 'vitest'
import {mapProductPage, mapHelpArticleList} from './content-mappers'

describe('Sanity content mappers', () => {
  it('maps a published product page into homepage view data', () => {
    const page = mapProductPage({
      title: 'Home',
      slug: 'home',
      heroTitle: 'Coach clients with better signal',
      heroText: 'Roster, programming, check-ins, and messaging in one place.',
      primaryCallToAction: {label: 'Join the pilot', href: '/join'},
      secondaryCallToAction: {label: 'Read the plan', href: '/help/getting-started'},
      features: [
        {_key: 'f1', title: 'Roster', summary: 'Spot clients fading early.', status: 'pilot'},
      ],
      faqs: [{_key: 'q1', question: 'Where does coach data live?', answer: 'In Firebase.'}],
      seo: {title: 'Kryonix Coaching', description: 'Coach platform for trainers.'},
    })

    expect(page.hero.title).toBe('Coach clients with better signal')
    expect(page.hero.primaryAction?.href).toBe('/join')
    expect(page.features).toHaveLength(1)
    expect(page.faqs[0]?.answer).toContain('Firebase')
    expect(page.seo.title).toBe('Kryonix Coaching')
  })

  it('uses stable fallbacks when Sanity has no home document yet', () => {
    const page = mapProductPage(null)

    expect(page.hero.title).toContain('Coach platform')
    expect(page.features).toHaveLength(3)
    expect(page.faqs).toEqual([])
  })

  it('sorts help articles by category and title for navigation', () => {
    const articles = mapHelpArticleList([
      {title: 'Messaging clients', slug: 'messaging-clients', category: 'messaging', audience: 'coach', summary: 'Reply in context.'},
      {title: 'Billing setup', slug: 'billing-setup', category: 'billing', audience: 'coach', summary: 'Plan and invoices.'},
    ])

    expect(articles.map((article) => article.slug)).toEqual(['billing-setup', 'messaging-clients'])
  })
})
```

- [ ] **Step 2: Add test dependencies and script**

Run:

```bash
cd web
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

Add `"test": "vitest --run"` to `web/package.json`.

- [ ] **Step 3: Run the failing test**

Run:

```bash
cd web
npm test -- src/sanity/content-mappers.test.ts
```

Expected: FAIL because `content-mappers.ts` does not exist.

- [ ] **Step 4: Implement content mappers**

Create `web/src/sanity/content-mappers.ts` with:

```ts
export interface ActionViewModel {
  label: string
  href: string
}

export interface FeatureViewModel {
  key: string
  title: string
  summary: string
  status: string
}

export interface FaqViewModel {
  key: string
  question: string
  answer: string
}

export interface ProductPageViewModel {
  hero: {
    title: string
    text: string
    primaryAction?: ActionViewModel
    secondaryAction?: ActionViewModel
  }
  features: FeatureViewModel[]
  faqs: FaqViewModel[]
  seo: {
    title: string
    description: string
  }
}

type SanityProductPage = {
  title?: string | null
  slug?: string | null
  heroTitle?: string | null
  heroText?: string | null
  primaryCallToAction?: ActionViewModel | null
  secondaryCallToAction?: ActionViewModel | null
  features?: Array<{_key?: string | null; title?: string | null; summary?: string | null; status?: string | null}> | null
  faqs?: Array<{_key?: string | null; question?: string | null; answer?: string | null}> | null
  seo?: {title?: string | null; description?: string | null} | null
} | null

export function mapProductPage(page: SanityProductPage): ProductPageViewModel {
  return {
    hero: {
      title: page?.heroTitle ?? 'Coach platform content connected to Sanity.',
      text:
        page?.heroText ??
        'Sanity owns editable product and help content. Firebase owns coaches, clients, programmes, check-ins, billing entitlements, and messages.',
      primaryAction: page?.primaryCallToAction ?? undefined,
      secondaryAction: page?.secondaryCallToAction ?? undefined,
    },
    features: page?.features?.length
      ? page.features.map((feature, index) => ({
          key: feature._key ?? `feature-${index}`,
          title: feature.title ?? 'Untitled feature',
          summary: feature.summary ?? '',
          status: feature.status ?? 'planned',
        }))
      : [
          {key: 'roster', title: 'Roster with signal, not noise', summary: 'Coach cards show readiness trend, compliance, missed sessions, and clients needing attention.', status: 'planned'},
          {key: 'programmes', title: 'Programmes that reach the client app', summary: 'Build training blocks on the web and deliver them into the Kryonix app without a second format.', status: 'planned'},
          {key: 'check-ins', title: 'Check-ins and message context', summary: "Weekly forms, notes, and coach replies sit beside the client's training history and signals.", status: 'planned'},
        ],
    faqs:
      page?.faqs?.map((faq, index) => ({
        key: faq._key ?? `faq-${index}`,
        question: faq.question ?? '',
        answer: faq.answer ?? '',
      })) ?? [],
    seo: {
      title: page?.seo?.title ?? page?.title ?? 'Kryonix Coaching',
      description: page?.seo?.description ?? 'Coach platform for trainers and clients.',
    },
  }
}

export interface HelpArticleListItem {
  title: string
  slug: string
  category: string
  audience: string
  summary: string
}

export function mapHelpArticleList(
  articles: Array<Partial<HelpArticleListItem> | null> | null,
): HelpArticleListItem[] {
  return (articles ?? [])
    .filter((article): article is Partial<HelpArticleListItem> => Boolean(article?.title && article?.slug))
    .map((article) => ({
      title: article.title ?? 'Untitled',
      slug: article.slug ?? '',
      category: article.category ?? 'getting-started',
      audience: article.audience ?? 'coach',
      summary: article.summary ?? '',
    }))
    .sort((a, b) => `${a.category}-${a.title}`.localeCompare(`${b.category}-${b.title}`))
}
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
cd web
npm test -- src/sanity/content-mappers.test.ts
npm run lint
npm run build
```

Commit:

```bash
git add web/package.json web/package-lock.json web/vitest.config.ts web/src/test/setup.ts web/src/sanity/content-mappers.ts web/src/sanity/content-mappers.test.ts
git commit -m "test: add sanity content mapper harness"
```

## Task 2: Sanity-Backed Homepage Components

**Files:**
- Create: `web/src/components/marketing/product-home-page.tsx`
- Modify: `web/src/app/page.tsx`
- Test: `web/src/components/marketing/product-home-page.test.tsx`

- [ ] **Step 1: Write component tests**

Test that the component renders hero, CTA links, feature cards, and FAQ entries from a `ProductPageViewModel`.

- [ ] **Step 2: Run failing tests**

Run `cd web && npm test -- src/components/marketing/product-home-page.test.tsx`.

- [ ] **Step 3: Extract homepage rendering**

Move the current homepage JSX into `ProductHomePage`, accepting a typed `page` prop from `mapProductPage`.

- [ ] **Step 4: Update `web/src/app/page.tsx`**

Fetch Sanity content, call `mapProductPage`, and render `<ProductHomePage page={mappedPage} />`.

- [ ] **Step 5: Run tests and commit**

Run `cd web && npm test -- src/components/marketing/product-home-page.test.tsx && npm run lint && npm run build`.

Commit:

```bash
git add web/src/app/page.tsx web/src/components/marketing/product-home-page.tsx web/src/components/marketing/product-home-page.test.tsx
git commit -m "feat: render sanity-backed product homepage"
```

## Task 3: Help Article Routes

**Files:**
- Modify: `web/src/sanity/queries.ts`
- Modify: `web/src/sanity/content-mappers.ts`
- Create: `web/src/app/help/page.tsx`
- Create: `web/src/app/help/[slug]/page.tsx`
- Test: `web/src/sanity/help-article-mappers.test.ts`

- [ ] **Step 1: Write help mapper tests**

Test list item mapping and article detail mapping, including missing article fallback.

- [ ] **Step 2: Add GROQ queries**

Add `HELP_ARTICLES_QUERY` and `HELP_ARTICLE_QUERY`.

- [ ] **Step 3: Add `/help` index**

Render category-grouped help article links.

- [ ] **Step 4: Add `/help/[slug]` detail**

Render title, audience, category, summary, and Portable Text body.

- [ ] **Step 5: Run tests and commit**

Run `cd web && npm test -- src/sanity/help-article-mappers.test.ts && npm run lint && npm run build`.

Commit:

```bash
git add web/src/sanity web/src/app/help
git commit -m "feat: add sanity-backed help routes"
```

## Task 4: Static Coach Dashboard Shell

**Files:**
- Create: `web/src/domain/dashboard/dashboard-sample-data.ts`
- Create: `web/src/domain/dashboard/dashboard-status.ts`
- Create: `web/src/app/dashboard/page.tsx`
- Test: `web/src/domain/dashboard/dashboard-status.test.ts`

- [ ] **Step 1: Write dashboard status tests**

Test `onTrack`, `fading`, `atRisk`, and `needsReview` classification from sample compliance/readiness/check-in fields.

- [ ] **Step 2: Implement status derivation**

Keep this pure and Firebase-ready; no Sanity imports.

- [ ] **Step 3: Build dashboard page**

Render static roster table, attention queue, programme/check-in/message summary cards, and a clear note that live data will come from Firebase.

- [ ] **Step 4: Run tests and commit**

Run `cd web && npm test -- src/domain/dashboard/dashboard-status.test.ts && npm run lint && npm run build`.

Commit:

```bash
git add web/src/domain/dashboard web/src/app/dashboard
git commit -m "feat: add coach dashboard shell"
```

## Self-Review

- Spec coverage: Plan starts the Sanity-backed product/help content path and creates a separate coach dashboard shell ready for Firebase operational data.
- Boundary check: No task puts live coach/client/programme/payment records into Sanity.
- Placeholder scan: Each task has exact files, commands, and acceptance gates.
