// =====================================================
// QuindioFlix — App de Usuario / Perfil
// =====================================================

const { useState: useStateC, useEffect: useEffectC, useMemo: useMemoC, useRef: useRefC } = React;

// ---------- Selector de perfil ----------
function ProfileSelector({ onPick }) {
  const [editing, setEditing] = useStateC(false);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, background: "radial-gradient(ellipse at 50% 20%, oklch(0.22 0.03 60), var(--bg-0) 70%)" }}>
      <div style={{ marginBottom: 14 }}>
        <Brand size="lg"/>
      </div>
      <h1 className="display" style={{ fontSize: 56, margin: "12px 0 8px", textAlign: "center", letterSpacing: "-0.02em" }}>¿Quién mira hoy?</h1>
      <p style={{ color: "var(--fg-3)", marginBottom: 48 }}>Cuenta de Mariana Ospina · Plan Premium</p>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
        {PERFILES.filter(p => p.activo).map(p => (
          <div key={p.id} onClick={() => !editing && onPick(p)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, cursor: "pointer", padding: 12, borderRadius: 14, transition: "background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "oklch(1 0 0 / 0.04)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 130, height: 130, borderRadius: 24, background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 72, color: "oklch(0.16 0.01 60)", border: "3px solid transparent", transition: "border-color 0.2s" }}>
                {p.avatar}
              </div>
              {editing && (
                <div style={{ position: "absolute", inset: 0, background: "oklch(0 0 0 / 0.5)", borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon.edit style={{ width: 28, height: 28, color: "white" }}/>
                </div>
              )}
              {p.tipo === "INFANTIL" && (
                <span style={{ position: "absolute", bottom: -6, right: -6, background: "var(--sage)", color: "oklch(0.16 0.01 60)", padding: "3px 8px", borderRadius: 999, fontSize: 10, fontWeight: 600 }}>NIÑOS</span>
              )}
            </div>
            <div style={{ fontSize: 18, color: "var(--fg-2)" }}>{p.nombre}</div>
          </div>
        ))}
        <div onClick={() => onPick({ id: 0, nombre: "+ Nuevo", tipo: "ADULTO", avatar: "+", color: "var(--bg-3)" })}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, cursor: "pointer", padding: 12, opacity: 0.6 }}>
          <div style={{ width: 130, height: 130, borderRadius: 24, border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon.plus style={{ width: 40, height: 40, color: "var(--fg-3)" }}/>
          </div>
          <div style={{ fontSize: 18, color: "var(--fg-3)" }}>Agregar perfil</div>
        </div>
      </div>
      <button className="btn btn-ghost" style={{ marginTop: 48 }} onClick={() => setEditing(!editing)}>
        <Icon.edit style={{ width: 14, height: 14 }}/>
        {editing ? "Listo" : "Administrar perfiles"}
      </button>
    </div>
  );
}

// ---------- Top header (catálogo) ----------
function ConsumerHeader({ perfil, onChangeProfile, onSearch, onChangeView, view, onLogout }) {
  const [q, setQ] = useStateC("");
  const [menuOpen, setMenuOpen] = useStateC(false);
  const tabs = [
    { id: "inicio", label: "Inicio" },
    { id: "series", label: "Series" },
    { id: "peliculas", label: "Películas" },
    { id: "documentales", label: "Documentales" },
    { id: "musica", label: "Música" },
    { id: "podcasts", label: "Podcasts" },
    { id: "favoritos", label: "Mi lista" },
    { id: "cuenta", label: "Cuenta" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "oklch(0.12 0.008 60 / 0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-soft)",
      padding: "14px 40px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <Brand size="sm"/>
        <nav style={{ display: "flex", gap: 4, flex: 1 }}>
          {tabs.map(t => (
            <button key={t.id}
              onClick={() => onChangeView(t.id)}
              style={{
                background: "transparent", border: 0, padding: "8px 14px",
                color: view === t.id ? "var(--accent)" : "var(--fg-2)",
                fontSize: 14, fontWeight: view === t.id ? 600 : 400,
                cursor: "pointer", borderRadius: 6,
              }}>
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <Icon.search style={{ width: 16, height: 16, position: "absolute", left: 10, color: "var(--fg-3)" }}/>
          <input
            className="input"
            placeholder="Buscar título, género, director…"
            value={q}
            onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }}
            style={{ paddingLeft: 32, width: 280, fontSize: 13 }}/>
        </div>
        <div style={{ position: "relative" }}>
          <div onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: 38, height: 38, borderRadius: 10, background: perfil.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 20, color: "oklch(0.16 0.01 60)", cursor: "pointer" }}>
            {perfil.avatar}
          </div>
          {menuOpen && (
            <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 50 }}/>
          )}
          {menuOpen && (
            <div className="card" style={{ position: "absolute", right: 0, top: 48, width: 220, padding: 8, zIndex: 60, boxShadow: "var(--shadow-pop)" }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border-soft)", marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: "var(--fg)" }}>{perfil.nombre}</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{perfil.tipo === "INFANTIL" ? "Perfil infantil" : "Perfil adulto"}</div>
              </div>
              <div className="nav-item" onClick={() => { onChangeProfile(); setMenuOpen(false); }}>
                <Icon.user/> <span>Cambiar de perfil</span>
              </div>
              <div className="nav-item" onClick={() => { onChangeView("cuenta"); setMenuOpen(false); }}>
                <Icon.card/> <span>Cuenta y facturación</span>
              </div>
              <div className="nav-item" onClick={() => { onChangeView("referidos"); setMenuOpen(false); }}>
                <Icon.gift/> <span>Programa de referidos</span>
              </div>
              <div className="nav-item" onClick={onLogout}>
                <Icon.logout/> <span>Cerrar sesión</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ---------- Hero ----------
function Hero({ item, onOpen, onPlay, onFav, isFav }) {
  return (
    <section style={{ position: "relative", padding: "60px 40px 80px", margin: "0 -40px 32px", overflow: "hidden", isolation: "isolate" }}>
      <div style={{ position: "absolute", inset: 0, background: item.gradient, opacity: 0.55, zIndex: -2 }}/>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 0%, var(--bg-0) 95%), linear-gradient(90deg, var(--bg-0) 0%, transparent 60%)", zIndex: -1 }}/>
      <div style={{ maxWidth: 620 }}>
        {item.original && <div className="chip accent" style={{ marginBottom: 12 }}>Original QuindioFlix</div>}
        <h1 className="display" style={{ fontSize: 72, margin: "0 0 16px", letterSpacing: "-0.025em", lineHeight: 0.95 }}>
          {item.titulo}
        </h1>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 16, color: "var(--fg-2)", fontSize: 13 }}>
          <span className="mono">{item.anio}</span>
          <span>·</span>
          <span>{item.tipo}</span>
          <span>·</span>
          <span className="chip ghost" style={{ padding: "2px 8px" }}>{item.clasif}</span>
          <span>·</span>
          <Stars value={item.promedio} size={12}/>
          <span className="mono" style={{ fontSize: 12 }}>{item.promedio}</span>
        </div>
        <p style={{ fontSize: 17, color: "var(--fg-2)", maxWidth: 540, marginBottom: 28, lineHeight: 1.5 }}>{item.sinopsis}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" onClick={onPlay} style={{ padding: "12px 22px", fontSize: 15 }}>
            <Icon.play style={{ width: 16, height: 16 }}/> Reproducir
          </button>
          <button className="btn" onClick={onOpen}>Más información</button>
          <button className="btn btn-icon" onClick={onFav} title={isFav ? "Quitar de mi lista" : "Agregar a mi lista"}>
            {isFav ? <Icon.heartFill style={{ width: 16, height: 16, color: "var(--accent)" }}/> : <Icon.heart style={{ width: 16, height: 16 }}/>}
          </button>
        </div>
      </div>
    </section>
  );
}

// ---------- Carrusel ----------
function Row({ title, items, onOpen, getProgress }) {
  const ref = useRefC();
  if (!items.length) return null;
  return (
    <section style={{ marginBottom: 36 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 className="display" style={{ fontSize: 26, margin: 0 }}>{title}</h2>
        <div style={{ display: "flex", gap: 4 }}>
          <button className="btn btn-icon btn-ghost" onClick={() => ref.current.scrollBy({ left: -600, behavior: "smooth" })}>‹</button>
          <button className="btn btn-icon btn-ghost" onClick={() => ref.current.scrollBy({ left: 600, behavior: "smooth" })}>›</button>
        </div>
      </div>
      <div ref={ref} style={{ display: "flex", gap: 14, overflowX: "auto", scrollSnapType: "x mandatory", paddingBottom: 4, scrollbarWidth: "none" }}>
        {items.map(item => (
          <div key={item.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
            <Poster item={item} onClick={() => onOpen(item)}
              showProgress={!!getProgress?.(item)} progress={getProgress?.(item)}/>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Vista Inicio ----------
function HomeView({ perfil, onOpen, favoritos, repros }) {
  const allowed = (it) => {
    if (perfil.tipo !== "INFANTIL") return true;
    return ["TP", "+7", "+13"].includes(it.clasif);
  };
  const cat = CATALOGO.filter(allowed);
  const hero = cat[1]; // Los caminos del viento
  const continuando = repros.filter(r => r.avance < 100 && r.idContenido).map(r => CATALOGO.find(c => c.id === r.idContenido)).filter(Boolean);
  const getProgress = (item) => {
    const r = repros.find(r => r.idContenido === item.id && r.avance < 100);
    return r?.avance;
  };
  const isFav = favoritos.some(f => f.idContenido === hero.id);

  return (
    <div>
      <Hero item={hero} onOpen={() => onOpen(hero)} onPlay={() => onOpen(hero, true)}
        onFav={() => {}} isFav={isFav}/>
      {continuando.length > 0 && (
        <Row title="Continúa viendo" items={continuando} onOpen={onOpen} getProgress={getProgress}/>
      )}
      <Row title="Originales QuindioFlix" items={cat.filter(c => c.original)} onOpen={onOpen}/>
      <Row title="Tendencias en Colombia" items={[...cat].sort((a,b) => b.vistas - a.vistas).slice(0, 8)} onOpen={onOpen}/>
      <Row title="Series del Eje Cafetero" items={cat.filter(c => c.tipo === "SERIE")} onOpen={onOpen}/>
      <Row title="Documentales y miradas reales" items={cat.filter(c => c.tipo === "DOCUMENTAL" || c.tipo === "PODCAST")} onOpen={onOpen}/>
      <Row title="Recién agregados" items={[...cat].sort((a,b) => b.fechaCatalogo.localeCompare(a.fechaCatalogo)).slice(0, 8)} onOpen={onOpen}/>
    </div>
  );
}

// ---------- Vista por categoría ----------
function CategoryView({ tipo, perfil, onOpen, title }) {
  const [genero, setGenero] = useStateC(null);
  const [sort, setSort] = useStateC("populares");
  const allowed = (it) => perfil.tipo !== "INFANTIL" || ["TP", "+7", "+13"].includes(it.clasif);
  let items = CATALOGO.filter(c => c.tipo === tipo).filter(allowed);
  if (genero) items = items.filter(c => c.generos.includes(genero));
  if (sort === "populares") items.sort((a, b) => b.vistas - a.vistas);
  else if (sort === "recientes") items.sort((a, b) => b.fechaCatalogo.localeCompare(a.fechaCatalogo));
  else if (sort === "estrellas") items.sort((a, b) => b.promedio - a.promedio);

  const generosUsados = [...new Set(CATALOGO.filter(c => c.tipo === tipo).flatMap(c => c.generos))];

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: "20px 0 8px" }}>{title}</h1>
      <p style={{ color: "var(--fg-3)", marginBottom: 28 }}>{items.length} títulos disponibles</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, alignItems: "center" }}>
        <button className={"chip " + (!genero ? "accent" : "")} onClick={() => setGenero(null)} style={{ cursor: "pointer" }}>Todos los géneros</button>
        {generosUsados.map(g => (
          <button key={g} className={"chip " + (genero === g ? "accent" : "")} onClick={() => setGenero(g)} style={{ cursor: "pointer" }}>{g}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 180 }}>
          <option value="populares">Más populares</option>
          <option value="recientes">Recién agregados</option>
          <option value="estrellas">Mejor calificadas</option>
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 18 }}>
        {items.map(item => (
          <Poster key={item.id} item={item} size="lg" onClick={() => onOpen(item)}/>
        ))}
      </div>
      {items.length === 0 && <Empty icon={Icon.film} title="No hay títulos en esta categoría" hint="Prueba con otro género."/>}
    </div>
  );
}

// ---------- Vista búsqueda ----------
function SearchView({ query, perfil, onOpen }) {
  const allowed = (it) => perfil.tipo !== "INFANTIL" || ["TP", "+7", "+13"].includes(it.clasif);
  const q = query.toLowerCase().trim();
  const items = CATALOGO.filter(allowed).filter(c =>
    c.titulo.toLowerCase().includes(q) ||
    c.generos.some(g => g.toLowerCase().includes(q)) ||
    (c.director || "").toLowerCase().includes(q)
  );
  return (
    <div>
      <h1 className="display" style={{ fontSize: 40, margin: "20px 0 8px" }}>Resultados para "{query}"</h1>
      <p style={{ color: "var(--fg-3)", marginBottom: 28 }}>{items.length} coincidencias</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 18 }}>
        {items.map(item => <Poster key={item.id} item={item} size="lg" onClick={() => onOpen(item)}/>)}
      </div>
      {items.length === 0 && <Empty icon={Icon.search} title="Sin resultados" hint="Intenta con otra búsqueda."/>}
    </div>
  );
}

// ---------- Detalle de contenido ----------
function DetailModal({ item, perfil, onClose, onPlay, favoritos, setFavoritos, calificaciones, setCalif, onReport }) {
  const isFav = favoritos.some(f => f.idContenido === item.id);
  const miCalif = calificaciones[item.id];
  const [tab, setTab] = useStateC("info");
  const eps = EPISODIOS[item.id];
  const blocked = perfil.tipo === "INFANTIL" && ["+16", "+18"].includes(item.clasif);
  const toast = useToast();

  const toggleFav = () => {
    if (isFav) setFavoritos(favoritos.filter(f => f.idContenido !== item.id));
    else {
      setFavoritos([...favoritos, { idContenido: item.id, fecha: new Date().toISOString().slice(0,10) }]);
      toast("Agregado a tu lista");
    }
  };

  const relaciones = RELACIONES.filter(r => r.origen === item.id || r.destino === item.id)
    .map(r => ({ ...r, otro: CATALOGO.find(c => c.id === (r.origen === item.id ? r.destino : r.origen)) }))
    .filter(r => r.otro);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 880, padding: 0, overflow: "hidden" }}>
        <div style={{ position: "relative", height: 320, background: item.gradient }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, var(--bg-1) 100%)" }}/>
          <button className="btn btn-icon" onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "oklch(0 0 0 / 0.4)", border: "none" }}>
            <Icon.close style={{ width: 16, height: 16 }}/>
          </button>
          <div style={{ position: "absolute", bottom: 24, left: 28, right: 28 }}>
            {item.original && <div className="chip accent" style={{ marginBottom: 10, background: "oklch(0.82 0.135 75 / 0.9)", color: "oklch(0.16 0.01 60)", border: "none", fontWeight: 600 }}>Original</div>}
            <h2 className="display" style={{ fontSize: 48, margin: "0 0 10px", letterSpacing: "-0.02em" }}>{item.titulo}</h2>
            <div style={{ display: "flex", gap: 12, alignItems: "center", color: "oklch(1 0 0 / 0.9)", fontSize: 13 }}>
              <span className="mono">{item.anio}</span>
              <span>·</span>
              <span>{item.tipo}</span>
              {item.duracion && <><span>·</span><span>{fmtMin(item.duracion)}</span></>}
              {item.temporadas && <><span>·</span><span>{item.temporadas} {item.temporadas === 1 ? "temporada" : "temporadas"}</span></>}
              <span>·</span>
              <span className="chip ghost" style={{ padding: "2px 8px", background: "oklch(0 0 0 / 0.4)", border: "none", color: "white" }}>{item.clasif}</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button className="btn btn-primary" disabled={blocked} onClick={() => onPlay(item)} style={{ opacity: blocked ? 0.4 : 1 }}>
              <Icon.play style={{ width: 14, height: 14 }}/> Reproducir
            </button>
            <button className="btn" onClick={toggleFav}>
              {isFav ? <Icon.heartFill style={{ width: 14, height: 14, color: "var(--accent)" }}/> : <Icon.heart style={{ width: 14, height: 14 }}/>}
              {isFav ? "En mi lista" : "Mi lista"}
            </button>
            <button className="btn btn-ghost" onClick={() => onReport(item)}>
              <Icon.flag style={{ width: 14, height: 14 }}/> Reportar
            </button>
          </div>

          {blocked && (
            <div className="card" style={{ padding: 16, marginBottom: 20, background: "var(--rose-soft)", borderColor: "oklch(0.70 0.135 25 / 0.4)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Icon.shield style={{ width: 24, height: 24, color: "var(--rose)" }}/>
                <div>
                  <div style={{ fontWeight: 600, color: "var(--fg)" }}>Contenido restringido</div>
                  <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 2 }}>Este contenido tiene clasificación {item.clasif} y no está disponible para perfiles infantiles. (RN-03)</div>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border-soft)", marginBottom: 18 }}>
            {[
              ["info", "Información"],
              ...(eps ? [["episodios", "Episodios"]] : []),
              ["calificar", "Calificar"],
              ...(relaciones.length ? [["relacionados", "Relacionados"]] : [])
            ].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)}
                style={{ background: "transparent", border: 0, padding: "10px 0", color: tab === id ? "var(--accent)" : "var(--fg-2)", borderBottom: "2px solid " + (tab === id ? "var(--accent)" : "transparent"), cursor: "pointer", fontSize: 14 }}>
                {label}
              </button>
            ))}
          </div>

          {tab === "info" && (
            <div>
              <p style={{ fontSize: 15, color: "var(--fg-2)", marginBottom: 18 }}>{item.sinopsis}</p>
              <div style={{ display: "grid", gridTemplateColumns: "max-content 1fr", gap: "10px 24px", fontSize: 13 }}>
                <span style={{ color: "var(--fg-3)" }}>Géneros</span>
                <span>{item.generos.join(" · ")}</span>
                <span style={{ color: "var(--fg-3)" }}>Calificación</span>
                <span><Stars value={item.promedio} size={12}/> <span className="mono" style={{ color: "var(--fg-2)" }}> {item.promedio}/5 ({fmtNum(item.vistas)} vistas)</span></span>
                {item.director && (<><span style={{ color: "var(--fg-3)" }}>Dirección</span><span>{item.director}</span></>)}
                {item.reparto && (<><span style={{ color: "var(--fg-3)" }}>Reparto</span><span>{item.reparto.join(", ")}</span></>)}
                <span style={{ color: "var(--fg-3)" }}>Agregado</span>
                <span className="mono" style={{ color: "var(--fg-2)" }}>{item.fechaCatalogo}</span>
              </div>
            </div>
          )}

          {tab === "episodios" && eps && (
            <div>
              {eps.temporadas.map(t => (
                <div key={t.num} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
                    <h3 className="display" style={{ fontSize: 22, margin: 0 }}>T{t.num} · {t.titulo}</h3>
                    <span className="mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{t.episodios.length} episodios</span>
                  </div>
                  {t.episodios.map(e => (
                    <div key={e.num} style={{ display: "flex", gap: 14, padding: 14, borderBottom: "1px solid var(--border-soft)", alignItems: "center" }}>
                      <span className="mono" style={{ width: 40, color: "var(--fg-3)", fontSize: 18 }}>{String(e.num).padStart(2, "0")}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15 }}>{e.titulo}</div>
                        <div style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 2 }}>{e.duracion} min · {e.fecha}</div>
                      </div>
                      <button className="btn btn-icon btn-ghost" onClick={() => onPlay(item, e)}><Icon.play style={{ width: 14, height: 14 }}/></button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {tab === "calificar" && (
            <CalificarPanel item={item} miCalif={miCalif} setCalif={setCalif} repros={REPRODUCCIONES} perfil={perfil}/>
          )}

          {tab === "relacionados" && (
            <div>
              {relaciones.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "center" }}>
                  <Poster item={r.otro} size="sm"/>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>{r.otro.titulo}</div>
                    <div className="chip" style={{ marginTop: 6 }}>{r.tipo.replace("_", " ")}</div>
                    {r.descripcion && <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 8 }}>{r.descripcion}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Calificar ----------
function CalificarPanel({ item, miCalif, setCalif, repros, perfil }) {
  const [stars, setStars] = useStateC(miCalif?.stars || 0);
  const [resena, setResena] = useStateC(miCalif?.resena || "");
  const toast = useToast();
  // RN-04: 50% visto
  const visto = repros.find(r => (r.idContenido === item.id || r.idEpisodio?.idSerie === item.id) && r.avance >= 50);
  const puedeCalificar = !!visto;

  if (!puedeCalificar) {
    return (
      <div className="card" style={{ padding: 18, background: "var(--bg-2)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Icon.shield style={{ width: 22, height: 22, color: "var(--fg-3)" }}/>
          <div>
            <div style={{ fontWeight: 500 }}>Aún no puedes calificar este título</div>
            <div style={{ fontSize: 13, color: "var(--fg-3)", marginTop: 4 }}>Debes reproducir al menos el 50% del contenido antes de poder dejar una calificación. <span className="mono" style={{ color: "var(--fg-4)" }}>(RN-04)</span></div>
          </div>
        </div>
      </div>
    );
  }

  const guardar = () => {
    setCalif({ ...{ [item.id]: { stars, resena, fecha: new Date().toISOString().slice(0,10) } } });
    toast(miCalif ? "Calificación actualizada" : "¡Gracias por calificar!");
  };

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <span className="label">Tu calificación</span>
        <Stars value={stars} onChange={setStars} size={28}/>
      </div>
      <div style={{ marginBottom: 18 }}>
        <span className="label">Reseña (opcional)</span>
        <textarea className="textarea" value={resena} onChange={(e) => setResena(e.target.value)} placeholder="Comparte tu opinión sobre este título..."/>
      </div>
      <button className="btn btn-primary" onClick={guardar} disabled={stars === 0}>
        {miCalif ? "Actualizar calificación" : "Publicar calificación"}
      </button>
      {miCalif && <span style={{ marginLeft: 12, fontSize: 13, color: "var(--fg-3)" }}>Última actualización: {miCalif.fecha}</span>}
    </div>
  );
}

// ---------- Player ----------
function Player({ item, episodio, onClose }) {
  const [playing, setPlaying] = useStateC(true);
  const [progress, setProgress] = useStateC(8);
  const [showControls, setShowControls] = useStateC(true);
  useEffectC(() => {
    if (!playing) return;
    const t = setInterval(() => setProgress(p => Math.min(p + 0.5, 100)), 1000);
    return () => clearInterval(t);
  }, [playing]);

  const dur = episodio?.duracion || item.duracion || 90;
  const curMin = Math.floor(dur * progress / 100);

  return (
    <div style={{ position: "fixed", inset: 0, background: "black", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}
      onMouseMove={() => setShowControls(true)}>
      <div style={{ position: "absolute", inset: 0, background: item.gradient, opacity: 0.4 }}/>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, transparent 0%, black 90%)" }}/>
      <div style={{ position: "relative", textAlign: "center", color: "white" }}>
        <div className="display" style={{ fontSize: 84, letterSpacing: "-0.02em" }}>{item.titulo}</div>
        {episodio && <div style={{ fontSize: 18, marginTop: 8, color: "oklch(1 0 0 / 0.7)" }}>T{episodio.t || 1} E{episodio.num} · {episodio.titulo}</div>}
      </div>

      {showControls && (
        <div style={{ position: "absolute", inset: 0, padding: 28, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="btn" onClick={onClose} style={{ background: "oklch(0 0 0 / 0.4)", color: "white", borderColor: "transparent" }}>
              <Icon.close style={{ width: 14, height: 14 }}/> Salir
            </button>
            <div className="chip" style={{ background: "oklch(0 0 0 / 0.4)", color: "white", border: 0 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}/>
              Reproduciendo en TV Sala
            </div>
          </div>
          <div>
            <div className="progress" style={{ height: 5, marginBottom: 12, background: "oklch(1 0 0 / 0.2)" }}>
              <div className="progress-bar" style={{ width: progress + "%" }}/>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button className="btn btn-icon" onClick={() => setPlaying(!playing)} style={{ background: "white", color: "black", border: 0, width: 50, height: 50, borderRadius: 25 }}>
                {playing ? <span style={{ fontSize: 18 }}>❚❚</span> : <Icon.play style={{ width: 20, height: 20 }}/>}
              </button>
              <button className="btn btn-ghost" style={{ color: "white" }}>‹‹ 10s</button>
              <button className="btn btn-ghost" style={{ color: "white" }}>10s ››</button>
              <span className="mono" style={{ color: "white", fontSize: 13 }}>
                {String(Math.floor(curMin/60)).padStart(2,"0")}:{String(curMin%60).padStart(2,"0")} / {String(Math.floor(dur/60)).padStart(2,"0")}:{String(dur%60).padStart(2,"0")}
              </span>
              <div style={{ flex: 1 }}/>
              <button className="btn btn-ghost" style={{ color: "white" }}>Subtítulos</button>
              <button className="btn btn-ghost" style={{ color: "white" }}>Audio</button>
              <button className="btn btn-ghost" style={{ color: "white" }}>Pantalla completa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Reportar contenido ----------
function ReportModal({ item, onClose, perfil }) {
  const [motivo, setMotivo] = useStateC("");
  const [cat, setCat] = useStateC("violencia");
  const toast = useToast();
  const cats = [
    { id: "violencia", label: "Violencia gráfica" },
    { id: "lenguaje", label: "Lenguaje inadecuado" },
    { id: "clasif", label: "Clasificación incorrecta" },
    { id: "sexual", label: "Contenido sexual" },
    { id: "tecnico", label: "Problema técnico" },
    { id: "otro", label: "Otro" },
  ];
  return (
    <Modal title="Reportar contenido" onClose={onClose}>
      <p style={{ color: "var(--fg-3)", marginTop: -10, marginBottom: 18 }}>Reportarás "<strong style={{ color: "var(--fg-2)" }}>{item.titulo}</strong>" al equipo de moderación.</p>
      <div className="label">Categoría del reporte</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {cats.map(c => (
          <button key={c.id} className={"chip " + (cat === c.id ? "accent" : "")} onClick={() => setCat(c.id)} style={{ cursor: "pointer", padding: "6px 12px" }}>{c.label}</button>
        ))}
      </div>
      <div className="label">Describe el motivo (mínimo 20 caracteres)</div>
      <textarea className="textarea" value={motivo} onChange={(e) => setMotivo(e.target.value)}
        placeholder="Por favor, sé específico sobre lo que viste y por qué consideras que es inapropiado."
        style={{ minHeight: 120 }}/>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={motivo.length < 20}
          onClick={() => { toast("Reporte enviado a moderación. Estado: PENDIENTE"); onClose(); }}>
          Enviar reporte
        </button>
      </div>
    </Modal>
  );
}

// ---------- Mi lista ----------
function FavView({ favoritos, setFavoritos, onOpen }) {
  const items = favoritos.map(f => ({ ...f, item: CATALOGO.find(c => c.id === f.idContenido) })).filter(x => x.item);
  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: "20px 0 8px" }}>Mi lista</h1>
      <p style={{ color: "var(--fg-3)", marginBottom: 28 }}>{items.length} títulos guardados</p>
      {items.length === 0 ? <Empty icon={Icon.heart} title="Tu lista está vacía" hint="Agrega contenido con el botón ♥ desde cualquier título."/> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 18 }}>
          {items.map(({ item, fecha }) => (
            <div key={item.id}>
              <Poster item={item} size="lg" onClick={() => onOpen(item)}/>
              <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 6 }} className="mono">Agregado {fecha}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Cuenta y facturación ----------
function AccountView({ usuario, onChangePlan, onView }) {
  const ciudad = CIUDADES.find(c => c.id === usuario.ciudad);
  const plan = PLANES.find(p => p.id === usuario.plan);
  const ultimoPago = PAGOS.find(p => p.estado === "EXITOSO");
  const diasRestantes = Math.round((new Date(usuario.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: "20px 0 30px" }}>Cuenta</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 32 }}>
        <div className="card" style={{ padding: 26 }}>
          <div className="label">Información personal</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px", marginTop: 16 }}>
            <Field label="Nombre completo" value={usuario.nombre}/>
            <Field label="Email" value={usuario.email}/>
            <Field label="Teléfono" value={usuario.telefono}/>
            <Field label="Fecha de nacimiento" value={usuario.fechaNacimiento}/>
            <Field label="Ciudad" value={ciudad.nombre + ", " + ciudad.departamento}/>
            <Field label="Miembro desde" value={usuario.fechaRegistro}/>
          </div>
          <button className="btn" style={{ marginTop: 20 }}><Icon.edit style={{ width: 14, height: 14 }}/> Editar información</button>
        </div>

        <div className="card" style={{ padding: 26, background: "linear-gradient(150deg, oklch(0.26 0.04 60), var(--bg-1))" }}>
          <div className="label">Plan actual</div>
          <div className="display" style={{ fontSize: 44, margin: "8px 0", color: "var(--accent)" }}>{plan.nombre}</div>
          <div style={{ fontSize: 14, color: "var(--fg-2)" }}>{fmtCOP(plan.precio)} / mes · {plan.calidad} · hasta {plan.max_pantallas} pantallas</div>
          <hr className="divider"/>
          <div style={{ fontSize: 13, color: "var(--fg-3)" }}>Próximo cobro</div>
          <div style={{ fontSize: 18, marginTop: 4 }} className="mono">{usuario.fechaVencimiento}</div>
          <div className="chip sage" style={{ marginTop: 8 }}>En {diasRestantes} días</div>
          <button className="btn btn-primary" style={{ marginTop: 18, width: "100%", justifyContent: "center" }} onClick={onChangePlan}>Cambiar plan</button>
        </div>
      </div>

      <div className="card" style={{ padding: 26, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 className="display" style={{ fontSize: 24, margin: 0 }}>Historial de pagos</h3>
          <select className="select" style={{ width: 160 }} defaultValue="all">
            <option value="all">Todos los estados</option>
            <option>EXITOSO</option>
            <option>FALLIDO</option>
            <option>PENDIENTE</option>
            <option>REEMBOLSADO</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr><th>Fecha</th><th>Plan</th><th>Método</th><th>Estado</th><th>Descuento</th><th style={{ textAlign: "right" }}>Total</th><th>Referencia</th></tr>
          </thead>
          <tbody>
            {PAGOS.map(p => {
              const planP = PLANES.find(pl => pl.id === p.plan);
              const total = p.monto - p.descuento;
              const estCls = p.estado === "EXITOSO" ? "sage" : p.estado === "FALLIDO" ? "rose" : "";
              return (
                <tr key={p.id}>
                  <td className="mono">{p.fecha}</td>
                  <td>{planP.nombre}</td>
                  <td>{p.metodo.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</td>
                  <td><span className={"chip " + estCls}>{p.estado}</span></td>
                  <td>{p.descuento > 0 ? <span style={{ color: "var(--sage)" }}>-{fmtCOP(p.descuento)}</span> : <span style={{ color: "var(--fg-4)" }}>—</span>}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{fmtCOP(total)}</td>
                  <td className="mono" style={{ fontSize: 11, color: "var(--fg-4)" }}>{p.referencia}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: "var(--fg)" }}>{value}</div>
    </div>
  );
}

// ---------- Cambiar plan ----------
function ChangePlanModal({ usuario, onClose }) {
  const [sel, setSel] = useStateC(usuario.plan);
  const toast = useToast();
  const perfilesActivos = PERFILES.filter(p => p.activo && p.idUsuario === usuario.id).length;

  return (
    <Modal title="Cambiar plan de suscripción" onClose={onClose} maxWidth={720}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {PLANES.map(p => {
          const incompat = perfilesActivos > p.max_pantallas;
          const isCurrent = p.id === usuario.plan;
          const isSel = p.id === sel;
          return (
            <div key={p.id} onClick={() => !incompat && setSel(p.id)}
              className="card" style={{
                padding: 20, cursor: incompat ? "not-allowed" : "pointer",
                borderColor: isSel ? "var(--accent)" : "var(--border-soft)",
                background: isSel ? "var(--bg-2)" : "var(--bg-1)",
                opacity: incompat ? 0.5 : 1,
                position: "relative"
              }}>
              {isCurrent && <div className="chip sage" style={{ position: "absolute", top: -10, right: 12 }}>Plan actual</div>}
              <div className="display" style={{ fontSize: 26, color: p.color }}>{p.nombre}</div>
              <div style={{ fontSize: 13, color: "var(--fg-3)", margin: "4px 0 14px" }}>{p.calidad}</div>
              <div className="display" style={{ fontSize: 36 }}>{fmtCOP(p.precio)}</div>
              <div style={{ fontSize: 12, color: "var(--fg-3)", marginBottom: 16 }}>/ mes</div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: 13 }}>
                <li style={{ padding: "6px 0", color: "var(--fg-2)" }}>✓ Hasta {p.max_pantallas} {p.max_pantallas === 1 ? "pantalla" : "pantallas"}</li>
                <li style={{ padding: "6px 0", color: "var(--fg-2)" }}>✓ Calidad {p.calidad}</li>
                <li style={{ padding: "6px 0", color: "var(--fg-2)" }}>✓ Sin anuncios</li>
              </ul>
              {incompat && (
                <div style={{ fontSize: 11, color: "var(--rose)", marginTop: 10, padding: 8, background: "var(--rose-soft)", borderRadius: 6 }}>
                  Tienes {perfilesActivos} perfiles activos. Desactiva al menos {perfilesActivos - p.max_pantallas} para bajar a este plan.
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 24 }}>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        <button className="btn btn-primary" disabled={sel === usuario.plan}
          onClick={() => { toast("Plan actualizado. El cambio se refleja en el próximo cobro."); onClose(); }}>
          Confirmar cambio
        </button>
      </div>
    </Modal>
  );
}

// ---------- Referidos ----------
function ReferralsView({ usuario }) {
  const refs = REFERIDOS.filter(r => r.idReferidor === usuario.id);
  const conv = refs.filter(r => r.beneficioNuevo === "S").length;
  const dscto = refs.reduce((s, r) => s + (r.beneficioReferidor === "S" ? 5000 : 0), 0);
  const toast = useToast();

  return (
    <div>
      <h1 className="display" style={{ fontSize: 56, margin: "20px 0 4px" }}>Programa de referidos</h1>
      <p style={{ color: "var(--fg-3)", marginBottom: 30 }}>Invita a un amigo. Ambos reciben $5.000 de descuento en el siguiente pago.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 30 }}>
        <div className="card" style={{ padding: 26, background: "linear-gradient(140deg, oklch(0.30 0.08 75), var(--bg-1) 70%)" }}>
          <div className="label">Tu enlace de invitación</div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <input className="input" readOnly value="quindioflix.co/r/MARIANA-O-2026" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}/>
            <button className="btn btn-primary" onClick={() => toast("Enlace copiado al portapapeles")}>Copiar</button>
          </div>
          <div style={{ marginTop: 22, fontSize: 13, color: "var(--fg-2)" }}>
            <div style={{ marginBottom: 8 }}>• Tu amigo se registra usando tu enlace.</div>
            <div style={{ marginBottom: 8 }}>• Cuando realiza su primer pago exitoso, ambos reciben el descuento.</div>
            <div>• El beneficio se aplica automáticamente al siguiente cobro.</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 12 }}>
          <div className="kpi">
            <div className="kpi-label">Referidos exitosos</div>
            <div className="kpi-value">{conv}</div>
            <div className="kpi-delta">de {refs.length} invitaciones</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Descuentos acumulados</div>
            <div className="kpi-value">{fmtCOP(dscto)}</div>
            <div className="kpi-delta">aplicados a tu cuenta</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 26 }}>
        <h3 className="display" style={{ fontSize: 22, margin: "0 0 16px" }}>Tus invitaciones</h3>
        <table className="table">
          <thead>
            <tr><th>Persona</th><th>Fecha</th><th>Beneficio aplicado (a ti)</th><th>Beneficio aplicado (a ella/él)</th></tr>
          </thead>
          <tbody>
            {refs.map(r => {
              const u = USUARIOS.find(u => u.id === r.idNuevo) || { nombre: r.nombreNuevo };
              return (
                <tr key={r.id}>
                  <td>{u.nombre}</td>
                  <td className="mono">{r.fecha}</td>
                  <td>{r.beneficioReferidor === "S" ? <span className="chip sage">Aplicado</span> : <span className="chip">Pendiente</span>}</td>
                  <td>{r.beneficioNuevo === "S" ? <span className="chip sage">Aplicado</span> : <span className="chip">Pendiente</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- App principal del consumidor ----------
function ConsumerApp({ onLogout }) {
  const usuario = USUARIOS[0];
  const [perfil, setPerfil] = useStateC(null);
  const [view, setView] = useStateC("inicio");
  const [search, setSearch] = useStateC("");
  const [open, setOpen] = useStateC(null);
  const [playing, setPlaying] = useStateC(null);
  const [reportingItem, setReportingItem] = useStateC(null);
  const [changingPlan, setChangingPlan] = useStateC(false);
  const [favoritos, setFavoritos] = useStateC(FAVORITOS.filter(f => f.idPerfil === 1));
  const [calif, setCalif] = useStateC({});

  // Si la cuenta está INACTIVA bloqueamos
  if (usuario.estado === "INACTIVO") {
    return <InactiveScreen onLogout={onLogout}/>;
  }

  if (!perfil) return <ProfileSelector onPick={setPerfil}/>;

  const openDetail = (item, playNow = false) => {
    setOpen(item);
    if (playNow) {
      setOpen(null);
      setPlaying({ item, episodio: null });
    }
  };

  const onPlay = (item, episodio) => {
    setOpen(null);
    setPlaying({ item, episodio });
  };

  return (
    <div>
      <ConsumerHeader perfil={perfil} onChangeProfile={() => setPerfil(null)} onSearch={setSearch}
        view={search ? "search" : view} onChangeView={(v) => { setSearch(""); setView(v); }} onLogout={onLogout}/>
      <main style={{ padding: "0 40px 80px", maxWidth: 1400, margin: "0 auto" }}>
        {search ? <SearchView query={search} perfil={perfil} onOpen={openDetail}/> :
          view === "inicio" ? <HomeView perfil={perfil} onOpen={openDetail} favoritos={favoritos} repros={REPRODUCCIONES}/> :
          view === "series" ? <CategoryView tipo="SERIE" perfil={perfil} onOpen={openDetail} title="Series"/> :
          view === "peliculas" ? <CategoryView tipo="PELICULA" perfil={perfil} onOpen={openDetail} title="Películas"/> :
          view === "documentales" ? <CategoryView tipo="DOCUMENTAL" perfil={perfil} onOpen={openDetail} title="Documentales"/> :
          view === "musica" ? <CategoryView tipo="MUSICA" perfil={perfil} onOpen={openDetail} title="Música"/> :
          view === "podcasts" ? <CategoryView tipo="PODCAST" perfil={perfil} onOpen={openDetail} title="Podcasts"/> :
          view === "favoritos" ? <FavView favoritos={favoritos} setFavoritos={setFavoritos} onOpen={openDetail}/> :
          view === "cuenta" ? <AccountView usuario={usuario} onChangePlan={() => setChangingPlan(true)} onView={setView}/> :
          view === "referidos" ? <ReferralsView usuario={usuario}/> : null
        }
      </main>

      {open && <DetailModal item={open} perfil={perfil} onClose={() => setOpen(null)}
        onPlay={onPlay} favoritos={favoritos} setFavoritos={setFavoritos}
        calificaciones={calif} setCalif={setCalif}
        onReport={(it) => { setOpen(null); setReportingItem(it); }}/>}
      {playing && <Player item={playing.item} episodio={playing.episodio} onClose={() => setPlaying(null)}/>}
      {reportingItem && <ReportModal item={reportingItem} onClose={() => setReportingItem(null)} perfil={perfil}/>}
      {changingPlan && <ChangePlanModal usuario={usuario} onClose={() => setChangingPlan(false)}/>}
    </div>
  );
}

function InactiveScreen({ onLogout }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div className="card" style={{ padding: 40, maxWidth: 480, textAlign: "center" }}>
        <Icon.shield style={{ width: 48, height: 48, color: "var(--rose)", marginBottom: 18 }}/>
        <h2 className="display" style={{ fontSize: 32, margin: "0 0 12px" }}>Tu cuenta está inactiva</h2>
        <p style={{ color: "var(--fg-3)" }}>Han pasado más de 30 días desde tu fecha de vencimiento sin un pago exitoso. Actualiza tu método de pago para reactivar tu acceso.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 22 }}>
          <button className="btn btn-primary">Realizar pago ahora</button>
          <button className="btn btn-ghost" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConsumerApp });
