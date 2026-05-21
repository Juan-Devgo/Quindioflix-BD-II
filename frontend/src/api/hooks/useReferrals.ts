import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { REFERIDOS, USUARIOS } from '../mocks/data'

export function useReferrals(userId: number | undefined) {
  return useQuery({
    queryKey: userId != null ? qk.referrals(userId) : ['referrals', 'none'],
    queryFn: async () => {
      const refs = REFERIDOS.filter((r) => r.idReferidor === userId)
      return refs.map((r) => {
        const u = USUARIOS.find((x) => x.id === r.idNuevo)
        return { ...r, nombre: u?.nombre ?? r.nombreNuevo ?? 'Invitado' }
      })
    },
    enabled: userId != null,
  })
}
