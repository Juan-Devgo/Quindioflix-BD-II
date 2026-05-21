import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { PAGOS } from '../mocks/data'

export function usePaymentHistory(userId: number | undefined) {
  return useQuery({
    queryKey: userId != null ? qk.payments(userId) : ['payments', 'none'],
    queryFn: async () => PAGOS.filter((p) => p.idUsuario === userId),
    enabled: userId != null,
  })
}

export interface ChangePlanInput {
  userId: number
  planId: number
}

export function useChangePlan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (_: ChangePlanInput) => {
      await new Promise((r) => setTimeout(r, 300))
    },
    onSuccess: (_d, { userId }) => qc.invalidateQueries({ queryKey: qk.user(userId) }),
  })
}
