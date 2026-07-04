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

  it('filters invalid help articles out of navigation data', () => {
    const articles = mapHelpArticleList([
      {title: 'Ready article', slug: 'ready-article', category: 'getting-started', audience: 'coach', summary: 'Complete content.'},
      {title: 'Missing slug', slug: '', category: 'getting-started', audience: 'coach', summary: 'Not navigable.'},
    ])

    expect(articles.map((article) => article.slug)).toEqual(['ready-article'])
  })

  it('keeps valid help articles without optional summaries', () => {
    const articles = mapHelpArticleList([
      {title: 'Coach setup', slug: 'coach-setup', category: 'getting-started', audience: 'coach'},
    ])

    expect(articles).toEqual([
      {
        title: 'Coach setup',
        slug: 'coach-setup',
        category: 'getting-started',
        audience: 'coach',
        summary: '',
      },
    ])
  })
})
