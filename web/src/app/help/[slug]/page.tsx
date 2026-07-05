import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText, type PortableTextComponents} from 'next-sanity'
import {sanityClient} from '@/sanity/client'
import {mapHelpArticleDetail} from '@/sanity/content-mappers'
import {HELP_ARTICLE_QUERY} from '@/sanity/queries'

type HelpArticlePageProps = {
  params: Promise<{slug: string}>
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <p className="my-5 leading-8 text-[#d6dde0]">{children}</p>,
    h2: ({children}) => (
      <h2 className="mb-4 mt-10 text-2xl font-semibold text-white">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mb-3 mt-8 text-xl font-semibold text-white">{children}</h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-2 border-[#80e0b2] pl-5 text-[#d6dde0]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="my-5 list-disc space-y-2 pl-6 text-[#d6dde0]">{children}</ul>
    ),
    number: ({children}) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-[#d6dde0]">{children}</ol>
    ),
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      const isExternal = href.startsWith('http')

      return (
        <a
          href={href}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          className="font-semibold text-[#80e0b2] underline underline-offset-4"
        >
          {children}
        </a>
      )
    },
  },
}

export default async function HelpArticlePage({params}: HelpArticlePageProps) {
  const {slug} = await params
  const article = mapHelpArticleDetail(await sanityClient.fetch(HELP_ARTICLE_QUERY, {slug}))

  if (article.missing) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#101315] px-6 py-12 text-[#f5f7f8]">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/help"
          className="text-sm font-bold uppercase tracking-[0.14em] text-[#80e0b2] transition hover:text-[#9aebc3]"
        >
          Help
        </Link>
        <header className="mt-8 border-b border-[#263036] pb-8">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-md border border-[#344047] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#c8d1d5]">
              {formatLabel(article.category)}
            </span>
            <span className="rounded-md border border-[#344047] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#c8d1d5]">
              {formatLabel(article.audience)}
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-normal text-white md:text-5xl">
            {article.title}
          </h1>
          {article.summary ? (
            <p className="mt-5 text-lg leading-8 text-[#aab4b9]">{article.summary}</p>
          ) : null}
        </header>
        <div className="pt-8">
          {article.body.length ? (
            <PortableText value={article.body} components={portableTextComponents} />
          ) : (
            <p className="rounded-md border border-[#263036] bg-[#171b1e] p-5 text-[#aab4b9]">
              This help article is waiting for body content in Sanity.
            </p>
          )}
        </div>
      </article>
    </main>
  )
}

function formatLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
