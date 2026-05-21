// =====================================================
// QuindioFlix — Paneles internos (Contenido / Moderador / Gerencia / DBA)
// =====================================================

const { useState: useStateS, useEffect: useEffectS, useMemo: useMemoS } = React;

// ===================================================
// EMPLEADO DE CONTENIDO
// ===================================================
function ContentApp({ onLogout }) {
  const [view, setView] = useStateS("catalogo");
  const [selected, setSelected] = useStateS(null);
  const [newContent, setNewContent] = useStateS(false);

  const empleado = EMPLEADOS.find(e => e.id === 3); // Daniela Pulgarín
  const items = [
    { section: "Catálogo" },
    { id: "catalogo", label: "Todos los títulos", icon: Icon.film },
    { id: "nuevos", label: "Recién agregados", icon: Icon.plus },
    { id: "series", label: "Series y podcasts", icon: Icon.list },
    { id: "relaciones", label: "Relaciones", icon: Icon.org },
    { section: "Operación" },
    { id: "rendimiento", label: "Mi rendimiento", icon: Icon.chart },
    { id: "equipo", label: "Mi equipo", icon: Icon.user },
  ];

  return (
    <div className="app-shell">
      <Sidebar items={items} active={view} onChange={setView} brandSubtitle="Contenido"
        footer={
          <div style={{ padding: 12, borderTop: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar" style={{ background: "var(--sage)", color: "oklch(0.16 0.01 60)" }}>{empleado.nombre[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{empleado.nombre}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Contenido · {empleado.rol}</div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={onLogout} title="Cerrar sesión"><Icon.logout style={{ width: 14, height: 14 }}/></button>
          </div>
        }/>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 6 }}>Panel de contenido</div>
            <h1 className="page-title">
              {view === "catalogo" && "Catálogo"}
              {view === "nuevos" && "Recién agregados"}
              {view === "series" && "Series y podcasts"}
              {view === "relaciones" && "Relaciones entre contenidos"}
              {view === "rendimiento" && "Mi rendimiento"}
              {view === "equipo" && "Mi equipo"}
            </h1>
          </div>
          {(view === "catalogo" || view === "nuevos") && (
            <button className="btn btn-primary" onClick={() => setNewContent(true)}>
              <Icon.plus style={{ width: 14, height: 14 }}/> Registrar contenido
            </button>
          )}
        </div>

        {(view === "catalogo" || view === "nuevos") && <CatalogManager onOpen={setSelected} mode={view}/>}
        {view === "series" && <SeriesManager onOpen={setSelected}/>}
        {view === "relaciones" && <RelationsManager/>}
        {view === "rendimiento" && <MyPerformance empleado={empleado}/>}
        {view === "equipo" && <TeamView empleado={empleado}/>}
      </main>

      {selected && <ContentDetailDrawer item={selected} onClose={() => setSelected(null)}/>}
      {newContent && <NewContentModal onClose={() => setNewContent(false)}/>}
    </div>
  );
}

function CatalogManager({ onOpen, mode }) {
  const [filter, setFilter] = useStateS("ALL");
  const tipos = ["ALL", "PELICULA", "SERIE", "DOCUMENTAL", "MUSICA", "PODCAST"];
  let items = [...CATALOGO];
  if (filter !== "ALL") items = items.filter(c => c.tipo === filter);
  if (mode === "nuevos") items.sort((a,b) => b.fechaCatalogo.localeCompare(a.fechaCatalogo));

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {tipos.map(t => (
          <button key={t} className={"chip " + (filter === t ? "accent" : "")} onClick={() => setFilter(t)} style={{ cursor: "pointer", padding: "6px 12px" }}>
            {t === "ALL" ? "Todos" : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
        <div style={{ flex: 1 }}/>
        <span style={{ color: "var(--fg-3)", fontSize: 13 }} className="mono">{items.length} registros</span>
      </div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Título</th><th>Tipo</th><th>Año</th><th>Clasif.</th><th>Géneros</th>
              <th>Original</th><th>Calif.</th><th>Vistas</th><th>Agregado</th><th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} onClick={() => onOpen(c)} style={{ cursor: "pointer" }}>
                <td style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 30, height: 42, borderRadius: 4, background: c.gradient, flexShrink: 0 }}/>
                  <span style={{ color: "var(--fg)" }}>{c.titulo}</span>
                </td>
                <td><span className="chip" style={{ padding: "3px 8px", fontSize: 11 }}>{c.tipo}</span></td>
                <td className="mono">{c.anio}</td>
                <td className="mono">{c.clasif}</td>
                <td style={{ fontSize: 12 }}>{c.generos.slice(0,2).join(", ")}{c.generos.length > 2 && "…"}</td>
                <td>{c.original ? <span className="chip accent" style={{ padding: "2px 8px", fontSize: 11 }}>SÍ</span> : <span style={{ color: "var(--fg-4)" }}>—</span>}</td>
                <td><Stars value={c.promedio} size={11}/></td>
                <td className="mono">{fmtNum(c.vistas)}</td>
                <td className="mono" style={{ color: "var(--fg-3)" }}>{c.fechaCatalogo}</td>
                <td><button className="btn btn-ghost btn-icon"><Icon.edit style={{ width: 14, height: 14 }}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SeriesManager({ onOpen }) {
  const series = CATALOGO.filter(c => c.tipo === "SERIE" || c.tipo === "PODCAST");
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {series.map(s => {
        const eps = EPISODIOS[s.id];
        const totalEps = eps ? eps.temporadas.reduce((sum, t) => sum + t.episodios.length, 0) : 0;
        return (
          <div key={s.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ width: 80, height: 110, borderRadius: 8, background: s.gradient, flexShrink: 0 }}/>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <h3 className="display" style={{ margin: 0, fontSize: 26 }}>{s.titulo}</h3>
                  <span className="chip">{s.tipo}</span>
                  <span className="chip ghost">{s.clasif}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>
                  {s.temporadas || 0} temporadas · {totalEps} episodios registrados
                </div>
                {eps && (
                  <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                    {eps.temporadas.map(t => (
                      <div key={t.num} className="chip" style={{ padding: "6px 12px", fontSize: 12 }}>
                        T{t.num} · {t.episodios.length} eps
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn btn-sm"><Icon.plus style={{ width: 12, height: 12 }}/> Temporada</button>
                <button className="btn btn-sm"><Icon.plus style={{ width: 12, height: 12 }}/> Episodio</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RelationsManager() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn btn-primary"><Icon.plus style={{ width: 14, height: 14 }}/> Nueva relación</button>
      </div>
      <div className="card" style={{ padding: 24 }}>
        {RELACIONES.map((r, i) => {
          const origen = CATALOGO.find(c => c.id === r.origen);
          const destino = CATALOGO.find(c => c.id === r.destino);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 0", borderBottom: i < RELACIONES.length - 1 ? "1px solid var(--border-soft)" : 0 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                <div style={{ width: 40, height: 56, borderRadius: 6, background: origen.gradient, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 15 }}>{origen.titulo}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)" }} className="mono">{origen.tipo} · {origen.anio}</div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div className="chip accent" style={{ padding: "4px 12px" }}>{r.tipo.replace("_", " ")}</div>
                <Icon.arrow style={{ width: 22, height: 22, color: "var(--fg-4)", marginTop: 6 }}/>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, justifyContent: "flex-end" }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15 }}>{destino.titulo}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)" }} className="mono">{destino.tipo} · {destino.anio}</div>
                </div>
                <div style={{ width: 40, height: 56, borderRadius: 6, background: destino.gradient, flexShrink: 0 }}/>
              </div>
              <button className="btn btn-ghost btn-icon"><Icon.trash style={{ width: 14, height: 14 }}/></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyPerformance({ empleado }) {
  const mios = CATALOGO.slice(0, 8); // simulado
  const byMonth = [
    { m: "Nov", v: 1 }, { m: "Dic", v: 2 }, { m: "Ene", v: 3 },
    { m: "Feb", v: 2 }, { m: "Mar", v: 4 }, { m: "Abr", v: 3 }, { m: "May", v: 5 }
  ];
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <div className="kpi"><div className="kpi-label">Títulos publicados</div><div className="kpi-value">{mios.length}</div><div className="kpi-delta">+3 este mes</div></div>
        <div className="kpi"><div className="kpi-label">Originales</div><div className="kpi-value">{mios.filter(m => m.original).length}</div><div className="kpi-delta">62% del total</div></div>
        <div className="kpi"><div className="kpi-label">Calificación promedio</div><div className="kpi-value">4.5</div><div className="kpi-delta">+0.2 vs ant.</div></div>
        <div className="kpi"><div className="kpi-label">Vistas generadas</div><div className="kpi-value">1.2M</div><div className="kpi-delta">+18%</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px" }}>Publicaciones por mes</h3>
          <BarChart data={byMonth} height={180}/>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px" }}>Reconocimientos</h3>
          <div className="card" style={{ padding: 16, background: "var(--bg-2)", marginBottom: 10 }}>
            <div className="chip accent" style={{ marginBottom: 8 }}>Top publicador</div>
            <div style={{ fontSize: 14 }}>5 publicaciones en mayo</div>
          </div>
          <div className="card" style={{ padding: 16, background: "var(--bg-2)" }}>
            <div className="chip sage" style={{ marginBottom: 8 }}>Calidad consistente</div>
            <div style={{ fontSize: 14 }}>Promedio &gt;4 estrellas por 6 meses</div>
          </div>
        </div>
      </div>
    </>
  );
}

function TeamView({ empleado }) {
  const supervisor = EMPLEADOS.find(e => e.id === empleado.supervisor);
  const compañeros = EMPLEADOS.filter(e => e.supervisor === empleado.supervisor && e.id !== empleado.id);
  return (
    <div className="card" style={{ padding: 28 }}>
      <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Tu cadena de mando</h3>
      {supervisor && (
        <div style={{ marginBottom: 24 }}>
          <div className="upper" style={{ color: "var(--fg-4)" }}>Supervisor directo</div>
          <PersonRow emp={supervisor} highlight/>
        </div>
      )}
      <div>
        <div className="upper" style={{ color: "var(--fg-4)" }}>Compañeros de equipo</div>
        {compañeros.map(c => <PersonRow key={c.id} emp={c}/>)}
      </div>
    </div>
  );
}

function PersonRow({ emp, highlight }) {
  const dep = DEPARTAMENTOS.find(d => d.id === emp.departamento);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, borderBottom: "1px solid var(--border-soft)" }}>
      <div className="avatar" style={{ background: highlight ? "var(--accent)" : "var(--bg-3)", color: highlight ? "oklch(0.16 0.01 60)" : "var(--fg)" }}>{emp.nombre[0]}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14 }}>{emp.nombre}</div>
        <div style={{ fontSize: 12, color: "var(--fg-3)" }}>{dep.nombre} · {emp.rol}</div>
      </div>
      <span className="mono" style={{ fontSize: 11, color: "var(--fg-4)" }}>{emp.email}</span>
    </div>
  );
}

function ContentDetailDrawer({ item, onClose }) {
  const eps = EPISODIOS[item.id];
  return (
    <div className="modal-backdrop" onClick={onClose} style={{ justifyContent: "flex-end", padding: 0 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 560, height: "100vh", background: "var(--bg-1)", borderLeft: "1px solid var(--border)", overflow: "auto" }}>
        <div style={{ height: 200, background: item.gradient, position: "relative" }}>
          <button className="btn btn-icon" onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "oklch(0 0 0 / 0.4)", border: 0 }}>
            <Icon.close style={{ width: 16, height: 16 }}/>
          </button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span className="chip">{item.tipo}</span>
            <span className="chip">{item.clasif}</span>
            {item.original && <span className="chip accent">Original</span>}
          </div>
          <h2 className="display" style={{ fontSize: 36, margin: "8px 0 14px" }}>{item.titulo}</h2>
          <p style={{ color: "var(--fg-2)", fontSize: 14, marginBottom: 22 }}>{item.sinopsis}</p>

          <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 10 }}>Metadatos</div>
          <table className="table" style={{ marginBottom: 24 }}>
            <tbody>
              <tr><td style={{ color: "var(--fg-3)" }}>id_contenido</td><td className="mono">{item.id}</td></tr>
              <tr><td style={{ color: "var(--fg-3)" }}>año_lanzamiento</td><td className="mono">{item.anio}</td></tr>
              <tr><td style={{ color: "var(--fg-3)" }}>duracion_minutos</td><td className="mono">{item.duracion || "NULL (se calcula de episodios)"}</td></tr>
              <tr><td style={{ color: "var(--fg-3)" }}>fecha_agregado_catalogo</td><td className="mono">{item.fechaCatalogo}</td></tr>
              <tr><td style={{ color: "var(--fg-3)" }}>generos</td><td>{item.generos.join(", ")}</td></tr>
            </tbody>
          </table>

          {eps && (
            <>
              <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 10 }}>Temporadas y episodios</div>
              {eps.temporadas.map(t => (
                <div key={t.num} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-soft)" }}>
                    <span style={{ fontWeight: 500 }}>T{t.num} — {t.titulo}</span>
                    <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>{t.episodios.length} eps</span>
                  </div>
                  {t.episodios.map(e => (
                    <div key={e.num} style={{ display: "flex", justifyContent: "space-between", padding: "6px 12px", fontSize: 13 }}>
                      <span className="mono" style={{ color: "var(--fg-3)" }}>E{String(e.num).padStart(2,"0")}</span>
                      <span style={{ flex: 1, marginLeft: 12 }}>{e.titulo}</span>
                      <span className="mono" style={{ fontSize: 11, color: "var(--fg-4)" }}>{e.duracion}m</span>
                    </div>
                  ))}
                </div>
              ))}
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button className="btn"><Icon.edit style={{ width: 14, height: 14 }}/> Editar</button>
            <button className="btn"><Icon.plus style={{ width: 14, height: 14 }}/> Géneros</button>
            <div style={{ flex: 1 }}/>
            <button className="btn btn-danger"><Icon.trash style={{ width: 14, height: 14 }}/> Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewContentModal({ onClose }) {
  const [tipo, setTipo] = useStateS("PELICULA");
  const [titulo, setTitulo] = useStateS("");
  const [generos, setGeneros] = useStateS([]);
  const [original, setOriginal] = useStateS(false);
  const toast = useToast();
  const requireDuracion = ["PELICULA", "DOCUMENTAL", "MUSICA"].includes(tipo);

  return (
    <Modal title="Registrar nuevo contenido" onClose={onClose} maxWidth={680}>
      <p style={{ color: "var(--fg-3)", marginTop: -8, marginBottom: 22 }}>Crea un registro en <span className="mono">CONTENIDO</span> · HU-CONT-001</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div>
          <span className="label">Título</span>
          <input className="input" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Niebla sobre Salento"/>
        </div>
        <div>
          <span className="label">Tipo</span>
          <select className="select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {["PELICULA", "SERIE", "DOCUMENTAL", "MUSICA", "PODCAST"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <span className="label">Año de lanzamiento</span>
          <input className="input" type="number" defaultValue={2025}/>
        </div>
        <div>
          <span className="label">Clasificación de edad</span>
          <select className="select">
            {["TP", "+7", "+13", "+16", "+18"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <span className="label">Sinopsis</span>
          <textarea className="textarea" placeholder="Breve resumen del contenido..."/>
        </div>
        <div>
          <span className="label">Duración (minutos) {!requireDuracion && <span style={{ color: "var(--fg-4)", textTransform: "none", letterSpacing: 0 }}>· opcional</span>}</span>
          <input className="input" type="number" placeholder={requireDuracion ? "Requerido" : "Se calcula de episodios"}/>
        </div>
        <div>
          <span className="label">¿Original de QuindioFlix?</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "var(--bg-1)", borderRadius: "var(--r-md)", border: "1px solid var(--border-soft)" }}>
            <div className={"switch " + (original ? "on" : "")} onClick={() => setOriginal(!original)}/>
            <span style={{ fontSize: 14, color: "var(--fg-2)" }}>{original ? "Sí, producción original" : "No, contenido licenciado"}</span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <span className="label">Géneros (1 o más)</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {GENEROS.map(g => {
            const on = generos.includes(g);
            return (
              <button key={g} onClick={() => setGeneros(on ? generos.filter(x => x !== g) : [...generos, g])}
                className={"chip " + (on ? "accent" : "")} style={{ cursor: "pointer", padding: "5px 10px" }}>{g}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={!titulo} onClick={() => { toast(`"${titulo}" registrado en CONTENIDO`); onClose(); }}>
          Crear registro
        </button>
      </div>
    </Modal>
  );
}

// ===================================================
// MODERADOR
// ===================================================
function ModeratorApp({ onLogout }) {
  const empleado = EMPLEADOS.find(e => e.id === 6); // Mateo Salazar
  const [filter, setFilter] = useStateS("PENDIENTE");
  const [selected, setSelected] = useStateS(null);
  const [reportes, setReportes] = useStateS(REPORTES);

  const counts = {
    PENDIENTE: reportes.filter(r => r.estado === "PENDIENTE").length,
    EN_REVISION: reportes.filter(r => r.estado === "EN_REVISION").length,
    RESUELTO: reportes.filter(r => r.estado === "RESUELTO").length,
    RECHAZADO: reportes.filter(r => r.estado === "RECHAZADO").length,
  };

  const items = [
    { section: "Cola de moderación" },
    { id: "PENDIENTE", label: "Pendientes", icon: Icon.flag, badge: counts.PENDIENTE || undefined },
    { id: "EN_REVISION", label: "En revisión", icon: Icon.shield, badge: counts.EN_REVISION || undefined },
    { id: "RESUELTO", label: "Resueltos", icon: Icon.check },
    { id: "RECHAZADO", label: "Rechazados", icon: Icon.close },
    { section: "Mi historial" },
    { id: "mios", label: "Mis decisiones", icon: Icon.list },
  ];

  const list = filter === "mios"
    ? reportes.filter(r => r.moderador === empleado.id)
    : reportes.filter(r => r.estado === filter);

  return (
    <div className="app-shell">
      <Sidebar items={items} active={filter} onChange={setFilter} brandSubtitle="Moderación"
        footer={
          <div style={{ padding: 12, borderTop: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar" style={{ background: "var(--sky)", color: "oklch(0.16 0.01 60)" }}>{empleado.nombre[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>{empleado.nombre}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Soporte · Moderador</div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={onLogout}><Icon.logout style={{ width: 14, height: 14 }}/></button>
          </div>
        }/>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 6 }}>Panel de moderación</div>
            <h1 className="page-title">
              {filter === "PENDIENTE" ? "Reportes pendientes" :
               filter === "EN_REVISION" ? "Reportes en revisión" :
               filter === "RESUELTO" ? "Reportes resueltos" :
               filter === "RECHAZADO" ? "Reportes rechazados" : "Mis decisiones"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="kpi" style={{ padding: "10px 18px" }}>
              <div className="kpi-label" style={{ fontSize: 10 }}>Pendientes hoy</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--accent)" }}>{counts.PENDIENTE}</div>
            </div>
            <div className="kpi" style={{ padding: "10px 18px" }}>
              <div className="kpi-label" style={{ fontSize: 10 }}>Resueltos por mí</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{reportes.filter(r => r.moderador === empleado.id).length}</div>
            </div>
          </div>
        </div>

        <ReportsList reports={list} onOpen={setSelected}/>
      </main>

      {selected && <ReportDetail report={selected} onClose={() => setSelected(null)}
        empleado={empleado}
        onResolve={(estado, comentario) => {
          setReportes(reportes.map(r => r.id === selected.id ? {
            ...r, estado, comentarioResolucion: comentario, moderador: empleado.id,
            fechaResolucion: new Date().toISOString().slice(0,16).replace("T", " ")
          } : r));
          setSelected(null);
        }}
        onTake={() => {
          setReportes(reportes.map(r => r.id === selected.id ? { ...r, estado: "EN_REVISION", moderador: empleado.id } : r));
          setSelected({ ...selected, estado: "EN_REVISION", moderador: empleado.id });
        }}/>}
    </div>
  );
}

function ReportsList({ reports, onOpen }) {
  if (reports.length === 0) return <Empty icon={Icon.check} title="No hay reportes en esta cola" hint="Buen trabajo manteniendo la plataforma limpia."/>;
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {reports.map(r => {
        const item = CATALOGO.find(c => c.id === r.idContenido);
        const ageMin = Math.floor((new Date("2026-05-19 14:00") - new Date(r.fechaReporte)) / 60000);
        const ageStr = ageMin > 60*24 ? `${Math.floor(ageMin/1440)} días` : ageMin > 60 ? `${Math.floor(ageMin/60)}h` : `${ageMin}m`;
        const stateClass = r.estado === "PENDIENTE" ? "accent" : r.estado === "EN_REVISION" ? "" :
                          r.estado === "RESUELTO" ? "sage" : "rose";
        return (
          <div key={r.id} className="card" style={{ padding: 18, display: "flex", gap: 18, cursor: "pointer", alignItems: "flex-start" }} onClick={() => onOpen(r)}>
            <div style={{ width: 48, height: 64, borderRadius: 6, background: item.gradient, flexShrink: 0 }}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span className={"chip " + stateClass}>{r.estado.replace("_", " ")}</span>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-4)" }}>#{String(r.id).padStart(4, "0")}</span>
                <span style={{ fontSize: 13, color: "var(--fg-2)" }}>·</span>
                <span style={{ fontSize: 14 }}>{item.titulo}</span>
                <span className="chip ghost" style={{ padding: "2px 8px", fontSize: 10 }}>{item.clasif}</span>
                <div style={{ flex: 1 }}/>
                <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>hace {ageStr}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.5 }}>{r.motivo}</p>
              {r.comentarioResolucion && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px dashed var(--border-soft)", fontSize: 12, color: "var(--fg-3)" }}>
                  <strong style={{ color: "var(--fg-2)" }}>Resolución:</strong> {r.comentarioResolucion}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReportDetail({ report, onClose, onResolve, onTake, empleado }) {
  const [decision, setDecision] = useStateS("RESUELTO");
  const [comentario, setComentario] = useStateS("");
  const item = CATALOGO.find(c => c.id === report.idContenido);
  const perfil = PERFILES.find(p => p.id === report.idPerfil);
  const moderador = EMPLEADOS.find(e => e.id === report.moderador);

  return (
    <Modal title={`Reporte #${String(report.id).padStart(4, "0")}`} onClose={onClose} maxWidth={680}>
      <div style={{ display: "flex", gap: 18, marginBottom: 20 }}>
        <div style={{ width: 90, height: 130, borderRadius: 8, background: item.gradient, flexShrink: 0 }}/>
        <div style={{ flex: 1 }}>
          <h3 className="display" style={{ fontSize: 26, margin: "0 0 6px" }}>{item.titulo}</h3>
          <div style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--fg-3)" }}>
            <span>{item.tipo}</span><span>·</span><span className="mono">{item.clasif}</span><span>·</span><span>{item.anio}</span>
          </div>
          <div className="chip" style={{ marginTop: 10, padding: "3px 10px" }}>{item.generos.join(" · ")}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, background: "var(--bg-2)", marginBottom: 18 }}>
        <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 8 }}>Motivo del reporte</div>
        <p style={{ margin: 0, fontSize: 14 }}>{report.motivo}</p>
        <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: "var(--fg-3)" }}>
          <span>Reportado por perfil <strong style={{ color: "var(--fg-2)" }}>{perfil?.nombre || "—"}</strong></span>
          <span className="mono">{report.fechaReporte}</span>
        </div>
      </div>

      {report.estado === "PENDIENTE" && (
        <div style={{ textAlign: "center", padding: 20, background: "var(--accent-soft)", borderRadius: "var(--r-md)" }}>
          <p style={{ margin: "0 0 14px", color: "var(--fg-2)" }}>Este reporte no ha sido tomado. Asígnatelo para revisarlo.</p>
          <button className="btn btn-primary" onClick={onTake}>Tomar reporte</button>
        </div>
      )}

      {report.estado === "EN_REVISION" && report.moderador === empleado.id && (
        <>
          <div style={{ marginBottom: 14 }}>
            <span className="label">Decisión</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className={"chip " + (decision === "RESUELTO" ? "sage" : "")} onClick={() => setDecision("RESUELTO")} style={{ cursor: "pointer", padding: "8px 14px" }}>
                <Icon.check style={{ width: 14, height: 14 }}/> RESUELTO — Aplica
              </button>
              <button className={"chip " + (decision === "RECHAZADO" ? "rose" : "")} onClick={() => setDecision("RECHAZADO")} style={{ cursor: "pointer", padding: "8px 14px" }}>
                <Icon.close style={{ width: 14, height: 14 }}/> RECHAZADO — No procede
              </button>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span className="label">Comentario de resolución</span>
            <textarea className="textarea" value={comentario} onChange={(e) => setComentario(e.target.value)}
              placeholder="Justifica tu decisión y las acciones tomadas (reclasificación, retiro del catálogo, etc.)"/>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button className="btn btn-primary" disabled={comentario.length < 10} onClick={() => onResolve(decision, comentario)}>
              Registrar decisión
            </button>
          </div>
        </>
      )}

      {(report.estado === "RESUELTO" || report.estado === "RECHAZADO") && (
        <div className="card" style={{ padding: 16, background: "var(--bg-2)" }}>
          <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 8 }}>Resolución</div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
            <span className={"chip " + (report.estado === "RESUELTO" ? "sage" : "rose")}>{report.estado}</span>
            <span style={{ fontSize: 13, color: "var(--fg-3)" }}>por <strong style={{ color: "var(--fg-2)" }}>{moderador?.nombre}</strong></span>
            <span className="mono" style={{ fontSize: 12, color: "var(--fg-4)", marginLeft: "auto" }}>{report.fechaResolucion}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>{report.comentarioResolucion}</p>
        </div>
      )}
    </Modal>
  );
}

// ===================================================
// GERENCIA / JEFE
// ===================================================
function ManagementApp({ onLogout }) {
  const [view, setView] = useStateS("dashboard");
  const empleado = EMPLEADOS.find(e => e.id === 1); // Laura Henao - jefa de Contenido
  const items = [
    { section: "Análisis" },
    { id: "dashboard", label: "Dashboard ejecutivo", icon: Icon.chart },
    { id: "consumo", label: "Consumo", icon: Icon.film },
    { id: "ingresos", label: "Ingresos", icon: Icon.card },
    { id: "marketing", label: "Referidos y marketing", icon: Icon.gift },
    { section: "Operación" },
    { id: "equipo", label: "Equipo y jerarquía", icon: Icon.org },
    { id: "moderacion", label: "Reportes y moderación", icon: Icon.shield },
  ];
  return (
    <div className="app-shell">
      <Sidebar items={items} active={view} onChange={setView} brandSubtitle="Gerencia"
        footer={
          <div style={{ padding: 12, borderTop: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar" style={{ background: "oklch(0.78 0.135 320)", color: "oklch(0.16 0.01 60)" }}>{empleado.nombre[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13 }}>{empleado.nombre}</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }}>Jefa de Contenido</div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={onLogout}><Icon.logout style={{ width: 14, height: 14 }}/></button>
          </div>
        }/>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 6 }}>Centro de operaciones</div>
            <h1 className="page-title">
              {view === "dashboard" && "Vista ejecutiva"}
              {view === "consumo" && "Análisis de consumo"}
              {view === "ingresos" && "Reporte financiero"}
              {view === "marketing" && "Programa de referidos"}
              {view === "equipo" && "Equipo y jerarquía"}
              {view === "moderacion" && "Moderación de reportes"}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <select className="select" style={{ width: 160 }}>
              <option>Últimos 30 días</option>
              <option>Últimos 90 días</option>
              <option>Este año</option>
            </select>
            <button className="btn"><Icon.list style={{ width: 14, height: 14 }}/> Exportar</button>
          </div>
        </div>

        {view === "dashboard" && <ExecutiveDashboard/>}
        {view === "consumo" && <ConsumoReport/>}
        {view === "ingresos" && <IngresosReport/>}
        {view === "marketing" && <MarketingReport/>}
        {view === "equipo" && <OrgView/>}
        {view === "moderacion" && <ModerationOverview/>}
      </main>
    </div>
  );
}

function ExecutiveDashboard() {
  const totalUsuarios = METRICAS.consumoPlan.reduce((s, p) => s + p.usuarios, 0);
  const totalRepros = METRICAS.consumoPlan.reduce((s, p) => s + p.repros, 0);
  const ingresoMes = METRICAS.ingresosMes.at(-1).v;

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi">
          <div className="kpi-label">Usuarios activos</div>
          <div className="kpi-value">{fmtNum(totalUsuarios)}</div>
          <div className="kpi-delta">↑ 12.4% vs mes anterior</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Reproducciones (mes)</div>
          <div className="kpi-value">{(totalRepros/1000000).toFixed(1)}M</div>
          <div className="kpi-delta">↑ 8.1%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Ingresos netos (mes)</div>
          <div className="kpi-value">${ingresoMes}M</div>
          <div className="kpi-delta">↑ 4.8%</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Churn promedio</div>
          <div className="kpi-value">5.4%</div>
          <div className="kpi-delta down">↑ 0.3 pts</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 4px" }}>Ingresos mensuales</h3>
          <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 18 }} className="mono">Millones COP — últimos 7 meses</div>
          <BarChart data={METRICAS.ingresosMes} height={200}/>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Distribución por tipo</h3>
          <Donut data={METRICAS.consumoTipo}/>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Top ciudades por reproducciones</h3>
          <BarList data={METRICAS.consumoCiudad.slice(0, 6)} valueKey="reproducciones" labelKey="ciudad" format={fmtNum}/>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Comportamiento por plan</h3>
          <table className="table">
            <thead><tr><th>Plan</th><th>Usuarios</th><th>Repros</th><th>Churn</th></tr></thead>
            <tbody>
              {METRICAS.consumoPlan.map(p => (
                <tr key={p.plan}>
                  <td><span className="chip">{p.plan}</span></td>
                  <td className="mono">{fmtNum(p.usuarios)}</td>
                  <td className="mono">{fmtNum(p.repros)}</td>
                  <td className="mono"><span style={{ color: p.churn > 6 ? "var(--rose)" : "var(--sage)" }}>{p.churn}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ConsumoReport() {
  return (
    <>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select className="select" style={{ width: 180 }}><option>Todas las ciudades</option>{METRICAS.consumoCiudad.map(c => <option key={c.ciudad}>{c.ciudad}</option>)}</select>
        <select className="select" style={{ width: 180 }}><option>Todos los tipos</option><option>Películas</option><option>Series</option><option>Documentales</option></select>
        <select className="select" style={{ width: 180 }}><option>Todos los géneros</option>{GENEROS.map(g => <option key={g}>{g}</option>)}</select>
        <select className="select" style={{ width: 180 }}><option>Todos los dispositivos</option><option>TV</option><option>Celular</option><option>Tablet</option><option>Computador</option></select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-label">Total reproducciones</div><div className="kpi-value">2.02M</div></div>
        <div className="kpi"><div className="kpi-label">Tiempo total visto</div><div className="kpi-value">189K h</div></div>
        <div className="kpi"><div className="kpi-label">Avance promedio</div><div className="kpi-value">72%</div></div>
        <div className="kpi"><div className="kpi-label">Sesión promedio</div><div className="kpi-value">47 min</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Por ciudad</h3>
          <BarList data={METRICAS.consumoCiudad} valueKey="reproducciones" labelKey="ciudad" format={fmtNum}/>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Por dispositivo</h3>
          <Donut data={METRICAS.dispositivos.map((d, i) => ({ ...d, color: ["var(--accent)", "var(--sage)", "var(--sky)", "oklch(0.78 0.135 320)"][i] }))}
            valueKey="v" labelKey="d"/>
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Ranking de contenido más visto</h3>
        <table className="table">
          <thead><tr><th>#</th><th>Título</th><th>Tipo</th><th>Vistas</th><th>Promedio</th></tr></thead>
          <tbody>
            {[...CATALOGO].sort((a,b) => b.vistas - a.vistas).slice(0, 8).map((c, i) => (
              <tr key={c.id}>
                <td className="mono" style={{ color: "var(--fg-3)" }}>{String(i+1).padStart(2, "0")}</td>
                <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 26, height: 36, borderRadius: 4, background: c.gradient, flexShrink: 0 }}/>
                  {c.titulo}
                </td>
                <td><span className="chip" style={{ fontSize: 11, padding: "2px 8px" }}>{c.tipo}</span></td>
                <td className="mono">{fmtNum(c.vistas)}</td>
                <td><Stars value={c.promedio} size={11}/> <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{c.promedio}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function IngresosReport() {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-label">Ingresos brutos</div><div className="kpi-value">$1,921M</div><div className="kpi-delta">↑ 4.8%</div></div>
        <div className="kpi"><div className="kpi-label">Descuentos aplicados</div><div className="kpi-value">$87M</div><div className="kpi-delta">4.5% del bruto</div></div>
        <div className="kpi"><div className="kpi-label">Ingresos netos</div><div className="kpi-value">$1,834M</div></div>
        <div className="kpi"><div className="kpi-label">Transacciones</div><div className="kpi-value">65.5K</div></div>
        <div className="kpi"><div className="kpi-label">Ticket promedio</div><div className="kpi-value">$27.9K</div></div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Tendencia mensual</h3>
        <BarChart data={METRICAS.ingresosMes} height={200}/>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Ingresos por ciudad</h3>
        <table className="table">
          <thead><tr><th>Ciudad</th><th>Reproducciones</th><th>Usuarios</th><th>Ingresos netos</th><th>% del total</th></tr></thead>
          <tbody>
            {METRICAS.consumoCiudad.map(c => {
              const pct = (c.ingresos / METRICAS.consumoCiudad.reduce((s, x) => s + x.ingresos, 0) * 100).toFixed(1);
              return (
                <tr key={c.ciudad}>
                  <td>{c.ciudad}</td>
                  <td className="mono">{fmtNum(c.reproducciones)}</td>
                  <td className="mono">{fmtNum(Math.floor(c.reproducciones / 50))}</td>
                  <td className="mono">{fmtCOP(c.ingresos)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 80, height: 4, background: "var(--bg-2)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: pct + "%", height: "100%", background: "var(--accent)" }}/>
                      </div>
                      <span className="mono" style={{ fontSize: 12, color: "var(--fg-3)" }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function MarketingReport() {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-label">Referidos totales</div><div className="kpi-value">3,421</div><div className="kpi-delta">↑ 22% YoY</div></div>
        <div className="kpi"><div className="kpi-label">Tasa de conversión</div><div className="kpi-value">68%</div><div className="kpi-delta">+4 pts</div></div>
        <div className="kpi"><div className="kpi-label">Descuentos aplicados</div><div className="kpi-value">$32M</div></div>
        <div className="kpi"><div className="kpi-label">CAC equivalente</div><div className="kpi-value">$9.4K</div><div className="kpi-delta">-12%</div></div>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Top referidores</h3>
        <table className="table">
          <thead><tr><th>Usuario</th><th>Referidos</th><th>Conversión</th><th>Descuentos generados</th></tr></thead>
          <tbody>
            {[
              { n: "Mariana Ospina", c: "Armenia", r: 18, conv: 14, d: 70000 },
              { n: "Andrés Cardona", c: "Pereira", r: 12, conv: 11, d: 55000 },
              { n: "Camila Restrepo", c: "Medellín", r: 9, conv: 9, d: 45000 },
              { n: "Carlos Mejía", c: "Bogotá", r: 8, conv: 6, d: 30000 },
              { n: "Sofía Henao", c: "Cali", r: 7, conv: 5, d: 25000 },
            ].map((u, i) => (
              <tr key={i}>
                <td>{u.n} <span style={{ fontSize: 11, color: "var(--fg-3)", marginLeft: 8 }}>· {u.c}</span></td>
                <td className="mono">{u.r}</td>
                <td><span className="chip sage" style={{ fontSize: 11, padding: "2px 8px" }}>{Math.round(u.conv/u.r*100)}%</span></td>
                <td className="mono">{fmtCOP(u.d)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrgView() {
  const [depFilter, setDepFilter] = useStateS(1);

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {DEPARTAMENTOS.map(d => (
          <button key={d.id} className={"chip " + (depFilter === d.id ? "accent" : "")} onClick={() => setDepFilter(d.id)} style={{ cursor: "pointer", padding: "8px 14px" }}>{d.nombre}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <button className="btn"><Icon.plus style={{ width: 14, height: 14 }}/> Registrar empleado</button>
      </div>

      <OrgChart depId={depFilter}/>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 24 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px" }}>Rendimiento individual</h3>
          {EMPLEADOS.filter(e => e.departamento === depFilter && e.rol === "EMPLEADO").map(e => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
              <div className="avatar" style={{ width: 36, height: 36, fontSize: 16 }}>{e.nombre[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14 }}>{e.nombre}</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>desde {e.fechaIngreso}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 13 }}>{Math.floor(Math.random() * 25 + 5)} publicaciones</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>este trimestre</div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px" }}>Salud del departamento</h3>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Total empleados", EMPLEADOS.filter(e => e.departamento === depFilter).length],
              ["Empleados activos", EMPLEADOS.filter(e => e.departamento === depFilter && e.activo).length],
              ["Cobertura de supervisión", "100%"],
              ["Antigüedad promedio", "2.1 años"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border-soft)" }}>
                <span style={{ color: "var(--fg-3)" }}>{k}</span>
                <span className="mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function OrgChart({ depId }) {
  const emps = EMPLEADOS.filter(e => e.departamento === depId);
  const jefe = emps.find(e => e.rol === "JEFE");
  const supervisores = emps.filter(e => e.rol === "SUPERVISOR");
  const sinSupervisor = emps.filter(e => e.rol !== "JEFE" && e.rol !== "SUPERVISOR" && !supervisores.some(s => s.id === e.supervisor));

  return (
    <div className="card" style={{ padding: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {jefe && <OrgNode emp={jefe} top/>}
        <div style={{ width: 1, height: 24, background: "var(--border)" }}/>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {supervisores.length ? supervisores.map(s => (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <OrgNode emp={s}/>
              {emps.filter(e => e.supervisor === s.id).length > 0 && (
                <>
                  <div style={{ width: 1, height: 16, background: "var(--border)" }}/>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", maxWidth: 360 }}>
                    {emps.filter(e => e.supervisor === s.id).map(e => <OrgNode key={e.id} emp={e} small/>)}
                  </div>
                </>
              )}
            </div>
          )) : sinSupervisor.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              {sinSupervisor.map(e => <OrgNode key={e.id} emp={e} small/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrgNode({ emp, top, small }) {
  const w = top ? 220 : small ? 150 : 180;
  return (
    <div className="card" style={{
      padding: small ? 12 : 16, textAlign: "center", width: w,
      background: top ? "linear-gradient(150deg, oklch(0.30 0.08 75), var(--bg-2))" : "var(--bg-2)",
      borderColor: top ? "var(--accent)" : "var(--border-soft)"
    }}>
      <div className="avatar" style={{ margin: "0 auto 8px", width: small ? 32 : 40, height: small ? 32 : 40, fontSize: small ? 14 : 18 }}>{emp.nombre[0]}</div>
      <div style={{ fontSize: small ? 12 : 14, marginBottom: 4 }}>{emp.nombre}</div>
      <div className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>{emp.rol}</div>
    </div>
  );
}

function ModerationOverview() {
  const stats = {
    pendientes: REPORTES.filter(r => r.estado === "PENDIENTE").length,
    enRevision: REPORTES.filter(r => r.estado === "EN_REVISION").length,
    resueltos: REPORTES.filter(r => r.estado === "RESUELTO").length,
    rechazados: REPORTES.filter(r => r.estado === "RECHAZADO").length,
  };
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-label">Pendientes</div><div className="kpi-value" style={{ color: "var(--accent)" }}>{stats.pendientes}</div></div>
        <div className="kpi"><div className="kpi-label">En revisión</div><div className="kpi-value">{stats.enRevision}</div></div>
        <div className="kpi"><div className="kpi-label">Resueltos (mes)</div><div className="kpi-value">{stats.resueltos}</div></div>
        <div className="kpi"><div className="kpi-label">Rechazados (mes)</div><div className="kpi-value">{stats.rechazados}</div></div>
      </div>
      <div className="card" style={{ padding: 24, marginBottom: 18 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Productividad por moderador</h3>
        <table className="table">
          <thead><tr><th>Moderador</th><th>Resueltos</th><th>Rechazados</th><th>Tiempo prom. respuesta</th></tr></thead>
          <tbody>
            {EMPLEADOS.filter(e => e.rol === "MODERADOR").map(e => {
              const res = REPORTES.filter(r => r.moderador === e.id && r.estado === "RESUELTO").length;
              const rec = REPORTES.filter(r => r.moderador === e.id && r.estado === "RECHAZADO").length;
              return (
                <tr key={e.id}>
                  <td style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 14 }}>{e.nombre[0]}</div>
                    {e.nombre}
                  </td>
                  <td><span className="chip sage">{res}</span></td>
                  <td><span className="chip rose">{rec}</span></td>
                  <td className="mono">{Math.floor(Math.random() * 8 + 4)}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ===================================================
// DBA
// ===================================================
function DbaApp({ onLogout }) {
  const [view, setView] = useStateS("esquemas");
  const items = [
    { section: "Infraestructura" },
    { id: "esquemas", label: "Esquemas", icon: Icon.db },
    { id: "usuarios", label: "Usuarios y roles", icon: Icon.user },
    { id: "tablespaces", label: "Tablespaces", icon: Icon.list },
    { section: "Monitoreo" },
    { id: "rendimiento", label: "Rendimiento", icon: Icon.chart },
    { id: "respaldos", label: "Respaldos", icon: Icon.shield },
  ];
  return (
    <div className="app-shell">
      <Sidebar items={items} active={view} onChange={setView} brandSubtitle="DBA"
        footer={
          <div style={{ padding: 12, borderTop: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: 10 }}>
            <div className="avatar" style={{ background: "oklch(0.55 0.02 60)" }}>DB</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13 }}>sys</div>
              <div style={{ fontSize: 11, color: "var(--fg-3)" }} className="mono">qf_prod_pdb</div>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={onLogout}><Icon.logout style={{ width: 14, height: 14 }}/></button>
          </div>
        }/>
      <main className="main">
        <div className="topbar">
          <div>
            <div className="upper" style={{ color: "var(--fg-3)", marginBottom: 6 }} >Administrador de base de datos</div>
            <h1 className="page-title">
              {view === "esquemas" && "Esquemas"}
              {view === "usuarios" && "Usuarios y roles"}
              {view === "tablespaces" && "Tablespaces"}
              {view === "rendimiento" && "Rendimiento"}
              {view === "respaldos" && "Respaldos"}
            </h1>
          </div>
          <div className="chip sage" style={{ padding: "6px 14px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--sage)" }}/>
            DB en línea — 99.97%
          </div>
        </div>

        {view === "esquemas" && <DbaSchemas/>}
        {view === "usuarios" && <DbaUsers/>}
        {view === "tablespaces" && <DbaTablespaces/>}
        {view === "rendimiento" && <DbaPerf/>}
        {view === "respaldos" && <DbaBackups/>}
      </main>
    </div>
  );
}

function DbaSchemas() {
  const schemas = [
    { name: "QF_CORE", tables: 18, size: "412 MB", desc: "Núcleo: usuarios, perfiles, suscripciones, pagos" },
    { name: "QF_CONTENT", tables: 9, size: "1.2 GB", desc: "Catálogo, temporadas, episodios, géneros, relaciones" },
    { name: "QF_CONSUMPTION", tables: 6, size: "8.7 GB", desc: "Reproducciones, favoritos, calificaciones, reportes" },
    { name: "QF_HR", tables: 4, size: "32 MB", desc: "Empleados, departamentos, jerarquía" },
    { name: "QF_REPORTS_MV", tables: 12, size: "780 MB", desc: "Vistas materializadas para analítica gerencial" },
  ];
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table className="table">
        <thead><tr><th>Esquema</th><th>Tablas</th><th>Tamaño</th><th>Descripción</th><th>Acciones</th></tr></thead>
        <tbody>
          {schemas.map(s => (
            <tr key={s.name}>
              <td className="mono" style={{ color: "var(--accent)" }}>{s.name}</td>
              <td className="mono">{s.tables}</td>
              <td className="mono">{s.size}</td>
              <td style={{ color: "var(--fg-3)" }}>{s.desc}</td>
              <td>
                <div style={{ display: "flex", gap: 4 }}>
                  <button className="btn btn-ghost btn-sm"><Icon.edit style={{ width: 12, height: 12 }}/></button>
                  <button className="btn btn-ghost btn-sm">Privilegios</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DbaUsers() {
  const users = [
    { user: "QF_ADMIN", role: "DBA", status: "ACTIVO", privs: ["ALL"] },
    { user: "QF_APP_RW", role: "APP_READ_WRITE", status: "ACTIVO", privs: ["SELECT", "INSERT", "UPDATE", "DELETE"] },
    { user: "QF_APP_RO", role: "APP_READ_ONLY", status: "ACTIVO", privs: ["SELECT"] },
    { user: "QF_REPORT", role: "BI_USER", status: "ACTIVO", privs: ["SELECT en QF_REPORTS_MV"] },
    { user: "QF_BATCH", role: "BATCH_JOB", status: "ACTIVO", privs: ["EXEC PKG_FACTURACION", "EXEC PKG_MOROSIDAD"] },
    { user: "QF_DEV", role: "DEVELOPER", status: "INACTIVO", privs: ["DDL en QF_DEV_SCHEMA"] },
  ];
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table className="table">
        <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Privilegios</th><th></th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.user}>
              <td className="mono" style={{ color: "var(--accent)" }}>{u.user}</td>
              <td className="mono">{u.role}</td>
              <td><span className={"chip " + (u.status === "ACTIVO" ? "sage" : "")}>{u.status}</span></td>
              <td>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {u.privs.map(p => <span key={p} className="chip" style={{ fontSize: 11, padding: "2px 8px" }} >{p}</span>)}
                </div>
              </td>
              <td><button className="btn btn-ghost btn-sm">Gestionar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DbaTablespaces() {
  const ts = [
    { name: "TS_CORE", used: 412, total: 1024, type: "PERMANENT" },
    { name: "TS_CONTENT", used: 1224, total: 4096, type: "PERMANENT" },
    { name: "TS_CONSUMPTION", used: 8907, total: 16384, type: "PERMANENT" },
    { name: "TS_REPORTS", used: 798, total: 2048, type: "PERMANENT" },
    { name: "TS_TEMP", used: 124, total: 512, type: "TEMPORARY" },
    { name: "TS_UNDO", used: 89, total: 256, type: "UNDO" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {ts.map(t => {
        const pct = (t.used / t.total * 100);
        const high = pct > 70;
        return (
          <div key={t.name} className="card" style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="mono" style={{ color: "var(--accent)" }}>{t.name}</span>
              <span className="chip" style={{ fontSize: 11, padding: "2px 8px" }}>{t.type}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 12 }}>{t.used} MB / {t.total} MB</div>
            <div className="progress" style={{ height: 8 }}>
              <div className="progress-bar" style={{ width: pct + "%", background: high ? "var(--rose)" : "var(--sage)" }}/>
            </div>
            <div className="mono" style={{ fontSize: 11, marginTop: 6, color: high ? "var(--rose)" : "var(--fg-3)" }}>
              {pct.toFixed(1)}% usado
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DbaPerf() {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="kpi"><div className="kpi-label">QPS</div><div className="kpi-value">2,184</div><div className="kpi-delta">↑ 12%</div></div>
        <div className="kpi"><div className="kpi-label">Latencia p95</div><div className="kpi-value">38ms</div><div className="kpi-delta">↓ 4ms</div></div>
        <div className="kpi"><div className="kpi-label">Conexiones</div><div className="kpi-value">147 / 300</div></div>
        <div className="kpi"><div className="kpi-label">Cache hit ratio</div><div className="kpi-value">96.8%</div></div>
      </div>
      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 18px" }}>Top consultas costosas</h3>
        <table className="table">
          <thead><tr><th>SQL ID</th><th>Sentencia</th><th>Ejecuciones</th><th>Tiempo prom.</th></tr></thead>
          <tbody>
            {[
              { id: "8h2k9d", sql: "SELECT * FROM REPRODUCCION WHERE id_perfil = :1 AND fecha_inicio > :2", e: 142211, t: 41 },
              { id: "kj22n0", sql: "INSERT INTO REPRODUCCION (...)", e: 89220, t: 8 },
              { id: "9aa8s2", sql: "MERGE INTO USUARIO USING (SELECT ...) ON (id_usuario = :1)", e: 1203, t: 122 },
              { id: "2as89d", sql: "SELECT id_contenido, AVG(estrellas) FROM CALIFICACION GROUP BY id_contenido", e: 412, t: 880 },
            ].map(q => (
              <tr key={q.id}>
                <td className="mono" style={{ color: "var(--accent)" }}>{q.id}</td>
                <td className="mono" style={{ fontSize: 12, color: "var(--fg-2)", maxWidth: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.sql}</td>
                <td className="mono">{fmtNum(q.e)}</td>
                <td className="mono">{q.t}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function DbaBackups() {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <table className="table">
        <thead><tr><th>Tipo</th><th>Fecha</th><th>Tamaño</th><th>Duración</th><th>Estado</th><th></th></tr></thead>
        <tbody>
          {[
            { type: "RMAN FULL", date: "2026-05-19 03:00", size: "11.4 GB", dur: "23m 12s", status: "OK" },
            { type: "RMAN INCR", date: "2026-05-18 03:00", size: "812 MB", dur: "4m 02s", status: "OK" },
            { type: "RMAN INCR", date: "2026-05-17 03:00", size: "744 MB", dur: "3m 58s", status: "OK" },
            { type: "EXPORT DP", date: "2026-05-12 02:00", size: "9.8 GB", dur: "18m 41s", status: "OK" },
            { type: "RMAN FULL", date: "2026-05-12 03:00", size: "10.9 GB", dur: "22m 04s", status: "OK" },
          ].map((b, i) => (
            <tr key={i}>
              <td className="mono">{b.type}</td>
              <td className="mono">{b.date}</td>
              <td className="mono">{b.size}</td>
              <td className="mono">{b.dur}</td>
              <td><span className="chip sage">{b.status}</span></td>
              <td><button className="btn btn-ghost btn-sm">Restaurar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Object.assign(window, { ContentApp, ModeratorApp, ManagementApp, DbaApp });
