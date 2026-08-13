/** Production origin for canonical schema / llms.txt. Runtime og:url still uses window.location.origin. */
export const SITE_ORIGIN = 'https://voidinkstudios.com'
export const BRAND_NAME = 'VOIDINK Studios'

/** ISO date for WebPage dateModified — bump when homepage content meaningfully changes. */
export const SITE_DATE_MODIFIED = '2026-08-12'
/** Visible “Last updated” on Privacy / Terms (LegalPageShell). */
export const LEGAL_DATE_MODIFIED = '2026-07-28'

export const DEFAULT_TITLE = 'VOIDINK Studios — Art Born From The VOID'
/** Keep ~110–165 chars for SERP snippets (tool-checked). */
export const DEFAULT_DESCRIPTION =
  'Custom logos, comic art, AI agents, websites & apps for brands and creators. Packages from $39 — full ownership on delivery.'

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

/** Plain-language definition — AEO tools look for "is defined as" / "in plain language". */
export function serviceDefinition(service) {
  const title = String(service?.title || 'This service').trim()
  const raw = String(service?.shortText || service?.overview || 'a custom VOIDINK Studios commission.')
    .replace(/\s+/g, ' ')
    .trim()
  const body = raw ? `${raw.charAt(0).toLowerCase()}${raw.slice(1)}` : 'a custom commission from VOIDINK Studios.'
  return `${title} is defined as ${body}`
}

export function truncateMeta(text, max = 158) {
  const value = String(text || '').replace(/\s+/g, ' ').trim()
  if (value.length <= max) return value
  const slice = value.slice(0, max - 1)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 80 ? slice.slice(0, lastSpace) : slice).trim()}…`
}

export function serviceMetaDescription(service) {
  const lead = String(service?.tagline || service?.shortText || service?.overview || DEFAULT_DESCRIPTION)
    .replace(/\s+/g, ' ')
    .trim()
  const audience =
    Array.isArray(service?.idealFor) && service.idealFor.length
      ? ` For ${service.idealFor.slice(0, 2).join(' and ')}.`
      : ''
  const price = service?.startingPrice ? ` From ${service.startingPrice}.` : ''
  let value = `${lead}${audience}${price} Full ownership on delivery.`
  if (value.length < 110 && service?.title) {
    value = `${value} Hire VOIDINK Studios for ${String(service.title).toLowerCase()}.`
  }
  return truncateMeta(value, 158)
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
      'Remote-first creative and technology studio for brands, creators, startups, and streamers — custom artwork, branding, websites, apps, and AI agents.',
    areaServed: 'Worldwide',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@voidinkstudios.com',
      url: `${SITE_ORIGIN}/#query`,
      availableLanguage: ['English'],
    },
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

/** Homepage / marketing page identity — not Article (this is not a blog post). */
export function webPageSchema({
  path = '/',
  name = BRAND_NAME,
  description = DEFAULT_DESCRIPTION,
  dateModified = SITE_DATE_MODIFIED,
  extraType,
} = {}) {
  const url = path.startsWith('http') ? path : `${SITE_ORIGIN}${path}`
  return {
    '@type': extraType ? ['WebPage', extraType] : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
    about: { '@id': `${SITE_ORIGIN}/#organization` },
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
    inLanguage: 'en',
    dateModified,
  }
}

/** About / FAQ / legal / track — WebPage + visible-matching breadcrumb. Not Article. */
export function sitePageSchema({
  path,
  name,
  description,
  dateModified = SITE_DATE_MODIFIED,
  extraType,
  breadcrumbName,
  extraNodes = [],
} = {}) {
  if (!path || !name) return null
  return graphSchema(
    webPageSchema({ path, name, description, dateModified, extraType }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: breadcrumbName || name, path },
    ]),
    ...extraNodes,
  )
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

export function servicePageSchema(service, { path } = {}) {
  if (!service?.title) return null
  const servicePath = path || `/services/${service.slug}`
  return graphSchema(
    webPageSchema({
      path: servicePath,
      name: pageTitle(service.title),
      description: serviceMetaDescription(service),
    }),
    serviceSchema(service, { path: servicePath }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/#services' },
      { name: service.title, path: servicePath },
    ]),
    faqPageSchema(service.faqs),
  )
}
