import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage({ searchParams }) {
  const supabase = await createClient()
  const params = await searchParams

  let query = supabase
    .from('products')
    .select('id, title, brand, price, ram, storage, condition, images, store_id, stores!inner(id, store_name, status)')
    .eq('stores.status', 'approved')
    .order('created_at', { ascending: false })

  if (params.brand) query = query.eq('brand', params.brand)
  if (params.ram) query = query.eq('ram', params.ram)
  if (params.storage) query = query.eq('storage', params.storage)
  if (params.condition) query = query.eq('condition', params.condition)
  if (params.min_price) query = query.gte('price', params.min_price)
  if (params.max_price) query = query.lte('price', params.max_price)

  const { data: products } = await query

  const BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung', 'Toshiba', 'Other']
  const RAM_OPTIONS = ['4GB', '8GB', '12GB', '16GB', '32GB', '64GB']
  const STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB', '2TB']
  const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>💻 laptopsellers</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/login" style={{ textDecoration: 'none', color: '#333' }}>Login</Link>
          <Link href="/signup" style={{ textDecoration: 'none', padding: '8px 16px', background: '#000', color: '#fff', borderRadius: '4px' }}>Sell a Laptop</Link>
        </div>
      </div>

      {/* Filters */}
      <form method="GET" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px', padding: '16px', background: '#f9f9f9', borderRadius: '6px' }}>
        <select name="brand" defaultValue={params.brand ?? ''} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Brands</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select name="ram" defaultValue={params.ram ?? ''} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All RAM</option>
          {RAM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select name="storage" defaultValue={params.storage ?? ''} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Storage</option>
          {STORAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="condition" defaultValue={params.condition ?? ''} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Conditions</option>
          {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="min_price" type="number" placeholder="Min Price (PKR)" defaultValue={params.min_price ?? ''} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }} />
        <input name="max_price" type="number" placeholder="Max Price (PKR)" defaultValue={params.max_price ?? ''} style={{ padding: '7px', borderRadius: '4px', border: '1px solid #ccc', width: '150px' }} />
        <button type="submit" style={{ padding: '7px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Filter</button>
        <a href="/" style={{ padding: '7px 16px', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: '#333' }}>Clear</a>
      </form>

      {/* Results count */}
      <p style={{ color: '#666', marginBottom: '16px', fontSize: '14px' }}>
        {products ? `${products.length} laptop${products.length !== 1 ? 's' : ''} found` : 'Loading...'}
      </p>

      {/* Product Grid */}
      {(!products || products.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
          <p style={{ fontSize: '18px' }}>No laptops found matching your filters.</p>
          <a href="/">Clear filters</a>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {products.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
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
          ))}
        </div>
      )}
    </div>
  )
}