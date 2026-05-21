import { useState } from 'react'
import { Sidebar, type SidebarItem } from '../../../components/Sidebar'
import { Icon } from '../../../components/icons/Icon'
import { UserFooter } from '../_shared/UserFooter'
import { ExecutiveDashboard } from './views/ExecutiveDashboard'
import { ConsumoReport } from './views/ConsumoReport'
import { IngresosReport } from './views/IngresosReport'
import { MarketingReport } from './views/MarketingReport'
import { OrgView } from './views/OrgView'
import { ModerationOverview } from './views/ModerationOverview'
import { useEmployees } from '../../../api/hooks/useEmployees'
import { useLogout, useSession } from '../../../api/hooks/useAuth'

type View =
  | 'dashboard'
  | 'consumo'
  | 'ingresos'
  | 'marketing'
  | 'equipo'
  | 'moderacion'

const TITLES: Record<View, string> = {
  dashboard: 'Vista ejecutiva',
  consumo: 'Análisis de consumo',
  ingresos: 'Reporte financiero',
  marketing: 'Programa de referidos',
  equipo: 'Equipo y jerarquía',
  moderacion: 'Moderación de reportes',
}

const ITEMS: Array<SidebarItem> = [
  { section: 'Análisis' },
  { id: 'dashboard', label: 'Dashboard ejecutivo', icon: Icon.chart },
  { id: 'consumo', label: 'Consumo', icon: Icon.film },
  { id: 'ingresos', label: 'Ingresos', icon: Icon.card },
  { id: 'marketing', label: 'Referidos y marketing', icon: Icon.gift },
  { section: 'Operación' },
  { id: 'equipo', label: 'Equipo y jerarquía', icon: Icon.org },
  { id: 'moderacion', label: 'Reportes y moderación', icon: Icon.shield },
]

export function ManagementApp() {
  const [view, setView] = useState<View>('dashboard')
  const { data: session } = useSession()
  const { data: employees = [] } = useEmployees()
  const logout = useLogout()

  const empleado =
    employees.find((e) => e.email === session?.email) ?? employees.find((e) => e.id === 1)
  if (!empleado) return null

  const doLogout = () =>
    logout.mutate(undefined, { onSuccess: () => window.location.assign('/') })

  return (
    <div className="app-shell">
      <Sidebar
        items={ITEMS}
        active={view}
        onChange={(v) => setView(v as View)}
        brandSubtitle="Gerencia"
        footer={
          <UserFooter
            name={empleado.nombre}
            subtitle={empleado.rol === 'JEFE' ? 'Jefa de Contenido' : `Gerencia · ${empleado.rol}`}
            bg="oklch(0.78 0.135 320)"
            fg="oklch(0.16 0.01 60)"
            onLogout={doLogout}
          />
        }
      />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 6 }}>
              Centro de operaciones
            </div>
            <h1 className="page-title">{TITLES[view]}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select className="select" style={{ width: 160 }}>
              <option>Últimos 30 días</option>
              <option>Últimos 90 días</option>
              <option>Este año</option>
            </select>
            <button className="btn">
              <Icon.list style={{ width: 14, height: 14 }} /> Exportar
            </button>
          </div>
        </div>

        {view === 'dashboard' && <ExecutiveDashboard />}
        {view === 'consumo' && <ConsumoReport />}
        {view === 'ingresos' && <IngresosReport />}
        {view === 'marketing' && <MarketingReport />}
        {view === 'equipo' && <OrgView />}
        {view === 'moderacion' && <ModerationOverview />}
      </main>
    </div>
  )
}
