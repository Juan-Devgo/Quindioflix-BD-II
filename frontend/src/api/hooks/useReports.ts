import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { REPORTES } from '../mocks/data'
import type { Reporte, ReporteEstado } from '../types'

let store: Array<Reporte> = [...REPORTES]

export function useReports() {
  return useQuery({
    queryKey: qk.reports.all(),
    queryFn: async () => [...store],
  })
}

export interface CreateReportInput {
  idPerfil: number
  idContenido: number
  motivo: string
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateReportInput) => {
      const next: Reporte = {
        id: Math.max(0, ...store.map((r) => r.id)) + 1,
        idPerfil: input.idPerfil,
        idContenido: input.idContenido,
        fechaReporte: new Date().toISOString().slice(0, 16).replace('T', ' '),
        estado: 'PENDIENTE',
        motivo: input.motivo,
        moderador: null,
      }
      store = [next, ...store]
      return next
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.reports.all() }),
  })
}

export interface TakeReportInput {
  reportId: number
  moderatorId: number
}

export function useTakeReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ reportId, moderatorId }: TakeReportInput) => {
      store = store.map((r) =>
        r.id === reportId ? { ...r, estado: 'EN_REVISION' as ReporteEstado, moderador: moderatorId } : r,
      )
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.reports.all() }),
  })
}

export interface ResolveReportInput {
  reportId: number
  moderatorId: number
  estado: 'RESUELTO' | 'RECHAZADO'
  comentario: string
}

export function useResolveReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ reportId, moderatorId, estado, comentario }: ResolveReportInput) => {
      store = store.map((r) =>
        r.id === reportId
          ? {
              ...r,
              estado,
              moderador: moderatorId,
              comentarioResolucion: comentario,
              fechaResolucion: new Date().toISOString().slice(0, 16).replace('T', ' '),
            }
          : r,
      )
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.reports.all() }),
  })
}
