interface CtaSectionProps {
  onRegister: () => void
}

export function CtaSection({ onRegister }: CtaSectionProps) {
  return (
    <section style={{ padding: '60px 48px 100px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
      <h2
        className="display"
        style={{ fontSize: 64, margin: '0 0 18px', letterSpacing: '-0.02em' }}
      >
        ¿Listo para empezar?
      </h2>
      <p style={{ color: 'var(--fg-2)', fontSize: 17, marginBottom: 30 }}>
        Crea tu cuenta en menos de un minuto. Cancela cuando quieras.
      </p>
      <button
        className="btn btn-primary"
        onClick={onRegister}
        style={{ padding: '16px 32px', fontSize: 16 }}
      >
        Crear cuenta gratuita
      </button>
    </section>
  )
}
