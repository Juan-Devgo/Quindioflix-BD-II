import { BarList } from '../../../../components/charts/BarList'
import { Donut } from '../../../../components/charts/Donut'
import { Stars } from '../../../../components/Stars'
import { fmtNum } from '../../../../lib/format'
import { useCatalog } from '../../../../api/hooks/useCatalog'
import { useGenres } from '../../../../api/hooks/useGenres'
import { useMetrics } from '../../../../api/hooks/useMetrics'

const DEVICE_COLORS = [
  'var(--accent)',
  'var(--sage)',
  'var(--sky)',
  'oklch(0.78 0.135 320)',
]

export function ConsumoReport() {
  const { data: m } = useMetrics()
  const { data: catalog = [] } = useCatalog()
  const { data: generos = [] } = useGenres()
  if (!m) return null

  const dispositivos = m.dispositivos.map((d, i) => ({
    ...d,
    color: DEVICE_COLORS[i % DEVICE_COLORS.length],
  }))

  const topVistos = [...catalog].sort((a, b) => b.vistas - a.vistas).slice(0, 8)

  return (
    <>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select className="select" style={{ width: 180 }}>
          <option>Todas las ciudades</option>
          {m.consumoCiudad.map((c) => (
            <option key={c.ciudad}>{c.ciudad}</option>
          ))}
        </select>
        <select className="select" style={{ width: 180 }}>
          <option>Todos los tipos</option>
          <option>Películas</option>
          <option>Series</option>
          <option>Documentales</option>
        </select>
        <select className="select" style={{ width: 180 }}>
          <option>Todos los géneros</option>
          {generos.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <select className="select" style={{ width: 180 }}>
          <option>Todos los dispositivos</option>
          <option>TV</option>
          <option>Celular</option>
          <option>Tablet</option>
          <option>Computador</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Total reproducciones</div>
          <div className="kpi-value">2.02M</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Tiempo total visto</div>
          <div className="kpi-value">189K h</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Avance promedio</div>
          <div className="kpi-value">72%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Sesión promedio</div>
          <div className="kpi-value">47 min</div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 18,
          marginBottom: 18,
        }}
      >
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
            Por ciudad
          </h3>
          <BarList
            data={m.consumoCiudad}
            valueKey="reproducciones"
            labelKey="ciudad"
            format={fmtNum}
          />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
            Por dispositivo
          </h3>
          <Donut data={dispositivos} valueKey="v" labelKey="d" />
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 22, margin: '0 0 18px' }}>
          Ranking de contenido más visto
        </h3>
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Vistas</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {topVistos.map((c, i) => (
              <tr key={c.id}>
                <td className="mono" style={{ color: 'var(--fg-3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </td>
                <td style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 26,
                      height: 36,
                      borderRadius: 4,
                      background: c.gradient,
                      flexShrink: 0,
                    }}
                  />
                  {c.titulo}
                </td>
                <td>
                  <span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>
                    {c.tipo}
                  </span>
                </td>
                <td className="mono">{fmtNum(c.vistas)}</td>
                <td>
                  <Stars value={c.promedio} size={11} />{' '}
                  <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                    {c.promedio}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
