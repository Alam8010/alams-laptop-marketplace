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

  const waLink = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(`Hi, I found your store on laptopsellers and I have a question.`)}`

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#000', fontWeight: 'bold', fontSize: '20px' }}>💻 laptopsellers</Link>
        <Link href="/" style={{ textDecoration: 'none', color: '#555' }}>← All listings</Link>
      </div>

      {/* Store Info */}
      <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '8px', padding: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: '24px' }}>{store.store_name}</h1>
          <div style={{ color: '#888', fontSize: '14px' }}>
            Member since {new Date(store.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' })}
          </div>
          <div style={{ marginTop: '6px', fontSize: '14px', color: '#555' }}>
            {products?.length ?? 0} listing{products?.length !== 1 ? 's' : ''}
          </div>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ padding: '12px 20px', background: '#25D366', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}
        >
           WhatsApp Store
        </a>
      </div>

      {/* Products */}
      {(!products || products.length === 0) ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '40px 0' }}>This store has no listings yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '160px', background: '#f5f5f5', position: 'relative' }}>
                  {product.images && product.images.length > 0 ? (
                    <Image src={product.images[0]} alt={product.title} fill style={{ objectFit: 'cover' }} sizes="240px" />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '36px' }}>💻</div>
                  )}
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px' }}>{product.title}</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>{product.ram} · {product.storage} · {product.condition}</div>
                  <div style={{ fontWeight: 'bold', marginTop: '6px' }}>PKR {Number(product.price).toLocaleString()}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}