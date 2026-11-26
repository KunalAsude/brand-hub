import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetail from '@/components/product-detail'
import { products } from '@/data/products'

export function generateStaticParams() {
  return products.map(product => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = products.find(item => item.slug === slug)
  if (!product) return { title: 'Product not found | Brand Hub Mens Wear' }
  return { title: `${product.name} | Brand Hub Mens Wear – Kopargaon`, description: `${product.tagline}. See colours and sizes, then reserve on WhatsApp from Brand Hub Mens Wear, Kopargaon.` }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = products.find(item => item.slug === slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
