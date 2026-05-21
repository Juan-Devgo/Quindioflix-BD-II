interface HeroSectionProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function HeroSection({ onLogin, onRegister }: HeroSectionProps) {
  return (
    <section
      style={{
        padding: '60px 48px 100px',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
      }}
    >
      <div
        className="upper"
        style={{ color: 'var(--accent)', marginBottom: 22 }}
      >
        Streaming hecho en Colombia · desde 2024
      </div>
      <h1
        className="display"
        style={{
          fontSize: 104,
          lineHeight: 0.92,
          letterSpacing: '-0.03em',
          margin: '0 0 24px',
          maxWidth: 1100,
        }}
      >
        Historias del trópico,
        <br />
        <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>
          en cualquier pantalla.
        </em>
      </h1>
      <p
        style={{
          fontSize: 19,
          color: 'var(--fg-2)',
          maxWidth: 620,
          lineHeight: 1.5,
          margin: '0 0 36px',
        }}
      >
        Películas, series, documentales, música y podcasts originales del Eje
        Cafetero y de toda Latinoamérica. Sin anuncios, sin contratos, en hasta
        5 pantallas.
      </p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={onRegister}
          style={{ padding: '14px 26px', fontSize: 16 }}
        >
          Empieza desde $18.900/mes
        </button>
        <button
          className="btn"
          onClick={onLogin}
          style={{ padding: '14px 22px', fontSize: 15 }}
        >
          Ya tengo cuenta
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 32,
          marginTop: 56,
          color: 'var(--fg-3)',
          fontSize: 13,
        }}
      >
        <div>
          <span
            className="display"
            style={{ fontSize: 30, color: 'var(--fg)', display: 'block' }}
          >
            65K+
          </span>
          suscriptores activos
        </div>
        <div>
          <span
            className="display"
            style={{ fontSize: 30, color: 'var(--fg)', display: 'block' }}
          >
            340
          </span>
          títulos en catálogo
        </div>
        <div>
          <span
            className="display"
            style={{ fontSize: 30, color: 'var(--fg)', display: 'block' }}
          >
            120+
          </span>
          producciones originales
        </div>
        <div>
          <span
            className="display"
            style={{ fontSize: 30, color: 'var(--fg)', display: 'block' }}
          >
            4K
          </span>
          HDR en plan Premium
        </div>
      </div>
    </section>
  );
}
