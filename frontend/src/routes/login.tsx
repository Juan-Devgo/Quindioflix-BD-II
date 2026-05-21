import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '../modules/auth/LoginPage'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})
