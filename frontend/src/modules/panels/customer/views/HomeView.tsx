import { useMemo } from 'react'
import { Hero } from '../components/Hero'
import { Row } from '../components/Row'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import { useFavorites, useToggleFavorite } from '../../../../api/hooks/useFavorites'
import { useRecentPlays } from '../../../../api/hooks/usePlayback'
import type { Contenido, Perfil } from '../../../../api/types'

interface HomeViewProps {
  perfil: Perfil
  onOpen: (item: Contenido, playNow?: boolean) => void
}

export function HomeView({ perfil, onOpen }: HomeViewProps) {
  const { data: catalog = [] } = useCatalog()
  const { data: favorites = [] } = useFavorites(perfil.id)
  const { data: repros = [] } = useRecentPlays(perfil.id)
  const toggleFav = useToggleFavorite()

  const allowed = (it: Contenido) =>
    perfil.tipo !== 'INFANTIL' || ['TP', '+7', '+13'].includes(it.clasif)

  const cat = useMemo(() => catalog.filter(allowed), [catalog, perfil.tipo])
  const hero = cat[1] ?? cat[0]
  const continuando = repros
    .filter((r) => r.avance < 100 && r.idContenido != null)
    .map((r) => cat.find((c) => c.id === r.idContenido))
    .filter((x): x is Contenido => !!x)

  const getProgress = (item: Contenido): number | undefined => {
    const r = repros.find((rr) => rr.idContenido === item.id && rr.avance < 100)
    return r?.avance
  }

  if (!hero) return null
  const isFav = favorites.some((f) => f.idContenido === hero.id)

  return (
    <div>
      <Hero
        item={hero}
        isFav={isFav}
        onOpen={() => onOpen(hero)}
        onPlay={() => onOpen(hero, true)}
        onFav={() => toggleFav.mutate({ profileId: perfil.id, contentId: hero.id })}
      />
      {continuando.length > 0 && (
        <Row title="Continúa viendo" items={continuando} onOpen={onOpen} getProgress={getProgress} />
      )}
      <Row title="Originales QuindioFlix" items={cat.filter((c) => c.original)} onOpen={onOpen} />
      <Row
        title="Tendencias en Colombia"
        items={[...cat].sort((a, b) => b.vistas - a.vistas).slice(0, 8)}
        onOpen={onOpen}
      />
      <Row
        title="Series del Eje Cafetero"
        items={cat.filter((c) => c.tipo === 'SERIE')}
        onOpen={onOpen}
      />
      <Row
        title="Documentales y miradas reales"
        items={cat.filter((c) => c.tipo === 'DOCUMENTAL' || c.tipo === 'PODCAST')}
        onOpen={onOpen}
      />
      <Row
        title="Recién agregados"
        items={[...cat].sort((a, b) => b.fechaCatalogo.localeCompare(a.fechaCatalogo)).slice(0, 8)}
        onOpen={onOpen}
      />
    </div>
  )
}
