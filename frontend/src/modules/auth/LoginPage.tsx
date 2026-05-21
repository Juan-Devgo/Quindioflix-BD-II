import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthShell } from './AuthShell'
import { DemoPanel } from './components/DemoPanel'
import { useLogin } from '../../api/hooks/useAuth'
import type { DemoCredential } from '../../api/mocks/credentials'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useLogin()

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate({ to: '/app' }),
      },
    )
  }

  const useDemo = (c: DemoCredential) => {
    setEmail(c.email)
    setPassword(c.password)
    login.reset()
  }

  return (
    <AuthShell side={<DemoPanel onUse={useDemo} />}>
      <h1
        className="display"
        style={{ fontSize: 52, margin: '0 0 8px', letterSpacing: '-0.02em' }}
      >
        Iniciar sesión
      </h1>
      <p style={{ color: 'var(--fg-3)', marginBottom: 32, fontSize: 15 }}>
        Bienvenido de vuelta. Continúa donde lo dejaste.
      </p>

      <form onSubmit={submit}>
        <div style={{ marginBottom: 16 }}>
          <span className="label">Correo electrónico</span>
          <input
            className="input"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.co"
            required
            style={{ padding: '12px 14px', fontSize: 15 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <span className="label">Contraseña</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ padding: '12px 14px', fontSize: 15 }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 22,
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              color: 'var(--fg-3)',
              cursor: 'pointer',
            }}
          >
            <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
            Mantenerme conectado
          </label>
          <a href="#" style={{ fontSize: 13, color: 'var(--accent)' }}>
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        {login.isError && (
          <div
            style={{
              padding: 12,
              background: 'var(--rose-soft)',
              border: '1px solid oklch(0.70 0.135 25 / 0.4)',
              borderRadius: 'var(--r-md)',
              color: 'var(--rose)',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {login.error instanceof Error ? login.error.message : 'Error desconocido.'}
          </div>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={login.isPending || !email || !password}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '14px 20px',
            fontSize: 15,
          }}
        >
          {login.isPending ? 'Verificando...' : 'Entrar'}
        </button>
      </form>

      <hr className="divider" style={{ margin: '26px 0' }} />
      <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--fg-3)' }}>
        ¿Aún no tienes cuenta?{' '}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate({ to: '/register' })
          }}
          style={{ color: 'var(--accent)' }}
        >
          Regístrate gratis
        </a>
      </div>
    </AuthShell>
  )
}
