import { Icon } from '../../../components/icons/Icon'

interface InactiveScreenProps {
  onLogout: () => void
}

export function InactiveScreen({ onLogout }: InactiveScreenProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div className="card" style={{ padding: 40, maxWidth: 480, textAlign: 'center' }}>
        <Icon.shield style={{ width: 48, height: 48, color: 'var(--rose)', marginBottom: 18 }} />
        <h2 className="display" style={{ fontSize: 32, margin: '0 0 12px' }}>
          Tu cuenta está inactiva
        </h2>
        <p style={{ color: 'var(--fg-3)' }}>
          Han pasado más de 30 días desde tu fecha de vencimiento sin un pago exitoso. Actualiza tu
          método de pago para reactivar tu acceso.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 22 }}>
          <button className="btn btn-primary">Realizar pago ahora</button>
          <button className="btn btn-ghost" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
