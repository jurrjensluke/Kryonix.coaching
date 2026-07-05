import Link from 'next/link'
import {sanityClient} from '@/sanity/client'
import {mapHelpArticleList} from '@/sanity/content-mappers'
import {HELP_ARTICLES_QUERY} from '@/sanity/queries'

export default async function HelpPage() {
  const articles = mapHelpArticleList(await sanityClient.fetch(HELP_ARTICLES_QUERY))
  const groupedArticles = Object.entries(
    articles.reduce<Record<string, typeof articles>>((groups, article) => {
      groups[article.category] = [...(groups[article.category] ?? []), article]
      return groups
    }, {}),
  )

  return (
    <main className="min-h-screen bg-[#101315] px-6 py-12 text-[#f5f7f8]">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-[#263036] pb-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#80e0b2]">
            Kryonix Coaching Help
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-white md:text-5xl">
            Help articles
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#aab4b9]">
            Sanity-managed onboarding and support content for coaches and clients.
          </p>
        </div>

        {groupedArticles.length ? (
          <div className="mt-10 grid gap-10">
            {groupedArticles.map(([category, categoryArticles]) => (
              <section key={category}>
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[#80e0b2]">
                  {formatLabel(category)}
                </h2>
                <div className="mt-4 divide-y divide-[#263036] border-y border-[#263036]">
                  {categoryArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/help/${article.slug}`}
                      className="block py-5 transition hover:bg-[#171b1e]"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{article.title}</h3>
                          {article.summary ? (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#aab4b9]">
                              {article.summary}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 rounded-md border border-[#344047] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#c8d1d5]">
                          {formatLabel(article.audience)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-md border border-[#263036] bg-[#171b1e] p-5 text-[#aab4b9]">
            Help articles will appear here when they are published in Sanity.
          </p>
        )}
      </div>
    </main>
  )
}

function formatLabel(value: string) {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}
