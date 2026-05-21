import type { ReactNode } from 'react'
import { Icon } from '../../../components/icons/Icon'

interface PlanFeatureProps {
  ok: boolean
  children: ReactNode
}

export function PlanFeature({ ok, children }: PlanFeatureProps) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 14,
        color: ok ? 'var(--fg-2)' : 'var(--fg-4)',
      }}
    >
      {ok ? (
        <Icon.check style={{ width: 16, height: 16, color: 'var(--sage)', flexShrink: 0 }} />
      ) : (
        <Icon.close style={{ width: 16, height: 16, color: 'var(--fg-4)', flexShrink: 0 }} />
      )}
      <span style={{ textDecoration: ok ? 'none' : 'line-through' }}>{children}</span>
    </li>
  )
}
