import { useState } from 'react'
import { Brand } from '../../../components/Brand'
import { Icon } from '../../../components/icons/Icon'
import type { Perfil } from '../../../api/types'

interface ProfileSelectorProps {
  profiles: Array<Perfil>
  accountName: string
  planName: string
  onPick: (p: Perfil) => void
}

export function ProfileSelector({ profiles, accountName, planName, onPick }: ProfileSelectorProps) {
  const [editing, setEditing] = useState(false)
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background:
          'radial-gradient(ellipse at 50% 20%, oklch(0.22 0.03 60), var(--bg-0) 70%)',
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <Brand size="lg" />
      </div>
      <h1
        className="display"
        style={{
          fontSize: 56,
          margin: '12px 0 8px',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        ¿Quién mira hoy?
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 48 }}>
        Cuenta de {accountName} · {planName}
      </p>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
        {profiles
          .filter((p) => p.activo)
          .map((p) => (
            <div
              key={p.id}
              onClick={() => !editing && onPick(p)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 14,
                cursor: 'pointer',
                padding: 12,
                borderRadius: 14,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'oklch(1 0 0 / 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    width: 130,
                    height: 130,
                    borderRadius: 24,
                    background: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontSize: 72,
                    color: 'oklch(0.16 0.01 60)',
                    border: '3px solid transparent',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {p.avatar}
                </div>
                {editing && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'oklch(0 0 0 / 0.5)',
                      borderRadius: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon.edit style={{ width: 28, height: 28, color: 'white' }} />
                  </div>
                )}
                {p.tipo === 'INFANTIL' && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -6,
                      right: -6,
                      background: 'var(--sage)',
                      color: 'oklch(0.16 0.01 60)',
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    NIÑOS
                  </span>
                )}
              </div>
              <div style={{ fontSize: 18, color: 'var(--fg-2)' }}>{p.nombre}</div>
            </div>
          ))}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            cursor: 'pointer',
            padding: 12,
            opacity: 0.6,
          }}
        >
          <div
            style={{
              width: 130,
              height: 130,
              borderRadius: 24,
              border: '2px dashed var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon.plus style={{ width: 40, height: 40, color: 'var(--fg-3)' }} />
          </div>
          <div style={{ fontSize: 18, color: 'var(--fg-3)' }}>Agregar perfil</div>
        </div>
      </div>
      <button className="btn btn-ghost" style={{ marginTop: 48 }} onClick={() => setEditing(!editing)}>
        <Icon.edit style={{ width: 14, height: 14 }} />
        {editing ? 'Listo' : 'Administrar perfiles'}
      </button>
    </div>
  )
}
