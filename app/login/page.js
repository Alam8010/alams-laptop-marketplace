'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    if (email === 'alamlaptopsellers@gmail.com') {
      router.push('/admin')
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login — laptopsellers</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '16px' }}>Want to sell? <a href="/signup">Apply for a store</a></p>
    </div>
  )
}