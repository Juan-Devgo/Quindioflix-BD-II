import type { Role } from '../types'

export interface DemoCredential {
  email: string
  password: string
  role: Role
  nombre: string
  desc: string
}

export const CREDENCIALES: Array<DemoCredential> = [
  { email: 'mariana@correo.co', password: 'quindio2026', role: 'consumer', nombre: 'Mariana Ospina', desc: 'Cliente · Plan Premium · Armenia' },
  { email: 'andres.cardona@correo.co', password: 'andres123', role: 'consumer', nombre: 'Andrés Cardona', desc: 'Cliente · Plan Estándar · Pereira' },
  { email: 'daniela.p@quindioflix.co', password: 'contenido123', role: 'content', nombre: 'Daniela Pulgarín', desc: 'Empleada · Dpto. Contenido' },
  { email: 'mateo.s@quindioflix.co', password: 'moderar123', role: 'moderator', nombre: 'Mateo Salazar', desc: 'Moderador · Dpto. Soporte' },
  { email: 'laura.henao@quindioflix.co', password: 'gerencia123', role: 'management', nombre: 'Laura Henao', desc: 'Jefa · Dpto. Contenido' },
  { email: 'sys@quindioflix.db', password: 'oracle23ai', role: 'dba', nombre: 'sys', desc: 'Administrador de base de datos' },
]
