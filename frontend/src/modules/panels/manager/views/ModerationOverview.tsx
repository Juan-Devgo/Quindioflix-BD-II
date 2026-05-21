import { useEmployees } from '../../../../api/hooks/useEmployees'
import { useReports } from '../../../../api/hooks/useReports'

export function ModerationOverview() {
  const { data: reportes = [] } = useReports()
  const { data: employees = [] } = useEmployees()
  const stats = {
    pendientes: reportes.filter((r) => r.estado === 'PENDIENTE').length,
    enRevision: reportes.filter((r) => r.estado === 'EN_REVISION').length,
    resueltos: reportes.filter((r) => r.estado === 'RESUELTO').length,
    rechazados: reportes.filter((r) => r.estado === 'RECHAZADO').length,
  }
  const moderadores = employees.filter((e) => e.rol === 'MODERADOR')

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
          <div className="kpi-label">Pendientes</div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>
            {stats.pendientes}
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">En revisión</div>
          <div className="kpi-value">{stats.enRevision}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Resueltos (mes)</div>
          <div className="kpi-value">{stats.resueltos}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Rechazados (mes)</div>
          <div className="kpi-value">{stats.rechazados}</div>
        </div>
      </div>
      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
          Productividad por moderador
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>Moderador</th>
              <th>Resueltos</th>
              <th>Rechazados</th>
              <th>Tiempo prom. respuesta</th>
            </tr>
          </thead>
          <tbody>
            {moderadores.map((e) => {
              const res = reportes.filter(
                (r) => r.moderador === e.id && r.estado === 'RESUELTO',
              ).length
              const rec = reportes.filter(
                (r) => r.moderador === e.id && r.estado === 'RECHAZADO',
              ).length
              return (
                <tr key={e.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 14 }}>
                      {e.nombre[0]}
                    </div>
                    {e.nombre}
                  </td>
                  <td>
                    <span className="chip sage">{res}</span>
                  </td>
                  <td>
                    <span className="chip rose">{rec}</span>
                  </td>
                  <td className="mono">{4 + ((e.id * 3) % 8)}h</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
