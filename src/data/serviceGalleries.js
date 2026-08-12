/** Build a gallery entry from a public folder + filename (title = name without extension). */
function fromFile(folder, file) {
  // encodeURIComponent turns & → %26 and , → %2C; Vite static serve then 404s to SPA HTML.
  // Keep those literal so public/ paths with & and , resolve correctly.
  const encSeg = (s) => encodeURIComponent(s).replace(/%26/g, '&').replace(/%2C/gi, ',')
  const image = `/${[folder, file].map(encSeg).join('/')}`
  const title = file.replace(/\.[^.]+$/, '')
  return { image, title }
}

/** Portfolio galleries shown on each service detail page */
export const serviceGalleries = {
  'website-design-development': [
    fromFile('Website Design & Development', 'Automotive.webp'),
    fromFile('Website Design & Development', 'Beauty-Spa.webp'),
    fromFile('Website Design & Development', 'E-commerce.webp'),
    fromFile('Website Design & Development', 'Fashion-Store.webp'),
    fromFile('Website Design & Development', 'Fitness.webp'),
    fromFile('Website Design & Development', 'Medical.webp'),
    fromFile('Website Design & Development', 'Real-Estate.webp'),
    fromFile('Website Design & Development', 'Restaurant.webp'),
    fromFile('Website Design & Development', 'Saas-Landing.webp'),
  ],
  'ai-agents-chatbots': [
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-01-customer-support.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-02-whatsapp-automation.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-03-AI-Voice-Agent.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-04-Lead-Generation-Bot.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-05-E-commerce-AI.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-06-Restaurant-Bo.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-07-Real-Estate-AI.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-08-Healthcare-Bot.webp'),
    fromFile('Ai Chatbots, Voice Agents & Automations', 'Automations-ai-09-Workflow-Automation.webp'),
  ],
  'app-development': [
    fromFile('App Development', 'Ecommerce-App-Development.webp'),
    fromFile('App Development', 'EdTech-App-Development.webp'),
    fromFile('App Development', 'Fintech-App-Development.webp'),
    fromFile('App Development', 'Fitness-Wellness-App.webp'),
    fromFile('App Development', 'Food-Delivery-App.webp'),
    fromFile('App Development', 'On-Demand-Services-App.webp'),
    fromFile('App Development', 'Real-Estate-App.webp'),
    fromFile('App Development', 'SaaS-CRM-App.webp'),
    fromFile('App Development', 'Telemedicine-App-Development.webp'),
  ],
  'comic-book-art': [
    fromFile('Comic', 'Comic 1 page.webp'),
    fromFile('Comic', 'Comic Book Panels.webp'),
    fromFile('Comic', 'Comic Book.webp'),
    fromFile('Comic', 'Comic Dialogues.webp'),
    fromFile('Comic', 'Comic with Panel.webp'),
  ],
  '3d-models': [
    { image: '/portfolio/services/3d/1.jpg', title: 'Tech Product Model', meta: '3D Render' },
    { image: '/portfolio/services/3d/2.jpg', title: 'Abstract Form Study', meta: 'Modeling' },
    { image: '/portfolio/services/3d/3.jpg', title: 'Softbody Sculpture', meta: 'CGI' },
    { image: '/portfolio/services/3d/5.jpg', title: 'Hardware Visualization', meta: 'Product Viz' },
  ],
  'mascot-design': [
    { image: '/portfolio/services/mascot/1.jpg', title: 'Brand Mascot Set', meta: 'Character IP' },
    { image: '/portfolio/services/mascot/2.jpg', title: 'Playful Brand Buddy', meta: 'Illustration' },
    { image: '/portfolio/services/mascot/3.jpg', title: 'Color Form Mascot', meta: 'Concept' },
    { image: '/portfolio/services/mascot/4.jpg', title: 'Stream Mascot Look', meta: 'Brand Face' },
    { image: '/portfolio/services/mascot/5.jpg', title: 'Stylized Character', meta: 'Vector Feel' },
  ],
  '2d-vtuber-models': [
    fromFile('2D Model', '2D Model Female.mp4'),
    fromFile('2D Model', '2D Model Male.mp4'),
    fromFile('2D Model', '2D Model-Vtuber.mp4'),
    fromFile('2D Model', 'Female Vtuber.mp4'),
    fromFile('2D Model', 'Male Vtuber.mp4'),
    fromFile('2D Model', 'Sage_s Vtuber.mp4'),
    fromFile('2D Model', 'Vtuber Female.mp4'),
    fromFile('2D Model', 'Vtuber.mp4'),
  ],
  'branding-logo': [
    { image: '/portfolio/brandforge.jpg', title: 'BrandForge Identity' },
  ],
  animation: [
    fromFile('Animation', 'Bugatti Intro.mp4'),
    fromFile('Animation', 'Intro.mp4'),
    fromFile('Animation', 'Train Animation.mp4'),
    fromFile('Animation', 'Train Intro Animation.mp4'),
  ],
  'dnd-character-art': [
    fromFile('Dnd', 'Barbarian.webp'),
    fromFile('Dnd', 'Bard.webp'),
    fromFile('Dnd', 'Cleric.webp'),
    fromFile('Dnd', 'Druid.webp'),
    fromFile('Dnd', 'Fighter.webp'),
    fromFile('Dnd', 'Monk.webp'),
    fromFile('Dnd', 'Paladin.webp'),
    fromFile('Dnd', 'Ranger.webp'),
    fromFile('Dnd', 'Rogue.webp'),
    fromFile('Dnd', 'Vampire.webp'),
  ],
  'furry-art': [
    { image: '/portfolio/services/furry/1.jpg', title: 'Species Reference Feel', meta: 'Furry Style' },
    { image: '/portfolio/services/furry/3.jpg', title: 'Soft Character Study', meta: 'Portrait' },
    { image: '/portfolio/services/furry/4.jpg', title: 'Friendly Companion', meta: 'Character' },
    { image: '/portfolio/services/furry/5.jpg', title: 'Expression Focus', meta: 'Reference Sheet vibe' },
  ],
  'nsfw-art': [
    { image: '/portfolio/services/nsfw/1.jpg', title: 'Private Gallery Style', meta: 'Confidential' },
    { image: '/portfolio/services/nsfw/2.jpg', title: 'Abstract Form Study', meta: 'Artistic' },
    { image: '/portfolio/services/nsfw/3.jpg', title: 'Neon Mood Piece', meta: 'Moodboard' },
    { image: '/portfolio/services/nsfw/4.jpg', title: 'Soft Render Look', meta: 'Premium Art' },
    { image: '/portfolio/services/nsfw/5.jpg', title: 'Gradient Atmosphere', meta: 'NDA Projects' },
  ],
  'cover-art': [
    fromFile('Cover Art', 'Book Cover Art.webp'),
    fromFile('Cover Art', 'Book Cover.webp'),
    fromFile('Cover Art', 'Cover Art-Book cover.webp'),
    fromFile('Cover Art', 'Cover Art.webp'),
    fromFile('Cover Art', 'Music-Cover Art.webp'),
  ],
  'custom-character-design': [
    { image: '/portfolio/services/character/1.jpg', title: 'Hero Character Sheet', meta: 'OC Design' },
    { image: '/portfolio/services/character/2.jpg', title: 'Concept Color Forms', meta: 'Concept Art' },
    { image: '/portfolio/services/character/3.jpg', title: 'Avatar Character', meta: 'Full Body vibe' },
    { image: '/portfolio/services/character/4.jpg', title: 'Stylized Persona', meta: 'Character IP' },
    { image: '/portfolio/services/character/5.jpg', title: 'Costume & Pose Study', meta: 'Design Pass' },
  ],
}

export function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(String(src))
}

export function getServiceGallery(slug) {
  if (serviceGalleries[slug]?.length) return serviceGalleries[slug]
  if (slug === 'fursuits') return serviceGalleries['furry-art'] || []
  return []
}
