import {readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {render, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import type {ProductPageViewModel} from '@/domain/content/product-page-view-model'
import {ProductHomePage} from './product-home-page'

describe('ProductHomePage', () => {
  it('stays decoupled from Sanity content mapping', () => {
    const source = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), 'product-home-page.tsx'),
      'utf8',
    )

    expect(source).not.toContain('@/sanity')
  })

  it('renders homepage content from mapped Sanity view data', () => {
    const page: ProductPageViewModel = {
      hero: {
        title: 'Coach clients with better signal',
        text: 'Roster, programming, check-ins, and messaging in one place.',
        primaryAction: {label: 'Join the pilot', href: '/join'},
        secondaryAction: {label: 'Read the plan', href: '/help/getting-started'},
      },
      features: [
        {
          key: 'roster',
          title: 'Roster with signal',
          summary: 'Spot clients fading early.',
          status: 'pilot',
        },
        {
          key: 'programmes',
          title: 'Programmes that ship',
          summary: 'Deliver plans into the client app.',
          status: 'next',
        },
      ],
      faqs: [
        {
          key: 'data',
          question: 'Where does coach data live?',
          answer: 'Firebase owns coaches, clients, programmes, check-ins, and messages.',
        },
      ],
      seo: {
        title: 'Kryonix Coaching',
        description: 'Coach platform for trainers.',
      },
    }

    render(<ProductHomePage page={page} />)

    expect(screen.getByRole('heading', {level: 1, name: page.hero.title})).toBeInTheDocument()
    expect(screen.getByText(page.hero.text)).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Join the pilot'})).toHaveAttribute('href', '/join')
    expect(screen.getByRole('link', {name: 'Read the plan'})).toHaveAttribute(
      'href',
      '/help/getting-started',
    )

    const features = screen.getAllByRole('article').slice(0, page.features.length)
    expect(within(features[0]!).getByRole('heading', {level: 2, name: 'Roster with signal'})).toBeInTheDocument()
    expect(within(features[0]!).getByText('Spot clients fading early.')).toBeInTheDocument()
    expect(within(features[0]!).getByText('pilot')).toBeInTheDocument()
    expect(within(features[1]!).getByRole('heading', {level: 2, name: 'Programmes that ship'})).toBeInTheDocument()

    expect(screen.getByRole('heading', {level: 2, name: 'Questions'})).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {level: 3, name: 'Where does coach data live?'}),
    ).toBeInTheDocument()
    expect(screen.getByText(/Firebase owns coaches/)).toBeInTheDocument()
  })
})
