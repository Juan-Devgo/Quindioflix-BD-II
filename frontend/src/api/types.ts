export type Role = 'consumer' | 'content' | 'moderator' | 'management' | 'dba' | 'admin'

export interface SessionUser {
  email: string
  role: Role
  nombre: string
  desc?: string
}

export interface Ciudad {
  id: number
  nombre: string
  departamento: string
}

export interface Plan {
  id: number
  nombre: string
  precio: number
  max_pantallas: number
  calidad: string
  color: string
}

export type ContenidoTipo = 'PELICULA' | 'SERIE' | 'DOCUMENTAL' | 'MUSICA' | 'PODCAST'
export type Clasificacion = 'TP' | '+7' | '+13' | '+16' | '+18'

export interface Contenido {
  id: number
  titulo: string
  tipo: ContenidoTipo
  anio: number
  clasif: Clasificacion
  original: boolean
  sinopsis: string
  duracion: number | null
  generos: Array<string>
  promedio: number
  vistas: number
  fechaCatalogo: string
  gradient: string
  director?: string
  reparto?: Array<string>
  temporadas?: number
}

export interface Episodio {
  num: number
  titulo: string
  duracion: number
  fecha: string
}
export interface Temporada {
  num: number
  titulo: string
  episodios: Array<Episodio>
}
export interface EpisodiosOfSerie {
  temporadas: Array<Temporada>
}
export type EpisodiosMap = Record<number, EpisodiosOfSerie>

export type RelacionTipo = 'SPIN-OFF' | 'SECUELA' | 'PRECUELA' | 'REMAKE' | 'OTRO'

export interface Relacion {
  origen: number
  destino: number
  tipo: RelacionTipo
  descripcion?: string
}

export type UsuarioEstado = 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO'

export interface Usuario {
  id: number
  nombre: string
  email: string
  telefono: string
  fechaNacimiento: string
  ciudad: number
  plan: number
  estado: UsuarioEstado
  fechaRegistro: string
  fechaVencimiento: string
  referidor: number | null
}

export type PerfilTipo = 'ADULTO' | 'INFANTIL'

export interface Perfil {
  id: number
  idUsuario: number
  nombre: string
  tipo: PerfilTipo
  avatar: string
  activo: boolean
  color: string
}

export type MetodoPago = 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'PSE' | 'NEQUI' | 'DAVIPLATA'
export type PagoEstado = 'EXITOSO' | 'FALLIDO' | 'PENDIENTE' | 'REEMBOLSADO'

export interface Pago {
  id: number
  idUsuario: number
  fecha: string
  monto: number
  descuento: number
  descripcionDescuento: string | null
  metodo: MetodoPago
  estado: PagoEstado
  plan: number
  referencia: string
}

export interface Favorito {
  idPerfil: number
  idContenido: number
  fecha: string
}

export type DispositivoTipo = 'TV' | 'CELULAR' | 'TABLET' | 'COMPUTADOR'

export interface EpisodioRef {
  idSerie: number
  temp: number
  ep: number
}

export interface Reproduccion {
  id: number
  idPerfil: number
  idContenido: number | null
  idEpisodio: EpisodioRef | null
  fechaInicio: string
  dispositivo: DispositivoTipo
  avance: number
}

export interface Departamento {
  id: number
  nombre: string
  idJefe: number
}

export type EmpleadoRol = 'JEFE' | 'SUPERVISOR' | 'EMPLEADO' | 'MODERADOR'

export interface Empleado {
  id: number
  nombre: string
  email: string
  departamento: number
  rol: EmpleadoRol
  supervisor: number | null
  activo: boolean
  fechaIngreso: string
}

export type ReporteEstado = 'PENDIENTE' | 'EN_REVISION' | 'RESUELTO' | 'RECHAZADO'

export interface Reporte {
  id: number
  idPerfil: number
  idContenido: number
  fechaReporte: string
  estado: ReporteEstado
  motivo: string
  moderador: number | null
  fechaResolucion?: string
  comentarioResolucion?: string
}

export interface Referido {
  id: number
  idReferidor: number
  idNuevo: number
  fecha: string
  beneficioReferidor: 'S' | 'N'
  beneficioNuevo: 'S' | 'N'
  nombreNuevo?: string
}

export interface MetricaCiudad {
  ciudad: string
  reproducciones: number
  ingresos: number
}
export interface MetricaTipo {
  tipo: string
  porcentaje: number
  color: string
}
export interface MetricaPlan {
  plan: string
  usuarios: number
  repros: number
  churn: number
}
export interface MetricaDispositivo {
  d: string
  v: number
}
export interface MetricaIngresoMes {
  m: string
  v: number
}

export interface Metricas {
  consumoCiudad: Array<MetricaCiudad>
  consumoTipo: Array<MetricaTipo>
  consumoPlan: Array<MetricaPlan>
  dispositivos: Array<MetricaDispositivo>
  ingresosMes: Array<MetricaIngresoMes>
}

export interface Calificacion {
  stars: number
  resena: string
  fecha: string
}
export type CalificacionesMap = Record<number, Calificacion>
