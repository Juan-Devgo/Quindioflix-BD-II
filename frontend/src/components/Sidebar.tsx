import type { ReactNode } from 'react'
import { Brand } from './Brand'
import type { IconComponent } from './icons/Icon'

export interface SidebarSection {
  section: string
}
export interface SidebarLink {
  id: string
  label: string
  icon?: IconComponent
  badge?: number | string
}
export type SidebarItem = SidebarSection | SidebarLink

interface SidebarProps {
  items: Array<SidebarItem>
  active: string
  onChange: (id: string) => void
  footer?: ReactNode
  brandSubtitle?: string
}

const isSection = (it: SidebarItem): it is SidebarSection =>
  (it as SidebarSection).section !== undefined

export function Sidebar({ items, active, onChange, footer, brandSubtitle }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div style={{ padding: '0 8px 16px' }}>
        <Brand size="sm" subtitle={brandSubtitle} />
      </div>
      {items.map((it, i) => {
        if (isSection(it)) {
          return (
            <div key={i} className="nav-section">
              {it.section}
            </div>
          )
        }
        const Ic = it.icon
        return (
          <div
            key={i}
            className={'nav-item ' + (active === it.id ? 'active' : '')}
            onClick={() => onChange(it.id)}
          >
            {Ic && <Ic />}
            <span>{it.label}</span>
            {it.badge !== undefined && it.badge !== null && it.badge !== '' && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'var(--accent)',
                  color: 'oklch(0.18 0.01 60)',
                  padding: '1px 7px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {it.badge}
              </span>
            )}
          </div>
        )
      })}
      <div style={{ flex: 1 }} />
      {footer}
    </aside>
  )
}
