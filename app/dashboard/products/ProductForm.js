'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const BRANDS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'MSI', 'Samsung', 'Toshiba', 'Other']
const RAM_OPTIONS = ['4GB', '8GB', '12GB', '16GB', '32GB', '64GB']
const STORAGE_OPTIONS = ['128GB', '256GB', '512GB', '1TB', '2TB']
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair']

export default function ProductForm({ storeId, product }) {
  const router = useRouter()
  const isEdit = !!product

  const [title, setTitle] = useState(product?.title ?? '')
  const [brand, setBrand] = useState(product?.brand ?? '')
  const [price, setPrice] = useState(product?.price ?? '')
  const [ram, setRam] = useState(product?.ram ?? '')
  const [storage, setStorage] = useState(product?.storage ?? '')
  const [condition, setCondition] = useState(product?.condition ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [images, setImages] = useState(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 6) {
      setError('Maximum 6 images allowed')
      return
    }
    setUploading(true)
    setError('')
    const uploaded = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.url) uploaded.push(data.url)
      else setError('One or more images failed to upload')
    }
    setImages(prev => [...prev, ...uploaded])
    setUploading(false)
  }

  function removeImage(index) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = { title, brand, price: parseFloat(price), ram, storage, condition, description, images }

    let res
    if (isEdit) {
      res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error: insertError } = await supabase.from('products').insert({ ...payload, store_id: storeId })
      if (insertError) {
        setError(insertError.message)
        setSaving(false)
        return
      }
      router.push('/dashboard/products')
      return
    }

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setSaving(false)
      return
    }

    router.push('/dashboard/products')
  }

  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '14px' }
  const fieldStyle = { marginBottom: '16px' }

  return (
    <form onSubmit={handleSubmit}>
      <div style={fieldStyle}>
        <label style={labelStyle}>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} placeholder="e.g. Dell Latitude 5520 Core i5" />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Brand</label>
        <select value={brand} onChange={e => setBrand(e.target.value)} required style={inputStyle}>
          <option value="">Select brand</option>
          {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Price (PKR)</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" style={inputStyle} placeholder="e.g. 85000" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>RAM</label>
          <select value={ram} onChange={e => setRam(e.target.value)} required style={inputStyle}>
            <option value="">Select RAM</option>
            {RAM_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Storage</label>
          <select value={storage} onChange={e => setStorage(e.target.value)} required style={inputStyle}>
            <option value="">Select storage</option>
            {STORAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Condition</label>
        <select value={condition} onChange={e => setCondition(e.target.value)} required style={inputStyle}>
          <option value="">Select condition</option>
          {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} style={inputStyle} placeholder="Describe the laptop specs, any issues, included accessories..." />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Images (max 6)</label>
        {images.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {images.map((url, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img src={url} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '12px', lineHeight: '20px', padding: 0 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {images.length < 6 && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={uploading}
            style={{ display: 'block' }}
          />
        )}
        {uploading && <p style={{ color: '#666', fontSize: '14px' }}>Uploading images...</p>}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={saving || uploading} style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
        {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Product'}
      </button>
    </form>
  )
}