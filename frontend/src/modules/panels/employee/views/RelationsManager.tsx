import { Icon } from '../../../../components/icons/Icon'
import { useCatalog, useRelations } from '../../../../api/hooks/useCatalog'

export function RelationsManager() {
  const { data: catalog = [] } = useCatalog()
  const { data: relaciones = [] } = useRelations()

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn btn-primary">
          <Icon.plus style={{ width: 14, height: 14 }} /> Nueva relación
        </button>
      </div>
      <div className="card" style={{ padding: 24 }}>
        {relaciones.map((r, i) => {
          const origen = catalog.find((c) => c.id === r.origen)
          const destino = catalog.find((c) => c.id === r.destino)
          if (!origen || !destino) return null
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '18px 0',
                borderBottom: i < relaciones.length - 1 ? '1px solid var(--border-soft)' : 0,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                <div
                  style={{
                    width: 40,
                    height: 56,
                    borderRadius: 6,
                    background: origen.gradient,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 15 }}>{origen.titulo}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }} className="mono">
                    {origen.tipo} · {origen.anio}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="chip accent" style={{ padding: '4px 12px' }}>
                  {r.tipo.replace('_', ' ')}
                </div>
                <Icon.arrow style={{ width: 22, height: 22, color: 'var(--fg-4)', marginTop: 6 }} />
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  flex: 1,
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15 }}>{destino.titulo}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }} className="mono">
                    {destino.tipo} · {destino.anio}
                  </div>
                </div>
                <div
                  style={{
                    width: 40,
                    height: 56,
                    borderRadius: 6,
                    background: destino.gradient,
                    flexShrink: 0,
                  }}
                />
              </div>
              <button className="btn btn-ghost btn-icon">
                <Icon.trash style={{ width: 14, height: 14 }} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
