import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { GENEROS } from '../mocks/data'

export function useGenres() {
  return useQuery({ queryKey: qk.genres(), queryFn: async () => GENEROS, staleTime: Infinity })
}
