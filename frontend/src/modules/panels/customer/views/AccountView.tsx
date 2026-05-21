import { Icon } from '../../../../components/icons/Icon'
import { useCities, usePlans } from '../../../../api/hooks/useUser'
import { usePaymentHistory } from '../../../../api/hooks/usePayments'
import { fmtCOP } from '../../../../lib/format'
import type { Usuario } from '../../../../api/types'

interface AccountViewProps {
  usuario: Usuario
  onChangePlan: () => void
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: 'var(--fg-4)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, color: 'var(--fg)' }}>{value}</div>
    </div>
  )
}

export function AccountView({ usuario, onChangePlan }: AccountViewProps) {
  const { data: ciudades = [] } = useCities()
  const { data: planes = [] } = usePlans()
  const { data: pagos = [] } = usePaymentHistory(usuario.id)
  const ciudad = ciudades.find((c) => c.id === usuario.ciudad)
  const plan = planes.find((p) => p.id === usuario.plan)
  const diasRestantes = Math.round(
    (new Date(usuario.fechaVencimiento).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  )

  if (!plan) return null

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: '20px 0 30px' }}>
        Cuenta
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: 26 }}>
          <div className="label">Información personal</div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '18px 24px',
              marginTop: 16,
            }}
          >
            <Field label="Nombre completo" value={usuario.nombre} />
            <Field label="Email" value={usuario.email} />
            <Field label="Teléfono" value={usuario.telefono} />
            <Field label="Fecha de nacimiento" value={usuario.fechaNacimiento} />
            <Field
              label="Ciudad"
              value={ciudad ? ciudad.nombre + ', ' + ciudad.departamento : '—'}
            />
            <Field label="Miembro desde" value={usuario.fechaRegistro} />
          </div>
          <button className="btn" style={{ marginTop: 20 }}>
            <Icon.edit style={{ width: 14, height: 14 }} /> Editar información
          </button>
        </div>

        <div
          className="card"
          style={{
            padding: 26,
            background: 'linear-gradient(150deg, oklch(0.26 0.04 60), var(--bg-1))',
          }}
        >
          <div className="label">Plan actual</div>
          <div className="display" style={{ fontSize: 44, margin: '8px 0', color: 'var(--accent)' }}>
            {plan.nombre}
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-2)' }}>
            {fmtCOP(plan.precio)} / mes · {plan.calidad} · hasta {plan.max_pantallas} pantallas
          </div>
          <hr className="divider" />
          <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>Próximo cobro</div>
          <div style={{ fontSize: 18, marginTop: 4 }} className="mono">
            {usuario.fechaVencimiento}
          </div>
          <div className="chip sage" style={{ marginTop: 8 }}>
            En {diasRestantes} días
          </div>
          <button
            className="btn btn-primary"
            style={{ marginTop: 18, width: '100%', justifyContent: 'center' }}
            onClick={onChangePlan}
          >
            Cambiar plan
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <h3 className="display" style={{ fontSize: 24, margin: 0 }}>
            Historial de pagos
          </h3>
          <select className="select" style={{ width: 160 }} defaultValue="all">
            <option value="all">Todos los estados</option>
            <option>EXITOSO</option>
            <option>FALLIDO</option>
            <option>PENDIENTE</option>
            <option>REEMBOLSADO</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Plan</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Descuento</th>
              <th style={{ textAlign: 'right' }}>Total</th>
              <th>Referencia</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((p) => {
              const planP = planes.find((pl) => pl.id === p.plan)
              const total = p.monto - p.descuento
              const estCls = p.estado === 'EXITOSO' ? 'sage' : p.estado === 'FALLIDO' ? 'rose' : ''
              return (
                <tr key={p.id}>
                  <td className="mono">{p.fecha}</td>
                  <td>{planP?.nombre ?? '—'}</td>
                  <td>
                    {p.metodo
                      .replace('_', ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </td>
                  <td>
                    <span className={'chip ' + estCls}>{p.estado}</span>
                  </td>
                  <td>
                    {p.descuento > 0 ? (
                      <span style={{ color: 'var(--sage)' }}>-{fmtCOP(p.descuento)}</span>
                    ) : (
                      <span style={{ color: 'var(--fg-4)' }}>—</span>
                    )}
                  </td>
                  <td className="mono" style={{ textAlign: 'right' }}>
                    {fmtCOP(total)}
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: 'var(--fg-4)' }}>
                    {p.referencia}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
