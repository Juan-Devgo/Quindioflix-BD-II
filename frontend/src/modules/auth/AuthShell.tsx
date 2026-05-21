import type { ReactNode } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Brand } from '../../components/Brand'
import { Icon } from '../../components/icons/Icon'

interface AuthShellProps {
  children: ReactNode
  side: ReactNode
  wide?: boolean
}

export function AuthShell({ children, side, wide }: AuthShellProps) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: wide ? '1fr 1.1fr' : '1fr 1fr',
        background: 'var(--bg-0)',
      }}
    >
      <div
        style={{
          background: 'var(--bg-1)',
          borderRight: '1px solid var(--border-soft)',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        {side}
      </div>
      <div
        style={{
          padding: '32px 48px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <Brand size="sm" />
          <button
            className="btn btn-ghost"
            onClick={() => navigate({ to: '/' })}
            style={{ fontSize: 13 }}
          >
            <Icon.arrow style={{ width: 14, height: 14, transform: 'rotate(180deg)' }} />
            Volver al inicio
          </button>
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 460,
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '20px 0',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
