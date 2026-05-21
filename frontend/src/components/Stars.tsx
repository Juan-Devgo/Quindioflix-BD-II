import { Icon } from './icons/Icon'

interface StarsProps {
  value: number
  max?: number
  size?: number
  onChange?: (n: number) => void
}

export function Stars({ value, max = 5, size = 14, onChange }: StarsProps) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value)
        return (
          <span
            key={i}
            style={{ cursor: onChange ? 'pointer' : 'default' }}
            className={filled ? '' : 'dim'}
            onClick={() => onChange && onChange(i + 1)}
          >
            <Icon.star style={{ width: size, height: size }} />
          </span>
        )
      })}
    </div>
  )
}
