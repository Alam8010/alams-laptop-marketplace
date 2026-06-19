'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images, title }) {
  const [selected, setSelected] = useState(0)
  const touchStartX = useRef(null)

  if (!images || images.length === 0) {
    return (
      <div style={{
        width: '100%', height: '280px', background: 'var(--surface)',
        border: '1px solid var(--border)', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px'
      }}>
        💻
      </div>
    )
  }

  const goTo = (index) => {
    setSelected((index + images.length) % images.length)
  }

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? selected + 1 : selected - 1)
    }
    touchStartX.current = null
  }

  return (
    <div>
      {/* Main image */}
      <div
        style={{
          width: '100%', height: '320px', position: 'relative',
          borderRadius: '8px', overflow: 'hidden', marginBottom: '10px',
          background: 'var(--surface)', userSelect: 'none'
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={images[selected]}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="600px"
          priority
        />

        {images.length > 1 && (
          <>
            {/* Left arrow */}
            <button
              onClick={() => goTo(selected - 1)}
              style={{
                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
                borderRadius: '50%', width: '38px', height: '38px', fontSize: '22px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 2, lineHeight: 1
              }}
            >‹</button>

            {/* Right arrow */}
            <button
              onClick={() => goTo(selected + 1)}
              style={{
                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
                borderRadius: '50%', width: '38px', height: '38px', fontSize: '22px',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', zIndex: 2, lineHeight: 1
              }}
            >›</button>

            {/* Dot indicators */}
            <div style={{
              position: 'absolute', bottom: '10px', left: '50%',
              transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 2
            }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: i === selected ? '#fff' : 'rgba(255,255,255,0.45)',
                    cursor: 'pointer', transition: 'background 0.15s'
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {images.map((url, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: '68px', height: '68px', position: 'relative',
                borderRadius: '6px', overflow: 'hidden', cursor: 'pointer',
                border: i === selected ? '2px solid var(--primary)' : '1px solid var(--border)',
                opacity: i === selected ? 1 : 0.65,
                transition: 'opacity 0.15s, border 0.15s', flexShrink: 0
              }}
            >
              <Image src={url} alt="" fill style={{ objectFit: 'cover' }} sizes="68px" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
