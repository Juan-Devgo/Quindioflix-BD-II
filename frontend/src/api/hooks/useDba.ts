import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'

export interface DbSchema {
  name: string
  tables: number
  size: string
  desc: string
}
export const SCHEMAS: Array<DbSchema> = [
  { name: 'QF_CORE', tables: 18, size: '412 MB', desc: 'Núcleo: usuarios, perfiles, suscripciones, pagos' },
  { name: 'QF_CONTENT', tables: 9, size: '1.2 GB', desc: 'Catálogo, temporadas, episodios, géneros, relaciones' },
  { name: 'QF_CONSUMPTION', tables: 6, size: '8.7 GB', desc: 'Reproducciones, favoritos, calificaciones, reportes' },
  { name: 'QF_HR', tables: 4, size: '32 MB', desc: 'Empleados, departamentos, jerarquía' },
  { name: 'QF_REPORTS_MV', tables: 12, size: '780 MB', desc: 'Vistas materializadas para analítica gerencial' },
]

export interface DbUser {
  user: string
  role: string
  status: 'ACTIVO' | 'INACTIVO'
  privs: Array<string>
}
export const DB_USERS: Array<DbUser> = [
  { user: 'QF_ADMIN', role: 'DBA', status: 'ACTIVO', privs: ['ALL'] },
  { user: 'QF_APP_RW', role: 'APP_READ_WRITE', status: 'ACTIVO', privs: ['SELECT', 'INSERT', 'UPDATE', 'DELETE'] },
  { user: 'QF_APP_RO', role: 'APP_READ_ONLY', status: 'ACTIVO', privs: ['SELECT'] },
  { user: 'QF_REPORT', role: 'BI_USER', status: 'ACTIVO', privs: ['SELECT en QF_REPORTS_MV'] },
  { user: 'QF_BATCH', role: 'BATCH_JOB', status: 'ACTIVO', privs: ['EXEC PKG_FACTURACION', 'EXEC PKG_MOROSIDAD'] },
  { user: 'QF_DEV', role: 'DEVELOPER', status: 'INACTIVO', privs: ['DDL en QF_DEV_SCHEMA'] },
]

export interface Tablespace {
  name: string
  used: number
  total: number
  type: 'PERMANENT' | 'TEMPORARY' | 'UNDO'
}
export const TABLESPACES: Array<Tablespace> = [
  { name: 'TS_CORE', used: 412, total: 1024, type: 'PERMANENT' },
  { name: 'TS_CONTENT', used: 1224, total: 4096, type: 'PERMANENT' },
  { name: 'TS_CONSUMPTION', used: 8907, total: 16384, type: 'PERMANENT' },
  { name: 'TS_REPORTS', used: 798, total: 2048, type: 'PERMANENT' },
  { name: 'TS_TEMP', used: 124, total: 512, type: 'TEMPORARY' },
  { name: 'TS_UNDO', used: 89, total: 256, type: 'UNDO' },
]

export interface CostlyQuery {
  id: string
  sql: string
  e: number
  t: number
}
export const COSTLY_QUERIES: Array<CostlyQuery> = [
  { id: '8h2k9d', sql: 'SELECT * FROM REPRODUCCION WHERE id_perfil = :1 AND fecha_inicio > :2', e: 142211, t: 41 },
  { id: 'kj22n0', sql: 'INSERT INTO REPRODUCCION (...)', e: 89220, t: 8 },
  { id: '9aa8s2', sql: 'MERGE INTO USUARIO USING (SELECT ...) ON (id_usuario = :1)', e: 1203, t: 122 },
  { id: '2as89d', sql: 'SELECT id_contenido, AVG(estrellas) FROM CALIFICACION GROUP BY id_contenido', e: 412, t: 880 },
]

export interface Backup {
  type: string
  date: string
  size: string
  dur: string
  status: 'OK' | 'ERROR'
}
export const BACKUPS: Array<Backup> = [
  { type: 'RMAN FULL', date: '2026-05-19 03:00', size: '11.4 GB', dur: '23m 12s', status: 'OK' },
  { type: 'RMAN INCR', date: '2026-05-18 03:00', size: '812 MB', dur: '4m 02s', status: 'OK' },
  { type: 'RMAN INCR', date: '2026-05-17 03:00', size: '744 MB', dur: '3m 58s', status: 'OK' },
  { type: 'EXPORT DP', date: '2026-05-12 02:00', size: '9.8 GB', dur: '18m 41s', status: 'OK' },
  { type: 'RMAN FULL', date: '2026-05-12 03:00', size: '10.9 GB', dur: '22m 04s', status: 'OK' },
]

export function useSchemas() {
  return useQuery({ queryKey: qk.dba.schemas(), queryFn: async () => SCHEMAS })
}
export function useDbUsers() {
  return useQuery({ queryKey: qk.dba.users(), queryFn: async () => DB_USERS })
}
export function useTablespaces() {
  return useQuery({ queryKey: qk.dba.tablespaces(), queryFn: async () => TABLESPACES })
}
export function useDbPerf() {
  return useQuery({ queryKey: qk.dba.perf(), queryFn: async () => COSTLY_QUERIES })
}
export function useDbBackups() {
  return useQuery({ queryKey: qk.dba.backups(), queryFn: async () => BACKUPS })
}
