import { fmtNum } from '../../../../lib/format'
import { useDbPerf } from '../../../../api/hooks/useDba'

export function DbaPerf() {
  const { data: queries = [] } = useDbPerf()
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
          <div className="kpi-label">QPS</div>
          <div className="kpi-value">2,184</div>
          <div className="kpi-delta">↑ 12%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Latencia p95</div>
          <div className="kpi-value">38ms</div>
          <div className="kpi-delta">↓ 4ms</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Conexiones</div>
          <div className="kpi-value">147 / 300</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Cache hit ratio</div>
          <div className="kpi-value">96.8%</div>
        </div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
          Top consultas costosas
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>SQL ID</th>
              <th>Sentencia</th>
              <th>Ejecuciones</th>
              <th>Tiempo prom.</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((q) => (
              <tr key={q.id}>
                <td className="mono" style={{ color: 'var(--accent)' }}>
                  {q.id}
                </td>
                <td
                  className="mono"
                  style={{
                    fontSize: 12,
                    color: 'var(--fg-2)',
                    maxWidth: 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {q.sql}
                </td>
                <td className="mono">{fmtNum(q.e)}</td>
                <td className="mono">{q.t}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
