import { useDbBackups } from '../../../../api/hooks/useDba'

export function DbaBackups() {
  const { data: backups = [] } = useDbBackups()
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Tamaño</th>
            <th>Duración</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {backups.map((b, i) => (
            <tr key={i}>
              <td className="mono">{b.type}</td>
              <td className="mono">{b.date}</td>
              <td className="mono">{b.size}</td>
              <td className="mono">{b.dur}</td>
              <td>
                <span className={'chip ' + (b.status === 'OK' ? 'sage' : 'rose')}>
                  {b.status}
                </span>
              </td>
              <td>
                <button className="btn btn-ghost btn-sm">Restaurar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
