import { Icon, type IconComponent } from '../../../components/icons/Icon'

interface Feature {
  i: IconComponent
  t: string
  d: string
}

const FEATURES: Array<Feature> = [
  {
    i: Icon.user,
    t: 'Múltiples perfiles',
    d: 'Cada miembro del hogar con sus recomendaciones, su lista y su historial.',
  },
  {
    i: Icon.shield,
    t: 'Modo infantil',
    d: 'Perfiles con clasificación de edad TP, +7 y +13 restringidos automáticamente.',
  },
  {
    i: Icon.device.tv,
    t: 'En cualquier dispositivo',
    d: 'TV, celular, tablet o computador. Tu reproducción se sincroniza.',
  },
  {
    i: Icon.gift,
    t: 'Referidos',
    d: 'Invita amigos y ambos reciben $5.000 de descuento en el siguiente pago.',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      style={{ padding: '80px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}
    >
      <h2 className="display" style={{ fontSize: 48, margin: '0 0 40px', textAlign: 'center' }}>
        Pensado para tu hogar.
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 18,
        }}
      >
        {FEATURES.map((f, i) => {
          const Ic = f.i
          return (
            <div key={i} className="card" style={{ padding: 24 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Ic style={{ width: 20, height: 20 }} />
              </div>
              <div className="display" style={{ fontSize: 22, marginBottom: 8 }}>
                {f.t}
              </div>
              <p style={{ fontSize: 14, color: 'var(--fg-3)', margin: 0, lineHeight: 1.5 }}>{f.d}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
