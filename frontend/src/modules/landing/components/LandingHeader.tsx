import { Brand } from '../../../components/Brand';

interface LandingHeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingHeader({ onLogin, onRegister }: LandingHeaderProps) {
  return (
    <header
      style={{
        padding: '22px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Brand size="md" />
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <a
          href="#planes"
          style={{ color: 'var(--fg-2)', fontSize: 14, padding: '8px 14px' }}
        >
          Planes
        </a>
        <a
          href="#catalogo"
          style={{ color: 'var(--fg-2)', fontSize: 14, padding: '8px 14px' }}
        >
          Catálogo
        </a>
        <a
          href="#features"
          style={{ color: 'var(--fg-2)', fontSize: 14, padding: '8px 14px' }}
        >
          Cómo funciona
        </a>
        <button className="btn" onClick={onLogin}>
          Iniciar sesión
        </button>
        <button className="btn btn-primary" onClick={onRegister}>
          Crear cuenta
        </button>
      </div>
    </header>
  );
}
