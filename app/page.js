import { createClient } from '@supabase/supabase-js'
import ProductCard from './components/ProductCard'
import SearchBar from './components/SearchBar'
import Link from 'next/link'

const BRANDS          = ['Dell','HP','Lenovo','Apple','Asus','Acer','MSI','Samsung','Toshiba','Other']
const RAM_OPTIONS     = ['4GB','8GB','12GB','16GB','32GB','64GB']
const STORAGE_OPTIONS = ['128GB','256GB','512GB','1TB','2TB']
const CONDITIONS      = ['New','Like New','Good','Fair']

export default async function HomePage({ searchParams }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const params = await searchParams

  let query = supabase
    .from('products')
    .select('id, title, brand, price, ram, storage, condition, images, store_id, stores(id, store_name, status)')
    .order('created_at', { ascending: false })

  if (params.search)    query = query.ilike('title', `%${params.search}%`)
  if (params.brand)     query = query.eq('brand', params.brand)
  if (params.ram)       query = query.eq('ram', params.ram)
  if (params.storage)   query = query.eq('storage', params.storage)
  if (params.condition) query = query.eq('condition', params.condition)
  if (params.min_price) query = query.gte('price', params.min_price)
  if (params.max_price) query = query.lte('price', params.max_price)

  const { data: allProducts } = await query
  const products = (allProducts || []).filter(p => p.stores?.status === 'approved')

  const hasFilters = params.brand || params.ram || params.storage || params.condition || params.min_price || params.max_price

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* HERO */}
      {!hasFilters && (
        <div style={{
          background: 'linear-gradient(180deg, #020c1b 0%, #051124 60%, #020c1b 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '56px 16px 48px',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-block',
              background: '#0a1e3d',
              border: '1px solid #1e3a5f',
              borderRadius: '20px',
              padding: '4px 14px',
              fontSize: '12px',
              color: '#3b82f6',
              fontWeight: '600',
              letterSpacing: '0.5px',
              marginBottom: '20px',
              textTransform: 'uppercase',
            }}>
              Pakistan No.1 Laptop Marketplace
            </div>
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: '#e2e8f0',
              lineHeight: '1.15',
              marginBottom: '16px',
              letterSpacing: '-1px',
            }}>
              Find Your{' '}
              <span style={{ color: '#3b82f6' }}>Perfect Laptop</span>
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}>
              Browse thousands of laptops from verified sellers across Pakistan.
              New and used, all brands, all budgets.
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Dell','HP','Lenovo','Apple','Asus'].map(brand => (
                <Link key={brand} href={`/?brand=${brand}`} style={{
                  padding: '6px 16px',
                  background: '#0a1628',
                  border: '1px solid #1e3a5f',
                  borderRadius: '20px',
                  fontSize: '13px',
                  color: '#94a3b8',
                  textDecoration: 'none',
                }}>
                  {brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px' }}>

        {/* SEARCH BAR */}
        <div style={{ marginBottom: '16px' }}>
          <SearchBar initialValue={params.search ?? ''} />
        </div>

        {/* FILTER BAR */}
        <form method="GET" style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          marginBottom: '24px', padding: '14px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          alignItems: 'center',
        }}>
          {[
            { name: 'brand',     label: 'Brand',     options: BRANDS },
            { name: 'ram',       label: 'RAM',        options: RAM_OPTIONS },
            { name: 'storage',   label: 'Storage',    options: STORAGE_OPTIONS },
            { name: 'condition', label: 'Condition',  options: CONDITIONS },
          ].map(({ name, label, options }) => (
            <select key={name} name={name} defaultValue={params[name] ?? ''} style={{
              padding: '8px 12px', borderRadius: '6px',
              border: '1px solid var(--border)',
              background: 'var(--input-bg)', color: 'var(--text)',
              fontSize: '13px', cursor: 'pointer',
            }}>
              <option value="">All {label}s</option>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          <input name="min_price" type="number" placeholder="Min (PKR)"
            defaultValue={params.min_price ?? ''}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', width: '120px' }} />
          <input name="max_price" type="number" placeholder="Max (PKR)"
            defaultValue={params.max_price ?? ''}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', width: '120px' }} />
          <button type="submit" style={{
            padding: '8px 20px', background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
          }}>
            Filter
          </button>
          {hasFilters && (
            <Link href="/" style={{
              padding: '8px 16px', border: '1px solid var(--border)',
              borderRadius: '6px', textDecoration: 'none',
              color: 'var(--text-muted)', fontSize: '13px',
            }}>
              Clear
            </Link>
          )}
        </form>

        {/* RESULTS COUNT */}
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '13px' }}>
          {products.length} laptop{products.length !== 1 ? 's' : ''} found
          {hasFilters && <span> &mdash; <Link href="/" style={{ color: 'var(--primary)' }}>Clear filters</Link></span>}
        </p>

        {/* PRODUCT GRID */}
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '16px', marginBottom: '12px' }}>No laptops match your filters.</p>
            <Link href="/" style={{ color: 'var(--primary)' }}>Clear all filters</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
