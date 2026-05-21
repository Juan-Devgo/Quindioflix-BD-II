import { useState } from 'react'
import { Icon } from '../../../../components/icons/Icon'
import { Stars } from '../../../../components/Stars'
import { Poster } from '../../../../components/Poster'
import { useToast } from '../../../../components/Toast'
import { useEpisodes, useCatalog, useRelations } from '../../../../api/hooks/useCatalog'
import { useFavorites, useToggleFavorite } from '../../../../api/hooks/useFavorites'
import { useRatings } from '../../../../api/hooks/useRatings'
import { fmtMin, fmtNum } from '../../../../lib/format'
import { CalificarPanel } from './CalificarPanel'
import type { Contenido, Perfil, Temporada, Episodio } from '../../../../api/types'

type Tab = 'info' | 'episodios' | 'calificar' | 'relacionados'

interface DetailModalProps {
  item: Contenido
  perfil: Perfil
  onClose: () => void
  onPlay: (item: Contenido, episodio?: Episodio & { t?: number }) => void
  onReport: (item: Contenido) => void
}

export function DetailModal({ item, perfil, onClose, onPlay, onReport }: DetailModalProps) {
  const [tab, setTab] = useState<Tab>('info')
  const { data: episodes } = useEpisodes(item.id)
  const { data: catalog = [] } = useCatalog()
  const { data: relaciones = [] } = useRelations()
  const { data: favorites = [] } = useFavorites(perfil.id)
  const { data: ratings = {} } = useRatings(perfil.id)
  const toggleFav = useToggleFavorite()
  const toast = useToast()

  const isFav = favorites.some((f) => f.idContenido === item.id)
  const miCalif = ratings[item.id]
  const blocked = perfil.tipo === 'INFANTIL' && ['+16', '+18'].includes(item.clasif)

  const toggle = () => {
    toggleFav.mutate(
      { profileId: perfil.id, contentId: item.id },
      {
        onSuccess: (res) => {
          if (!res.removed) toast('Agregado a tu lista')
        },
      },
    )
  }

  const relRows = relaciones
    .filter((r) => r.origen === item.id || r.destino === item.id)
    .map((r) => {
      const otherId = r.origen === item.id ? r.destino : r.origen
      const otro = catalog.find((c) => c.id === otherId)
      return otro ? { ...r, otro } : null
    })
    .filter((r): r is NonNullable<typeof r> => r !== null)

  const tabs: Array<[Tab, string]> = [
    ['info', 'Información'],
    ...((episodes ? [['episodios', 'Episodios']] : []) as Array<[Tab, string]>),
    ['calificar', 'Calificar'],
    ...((relRows.length ? [['relacionados', 'Relacionados']] : []) as Array<[Tab, string]>),
  ]

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 880, padding: 0, overflow: 'hidden' }}
      >
        <div style={{ position: 'relative', height: 320, background: item.gradient }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, transparent 30%, var(--bg-1) 100%)',
            }}
          />
          <button
            className="btn btn-icon"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'oklch(0 0 0 / 0.4)',
              border: 'none',
            }}
          >
            <Icon.close style={{ width: 16, height: 16 }} />
          </button>
          <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
            {item.original && (
              <div
                className="chip accent"
                style={{
                  marginBottom: 10,
                  background: 'oklch(0.82 0.135 75 / 0.9)',
                  color: 'oklch(0.16 0.01 60)',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Original
              </div>
            )}
            <h2
              className="display"
              style={{ fontSize: 48, margin: '0 0 10px', letterSpacing: '-0.02em' }}
            >
              {item.titulo}
            </h2>
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                color: 'oklch(1 0 0 / 0.9)',
                fontSize: 13,
              }}
            >
              <span className="mono">{item.anio}</span>
              <span>·</span>
              <span>{item.tipo}</span>
              {item.duracion && (
                <>
                  <span>·</span>
                  <span>{fmtMin(item.duracion)}</span>
                </>
              )}
              {item.temporadas && (
                <>
                  <span>·</span>
                  <span>
                    {item.temporadas} {item.temporadas === 1 ? 'temporada' : 'temporadas'}
                  </span>
                </>
              )}
              <span>·</span>
              <span
                className="chip ghost"
                style={{
                  padding: '2px 8px',
                  background: 'oklch(0 0 0 / 0.4)',
                  border: 'none',
                  color: 'white',
                }}
              >
                {item.clasif}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 28px 28px' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <button
              className="btn btn-primary"
              disabled={blocked}
              onClick={() => onPlay(item)}
              style={{ opacity: blocked ? 0.4 : 1 }}
            >
              <Icon.play style={{ width: 14, height: 14 }} /> Reproducir
            </button>
            <button className="btn" onClick={toggle}>
              {isFav ? (
                <Icon.heartFill style={{ width: 14, height: 14, color: 'var(--accent)' }} />
              ) : (
                <Icon.heart style={{ width: 14, height: 14 }} />
              )}
              {isFav ? 'En mi lista' : 'Mi lista'}
            </button>
            <button className="btn btn-ghost" onClick={() => onReport(item)}>
              <Icon.flag style={{ width: 14, height: 14 }} /> Reportar
            </button>
          </div>

          {blocked && (
            <div
              className="card"
              style={{
                padding: 16,
                marginBottom: 20,
                background: 'var(--rose-soft)',
                borderColor: 'oklch(0.70 0.135 25 / 0.4)',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Icon.shield style={{ width: 24, height: 24, color: 'var(--rose)' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--fg)' }}>Contenido restringido</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-2)', marginTop: 2 }}>
                    Este contenido tiene clasificación {item.clasif} y no está disponible para
                    perfiles infantiles. (RN-03)
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: 24,
              borderBottom: '1px solid var(--border-soft)',
              marginBottom: 18,
            }}
          >
            {tabs.map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  background: 'transparent',
                  border: 0,
                  padding: '10px 0',
                  color: tab === id ? 'var(--accent)' : 'var(--fg-2)',
                  borderBottom: '2px solid ' + (tab === id ? 'var(--accent)' : 'transparent'),
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'info' && (
            <div>
              <p style={{ fontSize: 15, color: 'var(--fg-2)', marginBottom: 18 }}>
                {item.sinopsis}
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'max-content 1fr',
                  gap: '10px 24px',
                  fontSize: 13,
                }}
              >
                <span style={{ color: 'var(--fg-3)' }}>Géneros</span>
                <span>{item.generos.join(' · ')}</span>
                <span style={{ color: 'var(--fg-3)' }}>Calificación</span>
                <span>
                  <Stars value={item.promedio} size={12} />{' '}
                  <span className="mono" style={{ color: 'var(--fg-2)' }}>
                    {' '}
                    {item.promedio}/5 ({fmtNum(item.vistas)} vistas)
                  </span>
                </span>
                {item.director && (
                  <>
                    <span style={{ color: 'var(--fg-3)' }}>Dirección</span>
                    <span>{item.director}</span>
                  </>
                )}
                {item.reparto && (
                  <>
                    <span style={{ color: 'var(--fg-3)' }}>Reparto</span>
                    <span>{item.reparto.join(', ')}</span>
                  </>
                )}
                <span style={{ color: 'var(--fg-3)' }}>Agregado</span>
                <span className="mono" style={{ color: 'var(--fg-2)' }}>
                  {item.fechaCatalogo}
                </span>
              </div>
            </div>
          )}

          {tab === 'episodios' && episodes && <EpisodesList temporadas={episodes.temporadas} onPlay={(e) => onPlay(item, e)} />}

          {tab === 'calificar' && (
            <CalificarPanel item={item} perfil={perfil} miCalif={miCalif} />
          )}

          {tab === 'relacionados' && (
            <div>
              {relRows.map((r, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', gap: 14, marginBottom: 16, alignItems: 'center' }}
                >
                  <Poster item={r.otro} size="sm" />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>
                      {r.otro.titulo}
                    </div>
                    <div className="chip" style={{ marginTop: 6 }}>
                      {r.tipo.replace('_', ' ')}
                    </div>
                    {r.descripcion && (
                      <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 8 }}>
                        {r.descripcion}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function EpisodesList({
  temporadas,
  onPlay,
}: {
  temporadas: Array<Temporada>
  onPlay: (e: Episodio & { t?: number }) => void
}) {
  return (
    <div>
      {temporadas.map((t) => (
        <div key={t.num} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
            <h3 className="display" style={{ fontSize: 22, margin: 0 }}>
              T{t.num} · {t.titulo}
            </h3>
            <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
              {t.episodios.length} episodios
            </span>
          </div>
          {t.episodios.map((e) => (
            <div
              key={e.num}
              style={{
                display: 'flex',
                gap: 14,
                padding: 14,
                borderBottom: '1px solid var(--border-soft)',
                alignItems: 'center',
              }}
            >
              <span className="mono" style={{ width: 40, color: 'var(--fg-3)', fontSize: 18 }}>
                {String(e.num).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15 }}>{e.titulo}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-3)', marginTop: 2 }}>
                  {e.duracion} min · {e.fecha}
                </div>
              </div>
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => onPlay({ ...e, t: t.num })}
              >
                <Icon.play style={{ width: 14, height: 14 }} />
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
