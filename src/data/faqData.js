export const faqCategories = [
  {
    category: 'General',
    items: [
      {
        q: 'What is VOIDINK Studios?',
        a: [
          'VOIDINK Studios is a world-class creative and technology agency specializing in custom artwork, website design, app development, AI solutions, branding, and more. We work with clients globally — from indie creators and streamers to startups and established brands.',
        ],
      },
      {
        q: 'Where are you based? Do you work with international clients?',
        a: [
          'We are a remote-first agency with team members across multiple timezones. We proudly serve clients in over 25 countries. We adapt our communication schedule to match your timezone, ensuring smooth collaboration regardless of location.',
        ],
      },
      {
        q: 'How do I get started with a project?',
        a: [
          'Fill out the contact form on our homepage or email us at support@voidinkstudios.com with your project details. We will respond within 2 hours with a free consultation, timeline estimate, and pricing. Once you approve the proposal and submit the 50% deposit, we begin work immediately.',
        ],
      },
      {
        q: 'Do you offer free consultations?',
        a: [
          'Yes. Every project starts with a free, no-obligation consultation. We discuss your vision, budget, timeline, and answer any questions you have. There is no pressure to commit — we are here to help you make the best decision for your needs.',
        ],
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    items: [
      {
        q: 'How much does a typical project cost?',
        a: [
          'Pricing depends on the scope, complexity, and turnaround time of your project. Here are our current package prices (same as the Pricing section on the homepage):',
        ],
        groups: [
          {
            title: 'Website Design & Development',
            list: [
              'Starter: $399 — Single-page responsive website',
              'Professional: $999 — Up to 7 custom pages + CMS',
              'E-Commerce: $2,499 — Full store with payment gateway',
            ],
          },
          {
            title: 'AI Chatbots, Voice Agents & Automations',
            list: [
              'Starter: $299 — Website chatbot + lead capture',
              'Professional: $799 — Full automation (n8n / multi-channel)',
              'Enterprise: $1,499 — Voice AI + custom workflows',
            ],
          },
          {
            title: 'App Development',
            list: [
              'Starter: $599 — Single-platform app (up to 5 screens)',
              'Professional: $2,499 — iOS + Android',
              'Enterprise: $4,499 — Complex apps (up to 25 screens)',
            ],
          },
          {
            title: 'Comic Book Art',
            list: [
              'Starter: $399 — 4 illustrated pages',
              'Standard: $999 — 12 pages',
              'Full Issue: $2,499 — 24 pages',
            ],
          },
          {
            title: 'Branding & Logo',
            list: [
              'Logo Only: $59',
              'Brand Starter: $199',
              'Full Brand Identity: $499',
            ],
          },
          {
            title: 'Mascot Design',
            list: [
              'Basic: $99',
              'Professional: $169',
              'Ultimate: $249 — with animation',
            ],
          },
          {
            title: '2D VTuber Models',
            list: [
              'Half Body No Rig: $149',
              'Half Body Rigged: $299',
              'Full Body No Rig: $249',
              'Full Body Rigged: $499',
            ],
          },
          {
            title: '3D Models',
            list: [
              'Basic: $249',
              'Professional: $349 — with rigging',
              'Premium: $599',
            ],
          },
          {
            title: 'Animation',
            list: [
              'Logo Animation: $99',
              'Explainer Video: $499',
              'Character Animation: $899',
            ],
          },
          {
            title: 'Custom Character Design',
            list: [
              'Bust / Headshot: $49',
              'Half Body: $99',
              'Full Body: $149',
            ],
          },
          {
            title: 'DnD Character Art',
            list: [
              'Character Art: $99',
              'Character Scene: $149',
              'Full Party: $449 — up to 6 characters',
            ],
          },
          {
            title: 'Furry Art',
            list: [
              'Headshot: $39',
              'Reference Sheet (SFW): $149 · (NSFW): $199',
              'Full Scene: $299',
            ],
          },
          {
            title: 'Fursuit Commissions',
            list: [
              'Custom Head: $800 — $1,500',
              'Partial Suit: $1,500 — $3,000',
              'Full Suit: $3,000 — $6,000+',
            ],
          },
          {
            title: 'NSFW Art',
            list: [
              'Single Character: $99',
              'Full Scene: $199',
              'Illustrated Pages: $399',
            ],
          },
          {
            title: 'Cover Art',
            list: [
              'Album / Single Cover: $99',
              'Book Cover: $249',
              'Game Cover / Key Art: $449',
            ],
          },
        ],
        note: 'These match our live pricing cards. For a custom quote, use the contact form on the homepage.',
      },
      {
        q: 'What payment methods do you accept?',
        a: ['We accept multiple secure payment methods to accommodate clients worldwide:'],
        list: [
          'Credit/Debit Cards via Stripe',
          'PayPal',
          'Wise (TransferWise)',
          'Payoneer',
          'Bank Transfer (for large projects)',
        ],
        after: ['All transactions are secure and encrypted.'],
      },
      {
        q: 'Do you require a deposit? What is your payment structure?',
        a: [
          'Yes, we require a 50% non-refundable deposit to begin work. This secures your spot in our schedule and covers initial concept development. The remaining 50% is due upon your final approval, before we deliver the complete source files and assets.',
        ],
      },
      {
        q: 'Do you offer payment plans?',
        a: [
          'Yes, we offer installment options for larger projects. If you would like to pay in installments, contact our team and we will work out a payment structure that fits your budget.',
        ],
      },
      {
        q: 'What is your refund policy?',
        a: [
          'Refunds are available only before any concepts or drafts are delivered. Once we have delivered initial concepts or work-in-progress, the deposit becomes non-refundable as it covers the creative labor and time already invested. We offer unlimited revisions to refine the work until you are fully satisfied.',
        ],
        link: { to: '/terms-of-service', label: 'Read the full Terms of Service' },
      },
    ],
  },
  {
    category: 'Process & Delivery',
    items: [
      {
        q: 'How long does a project take?',
        a: ['Timelines vary by service type and complexity. Here are typical turnaround ranges:'],
        groups: [
          {
            title: 'Websites & Apps',
            list: [
              'Single-page website: 5–7 days',
              'Multi-page website: 10–14 days',
              'E-Commerce store: 21–30 days',
              'Mobile app: 4–8 weeks',
            ],
          },
          {
            title: 'Art & Design',
            list: [
              'Logo / Branding: 3–7 days',
              'Character art / Illustration: 3–10 days',
              'Cover art / Mascot design: 5–10 days',
              'Fursuit head: 4–6 weeks · Partial: 8–12 weeks · Full suit: 12–16 weeks',
            ],
          },
          {
            title: 'Comics & VTuber Models',
            list: ['Comic book (24 pages): 3–6 weeks', '2D VTuber Model + Rigging: 2–4 weeks'],
          },
          {
            title: 'AI & Automation',
            list: ['Basic chatbot: 3–7 days', 'Advanced AI agent: 1–3 weeks'],
          },
        ],
        note: 'Rush delivery is available for an additional fee. We provide an exact timeline in your project proposal.',
      },
      {
        q: 'How many revisions are included?',
        a: [
          'All our packages include unlimited revisions within the agreed project scope. Minor changes (colors, text, small adjustments) are always free. Major scope changes — like switching art styles mid-project or adding entirely new deliverables — may require a revised quote.',
        ],
      },
      {
        q: 'What file formats will I receive?',
        a: ['We deliver files in all industry-standard formats based on your project:'],
        list: [
          'Artwork: PNG, JPG, SVG, PDF, PSD, AI, Procreate',
          'Websites: Full source code (HTML, CSS, JS, React, etc.), Figma files',
          'Apps: Source code repository, APK/IPA builds, documentation',
          '3D/VTuber: .vrm, Live2D files, Blender source files',
          'Video/Animation: MP4, MOV, GIF, After Effects project files',
        ],
        after: ['Need a specific format? Just ask — we will accommodate.'],
      },
      {
        q: 'Will I own the rights to the final work?',
        a: [
          'Yes. Upon full payment, you receive 100% ownership rights to the final deliverables. This includes full commercial usage rights — you can use, modify, reproduce, and distribute the work as you see fit. We retain only the right to display the work in our portfolio unless you request a confidential NDA arrangement.',
        ],
      },
    ],
  },
  {
    category: 'Services',
    items: [
      {
        q: 'Do you design websites only, or do you also develop them?',
        a: [
          'We do both. We handle the complete process: UI/UX design, responsive front-end development, CMS integration, and deployment. We build with modern tech stacks (React, Next.js, WordPress, Webflow, etc.) and provide full source code ownership.',
        ],
      },
      {
        q: 'Can you build AI chatbots and voice agents for my business?',
        a: [
          'Yes, AI automation is one of our core services. We build custom AI chatbots for websites, WhatsApp, and Discord; voice agents for phone support; and workflow automations using tools like OpenAI, Make, n8n, and custom APIs. We train the AI on your business data for accurate, on-brand responses.',
        ],
      },
      {
        q: 'Do you create NSFW or adult artwork?',
        a: [
          'Yes, we accept NSFW commissions for adult clients (18+) with full confidentiality and discretion. All NSFW projects are handled privately, never displayed in our public portfolio without explicit written consent, and protected under our standard confidentiality policy. We do not create content involving minors or illegal material.',
        ],
      },
      {
        q: 'Do you make fursuits?',
        a: [
          'Yes. We commission custom fursuit heads ($800–$1,500), partials ($1,500–$3,000), and full suits ($3,000–$6,000+). A clear reference sheet is required. We ship worldwide via DHL Express. See the dedicated Fursuit Commissions page for packages, add-ons, and FAQ.',
        ],
        link: { to: '/services/fursuits', label: 'View Fursuit Commissions' },
      },
      {
        q: 'Can you help with comic book creation from start to finish?',
        a: [
          'Absolutely. We offer full comic book production including character design, storyboarding, penciling, inking, coloring, lettering, and print-ready file preparation. Whether you need a single issue, a full series, or just cover art, we handle the entire pipeline.',
        ],
      },
      {
        q: 'Do you offer ongoing support after project delivery?',
        a: ['Yes. Our packages include free support periods:'],
        list: [
          'Starter: 7 days free support',
          'Professional: 30 days free support',
          'E-Commerce: 60 days free support',
        ],
        after: [
          'After the free period, we offer affordable monthly maintenance retainers for updates, bug fixes, and minor changes.',
        ],
      },
    ],
  },
  {
    category: 'Privacy & Confidentiality',
    items: [
      {
        q: 'Is my project information kept confidential?',
        a: [
          'Yes, absolutely. All project details, communications, and artwork are treated as strictly confidential by default. We never share your information or work without your permission. For sensitive commercial projects, we can sign a formal Non-Disclosure Agreement (NDA) before work begins.',
        ],
      },
      {
        q: 'Will my artwork appear in your portfolio?',
        a: [
          'Only with your explicit permission. By default, we may ask if we can showcase completed work. You can decline without any impact on your project. For NDA-protected projects, your work will never be displayed publicly.',
        ],
      },
      {
        q: 'How do you handle my personal data?',
        a: [
          'We collect only the information necessary to complete your project (name, email, project details, payment info). We do not sell or share your data with third parties for marketing. Payment data is handled securely by Stripe/PayPal — we never store your card details.',
        ],
        link: { to: '/privacy-policy', label: 'Read the full Privacy Policy' },
      },
    ],
  },
]

/** Homepage FAQ preview - top questions only */
export const homeFaqPreview = [
  {
    q: 'What is VOIDINK Studios?',
    a: 'VOIDINK Studios is a world-class creative and technology agency specializing in custom artwork, website design, app development, AI solutions, branding, and more. We work with clients globally - from indie creators and streamers to startups and established brands.',
  },
  {
    q: 'How do I get started with a project?',
    a: 'Fill out the contact form on our homepage or email us at support@voidinkstudios.com with your project details. We will respond within 2 hours with a free consultation, timeline estimate, and pricing. Once you approve the proposal and submit the 50% deposit, we begin work immediately.',
  },
  {
    q: 'Do you require a deposit?',
    a: 'Yes, we require a 50% non-refundable deposit to begin work. This secures your spot in our schedule and covers initial concept development. The remaining 50% is due upon your final approval, before we deliver the complete source files and assets.',
  },
  {
    q: 'Will I own the rights to the final work?',
    a: 'Yes. Upon full payment, you receive 100% ownership rights to the final deliverables. This includes full commercial usage rights. We retain only the right to display the work in our portfolio unless you request a confidential NDA arrangement.',
  },
]
