import { useState } from 'react'
import { Icon } from '../../../../components/icons/Icon'
import { OrgChart } from '../components/OrgChart'
import { useDepartments, useEmployees } from '../../../../api/hooks/useEmployees'

export function OrgView() {
  const { data: departments = [] } = useDepartments()
  const { data: employees = [] } = useEmployees()
  const [depFilter, setDepFilter] = useState<number>(1)

  const empsDep = employees.filter((e) => e.departamento === depFilter)
  const empleadosRol = empsDep.filter((e) => e.rol === 'EMPLEADO')
  const activos = empsDep.filter((e) => e.activo).length

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {departments.map((d) => (
          <button
            key={d.id}
            className={'chip ' + (depFilter === d.id ? 'accent' : '')}
            onClick={() => setDepFilter(d.id)}
            style={{ cursor: 'pointer', padding: '8px 14px' }}
          >
            {d.nombre}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button className="btn">
          <Icon.plus style={{ width: 14, height: 14 }} /> Registrar empleado
        </button>
      </div>

      <OrgChart depId={depFilter} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          marginTop: 24,
        }}
      >
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 16px' }}>
            Rendimiento individual
          </h3>
          {empleadosRol.map((e) => (
            <div
              key={e.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderBottom: '1px solid var(--border-soft)',
              }}
            >
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 16 }}>
                {e.nombre[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{e.nombre}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  desde {e.fechaIngreso}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="mono" style={{ fontSize: 13 }}>
                  {5 + (e.id * 7) % 25} publicaciones
                </div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>este trimestre</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 16px' }}>
            Salud del departamento
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              ['Total empleados', empsDep.length],
              ['Empleados activos', activos],
              ['Cobertura de supervisión', '100%'],
              ['Antigüedad promedio', '2.1 años'],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-soft)',
                }}
              >
                <span style={{ color: 'var(--fg-3)' }}>{k}</span>
                <span className="mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
