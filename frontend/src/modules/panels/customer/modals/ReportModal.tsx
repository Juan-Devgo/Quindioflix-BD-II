import { useState } from 'react'
import { Modal } from '../../../../components/Modal'
import { useToast } from '../../../../components/Toast'
import { useCreateReport } from '../../../../api/hooks/useReports'
import type { Contenido, Perfil } from '../../../../api/types'

interface ReportModalProps {
  item: Contenido
  perfil: Perfil
  onClose: () => void
}

const CATEGORIAS: Array<{ id: string; label: string }> = [
  { id: 'violencia', label: 'Violencia gráfica' },
  { id: 'lenguaje', label: 'Lenguaje inadecuado' },
  { id: 'clasif', label: 'Clasificación incorrecta' },
  { id: 'sexual', label: 'Contenido sexual' },
  { id: 'tecnico', label: 'Problema técnico' },
  { id: 'otro', label: 'Otro' },
]

export function ReportModal({ item, perfil, onClose }: ReportModalProps) {
  const [motivo, setMotivo] = useState('')
  const [cat, setCat] = useState('violencia')
  const toast = useToast()
  const create = useCreateReport()

  const send = () => {
    create.mutate(
      { idPerfil: perfil.id, idContenido: item.id, motivo },
      {
        onSuccess: () => {
          toast('Reporte enviado a moderación. Estado: PENDIENTE')
          onClose()
        },
      },
    )
  }

  return (
    <Modal title="Reportar contenido" onClose={onClose}>
      <p style={{ color: 'var(--fg-3)', marginTop: -10, marginBottom: 18 }}>
        Reportarás "<strong style={{ color: 'var(--fg-2)' }}>{item.titulo}</strong>" al equipo de
        moderación.
      </p>
      <div className="label">Categoría del reporte</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            className={'chip ' + (cat === c.id ? 'accent' : '')}
            onClick={() => setCat(c.id)}
            style={{ cursor: 'pointer', padding: '6px 12px' }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="label">Describe el motivo (mínimo 20 caracteres)</div>
      <textarea
        className="textarea"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        placeholder="Por favor, sé específico sobre lo que viste y por qué consideras que es inapropiado."
        style={{ minHeight: 120 }}
      />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 18 }}>
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          disabled={motivo.length < 20 || create.isPending}
          onClick={send}
        >
          Enviar reporte
        </button>
      </div>
    </Modal>
  )
}
