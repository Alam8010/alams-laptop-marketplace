import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProductForm from '../ProductForm'

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('id, status')
    .eq('owner_id', user.id)
    .single()

  if (!store || store.status !== 'approved') redirect('/dashboard')

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Add New Product</h1>
      <a href="/dashboard/products" style={{ display: 'inline-block', marginBottom: '24px' }}>← Back to Products</a>
      <ProductForm storeId={store.id} />
    </div>
  )
}