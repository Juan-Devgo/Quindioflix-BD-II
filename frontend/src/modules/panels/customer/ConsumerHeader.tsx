import { useState } from 'react'
import { Brand } from '../../../components/Brand'
import { Icon } from '../../../components/icons/Icon'
import type { Perfil } from '../../../api/types'

export type ConsumerView =
  | 'inicio'
  | 'series'
  | 'peliculas'
  | 'documentales'
  | 'musica'
  | 'podcasts'
  | 'favoritos'
  | 'cuenta'
  | 'referidos'
  | 'search'

const TABS: Array<{ id: ConsumerView; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'series', label: 'Series' },
  { id: 'peliculas', label: 'Películas' },
  { id: 'documentales', label: 'Documentales' },
  { id: 'musica', label: 'Música' },
  { id: 'podcasts', label: 'Podcasts' },
  { id: 'favoritos', label: 'Mi lista' },
  { id: 'cuenta', label: 'Cuenta' },
]

interface ConsumerHeaderProps {
  perfil: Perfil
  view: ConsumerView
  onChangeProfile: () => void
  onChangeView: (v: ConsumerView) => void
  onSearch: (q: string) => void
  onLogout: () => void
}

export function ConsumerHeader({
  perfil,
  view,
  onChangeProfile,
  onChangeView,
  onSearch,
  onLogout,
}: ConsumerHeaderProps) {
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'oklch(0.12 0.008 60 / 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-soft)',
        padding: '14px 40px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
        <Brand size="sm" />
        <nav style={{ display: 'flex', gap: 4, flex: 1 }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChangeView(t.id)}
              style={{
                background: 'transparent',
                border: 0,
                padding: '8px 14px',
                color: view === t.id ? 'var(--accent)' : 'var(--fg-2)',
                fontSize: 14,
                fontWeight: view === t.id ? 600 : 400,
                cursor: 'pointer',
                borderRadius: 6,
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Icon.search
            style={{
              width: 16,
              height: 16,
              position: 'absolute',
              left: 10,
              color: 'var(--fg-3)',
            }}
          />
          <input
            className="input"
            placeholder="Buscar título, género, director…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              onSearch(e.target.value)
            }}
            style={{ paddingLeft: 32, width: 280, fontSize: 13 }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: perfil.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              color: 'oklch(0.16 0.01 60)',
              cursor: 'pointer',
            }}
          >
            {perfil.avatar}
          </div>
          {menuOpen && (
            <div
              onClick={() => setMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 50 }}
            />
          )}
          {menuOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: 48,
                width: 220,
                padding: 8,
                zIndex: 60,
                boxShadow: 'var(--shadow-pop)',
              }}
            >
              <div
                style={{
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--border-soft)',
                  marginBottom: 6,
                }}
              >
                <div style={{ fontSize: 13, color: 'var(--fg)' }}>{perfil.nombre}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  {perfil.tipo === 'INFANTIL' ? 'Perfil infantil' : 'Perfil adulto'}
                </div>
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  onChangeProfile()
                  setMenuOpen(false)
                }}
              >
                <Icon.user /> <span>Cambiar de perfil</span>
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  onChangeView('cuenta')
                  setMenuOpen(false)
                }}
              >
                <Icon.card /> <span>Cuenta y facturación</span>
              </div>
              <div
                className="nav-item"
                onClick={() => {
                  onChangeView('referidos')
                  setMenuOpen(false)
                }}
              >
                <Icon.gift /> <span>Programa de referidos</span>
              </div>
              <div className="nav-item" onClick={onLogout}>
                <Icon.logout /> <span>Cerrar sesión</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
