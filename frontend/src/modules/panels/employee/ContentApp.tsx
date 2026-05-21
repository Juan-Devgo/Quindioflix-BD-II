import { useState } from 'react'
import { Sidebar, type SidebarItem } from '../../../components/Sidebar'
import { Icon } from '../../../components/icons/Icon'
import { UserFooter } from '../_shared/UserFooter'
import { CatalogManager } from './views/CatalogManager'
import { SeriesManager } from './views/SeriesManager'
import { RelationsManager } from './views/RelationsManager'
import { MyPerformance } from './views/MyPerformance'
import { TeamView } from './views/TeamView'
import { ContentDetailDrawer } from './modals/ContentDetailDrawer'
import { NewContentModal } from './modals/NewContentModal'
import { useEmployees } from '../../../api/hooks/useEmployees'
import { useLogout, useSession } from '../../../api/hooks/useAuth'
import type { Contenido } from '../../../api/types'

type View = 'catalogo' | 'nuevos' | 'series' | 'relaciones' | 'rendimiento' | 'equipo'

const ITEMS: Array<SidebarItem> = [
  { section: 'Catálogo' },
  { id: 'catalogo', label: 'Todos los títulos', icon: Icon.film },
  { id: 'nuevos', label: 'Recién agregados', icon: Icon.plus },
  { id: 'series', label: 'Series y podcasts', icon: Icon.list },
  { id: 'relaciones', label: 'Relaciones', icon: Icon.org },
  { section: 'Operación' },
  { id: 'rendimiento', label: 'Mi rendimiento', icon: Icon.chart },
  { id: 'equipo', label: 'Mi equipo', icon: Icon.user },
]

const TITLES: Record<View, string> = {
  catalogo: 'Catálogo',
  nuevos: 'Recién agregados',
  series: 'Series y podcasts',
  relaciones: 'Relaciones entre contenidos',
  rendimiento: 'Mi rendimiento',
  equipo: 'Mi equipo',
}

export function ContentApp() {
  const [view, setView] = useState<View>('catalogo')
  const [selected, setSelected] = useState<Contenido | null>(null)
  const [newContent, setNewContent] = useState(false)
  const { data: session } = useSession()
  const { data: employees = [] } = useEmployees()
  const logout = useLogout()
  const empleado =
    employees.find((e) => e.email === session?.email) ?? employees.find((e) => e.id === 3) // Daniela fallback

  if (!empleado) return null

  const doLogout = () => logout.mutate(undefined, { onSuccess: () => window.location.assign('/') })

  return (
    <div className="app-shell">
      <Sidebar
        items={ITEMS}
        active={view}
        onChange={(v) => setView(v as View)}
        brandSubtitle="Contenido"
        footer={
          <UserFooter
            name={empleado.nombre}
            subtitle={`Contenido · ${empleado.rol}`}
            bg="var(--sage)"
            fg="oklch(0.16 0.01 60)"
            onLogout={doLogout}
          />
        }
      />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 6 }}>
              Panel de contenido
            </div>
            <h1 className="page-title">{TITLES[view]}</h1>
          </div>
          {(view === 'catalogo' || view === 'nuevos') && (
            <button className="btn btn-primary" onClick={() => setNewContent(true)}>
              <Icon.plus style={{ width: 14, height: 14 }} /> Registrar contenido
            </button>
          )}
        </div>

        {(view === 'catalogo' || view === 'nuevos') && (
          <CatalogManager onOpen={setSelected} mode={view} />
        )}
        {view === 'series' && <SeriesManager />}
        {view === 'relaciones' && <RelationsManager />}
        {view === 'rendimiento' && <MyPerformance />}
        {view === 'equipo' && <TeamView empleadoId={empleado.id} />}
      </main>

      {selected && <ContentDetailDrawer item={selected} onClose={() => setSelected(null)} />}
      {newContent && <NewContentModal onClose={() => setNewContent(false)} />}
    </div>
  )
}
