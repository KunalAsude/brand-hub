'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, Clock3, MapPin, Menu, Minus, Pause, Phone, Play, Plus, ShoppingBag, Sparkles, Volume2, VolumeX, X } from 'lucide-react'
import { products, type Product } from '@/data/products'
import { WhatsAppIcon, wa } from '@/components/whatsapp'

type BagItem = { product: Product; colour: string; image: string; size: string; quantity: number }
type AddFn = (item: BagItem, from?: HTMLElement | null) => void
const priceText = (price: number | null) => price === null ? 'Ask for price' : `₹${price}`

function BrandLogo({ priority = false }: { priority?: boolean }) {
  return <Image src="/logo.png" alt="Brand Hub Men's Wear" width={450} height={220} className="brand-logo" priority={priority} />
}

/** Vertical reel that only plays while on screen. Muted autoplay; tap to pause, sound button to unmute. */
function Reel({ src, poster, alt, sizes }: { src: string; poster: string; alt: string; sizes: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !paused) video.play().catch(() => {})
      else video.pause()
    }, { threshold: .6 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [paused])
  return <>
    <Image src={poster} alt={alt} fill sizes={sizes} className="product-photo" />
    <video ref={ref} className="reel-video" src={src} muted={muted} loop playsInline preload="metadata" poster={poster}
      onTimeUpdate={e => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
      onClick={() => setPaused(p => !p)} />
    <span className="reel-progress"><i style={{ transform: `scaleX(${progress})` }} /></span>
    <button className="reel-toggle" onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play video' : 'Pause video'}>{paused ? <Play size={15} fill="currentColor"/> : <Pause size={15} fill="currentColor"/>}</button>
    <button className="reel-toggle reel-sound" onClick={() => setMuted(m => !m)} aria-label={muted ? 'Turn sound on' : 'Mute'}>{muted ? <VolumeX size={15}/> : <Volume2 size={15}/>}</button>
  </>
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: AddFn }) {
  const [colourIndex, setColourIndex] = useState(0)
  const [showSizes, setShowSizes] = useState(false)
  const [hovered, setHovered] = useState(false)
  const colour = product.colours[colourIndex]
  const reducedMotion = useReducedMotion()
  const mediaRef = useRef<HTMLAnchorElement>(null)
  return <motion.article className="product-card" initial={reducedMotion ? false : { opacity: 0, y: 24, rotate: 1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, margin: '-30px' }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} style={{ transformOrigin: 'top center' }}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <Link ref={mediaRef} href={`/p/${product.slug}`} className="card-media" aria-label={`View ${product.name}`}>
      <AnimatePresence initial={false}><motion.div key={colour.image + colourIndex} className="card-photo-layer" initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .3 }}>
        <Image src={colour.image} alt={`${product.name} in ${colour.name}`} fill sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 280px" className="product-photo" />
      </motion.div></AnimatePresence>
      {product.reel && hovered && !reducedMotion && <video className="reel-video card-hover-video" src={product.reel} poster={colour.image} muted autoPlay loop playsInline />}
      {product.isNew && <span className="new-stamp">NEW<br/><small>आगमन</small></span>}
      <span className="media-category">{product.category}</span>
      {product.reel && <span className="media-play" aria-hidden="true"><Play size={14} fill="currentColor" /></span>}
    </Link>
    <div className="card-copy">
      <div className="card-title-row"><Link href={`/p/${product.slug}`} className="card-title">{product.name}</Link><span className="card-price">{priceText(product.price)}</span></div>
      <p className="card-tagline">{product.tagline}</p>
      <div className="card-bottom">
        <div className="swatches" aria-label={`${product.colours.length} colours`}>{product.colours.map((c, index) => <button key={c.name} className={`swatch ${index === colourIndex ? 'selected' : ''}`} style={{ '--swatch': c.hex } as React.CSSProperties} aria-label={`Choose ${c.name}`} aria-pressed={index === colourIndex} onClick={() => setColourIndex(index)} />)}</div>
        <button className="quick-add" aria-label={`Add ${product.name} to WhatsApp bag`} aria-expanded={showSizes} onClick={() => setShowSizes(!showSizes)}><motion.span animate={{ rotate: showSizes ? 45 : 0 }} style={{ display: 'grid' }}><Plus size={18}/></motion.span></button>
      </div>
      <p className="colour-name">{colour.name} · {product.colours.length} colours</p>
      <AnimatePresence>{showSizes && <motion.div className="quick-sizes" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><span>Size</span>{product.sizes.map(size => <button key={size} onClick={() => { onAdd({ product, colour: colour.name, image: colour.image, size, quantity: 1 }, mediaRef.current); setShowSizes(false) }}>{size}</button>)}</motion.div>}</AnimatePresence>
    </div>
  </motion.article>
}

function ReelCard({ product, onAdd }: { product: Product; onAdd: AddFn }) {
  const posterRef = useRef<HTMLDivElement>(null)
  return <article className="reel-card">
    <div className="reel-poster" ref={posterRef}>
      {product.reel ? <Reel src={product.reel} poster={product.image} alt={product.name} sizes="240px" /> : <Image src={product.image} alt={product.name} fill sizes="240px" className="product-photo" />}
      <div className="reel-caption"><span>BRAND HUB · KOPARGAON</span><strong>{product.name}</strong><b>{priceText(product.price)}</b></div>
    </div>
    <button className="reel-order" onClick={() => onAdd({ product, colour: product.colours[0].name, image: product.colours[0].image, size: product.sizes[0], quantity: 1 }, posterRef.current)}>Add to WhatsApp bag <ArrowRight size={16}/></button>
  </article>
}

export default function ShopFront() {
  const [compactHeader, setCompactHeader] = useState(false)
  useEffect(() => {
    // Two thresholds: shrinking the header shifts the page ~16px, so a single cut-off makes it flicker.
    const updateHeader = () => setCompactHeader(c => c ? window.scrollY > 8 : window.scrollY > 64)
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedColour, setSelectedColour] = useState(0)
  const [bag, setBag] = useState<BagItem[]>([])
  const [bagOpen, setBagOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showHeroReel, setShowHeroReel] = useState(false)
  const [flyer, setFlyer] = useState<{ id: number; src: string; from: DOMRect; to: DOMRect } | null>(null)
  const bagButton = useRef<HTMLButtonElement>(null)
  const bagControls = useAnimationControls()
  const reducedMotion = useReducedMotion()
  const hero = products[0]
  const [size, setSize] = useState(hero.sizes[0])
  const categories = ['All', 'Shirts', 'Jackets', 'Trousers', 'Winter accessories', 'Jeans', 'Ethnic']
  const visibleProducts = useMemo(() => activeCategory === 'All' ? products : products.filter(p => p.category === activeCategory), [activeCategory])
  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0)
  const bagTotal = bag.reduce((sum, item) => sum + (item.product.price ?? 0) * item.quantity, 0)
  const addToBag: AddFn = (item, from) => {
    setBag(current => {
      const existing = current.findIndex(row => row.product.slug === item.product.slug && row.colour === item.colour && row.size === item.size)
      if (existing < 0) return [...current, item]
      return current.map((row, i) => i === existing ? { ...row, quantity: row.quantity + item.quantity } : row)
    })
    if (from && bagButton.current && !reducedMotion) setFlyer({ id: Date.now(), src: item.image, from: from.getBoundingClientRect(), to: bagButton.current.getBoundingClientRect() })
    else bagControls.start({ scale: [1, 1.12, 1], transition: { duration: .35 } })
  }
  const updateQuantity = (index: number, amount: number) => setBag(current => current.map((item, i) => i === index ? { ...item, quantity: item.quantity + amount } : item).filter(item => item.quantity > 0))
  const sendBag = () => {
    const lines = bag.map(item => `• ${item.product.name} – ${item.colour} – ${item.size} – ${item.quantity} pc${item.quantity > 1 ? 's' : ''}`)
    const total = bag.some(item => item.product.price === null) ? 'To be confirmed' : `₹${bagTotal}`
    window.open(wa(`नमस्कार Brand Hub! I want to order:\n${lines.join('\n')}\nTotal: ${total}\nIs it available? I will pick it up from the shop.`), '_blank', 'noopener,noreferrer')
  }
  const heroColour = hero.colours[selectedColour]
  const orderSingle = wa(`नमस्कार Brand Hub! I want to order:\n• ${hero.name} – ${heroColour.name} – ${size} – 1 pc\nIs it available? I will pick it up from the shop.`)
  const count = String(visibleProducts.length).padStart(2, '0')
  return <>
    <header className={`site-header ${compactHeader ? 'header-compact' : ''}`}><div className="header-inner"><Link href="#top" className="brand-lockup"><BrandLogo priority/></Link>
      <nav className={mobileMenu ? 'main-nav nav-open' : 'main-nav'}><a href="#arrivals" onClick={() => setMobileMenu(false)}>New arrivals</a><a href="#reels" onClick={() => setMobileMenu(false)}>Shop reels</a><a href="#visit" onClick={() => setMobileMenu(false)}>Visit us</a></nav>
      <div className="header-actions"><a className="header-phone" href="tel:+918605339900" aria-label="Call Brand Hub"><Phone size={17}/><span>Call us</span></a><a className="header-wa" href={wa('नमस्कार Brand Hub!')} target="_blank" rel="noreferrer"><WhatsAppIcon size={17}/> WhatsApp</a><button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label={mobileMenu ? 'Close menu' : 'Open menu'}>{mobileMenu ? <X/> : <Menu/>}</button></div>
    </div></header>
    <main id="top">
      <div className="ticker"><div className="ticker-track">{[0, 1].map(k => <span key={k} className="ticker-set"><span className="mr">नवीन माल आला</span><i/>Winter special 2-in-1 jacket<i/>Premium plain shirts · 7 colours<i/>Cap + mask combo ₹75<i/>Order on WhatsApp, pick up from the shop<i/></span>)}</div></div>
      <section className="hero-section section-wrap"><div className="hero-kicker"><span className="eyebrow">LATEST DROP <span className="live-dot"/> JUST IN</span><span className="hindi-note">नवीन माल आला</span></div>
        <div className="hero-layout"><div className="hero-visual"><div className="hero-photo-wrap">
          {showHeroReel && hero.reel ? <Reel src={hero.reel} poster={heroColour.image} alt={hero.name} sizes="(max-width: 760px) 100vw, 58vw" /> :
          <AnimatePresence mode="wait"><motion.div key={selectedColour} className="hero-photo-inner" initial={{ opacity: 0, scale: .98, rotate: 1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: .38 }}><Image src={heroColour.image} alt={`${hero.name} in ${heroColour.name}`} fill priority sizes="(max-width: 760px) 100vw, 58vw" className="product-photo" /></motion.div></AnimatePresence>}
          <div className="photo-topline"><span>BH / NEW</span><span>JUST IN</span></div>
          {hero.reel && <button className="story-play" onClick={() => setShowHeroReel(s => !s)}>{showHeroReel ? <><X size={16}/> Back to photos</> : <><Play size={16} fill="currentColor"/> Watch the reel</>}</button>}
        </div><span className="hero-image-caption">REAL PHOTOS · SHOT IN KOPARGAON</span></div>
          <div className="hero-details"><div className="hang-label"><div className="tag-hole"/><span className="tag-overline">BRAND HUB · NEW ARRIVAL</span><h1>{hero.name}</h1><p className="tagline">{hero.tagline}</p><div className="tag-lines">{hero.labelLines.map((line, i) => <motion.div key={line} initial={reducedMotion ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .3 + i * .08 }}>{line}</motion.div>)}</div><div className="tag-price">{priceText(hero.price)} <small>Ask on WhatsApp for today&apos;s price</small></div></div>
            <div className="hero-options"><div className="option-head"><span>CHOOSE COLOUR</span><span>{heroColour.name}</span></div><div className="swatches hero-swatches">{hero.colours.map((c, index) => <button key={c.name} className="swatch big-swatch" style={{ '--swatch': c.hex } as React.CSSProperties} onClick={() => { setSelectedColour(index); setShowHeroReel(false) }} aria-label={`Show ${c.name}`} aria-pressed={index === selectedColour}>{selectedColour === index && <motion.span className="swatch-ring" layoutId="hero-ring" transition={{ type: 'spring', stiffness: 400, damping: 30 }}/>}</button>)}</div><div className="option-head size-head"><span>SIZE</span><span>{hero.fit}</span></div><div className="size-options">{hero.sizes.map(s => <button key={s} className={size === s ? 'size-selected' : ''} onClick={() => setSize(s)}>{s}</button>)}</div></div>
            <div className="hero-actions"><a className="button-primary hero-order" href={orderSingle} target="_blank" rel="noreferrer"><WhatsAppIcon size={18}/> Order on WhatsApp</a><button className="hero-bag" aria-label="Add to WhatsApp bag" onClick={e => addToBag({ product: hero, colour: heroColour.name, image: heroColour.image, size, quantity: 1 }, e.currentTarget.closest('.hero-layout')?.querySelector('.hero-photo-wrap') as HTMLElement)}><ShoppingBag size={18}/></button></div>
            <p className="pickup-note"><Check size={15}/> Reserve on WhatsApp · Pick up in store</p>
          </div></div>
      </section>
      <section className="reels-section" id="reels"><div className="section-wrap"><div className="section-heading"><div><span className="eyebrow">FROM THE SHOP FLOOR</span><h2>Quick look. <em>Real fit.</em></h2><p>Real reels from the shop. Tap for sound.</p></div><a href="#arrivals" className="text-link">ALL ARRIVALS <ArrowDown size={15}/></a></div><div className="reels-track">{products.filter(p => p.reel).map(p => <ReelCard key={p.slug} product={p} onAdd={addToBag}/>)}</div></div></section>
      <section className="arrivals-section section-wrap" id="arrivals"><div className="section-heading arrivals-heading"><div><span className="eyebrow">PICK YOUR NEXT FAVOURITE</span><h2>New <em>arrivals.</em></h2><p>New stock, fresh colours. Message us to reserve yours.</p></div></div>
        <div className="filter-wrap"><div className="filter-chips">{categories.map(category => <button key={category} className={activeCategory === category ? 'filter-active' : ''} onClick={() => setActiveCategory(category)}>{activeCategory === category && <motion.span className="filter-pill" layoutId="category-pill"/>}<span>{category}</span></button>)}</div><span className="item-count">{count} {visibleProducts.length === 1 ? 'ARTICLE' : 'ARTICLES'}</span></div>
        {visibleProducts.length ? <motion.div layout className="product-grid">{visibleProducts.map(product => <ProductCard key={product.slug} product={product} onAdd={addToBag}/>)}</motion.div>
          : <div className="empty-cat"><p>New {activeCategory.toLowerCase()} are coming soon.</p><a className="button-primary" href={wa(`नमस्कार Brand Hub! Do you have ${activeCategory.toLowerCase()} in stock?`)} target="_blank" rel="noreferrer"><WhatsAppIcon size={17}/> Ask what&apos;s in stock</a></div>}
      </section>
      <section className="festive-section"><div className="festive-inner"><div className="festive-ornament"><Sparkles size={18}/><span>CELEBRATE TOGETHER</span></div><div><span className="eyebrow">WEDDING · FESTIVE · FAMILY</span><h2>One occasion.<br/><em>One good look.</em></h2><p>Sherwanis, kurtas and group orders for your special day. Tell us what you have in mind and we&apos;ll help you find the right fit.</p><a className="button-light" href={wa('नमस्कार Brand Hub! I have a wedding / festive group order enquiry.')} target="_blank" rel="noreferrer">Enquire on WhatsApp <ArrowRight size={18}/></a></div><div className="festive-side-note">BRAND HUB<br/>KOPARGAON</div></div></section>
      <section className="visit-section section-wrap" id="visit"><div className="visit-intro"><span className="eyebrow">GOOD CLOTHES, CLOSE BY</span><h2>Come by.<br/><em>Try it on.</em></h2><p>Photos help. The fitting room settles it. Visit us in Kopargaon.</p><span className="visit-hindi">भेट द्या, आवडेल ते घ्या.</span></div><div className="visit-card"><div className="visit-card-top"><span>FIND OUR SHOP</span><span className="map-pin"><MapPin size={17}/></span></div><h3>Brand Hub<br/>Mens Wear</h3><p className="address-eng">Prashant Palace, Juna Bhaji Market Road,<br/>Kopargaon, Maharashtra</p><p className="address-marathi">प्रशांत पॅलेस, जुना भाजी मार्केट रोड,<br/>कोपरगाव</p><div className="visit-divider"/><div className="visit-contact"><div><span>CALL / WHATSAPP</span><a href="tel:+918605339900">8605339900</a><a href="tel:+919156550404">9156550404</a></div><div><span>SHOP HOURS</span><p><Clock3 size={15}/> Call to check timings</p></div></div><a href="https://www.google.com/maps/search/?api=1&query=Brand+Hub+Mens+Wear+Kopargaon" target="_blank" rel="noreferrer" className="maps-button">GET DIRECTIONS <ArrowRight size={16}/></a></div></section>
    </main>
    <footer className="site-footer"><div className="footer-main"><Link href="#top" className="brand-lockup footer-brand"><BrandLogo/></Link><p>Good clothes. Real fit.<br/>Right here in Kopargaon.</p><a href={wa('नमस्कार Brand Hub!')} target="_blank" rel="noreferrer" className="footer-wa"><span>HAVE A QUESTION?</span>Message us on WhatsApp <ArrowRight size={17}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} BRAND HUB MENS WEAR</span><span>PRASHANT PALACE · KOPARGAON, MH</span></div></footer>
    <motion.button ref={bagButton} animate={bagControls} className="floating-bag" onClick={() => setBagOpen(true)} aria-label={`Open WhatsApp bag, ${bagCount} items`}><ShoppingBag size={20}/><span>My bag</span><motion.b key={bagCount} initial={{ scale: .4 }} animate={{ scale: 1 }}>{bagCount}</motion.b></motion.button>
    <a className="floating-wa" href={wa('नमस्कार Brand Hub!')} target="_blank" rel="noreferrer" aria-label="Chat with Brand Hub on WhatsApp"><WhatsAppIcon size={26}/></a>
    <AnimatePresence>{flyer && <motion.div key={flyer.id} className="flyer" style={{ backgroundImage: `url(${flyer.src})` }}
      initial={{ left: flyer.from.left + flyer.from.width / 2 - 40, top: flyer.from.top + flyer.from.height / 2 - 50, scale: 1, opacity: 1 }}
      animate={{ left: flyer.to.left + flyer.to.width / 2 - 40, top: flyer.to.top + flyer.to.height / 2 - 50, scale: .2, opacity: .7 }}
      transition={{ duration: .7, ease: [.5, 0, .2, 1] }}
      onAnimationComplete={() => { setFlyer(null); bagControls.start({ scale: [1, 1.15, 1], transition: { duration: .35 } }) }} />}</AnimatePresence>
    <AnimatePresence>{bagOpen && <><motion.button className="drawer-scrim" aria-label="Close bag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBagOpen(false)}/><motion.aside className="bag-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} aria-label="WhatsApp bag"><div className="drawer-head"><div><span className="eyebrow">YOUR WHATSAPP LIST</span><h2>My bag <span>{bagCount}</span></h2></div><button onClick={() => setBagOpen(false)} aria-label="Close bag"><X/></button></div>{bag.length ? <><div className="bag-items"><AnimatePresence initial={false}>{bag.map((item, index) => <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bag-item" key={`${item.product.slug}-${item.colour}-${item.size}`}><div className="bag-thumb"><Image src={item.image} alt={item.product.name} fill sizes="72px"/></div><div className="bag-item-copy"><strong>{item.product.name}</strong><span>{item.colour} · {item.size}</span><b>{priceText(item.product.price)}</b></div><div className="quantity-control"><button onClick={() => updateQuantity(index, -1)} aria-label="Remove one"><Minus size={15}/></button><span>{item.quantity}</span><button onClick={() => updateQuantity(index, 1)} aria-label="Add one"><Plus size={15}/></button></div></motion.div>)}</AnimatePresence></div><div className="bag-total"><span>ESTIMATED TOTAL</span><strong>{bag.some(item => item.product.price === null) ? 'Confirm on WhatsApp' : `₹${bagTotal}`}</strong></div><button className="button-primary send-order" onClick={sendBag}><WhatsAppIcon size={18}/> Send list on WhatsApp</button><p className="bag-footnote">No checkout, no payment. We&apos;ll confirm availability with you.</p></> : <div className="bag-empty"><div><ShoppingBag size={25}/></div><h3>Your list is waiting.</h3><p>Add a few things you like and send them together on WhatsApp.</p><button className="button-primary" onClick={() => setBagOpen(false)}>Browse new arrivals <ArrowRight size={17}/></button></div>}</motion.aside></>}</AnimatePresence>
  </>
}
