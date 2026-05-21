import { Icon } from '../../../../components/icons/Icon'
import { useCatalog, useEpisodes } from '../../../../api/hooks/useCatalog'
import type { Contenido } from '../../../../api/types'

export function SeriesManager() {
  const { data: catalog = [] } = useCatalog()
  const series = catalog.filter((c) => c.tipo === 'SERIE' || c.tipo === 'PODCAST')
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {series.map((s) => (
        <SeriesRow key={s.id} item={s} />
      ))}
    </div>
  )
}

function SeriesRow({ item }: { item: Contenido }) {
  const { data: eps } = useEpisodes(item.id)
  const totalEps = eps?.temporadas.reduce((sum, t) => sum + t.episodios.length, 0) ?? 0
  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 18 }}>
        <div
          style={{
            width: 80,
            height: 110,
            borderRadius: 8,
            background: item.gradient,
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h3 className="display" style={{ margin: 0, fontSize: 26 }}>
              {item.titulo}
            </h3>
            <span className="chip">{item.tipo}</span>
            <span className="chip ghost">{item.clasif}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>
            {item.temporadas ?? 0} temporadas · {totalEps} episodios registrados
          </div>
          {eps && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              {eps.temporadas.map((t) => (
                <div key={t.num} className="chip" style={{ padding: '6px 12px', fontSize: 12 }}>
                  T{t.num} · {t.episodios.length} eps
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn btn-sm">
            <Icon.plus style={{ width: 12, height: 12 }} /> Temporada
          </button>
          <button className="btn btn-sm">
            <Icon.plus style={{ width: 12, height: 12 }} /> Episodio
          </button>
        </div>
      </div>
    </div>
  )
}
