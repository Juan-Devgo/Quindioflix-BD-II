import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { CIUDADES, PERFILES, PLANES, USUARIOS } from '../mocks/data'
import { useSession } from './useAuth'

export function useUser(userId: number | undefined) {
  return useQuery({
    queryKey: userId != null ? qk.user(userId) : ['user', 'none'],
    queryFn: async () => USUARIOS.find((u) => u.id === userId) ?? null,
    enabled: userId != null,
  })
}

export function useCurrentUser() {
  const { data: session } = useSession()
  const candidate = session ? USUARIOS.find((u) => u.email === session.email) : null
  const fallback = USUARIOS[0]
  return candidate ?? fallback
}

export function useProfiles(userId: number | undefined) {
  return useQuery({
    queryKey: userId != null ? qk.profiles(userId) : ['profiles', 'none'],
    queryFn: async () => PERFILES.filter((p) => p.idUsuario === userId),
    enabled: userId != null,
  })
}

export function useProfileById(profileId: number | null | undefined) {
  return useQuery({
    queryKey: ['profile', profileId ?? 'none'],
    queryFn: async () => PERFILES.find((p) => p.id === profileId) ?? null,
    enabled: profileId != null,
  })
}

export function usePlans() {
  return useQuery({ queryKey: qk.plans(), queryFn: async () => PLANES, staleTime: Infinity })
}

export function useCities() {
  return useQuery({ queryKey: qk.cities(), queryFn: async () => CIUDADES, staleTime: Infinity })
}
