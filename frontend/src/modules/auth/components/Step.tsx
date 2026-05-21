import { Icon } from '../../../components/icons/Icon'

interface StepProps {
  n: number
  active: boolean
  done: boolean
  label: string
}

export function Step({ n, active, done, label }: StepProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: active || done ? 1 : 0.5 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: done ? 'var(--sage)' : active ? 'var(--accent)' : 'var(--bg-3)',
          color: 'oklch(0.16 0.01 60)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {done ? <Icon.check style={{ width: 14, height: 14 }} /> : n}
      </div>
      <div style={{ fontSize: 14, color: active ? 'var(--fg)' : 'var(--fg-2)' }}>{label}</div>
    </div>
  )
}
