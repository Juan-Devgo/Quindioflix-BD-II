import { useDepartments, useTeam } from '../../../../api/hooks/useEmployees'
import type { Empleado } from '../../../../api/types'

interface TeamViewProps {
  empleadoId: number
}

export function TeamView({ empleadoId }: TeamViewProps) {
  const { data } = useTeam(empleadoId)
  const { data: departments = [] } = useDepartments()
  if (!data) return null
  const { supervisor, peers } = data

  return (
    <div className="card" style={{ padding: 28 }}>
      <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
        Tu cadena de mando
      </h3>
      {supervisor && (
        <div style={{ marginBottom: 24 }}>
          <div className="upper" style={{ color: 'var(--fg-4)' }}>
            Supervisor directo
          </div>
          <PersonRow emp={supervisor} departments={departments} highlight />
        </div>
      )}
      <div>
        <div className="upper" style={{ color: 'var(--fg-4)' }}>
          Compañeros de equipo
        </div>
        {peers.map((c) => (
          <PersonRow key={c.id} emp={c} departments={departments} />
        ))}
      </div>
    </div>
  )
}

function PersonRow({
  emp,
  departments,
  highlight,
}: {
  emp: Empleado
  departments: Array<{ id: number; nombre: string }>
  highlight?: boolean
}) {
  const dep = departments.find((d) => d.id === emp.departamento)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: 14,
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div
        className="avatar"
        style={{
          background: highlight ? 'var(--accent)' : 'var(--bg-3)',
          color: highlight ? 'oklch(0.16 0.01 60)' : 'var(--fg)',
        }}
      >
        {emp.nombre[0]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14 }}>{emp.nombre}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>
          {dep?.nombre ?? '—'} · {emp.rol}
        </div>
      </div>
      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-4)' }}>
        {emp.email}
      </span>
    </div>
  )
}
