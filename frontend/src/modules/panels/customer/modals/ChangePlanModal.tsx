import { useState } from 'react'
import { Modal } from '../../../../components/Modal'
import { useToast } from '../../../../components/Toast'
import { usePlans, useProfiles } from '../../../../api/hooks/useUser'
import { useChangePlan } from '../../../../api/hooks/usePayments'
import { fmtCOP } from '../../../../lib/format'
import type { Usuario } from '../../../../api/types'

interface ChangePlanModalProps {
  usuario: Usuario
  onClose: () => void
}

export function ChangePlanModal({ usuario, onClose }: ChangePlanModalProps) {
  const [sel, setSel] = useState(usuario.plan)
  const toast = useToast()
  const { data: planes = [] } = usePlans()
  const { data: profiles = [] } = useProfiles(usuario.id)
  const change = useChangePlan()
  const perfilesActivos = profiles.filter((p) => p.activo).length

  const confirm = () => {
    change.mutate(
      { userId: usuario.id, planId: sel },
      {
        onSuccess: () => {
          toast('Plan actualizado. El cambio se refleja en el próximo cobro.')
          onClose()
        },
      },
    )
  }

  return (
    <Modal title="Cambiar plan de suscripción" onClose={onClose} maxWidth={720}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {planes.map((p) => {
          const incompat = perfilesActivos > p.max_pantallas
          const isCurrent = p.id === usuario.plan
          const isSel = p.id === sel
          return (
            <div
              key={p.id}
              onClick={() => !incompat && setSel(p.id)}
              className="card"
              style={{
                padding: 20,
                cursor: incompat ? 'not-allowed' : 'pointer',
                borderColor: isSel ? 'var(--accent)' : 'var(--border-soft)',
                background: isSel ? 'var(--bg-2)' : 'var(--bg-1)',
                opacity: incompat ? 0.5 : 1,
                position: 'relative',
              }}
            >
              {isCurrent && (
                <div className="chip sage" style={{ position: 'absolute', top: -10, right: 12 }}>
                  Plan actual
                </div>
              )}
              <div className="display" style={{ fontSize: 26, color: p.color }}>
                {p.nombre}
              </div>
              <div style={{ fontSize: 13, color: 'var(--fg-3)', margin: '4px 0 14px' }}>
                {p.calidad}
              </div>
              <div className="display" style={{ fontSize: 36 }}>
                {fmtCOP(p.precio)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 16 }}>/ mes</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
                <li style={{ padding: '6px 0', color: 'var(--fg-2)' }}>
                  ✓ Hasta {p.max_pantallas} {p.max_pantallas === 1 ? 'pantalla' : 'pantallas'}
                </li>
                <li style={{ padding: '6px 0', color: 'var(--fg-2)' }}>✓ Calidad {p.calidad}</li>
                <li style={{ padding: '6px 0', color: 'var(--fg-2)' }}>✓ Sin anuncios</li>
              </ul>
              {incompat && (
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--rose)',
                    marginTop: 10,
                    padding: 8,
                    background: 'var(--rose-soft)',
                    borderRadius: 6,
                  }}
                >
                  Tienes {perfilesActivos} perfiles activos. Desactiva al menos{' '}
                  {perfilesActivos - p.max_pantallas} para bajar a este plan.
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={onClose}>
          Cancelar
        </button>
        <button
          className="btn btn-primary"
          disabled={sel === usuario.plan || change.isPending}
          onClick={confirm}
        >
          Confirmar cambio
        </button>
      </div>
    </Modal>
  )
}
