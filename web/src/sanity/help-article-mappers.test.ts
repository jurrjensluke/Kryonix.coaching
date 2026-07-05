import {describe, expect, it} from 'vitest'
import {mapHelpArticleDetail, mapHelpArticleList} from './content-mappers'

const articleBody = [
  {
    _key: 'intro',
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _key: 'intro-text',
        _type: 'span',
        text: 'Invite a pilot coach before adding clients.',
        marks: [],
      },
    ],
  },
]

describe('help article mappers', () => {
  it('maps valid help articles into sorted list items', () => {
    const articles = mapHelpArticleList([
      {
        title: 'Messaging clients',
        slug: 'messaging-clients',
        category: 'messaging',
        audience: 'coach',
        summary: 'Reply in context.',
      },
      {
        title: 'Billing setup',
        slug: 'billing-setup',
        category: 'billing',
        audience: 'coach',
        summary: 'Plan and invoices.',
      },
      {
        title: 'Missing slug',
        slug: '',
        category: 'billing',
        audience: 'coach',
        summary: 'Not navigable.',
      },
    ])

    expect(articles).toEqual([
      {
        title: 'Billing setup',
        slug: 'billing-setup',
        category: 'billing',
        audience: 'coach',
        summary: 'Plan and invoices.',
      },
      {
        title: 'Messaging clients',
        slug: 'messaging-clients',
        category: 'messaging',
        audience: 'coach',
        summary: 'Reply in context.',
      },
    ])
  })

  it('maps a complete help article into detail view data', () => {
    const article = mapHelpArticleDetail({
      title: 'Invite a pilot coach',
      slug: 'invite-pilot-coach',
      category: 'getting-started',
      audience: 'coach',
      summary: 'Set up the first coach workspace.',
      body: articleBody,
    })

    expect(article).toEqual({
      title: 'Invite a pilot coach',
      slug: 'invite-pilot-coach',
      category: 'getting-started',
      audience: 'coach',
      summary: 'Set up the first coach workspace.',
      body: articleBody,
    })
  })

  it('falls back to missing article view data when Sanity has no matching article', () => {
    const article = mapHelpArticleDetail(null)

    expect(article).toEqual({
      title: 'Help article not found',
      slug: '',
      category: '',
      audience: '',
      summary: '',
      body: [],
      missing: true,
    })
  })
})
