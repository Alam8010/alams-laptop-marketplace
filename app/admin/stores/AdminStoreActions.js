'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminStoreActions({ storeId, currentStatus }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus) {
    setLoading(true)
    await fetch(`/api/admin/stores/${storeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {currentStatus !== 'approved' && (
        <button
          onClick={() => updateStatus('approved')}
          disabled={loading}
          style={{ padding: '6px 12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Approve
        </button>
      )}
      {currentStatus !== 'inactive' && (
        <button
          onClick={() => updateStatus('inactive')}
          disabled={loading}
          style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Deactivate
        </button>
      )}
      {currentStatus !== 'pending' && (
        <button
          onClick={() => updateStatus('pending')}
          disabled={loading}
          style={{ padding: '6px 12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Set Pending
        </button>
      )}
    </div>
  )
}