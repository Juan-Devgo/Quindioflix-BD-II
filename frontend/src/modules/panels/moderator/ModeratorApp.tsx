import { useState } from 'react'
import { Sidebar, type SidebarItem } from '../../../components/Sidebar'
import { Icon } from '../../../components/icons/Icon'
import { UserFooter } from '../_shared/UserFooter'
import { ReportsList } from './components/ReportsList'
import { ReportDetail } from './modals/ReportDetail'
import { useReports } from '../../../api/hooks/useReports'
import { useEmployees } from '../../../api/hooks/useEmployees'
import { useLogout, useSession } from '../../../api/hooks/useAuth'
import type { Reporte, ReporteEstado } from '../../../api/types'

type Filter = ReporteEstado | 'mios'

const TITLES: Record<Filter, string> = {
  PENDIENTE: 'Reportes pendientes',
  EN_REVISION: 'Reportes en revisión',
  RESUELTO: 'Reportes resueltos',
  RECHAZADO: 'Reportes rechazados',
  mios: 'Mis decisiones',
}

export function ModeratorApp() {
  const [filter, setFilter] = useState<Filter>('PENDIENTE')
  const [selected, setSelected] = useState<Reporte | null>(null)
  const { data: session } = useSession()
  const { data: employees = [] } = useEmployees()
  const { data: reportes = [] } = useReports()
  const logout = useLogout()

  const empleado =
    employees.find((e) => e.email === session?.email) ?? employees.find((e) => e.id === 6)

  if (!empleado) return null

  const counts = {
    PENDIENTE: reportes.filter((r) => r.estado === 'PENDIENTE').length,
    EN_REVISION: reportes.filter((r) => r.estado === 'EN_REVISION').length,
    RESUELTO: reportes.filter((r) => r.estado === 'RESUELTO').length,
    RECHAZADO: reportes.filter((r) => r.estado === 'RECHAZADO').length,
  }

  const items: Array<SidebarItem> = [
    { section: 'Cola de moderación' },
    { id: 'PENDIENTE', label: 'Pendientes', icon: Icon.flag, badge: counts.PENDIENTE || undefined },
    {
      id: 'EN_REVISION',
      label: 'En revisión',
      icon: Icon.shield,
      badge: counts.EN_REVISION || undefined,
    },
    { id: 'RESUELTO', label: 'Resueltos', icon: Icon.check },
    { id: 'RECHAZADO', label: 'Rechazados', icon: Icon.close },
    { section: 'Mi historial' },
    { id: 'mios', label: 'Mis decisiones', icon: Icon.list },
  ]

  const list =
    filter === 'mios'
      ? reportes.filter((r) => r.moderador === empleado.id)
      : reportes.filter((r) => r.estado === filter)

  const liveSelected = selected ? reportes.find((r) => r.id === selected.id) ?? selected : null

  const doLogout = () =>
    logout.mutate(undefined, { onSuccess: () => window.location.assign('/') })

  return (
    <div className="app-shell">
      <Sidebar
        items={items}
        active={filter}
        onChange={(v) => setFilter(v as Filter)}
        brandSubtitle="Moderación"
        footer={
          <UserFooter
            name={empleado.nombre}
            subtitle="Soporte · Moderador"
            bg="var(--sky)"
            fg="oklch(0.16 0.01 60)"
            onLogout={doLogout}
          />
        }
      />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 6 }}>
              Panel de moderación
            </div>
            <h1 className="page-title">{TITLES[filter]}</h1>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="kpi" style={{ padding: '10px 18px' }}>
              <div className="kpi-label" style={{ fontSize: 10 }}>
                Pendientes hoy
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  color: 'var(--accent)',
                }}
              >
                {counts.PENDIENTE}
              </div>
            </div>
            <div className="kpi" style={{ padding: '10px 18px' }}>
              <div className="kpi-label" style={{ fontSize: 10 }}>
                Resueltos por mí
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>
                {reportes.filter((r) => r.moderador === empleado.id).length}
              </div>
            </div>
          </div>
        </div>

        <ReportsList reports={list} onOpen={setSelected} />
      </main>

      {liveSelected && (
        <ReportDetail
          report={liveSelected}
          empleadoId={empleado.id}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
