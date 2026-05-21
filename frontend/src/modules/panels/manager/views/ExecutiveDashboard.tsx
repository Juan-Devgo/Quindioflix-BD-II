import { BarChart } from '../../../../components/charts/BarChart'
import { BarList } from '../../../../components/charts/BarList'
import { Donut } from '../../../../components/charts/Donut'
import { fmtNum } from '../../../../lib/format'
import { useMetrics } from '../../../../api/hooks/useMetrics'

export function ExecutiveDashboard() {
  const { data: m } = useMetrics()
  if (!m) return null

  const totalUsuarios = m.consumoPlan.reduce((s, p) => s + p.usuarios, 0)
  const totalRepros = m.consumoPlan.reduce((s, p) => s + p.repros, 0)
  const ingresoMes = m.ingresosMes.at(-1)?.v ?? 0

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Usuarios activos</div>
          <div className="kpi-value">{fmtNum(totalUsuarios)}</div>
          <div className="kpi-delta">↑ 12.4% vs mes anterior</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Reproducciones (mes)</div>
          <div className="kpi-value">{(totalRepros / 1_000_000).toFixed(1)}M</div>
          <div className="kpi-delta">↑ 8.1%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ingresos netos (mes)</div>
          <div className="kpi-value">${ingresoMes}M</div>
          <div className="kpi-delta">↑ 4.8%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Churn promedio</div>
          <div className="kpi-value">5.4%</div>
          <div className="kpi-delta down">↑ 0.3 pts</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 4px' }}>
            Ingresos mensuales
          </h3>
          <div
            className="mono"
            style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 18 }}
          >
            Millones COP — últimos 7 meses
          </div>
          <BarChart data={m.ingresosMes} height={200} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
            Distribución por tipo
          </h3>
          <Donut data={m.consumoTipo} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
            Top ciudades por reproducciones
          </h3>
          <BarList
            data={m.consumoCiudad.slice(0, 6)}
            valueKey="reproducciones"
            labelKey="ciudad"
            format={fmtNum}
          />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
            Comportamiento por plan
          </h3>
          <table className="table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Usuarios</th>
                <th>Repros</th>
                <th>Churn</th>
              </tr>
            </thead>
            <tbody>
              {m.consumoPlan.map((p) => (
                <tr key={p.plan}>
                  <td>
                    <span className="chip">{p.plan}</span>
                  </td>
                  <td className="mono">{fmtNum(p.usuarios)}</td>
                  <td className="mono">{fmtNum(p.repros)}</td>
                  <td className="mono">
                    <span style={{ color: p.churn > 6 ? 'var(--rose)' : 'var(--sage)' }}>
                      {p.churn}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
