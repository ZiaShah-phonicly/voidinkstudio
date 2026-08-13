import { useCallback, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LegalPageShell from '../components/LegalPageShell'
import Reveal, { RevealItem } from '../components/Reveal'
import useOutsideClose from '../hooks/useOutsideClose'
import usePageMeta from '../hooks/usePageMeta'
import JsonLd from '../components/JsonLd'
import { faqCategories } from '../data/faqData'
import { faqPageSchemaFromCategories, pageTitle, sitePageSchema } from '../data/seo'

const FAQ_DESCRIPTION =
  'Answers about VOIDINK Studios pricing, process, ownership, deposits, and how to start a custom art, web, app, or AI project.'

export default function FaqPage() {
  const [openKey, setOpenKey] = useState(null)
  const listRef = useRef(null)
  const navigate = useNavigate()
  usePageMeta({
    title: pageTitle('FAQ'),
    description: FAQ_DESCRIPTION,
  })

  const closeFaq = useCallback(() => setOpenKey(null), [])
  useOutsideClose(listRef, openKey !== null, closeFaq)

  return (
    <LegalPageShell
      label="✦ FAQ"
      title="Frequently Asked Questions"
      breadcrumb="FAQ"
      subtitle="Everything you need to know before starting your project with VOIDINK Studios."
    >
      <JsonLd
        data={sitePageSchema({
          path: '/faq',
          name: pageTitle('FAQ'),
          description: FAQ_DESCRIPTION,
          breadcrumbName: 'FAQ',
          extraNodes: [faqPageSchemaFromCategories(faqCategories)],
        })}
      />
      <div className="faq-page-list" ref={listRef}>
        {faqCategories.map((group) => (
          <section key={group.category} className="faq-group">
            <Reveal>
              <h2 className="faq-group-title">{group.category}</h2>
            </Reveal>

            {group.items.map((item, index) => {
              const key = `${group.category}-${item.q}`
              const open = openKey === key
              return (
                <RevealItem as="div" key={key} delay={index * 60} className={`faq-acc${open ? ' active' : ''}`}>
                  <h3 className="faq-acc-heading">
                    <button
                      type="button"
                      className="faq-acc-q"
                      aria-expanded={open}
                      onClick={() => setOpenKey(open ? null : key)}
                    >
                      <span className="faq-acc-text">{item.q}</span>
                      <span className="faq-acc-icon" aria-hidden="true" />
                    </button>
                  </h3>

                  <div className="faq-acc-a">
                    <div>
                      <div className="faq-acc-a-inner">
                        {item.a?.map((text) => (
                          <p key={text}>{text}</p>
                        ))}

                        {item.list ? (
                          <ul>
                            {item.list.map((entry) => (
                              <li key={entry}>{entry}</li>
                            ))}
                          </ul>
                        ) : null}

                        {item.groups?.map((sub) => (
                          <div key={sub.title} className="faq-acc-group">
                            <strong>{sub.title}</strong>
                            <ul>
                              {sub.list.map((entry) => (
                                <li key={entry}>{entry}</li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        {item.after?.map((text) => (
                          <p key={text}>{text}</p>
                        ))}

                        {item.note ? <p className="faq-acc-note">{item.note}</p> : null}

                        {item.link ? (
                          <p>
                            <Link to={item.link.to}>{item.link.label}</Link>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </section>
        ))}
      </div>

      <Reveal>
        <div className="about-cta-box faq-cta">
          <p className="section-label">✦ Still Curious</p>
          <h2 className="section-title">Still Have Questions?</h2>
          <p className="section-sub">We are here to help. Reach out and we will respond Asap!.</p>
          <div className="hero-act about-cta-actions">
            <a
              href="/#query"
              className="bp"
              onClick={(e) => {
                e.preventDefault()
                navigate('/#query')
              }}
            >
              Contact Us <span aria-hidden="true">→</span>
            </a>
            <a href="mailto:support@voidinkstudios.com" className="bs">
              Email Us
            </a>
          </div>
        </div>
      </Reveal>
    </LegalPageShell>
  )
}
