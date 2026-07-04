import {defineQuery} from 'next-sanity'

export const PRODUCT_PAGE_QUERY = defineQuery(`*[
  _type == "productPage" &&
  slug.current == $slug &&
  status == "published"
][0]{
  title,
  "slug": slug.current,
  heroTitle,
  heroText,
  primaryCallToAction{
    label,
    href
  },
  secondaryCallToAction{
    label,
    href
  },
  features[]{
    _key,
    title,
    summary,
    status
  },
  faqs[]{
    _key,
    question,
    answer
  },
  seo
}`)
