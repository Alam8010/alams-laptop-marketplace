import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default async function StorePage({ params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('id', id)
    .eq('status', 'approved')
    .single()

  if (!store) notFound()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', id)
    .order('created_at', { ascending: false })

  const waLink = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent('Hi, I found your store on laptopsellers and I have a question.')}`

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>

      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '14px' }}>
          ← All listings
        </Link>
      </div>

      {/* Store Info */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '24px', marginBottom: '32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '24px', color: 'var(--text)' }}>
            {store.store_name}
          </h1>
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>
            Member since {new Date(store.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' })}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            {products?.length ?? 0} listing{products?.length !== 1 ? 's' : ''}
          </div>
          {store.phone_number && (
            <div style={{ fontSize: '14px', color: 'var(--text)', marginTop: '4px' }}>
              📞 {store.phone_number}
            </div>
          )}
          {store.address && (
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
              📍 {store.address}
            </div>
          )}
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '12px 20px', background: '#25D366', color: 'white',
            borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', flexShrink: 0
          }}
        >
          💬 WhatsApp Store
        </a>
      </div>

      {/* Products */}
      {(!products || products.length === 0) ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
          This store has no listings yet.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '160px', background: 'var(--bg)', position: 'relative' }}>
                  {product.images && product.images.length > 0 ? (
                    <Image src={product.images[0]} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="240px" />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px' }}>💻</div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: 'var(--text)' }}>
                    {product.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {product.ram} · {product.storage} · {product.condition}
                  </div>
                  <div style={{ fontWeight: 'bold', marginTop: '6px', color: 'var(--text)' }}>
                    PKR {Number(product.price).toLocaleString()}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
