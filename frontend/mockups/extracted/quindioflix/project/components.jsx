// =====================================================
// QuindioFlix — Componentes compartidos
// =====================================================

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ---------- Iconos (línea, originales) ----------
const Icon = {
  home: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/></svg>,
  search: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  heart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.5-9.3-9.2C.9 8.6 2.6 5 6 5c2 0 3.4 1 4 2.2C10.6 6 12 5 14 5c3.4 0 5.1 3.6 3.3 6.8C19 16.5 12 21 12 21Z"/></svg>,
  heartFill: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.3-9.2C.9 8.6 2.6 5 6 5c2 0 3.4 1 4 2.2C10.6 6 12 5 14 5c3.4 0 5.1 3.6 3.3 6.8C19 16.5 12 21 12 21Z"/></svg>,
  user: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>,
  card: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h3"/></svg>,
  gift: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M3 10h18v3H3z"/><path d="M5 13v8h14v-8M12 8v13M12 8c-2 0-4-1-4-3s2-2 3-1 1 4 1 4Zm0 0c2 0 4-1 4-3s-2-2-3-1-1 4-1 4Z"/></svg>,
  play: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M6 4.5v15a1 1 0 0 0 1.5.87l13-7.5a1 1 0 0 0 0-1.74l-13-7.5A1 1 0 0 0 6 4.5Z"/></svg>,
  plus: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  flag: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22V3l12 4-3 4 3 4-12 1"/></svg>,
  film: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18M3 16h18M8 4v16M16 4v16"/></svg>,
  shield: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/></svg>,
  chart: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 21h18M6 17v-5M10 17v-9M14 17v-7M18 17v-12"/></svg>,
  org: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v4M6 17v-2h12v2"/></svg>,
  db: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>,
  list: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
  logout: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9"/></svg>,
  close: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>,
  check: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>,
  arrow: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  star: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 7 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.8l1.8-7.3L1.5 9.6 9 9z"/></svg>,
  edit: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h4l11-11-4-4L4 16zM14 6l4 4"/></svg>,
  trash: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>,
  filter: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5h18l-7 9v6l-4-2v-4z"/></svg>,
  device: {
    tv: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8"/></svg>,
    phone: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="7" y="2" width="10" height="20" rx="2"/></svg>,
    tablet: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>,
    pc: (p) => <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M9 20h6M12 16v4"/></svg>,
  }
};

// ---------- Brand ----------
function Brand({ size = "md", subtitle }) {
  return (
    <div className="brand" style={{ fontSize: size === "lg" ? 30 : size === "sm" ? 16 : 22 }}>
      <span className="brand-mark" style={{ width: size === "lg" ? 36 : 28, height: size === "lg" ? 36 : 28 }}/>
      <span>quindio<strong>flix</strong>{subtitle && <span style={{ color: "var(--fg-3)", fontSize: 14, marginLeft: 10 }}>/ {subtitle}</span>}</span>
    </div>
  );
}

// ---------- Poster ----------
function Poster({ item, size = "md", onClick, showProgress, progress }) {
  const w = size === "lg" ? 200 : size === "sm" ? 130 : 170;
  const h = size === "lg" ? 290 : size === "sm" ? 190 : 250;
  return (
    <div
      className="poster"
      onClick={onClick}
      style={{ width: w, height: h, cursor: onClick ? "pointer" : "default", "--gradient": item.gradient }}
    >
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
        {item.original && <span className="chip accent" style={{ padding: "3px 8px", fontSize: 10, background: "oklch(0.82 0.135 75 / 0.9)", color: "oklch(0.16 0.01 60)", border: "none", fontWeight: 600 }}>ORIGINAL</span>}
      </div>
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <span className="mono" style={{ fontSize: 10, color: "oklch(1 0 0 / 0.7)" }}>{item.clasif}</span>
      </div>
      <div>
        <div className="poster-title">{item.titulo}</div>
        <div className="poster-meta">{item.tipo} · {item.anio}</div>
      </div>
      {showProgress && (
        <div className="progress" style={{ position: "absolute", left: 14, right: 14, bottom: 6 }}>
          <div className="progress-bar" style={{ width: progress + "%" }}/>
        </div>
      )}
    </div>
  );
}

// ---------- Stars ----------
function Stars({ value, max = 5, size = 14, onChange }) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(value);
        return (
          <span key={i}
            style={{ cursor: onChange ? "pointer" : "default" }}
            className={filled ? "" : "dim"}
            onClick={() => onChange && onChange(i + 1)}>
            <Icon.star style={{ width: size, height: size }} />
          </span>
        );
      })}
    </div>
  );
}

// ---------- Sidebar ----------
function Sidebar({ items, active, onChange, footer, brandSubtitle }) {
  return (
    <aside className="sidebar">
      <div style={{ padding: "0 8px 16px" }}>
        <Brand size="sm" subtitle={brandSubtitle}/>
      </div>
      {items.map((it, i) => {
        if (it.section) return <div key={i} className="nav-section">{it.section}</div>;
        const Ic = it.icon;
        return (
          <div key={i}
            className={"nav-item " + (active === it.id ? "active" : "")}
            onClick={() => onChange(it.id)}>
            {Ic && <Ic/>}
            <span>{it.label}</span>
            {it.badge && (
              <span style={{ marginLeft: "auto", background: "var(--accent)", color: "oklch(0.18 0.01 60)", padding: "1px 7px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{it.badge}</span>
            )}
          </div>
        );
      })}
      <div style={{ flex: 1 }}/>
      {footer}
    </aside>
  );
}

// ---------- Modal ----------
function Modal({ onClose, children, title, maxWidth = 520 }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth }} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 className="display" style={{ margin: 0, fontSize: 26 }}>{title}</h3>
            <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon.close style={{ width: 18, height: 18 }}/></button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ---------- Toast ----------
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [t, setT] = useState(null);
  const show = (msg) => {
    setT(msg);
    setTimeout(() => setT(null), 2400);
  };
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {t && <div className="toast">{t}</div>}
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

// ---------- Bar chart (mini) ----------
function BarChart({ data, valueKey = "v", labelKey = "m", height = 140, color = "var(--accent)" }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ width: "100%", flex: 1, display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: (d[valueKey] / max * 100) + "%", background: color, borderRadius: "4px 4px 0 0", opacity: 0.85 }}/>
          </div>
          <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

// ---------- Horizontal bar list ----------
function BarList({ data, valueKey, labelKey, format }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
            <span>{d[labelKey]}</span>
            <span className="mono" style={{ color: "var(--fg-3)", fontSize: 12 }}>{format ? format(d[valueKey]) : d[valueKey]}</span>
          </div>
          <div style={{ height: 6, background: "var(--bg-2)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: (d[valueKey] / max * 100) + "%", height: "100%", background: "var(--accent)" }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Donut ----------
function Donut({ data, size = 160, valueKey = "porcentaje", labelKey = "tipo" }) {
  const total = data.reduce((s, d) => s + d[valueKey], 0);
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-2)" strokeWidth="14"/>
        {data.map((d, i) => {
          const frac = d[valueKey] / total;
          const len = frac * c;
          const off = acc;
          acc += len;
          return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={d.color || "var(--accent)"} strokeWidth="14"
            strokeDasharray={`${len} ${c}`}
            strokeDashoffset={-off}/>;
        })}
      </svg>
      <div style={{ flex: 1 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 6 }}>
            <span style={{ width: 10, height: 10, background: d.color, borderRadius: 2 }}/>
            <span style={{ flex: 1 }}>{d[labelKey]}</span>
            <span className="mono" style={{ color: "var(--fg-3)" }}>{d[valueKey]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Empty state ----------
function Empty({ icon: Ic, title, hint }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--fg-3)" }}>
      {Ic && <Ic style={{ width: 40, height: 40, opacity: 0.4, marginBottom: 12 }}/>}
      <div style={{ fontSize: 16, color: "var(--fg-2)", marginBottom: 4 }}>{title}</div>
      {hint && <div style={{ fontSize: 13 }}>{hint}</div>}
    </div>
  );
}

// ---------- Format helpers ----------
const fmtCOP = (n) => "$" + n.toLocaleString("es-CO");
const fmtNum = (n) => n.toLocaleString("es-CO");
const fmtMin = (n) => n < 60 ? `${n} min` : `${Math.floor(n/60)}h ${n%60}m`;

function deviceIcon(d) {
  const map = { TV: Icon.device.tv, CELULAR: Icon.device.phone, TABLET: Icon.device.tablet, COMPUTADOR: Icon.device.pc };
  return map[d] || Icon.device.tv;
}

Object.assign(window, {
  Icon, Brand, Poster, Stars, Sidebar, Modal, ToastProvider, useToast,
  BarChart, BarList, Donut, Empty, fmtCOP, fmtNum, fmtMin, deviceIcon
});
