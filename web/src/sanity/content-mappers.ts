import type {ProductPageViewModel} from '@/domain/content/product-page-view-model'

type SanityAction = {
  label?: string | null
  href?: string | null
}

type SanityFeature = {
  _key?: string | null
  title?: string | null
  summary?: string | null
  status?: string | null
}

type SanityFaq = {
  _key?: string | null
  question?: string | null
  answer?: string | null
}

type SanitySeo = {
  title?: string | null
  description?: string | null
}

export type SanityProductPage = {
  title?: string | null
  slug?: string | null
  heroTitle?: string | null
  heroText?: string | null
  primaryCallToAction?: SanityAction | null
  secondaryCallToAction?: SanityAction | null
  features?: SanityFeature[] | null
  faqs?: SanityFaq[] | null
  seo?: SanitySeo | null
} | null

export type SanityHelpArticle = {
  title?: string | null
  slug?: string | null
  category?: string | null
  audience?: string | null
  summary?: string | null
}

export type HelpArticleListItem = {
  title: string
  slug: string
  category: string
  audience: string
  summary: string
}

const fallbackProductPage: ProductPageViewModel = {
  hero: {
    title: 'Coach platform content connected to Sanity.',
    text:
      'Sanity owns editable product and help content. Firebase owns coaches, clients, programmes, check-ins, billing entitlements, and messages.',
  },
  features: [
    {
      key: 'roster',
      title: 'Roster with signal, not noise',
      summary:
        'Coach cards show readiness trend, compliance, missed sessions, and clients needing attention.',
      status: 'planned',
    },
    {
      key: 'programmes',
      title: 'Programmes that reach the client app',
      summary:
        'Build training blocks on the web and deliver them into the Kryonix app without a second format.',
      status: 'planned',
    },
    {
      key: 'check-ins',
      title: 'Check-ins and message context',
      summary:
        "Weekly forms, notes, and coach replies sit beside the client's training history and signals.",
      status: 'planned',
    },
  ],
  faqs: [],
  seo: {
    title: 'Kryonix Coaching',
    description: 'Coach platform for trainers.',
  },
}

export function mapProductPage(page: SanityProductPage): ProductPageViewModel {
  if (!page) {
    return fallbackProductPage
  }

  return {
    hero: {
      title: page.heroTitle ?? fallbackProductPage.hero.title,
      text: page.heroText ?? fallbackProductPage.hero.text,
      primaryAction: mapAction(page.primaryCallToAction),
      secondaryAction: mapAction(page.secondaryCallToAction),
    },
    features: (page.features ?? []).map((feature, index) => ({
      key: feature._key ?? `feature-${index}`,
      title: feature.title ?? '',
      summary: feature.summary ?? '',
      status: feature.status ?? '',
    })),
    faqs: (page.faqs ?? []).map((faq, index) => ({
      key: faq._key ?? `faq-${index}`,
      question: faq.question ?? '',
      answer: faq.answer ?? '',
    })),
    seo: {
      title: page.seo?.title ?? page.title ?? fallbackProductPage.seo.title,
      description: page.seo?.description ?? fallbackProductPage.seo.description,
    },
  }
}

export function mapHelpArticleList(articles: SanityHelpArticle[]): HelpArticleListItem[] {
  return articles
    .filter(isValidHelpArticle)
    .map((article) => ({
      title: article.title,
      slug: article.slug,
      category: article.category,
      audience: article.audience,
      summary: article.summary ?? '',
    }))
    .sort(
      (left, right) =>
        left.category.localeCompare(right.category) || left.title.localeCompare(right.title),
    )
}

function mapAction(action: SanityAction | null | undefined) {
  if (!action?.label || !action.href) {
    return undefined
  }

  return {
    label: action.label,
    href: action.href,
  }
}

function isValidHelpArticle(article: SanityHelpArticle): article is HelpArticleListItem {
  return Boolean(
    article.title &&
      article.slug &&
      article.category &&
      article.audience,
  )
}
