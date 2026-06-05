import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductForm from '../../ProductForm'

export default async function EditProductPage({ params }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id, status')
    .eq('owner_id', user.id)
    .single()

  if (!store || store.status !== 'approved') redirect('/dashboard')

  const { id } = await params
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('store_id', store.id)
    .single()

  if (!product) redirect('/dashboard/products')

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Product</h1>
      <a href="/dashboard/products" style={{ display: 'inline-block', marginBottom: '24px' }}>← Back to Products</a>
      <ProductForm storeId={store.id} product={product} />
    </div>
  )
}