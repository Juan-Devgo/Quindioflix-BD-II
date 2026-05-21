import { Icon } from '../../../../components/icons/Icon'
import { Stars } from '../../../../components/Stars'
import type { Contenido } from '../../../../api/types'

interface HeroProps {
  item: Contenido
  isFav: boolean
  onOpen: () => void
  onPlay: () => void
  onFav: () => void
}

export function Hero({ item, isFav, onOpen, onPlay, onFav }: HeroProps) {
  return (
    <section
      style={{
        position: 'relative',
        padding: '60px 40px 80px',
        margin: '0 -40px 32px',
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: item.gradient,
          opacity: 0.55,
          zIndex: -2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 0%, var(--bg-0) 95%), linear-gradient(90deg, var(--bg-0) 0%, transparent 60%)',
          zIndex: -1,
        }}
      />
      <div style={{ maxWidth: 620 }}>
        {item.original && (
          <div className="chip accent" style={{ marginBottom: 12 }}>
            Original QuindioFlix
          </div>
        )}
        <h1
          className="display"
          style={{
            fontSize: 72,
            margin: '0 0 16px',
            letterSpacing: '-0.025em',
            lineHeight: 0.95,
          }}
        >
          {item.titulo}
        </h1>
        <div
          style={{
            display: 'flex',
            gap: 14,
            alignItems: 'center',
            marginBottom: 16,
            color: 'var(--fg-2)',
            fontSize: 13,
          }}
        >
          <span className="mono">{item.anio}</span>
          <span>·</span>
          <span>{item.tipo}</span>
          <span>·</span>
          <span className="chip ghost" style={{ padding: '2px 8px' }}>
            {item.clasif}
          </span>
          <span>·</span>
          <Stars value={item.promedio} size={12} />
          <span className="mono" style={{ fontSize: 12 }}>
            {item.promedio}
          </span>
        </div>
        <p
          style={{
            fontSize: 17,
            color: 'var(--fg-2)',
            maxWidth: 540,
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          {item.sinopsis}
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={onPlay}
            style={{ padding: '12px 22px', fontSize: 15 }}
          >
            <Icon.play style={{ width: 16, height: 16 }} /> Reproducir
          </button>
          <button className="btn" onClick={onOpen}>
            Más información
          </button>
          <button
            className="btn btn-icon"
            onClick={onFav}
            title={isFav ? 'Quitar de mi lista' : 'Agregar a mi lista'}
          >
            {isFav ? (
              <Icon.heartFill style={{ width: 16, height: 16, color: 'var(--accent)' }} />
            ) : (
              <Icon.heart style={{ width: 16, height: 16 }} />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
