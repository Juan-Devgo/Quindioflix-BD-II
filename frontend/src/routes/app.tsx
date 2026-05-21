import { createFileRoute, redirect } from '@tanstack/react-router'
import { RoleRouter } from '../app/role-router'
import { loadSession } from '../lib/auth'

export const Route = createFileRoute('/app')({
  beforeLoad: () => {
    if (typeof window !== 'undefined' && !loadSession()) {
      throw redirect({ to: '/login' })
    }
  },
  component: RoleRouter,
})
