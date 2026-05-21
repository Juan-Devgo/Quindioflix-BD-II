import { fmtCOP } from '../../../lib/format'
import { usePlans } from '../../../api/hooks/useUser'
import { PlanFeature } from '../components/PlanFeature'

interface PlansSectionProps {
  onRegister: () => void
}

export function PlansSection({ onRegister }: PlansSectionProps) {
  const { data: plans = [] } = usePlans()

  return (
    <section
      id="planes"
      style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <div className="upper" style={{ color: 'var(--accent)', marginBottom: 14 }}>
          Planes y precios
        </div>
        <h2
          className="display"
          style={{ fontSize: 56, margin: '0 0 14px', letterSpacing: '-0.02em' }}
        >
          Elige cómo ver.
        </h2>
        <p style={{ color: 'var(--fg-2)', fontSize: 16, maxWidth: 540, margin: '0 auto' }}>
          Cambia o cancela cuando quieras. El precio se mantiene fijo el primer año.
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
        {plans.map((p) => (
          <div
            key={p.id}
            className="card"
            style={{
              padding: 32,
              position: 'relative',
              background:
                p.id === 3 ? 'linear-gradient(160deg, oklch(0.28 0.08 75), var(--bg-1))' : 'var(--bg-1)',
              borderColor: p.id === 3 ? 'var(--accent)' : 'var(--border-soft)',
            }}
          >
            {p.id === 3 && (
              <div className="chip accent" style={{ position: 'absolute', top: -10, left: 24 }}>
                Más popular
              </div>
            )}
            <div className="display" style={{ fontSize: 32, color: p.color, marginBottom: 4 }}>
              {p.nombre}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 20 }}>{p.calidad}</div>
            <div className="display" style={{ fontSize: 56, letterSpacing: '-0.02em' }}>
              {fmtCOP(p.precio)}
            </div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginBottom: 26 }}>/ mes</div>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <PlanFeature ok>Hasta {p.max_pantallas} pantallas simultáneas</PlanFeature>
              <PlanFeature ok>Calidad de imagen {p.calidad}</PlanFeature>
              <PlanFeature ok>Sin anuncios</PlanFeature>
              <PlanFeature ok>Descargas para ver sin internet</PlanFeature>
              <PlanFeature ok={p.id >= 2}>Audio espacial</PlanFeature>
              <PlanFeature ok={p.id === 3}>Acceso anticipado a originales</PlanFeature>
            </ul>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}
              onClick={onRegister}
            >
              Empezar con {p.nombre}
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
