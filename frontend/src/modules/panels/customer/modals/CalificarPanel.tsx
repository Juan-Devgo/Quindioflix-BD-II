import { useState } from 'react'
import { Icon } from '../../../../components/icons/Icon'
import { Stars } from '../../../../components/Stars'
import { useToast } from '../../../../components/Toast'
import { useRateContent } from '../../../../api/hooks/useRatings'
import { useRecentPlays } from '../../../../api/hooks/usePlayback'
import type { Calificacion, Contenido, Perfil } from '../../../../api/types'

interface CalificarPanelProps {
  item: Contenido
  perfil: Perfil
  miCalif: Calificacion | undefined
}

export function CalificarPanel({ item, perfil, miCalif }: CalificarPanelProps) {
  const [stars, setStars] = useState(miCalif?.stars ?? 0)
  const [resena, setResena] = useState(miCalif?.resena ?? '')
  const toast = useToast()
  const rate = useRateContent()
  const { data: repros = [] } = useRecentPlays(perfil.id)

  // RN-04: needs 50% playback
  const visto = repros.find(
    (r) =>
      (r.idContenido === item.id || r.idEpisodio?.idSerie === item.id) && r.avance >= 50,
  )
  const puedeCalificar = !!visto

  if (!puedeCalificar) {
    return (
      <div className="card" style={{ padding: 18, background: 'var(--bg-2)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Icon.shield style={{ width: 22, height: 22, color: 'var(--fg-3)' }} />
          <div>
            <div style={{ fontWeight: 500 }}>Aún no puedes calificar este título</div>
            <div style={{ fontSize: 13, color: 'var(--fg-3)', marginTop: 4 }}>
              Debes reproducir al menos el 50% del contenido antes de poder dejar una calificación.{' '}
              <span className="mono" style={{ color: 'var(--fg-4)' }}>(RN-04)</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const guardar = () => {
    rate.mutate(
      { profileId: perfil.id, contentId: item.id, stars, resena },
      { onSuccess: () => toast(miCalif ? 'Calificación actualizada' : '¡Gracias por calificar!') },
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <span className="label">Tu calificación</span>
        <Stars value={stars} onChange={setStars} size={28} />
      </div>
      <div style={{ marginBottom: 18 }}>
        <span className="label">Reseña (opcional)</span>
        <textarea
          className="textarea"
          value={resena}
          onChange={(e) => setResena(e.target.value)}
          placeholder="Comparte tu opinión sobre este título..."
        />
      </div>
      <button className="btn btn-primary" onClick={guardar} disabled={stars === 0 || rate.isPending}>
        {miCalif ? 'Actualizar calificación' : 'Publicar calificación'}
      </button>
      {miCalif && (
        <span style={{ marginLeft: 12, fontSize: 13, color: 'var(--fg-3)' }}>
          Última actualización: {miCalif.fecha}
        </span>
      )}
    </div>
  )
}
