interface DonutBase {
  color?: string
}

interface DonutProps<T extends DonutBase> {
  data: Array<T>
  size?: number
  valueKey?: keyof T
  labelKey?: keyof T
}

export function Donut<T extends DonutBase>({
  data,
  size = 160,
  valueKey = 'porcentaje' as keyof T,
  labelKey = 'tipo' as keyof T,
}: DonutProps<T>) {
  const total = data.reduce((s, d) => s + Number(d[valueKey] ?? 0), 0) || 1
  const r = size / 2 - 14
  const c = 2 * Math.PI * r
  let acc = 0

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth="14" />
        {data.map((d, i) => {
          const v = Number(d[valueKey] ?? 0)
          const len = (v / total) * c
          const off = acc
          acc += len
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color || 'var(--accent)'}
              strokeWidth="14"
              strokeDasharray={`${len} ${c}`}
              strokeDashoffset={-off}
            />
          )
        })}
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}
          >
            <span style={{ width: 10, height: 10, background: d.color, borderRadius: 2 }} />
            <span style={{ flex: 1 }}>{String(d[labelKey] ?? '')}</span>
            <span className="mono" style={{ color: 'var(--fg-3)' }}>
              {Number(d[valueKey] ?? 0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
