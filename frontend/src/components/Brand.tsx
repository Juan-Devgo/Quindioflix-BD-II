import type { CSSProperties } from 'react'

export type BrandSize = 'sm' | 'md' | 'lg'

interface BrandProps {
  size?: BrandSize
  subtitle?: string
}

export function Brand({ size = 'md', subtitle }: BrandProps) {
  const fontSize = size === 'lg' ? 30 : size === 'sm' ? 16 : 22
  const markSize = size === 'lg' ? 36 : 28
  const markStyle: CSSProperties = { width: markSize, height: markSize }

  return (
    <div className="brand" style={{ fontSize }}>
      <span className="brand-mark" style={markStyle} />
      <span>
        quindio<strong>flix</strong>
        {subtitle && (
          <span style={{ color: 'var(--fg-3)', fontSize: 14, marginLeft: 10 }}>
            / {subtitle}
          </span>
        )}
      </span>
    </div>
  )
}

export default Brand
