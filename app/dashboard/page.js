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
        <h1 style={{ color: 'var(--text)' }}>Dashboard — laptopsellers</h1>
        <p style={{ color: 'var(--text-muted)' }}>No store found for your account. Please contact support.</p>
        <LogoutButton />
      </div>
    )
  }

  if (store.status === 'pending') {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text)', marginBottom: '24px' }}>Dashboard — laptopsellers</h1>
        <div className="alert alert-warning">
          <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>⏳ Application Under Review</h2>
          <p style={{ margin: 0 }}>Your store <strong>{store.store_name}</strong> has been submitted and is waiting for admin approval. You will be able to list products once approved.</p>
        </div>
        <LogoutButton />
      </div>
    )
  }

  if (store.status === 'inactive') {
    return (
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: 'var(--text)', marginBottom: '24px' }}>Dashboard — laptopsellers</h1>
        <div className="alert alert-error">
          <h2 style={{ margin: '0 0 8px', fontSize: '18px' }}>🚫 Store Deactivated</h2>
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
        <h1 style={{ margin: 0, color: 'var(--text)' }}>Dashboard — {store.store_name}</h1>
        <LogoutButton />
      </div>

      {/* Store Info Summary */}
      <div className="stat-card" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Store</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>WhatsApp: </span>
            <span style={{ color: 'var(--text)' }}>{store.whatsapp_number || '—'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Phone: </span>
            <span style={{ color: 'var(--text)' }}>{store.phone_number || '—'}</span>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <span style={{ color: 'var(--text-muted)' }}>Address: </span>
            <span style={{ color: 'var(--text)' }}>{store.address || '—'}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-number">{productCount ?? 0}</div>
          <div className="stat-label">Your Products</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: subscription?.status === 'active' ? 'var(--success)' : 'var(--text-muted)', marginBottom: '6px' }}>
            {subscription?.status === 'active' ? '✅ Active' : 'No Subscription'}
          </div>
          <div className="stat-label">Subscription</div>
          {subscription?.current_period_end && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Renews: {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/products" className="btn-primary" style={{ width: 'auto', textDecoration: 'none', display: 'inline-block' }}>
          Manage Products
        </Link>
        <Link href="/dashboard/edit-store" className="btn-secondary" style={{ textDecoration: 'none' }}>
          Edit Store Info
        </Link>
        <Link href="/" className="btn-outline" style={{ textDecoration: 'none' }}>
          View Public Site
        </Link>
      </nav>
    </div>
  )
}
