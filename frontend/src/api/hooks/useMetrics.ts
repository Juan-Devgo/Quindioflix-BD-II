import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { METRICAS } from '../mocks/data'

export function useMetrics() {
  return useQuery({ queryKey: qk.metrics(), queryFn: async () => METRICAS })
}
