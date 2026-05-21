import { BarChart } from '../../../../components/charts/BarChart'
import { fmtCOP, fmtNum } from '../../../../lib/format'
import { useMetrics } from '../../../../api/hooks/useMetrics'

export function IngresosReport() {
  const { data: m } = useMetrics()
  if (!m) return null
  const totalIngresos = m.consumoCiudad.reduce((s, x) => s + x.ingresos, 0) || 1

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
          marginBottom: 24,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Ingresos brutos</div>
          <div className="kpi-value">$1,921M</div>
          <div className="kpi-delta">↑ 4.8%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Descuentos aplicados</div>
          <div className="kpi-value">$87M</div>
          <div className="kpi-delta">4.5% del bruto</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ingresos netos</div>
          <div className="kpi-value">$1,834M</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Transacciones</div>
          <div className="kpi-value">65.5K</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ticket promedio</div>
          <div className="kpi-value">$27.9K</div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
          Tendencia mensual
        </h3>
        <BarChart data={m.ingresosMes} height={200} />
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
          Ingresos por ciudad
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>Ciudad</th>
              <th>Reproducciones</th>
              <th>Usuarios</th>
              <th>Ingresos netos</th>
              <th>% del total</th>
            </tr>
          </thead>
          <tbody>
            {m.consumoCiudad.map((c) => {
              const pct = ((c.ingresos / totalIngresos) * 100).toFixed(1)
              return (
                <tr key={c.ciudad}>
                  <td>{c.ciudad}</td>
                  <td className="mono">{fmtNum(c.reproducciones)}</td>
                  <td className="mono">{fmtNum(Math.floor(c.reproducciones / 50))}</td>
                  <td className="mono">{fmtCOP(c.ingresos)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 80,
                          height: 4,
                          background: 'var(--bg-2)',
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: pct + '%',
                            height: '100%',
                            background: 'var(--accent)',
                          }}
                        />
                      </div>
                      <span
                        className="mono"
                        style={{ fontSize: 12, color: 'var(--fg-3)' }}
                      >
                        {pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
