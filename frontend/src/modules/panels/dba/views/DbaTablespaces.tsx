import { useTablespaces } from '../../../../api/hooks/useDba'

export function DbaTablespaces() {
  const { data: ts = [] } = useTablespaces()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {ts.map((t) => {
        const pct = (t.used / t.total) * 100
        const high = pct > 70
        return (
          <div key={t.name} className="card" style={{ padding: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span className="mono" style={{ color: 'var(--accent)' }}>
                {t.name}
              </span>
              <span className="chip" style={{ fontSize: 11, padding: '2px 8px' }}>
                {t.type}
              </span>
            </div>
            <div
              className="mono"
              style={{ fontSize: 12, color: 'var(--fg-3)', marginBottom: 12 }}
            >
              {t.used} MB / {t.total} MB
            </div>
            <div className="progress" style={{ height: 8 }}>
              <div
                className="progress-bar"
                style={{
                  width: pct + '%',
                  background: high ? 'var(--rose)' : 'var(--sage)',
                }}
              />
            </div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                marginTop: 6,
                color: high ? 'var(--rose)' : 'var(--fg-3)',
              }}
            >
              {pct.toFixed(1)}% usado
            </div>
          </div>
        )
      })}
    </div>
  )
}
