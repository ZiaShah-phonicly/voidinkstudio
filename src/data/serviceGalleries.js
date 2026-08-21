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
    fromFile('Comic', 'Furry Comic.webp'),
    fromFile('Comic', 'Short Comic 1.webp'),
    fromFile('Comic', 'Short Comic 2.webp'),
  ],
  '3d-models': [
    fromFile('3D', '3D Rigging.mp4'),
    fromFile('3D', '3D C.webp'),
    fromFile('3D', '3D Character B.webp'),
    fromFile('3D', '3D Character F.webp'),
    fromFile('3D', '3D Character S.webp'),
    fromFile('3D', '3D F.webp'),
    fromFile('3D', '3D F2.webp'),
    fromFile('3D', '3D GM.webp'),
  ],
  'mascot-design': [
    fromFile('Reviews', 'Tinnyplus3Gaming-Final.jpg'),
    // { image: '/portfolio/services/mascot/2.jpg', title: 'Playful Brand Buddy', meta: 'Illustration' },
    // { image: '/portfolio/services/mascot/3.jpg', title: 'Color Form Mascot', meta: 'Concept' },
    // { image: '/portfolio/services/mascot/4.jpg', title: 'Stream Mascot Look', meta: 'Brand Face' },
    // { image: '/portfolio/services/mascot/5.jpg', title: 'Stylized Character', meta: 'Vector Feel' },

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
    fromFile('Animation', 'Intro.mp4'),
    fromFile('Animation', 'Bugatti Intro.mp4'),
    fromFile('Animation', 'Train Animation.mp4'),
    // fromFile('Animation', 'Train Intro Animation.mp4'),
    fromFile('Animation', 'Game Decide.mp4'),
    fromFile('Animation', 'Game Decide Short.mp4'),
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
  // Physical suit photos only — never reuse Furry 2D art on this card.
  fursuits: [],
  'furry-art': [
    fromFile('Furry', 'Furry.webp'),
    fromFile('Furry', 'Furry 1.webp'),
    fromFile('Furry', 'Furry Details.webp'),
    fromFile('Furry', 'Furry F.webp'),
    fromFile('Furry', 'Furry Pfp.webp'),
    fromFile('Furry', 'Furry robo.webp'),
    fromFile('Furry', 'PFP-ghost-color.webp'),
    fromFile('Furry', 'Protogen.webp'),
    fromFile('Furry', 'Protogen 1.webp'),
    fromFile('Furry', 'Protogenn.webp'),
    fromFile('Furry', '2-furry-character-(olympia-&-friend)-color.jpg1.webp'),
  ],
  'nsfw-art': [
    fromFile('NSFW', 'Anime.webp'),
    fromFile('NSFW', 'Baddie.webp'),
    fromFile('NSFW', 'Beach.webp'),
    fromFile('NSFW', 'Beach 2.webp'),
    fromFile('NSFW', 'Beach Tatto girls.webp'),
    fromFile('NSFW', 'Ladies Party.webp'),
  ],
  'cover-art': [
    fromFile('Cover Art', 'Book Cover Art.webp'),
    fromFile('Cover Art', 'Book Cover.webp'),
    fromFile('Cover Art', 'Cover Art-Book cover.webp'),
    fromFile('Cover Art', 'Cover Art.webp'),
    fromFile('Cover Art', 'Music-Cover Art.webp'),
  ],
  'custom-character-design': [
    fromFile('Custom', 'Anime.webp'),
    fromFile('Custom', 'Assasin.webp'),
    fromFile('Custom', 'Chibi.webp'),
    fromFile('Custom', 'Couple Art.webp'),
    fromFile('Custom', 'Custom Character.webp'),
    fromFile('Custom', 'Fantasy Art.webp'),
    fromFile('Custom', 'Fusion Character Art.webp'),
    fromFile('Custom', 'Gay-Character.webp'),
    fromFile('Custom', 'Puppet-Character.webp'),
    fromFile('Custom', "Sage_s 2D.webp"),
    fromFile('Custom', 'super-hero-couple.webp'),
  ],
}

export function isVideoSrc(src = '') {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(String(src))
}

export function getServiceGallery(slug) {
  if (serviceGalleries[slug]?.length) return serviceGalleries[slug]
  return []
}
