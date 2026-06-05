import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect('/login')
  }

  const [{ count: totalStores }, { count: pendingStores }, { count: approvedStores }, { count: totalProducts }] = await Promise.all([
    supabase.from('stores').select('*', { count: 'exact', head: true }),
    supabase.from('stores').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('stores').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Dashboard — laptopsellers</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', margin: '24px 0' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalStores ?? 0}</div>
          <div>Total Stores</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'orange' }}>{pendingStores ?? 0}</div>
          <div>Pending Applications</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'green' }}>{approvedStores ?? 0}</div>
          <div>Approved Stores</div>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '6px' }}>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{totalProducts ?? 0}</div>
          <div>Total Products</div>
        </div>
      </div>

      <nav style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
        <Link href="/admin/stores">Manage Stores</Link>
        <Link href="/">View Public Site</Link>
      </nav>
    </div>
  )
}