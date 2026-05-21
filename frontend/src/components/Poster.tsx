import type { CSSProperties } from 'react'
import type { Contenido } from '../api/types'

type PosterSize = 'sm' | 'md' | 'lg'

interface PosterProps {
  item: Contenido
  size?: PosterSize
  onClick?: () => void
  showProgress?: boolean
  progress?: number
}

export function Poster({ item, size = 'md', onClick, showProgress, progress }: PosterProps) {
  const w = size === 'lg' ? 200 : size === 'sm' ? 130 : 170
  const h = size === 'lg' ? 290 : size === 'sm' ? 190 : 250

  const style = {
    width: w,
    height: h,
    cursor: onClick ? 'pointer' : 'default',
    '--gradient': item.gradient,
  } as CSSProperties

  return (
    <div className="poster" onClick={onClick} style={style}>
      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
        {item.original && (
          <span
            className="chip accent"
            style={{
              padding: '3px 8px',
              fontSize: 10,
              background: 'oklch(0.82 0.135 75 / 0.9)',
              color: 'oklch(0.16 0.01 60)',
              border: 'none',
              fontWeight: 600,
            }}
          >
            ORIGINAL
          </span>
        )}
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <span className="mono" style={{ fontSize: 10, color: 'oklch(1 0 0 / 0.7)' }}>
          {item.clasif}
        </span>
      </div>
      <div>
        <div className="poster-title">{item.titulo}</div>
        <div className="poster-meta">
          {item.tipo} · {item.anio}
        </div>
      </div>
      {showProgress && progress !== undefined && (
        <div className="progress" style={{ position: 'absolute', left: 14, right: 14, bottom: 6 }}>
          <div className="progress-bar" style={{ width: progress + '%' }} />
        </div>
      )}
    </div>
  )
}
