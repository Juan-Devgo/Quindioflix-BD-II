import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { REPRODUCCIONES } from '../mocks/data'

export function useRecentPlays(profileId: number | undefined) {
  return useQuery({
    queryKey: profileId != null ? qk.playback(profileId) : ['playback', 'none'],
    queryFn: async () => REPRODUCCIONES.filter((r) => r.idPerfil === profileId),
    enabled: profileId != null,
  })
}
