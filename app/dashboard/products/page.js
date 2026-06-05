import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteProductButton from './DeleteProductButton'

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id, status')
    .eq('owner_id', user.id)
    .single()

  if (!store || store.status !== 'approved') redirect('/dashboard')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>My Products</h1>
        <Link href="/dashboard/products/new" style={{ padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          + Add Product
        </Link>
      </div>
      <a href="/dashboard" style={{ display: 'inline-block', marginBottom: '24px' }}>← Back to Dashboard</a>

      {(!products || products.length === 0) && (
        <p>No products yet. Add your first one!</p>
      )}

      {products && products.map(product => (
        <div key={product.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong>{product.title}</strong>
              <div style={{ fontSize: '14px', color: '#555', marginTop: '4px' }}>
                {product.brand} · {product.ram} RAM · {product.storage} · {product.condition}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>
                PKR {Number(product.price).toLocaleString()}
              </div>
              {product.images && product.images.length > 0 && (
                <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                  {product.images.length} image{product.images.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                href={`/dashboard/products/${product.id}/edit`}
                style={{ padding: '6px 12px', background: '#0070f3', color: 'white', borderRadius: '4px', textDecoration: 'none', textAlign: 'center' }}
              >
                Edit
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}