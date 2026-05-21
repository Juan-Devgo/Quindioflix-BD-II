import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { clearSession, loadSession, saveSession } from '../../lib/auth'
import { CREDENCIALES } from '../mocks/credentials'
import type { SessionUser } from '../types'

export function useSession() {
  return useQuery({
    queryKey: qk.session(),
    queryFn: async () => loadSession(),
    staleTime: Infinity,
  })
}

export interface LoginInput {
  email: string
  password: string
}

export function useLogin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ email, password }: LoginInput) => {
      await new Promise((r) => setTimeout(r, 400))
      const user = CREDENCIALES.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
      )
      if (!user) throw new Error('Credenciales inválidas. Verifica tu email y contraseña.')
      const session: SessionUser = {
        email: user.email,
        role: user.role,
        nombre: user.nombre,
        desc: user.desc,
      }
      saveSession(session)
      return session
    },
    onSuccess: (session) => {
      qc.setQueryData(qk.session(), session)
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      clearSession()
    },
    onSuccess: () => {
      qc.setQueryData(qk.session(), null)
      qc.clear()
    },
  })
}

export interface RegisterInput {
  nombre: string
  email: string
  telefono?: string
  fechaNacimiento: string
  ciudad: number
  password: string
  plan: number
  referidor?: string
}

export function useRegister() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await new Promise((r) => setTimeout(r, 400))
      const exists = CREDENCIALES.find((c) => c.email.toLowerCase() === input.email.toLowerCase())
      if (exists) throw new Error('Este correo ya está registrado. Inicia sesión o usa otro.')
      const session: SessionUser = {
        email: input.email,
        nombre: input.nombre,
        role: 'consumer',
        desc: 'Cliente · cuenta nueva',
      }
      saveSession(session)
      return session
    },
    onSuccess: (session) => {
      qc.setQueryData(qk.session(), session)
    },
  })
}
