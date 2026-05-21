import { useRef } from 'react'
import { Poster } from '../../../../components/Poster'
import type { Contenido } from '../../../../api/types'

interface RowProps {
  title: string
  items: Array<Contenido>
  onOpen: (c: Contenido) => void
  getProgress?: (c: Contenido) => number | undefined
}

export function Row({ title, items, onOpen, getProgress }: RowProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  if (!items.length) return null
  return (
    <section style={{ marginBottom: 36 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <h2 className="display" style={{ fontSize: 26, margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => ref.current?.scrollBy({ left: -600, behavior: 'smooth' })}
          >
            ‹
          </button>
          <button
            className="btn btn-icon btn-ghost"
            onClick={() => ref.current?.scrollBy({ left: 600, behavior: 'smooth' })}
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={ref}
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}
      >
        {items.map((item) => {
          const progress = getProgress?.(item)
          return (
            <div key={item.id} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
              <Poster
                item={item}
                onClick={() => onOpen(item)}
                showProgress={progress !== undefined}
                progress={progress}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
