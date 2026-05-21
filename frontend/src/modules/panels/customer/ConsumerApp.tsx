import { useState } from 'react'
import { ConsumerHeader, type ConsumerView } from './ConsumerHeader'
import { ProfileSelector } from './ProfileSelector'
import { InactiveScreen } from './InactiveScreen'
import { HomeView } from './views/HomeView'
import { CategoryView } from './views/CategoryView'
import { SearchView } from './views/SearchView'
import { FavView } from './views/FavView'
import { AccountView } from './views/AccountView'
import { ReferralsView } from './views/ReferralsView'
import { DetailModal } from './modals/DetailModal'
import { ReportModal } from './modals/ReportModal'
import { ChangePlanModal } from './modals/ChangePlanModal'
import { Player } from './components/Player'
import { useCurrentUser, useProfiles, usePlans } from '../../../api/hooks/useUser'
import { useLogout } from '../../../api/hooks/useAuth'
import type { Contenido, Episodio, Perfil } from '../../../api/types'

interface PlayingState {
  item: Contenido
  episodio: (Episodio & { t?: number }) | null
}

interface ConsumerAppProps {
  onLogout?: () => void
}

export function ConsumerApp({ onLogout }: ConsumerAppProps) {
  const usuario = useCurrentUser()
  const { data: profiles = [] } = useProfiles(usuario.id)
  const { data: planes = [] } = usePlans()
  const logout = useLogout()

  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [view, setView] = useState<ConsumerView>('inicio')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<Contenido | null>(null)
  const [playing, setPlaying] = useState<PlayingState | null>(null)
  const [reportingItem, setReportingItem] = useState<Contenido | null>(null)
  const [changingPlan, setChangingPlan] = useState(false)

  const doLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        onLogout?.()
        window.location.assign('/')
      },
    })
  }

  if (usuario.estado === 'INACTIVO') return <InactiveScreen onLogout={doLogout} />

  if (!perfil) {
    const planName = planes.find((p) => p.id === usuario.plan)?.nombre ?? 'Plan'
    return (
      <ProfileSelector
        profiles={profiles}
        accountName={usuario.nombre}
        planName={`Plan ${planName}`}
        onPick={setPerfil}
      />
    )
  }

  const openDetail = (item: Contenido, playNow = false) => {
    if (playNow) {
      setOpen(null)
      setPlaying({ item, episodio: null })
    } else {
      setOpen(item)
    }
  }

  const onPlay = (item: Contenido, episodio?: Episodio & { t?: number }) => {
    setOpen(null)
    setPlaying({ item, episodio: episodio ?? null })
  }

  const effectiveView: ConsumerView = search ? 'search' : view

  return (
    <div>
      <ConsumerHeader
        perfil={perfil}
        onChangeProfile={() => setPerfil(null)}
        onSearch={setSearch}
        view={effectiveView}
        onChangeView={(v) => {
          setSearch('')
          setView(v)
        }}
        onLogout={doLogout}
      />
      <main style={{ padding: '0 40px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {search ? (
          <SearchView query={search} perfil={perfil} onOpen={openDetail} />
        ) : view === 'inicio' ? (
          <HomeView perfil={perfil} onOpen={openDetail} />
        ) : view === 'series' ? (
          <CategoryView tipo="SERIE" perfil={perfil} onOpen={openDetail} title="Series" />
        ) : view === 'peliculas' ? (
          <CategoryView tipo="PELICULA" perfil={perfil} onOpen={openDetail} title="Películas" />
        ) : view === 'documentales' ? (
          <CategoryView tipo="DOCUMENTAL" perfil={perfil} onOpen={openDetail} title="Documentales" />
        ) : view === 'musica' ? (
          <CategoryView tipo="MUSICA" perfil={perfil} onOpen={openDetail} title="Música" />
        ) : view === 'podcasts' ? (
          <CategoryView tipo="PODCAST" perfil={perfil} onOpen={openDetail} title="Podcasts" />
        ) : view === 'favoritos' ? (
          <FavView perfil={perfil} onOpen={openDetail} />
        ) : view === 'cuenta' ? (
          <AccountView usuario={usuario} onChangePlan={() => setChangingPlan(true)} />
        ) : view === 'referidos' ? (
          <ReferralsView usuario={usuario} />
        ) : null}
      </main>

      {open && (
        <DetailModal
          item={open}
          perfil={perfil}
          onClose={() => setOpen(null)}
          onPlay={onPlay}
          onReport={(it) => {
            setOpen(null)
            setReportingItem(it)
          }}
        />
      )}
      {playing && (
        <Player item={playing.item} episodio={playing.episodio} onClose={() => setPlaying(null)} />
      )}
      {reportingItem && (
        <ReportModal
          item={reportingItem}
          perfil={perfil}
          onClose={() => setReportingItem(null)}
        />
      )}
      {changingPlan && <ChangePlanModal usuario={usuario} onClose={() => setChangingPlan(false)} />}
    </div>
  )
}
