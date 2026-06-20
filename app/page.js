import { createClient } from '@supabase/supabase-js'
import ProductCard from './components/ProductCard'
import SearchBar from './components/SearchBar'
import Link from 'next/link'

const BRANDS           = ['Dell','HP','Lenovo','Apple','Asus','Acer','MSI','Samsung','Toshiba','Other']
const RAM_OPTIONS      = ['4GB','8GB','12GB','16GB','32GB','64GB']
const STORAGE_OPTIONS  = ['128GB','256GB','512GB','1TB','2TB']
const CONDITIONS       = ['New','Like New','Good','Fair']
const PROCESSOR_BRANDS = ['Intel','AMD']
const PROCESSOR_MODELS = ['Core i3','Core i5','Core i7','Core i9','Ryzen 3','Ryzen 5','Ryzen 7','Ryzen 9','Celeron','Pentium','M1','M2','M3']
const GENERATIONS      = ['7th Gen','8th Gen','9th Gen','10th Gen','11th Gen','12th Gen','13th Gen','14th Gen']
const SCREEN_SIZES     = ['11-12 inch','13-14 inch','15-16 inch','17 inch+']
const GPU_TYPES        = ['Integrated','Dedicated']
const GPU_BRANDS       = ['Nvidia','AMD Radeon','Intel Arc']
const USE_CASES        = ['Gaming','Business','Student','General Use','Workstation']
const DISPLAY_TYPES    = ['HD (720p)','FHD (1080p)','QHD (1440p)','4K (2160p)']

export default async function HomePage({ searchParams }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const params = await searchParams

  let query = supabase
    .from('products')
    .select('id, title, brand, price, ram, storage, condition, images, store_id, processor_brand, processor_model, generation, screen_size, gpu, gpu_brand, use_case, display_type, stores(id, store_name, status)')
    .order('created_at', { ascending: false })

  if (params.search)          query = query.ilike('title', `%${params.search}%`)
  if (params.brand)           query = query.eq('brand', params.brand)
  if (params.ram)             query = query.eq('ram', params.ram)
  if (params.storage)         query = query.eq('storage', params.storage)
  if (params.condition)       query = query.eq('condition', params.condition)
  if (params.min_price)       query = query.gte('price', params.min_price)
  if (params.max_price)       query = query.lte('price', params.max_price)
  if (params.processor_brand) query = query.eq('processor_brand', params.processor_brand)
  if (params.processor_model) query = query.eq('processor_model', params.processor_model)
  if (params.generation)      query = query.eq('generation', params.generation)
  if (params.screen_size)     query = query.eq('screen_size', params.screen_size)
  if (params.gpu)             query = query.eq('gpu', params.gpu)
  if (params.gpu_brand)       query = query.eq('gpu_brand', params.gpu_brand)
  if (params.use_case)        query = query.eq('use_case', params.use_case)
  if (params.display_type)    query = query.eq('display_type', params.display_type)

  const { data: allProducts } = await query
  const products = (allProducts || []).filter(p => p.stores?.status === 'approved')

  const hasFilters = params.search || params.brand || params.ram || params.storage || params.condition || params.min_price || params.max_price || params.processor_brand || params.processor_model || params.generation || params.screen_size || params.gpu || params.gpu_brand || params.use_case || params.display_type

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
            { name: 'brand',           label: 'Brand',      options: BRANDS },
            { name: 'processor_brand', label: 'Processor',  options: PROCESSOR_BRANDS },
            { name: 'processor_model', label: 'Model',      options: PROCESSOR_MODELS },
            { name: 'generation',      label: 'Generation', options: GENERATIONS },
            { name: 'ram',             label: 'RAM',        options: RAM_OPTIONS },
            { name: 'storage',         label: 'Storage',    options: STORAGE_OPTIONS },
            { name: 'screen_size',     label: 'Screen',     options: SCREEN_SIZES },
            { name: 'gpu',             label: 'GPU',        options: GPU_TYPES },
            { name: 'gpu_brand',       label: 'GPU Brand',  options: GPU_BRANDS },
            { name: 'use_case',        label: 'Use Case',   options: USE_CASES },
            { name: 'display_type',    label: 'Display',    options: DISPLAY_TYPES },
            { name: 'condition',       label: 'Condition',  options: CONDITIONS },
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
