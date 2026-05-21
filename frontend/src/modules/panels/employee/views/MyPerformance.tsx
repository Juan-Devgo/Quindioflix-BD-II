import { BarChart } from '../../../../components/charts/BarChart'
import { useCatalog } from '../../../../api/hooks/useCatalog'

const BY_MONTH = [
  { m: 'Nov', v: 1 },
  { m: 'Dic', v: 2 },
  { m: 'Ene', v: 3 },
  { m: 'Feb', v: 2 },
  { m: 'Mar', v: 4 },
  { m: 'Abr', v: 3 },
  { m: 'May', v: 5 },
]

export function MyPerformance() {
  const { data: catalog = [] } = useCatalog()
  const mios = catalog.slice(0, 8)
  const originalesPct =
    mios.length === 0 ? 0 : Math.round((mios.filter((m) => m.original).length / mios.length) * 100)

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div className="kpi">
          <div className="kpi-label">Títulos publicados</div>
          <div className="kpi-value">{mios.length}</div>
          <div className="kpi-delta">+3 este mes</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Originales</div>
          <div className="kpi-value">{mios.filter((m) => m.original).length}</div>
          <div className="kpi-delta">{originalesPct}% del total</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Calificación promedio</div>
          <div className="kpi-value">4.5</div>
          <div className="kpi-delta">+0.2 vs ant.</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Vistas generadas</div>
          <div className="kpi-value">1.2M</div>
          <div className="kpi-delta">+18%</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 16px' }}>
            Publicaciones por mes
          </h3>
          <BarChart data={BY_MONTH} height={180} />
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: '0 0 16px' }}>
            Reconocimientos
          </h3>
          <div className="card" style={{ padding: 16, background: 'var(--bg-2)', marginBottom: 10 }}>
            <div className="chip accent" style={{ marginBottom: 8 }}>
              Top publicador
            </div>
            <div style={{ fontSize: 14 }}>5 publicaciones en mayo</div>
          </div>
          <div className="card" style={{ padding: 16, background: 'var(--bg-2)' }}>
            <div className="chip sage" style={{ marginBottom: 8 }}>
              Calidad consistente
            </div>
            <div style={{ fontSize: 14 }}>Promedio &gt;4 estrellas por 6 meses</div>
          </div>
        </div>
      </div>
    </>
  )
}
