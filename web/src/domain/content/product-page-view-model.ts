export type ProductPageViewModel = {
  hero: {
    title: string
    text: string
    primaryAction?: {label: string; href: string}
    secondaryAction?: {label: string; href: string}
  }
  features: Array<{
    key: string
    title: string
    summary: string
    status: string
  }>
  faqs: Array<{
    key: string
    question: string
    answer: string
  }>
  seo: {
    title: string
    description: string
  }
}
