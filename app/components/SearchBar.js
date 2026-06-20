'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SearchBar({ initialValue = '', large = false }) {
  const [value, setValue] = useState(initialValue)
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (trimmed) {
      router.push(`/?search=${encodeURIComponent(trimmed)}`)
    } else {
      router.push('/')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', width: '100%' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        {/* Search icon */}
        <svg
          style={{
            position: 'absolute', left: large ? '16px' : '12px',
            top: '50%', transform: 'translateY(-50%)',
            color: '#475569', pointerEvents: 'none',
            width: large ? '20px' : '16px', height: large ? '20px' : '16px',
          }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
        </svg>

        <input
          type="text"
          name="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={large ? 'Search by model, brand or specs...' : 'Search laptops...'}
          style={{
            width: '100%',
            padding: large ? '14px 16px 14px 48px' : '9px 12px 9px 36px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'var(--input-bg)',
            color: 'var(--text)',
            fontSize: large ? '16px' : '13px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={e => e.target.style.borderColor = '#3b82f6'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />

        {/* Clear button */}
        {value && (
          <button
            type="button"
            onClick={() => { setValue(''); router.push('/') }}
            style={{
              position: 'absolute', right: '10px', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#475569', padding: '2px', lineHeight: 1,
              fontSize: '16px',
            }}
          >
            x
          </button>
        )}
      </div>

      <button
        type="submit"
        style={{
          padding: large ? '14px 28px' : '9px 18px',
          background: '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: large ? '15px' : '13px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        Search
      </button>
    </form>
  )
}
