import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('store_id', store?.id)
    .single()

  if (!store) {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Dashboard — laptopsellers</h1>
        <p>No store found for your account. Please contact support.</p>
        <LogoutButton />
      </div>
    )
  }

  if (store.status === 'pending') {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Dashboard — laptopsellers</h1>
        <div style={{ border: '1px solid #ffc107', background: '#fff8e1', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px' }}>⏳ Application Under Review</h2>
          <p style={{ margin: 0 }}>Your store <strong>{store.store_name}</strong> has been submitted and is waiting for admin approval. You will be able to list products once approved.</p>
        </div>
        <LogoutButton />
      </div>
    )
  }

  if (store.status === 'inactive') {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Dashboard — laptopsellers</h1>
        <div style={{ border: '1px solid #dc3545', background: '#fdf2f2', padding: '20px', borderRadius: '6px', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px' }}>🚫 Store Deactivated</h2>
          <p style={{ margin: 0 }}>Your store <strong>{store.store_name}</strong> has been deactivated. Please contact the admin at alamlaptopsellers@gmail.com.</p>
        </div>
        <LogoutButton />
      </div>
    )
  }

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('store_id', store.id)

  return (
    <div style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Dashboard — {store.store_name}</h1>
        <LogoutButton />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{productCount ?? 0}</div>
          <div>Your Products</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: subscription?.status === 'active' ? 'green' : '#999' }}>
            {subscription?.status === 'active' ? '✅ Active' : 'No Subscription'}
          </div>
          <div>Subscription</div>
          {subscription?.current_period_end && (
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Renews: {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '16px' }}>
        <Link href="/dashboard/products" style={{ padding: '10px 20px', background: '#000', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}>
          Manage Products
        </Link>
        <Link href="/" style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none' }}>
          View Public Site
        </Link>
      </nav>
    </div>
  )
}