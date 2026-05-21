import { fmtCOP } from '../../../../lib/format'

interface TopReferidor {
  n: string
  c: string
  r: number
  conv: number
  d: number
}

const TOP_REFERIDORES: Array<TopReferidor> = [
  { n: 'Mariana Ospina', c: 'Armenia', r: 18, conv: 14, d: 70000 },
  { n: 'Andrés Cardona', c: 'Pereira', r: 12, conv: 11, d: 55000 },
  { n: 'Camila Restrepo', c: 'Medellín', r: 9, conv: 9, d: 45000 },
  { n: 'Carlos Mejía', c: 'Bogotá', r: 8, conv: 6, d: 30000 },
  { n: 'Sofía Henao', c: 'Cali', r: 7, conv: 5, d: 25000 },
]

export function MarketingReport() {
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
          <div className="kpi-label">Referidos totales</div>
          <div className="kpi-value">3,421</div>
          <div className="kpi-delta">↑ 22% YoY</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Tasa de conversión</div>
          <div className="kpi-value">68%</div>
          <div className="kpi-delta">+4 pts</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Descuentos aplicados</div>
          <div className="kpi-value">$32M</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">CAC equivalente</div>
          <div className="kpi-value">$9.4K</div>
          <div className="kpi-delta">-12%</div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
          Top referidores
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Referidos</th>
              <th>Conversión</th>
              <th>Descuentos generados</th>
            </tr>
          </thead>
          <tbody>
            {TOP_REFERIDORES.map((u, i) => (
              <tr key={i}>
                <td>
                  {u.n}{' '}
                  <span style={{ fontSize: 11, color: 'var(--fg-3)', marginLeft: 8 }}>
                    · {u.c}
                  </span>
                </td>
                <td className="mono">{u.r}</td>
                <td>
                  <span className="chip sage" style={{ fontSize: 11, padding: '2px 8px' }}>
                    {Math.round((u.conv / u.r) * 100)}%
                  </span>
                </td>
                <td className="mono">{fmtCOP(u.d)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
