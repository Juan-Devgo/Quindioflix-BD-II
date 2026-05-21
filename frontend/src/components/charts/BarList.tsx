interface BarListProps<T extends object> {
  data: Array<T>
  valueKey: keyof T
  labelKey: keyof T
  format?: (v: number) => string
}

export function BarList<T extends object>({
  data,
  valueKey,
  labelKey,
  format,
}: BarListProps<T>) {
  const values = data.map((d) => Number(d[valueKey] ?? 0))
  const max = Math.max(...values, 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {data.map((d, i) => {
        const v = Number(d[valueKey] ?? 0)
        const pct = (v / max) * 100
        return (
          <div key={i}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}
            >
              <span>{String(d[labelKey] ?? '')}</span>
              <span className="mono" style={{ color: 'var(--fg-3)', fontSize: 12 }}>
                {format ? format(v) : v}
              </span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-2)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: pct + '%', height: '100%', background: 'var(--accent)' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
