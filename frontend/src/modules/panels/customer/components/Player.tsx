import { useEffect, useState } from 'react'
import { Icon } from '../../../../components/icons/Icon'
import type { Contenido } from '../../../../api/types'

interface PlayerEpisode {
  num: number
  titulo: string
  duracion: number
  t?: number
}

interface PlayerProps {
  item: Contenido
  episodio: PlayerEpisode | null
  onClose: () => void
}

export function Player({ item, episodio, onClose }: PlayerProps) {
  const [playing, setPlaying] = useState(true)
  const [progress, setProgress] = useState(8)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setProgress((p) => Math.min(p + 0.5, 100)), 1000)
    return () => clearInterval(t)
  }, [playing])

  const dur = episodio?.duracion ?? item.duracion ?? 90
  const curMin = Math.floor((dur * progress) / 100)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'black',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseMove={() => setShowControls(true)}
    >
      <div style={{ position: 'absolute', inset: 0, background: item.gradient, opacity: 0.4 }} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 0%, black 90%)',
        }}
      />
      <div style={{ position: 'relative', textAlign: 'center', color: 'white' }}>
        <div className="display" style={{ fontSize: 84, letterSpacing: '-0.02em' }}>
          {item.titulo}
        </div>
        {episodio && (
          <div style={{ fontSize: 18, marginTop: 8, color: 'oklch(1 0 0 / 0.7)' }}>
            T{episodio.t ?? 1} E{episodio.num} · {episodio.titulo}
          </div>
        )}
      </div>

      {showControls && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: 28,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="btn"
              onClick={onClose}
              style={{
                background: 'oklch(0 0 0 / 0.4)',
                color: 'white',
                borderColor: 'transparent',
              }}
            >
              <Icon.close style={{ width: 14, height: 14 }} /> Salir
            </button>
            <div
              className="chip"
              style={{ background: 'oklch(0 0 0 / 0.4)', color: 'white', border: 0 }}
            >
              <span
                style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}
              />
              Reproduciendo en TV Sala
            </div>
          </div>
          <div>
            <div
              className="progress"
              style={{ height: 5, marginBottom: 12, background: 'oklch(1 0 0 / 0.2)' }}
            >
              <div className="progress-bar" style={{ width: progress + '%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button
                className="btn btn-icon"
                onClick={() => setPlaying(!playing)}
                style={{
                  background: 'white',
                  color: 'black',
                  border: 0,
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              >
                {playing ? (
                  <span style={{ fontSize: 18 }}>❚❚</span>
                ) : (
                  <Icon.play style={{ width: 20, height: 20 }} />
                )}
              </button>
              <button className="btn btn-ghost" style={{ color: 'white' }}>
                ‹‹ 10s
              </button>
              <button className="btn btn-ghost" style={{ color: 'white' }}>
                10s ››
              </button>
              <span className="mono" style={{ color: 'white', fontSize: 13 }}>
                {String(Math.floor(curMin / 60)).padStart(2, '0')}:
                {String(curMin % 60).padStart(2, '0')} / {String(Math.floor(dur / 60)).padStart(2, '0')}
                :{String(dur % 60).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }} />
              <button className="btn btn-ghost" style={{ color: 'white' }}>
                Subtítulos
              </button>
              <button className="btn btn-ghost" style={{ color: 'white' }}>
                Audio
              </button>
              <button className="btn btn-ghost" style={{ color: 'white' }}>
                Pantalla completa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
