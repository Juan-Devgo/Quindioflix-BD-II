import { useState } from 'react'
import { Modal } from '../../../../components/Modal'
import { Switch } from '../../../../components/Switch'
import { useToast } from '../../../../components/Toast'
import { useGenres } from '../../../../api/hooks/useGenres'
import type { Clasificacion, ContenidoTipo } from '../../../../api/types'

interface NewContentModalProps {
  onClose: () => void
}

const TIPOS: Array<ContenidoTipo> = ['PELICULA', 'SERIE', 'DOCUMENTAL', 'MUSICA', 'PODCAST']
const CLASIFS: Array<Clasificacion> = ['TP', '+7', '+13', '+16', '+18']

export function NewContentModal({ onClose }: NewContentModalProps) {
  const [tipo, setTipo] = useState<ContenidoTipo>('PELICULA')
  const [titulo, setTitulo] = useState('')
  const [generos, setGeneros] = useState<Array<string>>([])
  const [original, setOriginal] = useState(false)
  const toast = useToast()
  const { data: genreList = [] } = useGenres()
  const requireDuracion = (['PELICULA', 'DOCUMENTAL', 'MUSICA'] as Array<ContenidoTipo>).includes(tipo)

  return (
    <Modal title="Registrar nuevo contenido" onClose={onClose} maxWidth={680}>
      <p style={{ color: 'var(--fg-3)', marginTop: -8, marginBottom: 22 }}>
        Crea un registro en <span className="mono">CONTENIDO</span> · HU-CONT-001
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <span className="label">Título</span>
          <input
            className="input"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Niebla sobre Salento"
          />
        </div>
        <div>
          <span className="label">Tipo</span>
          <select
            className="select"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as ContenidoTipo)}
          >
            {TIPOS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <span className="label">Año de lanzamiento</span>
          <input className="input" type="number" defaultValue={2025} />
        </div>
        <div>
          <span className="label">Clasificación de edad</span>
          <select className="select">
            {CLASIFS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <span className="label">Sinopsis</span>
          <textarea className="textarea" placeholder="Breve resumen del contenido..." />
        </div>
        <div>
          <span className="label">
            Duración (minutos){' '}
            {!requireDuracion && (
              <span style={{ color: 'var(--fg-4)', textTransform: 'none', letterSpacing: 0 }}>
                · opcional
              </span>
            )}
          </span>
          <input
            className="input"
            type="number"
            placeholder={requireDuracion ? 'Requerido' : 'Se calcula de episodios'}
          />
        </div>
        <div>
          <span className="label">¿Original de QuindioFlix?</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              background: 'var(--bg-1)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border-soft)',
            }}
          >
            <Switch on={original} onChange={setOriginal} />
            <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>
              {original ? 'Sí, producción original' : 'No, contenido licenciado'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <span className="label">Géneros (1 o más)</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {genreList.map((g) => {
            const on = generos.includes(g)
            return (
              <button
                key={g}
                onClick={() => setGeneros(on ? generos.filter((x) => x !== g) : [...generos, g])}
                className={'chip ' + (on ? 'accent' : '')}
                style={{ cursor: 'pointer', padding: '5px 10px' }}
              >
                {g}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          disabled={!titulo}
          onClick={() => {
            toast(`"${titulo}" registrado en CONTENIDO`)
            onClose()
          }}
        >
          Crear registro
        </button>
      </div>
    </Modal>
  )
}
