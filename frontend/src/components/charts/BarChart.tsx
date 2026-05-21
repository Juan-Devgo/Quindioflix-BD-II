interface BarChartProps<T extends object> {
  data: Array<T>
  valueKey?: keyof T
  labelKey?: keyof T
  height?: number
  color?: string
}

export function BarChart<T extends object>({
  data,
  valueKey = 'v' as keyof T,
  labelKey = 'm' as keyof T,
  height = 140,
  color = 'var(--accent)',
}: BarChartProps<T>) {
  const values = data.map((d) => Number(d[valueKey] ?? 0))
  const max = Math.max(...values, 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height }}>
      {data.map((d, i) => {
        const v = Number(d[valueKey] ?? 0)
        const pct = (v / max) * 100
        return (
          <div
            key={i}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
          >
            <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
              <div
                style={{
                  width: '100%',
                  height: pct + '%',
                  background: color,
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.85,
                }}
              />
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--fg-3)' }}>
              {String(d[labelKey] ?? '')}
            </div>
          </div>
        )
      })}
    </div>
  )
}
