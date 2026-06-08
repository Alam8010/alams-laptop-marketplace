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

  const waMessage = encodeURIComponent(`Hi, I'm interested in your laptop: ${product.title} listed on laptopsellers for PKR ${Number(product.price).toLocaleString()}. Is it still available?`)
  const waLink = `https://wa.me/${product.stores.whatsapp_number}?text=${waMessage}`

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Back link */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-muted)' }}>← Back to listings</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Images */}
        <div>
          <ImageGallery images={product.images} title={product.title} />
        </div>

        {/* Details */}
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{product.brand}</div>
          <h1 style={{ fontSize: '22px', margin: '0 0 12px', lineHeight: '1.3' }}>{product.title}</h1>
          <div style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>
            PKR {Number(product.price).toLocaleString()}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '14px' }}>
            <tbody>
              {[
                ['Brand', product.brand],
                ['RAM', product.ram],
                ['Storage', product.storage],
                ['Condition', product.condition],
                ['Seller', product.stores?.store_name],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 0', color: 'var(--text-muted)', width: '40%' }}>{label}</td>
                  <td style={{ padding: '8px 0', fontWeight: '500' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'block', padding: '14px', background: '#25D366', color: 'white', borderRadius: '6px', textDecoration: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '16px', marginBottom: '12px' }}
          >
            Contact on WhatsApp
          </a>

          <Link
            href={`/stores/${product.stores?.id}`}
            style={{ display: 'block', padding: '12px', border: '1px solid var(--border)', borderRadius: '6px', textDecoration: 'none', textAlign: 'center', color: 'var(--text)', fontSize: '14px' }}
          >
            View Store: {product.stores?.store_name}
          </Link>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Description</h2>
          <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{product.description}</p>
        </div>
      )}
    </div>
  )
}