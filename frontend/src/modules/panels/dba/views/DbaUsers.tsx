import { useDbUsers } from '../../../../api/hooks/useDba'

export function DbaUsers() {
  const { data: users = [] } = useDbUsers()
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Privilegios</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user}>
              <td className="mono" style={{ color: 'var(--accent)' }}>
                {u.user}
              </td>
              <td className="mono">{u.role}</td>
              <td>
                <span className={'chip ' + (u.status === 'ACTIVO' ? 'sage' : '')}>
                  {u.status}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {u.privs.map((p) => (
                    <span
                      key={p}
                      className="chip"
                      style={{ fontSize: 11, padding: '2px 8px' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <button className="btn btn-ghost btn-sm">Gestionar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
