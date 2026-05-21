import { Icon } from '../../../../components/icons/Icon'
import { useSchemas } from '../../../../api/hooks/useDba'

export function DbaSchemas() {
  const { data: schemas = [] } = useSchemas()
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="table">
        <thead>
          <tr>
            <th>Esquema</th>
            <th>Tablas</th>
            <th>Tamaño</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schemas.map((s) => (
            <tr key={s.name}>
              <td className="mono" style={{ color: 'var(--accent)' }}>
                {s.name}
              </td>
              <td className="mono">{s.tables}</td>
              <td className="mono">{s.size}</td>
              <td style={{ color: 'var(--fg-3)' }}>{s.desc}</td>
              <td>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-ghost btn-sm">
                    <Icon.edit style={{ width: 12, height: 12 }} />
                  </button>
                  <button className="btn btn-ghost btn-sm">Privilegios</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
