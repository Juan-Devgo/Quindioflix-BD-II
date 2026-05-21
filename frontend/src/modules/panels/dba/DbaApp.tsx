import { useState } from 'react'
import { Sidebar, type SidebarItem } from '../../../components/Sidebar'
import { Icon } from '../../../components/icons/Icon'
import { UserFooter } from '../_shared/UserFooter'
import { DbaSchemas } from './views/DbaSchemas'
import { DbaUsers } from './views/DbaUsers'
import { DbaTablespaces } from './views/DbaTablespaces'
import { DbaPerf } from './views/DbaPerf'
import { DbaBackups } from './views/DbaBackups'
import { useLogout, useSession } from '../../../api/hooks/useAuth'

type View = 'esquemas' | 'usuarios' | 'tablespaces' | 'rendimiento' | 'respaldos'

const ITEMS: Array<SidebarItem> = [
  { section: 'Infraestructura' },
  { id: 'esquemas', label: 'Esquemas', icon: Icon.db },
  { id: 'usuarios', label: 'Usuarios y roles', icon: Icon.user },
  { id: 'tablespaces', label: 'Tablespaces', icon: Icon.list },
  { section: 'Monitoreo' },
  { id: 'rendimiento', label: 'Rendimiento', icon: Icon.chart },
  { id: 'respaldos', label: 'Respaldos', icon: Icon.shield },
]

const TITLES: Record<View, string> = {
  esquemas: 'Esquemas',
  usuarios: 'Usuarios y roles',
  tablespaces: 'Tablespaces',
  rendimiento: 'Rendimiento',
  respaldos: 'Respaldos',
}

export function DbaApp() {
  const [view, setView] = useState<View>('esquemas')
  const { data: session } = useSession()
  const logout = useLogout()

  const doLogout = () =>
    logout.mutate(undefined, { onSuccess: () => window.location.assign('/') })

  return (
    <div className="app-shell">
      <Sidebar
        items={ITEMS}
        active={view}
        onChange={(v) => setView(v as View)}
        brandSubtitle="DBA"
        footer={
          <UserFooter
            name={session?.nombre ?? 'sys'}
            subtitle="qf_prod_pdb"
            initial="DB"
            bg="oklch(0.55 0.02 60)"
            onLogout={doLogout}
          />
        }
      />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 6 }}>
              Administrador de base de datos
            </div>
            <h1 className="page-title">{TITLES[view]}</h1>
          </div>
          <div className="chip sage" style={{ padding: '6px 14px' }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--sage)',
              }}
            />
            DB en línea — 99.97%
          </div>
        </div>

        {view === 'esquemas' && <DbaSchemas />}
        {view === 'usuarios' && <DbaUsers />}
        {view === 'tablespaces' && <DbaTablespaces />}
        {view === 'rendimiento' && <DbaPerf />}
        {view === 'respaldos' && <DbaBackups />}
      </main>
    </div>
  )
}
