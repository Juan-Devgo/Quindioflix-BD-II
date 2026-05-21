import { OrgNode } from './OrgNode'
import { useEmployees } from '../../../../api/hooks/useEmployees'

interface OrgChartProps {
  depId: number
}

export function OrgChart({ depId }: OrgChartProps) {
  const { data: employees = [] } = useEmployees()
  const emps = employees.filter((e) => e.departamento === depId)
  const jefe = emps.find((e) => e.rol === 'JEFE')
  const supervisores = emps.filter((e) => e.rol === 'SUPERVISOR')
  const sinSupervisor = emps.filter(
    (e) =>
      e.rol !== 'JEFE' &&
      e.rol !== 'SUPERVISOR' &&
      !supervisores.some((s) => s.id === e.supervisor),
  )

  return (
    <div className="card" style={{ padding: 32 }}>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}
      >
        {jefe && <OrgNode emp={jefe} top />}
        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />
        <div
          style={{
            display: 'flex',
            gap: 32,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {supervisores.length > 0
            ? supervisores.map((s) => {
                const reports = emps.filter((e) => e.supervisor === s.id)
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <OrgNode emp={s} />
                    {reports.length > 0 && (
                      <>
                        <div
                          style={{ width: 1, height: 16, background: 'var(--border)' }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            gap: 12,
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            maxWidth: 360,
                          }}
                        >
                          {reports.map((e) => (
                            <OrgNode key={e.id} emp={e} small />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )
              })
            : sinSupervisor.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {sinSupervisor.map((e) => (
                    <OrgNode key={e.id} emp={e} small />
                  ))}
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
