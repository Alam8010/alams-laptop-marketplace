import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ImageGallery from './ImageGallery'

export default async function ProductPage({ params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*, stores(id, store_name, whatsapp_number, status)')
    .eq('id', id)
    .single()

  if (!product || product.stores?.status !== 'approved') notFound()

  const waMessage = encodeURIComponent(`Hi, I am interested in your laptop: ${product.title} listed on laptopsellers for PKR ${Number(product.price).toLocaleString()}. Is it still available?`)
  const waLink = `https://wa.me/${product.stores.whatsapp_number}?text=${waMessage}`

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '940px', margin: '0 auto', padding: '28px 16px' }}>

        {/* Back */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          textDecoration: 'none', color: 'var(--text-muted)',
          fontSize: '14px', marginBottom: '24px',
        }}>
          Back to listings
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '36px' }}>

          {/* Images */}
          <div>
            <ImageGallery images={product.images} title={product.title} />
          </div>

          {/* Details */}
          <div>
            <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              {product.brand}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px', lineHeight: '1.3' }}>
              {product.title}
            </h1>
            <div style={{ fontSize: '32px', fontWeight: '800', color: '#3b82f6', marginBottom: '20px' }}>
              PKR {Number(product.price).toLocaleString()}
            </div>

            {/* Specs table */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '8px', overflow: 'hidden', marginBottom: '20px',
            }}>
              {[
                ['Brand', product.brand],
                ['RAM', product.ram],
                ['Storage', product.storage],
                ['Condition', product.condition],
                ['Seller', product.stores?.store_name],
              ].map(([label, value], i, arr) => (
                <div key={label} style={{
                  display: 'flex',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '13px', width: '40%', background: '#051124' }}>
                    {label}
                  </div>
                  <div style={{ padding: '10px 14px', fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block', padding: '14px',
                background: '#16a34a',
                color: '#fff', borderRadius: '8px',
                textDecoration: 'none', textAlign: 'center',
                fontWeight: '700', fontSize: '15px', marginBottom: '10px',
              }}
            >
              Contact on WhatsApp
            </a>

            {/* View store */}
            <Link href={`/stores/${product.stores?.id}`} style={{
              display: 'block', padding: '12px',
              border: '1px solid var(--border)',
              borderRadius: '8px', textDecoration: 'none',
              textAlign: 'center', color: 'var(--text-muted)',
              fontSize: '13px', background: 'var(--surface)',
            }}>
              View Store: {product.stores?.store_name}
            </Link>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div style={{
            marginTop: '36px', paddingTop: '28px',
            borderTop: '1px solid var(--border)',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)', marginBottom: '12px' }}>
              Description
            </h2>
            <p style={{ lineHeight: '1.8', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', fontSize: '14px' }}>
              {product.description}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
