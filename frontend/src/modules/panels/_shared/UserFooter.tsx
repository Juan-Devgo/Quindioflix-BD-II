import { Icon } from '../../../components/icons/Icon'

interface UserFooterProps {
  name: string
  subtitle: string
  initial?: string
  bg?: string
  fg?: string
  onLogout: () => void
}

export function UserFooter({ name, subtitle, initial, bg, fg, onLogout }: UserFooterProps) {
  return (
    <div
      style={{
        padding: 12,
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div className="avatar" style={{ background: bg ?? 'var(--bg-3)', color: fg ?? 'var(--fg)' }}>
        {initial ?? name[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            color: 'var(--fg)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{subtitle}</div>
      </div>
      <button
        className="btn btn-ghost btn-icon"
        onClick={onLogout}
        title="Cerrar sesión"
      >
        <Icon.logout style={{ width: 14, height: 14 }} />
      </button>
    </div>
  )
}
