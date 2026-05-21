import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AuthShell } from './AuthShell';
import { Step } from './components/Step';
import { Icon } from '../../components/icons/Icon';
import { useCities, usePlans } from '../../api/hooks/useUser';
import { useRegister } from '../../api/hooks/useAuth';
import { fmtCOP } from '../../lib/format';

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  ciudad: number;
  password: string;
  confirmar: string;
  plan: number;
  referidor: string;
  aceptar: boolean;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { data: ciudades = [] } = useCities();
  const { data: planes = [] } = usePlans();
  const register = useRegister();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    nombre: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    ciudad: 1,
    password: '',
    confirmar: '',
    plan: 2,
    referidor: '',
    aceptar: false,
  });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canStep1 =
    form.nombre.length >= 3 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.fechaNacimiento &&
    form.password.length >= 8 &&
    form.password === form.confirmar;
  const canStep2 = !!form.plan && form.aceptar;

  const submit = () => {
    register.mutate(
      {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        fechaNacimiento: form.fechaNacimiento,
        ciudad: form.ciudad,
        password: form.password,
        plan: form.plan,
        referidor: form.referidor,
      },
      {
        onSuccess: () => navigate({ to: '/app' }),
        onError: () => setStep(1),
      },
    );
  };

  return (
    <AuthShell
      wide
      side={
        <div
          style={{
            padding: 36,
            background:
              'linear-gradient(170deg, oklch(0.30 0.10 75) 0%, var(--bg-1) 90%)',
            height: '100%',
          }}
        >
          <div className="chip accent" style={{ marginBottom: 24 }}>
            Crear cuenta
          </div>
          <h2
            className="display"
            style={{ fontSize: 40, lineHeight: 1.0, margin: '0 0 18px' }}
          >
            Tu próxima
            <br />
            maratón te espera.
          </h2>
          <p
            style={{
              color: 'var(--fg-2)',
              fontSize: 15,
              lineHeight: 1.5,
              marginBottom: 32,
            }}
          >
            Crea tu cuenta y elige el plan que se ajusta a tu hogar. Puedes
            cambiarlo cuando quieras.
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              marginBottom: 32,
            }}
          >
            <Step
              n={1}
              active={step === 1}
              done={step > 1}
              label="Cuenta personal"
            />
            <Step
              n={2}
              active={step === 2}
              done={step > 2}
              label="Plan y confirmación"
            />
          </div>
          <div
            style={{
              padding: 16,
              background: 'oklch(0 0 0 / 0.25)',
              borderRadius: 12,
              fontSize: 13,
              color: 'var(--fg-2)',
            }}
          >
            <strong style={{ color: 'var(--accent)' }}>¿Te invitaron?</strong>
            <br />
            Si llegaste con un código de referido, en el paso 2 te aplicaremos
            automáticamente un descuento de <strong>$5.000</strong> en tu primer
            pago.
          </div>
        </div>
      }
    >
      {step === 1 && (
        <>
          <h1
            className="display"
            style={{
              fontSize: 44,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Tu información
          </h1>
          <p style={{ color: 'var(--fg-3)', marginBottom: 28, fontSize: 14 }}>
            Paso 1 de 2 · Datos personales y acceso
          </p>

          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}
          >
            <div style={{ gridColumn: '1 / -1' }}>
              <span className="label">Nombre completo</span>
              <input
                className="input"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Mariana Ospina"
                autoFocus
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span className="label">Correo electrónico</span>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="tu@correo.co"
              />
            </div>
            <div>
              <span className="label">
                Teléfono{' '}
                <span style={{ color: 'var(--fg-4)', textTransform: 'none' }}>
                  (opcional)
                </span>
              </span>
              <input
                className="input"
                value={form.telefono}
                onChange={(e) => set('telefono', e.target.value)}
                placeholder="+57 300 000 0000"
              />
            </div>
            <div>
              <span className="label">Fecha de nacimiento</span>
              <input
                className="input"
                type="date"
                value={form.fechaNacimiento}
                onChange={(e) => set('fechaNacimiento', e.target.value)}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span className="label">Ciudad de residencia</span>
              <select
                className="select"
                value={form.ciudad}
                onChange={(e) => set('ciudad', +e.target.value)}
              >
                {ciudades.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}, {c.departamento}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <span className="label">Contraseña</span>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <span className="label">Confirmar contraseña</span>
              <input
                className="input"
                type="password"
                value={form.confirmar}
                onChange={(e) => set('confirmar', e.target.value)}
                placeholder="Repite la contraseña"
              />
              {form.confirmar && form.confirmar !== form.password && (
                <div
                  style={{ fontSize: 11, color: 'var(--rose)', marginTop: 4 }}
                >
                  Las contraseñas no coinciden.
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'space-between',
              marginTop: 28,
            }}
          >
            <button
              className="btn btn-ghost"
              onClick={() => navigate({ to: '/login' })}
            >
              Ya tengo cuenta
            </button>
            <button
              className="btn btn-primary"
              disabled={!canStep1}
              onClick={() => setStep(2)}
            >
              Continuar
              <Icon.arrow style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1
            className="display"
            style={{
              fontSize: 44,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            Elige tu plan
          </h1>
          <p style={{ color: 'var(--fg-3)', marginBottom: 28, fontSize: 14 }}>
            Paso 2 de 2 · Selecciona el plan que mejor se adapta a ti
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 22,
            }}
          >
            {planes.map((p) => (
              <div
                key={p.id}
                onClick={() => set('plan', p.id)}
                className="card"
                style={{
                  padding: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  borderColor:
                    form.plan === p.id ? 'var(--accent)' : 'var(--border-soft)',
                  background:
                    form.plan === p.id ? 'var(--bg-2)' : 'var(--bg-1)',
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border:
                      '2px solid ' +
                      (form.plan === p.id ? 'var(--accent)' : 'var(--border)'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {form.plan === p.id && (
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: 'var(--accent)',
                      }}
                    />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}
                  >
                    <span
                      className="display"
                      style={{ fontSize: 22, color: p.color }}
                    >
                      {p.nombre}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                      {p.calidad} · {p.max_pantallas} pantallas
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="display" style={{ fontSize: 22 }}>
                    {fmtCOP(p.precio)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                    / mes
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <span className="label">
              Código de referido{' '}
              <span style={{ color: 'var(--fg-4)', textTransform: 'none' }}>
                (opcional)
              </span>
            </span>
            <input
              className="input"
              value={form.referidor}
              onChange={(e) => set('referidor', e.target.value)}
              placeholder="Ej: MARIANA-O-2026"
            />
            {form.referidor && (
              <div className="chip sage" style={{ marginTop: 8 }}>
                <Icon.gift style={{ width: 12, height: 12 }} /> Recibirás $5.000
                de descuento en tu primer pago
              </div>
            )}
          </div>

          <label
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'flex-start',
              fontSize: 13,
              color: 'var(--fg-2)',
              padding: 14,
              background: 'var(--bg-2)',
              borderRadius: 'var(--r-md)',
              cursor: 'pointer',
              marginBottom: 18,
            }}
          >
            <input
              type="checkbox"
              checked={form.aceptar}
              onChange={(e) => set('aceptar', e.target.checked)}
              style={{ accentColor: 'var(--accent)', marginTop: 2 }}
            />
            <span>
              Acepto los términos y condiciones de QuindioFlix y autorizo el
              tratamiento de mis datos según la política de privacidad.
            </span>
          </label>

          {register.isError && (
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
              {register.error instanceof Error
                ? register.error.message
                : 'Error.'}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            <button className="btn" onClick={() => setStep(1)}>
              <Icon.arrow
                style={{ width: 14, height: 14, transform: 'rotate(180deg)' }}
              />
              Volver
            </button>
            <button
              className="btn btn-primary"
              disabled={!canStep2 || register.isPending}
              onClick={submit}
            >
              {register.isPending
                ? 'Creando cuenta...'
                : 'Crear cuenta y entrar'}
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}
