import {ProductHomePage} from '@/components/marketing/product-home-page'
import {sanityClient} from '@/sanity/client'
import {mapProductPage} from '@/sanity/content-mappers'
import {PRODUCT_PAGE_QUERY} from '@/sanity/queries'

export default async function Home() {
  const page = await sanityClient.fetch(PRODUCT_PAGE_QUERY, {slug: 'home'})
  const mappedPage = mapProductPage(page)

  return <ProductHomePage page={mappedPage} />
}
