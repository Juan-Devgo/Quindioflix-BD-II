// =====================================================
// QuindioFlix — Datos mock
// =====================================================

const CIUDADES = [
  { id: 1, nombre: "Armenia", departamento: "Quindío" },
  { id: 2, nombre: "Pereira", departamento: "Risaralda" },
  { id: 3, nombre: "Manizales", departamento: "Caldas" },
  { id: 4, nombre: "Bogotá", departamento: "Cundinamarca" },
  { id: 5, nombre: "Medellín", departamento: "Antioquia" },
  { id: 6, nombre: "Cali", departamento: "Valle del Cauca" },
  { id: 7, nombre: "Cartagena", departamento: "Bolívar" },
  { id: 8, nombre: "Bucaramanga", departamento: "Santander" },
];

const PLANES = [
  { id: 1, nombre: "Básico", precio: 18900, max_pantallas: 2, calidad: "HD", color: "oklch(0.65 0.05 60)" },
  { id: 2, nombre: "Estándar", precio: 28900, max_pantallas: 3, calidad: "Full HD", color: "oklch(0.72 0.085 160)" },
  { id: 3, nombre: "Premium", precio: 38900, max_pantallas: 5, calidad: "4K + HDR", color: "oklch(0.82 0.135 75)" },
];

const GENEROS = [
  "Acción", "Drama", "Comedia", "Suspenso", "Ciencia ficción", "Documental",
  "Animación", "Romance", "Terror", "Aventura", "Crimen", "Histórico",
  "Indie", "Latinoamericano", "Musical"
];

// Helper para generar gradientes únicos por poster
const grad = (h1, h2) => `linear-gradient(160deg, oklch(0.5 0.13 ${h1}), oklch(0.22 0.04 ${h2}))`;

const CATALOGO = [
  { id: 1, titulo: "Niebla sobre Salento", tipo: "PELICULA", anio: 2024, clasif: "+13", original: true,
    sinopsis: "Una cafetera de tercera generación enfrenta la herencia de un secreto familiar enterrado bajo los cafetales.",
    duracion: 118, generos: ["Drama", "Latinoamericano"], promedio: 4.6, vistas: 124530, fechaCatalogo: "2024-09-12",
    gradient: grad(160, 60), director: "Catalina Restrepo", reparto: ["María Cecilia Botero", "Diego Trujillo"] },
  { id: 2, titulo: "Los caminos del viento", tipo: "SERIE", anio: 2025, clasif: "+16", original: true,
    sinopsis: "Seis hermanos descubren que el mapa que su abuelo escondió es la clave de un imperio de contrabando.",
    duracion: null, generos: ["Drama", "Crimen", "Aventura"], promedio: 4.8, vistas: 312890,
    fechaCatalogo: "2025-01-22", gradient: grad(30, 25), temporadas: 2 },
  { id: 3, titulo: "Memoria de un río", tipo: "DOCUMENTAL", anio: 2023, clasif: "TP", original: false,
    sinopsis: "Un retrato sonoro del Cauca y las comunidades que crecieron a sus orillas.",
    duracion: 92, generos: ["Documental"], promedio: 4.3, vistas: 41209, fechaCatalogo: "2023-11-04",
    gradient: grad(230, 200) },
  { id: 4, titulo: "Tinto", tipo: "SERIE", anio: 2024, clasif: "+13", original: true,
    sinopsis: "La vida diaria de una cafetería en Filandia donde cada cliente trae un cuento.",
    duracion: null, generos: ["Comedia", "Drama"], promedio: 4.5, vistas: 89432,
    fechaCatalogo: "2024-03-18", gradient: grad(80, 40), temporadas: 3 },
  { id: 5, titulo: "El último arriero", tipo: "PELICULA", anio: 2022, clasif: "+13", original: false,
    sinopsis: "El viaje de un arriero que cruza la cordillera para entregar una carta antes de morir.",
    duracion: 104, generos: ["Drama", "Aventura", "Histórico"], promedio: 4.4, vistas: 67120,
    fechaCatalogo: "2022-08-30", gradient: grad(50, 30) },
  { id: 6, titulo: "Pulso 90", tipo: "MUSICA", anio: 2025, clasif: "TP", original: true,
    sinopsis: "Concierto en vivo: lo mejor de la música tropical noventera grabado en Cartagena.",
    duracion: 72, generos: ["Musical"], promedio: 4.7, vistas: 198410, fechaCatalogo: "2025-02-14",
    gradient: grad(320, 280) },
  { id: 7, titulo: "Café con bits", tipo: "PODCAST", anio: 2024, clasif: "+7", original: true,
    sinopsis: "Conversaciones semanales sobre tecnología y cultura digital desde el Eje Cafetero.",
    duracion: null, generos: ["Documental"], promedio: 4.2, vistas: 28341,
    fechaCatalogo: "2024-04-02", gradient: grad(200, 230), temporadas: 4 },
  { id: 8, titulo: "Sangre y guayaba", tipo: "PELICULA", anio: 2025, clasif: "+18", original: true,
    sinopsis: "Un thriller rural donde un detective regresa a su pueblo natal para investigar un crimen imposible.",
    duracion: 132, generos: ["Suspenso", "Crimen"], promedio: 4.5, vistas: 156782,
    fechaCatalogo: "2025-03-10", gradient: grad(0, 20) },
  { id: 9, titulo: "Mariposas amarillas", tipo: "DOCUMENTAL", anio: 2024, clasif: "TP", original: true,
    sinopsis: "Una mirada a los escritores latinoamericanos que cambiaron la literatura del siglo XX.",
    duracion: 85, generos: ["Documental", "Histórico"], promedio: 4.9, vistas: 73224,
    fechaCatalogo: "2024-06-21", gradient: grad(100, 70) },
  { id: 10, titulo: "Polvo cósmico", tipo: "PELICULA", anio: 2023, clasif: "+13", original: false,
    sinopsis: "Una astrónoma colombiana descubre una señal que podría cambiar la historia de la humanidad.",
    duracion: 116, generos: ["Ciencia ficción", "Drama"], promedio: 4.4, vistas: 92013,
    fechaCatalogo: "2023-12-09", gradient: grad(250, 280) },
  { id: 11, titulo: "La hora más fría", tipo: "SERIE", anio: 2025, clasif: "+16", original: true,
    sinopsis: "Una unidad de homicidios trabaja entre la niebla del páramo de Letras.",
    duracion: null, generos: ["Crimen", "Suspenso"], promedio: 4.6, vistas: 211045,
    fechaCatalogo: "2025-04-05", gradient: grad(220, 240), temporadas: 1 },
  { id: 12, titulo: "Cuentos de la abuela", tipo: "SERIE", anio: 2024, clasif: "TP", original: true,
    sinopsis: "Relatos animados basados en mitos y leyendas del folclor colombiano.",
    duracion: null, generos: ["Animación", "Aventura"], promedio: 4.7, vistas: 142331,
    fechaCatalogo: "2024-07-15", gradient: grad(40, 80), temporadas: 2 },
  { id: 13, titulo: "Vereda alta", tipo: "PELICULA", anio: 2024, clasif: "+7", original: false,
    sinopsis: "Tres hermanos pasan un verano inolvidable en la finca de sus abuelos.",
    duracion: 98, generos: ["Drama", "Aventura"], promedio: 4.3, vistas: 54221,
    fechaCatalogo: "2024-10-01", gradient: grad(140, 100) },
  { id: 14, titulo: "Silencio en la línea", tipo: "PODCAST", anio: 2025, clasif: "+16", original: true,
    sinopsis: "Casos sin resolver investigados por una periodista que arriesga todo por la verdad.",
    duracion: null, generos: ["Crimen", "Documental"], promedio: 4.8, vistas: 67430,
    fechaCatalogo: "2025-01-30", gradient: grad(260, 280), temporadas: 3 },
];

// Episodios para series/podcasts (solo los más relevantes)
const EPISODIOS = {
  2: { // Los caminos del viento
    temporadas: [
      { num: 1, titulo: "El mapa", episodios: [
        { num: 1, titulo: "La carta sin remitente", duracion: 52, fecha: "2025-01-22" },
        { num: 2, titulo: "Tres hermanos, un secreto", duracion: 48, fecha: "2025-01-29" },
        { num: 3, titulo: "La estación abandonada", duracion: 55, fecha: "2025-02-05" },
        { num: 4, titulo: "Coordenadas falsas", duracion: 51, fecha: "2025-02-12" },
        { num: 5, titulo: "El último puerto", duracion: 58, fecha: "2025-02-19" },
      ]},
      { num: 2, titulo: "El imperio", episodios: [
        { num: 1, titulo: "Volver al origen", duracion: 50, fecha: "2025-08-12" },
        { num: 2, titulo: "Sangre nueva", duracion: 54, fecha: "2025-08-19" },
      ]},
    ]
  },
  4: { // Tinto
    temporadas: [
      { num: 1, titulo: "Aroma a recién hecho", episodios: [
        { num: 1, titulo: "El primer café", duracion: 28, fecha: "2024-03-18" },
        { num: 2, titulo: "Sin azúcar", duracion: 26, fecha: "2024-03-25" },
        { num: 3, titulo: "Dobles cargados", duracion: 30, fecha: "2024-04-01" },
      ]},
    ]
  }
};

// Relaciones entre contenidos
const RELACIONES = [
  { origen: 2, destino: 11, tipo: "SPIN-OFF", descripcion: "Universo extendido de 'Los caminos del viento'" },
  { origen: 4, destino: 13, tipo: "OTRO", descripcion: "Ambientadas en la misma región" },
];

const USUARIOS = [
  { id: 1, nombre: "Mariana Ospina", email: "mariana.ospina@correo.co", telefono: "+57 310 555 0184",
    fechaNacimiento: "1991-07-14", ciudad: 1, plan: 3, estado: "ACTIVO",
    fechaRegistro: "2023-04-12", fechaVencimiento: "2026-06-12", referidor: null },
  { id: 2, nombre: "Andrés Cardona", email: "andres.cardona@correo.co", telefono: "+57 320 555 0021",
    fechaNacimiento: "1988-02-03", ciudad: 2, plan: 2, estado: "ACTIVO",
    fechaRegistro: "2024-11-30", fechaVencimiento: "2026-06-04", referidor: 1 },
  { id: 3, nombre: "Sofía Restrepo", email: "sofia.r@correo.co", telefono: "+57 311 555 7702",
    fechaNacimiento: "1995-09-22", ciudad: 5, plan: 1, estado: "INACTIVO",
    fechaRegistro: "2023-08-08", fechaVencimiento: "2026-04-10", referidor: null },
];

// Perfiles del usuario activo (id=1)
const PERFILES = [
  { id: 1, idUsuario: 1, nombre: "Mariana", tipo: "ADULTO", avatar: "M", activo: true, color: "oklch(0.82 0.135 75)" },
  { id: 2, idUsuario: 1, nombre: "Juan David", tipo: "ADULTO", avatar: "J", activo: true, color: "oklch(0.72 0.085 160)" },
  { id: 3, idUsuario: 1, nombre: "Isabela", tipo: "INFANTIL", avatar: "I", activo: true, color: "oklch(0.78 0.085 230)" },
  { id: 4, idUsuario: 1, nombre: "Invitados", tipo: "ADULTO", avatar: "+", activo: true, color: "oklch(0.55 0.02 60)" },
];

// Pagos del usuario activo
const PAGOS = [
  { id: 1, idUsuario: 1, fecha: "2026-05-12", monto: 38900, descuento: 0, descripcionDescuento: null,
    metodo: "TARJETA_CREDITO", estado: "EXITOSO", plan: 3, referencia: "QF-298120-A8" },
  { id: 2, idUsuario: 1, fecha: "2026-04-12", monto: 38900, descuento: 5000, descripcionDescuento: "Beneficio referido — Andrés C.",
    metodo: "TARJETA_CREDITO", estado: "EXITOSO", plan: 3, referencia: "QF-291203-B1" },
  { id: 3, idUsuario: 1, fecha: "2026-03-12", monto: 38900, descuento: 0, descripcionDescuento: null,
    metodo: "TARJETA_CREDITO", estado: "EXITOSO", plan: 3, referencia: "QF-284119-C4" },
  { id: 4, idUsuario: 1, fecha: "2026-02-12", monto: 38900, descuento: 0, descripcionDescuento: null,
    metodo: "PSE", estado: "EXITOSO", plan: 3, referencia: "QF-277018-D2" },
  { id: 5, idUsuario: 1, fecha: "2026-01-12", monto: 28900, descuento: 0, descripcionDescuento: null,
    metodo: "TARJETA_CREDITO", estado: "EXITOSO", plan: 2, referencia: "QF-269901-E7" },
  { id: 6, idUsuario: 1, fecha: "2025-12-12", monto: 28900, descuento: 0, descripcionDescuento: null,
    metodo: "TARJETA_CREDITO", estado: "FALLIDO", plan: 2, referencia: "QF-262780-F9" },
];

// Favoritos del perfil activo (id=1)
const FAVORITOS = [
  { idPerfil: 1, idContenido: 1, fecha: "2026-04-20" },
  { idPerfil: 1, idContenido: 9, fecha: "2026-05-02" },
  { idPerfil: 1, idContenido: 11, fecha: "2026-05-10" },
  { idPerfil: 1, idContenido: 14, fecha: "2026-05-15" },
];

// Reproducciones recientes
const REPRODUCCIONES = [
  { id: 1, idPerfil: 1, idContenido: 1, idEpisodio: null, fechaInicio: "2026-05-18 21:14", dispositivo: "TV", avance: 100 },
  { id: 2, idPerfil: 1, idContenido: null, idEpisodio: { idSerie: 2, temp: 1, ep: 3 }, fechaInicio: "2026-05-17 22:02", dispositivo: "TV", avance: 87 },
  { id: 3, idPerfil: 1, idContenido: 9, idEpisodio: null, fechaInicio: "2026-05-15 19:40", dispositivo: "TABLET", avance: 42 },
  { id: 4, idPerfil: 1, idContenido: null, idEpisodio: { idSerie: 4, temp: 1, ep: 1 }, fechaInicio: "2026-05-14 12:18", dispositivo: "CELULAR", avance: 100 },
  { id: 5, idPerfil: 1, idContenido: 10, idEpisodio: null, fechaInicio: "2026-05-11 20:55", dispositivo: "TV", avance: 28 },
];

const DEPARTAMENTOS = [
  { id: 1, nombre: "Contenido", idJefe: 1 },
  { id: 2, nombre: "Soporte", idJefe: 4 },
  { id: 3, nombre: "Tecnología", idJefe: 8 },
  { id: 4, nombre: "Mercadeo", idJefe: 11 },
];

const EMPLEADOS = [
  // Contenido
  { id: 1, nombre: "Laura Henao", email: "laura.henao@quindioflix.co", departamento: 1, rol: "JEFE", supervisor: null, activo: true, fechaIngreso: "2022-01-10" },
  { id: 2, nombre: "Camilo Vargas", email: "camilo.vargas@quindioflix.co", departamento: 1, rol: "SUPERVISOR", supervisor: 1, activo: true, fechaIngreso: "2022-04-22" },
  { id: 3, nombre: "Daniela Pulgarín", email: "daniela.p@quindioflix.co", departamento: 1, rol: "EMPLEADO", supervisor: 2, activo: true, fechaIngreso: "2023-02-14" },
  { id: 12, nombre: "Sebastián Loaiza", email: "sebastian.l@quindioflix.co", departamento: 1, rol: "EMPLEADO", supervisor: 2, activo: true, fechaIngreso: "2023-08-01" },
  { id: 13, nombre: "Valentina Acosta", email: "vale.acosta@quindioflix.co", departamento: 1, rol: "EMPLEADO", supervisor: 2, activo: true, fechaIngreso: "2024-03-15" },
  // Soporte
  { id: 4, nombre: "Esteban Quintero", email: "esteban.q@quindioflix.co", departamento: 2, rol: "JEFE", supervisor: null, activo: true, fechaIngreso: "2021-09-01" },
  { id: 5, nombre: "Paula Marín", email: "paula.marin@quindioflix.co", departamento: 2, rol: "SUPERVISOR", supervisor: 4, activo: true, fechaIngreso: "2022-06-10" },
  { id: 6, nombre: "Mateo Salazar", email: "mateo.s@quindioflix.co", departamento: 2, rol: "MODERADOR", supervisor: 5, activo: true, fechaIngreso: "2023-01-20" },
  { id: 7, nombre: "Lucía Bermúdez", email: "lucia.b@quindioflix.co", departamento: 2, rol: "MODERADOR", supervisor: 5, activo: true, fechaIngreso: "2024-02-28" },
  // Tecnología
  { id: 8, nombre: "Felipe Echeverri", email: "felipe.e@quindioflix.co", departamento: 3, rol: "JEFE", supervisor: null, activo: true, fechaIngreso: "2021-05-15" },
  { id: 9, nombre: "Ana María Tobón", email: "ana.tobon@quindioflix.co", departamento: 3, rol: "SUPERVISOR", supervisor: 8, activo: true, fechaIngreso: "2022-11-04" },
  { id: 10, nombre: "Jorge Cano", email: "jorge.c@quindioflix.co", departamento: 3, rol: "EMPLEADO", supervisor: 9, activo: true, fechaIngreso: "2023-09-22" },
  // Mercadeo
  { id: 11, nombre: "Catalina Pineda", email: "cata.pineda@quindioflix.co", departamento: 4, rol: "JEFE", supervisor: null, activo: true, fechaIngreso: "2022-02-18" },
  { id: 14, nombre: "Rodrigo Mejía", email: "rodrigo.m@quindioflix.co", departamento: 4, rol: "EMPLEADO", supervisor: 11, activo: true, fechaIngreso: "2024-06-01" },
];

const REPORTES = [
  { id: 1, idPerfil: 2, idContenido: 8, fechaReporte: "2026-05-18 14:22", estado: "PENDIENTE",
    motivo: "Violencia gráfica explícita en escena de apertura sin advertencia previa al espectador.", moderador: null },
  { id: 2, idPerfil: 3, idContenido: 12, fechaReporte: "2026-05-17 09:45", estado: "PENDIENTE",
    motivo: "Capítulo presenta lenguaje inadecuado para audiencia infantil pese a clasificación TP.", moderador: null },
  { id: 3, idPerfil: 1, idContenido: 11, fechaReporte: "2026-05-16 22:10", estado: "EN_REVISION",
    motivo: "Sinopsis no coincide con el contenido real del episodio piloto.", moderador: 6 },
  { id: 4, idPerfil: 2, idContenido: 5, fechaReporte: "2026-05-14 18:30", estado: "RESUELTO",
    fechaResolucion: "2026-05-15 10:12", comentarioResolucion: "Se reclasificó como +13. Metadatos actualizados en CONTENIDO.",
    motivo: "Clasificación de edad incorrecta; aparece TP pero contiene escenas no aptas.", moderador: 6 },
  { id: 5, idPerfil: 3, idContenido: 6, fechaReporte: "2026-05-12 16:50", estado: "RECHAZADO",
    fechaResolucion: "2026-05-13 11:40", comentarioResolucion: "Contenido cumple políticas. Reporte no procede.",
    motivo: "El audio tiene problemas técnicos.", moderador: 7 },
  { id: 6, idPerfil: 2, idContenido: 14, fechaReporte: "2026-05-19 08:11", estado: "PENDIENTE",
    motivo: "Episodio describe métodos delictivos con excesivo detalle.", moderador: null },
  { id: 7, idPerfil: 1, idContenido: 10, fechaReporte: "2026-05-19 11:33", estado: "PENDIENTE",
    motivo: "Subtítulos en español desincronizados durante todo el film.", moderador: null },
];

// Referidos del usuario id=1
const REFERIDOS = [
  { id: 1, idReferidor: 1, idNuevo: 2, fecha: "2024-11-30", beneficioReferidor: "S", beneficioNuevo: "S" },
  { id: 2, idReferidor: 1, idNuevo: 15, fecha: "2025-03-12", beneficioReferidor: "S", beneficioNuevo: "S",
    nombreNuevo: "Juliana Ríos" },
  { id: 3, idReferidor: 1, idNuevo: 16, fecha: "2026-02-08", beneficioReferidor: "N", beneficioNuevo: "S",
    nombreNuevo: "Carlos Mejía" },
];

// Métricas para dashboards
const METRICAS = {
  consumoCiudad: [
    { ciudad: "Bogotá", reproducciones: 1245820, ingresos: 412330000 },
    { ciudad: "Medellín", reproducciones: 892140, ingresos: 298710000 },
    { ciudad: "Cali", reproducciones: 612330, ingresos: 187220000 },
    { ciudad: "Barranquilla", reproducciones: 421890, ingresos: 128440000 },
    { ciudad: "Cartagena", reproducciones: 318220, ingresos: 102110000 },
    { ciudad: "Pereira", reproducciones: 287430, ingresos: 89320000 },
    { ciudad: "Bucaramanga", reproducciones: 241180, ingresos: 78920000 },
    { ciudad: "Armenia", reproducciones: 198720, ingresos: 62410000 },
  ],
  consumoTipo: [
    { tipo: "Serie", porcentaje: 48, color: "var(--accent)" },
    { tipo: "Película", porcentaje: 31, color: "var(--sage)" },
    { tipo: "Documental", porcentaje: 11, color: "var(--sky)" },
    { tipo: "Música", porcentaje: 6, color: "oklch(0.78 0.135 320)" },
    { tipo: "Podcast", porcentaje: 4, color: "oklch(0.78 0.135 280)" },
  ],
  consumoPlan: [
    { plan: "Básico", usuarios: 18430, repros: 412000, churn: 8.2 },
    { plan: "Estándar", usuarios: 34210, repros: 921000, churn: 5.1 },
    { plan: "Premium", usuarios: 12890, repros: 689000, churn: 2.8 },
  ],
  dispositivos: [
    { d: "TV", v: 52 }, { d: "Celular", v: 24 }, { d: "Tablet", v: 14 }, { d: "Computador", v: 10 },
  ],
  ingresosMes: [
    { m: "Nov", v: 1428 }, { m: "Dic", v: 1502 }, { m: "Ene", v: 1611 },
    { m: "Feb", v: 1672 }, { m: "Mar", v: 1798 }, { m: "Abr", v: 1834 }, { m: "May", v: 1921 },
  ],
};

// Expose globally
Object.assign(window, {
  CIUDADES, PLANES, GENEROS, CATALOGO, EPISODIOS, RELACIONES,
  USUARIOS, PERFILES, PAGOS, FAVORITOS, REPRODUCCIONES,
  DEPARTAMENTOS, EMPLEADOS, REPORTES, REFERIDOS, METRICAS
});
