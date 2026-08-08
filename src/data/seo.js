/** Production origin for canonical schema / llms.txt. Runtime og:url still uses window.location.origin. */
export const SITE_ORIGIN = 'https://voidinkstudios.com'
export const BRAND_NAME = 'VOIDINK Studios'

export const DEFAULT_TITLE = 'VOIDINK Studios — Art, Logo, Comic, AI & Web'
export const DEFAULT_DESCRIPTION =
  'VOIDINK Studios creates custom logos, comic art, AI agents, websites, and apps for brands and creators worldwide. Transparent packages from $39, with full ownership on delivery.'

/** Real brand spellings people type — schema only, never stuffed into H1. */
export const ALTERNATE_NAMES = [
  'VOIDINK',
  'Void Ink',
  'Void Ink Studios',
  'VOIDINK Studio',
  'Voidink Studio',
  'Voidink Studios',
  'voidinkstudio',
  'voidinkstudios',
]

export function pageTitle(name) {
  if (!name) return DEFAULT_TITLE
  return `${name} | VOIDINK Studios`
}

export function truncateMeta(text, max = 158) {
  const value = String(text || '').replace(/\s+/g, ' ').trim()
  if (value.length <= max) return value
  const slice = value.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`
}

export function serviceMetaDescription(service) {
  const lead = service?.tagline || service?.shortText || service?.overview || DEFAULT_DESCRIPTION
  const price = service?.startingPrice ? ` Starting ${service.startingPrice}.` : ''
  return truncateMeta(`${lead}${price}`)
}

export function parseStartingPrice(value) {
  if (!value) return null
  const match = String(value).replace(/,/g, '').match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: BRAND_NAME,
    alternateName: ALTERNATE_NAMES,
    url: `${SITE_ORIGIN}/`,
    logo: `${SITE_ORIGIN}/voidink_logo.jpeg`,
    image: `${SITE_ORIGIN}/og-image.jpg`,
    email: 'support@voidinkstudios.com',
    description:
      'Remote-first creative and technology studio for custom artwork, branding, websites, apps, and AI agents.',
    areaServed: 'Worldwide',
    sameAs: ['https://x.com/voidinkstudios', 'https://www.instagram.com/voidinkstudios/'],
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_ORIGIN}/#website`,
    name: BRAND_NAME,
    alternateName: ALTERNATE_NAMES,
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    inLanguage: 'en',
  }
}

export function faqEntity(question, answer) {
  const text = String(answer || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!question || !text) return null
  return {
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text,
    },
  }
}

export function faqAnswerFromItem(item) {
  const parts = [...(item?.a || [])]
  if (Array.isArray(item?.groups)) {
    item.groups.forEach((group) => {
      const list = Array.isArray(group.list) ? group.list.join('; ') : ''
      parts.push(group.title ? `${group.title}: ${list}` : list)
    })
  }
  if (Array.isArray(item?.after)) parts.push(...item.after)
  if (item?.note) parts.push(item.note)
  return parts.filter(Boolean).join(' ')
}

export function faqPageSchema(items) {
  const mainEntity = (items || []).map((item) => faqEntity(item.q, item.a)).filter(Boolean)
  if (!mainEntity.length) return null
  return {
    '@type': 'FAQPage',
    mainEntity,
  }
}

export function faqPageSchemaFromCategories(categories) {
  const items = (categories || []).flatMap((group) =>
    (group.items || []).map((item) => ({
      q: item.q,
      a: faqAnswerFromItem(item),
    })),
  )
  return faqPageSchema(items)
}

export function serviceSchema(service, { path } = {}) {
  if (!service?.title) return null
  const url = `${SITE_ORIGIN}${path || `/services/${service.slug}`}`
  const price = parseStartingPrice(service.startingPrice)
  const node = {
    '@type': 'Service',
    name: service.title,
    description: service.tagline || service.shortText || service.overview || '',
    url,
    provider: { '@id': `${SITE_ORIGIN}/#organization` },
    areaServed: 'Worldwide',
    serviceType: service.title,
  }
  if (price != null) {
    node.offers = {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: String(price),
      url,
    }
  }
  return node
}

export function breadcrumbSchema(crumbs) {
  const itemListElement = (crumbs || [])
    .filter((crumb) => crumb?.name && crumb?.path)
    .map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.path.startsWith('http') ? crumb.path : `${SITE_ORIGIN}${crumb.path}`,
    }))
  if (!itemListElement.length) return null
  return {
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

export function graphSchema(...nodes) {
  const graph = nodes.filter(Boolean)
  if (!graph.length) return null
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
