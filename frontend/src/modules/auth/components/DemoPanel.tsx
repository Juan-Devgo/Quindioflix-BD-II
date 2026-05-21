import type { Role } from '../../../api/types'
import { CREDENCIALES, type DemoCredential } from '../../../api/mocks/credentials'

const roleColor: Record<Role, string> = {
  consumer: 'var(--accent)',
  content: 'var(--sage)',
  moderator: 'var(--sky)',
  management: 'oklch(0.78 0.135 320)',
  dba: 'oklch(0.55 0.02 60)',
  admin: 'oklch(0.55 0.02 60)',
}
const roleLabel: Record<Role, string> = {
  consumer: 'Cliente',
  content: 'Contenido',
  moderator: 'Moderador',
  management: 'Gerencia',
  dba: 'DBA',
  admin: 'Admin',
}

interface DemoPanelProps {
  onUse: (c: DemoCredential) => void
}

export function DemoPanel({ onUse }: DemoPanelProps) {
  return (
    <div style={{ padding: 28 }}>
      <div className="chip accent" style={{ marginBottom: 18 }}>
        Modo demo
      </div>
      <h3 className="display" style={{ fontSize: 28, margin: '0 0 8px' }}>
        Cuentas de prueba
      </h3>
      <p style={{ color: 'var(--fg-3)', fontSize: 13, margin: '0 0 20px' }}>
        Selecciona un rol para precargar las credenciales. Cada rol entra a una app distinta del
        sistema.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CREDENCIALES.map((c) => (
          <div
            key={c.email}
            onClick={() => onUse(c)}
            className="card"
            style={{
              padding: 12,
              cursor: 'pointer',
              background: 'var(--bg-1)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-soft)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                className="avatar"
                style={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  background: roleColor[c.role],
                  color: 'oklch(0.16 0.01 60)',
                }}
              >
                {c.nombre[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--fg)' }}>{c.nombre}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>{c.desc}</div>
              </div>
              <span className="chip" style={{ fontSize: 10, padding: '2px 8px' }}>
                {roleLabel[c.role]}
              </span>
            </div>
            <div
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTop: '1px dashed var(--border-soft)',
                display: 'grid',
                gridTemplateColumns: 'max-content 1fr',
                gap: '2px 10px',
                fontSize: 11,
              }}
            >
              <span style={{ color: 'var(--fg-4)' }}>email</span>
              <span className="mono" style={{ color: 'var(--fg-2)' }}>
                {c.email}
              </span>
              <span style={{ color: 'var(--fg-4)' }}>pass</span>
              <span className="mono" style={{ color: 'var(--fg-2)' }}>
                {c.password}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          padding: 12,
          background: 'var(--bg-2)',
          borderRadius: 'var(--r-md)',
          fontSize: 11,
          color: 'var(--fg-3)',
          lineHeight: 1.5,
        }}
      >
        <strong style={{ color: 'var(--fg-2)' }}>Nota de seguridad:</strong> en producción cada rol
        tiene su propio esquema de privilegios sobre la base de datos (ver panel DBA). Las
        credenciales aquí mostradas son únicamente para demostración del prototipo.
      </div>
    </div>
  )
}
