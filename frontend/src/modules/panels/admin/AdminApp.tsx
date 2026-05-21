import { useState } from 'react'
import { Sidebar, type SidebarItem } from '../../../components/Sidebar'
import { Icon } from '../../../components/icons/Icon'
import { UserFooter } from '../_shared/UserFooter'
import { useLogout, useSession } from '../../../api/hooks/useAuth'

// TODO: backend has no separate "admin" role yet — scope to be confirmed.
// Placeholder shell reuses the Management visual language.

type View = 'overview' | 'users' | 'settings'

const ITEMS: Array<SidebarItem> = [
  { section: 'Administración' },
  { id: 'overview', label: 'Resumen', icon: Icon.chart },
  { id: 'users', label: 'Usuarios del sistema', icon: Icon.user },
  { id: 'settings', label: 'Configuración', icon: Icon.list },
]

const TITLES: Record<View, string> = {
  overview: 'Resumen administrativo',
  users: 'Usuarios del sistema',
  settings: 'Configuración global',
}

export function AdminApp() {
  const [view, setView] = useState<View>('overview')
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
        brandSubtitle="Admin"
        footer={
          <UserFooter
            name={session?.nombre ?? 'Admin'}
            subtitle="Administración"
            bg="oklch(0.55 0.02 60)"
            onLogout={doLogout}
          />
        }
      />
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: 'var(--fg-3)', marginBottom: 6 }}>
              Panel de administración
            </div>
            <h1 className="page-title">{TITLES[view]}</h1>
          </div>
        </div>

        <div
          className="card"
          style={{
            padding: 60,
            textAlign: 'center',
            color: 'var(--fg-3)',
          }}
        >
          <Icon.shield
            style={{ width: 48, height: 48, opacity: 0.4, marginBottom: 16 }}
          />
          <h3
            className="display"
            style={{ fontSize: 22, margin: '0 0 8px', color: 'var(--fg-2)' }}
          >
            Panel pendiente de definición
          </h3>
          <p style={{ margin: 0, fontSize: 13, maxWidth: 460, marginInline: 'auto' }}>
            El alcance del rol <span className="mono">admin</span> se confirmará una vez el
            backend defina sus permisos. Por ahora, este panel sirve como contenedor.
          </p>
        </div>
      </main>
    </div>
  )
}
