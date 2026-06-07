import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminStoreActions from './AdminStoreActions'

export default async function AdminStoresPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== 'alamlaptopsellers@gmail.com') {
    redirect('/login')
  }

  const { data: stores } = await supabase
    .from('stores')
    .select('id, store_name, whatsapp_number, status, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Manage Stores</h1>
      <a href="/admin" style={{ display: 'inline-block', marginBottom: '24px' }}>← Back to Dashboard</a>

      {stores && stores.length === 0 && <p>No stores yet.</p>}

      {stores && stores.map(store => (
        <div key={store.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong>{store.store_name}</strong>
              <div style={{ color: '#555', fontSize: '14px', marginTop: '4px' }}>
                Owner: {store.profiles?.full_name} ({store.profiles?.email})
              </div>
              <div style={{ fontSize: '14px', marginTop: '2px' }}>
                WhatsApp: {store.whatsapp_number}
              </div>
              <div style={{ fontSize: '14px', marginTop: '2px' }}>
                Applied: {new Date(store.created_at).toLocaleDateString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
                marginBottom: '12px',
                background: store.status === 'approved' ? '#d4edda' : store.status === 'pending' ? '#fff3cd' : '#f8d7da',
                color: store.status === 'approved' ? '#155724' : store.status === 'pending' ? '#856404' : '#721c24',
              }}>
                {store.status}
              </span>
              <AdminStoreActions storeId={store.id} currentStatus={store.status} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}