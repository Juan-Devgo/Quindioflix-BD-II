import type { ReporteEstado } from './types'

export const qk = {
  session: () => ['session'] as const,

  catalog: {
    all: () => ['catalog'] as const,
    byId: (id: number) => ['catalog', id] as const,
    episodes: (id: number) => ['catalog', id, 'episodes'] as const,
    relations: () => ['catalog', 'relations'] as const,
  },

  profiles: (userId: number) => ['profiles', userId] as const,
  user: (userId: number) => ['user', userId] as const,

  favorites: (profileId: number) => ['favorites', profileId] as const,
  playback: (profileId: number) => ['playback', profileId] as const,
  ratings: (profileId: number) => ['ratings', profileId] as const,

  reports: {
    all: () => ['reports'] as const,
    byStatus: (s: ReporteEstado) => ['reports', s] as const,
    byModerator: (id: number) => ['reports', 'moderator', id] as const,
  },

  payments: (userId: number) => ['payments', userId] as const,
  plans: () => ['plans'] as const,
  cities: () => ['cities'] as const,
  genres: () => ['genres'] as const,

  referrals: (userId: number) => ['referrals', userId] as const,

  employees: {
    all: () => ['employees'] as const,
    byDepartment: (id: number) => ['employees', 'dept', id] as const,
    team: (empId: number) => ['employees', 'team', empId] as const,
  },
  departments: () => ['departments'] as const,

  metrics: () => ['metrics'] as const,

  dba: {
    schemas: () => ['dba', 'schemas'] as const,
    users: () => ['dba', 'users'] as const,
    tablespaces: () => ['dba', 'tablespaces'] as const,
    perf: () => ['dba', 'perf'] as const,
    backups: () => ['dba', 'backups'] as const,
  },
}
