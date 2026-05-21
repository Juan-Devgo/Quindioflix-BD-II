import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useSession } from '../api/hooks/useAuth'
import { ConsumerApp } from '../modules/panels/customer/ConsumerApp'
import { ContentApp } from '../modules/panels/employee/ContentApp'
import { ModeratorApp } from '../modules/panels/moderator/ModeratorApp'
import { ManagementApp } from '../modules/panels/manager/ManagementApp'
import { DbaApp } from '../modules/panels/dba/DbaApp'
import { AdminApp } from '../modules/panels/admin/AdminApp'

export function RoleRouter() {
  const { data: session, isLoading } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !session) navigate({ to: '/login' })
  }, [isLoading, session, navigate])

  if (!session) return null

  switch (session.role) {
    case 'consumer':
      return <ConsumerApp />
    case 'content':
      return <ContentApp />
    case 'moderator':
      return <ModeratorApp />
    case 'management':
      return <ManagementApp />
    case 'dba':
      return <DbaApp />
    case 'admin':
      return <AdminApp />
    default:
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--fg-3)',
            fontFamily: 'var(--font-mono)',
            fontSize: 13,
          }}
        >
          Panel "{session.role}" — sin handler asignado.
        </div>
      )
  }
}
