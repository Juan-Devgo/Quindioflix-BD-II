import { useToast } from '../../../../components/Toast'
import { useReferrals } from '../../../../api/hooks/useReferrals'
import { fmtCOP } from '../../../../lib/format'
import type { Usuario } from '../../../../api/types'

interface ReferralsViewProps {
  usuario: Usuario
}

export function ReferralsView({ usuario }: ReferralsViewProps) {
  const toast = useToast()
  const { data: refs = [] } = useReferrals(usuario.id)
  const conv = refs.filter((r) => r.beneficioNuevo === 'S').length
  const dscto = refs.reduce((s, r) => s + (r.beneficioReferidor === 'S' ? 5000 : 0), 0)

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: '20px 0 4px' }}>
        Programa de referidos
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 30 }}>
        Invita a un amigo. Ambos reciben $5.000 de descuento en el siguiente pago.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 30 }}>
        <div
          className="card"
          style={{
            padding: 26,
            background: 'linear-gradient(140deg, oklch(0.30 0.08 75), var(--bg-1) 70%)',
          }}
        >
          <div className="label">Tu enlace de invitación</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <input
              className="input"
              readOnly
              value="quindioflix.co/r/MARIANA-O-2026"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}
            />
            <button
              className="btn btn-primary"
              onClick={() => toast('Enlace copiado al portapapeles')}
            >
              Copiar
            </button>
          </div>
          <div style={{ marginTop: 22, fontSize: 13, color: 'var(--fg-2)' }}>
            <div style={{ marginBottom: 8 }}>• Tu amigo se registra usando tu enlace.</div>
            <div style={{ marginBottom: 8 }}>
              • Cuando realiza su primer pago exitoso, ambos reciben el descuento.
            </div>
            <div>• El beneficio se aplica automáticamente al siguiente cobro.</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 12 }}>
          <div className="kpi">
            <div className="kpi-label">Referidos exitosos</div>
            <div className="kpi-value">{conv}</div>
            <div className="kpi-delta">de {refs.length} invitaciones</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Descuentos acumulados</div>
            <div className="kpi-value">{fmtCOP(dscto)}</div>
            <div className="kpi-delta">aplicados a tu cuenta</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 26 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 16px' }}>
          Tus invitaciones
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>Persona</th>
              <th>Fecha</th>
              <th>Beneficio aplicado (a ti)</th>
              <th>Beneficio aplicado (a ella/él)</th>
            </tr>
          </thead>
          <tbody>
            {refs.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td className="mono">{r.fecha}</td>
                <td>
                  {r.beneficioReferidor === 'S' ? (
                    <span className="chip sage">Aplicado</span>
                  ) : (
                    <span className="chip">Pendiente</span>
                  )}
                </td>
                <td>
                  {r.beneficioNuevo === 'S' ? (
                    <span className="chip sage">Aplicado</span>
                  ) : (
                    <span className="chip">Pendiente</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
