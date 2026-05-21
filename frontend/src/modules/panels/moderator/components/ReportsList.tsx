import { Empty } from '../../../../components/Empty'
import { Icon } from '../../../../components/icons/Icon'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import type { Contenido, Reporte } from '../../../../api/types'

interface ReportsListProps {
  reports: Array<Reporte>
  onOpen: (r: Reporte) => void
}

const NOW = new Date('2026-05-19T14:00:00')

function ageStr(fecha: string) {
  const min = Math.floor((NOW.getTime() - new Date(fecha.replace(' ', 'T')).getTime()) / 60000)
  if (min > 60 * 24) return `${Math.floor(min / 1440)} días`
  if (min > 60) return `${Math.floor(min / 60)}h`
  return `${min}m`
}

function stateClass(estado: Reporte['estado']) {
  if (estado === 'PENDIENTE') return 'accent'
  if (estado === 'EN_REVISION') return ''
  if (estado === 'RESUELTO') return 'sage'
  return 'rose'
}

export function ReportsList({ reports, onOpen }: ReportsListProps) {
  const { data: catalog = [] } = useCatalog()
  const byId = new Map<number, Contenido>(catalog.map((c) => [c.id, c]))

  if (reports.length === 0) {
    return (
      <Empty
        icon={Icon.check}
        title="No hay reportes en esta cola"
        hint="Buen trabajo manteniendo la plataforma limpia."
      />
    )
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {reports.map((r) => {
        const item = byId.get(r.idContenido)
        return (
          <div
            key={r.id}
            className="card"
            style={{
              padding: 18,
              display: 'flex',
              gap: 18,
              cursor: 'pointer',
              alignItems: 'flex-start',
            }}
            onClick={() => onOpen(r)}
          >
            <div
              style={{
                width: 48,
                height: 64,
                borderRadius: 6,
                background: item?.gradient ?? 'var(--bg-2)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className={'chip ' + stateClass(r.estado)}>
                  {r.estado.replace('_', ' ')}
                </span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-4)' }}>
                  #{String(r.id).padStart(4, '0')}
                </span>
                <span style={{ fontSize: 13, color: 'var(--fg-2)' }}>·</span>
                <span style={{ fontSize: 14 }}>{item?.titulo ?? 'Contenido desconocido'}</span>
                {item && (
                  <span className="chip ghost" style={{ padding: '2px 8px', fontSize: 10 }}>
                    {item.clasif}
                  </span>
                )}
                <div style={{ flex: 1 }} />
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  hace {ageStr(r.fechaReporte)}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.5 }}>
                {r.motivo}
              </p>
              {r.comentarioResolucion && (
                <div
                  style={{
                    marginTop: 10,
                    paddingTop: 10,
                    borderTop: '1px dashed var(--border-soft)',
                    fontSize: 12,
                    color: 'var(--fg-3)',
                  }}
                >
                  <strong style={{ color: 'var(--fg-2)' }}>Resolución:</strong>{' '}
                  {r.comentarioResolucion}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
