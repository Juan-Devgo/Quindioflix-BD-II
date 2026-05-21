import { Brand } from '../../../components/Brand'

export function LandingFooter() {
  return (
    <footer
      style={{
        padding: '32px 48px',
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--fg-4)',
        fontSize: 12,
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
        <Brand size="sm" />
        <span>© 2026 QuindioFlix S.A.S · NIT 901.234.567-8</span>
      </div>
      <div style={{ display: 'flex', gap: 18 }}>
        <a href="#">Términos</a>
        <a href="#">Privacidad</a>
        <a href="#">Centro de ayuda</a>
        <a href="#">Trabaja con nosotros</a>
      </div>
    </footer>
  )
}
