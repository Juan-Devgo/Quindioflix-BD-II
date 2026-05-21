import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '../query-keys'
import type { CalificacionesMap } from '../types'

const store: Map<number, CalificacionesMap> = new Map()

function getProfileMap(profileId: number): CalificacionesMap {
  let m = store.get(profileId)
  if (!m) {
    m = {}
    store.set(profileId, m)
  }
  return m
}

export function useRatings(profileId: number | undefined) {
  return useQuery({
    queryKey: profileId != null ? qk.ratings(profileId) : ['ratings', 'none'],
    queryFn: async () => (profileId != null ? { ...getProfileMap(profileId) } : {}),
    enabled: profileId != null,
  })
}

export interface RateInput {
  profileId: number
  contentId: number
  stars: number
  resena: string
}

export function useRateContent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ profileId, contentId, stars, resena }: RateInput) => {
      const m = getProfileMap(profileId)
      m[contentId] = { stars, resena, fecha: new Date().toISOString().slice(0, 10) }
    },
    onSuccess: (_d, { profileId }) => {
      qc.invalidateQueries({ queryKey: qk.ratings(profileId) })
    },
  })
}
