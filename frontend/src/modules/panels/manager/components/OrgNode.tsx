import type { Empleado } from '../../../../api/types'

interface OrgNodeProps {
  emp: Empleado
  top?: boolean
  small?: boolean
}

export function OrgNode({ emp, top, small }: OrgNodeProps) {
  const w = top ? 220 : small ? 150 : 180
  return (
    <div
      className="card"
      style={{
        padding: small ? 12 : 16,
        textAlign: 'center',
        width: w,
        background: top
          ? 'linear-gradient(150deg, oklch(0.30 0.08 75), var(--bg-2))'
          : 'var(--bg-2)',
        borderColor: top ? 'var(--accent)' : 'var(--border-soft)',
      }}
    >
      <div
        className="avatar"
        style={{
          margin: '0 auto 8px',
          width: small ? 32 : 40,
          height: small ? 32 : 40,
          fontSize: small ? 14 : 18,
        }}
      >
        {emp.nombre[0]}
      </div>
      <div style={{ fontSize: small ? 12 : 14, marginBottom: 4 }}>{emp.nombre}</div>
      <div className="chip" style={{ fontSize: 10, padding: '2px 8px' }}>
        {emp.rol}
      </div>
    </div>
  )
}
