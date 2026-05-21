import { useState } from 'react'
import { Icon } from '../../../../components/icons/Icon'
import { Stars } from '../../../../components/Stars'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import { fmtNum } from '../../../../lib/format'
import type { Contenido, ContenidoTipo } from '../../../../api/types'

type FilterTipo = 'ALL' | ContenidoTipo
const TIPOS: Array<FilterTipo> = ['ALL', 'PELICULA', 'SERIE', 'DOCUMENTAL', 'MUSICA', 'PODCAST']

interface CatalogManagerProps {
  mode: 'catalogo' | 'nuevos'
  onOpen: (c: Contenido) => void
}

export function CatalogManager({ mode, onOpen }: CatalogManagerProps) {
  const { data: catalog = [] } = useCatalog()
  const [filter, setFilter] = useState<FilterTipo>('ALL')
  let items = [...catalog]
  if (filter !== 'ALL') items = items.filter((c) => c.tipo === filter)
  if (mode === 'nuevos')
    items = items.sort((a, b) => b.fechaCatalogo.localeCompare(a.fechaCatalogo))

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {TIPOS.map((t) => (
          <button
            key={t}
            className={'chip ' + (filter === t ? 'accent' : '')}
            onClick={() => setFilter(t)}
            style={{ cursor: 'pointer', padding: '6px 12px' }}
          >
            {t === 'ALL' ? 'Todos' : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ color: 'var(--fg-3)', fontSize: 13 }} className="mono">
          {items.length} registros
        </span>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tipo</th>
              <th>Año</th>
              <th>Clasif.</th>
              <th>Géneros</th>
              <th>Original</th>
              <th>Calif.</th>
              <th>Vistas</th>
              <th>Agregado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} onClick={() => onOpen(c)} style={{ cursor: 'pointer' }}>
                <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 30,
                      height: 42,
                      borderRadius: 4,
                      background: c.gradient,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ color: 'var(--fg)' }}>{c.titulo}</span>
                </td>
                <td>
                  <span className="chip" style={{ padding: '3px 8px', fontSize: 11 }}>
                    {c.tipo}
                  </span>
                </td>
                <td className="mono">{c.anio}</td>
                <td className="mono">{c.clasif}</td>
                <td style={{ fontSize: 12 }}>
                  {c.generos.slice(0, 2).join(', ')}
                  {c.generos.length > 2 && '…'}
                </td>
                <td>
                  {c.original ? (
                    <span className="chip accent" style={{ padding: '2px 8px', fontSize: 11 }}>
                      SÍ
                    </span>
                  ) : (
                    <span style={{ color: 'var(--fg-4)' }}>—</span>
                  )}
                </td>
                <td>
                  <Stars value={c.promedio} size={11} />
                </td>
                <td className="mono">{fmtNum(c.vistas)}</td>
                <td className="mono" style={{ color: 'var(--fg-3)' }}>
                  {c.fechaCatalogo}
                </td>
                <td>
                  <button className="btn btn-ghost btn-icon">
                    <Icon.edit style={{ width: 14, height: 14 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
