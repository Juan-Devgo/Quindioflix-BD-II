import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { FAVORITOS } from '../mocks/data'
import type { Favorito } from '../types'

let store: Array<Favorito> = [...FAVORITOS]

export function useFavorites(profileId: number | undefined) {
  return useQuery({
    queryKey: profileId != null ? qk.favorites(profileId) : ['favorites', 'none'],
    queryFn: async () => store.filter((f) => f.idPerfil === profileId),
    enabled: profileId != null,
  })
}

export interface ToggleFavInput {
  profileId: number
  contentId: number
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ profileId, contentId }: ToggleFavInput) => {
      const exists = store.find((f) => f.idPerfil === profileId && f.idContenido === contentId)
      if (exists) {
        store = store.filter((f) => !(f.idPerfil === profileId && f.idContenido === contentId))
        return { removed: true }
      }
      store = [
        ...store,
        { idPerfil: profileId, idContenido: contentId, fecha: new Date().toISOString().slice(0, 10) },
      ]
      return { removed: false }
    },
    onSuccess: (_d, { profileId }) => {
      qc.invalidateQueries({ queryKey: qk.favorites(profileId) })
    },
  })
}
