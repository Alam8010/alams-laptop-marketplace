'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ProductCard({ product }) {
  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        <div style={{ width: '100%', height: '180px', background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 600px) 100vw, 260px"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#bbb', fontSize: '40px' }}>💻</div>
          )}
        </div>
        <div style={{ padding: '12px' }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>{product.brand}</div>
          <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '6px', lineHeight: '1.3' }}>{product.title}</div>
          <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px' }}>
            {product.ram} · {product.storage} · {product.condition}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '17px', color: '#000' }}>
            PKR {Number(product.price).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '4px' }}>
            by {product.stores?.store_name}
          </div>
        </div>
      </div>
    </Link>
  )
}