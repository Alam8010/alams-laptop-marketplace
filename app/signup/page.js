'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error: signupError } = await supabase.auth.signUp({ email, password })

    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    const userId = data.user?.id

    if (userId) {
      await supabase.from('profiles').update({ full_name: fullName }).eq('id', userId)
      await supabase.from('stores').insert({
        owner_id: userId,
        store_name: storeName,
        whatsapp_number: whatsapp,
        status: 'pending',
      })
    }

    setLoading(false)
    setDone(true)
  }

  if (done) {
    return (
      <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Check your email</h2>
        <p>We sent a confirmation link to <strong>{email}</strong>.</p>
        <p>Once confirmed, your store application will be reviewed by the admin.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Apply for a Store — laptopsellers</h1>
      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: '12px' }}>
          <label>Full Name</label><br />
          <input value={fullName} onChange={e => setFullName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Store Name</label><br />
          <input value={storeName} onChange={e => setStoreName(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>WhatsApp Number (with country code, e.g. 923001234567)</label><br />
          <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}