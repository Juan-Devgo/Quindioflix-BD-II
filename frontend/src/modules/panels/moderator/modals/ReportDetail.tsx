import { useState } from 'react'
import { Modal } from '../../../../components/Modal'
import { Icon } from '../../../../components/icons/Icon'
import { useCatalogItem } from '../../../../api/hooks/useCatalog'
import { useEmployees } from '../../../../api/hooks/useEmployees'
import { useProfileById } from '../../../../api/hooks/useUser'
import { useResolveReport, useTakeReport } from '../../../../api/hooks/useReports'
import type { Reporte } from '../../../../api/types'

interface ReportDetailProps {
  report: Reporte
  empleadoId: number
  onClose: () => void
}

type Decision = 'RESUELTO' | 'RECHAZADO'

export function ReportDetail({ report, empleadoId, onClose }: ReportDetailProps) {
  const [decision, setDecision] = useState<Decision>('RESUELTO')
  const [comentario, setComentario] = useState('')
  const { data: item } = useCatalogItem(report.idContenido)
  const { data: perfil } = useProfileById(report.idPerfil)
  const { data: employees = [] } = useEmployees()
  const take = useTakeReport()
  const resolve = useResolveReport()

  const moderador = employees.find((e) => e.id === report.moderador)

  const onTake = () => {
    take.mutate({ reportId: report.id, moderatorId: empleadoId })
  }

  const onResolve = () => {
    resolve.mutate(
      { reportId: report.id, moderatorId: empleadoId, estado: decision, comentario },
      { onSuccess: onClose },
    )
  }

  return (
    <Modal title={`Reporte #${String(report.id).padStart(4, '0')}`} onClose={onClose} maxWidth={680}>
      <div style={{ display: 'flex', gap: 18, marginBottom: 20 }}>
        <div
          style={{
            width: 90,
            height: 130,
            borderRadius: 8,
            background: item?.gradient ?? 'var(--bg-2)',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 className="display" style={{ fontSize: 26, margin: '0 0 6px' }}>
            {item?.titulo ?? '—'}
          </h3>
          {item && (
            <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--fg-3)' }}>
              <span>{item.tipo}</span>
              <span>·</span>
              <span className="mono">{item.clasif}</span>
              <span>·</span>
              <span>{item.anio}</span>
            </div>
          )}
          {item && (
            <div className="chip" style={{ marginTop: 10, padding: '3px 10px' }}>
              {item.generos.join(' · ')}
            </div>
          )}
        </div>
      </div>

      <div
        className="card"
        style={{ padding: 16, background: 'var(--bg-2)', marginBottom: 18 }}
      >
        <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 8 }}>
          Motivo del reporte
        </div>
        <p style={{ margin: 0, fontSize: 14 }}>{report.motivo}</p>
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 12,
            fontSize: 12,
            color: 'var(--fg-3)',
          }}
        >
          <span>
            Reportado por perfil{' '}
            <strong style={{ color: 'var(--fg-2)' }}>{perfil?.nombre ?? '—'}</strong>
          </span>
          <span className="mono">{report.fechaReporte}</span>
        </div>
      </div>

      {report.estado === 'PENDIENTE' && (
        <div
          style={{
            textAlign: 'center',
            padding: 20,
            background: 'var(--accent-soft)',
            borderRadius: 'var(--r-md)',
          }}
        >
          <p style={{ margin: '0 0 14px', color: 'var(--fg-2)' }}>
            Este reporte no ha sido tomado. Asígnatelo para revisarlo.
          </p>
          <button className="btn btn-primary" onClick={onTake} disabled={take.isPending}>
            Tomar reporte
          </button>
        </div>
      )}

      {report.estado === 'EN_REVISION' && report.moderador === empleadoId && (
        <>
          <div style={{ marginBottom: 14 }}>
            <span className="label">Decisión</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={'chip ' + (decision === 'RESUELTO' ? 'sage' : '')}
                onClick={() => setDecision('RESUELTO')}
                style={{ cursor: 'pointer', padding: '8px 14px' }}
              >
                <Icon.check style={{ width: 14, height: 14 }} /> RESUELTO — Aplica
              </button>
              <button
                className={'chip ' + (decision === 'RECHAZADO' ? 'rose' : '')}
                onClick={() => setDecision('RECHAZADO')}
                style={{ cursor: 'pointer', padding: '8px 14px' }}
              >
                <Icon.close style={{ width: 14, height: 14 }} /> RECHAZADO — No procede
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span className="label">Comentario de resolución</span>
            <textarea
              className="textarea"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Justifica tu decisión y las acciones tomadas (reclasificación, retiro del catálogo, etc.)"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              disabled={comentario.length < 10 || resolve.isPending}
              onClick={onResolve}
            >
              Registrar decisión
            </button>
          </div>
        </>
      )}

      {(report.estado === 'RESUELTO' || report.estado === 'RECHAZADO') && (
        <div className="card" style={{ padding: 16, background: 'var(--bg-2)' }}>
          <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 8 }}>
            Resolución
          </div>
          <div
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <span className={'chip ' + (report.estado === 'RESUELTO' ? 'sage' : 'rose')}>
              {report.estado}
            </span>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>
              por <strong style={{ color: 'var(--fg-2)' }}>{moderador?.nombre ?? '—'}</strong>
            </span>
            <span
              className="mono"
              style={{ fontSize: 12, color: 'var(--fg-4)', marginLeft: 'auto' }}
            >
              {report.fechaResolucion}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>{report.comentarioResolucion}</p>
        </div>
      )}
    </Modal>
  )
}
