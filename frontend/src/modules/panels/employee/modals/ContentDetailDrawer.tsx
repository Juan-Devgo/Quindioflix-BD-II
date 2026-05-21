import { Icon } from '../../../../components/icons/Icon'
import { useEpisodes } from '../../../../api/hooks/useCatalog'
import type { Contenido } from '../../../../api/types'

interface ContentDetailDrawerProps {
  item: Contenido
  onClose: () => void
}

export function ContentDetailDrawer({ item, onClose }: ContentDetailDrawerProps) {
  const { data: eps } = useEpisodes(item.id)
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{ justifyContent: 'flex-end', padding: 0 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 560,
          height: '100vh',
          background: 'var(--bg-1)',
          borderLeft: '1px solid var(--border)',
          overflow: 'auto',
        }}
      >
        <div style={{ height: 200, background: item.gradient, position: 'relative' }}>
          <button
            className="btn btn-icon"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'oklch(0 0 0 / 0.4)',
              border: 0,
            }}
          >
            <Icon.close style={{ width: 16, height: 16 }} />
          </button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <span className="chip">{item.tipo}</span>
            <span className="chip">{item.clasif}</span>
            {item.original && <span className="chip accent">Original</span>}
          </div>
          <h2 className="display" style={{ fontSize: 36, margin: '8px 0 14px' }}>
            {item.titulo}
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14, marginBottom: 22 }}>{item.sinopsis}</p>

          <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 10 }}>
            Metadatos
          </div>
          <table className="table" style={{ marginBottom: 24 }}>
            <tbody>
              <tr>
                <td style={{ color: 'var(--fg-3)' }}>id_contenido</td>
                <td className="mono">{item.id}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--fg-3)' }}>año_lanzamiento</td>
                <td className="mono">{item.anio}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--fg-3)' }}>duracion_minutos</td>
                <td className="mono">{item.duracion ?? 'NULL (se calcula de episodios)'}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--fg-3)' }}>fecha_agregado_catalogo</td>
                <td className="mono">{item.fechaCatalogo}</td>
              </tr>
              <tr>
                <td style={{ color: 'var(--fg-3)' }}>generos</td>
                <td>{item.generos.join(', ')}</td>
              </tr>
            </tbody>
          </table>

          {eps && (
            <>
              <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 10 }}>
                Temporadas y episodios
              </div>
              {eps.temporadas.map((t) => (
                <div key={t.num} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border-soft)',
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>
                      T{t.num} — {t.titulo}
                    </span>
                    <span className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                      {t.episodios.length} eps
                    </span>
                  </div>
                  {t.episodios.map((e) => (
                    <div
                      key={e.num}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 12px',
                        fontSize: 13,
                      }}
                    >
                      <span className="mono" style={{ color: 'var(--fg-3)' }}>
                        E{String(e.num).padStart(2, '0')}
                      </span>
                      <span style={{ flex: 1, marginLeft: 12 }}>{e.titulo}</span>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-4)' }}>
                        {e.duracion}m
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button className="btn">
              <Icon.edit style={{ width: 14, height: 14 }} /> Editar
            </button>
            <button className="btn">
              <Icon.plus style={{ width: 14, height: 14 }} /> Géneros
            </button>
            <div style={{ flex: 1 }} />
            <button className="btn btn-danger">
              <Icon.trash style={{ width: 14, height: 14 }} /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
