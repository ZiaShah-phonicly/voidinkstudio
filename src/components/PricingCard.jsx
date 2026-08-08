import { useState } from 'react'
import { RevealItem } from './Reveal'

export default function PricingCard({
  pkg,
  delay = 0,
  categoryId,
  categoryLabel,
  onOrder,
  onChat,
  onMouseEnter,
  onMouseLeave,
}) {
  const hasVariants = Array.isArray(pkg.variants) && pkg.variants.length > 0
  const [variantId, setVariantId] = useState(hasVariants ? pkg.variants[0].id : null)
  const selected = hasVariants ? pkg.variants.find((v) => v.id === variantId) || pkg.variants[0] : null

  const price = selected?.price ?? pkg.price
  const desc = selected?.desc ?? pkg.desc
  const features = selected?.features ?? pkg.features
  const orderLabel = selected ? `Order ${selected.label}` : 'Order Now'

  const handleOrder = (event) => {
    const packageName = selected ? `${pkg.name} (${selected.label})` : pkg.name
    onOrder?.(event, {
      categoryId,
      categoryLabel,
      packageName,
      price,
      desc,
      features,
    })
  }

  return (
    <RevealItem
      delay={delay}
      className={`pk ${pkg.featured ? 'pk-ft' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {pkg.badge && <div className="pk-badge">{pkg.badge}</div>}
      <div className="pk-name">
        {pkg.emoji ? `${pkg.emoji} ${pkg.name}` : pkg.name}
      </div>

      {hasVariants && (
        <div className="pk-variants" role="group" aria-label={`${pkg.name} options`}>
          {pkg.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              className={`pk-variant ${variantId === variant.id ? 'a' : ''}`}
              onClick={() => setVariantId(variant.id)}
            >
              {variant.label}
              <span>{variant.price}</span>
            </button>
          ))}
        </div>
      )}

      <div className="pk-pr">{price}</div>
      <div className="pk-desc">{desc}</div>
      <ul className="pk-f">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <a href="#query" className={`pk-btn ${pkg.featured ? 'pk-bf' : 'pk-bo'}`} onClick={handleOrder}>
        {orderLabel}
      </a>
      <button type="button" className="pk-chat" onClick={onChat}>
        💬 Live Chat
      </button>
    </RevealItem>
  )
}
