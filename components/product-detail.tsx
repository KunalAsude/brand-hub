'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Phone } from 'lucide-react'
import { products, type Product } from '@/data/products'
import { WhatsAppIcon, wa } from '@/components/whatsapp'

export default function ProductDetail({ product }: { product: Product }) {
  const [colourIndex, setColourIndex] = useState(0)
  const [size, setSize] = useState(product.sizes[0])
  const colour = product.colours[colourIndex]
  const price = product.price === null ? 'Ask for price' : `₹${product.price}`
  const whatsapp = wa(`नमस्कार Brand Hub! I want to order:\n• ${product.name} – ${colour.name} – ${size} – 1 pc\nIs it available? I will pick it up from the shop.`)
  const related = products.filter(item => item.slug !== product.slug)
  return <main className="detail-page">
    <header className="detail-header"><Link href="/" className="detail-back"><ArrowLeft size={17}/> Back to shop</Link><Link href="/" className="detail-brand"><Image src="/logo.png" alt="Brand Hub Men's Wear" width={450} height={220} priority /></Link><a href="tel:+918605339900" className="detail-call"><Phone size={16}/><span>Call</span></a></header>
    <div className="detail-breadcrumb"><Link href="/">Home</Link><span>/</span><span>{product.category}</span><span>/</span><strong>{product.name}</strong></div>
    <section className="detail-main"><div className="detail-gallery"><div className="detail-image"><AnimatePresence initial={false}><motion.div key={colourIndex} className="card-photo-layer" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}><Image src={colour.image} alt={`${product.name} in ${colour.name}`} fill priority sizes="(max-width: 700px) 100vw, 52vw" className="product-photo"/></motion.div></AnimatePresence><span className="detail-index">{colourIndex + 1} / {product.colours.length} · {colour.name}</span></div><div className="detail-thumbs">{product.colours.map((item, index) => <button key={item.name} className={index === colourIndex ? 'thumb-selected' : ''} onClick={() => setColourIndex(index)} aria-label={`View ${item.name}`}><Image src={item.image} alt="" fill sizes="74px"/></button>)}</div></div>
      <div className="detail-copy"><span className="eyebrow">{product.category.toUpperCase()} · {product.isNew ? 'NEW ARRIVAL' : 'BRAND HUB'}</span><h1>{product.name}</h1><p className="detail-tagline">{product.tagline}</p><p className="detail-price">{price} <small>{product.price === null ? 'Ask us on WhatsApp for today’s price' : 'Pick up from our shop'}</small></p><div className="detail-rule"/><div className="detail-options"><div className="option-head"><span>COLOUR</span><span>{colour.name}</span></div><div className="swatches detail-swatches">{product.colours.map((item, index) => <button key={item.name} className={`swatch big-swatch ${index === colourIndex ? 'selected' : ''}`} style={{ '--swatch': item.hex } as React.CSSProperties} onClick={() => setColourIndex(index)} aria-label={item.name}/>)}</div><div className="option-head size-head"><span>SELECT SIZE</span><span>{product.fit}</span></div><div className="size-options">{product.sizes.map(item => <button key={item} className={size === item ? 'size-selected' : ''} onClick={() => setSize(item)}>{item}</button>)}</div></div>{product.reel && <div className="detail-reel"><video src={product.reel} poster={product.image} controls playsInline preload="metadata" /></div>}<p className="detail-fit"><Check size={15}/>{product.fit} · Try it on in store</p><a href={whatsapp} target="_blank" rel="noreferrer" className="button-primary detail-order"><WhatsAppIcon size={18}/> Order on WhatsApp</a><p className="detail-assurance">Message us to check availability. Pay at the shop when you pick up.</p></div></section>
    <section className="detail-related"><div className="section-heading"><div><span className="eyebrow">MORE FROM THE SHOP</span><h2>You may <em>like.</em></h2></div><Link href="/#arrivals" className="text-link">ALL ARRIVALS <ArrowRight size={14}/></Link></div><div className="related-grid">{related.map(item => <Link href={`/p/${item.slug}`} className="related-card" key={item.slug}><div><Image src={item.image} alt={item.name} fill sizes="(max-width: 650px) 42vw, 240px" className="product-photo"/></div><span>{item.category}</span><strong>{item.name}</strong></Link>)}</div></section>
    <div className="detail-mobile-bar"><div><span>{price}</span><small>{colour.name} · {size}</small></div><a href={whatsapp} target="_blank" rel="noreferrer"><WhatsAppIcon size={17}/> Order on WhatsApp</a></div>
  </main>
}
