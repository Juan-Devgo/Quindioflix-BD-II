import type { IconComponent } from './icons/Icon'

interface EmptyProps {
  icon?: IconComponent
  title: string
  hint?: string
}

export function Empty({ icon: Ic, title, hint }: EmptyProps) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--fg-3)' }}>
      {Ic && <Ic style={{ width: 40, height: 40, opacity: 0.4, marginBottom: 12 }} />}
      <div style={{ fontSize: 16, color: 'var(--fg-2)', marginBottom: 4 }}>{title}</div>
      {hint && <div style={{ fontSize: 13 }}>{hint}</div>}
    </div>
  )
}
