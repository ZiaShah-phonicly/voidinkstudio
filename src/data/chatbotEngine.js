import { serviceDetails } from './serviceDetails'
import { pricingCategories } from './voidinkData'

const SERVICE_KEYWORDS = [
  { slug: 'website-design-development', words: ['website', 'web site', 'landing page', 'landing', 'ecommerce', 'e-commerce', 'online store', 'web design', 'shopify'] },
  { slug: 'ai-agents-chatbots', words: ['ai agent', 'chatbot', 'chat bot', 'voice agent', 'voice ai', 'automation', 'n8n', 'auto reply', 'virtual assistant'] },
  { slug: 'app-development', words: ['mobile app', 'ios app', 'android app', 'app development', 'application', 'mvp'] },
  { slug: 'comic-book-art', words: ['comic', 'comic book', 'manga', 'graphic novel', 'webtoon', 'comic page'] },
  { slug: '3d-models', words: ['3d model', '3d character', 'rigging', 'texturing', 'blender', '3d'] },
  { slug: 'mascot-design', words: ['mascot', 'brand character', 'brand mascot'] },
  { slug: '2d-vtuber-models', words: ['vtuber', 'v-tuber', 'live2d', 'vtube studio', 'streaming model', 'avatar model'] },
  { slug: 'branding-logo', words: ['branding', 'brand identity', 'logo design', 'logo', 'rebrand'] },
  { slug: 'animation', words: ['animation', 'animate', 'motion graphics', 'explainer video', 'logo anim', 'logo reveal'] },
  { slug: 'dnd-character-art', words: ['dnd', 'd&d', 'dungeons', 'dragon', 'rpg', 'tabletop', 'dnd character', 'campaign art'] },
  { slug: 'furry-art', words: ['furry', 'fursona', 'reference sheet', 'fursuit art'] },
  { slug: 'nsfw-art', words: ['nsfw', 'mature art', 'adult art', 'nsfw art'] },
  { slug: 'cover-art', words: ['cover art', 'album cover', 'book cover', 'game cover', 'spotify cover'] },
  { slug: 'custom-character-design', words: ['custom character', 'character design', 'oc design', 'original character', 'anime character', 'cartoon character'] },
]

const CHARACTER_WORDS = ['character', 'custom character', 'oc', 'original character', 'hero', 'villain', 'avatar']

const SCOPE_HINTS = {
  'dnd-character-art': [
    { keys: ['scene', 'background', 'environment'], scope: 'scene' },
    { keys: ['party', 'group', 'team', 'multiple', '6 character', 'squad'], scope: 'party' },
    { keys: ['full body', 'character art', 'armor', 'bust'], scope: 'character' },
  ],
  'furry-art': [
    { keys: ['headshot', 'icon', 'pfp', 'profile'], scope: 'headshot' },
    { keys: ['nsfw ref', 'nsfw reference', 'reference nsfw', 'ref sheet nsfw'], scope: 'reference-nsfw' },
    { keys: ['sfw', 'reference', 'ref sheet', 'turnaround'], scope: 'reference-sfw' },
    { keys: ['scene', 'background', 'full scene'], scope: 'scene' },
  ],
  'comic-book-art': [
    { keys: ['4 page', 'short', 'starter', 'pilot'], scope: 'starter' },
    { keys: ['12 page', 'standard', 'webtoon'], scope: 'standard' },
    { keys: ['24 page', 'full issue', 'complete issue'], scope: 'full' },
  ],
  'website-design-development': [
    { keys: ['landing', 'one page', 'single page', 'starter'], scope: 'landing' },
    { keys: ['business', 'multi page', '7 page', 'cms', 'professional'], scope: 'business' },
    { keys: ['ecommerce', 'e-commerce', 'store', 'shop', 'products'], scope: 'ecommerce' },
  ],
  'app-development': [
    { keys: ['simple', 'mvp', 'basic', '5 screen', 'starter'], scope: 'starter' },
    { keys: ['ios and android', 'both platform', 'payment', '12 screen', 'professional'], scope: 'pro' },
    { keys: ['enterprise', 'complex', '25 screen', 'ai feature'], scope: 'enterprise' },
  ],
  'ai-agents-chatbots': [
    { keys: ['starter', 'basic chatbot', 'website chatbot'], scope: 'starter' },
    { keys: ['n8n', 'automation', 'professional', 'workflow'], scope: 'pro' },
    { keys: ['voice', 'call', 'enterprise'], scope: 'enterprise' },
  ],
  'mascot-design': [
    { keys: ['basic', 'simple', '1 pose'], scope: 'basic' },
    { keys: ['professional', 'expressions', 'pro'], scope: 'pro' },
    { keys: ['ultimate', 'animation', 'animate'], scope: 'ultimate' },
  ],
  'branding-logo': [
    { keys: ['logo only', 'just a logo', 'logo'], scope: 'logo' },
    { keys: ['brand starter', 'identity', 'starter'], scope: 'starter' },
    { keys: ['full brand', 'complete', 'guidelines'], scope: 'full' },
  ],
  'animation': [
    { keys: ['logo anim', 'logo reveal', 'intro'], scope: 'logo' },
    { keys: ['explainer', '60 second', 'marketing'], scope: 'explainer' },
    { keys: ['character animation', '4k'], scope: 'character' },
  ],
  '3d-models': [
    { keys: ['basic', 'prop', 'simple'], scope: 'basic' },
    { keys: ['professional', 'rigging', 'character'], scope: 'pro' },
    { keys: ['premium', 'turntable', 'pbr'], scope: 'premium' },
  ],
  'cover-art': [
    { keys: ['album', 'single', 'spotify', 'music'], scope: 'album' },
    { keys: ['book', 'kindle', 'novel'], scope: 'book' },
    { keys: ['game', 'steam', 'key art'], scope: 'game' },
  ],
  'nsfw-art': [
    { keys: ['single', 'one character'], scope: 'single' },
    { keys: ['scene', 'two character', '2 character'], scope: 'scene' },
    { keys: ['pages', 'comic', '4 page'], scope: 'pages' },
  ],
  'custom-character-design': [
    { keys: ['bust', 'headshot', 'pfp', 'avatar'], scope: 'bust' },
    { keys: ['half body', 'half-body'], scope: 'half' },
    { keys: ['full body', 'full-body'], scope: 'full' },
  ],
  '2d-vtuber-models': [
    { keys: ['half body', 'half', 'no rig', 'without rigging', 'design only'], scope: 'half-no' },
    { keys: ['half body with', 'rigged half', 'live2d half'], scope: 'half-rig' },
    { keys: ['full body without', 'full no rig'], scope: 'full-no' },
    { keys: ['full body with', 'full rigged', 'live2d full'], scope: 'full-rig' },
  ],
}

export const initialChatSession = {
  stage: 'welcome',
  serviceSlug: null,
  scope: null,
  budget: null,
  budgetMax: null,
  timeline: null,
  projectNotes: [],
}

function parsePrice(priceStr) {
  return Number(String(priceStr).replace(/[^0-9.]/g, '')) || 0
}

function getService(slug) {
  return serviceDetails.find((s) => s.slug === slug)
}

function getPricingForService(slug) {
  const service = getService(slug)
  if (!service) return null
  return pricingCategories.find((c) => c.id === service.pricingCategoryId)
}

function detectServices(message) {
  const text = message.toLowerCase()
  const scores = new Map()

  for (const entry of SERVICE_KEYWORDS) {
    let score = 0
    for (const word of entry.words) {
      if (text.includes(word)) score += word.length > 4 ? 3 : 2
    }
    if (score > 0) scores.set(entry.slug, (scores.get(entry.slug) || 0) + score)
  }

  if (CHARACTER_WORDS.some((w) => text.includes(w))) {
    ;['custom-character-design', 'dnd-character-art', 'furry-art', 'mascot-design', '2d-vtuber-models', '3d-models', 'comic-book-art'].forEach((slug) => {
      scores.set(slug, (scores.get(slug) || 0) + 1)
    })
  }

  if (text.includes('app') && !text.includes('happy')) {
    scores.set('app-development', (scores.get('app-development') || 0) + 3)
  }

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug, score]) => ({ slug, score }))
}

function detectScope(slug, message) {
  const text = message.toLowerCase()
  const hints = SCOPE_HINTS[slug] || []
  for (const hint of hints) {
    if (hint.keys.some((k) => text.includes(k))) return hint.scope
  }
  return null
}

function detectBudget(message) {
  const text = message.toLowerCase().replace(/,/g, '')

  const rangeMatch = text.match(/\$?\s*(\d+)\s*[-–to]+\s*\$?\s*(\d+)/)
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]), label: `$${rangeMatch[1]}–$${rangeMatch[2]}` }
  }

  const underMatch = text.match(/(?:under|below|max|budget)\s*\$?\s*(\d+)/)
  if (underMatch) {
    const max = Number(underMatch[1])
    return { min: 0, max, label: `under $${max}` }
  }

  const plainMatch = text.match(/\$?\s*(\d{2,5})\s*(?:usd|dollar|budget)?/)
  if (plainMatch && (text.includes('budget') || text.includes('$') || text.includes('afford') || text.includes('have'))) {
    const max = Number(plainMatch[1])
    return { min: 0, max, label: `around $${max}` }
  }

  if (text.includes('cheap') || text.includes('low budget') || text.includes('starter')) {
    return { min: 0, max: 500, label: 'budget-friendly' }
  }
  if (text.includes('premium') || text.includes('best quality') || text.includes('high end')) {
    return { min: 1000, max: Infinity, label: 'premium' }
  }

  return null
}

function detectTimeline(message) {
  const text = message.toLowerCase()
  if (text.includes('asap') || text.includes('urgent') || text.includes('rush') || text.includes('1 week')) return 'rush'
  if (text.includes('2 week') || text.includes('two week')) return '2-weeks'
  if (text.includes('month') || text.includes('30 day')) return '1-month'
  if (text.includes('flexible') || text.includes('no rush')) return 'flexible'
  return null
}

function pickPackageByScope(pricing, scope) {
  if (!pricing?.packages?.length) return null

  // Furry reference sheet: select SFW/NSFW variant as synthetic package
  if (scope === 'reference-sfw' || scope === 'reference-nsfw') {
    const refPkg = pricing.packages.find((p) => p.name === 'Reference Sheet')
    if (refPkg?.variants) {
      const variant = refPkg.variants.find((v) => v.id === (scope === 'reference-nsfw' ? 'nsfw' : 'sfw'))
      if (variant) {
        return {
          ...refPkg,
          name: `Reference Sheet (${variant.label})`,
          price: variant.price,
          desc: variant.desc,
          features: variant.features,
        }
      }
    }
    return refPkg || null
  }

  const scopeMap = {
    landing: 0,
    starter: 0,
    basic: 0,
    logo: 0,
    headshot: 0,
    character: 0,
    bust: 0,
    album: 0,
    single: 0,
    'half-no': 0,
    business: 1,
    pro: 1,
    professional: 1,
    standard: 1,
    scene: 1,
    reference: 1,
    'reference-sfw': 1,
    'reference-nsfw': 1,
    half: 1,
    starter_brand: 1,
    explainer: 1,
    book: 1,
    'half-rig': 1,
    ecommerce: 2,
    enterprise: 2,
    premium: 2,
    ultimate: 2,
    full: 2,
    party: 2,
    pages: 2,
    character_anim: 2,
    game: 2,
    'full-no': 2,
    'full-rig': 3,
  }

  const index = scopeMap[scope]
  if (index !== undefined && pricing.packages[index]) return pricing.packages[index]
  return pricing.packages.find((p) => p.featured) || pricing.packages[1] || pricing.packages[0]
}

function pickPackageByBudget(pricing, budgetMax) {
  if (!pricing?.packages?.length) return null

  const sorted = [...pricing.packages].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))

  if (!budgetMax || budgetMax === Infinity) {
    return pricing.packages.find((p) => p.featured) || sorted[Math.min(1, sorted.length - 1)]
  }

  const affordable = sorted.filter((p) => parsePrice(p.price) <= budgetMax)
  if (affordable.length) return affordable[affordable.length - 1]

  return sorted[0]
}

function recommendPackage(session) {
  const pricing = getPricingForService(session.serviceSlug)
  if (!pricing) return null

  if (session.scope) {
    const scoped = pickPackageByScope(pricing, session.scope)
    if (scoped) return scoped
  }

  return pickPackageByBudget(pricing, session.budgetMax)
}

function buildChatBrief(session) {
  const notes = Array.isArray(session?.projectNotes) ? session.projectNotes.filter(Boolean) : []
  if (!notes.length) return ''
  // Keep recent user lines that look like project detail (skip short button taps)
  const useful = notes.filter((n) => {
    const t = String(n).trim()
    if (t.length < 12) return false
    if (/^(start order|get quote|order now|other services|start new project|compare packages|different service|view pricing)$/i.test(t)) {
      return false
    }
    return true
  })
  return (useful.length ? useful : notes).slice(-4).join('\n')
}

/** Order Now payload — same shape as PricingCard / ServicePage prefill */
export function buildOrderFromChatSession(session) {
  const brief = buildChatBrief(session)
  if (!session?.serviceSlug) {
    return {
      packageName: 'Custom / Need a quote',
      brief: brief || undefined,
    }
  }

  const service = getService(session.serviceSlug)
  const pricing = getPricingForService(session.serviceSlug)
  if (!service) {
    return { packageName: 'Custom / Need a quote', brief: brief || undefined }
  }

  const pkg = recommendPackage(session)
  return {
    service: service.formService,
    categoryId: pricing?.id || service.pricingCategoryId,
    categoryLabel: pricing?.label || service.title,
    packageName: pkg?.name || 'Custom / Need a quote',
    price: pkg?.price || '',
    desc: pkg?.desc || '',
    features: pkg?.features || [],
    brief: brief || undefined,
  }
}

function formatPackageRecommendation(service, pkg, session) {
  const lines = [
    `${service.icon} **Perfect match for you:**`,
    '',
    `**${pkg.name}** — **${pkg.price}**`,
    `_${pkg.desc}_`,
    '',
    '**Includes:**',
    ...pkg.features.slice(0, 5).map((f) => `• ${f}`),
    '',
    `⏱ Typical turnaround: **${service.turnaround}**`,
  ]

  if (session.budgetMax && parsePrice(pkg.price) > session.budgetMax) {
    lines.push('', `💡 Slightly above your budget — this is our best entry option. We can also customize a plan.`)
  }

  lines.push('', '🚀 **Next step:** Share your references & we\'ll confirm Asap!.')
  lines.push('📧 voidinkstudios1@gmail.com')

  return lines.join('\n')
}

function getScopeQuestion(slug) {
  const questions = {
    'dnd-character-art': 'What do you need?\n• **Character Art** — full body ($99)\n• **Character Scene** — with background ($149)\n• **Full Party** — up to 6 chars ($449)',
    'furry-art': 'Which type fits?\n• **Headshot** ($39)\n• **Reference Sheet SFW** ($149)\n• **Reference Sheet NSFW** ($199)\n• **Full Scene** ($299)',
    'comic-book-art': 'How many pages?\n• **Starter** — 4 pages ($399)\n• **Standard** — 12 pages ($999)\n• **Full Issue** — 24 pages ($2,499)',
    'website-design-development': 'What kind of site?\n• **Starter** — 1 page ($399)\n• **Professional** — up to 7 pages ($999)\n• **E-Commerce** — store ($2,499)',
    'app-development': 'What level of app?\n• **Starter** — 5 screens ($599)\n• **Professional** — iOS + Android ($2,499)\n• **Enterprise** — up to 25 screens ($4,499)',
    'ai-agents-chatbots': 'Which AI package?\n• **Starter** — website chatbot ($299)\n• **Professional** — n8n automations ($799)\n• **Enterprise** — Voice AI ($1,499)',
    'mascot-design': 'Mascot level?\n• **Basic** ($99)\n• **Professional** ($169)\n• **Ultimate** — with animation ($249)',
    'branding-logo': 'How complete?\n• **Logo Only** ($59)\n• **Brand Starter** ($199)\n• **Full Brand Identity** ($499)',
    'animation': 'Which animation?\n• **Logo Animation** ($99)\n• **Explainer Video** ($499)\n• **Character Animation** ($899)',
    '3d-models': '3D package?\n• **Basic** ($249)\n• **Professional** — with rigging ($349)\n• **Premium** ($599)',
    'cover-art': 'Cover type?\n• **Album / Single** ($99)\n• **Book Cover** ($249)\n• **Game Cover / Key Art** ($449)',
    'nsfw-art': 'NSFW format?\n• **Single Character** ($99)\n• **Full Scene** ($199)\n• **Illustrated Pages** ($399)',
    'custom-character-design': 'Character format?\n• **Bust / Headshot** ($49)\n• **Half Body** ($99)\n• **Full Body** ($149)',
    '2d-vtuber-models': 'VTuber package?\n• **Half Body No Rig** ($149)\n• **Half Body Rigged** ($299) ⭐\n• **Full Body No Rig** ($249)\n• **Full Body Rigged** ($499)',
  }
  return questions[slug] || null
}

function listAllServices() {
  return serviceDetails
    .map((s) => `${s.icon} **${s.title}** — from ${s.startingPrice}`)
    .join('\n')
}

function characterClarificationReply() {
  return [
    'Great — a **custom character** project! 🎨',
    '',
    'Which type fits best?',
    '• **Custom Character Design** — from $49',
    '• **DnD / RPG** character — from $99',
    '• **Furry OC** — from $39',
    '• **2D VTuber Model** — from $149',
    '• **Brand Mascot** — from $99',
    '• **Comic character** — from $399',
    '• **3D character model** — from $249',
    '',
    'Tell me which one (or describe your idea) and your **budget**.',
  ].join('\n')
}

function buildQuickReplies(session) {
  if (session.stage === 'pick-character-type') {
    return ['Custom Character', 'DnD Character', 'Furry OC', 'VTuber', 'Mascot']
  }
  if (!session.serviceSlug) {
    return ['Website', 'Logo', 'Comic', 'DnD Art', 'AI Chatbot', 'VTuber', 'App Dev']
  }
  if (!session.scope && getScopeQuestion(session.serviceSlug)) {
    if (session.serviceSlug === 'furry-art') {
      return ['Headshot $39', 'Ref Sheet SFW $149', 'Ref Sheet NSFW $199', 'Full Scene $299']
    }
    return ['Basic / Starter', 'Professional', 'Premium / Full']
  }
  if (!session.budgetMax) {
    return ['Under $100', 'Budget $500', 'Budget $1000', 'Flexible budget']
  }
  return ['Get Quote', 'Other services', 'Talk to human']
}

function buildStartOrderReply(session) {
  const service = session.serviceSlug ? getService(session.serviceSlug) : null
  const order = buildOrderFromChatSession(session)
  return {
    session,
    text: service
      ? `🚀 **Let's start your ${service.title} project!**\n\nTap **Order Now** — we'll open the contact form with your chat details filled in.\n\nYou just add **name**, **email**, and any extra brief. We'll reply **asap**!`
      : '🚀 Tap **Order Now** to open the contact form (we\'ll prefill what we can from chat). Add your **name** & **email** — we reply **asap**!',
    quickReplies: ['Other services', 'Start new project'],
    orderCta: { label: 'Order Now', order },
  }
}

export function processChatMessage(userMessage, session) {
  const text = userMessage.trim()
  const lower = text.toLowerCase()
  const next = { ...session, projectNotes: [...session.projectNotes, text] }

  if (lower.match(/^(hi|hello|hey|salam|assalam)/)) {
    return {
      session: { ...initialChatSession, stage: 'discovery' },
      text: 'Hey! 👋 I\'m **VOIDINK Assistant**.\n\nTell me what you want to create — e.g. logo ($59), website ($399), comic, DnD art, VTuber, AI chatbot — and I\'ll recommend the **best package**.\n\nWhat project do you have in mind?',
      quickReplies: buildQuickReplies(initialChatSession),
    }
  }

  if (
    lower.includes('start my order') ||
    lower.includes('start order') ||
    lower === 'get quote' ||
    lower.includes('i want to order')
  ) {
    return buildStartOrderReply(next)
  }

  if (lower.includes('thank')) {
    return {
      session: next,
      text: 'You\'re welcome! 😊 Ready when you are — just describe your next project anytime.',
      quickReplies: ['Start new project', 'View pricing'],
    }
  }

  if (lower.includes('human') || lower.includes('real person') || lower.includes('talk to someone')) {
    return {
      session: next,
      text: 'Sure! 📧 Email us at **voidinkstudios1@gmail.com** or fill the contact form on our site.\n\nAvg response: **30 minutes**. Want me to note your project details first?',
      quickReplies: ['Yes, note my project', 'Other services'],
    }
  }

  if (
    lower.includes('all service') ||
    lower.includes('what do you offer') ||
    lower.includes('services list') ||
    lower.includes('starting price') ||
    lower.includes('show all service') ||
    lower.includes('view pricing')
  ) {
    return {
      session: { ...initialChatSession, stage: 'discovery' },
      text: `✨ **Our 14 services (current pricing):**\n\n${listAllServices()}\n\nWhich one interests you?`,
      quickReplies: buildQuickReplies(initialChatSession),
    }
  }

  if (session.stage === 'pick-character-type' || (!session.serviceSlug && CHARACTER_WORDS.some((w) => lower.includes(w)))) {
    const charTypeMap = [
      { keys: ['custom character', 'character design', 'oc'], slug: 'custom-character-design' },
      { keys: ['dnd', 'd&d', 'rpg', 'tabletop'], slug: 'dnd-character-art' },
      { keys: ['furry', 'fursona'], slug: 'furry-art' },
      { keys: ['vtuber', 'live2d', 'v-tuber'], slug: '2d-vtuber-models' },
      { keys: ['mascot'], slug: 'mascot-design' },
      { keys: ['comic'], slug: 'comic-book-art' },
      { keys: ['3d'], slug: '3d-models' },
    ]

    for (const entry of charTypeMap) {
      if (entry.keys.some((k) => lower.includes(k))) {
        next.serviceSlug = entry.slug
        next.stage = 'gathering'
        break
      }
    }

    if (!next.serviceSlug) {
      if (session.stage !== 'pick-character-type') {
        return {
          session: { ...next, stage: 'pick-character-type' },
          text: characterClarificationReply(),
          quickReplies: buildQuickReplies({ stage: 'pick-character-type' }),
        }
      }
    }
  }

  if (!next.serviceSlug) {
    const detected = detectServices(text)
    if (detected.length > 0 && detected[0].score >= 2) {
      next.serviceSlug = detected[0].slug
      next.stage = 'gathering'
    } else if (detected.length > 1 && detected[0].score === detected[1].score) {
      const options = detected.slice(0, 3).map((d) => getService(d.slug)?.title).filter(Boolean)
      return {
        session: { ...next, stage: 'discovery' },
        text: `I can help with a few things! Which matches your project?\n\n${options.map((o) => `• **${o}**`).join('\n')}\n\nReply with the one you need + a bit about your project.`,
        quickReplies: options.slice(0, 4),
      }
    }
  }

  if (!next.serviceSlug) {
    return {
      session: { ...next, stage: 'discovery' },
      text: `I'd love to help! 🤔 Could you tell me more?\n\nFor example:\n• "I need a **logo** for my startup"\n• "I want **DnD full body** character art"\n• "I need a **VTuber** Live2D model"\n• "I need an **AI chatbot** for my store"\n\nOr pick a service below 👇`,
      quickReplies: buildQuickReplies(next),
    }
  }

  const service = getService(next.serviceSlug)
  const pricing = getPricingForService(next.serviceSlug)

  if (!next.scope) {
    const scope = detectScope(next.serviceSlug, text)
    if (scope) next.scope = scope

    if (!next.scope && lower.match(/basic|starter|simple|portrait|headshot|landing|bust|logo only/)) {
      next.scope = detectScope(next.serviceSlug, 'basic portrait headshot landing starter bust logo') || 'starter'
    }
    if (!next.scope && lower.match(/pro|professional|standard|full body|business|scene|half body|rigged/)) {
      next.scope = detectScope(next.serviceSlug, 'pro full body business standard scene half body') || 'pro'
    }
    if (!next.scope && lower.match(/premium|ultimate|enterprise|party|full issue|ecommerce|full brand/)) {
      next.scope = detectScope(next.serviceSlug, 'premium party full enterprise ecommerce full brand') || 'premium'
    }
  }

  if (!next.budgetMax) {
    const budget = detectBudget(text)
    if (budget) {
      next.budget = budget.label
      next.budgetMax = budget.max
    }
    if (lower.includes('under $100') || lower === 'under $100') next.budgetMax = 100
    if (lower.includes('budget $500') || lower.includes('$500')) next.budgetMax = 500
    if (lower.includes('budget $1000') || lower.includes('$1000') || lower.includes('$1,000')) next.budgetMax = 1000
    if (lower.includes('flexible budget') || lower.includes('flexible')) next.budgetMax = Infinity
  }

  if (!next.timeline) {
    const timeline = detectTimeline(text)
    if (timeline) next.timeline = timeline
  }

  const scopeQuestion = getScopeQuestion(next.serviceSlug)

  if (!next.scope && scopeQuestion) {
    return {
      session: { ...next, stage: 'gathering' },
      text: `Awesome! **${service.title}** is a great choice. ${service.icon}\n\n${scopeQuestion}\n\nReply with the option that fits (e.g. "professional" or "full body").`,
      quickReplies: buildQuickReplies(next),
    }
  }

  if (!next.budgetMax) {
    const pkgHint = pricing?.packages?.[0]
    return {
      session: { ...next, stage: 'gathering' },
      text: `Got it — **${service.title}** ${next.scope ? `(${next.scope})` : ''} ✅\n\nWhat's your **budget range**?\n\nPackages start at **${service.startingPrice}**${pkgHint ? ` (${pkgHint.name}: ${pkgHint.price})` : ''}.\n\nYou can say e.g. "under $200" or "around $500".`,
      quickReplies: buildQuickReplies(next),
    }
  }

  const recommended = recommendPackage(next)
  if (recommended) {
    next.stage = 'recommendation'
    let reply = formatPackageRecommendation(service, recommended, next)

    if (next.timeline === 'rush') {
      reply += '\n\n⚡ **Rush noted** — mention ASAP in your quote request for priority scheduling.'
    }

    return { session: next, text: reply, quickReplies: ['Start order', 'Compare packages', 'Different service'] }
  }

  return {
    session: next,
    text: `${service.icon} **${service.title}**\n\n${service.shortText}\n\nStarting at **${service.startingPrice}**.\n\nTell me your scope and budget for a tailored recommendation.`,
    quickReplies: buildQuickReplies(next),
  }
}

export function processChatQuickReply(label, session) {
  const map = {
    Logo: 'I need logo design for my brand, budget around $60',
    Website: 'I need a business website with up to 7 pages, budget $1000',
    Comic: 'I want comic book art, around 12 pages, budget $999',
    Pricing: 'Show me all services and starting prices',
    'AI Chatbot': 'I need an AI chatbot for my website, budget $300',
    'AI Agent': 'I need an AI chatbot for my website, budget $300',
    'App Dev': 'I need a mobile app for iOS and Android, budget $2500',
    'DnD Art': 'I want a DnD character scene with armor, budget $150',
    'DnD Character': 'DnD full body character art with custom armor',
    'Custom Character': 'I want custom character design full body, budget $150',
    'Furry OC': 'Furry reference sheet for my OC',
    VTuber: 'I need a half body VTuber model with Live2D Rigging',
    Mascot: 'Brand mascot with expressions, budget $170',
    'Comic Art': 'Comic book art 4 pages with custom characters',
    '3D Model': '3D game character model with rigging, budget $350',
    'Headshot $39': 'I want a furry headshot, budget $39',
    'Ref Sheet SFW $149': 'I want a furry reference sheet SFW, budget $149',
    'Ref Sheet NSFW $199': 'I want a furry reference sheet NSFW, budget $199',
    'Full Scene $299': 'I want a furry full scene, budget $299',
    'Under $100': 'My budget is under $100',
    'Budget $500': 'My budget is around $500',
    'Budget $1000': 'My budget is around $1000',
    'Flexible budget': 'I have a flexible budget, recommend the best package',
    'Basic / Starter': 'Basic starter package please',
    Professional: 'Professional package please',
    'Premium / Full': 'Premium full package please',
    'Get Quote': 'I want to start my order',
    'Start order': 'I want to start my order',
    'Start new project': 'Hi, I have a new project',
    'View pricing': 'Show all services and pricing',
    'Other services': 'What other services do you offer?',
    'Compare packages': 'Show me all packages for this service',
    'Different service': 'I want a different service',
    'Yes, note my project': 'Let me describe my project details',
  }

  if (label === 'Compare packages' && session.serviceSlug) {
    const service = getService(session.serviceSlug)
    const pricing = getPricingForService(session.serviceSlug)
    if (pricing) {
      const lines = [`📦 **All ${service.title} packages:**\n`]
      for (const pkg of pricing.packages) {
        lines.push(`**${pkg.name}** — ${pkg.price} _(${pkg.desc})_`)
        lines.push(pkg.features.slice(0, 4).map((f) => `  ✓ ${f}`).join('\n'))
        lines.push('')
      }
      return {
        session,
        text: lines.join('\n'),
        quickReplies: ['Start order', 'Different service'],
      }
    }
  }

  if (label === 'Start order' || label === 'Get Quote') {
    return buildStartOrderReply(session)
  }

  if (label === 'Different service') {
    return {
      session: initialChatSession,
      text: 'No problem! What would you like to create instead?',
      quickReplies: buildQuickReplies(initialChatSession),
    }
  }

  const prompt = map[label] || label
  return processChatMessage(prompt, session.stage === 'welcome' ? { ...initialChatSession, stage: 'discovery' } : session)
}

export const chatQuickReplies = ['Website', 'Logo', 'Comic', 'DnD Art', 'AI Chatbot', 'VTuber', 'App Dev']
