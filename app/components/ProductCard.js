'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        overflow: 'hidden',
        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
        height: '100%',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#3b82f6'
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(59,130,246,0.15)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--border)'
          e.currentTarget.style.boxShadow = 'none'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Image */}
        <div style={{ width: '100%', height: '180px', background: '#0a1628', position: 'relative', overflow: 'hidden' }}>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, 260px"
            />
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', color: '#1e3a5f', fontSize: '14px', fontWeight: '500',
            }}>
              No Image
            </div>
          )}
        </div>

        {/* Body */}
        <div style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
            {product.brand}
          </div>
          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', lineHeight: '1.4', color: 'var(--text)' }}>
            {product.title}
          </div>
          <div style={{
            display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px',
          }}>
            {[product.processor_model, product.ram, product.storage, product.condition].filter(Boolean).map((tag, i) => (
              <span key={i} style={{
                padding: '2px 8px',
                background: '#0d1f3c',
                border: '1px solid #1e3a5f',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#64748b',
              }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: '700', fontSize: '17px', color: '#3b82f6' }}>
              PKR {Number(product.price).toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {product.stores?.store_name}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
