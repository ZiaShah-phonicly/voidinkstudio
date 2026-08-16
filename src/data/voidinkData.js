import { serviceDetails } from './serviceDetails'
import { isVideoSrc, serviceGalleries } from './serviceGalleries'

/** Single source of truth for marketing stats (hero, about, footer, SEO). */
export const studioStats = {
  projects: 500,
  clients: 200,
  countries: 25,
  services: 15,
  satisfaction: 99,
  rating: '4.9',
}

export const studioStatsCopy = {
  clientsCountries: `${studioStats.clients}+ clients in ${studioStats.countries} countries`,
  clientsCountriesTitle: `${studioStats.clients}+ Clients in ${studioStats.countries} Countries`,
  projectsDelivered: `${studioStats.projects}+ Projects Delivered`,
  trustedBy: `Trusted by ${studioStats.clients}+ clients in ${studioStats.countries} countries`,
}

export const marqueeItems = [
  'Website Design',
  'AI Chatbots & Voice',
  'App Development',
  'Comic Book Art',
  '3D Models',
  'Mascot Design',
  '2D VTuber Models',
  'Branding & Logo',
  'Animation',
  'DnD Character Art',
  'Furry Art',
  'Fursuit Commissions',
  'NSFW Art',
  'Cover Art',
  'Custom Character Design',
]

/** Home services grid: real portfolio folders first; missing-portfolio services last. */
const SERVICES_WITH_PORTFOLIO = new Set([
  'website-design-development',
  'ai-agents-chatbots',
  'app-development',
  'comic-book-art',
  '2d-vtuber-models',
  'branding-logo',
  'animation',
  'dnd-character-art',
  'cover-art',
  '3d-models',
  'custom-character-design',
  'furry-art',
  'nsfw-art',
])

export const services = serviceDetails
  .map(({ slug, icon, title, shortText, isNew, cardImage }) => ({
    slug,
    icon,
    title,
    text: shortText,
    isNew,
    cardImage,
  }))
  .slice()
  .sort((a, b) => {
    const aRank = SERVICES_WITH_PORTFOLIO.has(a.slug) ? 0 : 1
    const bRank = SERVICES_WITH_PORTFOLIO.has(b.slug) ? 0 : 1
    return aRank - bRank
  })

export const workCategories = ['All', 'Web', 'AI Agents', 'Apps', 'Design']

const WORK_CATEGORY_BY_SLUG = {
  'website-design-development': 'Web',
  'ai-agents-chatbots': 'AI Agents',
  'app-development': 'Apps',
  'comic-book-art': 'Design',
  '3d-models': 'Design',
  'mascot-design': 'Design',
  '2d-vtuber-models': 'Design',
  'branding-logo': 'Design',
  animation: 'Design',
  'dnd-character-art': 'Design',
  'furry-art': 'Design',
  'nsfw-art': 'Design',
  'cover-art': 'Design',
  'custom-character-design': 'Design',
  fursuits: 'Design',
}

/** Home portfolio order — one strong shot per service (best 6 → 2 rows × 3). */
const HOME_PORTFOLIO_SLUGS = [
  'website-design-development',
  'ai-agents-chatbots',
  'app-development',
  'comic-book-art',
  '2d-vtuber-models',
  'cover-art',
]

/** Preferred filename titles (without extension) when available in that gallery. */
const HOME_PORTFOLIO_PICKS = {
  'website-design-development': 'Saas-Landing',
  'ai-agents-chatbots': 'Automations-ai-03-AI-Voice-Agent',
  'app-development': 'Fintech-App-Development',
  'comic-book-art': 'Comic Book Panels',
  '2d-vtuber-models': 'Sage_s Vtuber',
  'cover-art': 'Cover Art',
}

/** All portfolio shots (built from serviceGalleries — title = filename). */
export const workItems = Object.entries(serviceGalleries).flatMap(([slug, items]) =>
  items.map((item, index) => ({
    id: `${slug}-${index}`,
    serviceSlug: slug,
    image: item.image,
    category: WORK_CATEGORY_BY_SLUG[slug] || 'Design',
    title: item.title,
    meta: item.meta,
    featured: false,
  })),
)

/** Home #work grid: best 6 across services (2 rows on desktop). */
export function getHomePortfolio(limit = 6) {
  const bySlug = new Map()
  for (const item of workItems) {
    if (!bySlug.has(item.serviceSlug)) bySlug.set(item.serviceSlug, [])
    bySlug.get(item.serviceSlug).push(item)
  }

  const picked = []
  for (const slug of HOME_PORTFOLIO_SLUGS) {
    const items = bySlug.get(slug) || []
    if (!items.length) continue
    const images = items.filter((item) => !isVideoSrc(item.image))
    const pool = images.length ? images : items
    const preferred = HOME_PORTFOLIO_PICKS[slug]
    const match = preferred ? pool.find((item) => item.title === preferred) : null
    picked.push(match || pool[0])
  }

  return picked.slice(0, limit)
}

export const processSteps = [
  { num: '01', title: 'Discovery', text: 'We learn your vision, audience & goals through detailed briefing.' },
  { num: '02', title: 'Concept', text: 'Initial concepts and sketches delivered within 24 hours.' },
  { num: '03', title: 'Refine', text: 'We refine the work until it performs — more engagement, more impact.' },
  { num: '04', title: 'Deliver', text: 'Final files in all formats with full ownership rights.' },
]

export const testimonials = [
  {
    rating: 5,
    text: 'Ordered a full-body DnD rogue for my Twitch campaign. Sketch came next day, final in 4 days. Armor and cloak details were spot on — my chat lost it when I revealed her.',
    initials: 'RK',
    name: 'Ryan K.',
    role: 'DnD Streamer · Austin, TX',
    meta: 'DnD Character Art',
    tone: 'violet',
    serviceSlug: 'dnd-character-art',
    backdropTitle: 'Rogue',
  },
  {
    rating: 5,
    text: 'We needed a store chatbot before Black Friday. They built it in a week — now it answers FAQs and captures emails overnight. Support tickets dropped a ton.',
    initials: 'SJ',
    name: 'Sarah J.',
    role: 'Founder, online boutique',
    meta: 'AI Chatbot',
    tone: 'pink',
    serviceSlug: 'ai-agents-chatbots',
    backdropTitle: 'Automations-ai-05-E-commerce-AI',
  },
  {
    rating: 5,
    text: 'Hired them for a 12-page comic issue. Linework and colors looked print-ready. We used the files for a small Kickstarter print run with zero redo.',
    initials: 'ML',
    name: 'Marcus L.',
    role: 'Indie Comic Publisher',
    meta: 'Comic Book Art',
    tone: 'indigo',
    serviceSlug: 'comic-book-art',
    backdropTitle: 'Comic Book Panels',
  },
  {
    rating: 5,
    text: 'Logo + brand kit for our SaaS launch. Clean mark, usable guidelines, delivered in under a week. Investors actually commented on how polished it looked.',
    initials: 'AP',
    name: 'Aisha P.',
    role: 'Startup Co-founder · London',
    meta: 'Branding',
    tone: 'fuchsia',
    serviceSlug: 'branding-logo',
    backdropTitle: 'BrandForge Identity',
  },
  {
    rating: 5,
    text: 'Got a half-body Live2D model for streaming. Expressions feel natural and VTube Studio setup was smooth. Worth every dollar for how often I use it on stream.',
    initials: 'YN',
    name: 'Yuri N.',
    role: 'VTuber · Japan',
    meta: '2D VTuber',
    tone: 'violet',
    serviceSlug: '2d-vtuber-models',
    backdropTitle: "Sage_s Vtuber",
  },
  {
    rating: 4,
    text: 'Website redesign for our clinic. Took about 10 days for the professional package. One page needed a tweak after launch but they fixed it same day. Patients keep saying the site looks more trustworthy.',
    initials: 'DH',
    name: 'Dr. Helen M.',
    role: 'Clinic Owner · Toronto',
    meta: 'Website Design',
    tone: 'indigo',
    serviceSlug: 'website-design-development',
    backdropTitle: 'Medical',
  },
]

/** Best portfolio shot for a review — prefers matching title, then still image, then any. */
export function getTestimonialBackdrop(item) {
  const gallery = serviceGalleries[item?.serviceSlug] || []
  if (!gallery.length) return null
  const preferred = item.backdropTitle
    ? gallery.find((entry) => entry.title === item.backdropTitle)
    : null
  if (preferred) {
    return { src: preferred.image, title: preferred.title, isVideo: isVideoSrc(preferred.image) }
  }
  const still = gallery.find((entry) => !isVideoSrc(entry.image))
  const pick = still || gallery[0]
  return pick ? { src: pick.image, title: pick.title, isVideo: isVideoSrc(pick.image) } : null
}

export const formServices = [
  'Website Design',
  'AI Agent / Chatbot',
  'App Development',
  'Comic Book Art',
  '3D Models',
  'Mascot Design',
  '2D VTuber Models',
  'Branding',
  'Logo Design',
  'Animation',
  'DnD Character Art',
  'Furry Art',
  'Fursuit Commission — Head',
  'Fursuit Commission — Partial',
  'Fursuit Commission — Full Suit',
  'Fursuit Commission — Other/Quote',
  'NSFW Art',
  'Cover Art',
  'Custom Character Design',
  'Other',
]

export const budgetOptions = ['Under $100', '$100-$500', '$500-$1,000', '$1,000-$3,000', '$3,000-$5,000', '$5,000+']
export const fursuitBudgetOptions = ['Under $1k', '$1k-$2k', '$2k-$3k', '$3k+']
export const fursuitSuitTypes = ['Head', 'Partial', 'Full', 'Other']
export const deadlineOptions = ['ASAP / Rush', '1 Week', '2 Weeks', '1 Month', 'Flexible']

export const CUSTOM_PACKAGE = 'Custom / Need a quote'

/** Map pricing tab id → contact form service name */
export const pricingCategoryToFormService = {
  web: 'Website Design',
  ai: 'AI Agent / Chatbot',
  app: 'App Development',
  comic: 'Comic Book Art',
  '3d': '3D Models',
  mascot: 'Mascot Design',
  vtuber: '2D VTuber Models',
  brand: 'Branding',
  anim: 'Animation',
  dnd: 'DnD Character Art',
  furry: 'Furry Art',
  fursuit: 'Fursuit Commissions',
  nsfw: 'NSFW Art',
  cover: 'Cover Art',
  character: 'Custom Character Design',
}

/** Form service name → pricing category id (for package dropdown) */
export const formServiceToPricingCategoryId = {
  ...Object.fromEntries(
    Object.entries(pricingCategoryToFormService).map(([id, service]) => [service, id]),
  ),
  // Logo Design shares Branding packages (Logo Only / Brand Starter / Full Brand)
  'Logo Design': 'brand',
  'Fursuit Commissions': 'fursuit',
  'Fursuit Commission — Head': 'fursuit',
  'Fursuit Commission — Partial': 'fursuit',
  'Fursuit Commission — Full Suit': 'fursuit',
  'Fursuit Commission — Other/Quote': 'fursuit',
}

export const FURSUIT_FORM_SERVICES = [
  'Fursuit Commission — Head',
  'Fursuit Commission — Partial',
  'Fursuit Commission — Full Suit',
  'Fursuit Commission — Other/Quote',
]

const FURSUIT_PACKAGE_TO_FORM_SERVICE = {
  'Custom Head': 'Fursuit Commission — Head',
  'Partial Suit': 'Fursuit Commission — Partial',
  'Full Suit': 'Fursuit Commission — Full Suit',
}

export function isFursuitFormService(serviceName) {
  if (!serviceName) return false
  return (
    serviceName === 'Fursuit Commissions' ||
    FURSUIT_FORM_SERVICES.includes(serviceName) ||
    String(serviceName).toLowerCase().includes('fursuit')
  )
}

export function getFursuitFormServiceForPackage(packageName) {
  if (!packageName || packageName === CUSTOM_PACKAGE) return 'Fursuit Commission — Other/Quote'
  return FURSUIT_PACKAGE_TO_FORM_SERVICE[packageName] || 'Fursuit Commission — Other/Quote'
}

export function getFursuitSuitTypeForPackage(packageName) {
  if (packageName === 'Custom Head') return 'Head'
  if (packageName === 'Partial Suit') return 'Partial'
  if (packageName === 'Full Suit') return 'Full'
  return 'Other'
}

export function getFursuitPackageForFormService(serviceName) {
  if (serviceName === 'Fursuit Commission — Head') return 'Custom Head'
  if (serviceName === 'Fursuit Commission — Partial') return 'Partial Suit'
  if (serviceName === 'Fursuit Commission — Full Suit') return 'Full Suit'
  if (serviceName === 'Fursuit Commission — Other/Quote') return CUSTOM_PACKAGE
  return ''
}

/**
 * Packages available in the contact form for a selected service.
 * Variants (e.g. Furry Reference Sheet SFW/NSFW) become separate options.
 */
export function getFormPackagesForService(serviceName) {
  const categoryId = formServiceToPricingCategoryId[serviceName]
  if (!categoryId) return []
  const category = pricingCategories.find((cat) => cat.id === categoryId)
  if (!category?.packages?.length) return []

  const options = []
  for (const pkg of category.packages) {
    if (Array.isArray(pkg.variants) && pkg.variants.length) {
      for (const variant of pkg.variants) {
        options.push({
          value: `${pkg.name} (${variant.label})`,
          label: `${pkg.name} (${variant.label})`,
          price: variant.price || '',
          desc: variant.desc || pkg.desc || '',
          features: variant.features || pkg.features || [],
        })
      }
    } else {
      options.push({
        value: pkg.name,
        label: pkg.name,
        price: pkg.price || '',
        desc: pkg.desc || '',
        features: pkg.features || [],
      })
    }
  }
  return options
}

export function findFormPackageOption(serviceName, packageValue) {
  if (!serviceName || !packageValue || packageValue === CUSTOM_PACKAGE) return null
  const options = getFormPackagesForService(serviceName)
  return (
    options.find((opt) => opt.value === packageValue) ||
    options.find((opt) => opt.label === packageValue) ||
    options.find((opt) => packageValue.endsWith(opt.value) || packageValue.includes(opt.value)) ||
    null
  )
}

export const pricingCategories = [
  {
    id: 'web',
    label: 'Website',
    packages: [
      {
        name: 'Starter',
        price: '$399',
        desc: 'Personal brands & small businesses',
        featured: false,
        features: [
          'Single Page Responsive Website',
          'Custom Modern Design (No Templates)',
          'Contact Form + WhatsApp Button',
          'Basic SEO + Speed Optimization',
          'Free Hosting Setup (Netlify/Vercel)',
          'Full Source Code Ownership',
          'Delivery: 3–5 Days',
        ],
      },
      {
        name: 'Professional',
        price: '$999',
        desc: 'Growing businesses & startups',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Up to 7 Custom Designed Pages',
          'Mobile + Tablet + Desktop Responsive',
          'CMS (Edit Content Yourself)',
          'Blog Section',
          'Full On-Page SEO Setup',
          'Google Analytics + Search Console',
          '30 Days Free Support',
          'Delivery: 7–10 Days',
        ],
      },
      {
        name: 'E-Commerce',
        price: '$2,499',
        desc: 'Online stores & product brands',
        featured: false,
        features: [
          'Up to 15 Pages + 100 Products Setup',
          'Shopping Cart + Checkout System',
          'Payment Gateway (Stripe/PayPal)',
          'Admin Dashboard + Order Management',
          'Customer Accounts + Reviews',
          'Full E-Commerce SEO',
          '60 Days Free Support',
          'Delivery: 14–21 Days',
        ],
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI Agents',
    packages: [
      {
        name: 'Starter',
        price: '$299',
        desc: '24/7 website support',
        featured: false,
        features: [
          'AI Chatbot for your website',
          'Trained on your business info',
          'Auto-reply to customer questions',
          'Lead capture (Name, Email, Phone)',
          'Google Sheets / Email notification',
          '30 Days Support',
          'Delivery: 3–5 Days',
        ],
      },
      {
        name: 'Professional',
        price: '$799',
        desc: 'Full automation',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Everything in Starter',
          'Advanced AI Chatbot with smart replies',
          'Workflow automations (n8n based)',
          'Appointment / inquiry auto-handling',
          'Multi-step lead routing',
          'Custom bot personality & tone',
          '60 Days Support',
          'Delivery: 7–10 Days',
        ],
      },
      {
        name: 'Enterprise',
        price: '$1,499',
        desc: 'Voice AI + full automation',
        featured: false,
        features: [
          'Everything in Professional',
          'AI Voice Agent (calls handling)',
          'Advanced multi-step automations',
          'Custom integrations with your tools',
          'Business-specific AI training',
          'Priority support',
          '6 Months Support',
          'Delivery: 14–21 Days',
        ],
      },
    ],
  },
  {
    id: 'app',
    label: 'App Dev',
    packages: [
      {
        name: 'Starter',
        price: '$599',
        desc: 'MVPs & simple apps',
        featured: false,
        features: [
          'Single Platform (iOS or Android)',
          'Up to 5 Screens',
          'Custom App Design',
          'Push Notifications',
          'Basic App Features',
          'App Store Submission',
          '30 Days Bug-Fix Support',
          'Delivery: 14–21 Days',
        ],
      },
      {
        name: 'Professional',
        price: '$2,499',
        desc: 'Startups & growing businesses',
        featured: true,
        badge: 'Most Popular',
        features: [
          'iOS + Android (Cross-Platform)',
          'Up to 12 Screens',
          'Custom Design + Smooth Animations',
          'Payment Integration',
          'Push Notifications',
          'Admin Panel',
          'Both Store Submissions',
          '60 Days Support',
          'Delivery: 30–45 Days',
        ],
      },
      {
        name: 'Enterprise',
        price: '$4,499',
        desc: 'Complex apps & platforms',
        featured: false,
        features: [
          'iOS + Android',
          'Up to 25 Screens',
          'AI Features (Chatbot / Smart Features)',
          'Full Admin Dashboard',
          'User Login / Authentication',
          'Custom API Development',
          'QA Testing',
          '90 Days Support',
          'Delivery: 60–90 Days',
        ],
      },
    ],
  },
  {
    id: 'comic',
    label: 'Comic',
    packages: [
      {
        name: 'Starter',
        price: '$399',
        desc: 'Short stories, pilots, samples',
        featured: false,
        features: [
          '4 Illustrated Pages',
          'Custom Character Designs',
          'Panel Layouts + Full Color',
          'Lettering + Speech Bubbles',
          'Any Style (Manga, American, Webtoon)',
          '3 Revisions',
          'Delivery: 3–5 Days',
        ],
      },
      {
        name: 'Standard',
        price: '$999',
        desc: 'Short comics, webtoons, pitches',
        featured: true,
        badge: 'Most Popular',
        features: [
          '12 Illustrated Pages',
          'Cover Art Included',
          'Custom Character Designs',
          'Full Color + Shading',
          'Lettering + Speech Bubbles',
          'Any Style You Want',
          '5 Revisions',
          'Delivery: 5–8 Days',
        ],
      },
      {
        name: 'Full Issue',
        price: '$2,499',
        desc: 'Full comic books & publishing',
        featured: false,
        features: [
          '24 Pages + Front & Back Cover',
          'Custom Character Designs',
          'Professional Inking + Full Color',
          'Lettering + Speech Bubbles',
          'Print-Ready (CMYK) + Digital Format',
          'Any Style You Want',
          'Unlimited Revisions',
          'Delivery: 12–15 Days',
        ],
      },
    ],
  },
  {
    id: '3d',
    label: '3D',
    packages: [
      {
        name: 'Basic',
        price: '$249',
        desc: 'Simple 3D objects, props, products',
        featured: false,
        features: [
          '1 Custom 3D Model',
          'Texturing + Materials',
          'Lighting + Rendered Image',
          'File Formats: FBX, OBJ, PNG Render',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Professional',
        price: '$349',
        desc: '3D characters, detailed models',
        featured: true,
        badge: 'Most Popular',
        features: [
          '1 Detailed 3D Character / Model',
          'Full Texturing + Materials',
          'Rigging Included',
          'Advanced Lighting + 3 Rendered Views',
          'Game-Ready or Animation-Ready',
          'File Formats: FBX, OBJ, GLTF, PNG Renders',
          '5 Revisions',
          'Delivery: 3–6 Days',
        ],
      },
      {
        name: 'Premium',
        price: '$599',
        desc: 'Complex characters & environments',
        featured: false,
        features: [
          '1 Premium 3D Character with Full Rigging',
          'Detailed Texturing + PBR Materials',
          'Multiple Rendered Views + Turntable Animation',
          'Game-Ready + Animation-Ready',
          'All File Formats + Source File',
          'Unlimited Revisions',
          'Delivery: 4–7 Days',
        ],
      },
    ],
  },
  {
    id: 'mascot',
    label: 'Mascot',
    packages: [
      {
        name: 'Basic',
        price: '$99',
        desc: 'Simple brand mascot',
        featured: false,
        features: [
          '1 Custom Mascot Design',
          '1 Pose + 2 Expressions',
          'High Resolution PNG + Source File',
          'Commercial Use Rights',
          '3 Revisions',
          'Delivery: 1–2 Days',
        ],
      },
      {
        name: 'Professional',
        price: '$169',
        desc: 'Full brand mascot with expressions',
        featured: true,
        badge: 'Most Popular',
        features: [
          '2 Mascot Concepts (Pick Best)',
          '3 Poses + 4 Expressions',
          'All File Formats + Source File',
          'Commercial Use Rights',
          '5 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Ultimate',
        price: '$249',
        desc: 'Complete package with animation',
        featured: false,
        features: [
          '3 Mascot Concepts (Pick Best)',
          '5 Poses + 6 Expressions',
          'Simple Animation (Waving/Idle)',
          'All File Formats + Source File',
          'Commercial Use Rights',
          'Unlimited Revisions',
          'Delivery: 3–5 Days',
        ],
      },
    ],
  },
  {
    id: 'vtuber',
    label: 'VTuber',
    packages: [
      {
        name: 'Half Body No Rig',
        price: '$149',
        desc: 'Character design only',
        featured: false,
        features: [
          'Custom 2D Half Body Character Design',
          'Detailed Hair, Face, Outfit Design',
          'Front View Illustration',
          'Color Palette + Expressions Sheet (3)',
          'High Resolution PNG + PSD Layers',
          'Commercial Use Rights',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Half Body Rigged',
        price: '$299',
        desc: 'New VTubers starting streaming',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Custom 2D Half Body Character Design',
          'Expressions Sheet (3 Expressions)',
          'PNG + PSD Layers',
          'Live2D Rigging (Head, Eyes, Mouth, Hair)',
          'Lip Sync Ready + Idle Animation',
          'VTube Studio Compatible + .moc3',
          'Commercial Use Rights',
          '4 Revisions',
          'Delivery: 3–5 Days',
        ],
      },
      {
        name: 'Full Body No Rig',
        price: '$249',
        desc: 'Full design without animation',
        featured: false,
        features: [
          'Custom 2D Full Body Character Design',
          'Detailed Head to Toe Design',
          'Front View Illustration',
          'Expressions Sheet (4 Expressions)',
          'High Resolution PNG + PSD Layers',
          'Commercial Use Rights',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Full Body Rigged',
        price: '$499',
        desc: 'Pro VTubers — full movement',
        featured: false,
        features: [
          'Custom 2D Full Body Design',
          'Full Live2D Rigging (Head to Arms)',
          'Lip Sync + Eye Tracking Ready',
          'Idle + Breathing Animation',
          'Hand Gestures (2 Poses)',
          'VTube Studio + .moc3 Included',
          'Commercial Use Rights',
          '5 Revisions',
          'Delivery: 3–5 Days',
        ],
      },
    ],
  },
  {
    id: 'brand',
    label: 'Branding',
    packages: [
      {
        name: 'Logo Only',
        price: '$59',
        desc: 'Startups needing just a logo',
        featured: false,
        features: [
          '4 Unique Logo Concepts',
          '3 Revisions',
          'Icon Version Included',
          'All File Formats (PNG, SVG, PDF)',
          '100% Ownership',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Brand Starter',
        price: '$199',
        desc: 'New brands building identity',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Logo (6 Concepts)',
          'Color Palette + Typography Selection',
          'Business Card Design (Design File Only)',
          'Social Media Profile Kit',
          '5 Revisions',
          '100% Ownership',
          'Delivery: 3–5 Days',
        ],
      },
      {
        name: 'Full Brand Identity',
        price: '$499',
        desc: 'Complete professional brand launch',
        featured: false,
        features: [
          'Logo (Unlimited Concepts)',
          'Full Color + Typography System',
          'Stationery Design Files (Card, Letterhead)',
          'Social Media Kit',
          'Mini Brand Guide Document',
          'Unlimited Revisions',
          '100% Ownership',
          'Delivery: 5–7 Days',
        ],
      },
    ],
  },
  {
    id: 'anim',
    label: 'Animation',
    packages: [
      {
        name: 'Logo Animation',
        price: '$99',
        desc: 'Brand intros & social media',
        featured: false,
        features: [
          '5–10 Second Logo Reveal Animation',
          'Premium Effects & Transitions',
          'Sound Effects Included',
          'MP4 + GIF Files',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Explainer Video',
        price: '$499',
        desc: 'Product/service marketing',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Up to 60 Second 2D Animation',
          'Script Writing Included',
          'Professional Voiceover',
          'Sound Effects + Background Music',
          'Storyboard Included',
          'HD 1080p Quality',
          '5 Revisions',
          'Delivery: 4–6 Days',
        ],
      },
      {
        name: 'Character Animation',
        price: '$899',
        desc: 'Custom animated characters',
        featured: false,
        features: [
          '30–60 Second Character Animation',
          'Custom Character Rigging',
          'Professional Voiceover',
          'Sound Design + Music',
          '4K Quality',
          'Unlimited Revisions',
          'Delivery: 6–8 Days',
        ],
      },
    ],
  },
  {
    id: 'dnd',
    label: 'DnD Art',
    packages: [
      {
        name: 'Character Art',
        price: '$99',
        desc: 'Single character showcase',
        featured: false,
        features: [
          '1 Full Body Character Art',
          'Detailed Armor, Weapons & Gear',
          'Any Style (Realistic, Semi-Realistic, Anime)',
          'High Resolution PNG + JPG',
          '3 Revisions',
          'Delivery: 1–2 Days',
        ],
      },
      {
        name: 'Character Scene',
        price: '$149',
        desc: 'Character with environment',
        featured: true,
        badge: 'Most Popular',
        features: [
          '1 Full Body Character Art',
          'Detailed Armor, Weapons & Gear',
          'Custom Background Scene',
          'Any Style You Want',
          'High Resolution + Source File',
          '5 Revisions',
          'Delivery: 3–4 Days',
        ],
      },
      {
        name: 'Full Party',
        price: '$449',
        desc: 'Full campaign party illustration',
        featured: false,
        features: [
          'Up to 6 Characters in One Scene',
          'Epic Scene with Full Background',
          'Detailed Gear on Each Character',
          'Dynamic Composition & Lighting',
          'All File Formats + Source File',
          'Unlimited Revisions',
          'Delivery: 5–7 Days',
        ],
      },
    ],
  },
  {
    id: 'furry',
    label: 'Furry',
    packages: [
      {
        name: 'Headshot',
        price: '$39',
        desc: 'Profile pictures & icons',
        featured: false,
        features: [
          '1 Custom Furry Headshot',
          'Expressive Pose & Emotion',
          'High Resolution PNG + JPG',
          '3 Revisions',
          'Delivery: 1–2 Days',
        ],
      },
      {
        name: 'Reference Sheet',
        price: '$149',
        desc: 'Full character reference for commissions',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Front + Back + Side View',
          'Color Palette Included',
          'Outfit/Accessory Details',
          'High Resolution PNG + Source File',
          '5 Revisions',
          'Delivery: 2–4 Days',
        ],
        variants: [
          {
            id: 'sfw',
            label: 'SFW',
            price: '$149',
            desc: 'Safe for work — full character reference',
            features: [
              'Front + Back + Side View',
              'Color Palette Included',
              'Outfit/Accessory Details',
              'High Resolution PNG + Source File',
              'SFW Content Only',
              '5 Revisions',
              'Delivery: 2–4 Days',
            ],
          },
          {
            id: 'nsfw',
            label: 'NSFW',
            price: '$199',
            desc: 'NSFW reference sheet — 100% confidential',
            features: [
              'Front + Back + Side View',
              'Color Palette Included',
              'Outfit/Accessory Details',
              'High Resolution PNG + Source File',
              'NSFW Content · 100% Confidential',
              '5 Revisions',
              'Delivery: 2–4 Days',
            ],
          },
        ],
      },
      {
        name: 'Full Scene',
        price: '$299',
        desc: 'Detailed artwork with background',
        featured: false,
        features: [
          '1–2 Characters in Custom Scene',
          'Full Detailed Background',
          'Advanced Lighting & Effects',
          'All File Formats + Source File',
          'Unlimited Revisions',
          'Delivery: 3–6 Days',
        ],
      },
    ],
  },
  {
    id: 'fursuit',
    label: 'Fursuit',
    packages: [
      {
        name: 'Custom Head',
        emoji: '🎭',
        price: '$800 — $1,500',
        desc: 'Expressive foam or resin fursuit head',
        featured: false,
        features: [
          'Foam-based or resin blank construction',
          'Moving jaw (optional)',
          'Follow-me or static eyes',
          'Custom ventilation & visibility',
          'Fits 22"–24" head size (adjustable)',
          'Turnaround: 4–6 weeks',
        ],
      },
      {
        name: 'Partial Suit',
        emoji: '🐾',
        price: '$1,500 — $3,000',
        desc: 'Head + paws + tail — most popular debut package',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Everything in Head, PLUS:',
          'Hand paws with fleece or silicone pads',
          'Outdoor feet paws with durable soles',
          'Tail with belt loop or bodysuit attachment',
          'Optional: Sleeves / Arm sleeves',
          'Turnaround: 8–12 weeks',
        ],
      },
      {
        name: 'Full Suit',
        emoji: '🐺',
        price: '$3,000 — $6,000+',
        desc: 'Complete plantigrade or digitigrade fursuit',
        featured: false,
        features: [
          'Everything in Partial, PLUS:',
          'Plantigrade or digitigrade bodysuit',
          'Hidden zipper entry',
          'Padded muscle suit (optional)',
          'Cooling vest pocket (optional)',
          'Full character accuracy guarantee',
          'Turnaround: 12–16 weeks',
        ],
      },
    ],
  },
  {
    id: 'nsfw',
    label: 'NSFW',
    packages: [
      {
        name: 'Single Character',
        price: '$99',
        desc: 'Single character NSFW artwork',
        featured: false,
        features: [
          '1 Full Body Character',
          'High Resolution PNG + JPG',
          '100% Confidential',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Full Scene',
        price: '$199',
        desc: 'Detailed NSFW scene',
        featured: true,
        badge: 'Most Popular',
        features: [
          '2 Characters in Full Scene',
          'Full Custom Background',
          'Lighting & Effects',
          'All File Formats + Source File',
          '100% Confidential',
          '5 Revisions',
          'Delivery: 3–4 Days',
        ],
      },
      {
        name: 'Illustrated Pages',
        price: '$399',
        desc: 'Multi-page NSFW artwork',
        featured: false,
        features: [
          '2 Characters + 4 Illustrated Pages',
          'Full Color + Shading',
          'All File Formats + Source File',
          '100% Confidential',
          'Unlimited Revisions',
          'Delivery: 4–6 Days/Page',
        ],
      },
    ],
  },
  {
    id: 'cover',
    label: 'Cover Art',
    packages: [
      {
        name: 'Album / Single Cover',
        price: '$99',
        desc: 'Music artists — Spotify ready',
        featured: false,
        features: [
          'Custom Album/Single Cover Design',
          'Typography + Effects',
          'Spotify / Apple Music / SoundCloud Ready Sizes',
          'High Resolution JPG + PNG',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Book Cover',
        price: '$249',
        desc: 'Authors, novels, Kindle',
        featured: true,
        badge: 'Most Popular',
        features: [
          'Front + Back + Spine Design',
          'Custom Illustration or Photo Manipulation',
          'Print-Ready (CMYK) + Kindle Ready',
          'All File Formats',
          '5 Revisions',
          'Delivery: 3–5 Days',
        ],
      },
      {
        name: 'Game Cover / Key Art',
        price: '$449',
        desc: 'Game developers & indie studios',
        featured: false,
        features: [
          'Custom Game Cover Art',
          'Character + Environment Design',
          'Steam / Epic / Console Store Sizes',
          'All File Formats + Source File',
          'Unlimited Revisions',
          'Delivery: 5–7 Days',
        ],
      },
    ],
  },
  {
    id: 'character',
    label: 'Character',
    packages: [
      {
        name: 'Bust / Headshot',
        price: '$49',
        desc: 'Profile pictures & avatars',
        featured: false,
        features: [
          '1 Custom Character (Bust/Headshot)',
          'Any Style (Anime, Cartoon, Realistic, Semi-Realistic)',
          'Detailed Face & Hair Design',
          'High Resolution PNG + JPG',
          '3 Revisions',
          'Delivery: 2–3 Days',
        ],
      },
      {
        name: 'Half Body',
        price: '$99',
        desc: 'Character showcase & storytelling',
        featured: false,
        features: [
          '1 Custom Character (Half Body)',
          'Any Style You Want',
          'Detailed Design + Simple Background',
          'High Resolution PNG + JPG',
          '5 Revisions',
          'Delivery: 3–4 Days',
        ],
      },
      {
        name: 'Full Body',
        price: '$149',
        desc: 'Complete character design',
        featured: true,
        badge: 'Most Popular',
        features: [
          '1 Custom Character (Full Body)',
          'Any Style You Want',
          'Detailed Outfit, Weapons, Accessories',
          'Custom Background',
          'High Resolution + Source File',
          'Unlimited Revisions',
          'Delivery: 3–5 Days',
        ],
      },
    ],
  },
]
