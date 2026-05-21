import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { CATALOGO, EPISODIOS, RELACIONES } from '../mocks/data'

export function useCatalog() {
  return useQuery({
    queryKey: qk.catalog.all(),
    queryFn: async () => CATALOGO,
    staleTime: 60_000,
  })
}

export function useCatalogItem(id: number | null | undefined) {
  return useQuery({
    queryKey: id != null ? qk.catalog.byId(id) : ['catalog', 'none'],
    queryFn: async () => CATALOGO.find((c) => c.id === id) ?? null,
    enabled: id != null,
  })
}

export function useEpisodes(id: number | null | undefined) {
  return useQuery({
    queryKey: id != null ? qk.catalog.episodes(id) : ['catalog', 'none', 'eps'],
    queryFn: async () => (id != null ? (EPISODIOS[id] ?? null) : null),
    enabled: id != null,
  })
}

export function useRelations() {
  return useQuery({
    queryKey: qk.catalog.relations(),
    queryFn: async () => RELACIONES,
  })
}
