import { createClient } from '@supabase/supabase-js'
import ProductCard from '@/app/components/ProductCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

export default async function StorePage({ params, searchParams }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { id } = await params
  const sp = await searchParams
  const storeUrl = `/stores/${id}`

  const { data: store } = await supabase
    .from('stores')
    .select('id, store_name, whatsapp_number, phone_number, address, created_at, status')
    .eq('id', id)
    .single()

  if (!store || store.status !== 'approved') notFound()

  const { count: totalListings } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', id)

  let query = supabase
    .from('products')
    .select('id, title, brand, price, ram, storage, condition, images, store_id, processor_brand, processor_model, generation, screen_size, gpu, gpu_brand, use_case, display_type')
    .eq('store_id', id)
    .order('created_at', { ascending: false })

  if (sp.search)          query = query.ilike('title', `%${sp.search}%`)
  if (sp.brand)           query = query.eq('brand', sp.brand)
  if (sp.ram)             query = query.eq('ram', sp.ram)
  if (sp.storage)         query = query.eq('storage', sp.storage)
  if (sp.condition)       query = query.eq('condition', sp.condition)
  if (sp.min_price)       query = query.gte('price', sp.min_price)
  if (sp.max_price)       query = query.lte('price', sp.max_price)
  if (sp.processor_brand) query = query.eq('processor_brand', sp.processor_brand)
  if (sp.processor_model) query = query.eq('processor_model', sp.processor_model)
  if (sp.generation)      query = query.eq('generation', sp.generation)
  if (sp.screen_size)     query = query.eq('screen_size', sp.screen_size)
  if (sp.gpu)             query = query.eq('gpu', sp.gpu)
  if (sp.gpu_brand)       query = query.eq('gpu_brand', sp.gpu_brand)
  if (sp.use_case)        query = query.eq('use_case', sp.use_case)
  if (sp.display_type)    query = query.eq('display_type', sp.display_type)

  const { data: products } = await query

  const hasFilters = sp.search || sp.brand || sp.ram || sp.storage || sp.condition ||
    sp.min_price || sp.max_price || sp.processor_brand || sp.processor_model ||
    sp.generation || sp.screen_size || sp.gpu || sp.gpu_brand || sp.use_case || sp.display_type

  const memberSince = new Date(store.created_at).toLocaleDateString('en-PK', {
    month: 'long', year: 'numeric',
  })

  const whatsappMsg = encodeURIComponent(`Hi, I found your store "${store.store_name}" on laptopsellers.`)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* STORE HEADER */}
      <div style={{
        background: 'linear-gradient(180deg, #020c1b 0%, #051124 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '36px 16px',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Link href="/" style={{
            color: 'var(--text-muted)', fontSize: '13px',
            textDecoration: 'none', marginBottom: '16px', display: 'inline-block',
          }}>
            Back to all laptops
          </Link>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <h1 style={{
                fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: '800',
                color: '#e2e8f0', marginBottom: '10px',
              }}>
                {store.store_name}
              </h1>
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '16px',
                color: '#64748b', fontSize: '14px',
              }}>
                {store.phone_number && <span>Phone: {store.phone_number}</span>}
                {store.address && <span>Location: {store.address}</span>}
                <span>Member since {memberSince}</span>
                <span>{totalListings ?? 0} listing{totalListings !== 1 ? 's' : ''}</span>
              </div>
            </div>
            {store.whatsapp_number && (
              <a
                href={`https://wa.me/${store.whatsapp_number}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 22px',
                  background: '#25d366',
                  color: '#fff',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                }}
              >
                WhatsApp Store
              </a>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 16px' }}>

        {/* SEARCH + FILTER FORM */}
        <form method="GET" style={{
          display: 'flex', flexWrap: 'wrap', gap: '8px',
          marginBottom: '24px', padding: '14px 16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          alignItems: 'center',
        }}>
          <input
            name="search"
            type="text"
            placeholder="Search laptops..."
            defaultValue={sp.search ?? ''}
            style={{
              flex: '1 1 200px', padding: '8px 12px', borderRadius: '6px',
              border: '1px solid var(--border)', background: 'var(--input-bg)',
              color: 'var(--text)', fontSize: '13px',
            }}
          />

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
            <select key={name} name={name} defaultValue={sp[name] ?? ''} style={{
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
            defaultValue={sp.min_price ?? ''}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', width: '110px' }} />
          <input name="max_price" type="number" placeholder="Max (PKR)"
            defaultValue={sp.max_price ?? ''}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px', width: '110px' }} />

          <button type="submit" style={{
            padding: '8px 20px', background: 'var(--primary)', color: '#fff',
            border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: '600', fontSize: '13px',
          }}>
            Filter
          </button>

          {hasFilters && (
            <Link href={storeUrl} style={{
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
          {(products || []).length} laptop{(products || []).length !== 1 ? 's' : ''} found
          {hasFilters && (
            <span> &mdash; <Link href={storeUrl} style={{ color: 'var(--primary)' }}>Clear filters</Link></span>
          )}
        </p>

        {/* PRODUCT GRID */}
        {(products || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '16px', marginBottom: '12px' }}>No laptops match your filters.</p>
            <Link href={storeUrl} style={{ color: 'var(--primary)' }}>Clear all filters</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {(products || []).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
