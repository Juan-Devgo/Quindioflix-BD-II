// =====================================================
// QuindioFlix — Landing pública + Autenticación
// =====================================================

const { useState: useStateA, useEffect: useEffectA } = React;

// ---------- Credenciales demo ----------
// En producción esto vive en el backend con hash + token; aquí es solo mock.
const CREDENCIALES = [
  { email: "mariana@correo.co", password: "quindio2026", role: "consumer", nombre: "Mariana Ospina", desc: "Cliente · Plan Premium · Armenia" },
  { email: "andres.cardona@correo.co", password: "andres123", role: "consumer", nombre: "Andrés Cardona", desc: "Cliente · Plan Estándar · Pereira" },
  { email: "daniela.p@quindioflix.co", password: "contenido123", role: "content", nombre: "Daniela Pulgarín", desc: "Empleada · Dpto. Contenido" },
  { email: "mateo.s@quindioflix.co", password: "moderar123", role: "moderator", nombre: "Mateo Salazar", desc: "Moderador · Dpto. Soporte" },
  { email: "laura.henao@quindioflix.co", password: "gerencia123", role: "management", nombre: "Laura Henao", desc: "Jefa · Dpto. Contenido" },
  { email: "sys@quindioflix.db", password: "oracle23ai", role: "dba", nombre: "sys", desc: "Administrador de base de datos" },
];

// ---------- Landing pública ----------
function Landing({ onLogin, onRegister }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "radial-gradient(ellipse at 80% -20%, oklch(0.30 0.10 75) 0%, transparent 50%), radial-gradient(ellipse at 0% 80%, oklch(0.22 0.06 160) 0%, transparent 50%), var(--bg-0)" }}>
      {/* Header */}
      <header style={{ padding: "22px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Brand size="md"/>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="#planes" style={{ color: "var(--fg-2)", fontSize: 14, padding: "8px 14px" }}>Planes</a>
          <a href="#catalogo" style={{ color: "var(--fg-2)", fontSize: 14, padding: "8px 14px" }}>Catálogo</a>
          <a href="#features" style={{ color: "var(--fg-2)", fontSize: 14, padding: "8px 14px" }}>Cómo funciona</a>
          <button className="btn" onClick={onLogin}>Iniciar sesión</button>
          <button className="btn btn-primary" onClick={onRegister}>Crear cuenta</button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "60px 48px 100px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="upper" style={{ color: "var(--accent)", marginBottom: 22 }}>Streaming hecho en Colombia · desde 2023</div>
        <h1 className="display" style={{ fontSize: 104, lineHeight: 0.92, letterSpacing: "-0.03em", margin: "0 0 24px", maxWidth: 1100 }}>
          Historias del trópico,<br/>
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>en cualquier pantalla.</em>
        </h1>
        <p style={{ fontSize: 19, color: "var(--fg-2)", maxWidth: 620, lineHeight: 1.5, margin: "0 0 36px" }}>
          Películas, series, documentales, música y podcasts originales del Eje Cafetero y de toda Latinoamérica. Sin anuncios, sin contratos, en hasta 5 pantallas.
        </p>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn btn-primary" onClick={onRegister} style={{ padding: "14px 26px", fontSize: 16 }}>
            Empieza desde $18.900/mes
          </button>
          <button className="btn" onClick={onLogin} style={{ padding: "14px 22px", fontSize: 15 }}>
            Ya tengo cuenta
          </button>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 56, color: "var(--fg-3)", fontSize: 13 }}>
          <div><span className="display" style={{ fontSize: 30, color: "var(--fg)", display: "block" }}>65K+</span>suscriptores activos</div>
          <div><span className="display" style={{ fontSize: 30, color: "var(--fg)", display: "block" }}>340</span>títulos en catálogo</div>
          <div><span className="display" style={{ fontSize: 30, color: "var(--fg)", display: "block" }}>120+</span>producciones originales</div>
          <div><span className="display" style={{ fontSize: 30, color: "var(--fg)", display: "block" }}>4K</span>HDR en plan Premium</div>
        </div>
      </section>

      {/* Catálogo preview */}
      <section id="catalogo" style={{ padding: "60px 0 80px", borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ padding: "0 48px", maxWidth: 1280, margin: "0 auto 32px" }}>
          <h2 className="display" style={{ fontSize: 48, margin: "0 0 10px" }}>Lo que verás</h2>
          <p style={{ color: "var(--fg-3)", fontSize: 16, margin: 0 }}>Una muestra de los originales y favoritos del momento.</p>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 48px", scrollbarWidth: "none" }}>
          {CATALOGO.slice(0, 10).map(item => (
            <div key={item.id} style={{ flexShrink: 0 }}>
              <Poster item={item} size="lg"/>
            </div>
          ))}
        </div>
      </section>

      {/* Planes */}
      <section id="planes" style={{ padding: "80px 48px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <div className="upper" style={{ color: "var(--accent)", marginBottom: 14 }}>Planes y precios</div>
          <h2 className="display" style={{ fontSize: 56, margin: "0 0 14px", letterSpacing: "-0.02em" }}>Elige cómo ver.</h2>
          <p style={{ color: "var(--fg-2)", fontSize: 16, maxWidth: 540, margin: "0 auto" }}>Cambia o cancela cuando quieras. El precio se mantiene fijo el primer año.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          {PLANES.map(p => (
            <div key={p.id} className="card" style={{
              padding: 32, position: "relative",
              background: p.id === 3 ? "linear-gradient(160deg, oklch(0.28 0.08 75), var(--bg-1))" : "var(--bg-1)",
              borderColor: p.id === 3 ? "var(--accent)" : "var(--border-soft)",
            }}>
              {p.id === 3 && <div className="chip accent" style={{ position: "absolute", top: -10, left: 24 }}>Más popular</div>}
              <div className="display" style={{ fontSize: 32, color: p.color, marginBottom: 4 }}>{p.nombre}</div>
              <div style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 20 }}>{p.calidad}</div>
              <div className="display" style={{ fontSize: 56, letterSpacing: "-0.02em" }}>{fmtCOP(p.precio)}</div>
              <div style={{ fontSize: 13, color: "var(--fg-3)", marginBottom: 26 }}>/ mes</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                <PlanFeature ok>Hasta {p.max_pantallas} pantallas simultáneas</PlanFeature>
                <PlanFeature ok>Calidad de imagen {p.calidad}</PlanFeature>
                <PlanFeature ok>Sin anuncios</PlanFeature>
                <PlanFeature ok>Descargas para ver sin internet</PlanFeature>
                <PlanFeature ok={p.id >= 2}>Audio espacial</PlanFeature>
                <PlanFeature ok={p.id === 3}>Acceso anticipado a originales</PlanFeature>
              </ul>
              <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "12px 20px" }} onClick={onRegister}>
                Empezar con {p.nombre}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 48px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <h2 className="display" style={{ fontSize: 48, margin: "0 0 40px", textAlign: "center" }}>Pensado para tu hogar.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
          {[
            { i: Icon.user, t: "Múltiples perfiles", d: "Cada miembro del hogar con sus recomendaciones, su lista y su historial." },
            { i: Icon.shield, t: "Modo infantil", d: "Perfiles con clasificación de edad TP, +7 y +13 restringidos automáticamente." },
            { i: Icon.device.tv, t: "En cualquier dispositivo", d: "TV, celular, tablet o computador. Tu reproducción se sincroniza." },
            { i: Icon.gift, t: "Referidos", d: "Invita amigos y ambos reciben $5.000 de descuento en el siguiente pago." },
          ].map((f, i) => {
            const Ic = f.i;
            return (
              <div key={i} className="card" style={{ padding: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Ic style={{ width: 20, height: 20 }}/>
                </div>
                <div className="display" style={{ fontSize: 22, marginBottom: 8 }}>{f.t}</div>
                <p style={{ fontSize: 14, color: "var(--fg-3)", margin: 0, lineHeight: 1.5 }}>{f.d}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 48px 100px", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h2 className="display" style={{ fontSize: 64, margin: "0 0 18px", letterSpacing: "-0.02em" }}>
          ¿Listo para empezar?
        </h2>
        <p style={{ color: "var(--fg-2)", fontSize: 17, marginBottom: 30 }}>Crea tu cuenta en menos de un minuto. Cancela cuando quieras.</p>
        <button className="btn btn-primary" onClick={onRegister} style={{ padding: "16px 32px", fontSize: 16 }}>
          Crear cuenta gratuita
        </button>
      </section>

      <footer style={{ padding: "32px 48px", borderTop: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", color: "var(--fg-4)", fontSize: 12, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
          <Brand size="sm"/>
          <span>© 2026 QuindioFlix S.A.S · NIT 901.234.567-8</span>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="#">Términos</a>
          <a href="#">Privacidad</a>
          <a href="#">Centro de ayuda</a>
          <a href="#">Trabaja con nosotros</a>
        </div>
      </footer>
    </div>
  );
}

function PlanFeature({ ok, children }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: ok ? "var(--fg-2)" : "var(--fg-4)" }}>
      {ok ? <Icon.check style={{ width: 16, height: 16, color: "var(--sage)", flexShrink: 0 }}/> : <Icon.close style={{ width: 16, height: 16, color: "var(--fg-4)", flexShrink: 0 }}/>}
      <span style={{ textDecoration: ok ? "none" : "line-through" }}>{children}</span>
    </li>
  );
}

// ---------- Login ----------
function LoginPage({ onSuccess, onRegister, onBack }) {
  const [email, setEmail] = useStateA("");
  const [password, setPassword] = useStateA("");
  const [error, setError] = useStateA(null);
  const [showDemo, setShowDemo] = useStateA(true);
  const [loading, setLoading] = useStateA(false);

  const submit = (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const user = CREDENCIALES.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      setLoading(false);
      if (!user) {
        setError("Credenciales inválidas. Verifica tu email y contraseña.");
        return;
      }
      onSuccess(user);
    }, 500);
  };

  const useDemo = (creds) => {
    setEmail(creds.email);
    setPassword(creds.password);
    setError(null);
  };

  return (
    <AuthShell onBack={onBack} side={
      <DemoPanel show={showDemo} onToggle={() => setShowDemo(!showDemo)} onUse={useDemo}/>
    }>
      <h1 className="display" style={{ fontSize: 52, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Iniciar sesión</h1>
      <p style={{ color: "var(--fg-3)", marginBottom: 32, fontSize: 15 }}>Bienvenido de vuelta. Continúa donde lo dejaste.</p>

      <form onSubmit={submit}>
        <div style={{ marginBottom: 16 }}>
          <span className="label">Correo electrónico</span>
          <input className="input" type="email" autoFocus value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.co" required style={{ padding: "12px 14px", fontSize: 15 }}/>
        </div>
        <div style={{ marginBottom: 8 }}>
          <span className="label">Contraseña</span>
          <input className="input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required style={{ padding: "12px 14px", fontSize: 15 }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg-3)", cursor: "pointer" }}>
            <input type="checkbox" style={{ accentColor: "var(--accent)" }}/>
            Mantenerme conectado
          </label>
          <a href="#" style={{ fontSize: 13, color: "var(--accent)" }}>¿Olvidaste tu contraseña?</a>
        </div>
        {error && (
          <div style={{ padding: 12, background: "var(--rose-soft)", border: "1px solid oklch(0.70 0.135 25 / 0.4)", borderRadius: "var(--r-md)", color: "var(--rose)", fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading || !email || !password} style={{ width: "100%", justifyContent: "center", padding: "14px 20px", fontSize: 15 }}>
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </form>

      <hr className="divider" style={{ margin: "26px 0" }}/>
      <div style={{ textAlign: "center", fontSize: 14, color: "var(--fg-3)" }}>
        ¿Aún no tienes cuenta? <a href="#" onClick={(e) => { e.preventDefault(); onRegister(); }} style={{ color: "var(--accent)" }}>Regístrate gratis</a>
      </div>
    </AuthShell>
  );
}

// ---------- Panel demo (credenciales por rol) ----------
function DemoPanel({ show, onToggle, onUse }) {
  return (
    <div style={{ padding: 28 }}>
      <div className="chip accent" style={{ marginBottom: 18 }}>Modo demo</div>
      <h3 className="display" style={{ fontSize: 28, margin: "0 0 8px" }}>Cuentas de prueba</h3>
      <p style={{ color: "var(--fg-3)", fontSize: 13, margin: "0 0 20px" }}>
        Selecciona un rol para precargar las credenciales. Cada rol entra a una app distinta del sistema.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {CREDENCIALES.map(c => (
          <div key={c.email} onClick={() => onUse(c)}
            className="card"
            style={{ padding: 12, cursor: "pointer", background: "var(--bg-1)", transition: "border-color 0.15s" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-soft)"}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="avatar" style={{ width: 32, height: 32, fontSize: 14, background: roleColor(c.role), color: "oklch(0.16 0.01 60)" }}>{c.nombre[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--fg)" }}>{c.nombre}</div>
                <div style={{ fontSize: 11, color: "var(--fg-3)" }}>{c.desc}</div>
              </div>
              <span className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>{roleLabel(c.role)}</span>
            </div>
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed var(--border-soft)", display: "grid", gridTemplateColumns: "max-content 1fr", gap: "2px 10px", fontSize: 11 }}>
              <span style={{ color: "var(--fg-4)" }}>email</span>
              <span className="mono" style={{ color: "var(--fg-2)" }}>{c.email}</span>
              <span style={{ color: "var(--fg-4)" }}>pass</span>
              <span className="mono" style={{ color: "var(--fg-2)" }}>{c.password}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, padding: 12, background: "var(--bg-2)", borderRadius: "var(--r-md)", fontSize: 11, color: "var(--fg-3)", lineHeight: 1.5 }}>
        <strong style={{ color: "var(--fg-2)" }}>Nota de seguridad:</strong> en producción cada rol tiene su propio esquema de privilegios sobre la base de datos (ver panel DBA). Las credenciales aquí mostradas son únicamente para demostración del prototipo.
      </div>
    </div>
  );
}

const roleColor = (r) => ({
  consumer: "var(--accent)", content: "var(--sage)",
  moderator: "var(--sky)", management: "oklch(0.78 0.135 320)", dba: "oklch(0.55 0.02 60)"
}[r]);
const roleLabel = (r) => ({
  consumer: "Cliente", content: "Contenido", moderator: "Moderador",
  management: "Gerencia", dba: "DBA"
}[r]);

// ---------- Registro ----------
function RegisterPage({ onSuccess, onLogin, onBack }) {
  const [step, setStep] = useStateA(1);
  const [form, setForm] = useStateA({
    nombre: "", email: "", telefono: "",
    fechaNacimiento: "", ciudad: 1, password: "", confirmar: "",
    plan: 2, referidor: "", aceptar: false,
  });
  const [error, setError] = useStateA(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canStep1 = form.nombre.length >= 3 && /\S+@\S+\.\S+/.test(form.email) && form.fechaNacimiento && form.password.length >= 8 && form.password === form.confirmar;
  const canStep2 = !!form.plan && form.aceptar;

  const submit = () => {
    setError(null);
    // RN-01: email único
    const existe = CREDENCIALES.find(c => c.email.toLowerCase() === form.email.toLowerCase());
    if (existe) { setError("Este correo ya está registrado. Inicia sesión o usa otro."); setStep(1); return; }
    onSuccess({ email: form.email, nombre: form.nombre, role: "consumer", desc: "Cliente · cuenta nueva" });
  };

  return (
    <AuthShell onBack={onBack} wide side={
      <div style={{ padding: 36, background: "linear-gradient(170deg, oklch(0.30 0.10 75) 0%, var(--bg-1) 90%)", height: "100%" }}>
        <div className="chip accent" style={{ marginBottom: 24 }}>Crear cuenta</div>
        <h2 className="display" style={{ fontSize: 40, lineHeight: 1.0, margin: "0 0 18px" }}>
          Tu próxima<br/>maratón te espera.
        </h2>
        <p style={{ color: "var(--fg-2)", fontSize: 15, lineHeight: 1.5, marginBottom: 32 }}>
          Crea tu cuenta y elige el plan que se ajusta a tu hogar. Puedes cambiarlo cuando quieras.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          <Step n={1} active={step === 1} done={step > 1} label="Cuenta personal"/>
          <Step n={2} active={step === 2} done={step > 2} label="Plan y confirmación"/>
        </div>
        <div style={{ padding: 16, background: "oklch(0 0 0 / 0.25)", borderRadius: 12, fontSize: 13, color: "var(--fg-2)" }}>
          <strong style={{ color: "var(--accent)" }}>¿Te invitaron?</strong><br/>
          Si llegaste con un código de referido, en el paso 2 te aplicaremos automáticamente un descuento de <strong>$5.000</strong> en tu primer pago.
        </div>
      </div>
    }>
      {step === 1 && (
        <>
          <h1 className="display" style={{ fontSize: 44, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Tu información</h1>
          <p style={{ color: "var(--fg-3)", marginBottom: 28, fontSize: 14 }}>Paso 1 de 2 · Datos personales y acceso</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <span className="label">Nombre completo</span>
              <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Mariana Ospina" autoFocus/>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span className="label">Correo electrónico</span>
              <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@correo.co"/>
            </div>
            <div>
              <span className="label">Teléfono <span style={{ color: "var(--fg-4)", textTransform: "none" }}>(opcional)</span></span>
              <input className="input" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} placeholder="+57 300 000 0000"/>
            </div>
            <div>
              <span className="label">Fecha de nacimiento</span>
              <input className="input" type="date" value={form.fechaNacimiento} onChange={(e) => set("fechaNacimiento", e.target.value)}/>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span className="label">Ciudad de residencia</span>
              <select className="select" value={form.ciudad} onChange={(e) => set("ciudad", +e.target.value)}>
                {CIUDADES.map(c => <option key={c.id} value={c.id}>{c.nombre}, {c.departamento}</option>)}
              </select>
            </div>
            <div>
              <span className="label">Contraseña</span>
              <input className="input" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Mínimo 8 caracteres"/>
            </div>
            <div>
              <span className="label">Confirmar contraseña</span>
              <input className="input" type="password" value={form.confirmar} onChange={(e) => set("confirmar", e.target.value)} placeholder="Repite la contraseña"/>
              {form.confirmar && form.confirmar !== form.password && <div style={{ fontSize: 11, color: "var(--rose)", marginTop: 4 }}>Las contraseñas no coinciden.</div>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between", marginTop: 28 }}>
            <button className="btn btn-ghost" onClick={onLogin}>Ya tengo cuenta</button>
            <button className="btn btn-primary" disabled={!canStep1} onClick={() => setStep(2)}>
              Continuar
              <Icon.arrow style={{ width: 14, height: 14 }}/>
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="display" style={{ fontSize: 44, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Elige tu plan</h1>
          <p style={{ color: "var(--fg-3)", marginBottom: 28, fontSize: 14 }}>Paso 2 de 2 · Selecciona el plan que mejor se adapta a ti</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
            {PLANES.map(p => (
              <div key={p.id} onClick={() => set("plan", p.id)} className="card"
                style={{
                  padding: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 16,
                  borderColor: form.plan === p.id ? "var(--accent)" : "var(--border-soft)",
                  background: form.plan === p.id ? "var(--bg-2)" : "var(--bg-1)"
                }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid " + (form.plan === p.id ? "var(--accent)" : "var(--border)"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {form.plan === p.id && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)" }}/>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span className="display" style={{ fontSize: 22, color: p.color }}>{p.nombre}</span>
                    <span style={{ fontSize: 12, color: "var(--fg-3)" }}>{p.calidad} · {p.max_pantallas} pantallas</span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="display" style={{ fontSize: 22 }}>{fmtCOP(p.precio)}</div>
                  <div style={{ fontSize: 11, color: "var(--fg-3)" }}>/ mes</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 20 }}>
            <span className="label">Código de referido <span style={{ color: "var(--fg-4)", textTransform: "none" }}>(opcional)</span></span>
            <input className="input" value={form.referidor} onChange={(e) => set("referidor", e.target.value)} placeholder="Ej: MARIANA-O-2026"/>
            {form.referidor && (
              <div className="chip sage" style={{ marginTop: 8 }}>
                <Icon.gift style={{ width: 12, height: 12 }}/> Recibirás $5.000 de descuento en tu primer pago (RN-07, RN-08)
              </div>
            )}
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "var(--fg-2)", padding: 14, background: "var(--bg-2)", borderRadius: "var(--r-md)", cursor: "pointer", marginBottom: 18 }}>
            <input type="checkbox" checked={form.aceptar} onChange={(e) => set("aceptar", e.target.checked)} style={{ accentColor: "var(--accent)", marginTop: 2 }}/>
            <span>Acepto los términos y condiciones de QuindioFlix y autorizo el tratamiento de mis datos según la política de privacidad.</span>
          </label>

          {error && (
            <div style={{ padding: 12, background: "var(--rose-soft)", border: "1px solid oklch(0.70 0.135 25 / 0.4)", borderRadius: "var(--r-md)", color: "var(--rose)", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
            <button className="btn" onClick={() => setStep(1)}>
              <Icon.arrow style={{ width: 14, height: 14, transform: "rotate(180deg)" }}/>
              Volver
            </button>
            <button className="btn btn-primary" disabled={!canStep2} onClick={submit}>
              Crear cuenta y entrar
            </button>
          </div>
        </>
      )}
    </AuthShell>
  );
}

function Step({ n, active, done, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: active || done ? 1 : 0.5 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: done ? "var(--sage)" : active ? "var(--accent)" : "var(--bg-3)",
        color: "oklch(0.16 0.01 60)", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 600
      }}>{done ? <Icon.check style={{ width: 14, height: 14 }}/> : n}</div>
      <div style={{ fontSize: 14, color: active ? "var(--fg)" : "var(--fg-2)" }}>{label}</div>
    </div>
  );
}

// ---------- Auth shell (layout 2 columnas) ----------
function AuthShell({ children, side, onBack, wide }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: wide ? "1fr 1.1fr" : "1fr 1fr", background: "var(--bg-0)" }}>
      <div style={{ background: "var(--bg-1)", borderRight: "1px solid var(--border-soft)", overflowY: "auto", maxHeight: "100vh" }}>
        {side}
      </div>
      <div style={{ padding: "32px 48px", display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
          <Brand size="sm"/>
          <button className="btn btn-ghost" onClick={onBack} style={{ fontSize: 13 }}>
            <Icon.arrow style={{ width: 14, height: 14, transform: "rotate(180deg)" }}/>
            Volver al inicio
          </button>
        </div>
        <div style={{ flex: 1, maxWidth: 460, margin: "0 auto", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "20px 0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Landing, LoginPage, RegisterPage, CREDENCIALES });
