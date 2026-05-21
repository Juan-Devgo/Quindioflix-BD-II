import { useQuery } from '@tanstack/react-query'
import { qk } from '../query-keys'
import { DEPARTAMENTOS, EMPLEADOS } from '../mocks/data'

export function useEmployees() {
  return useQuery({
    queryKey: qk.employees.all(),
    queryFn: async () => EMPLEADOS,
  })
}

export function useEmployeesByDepartment(depId: number | undefined) {
  return useQuery({
    queryKey: depId != null ? qk.employees.byDepartment(depId) : ['employees', 'dept', 'none'],
    queryFn: async () => EMPLEADOS.filter((e) => e.departamento === depId),
    enabled: depId != null,
  })
}

export function useTeam(empId: number | undefined) {
  return useQuery({
    queryKey: empId != null ? qk.employees.team(empId) : ['employees', 'team', 'none'],
    queryFn: async () => {
      const emp = EMPLEADOS.find((e) => e.id === empId)
      if (!emp) return null
      const supervisor = emp.supervisor ? EMPLEADOS.find((e) => e.id === emp.supervisor) ?? null : null
      const peers = EMPLEADOS.filter((e) => e.supervisor === emp.supervisor && e.id !== emp.id)
      return { self: emp, supervisor, peers }
    },
    enabled: empId != null,
  })
}

export function useDepartments() {
  return useQuery({ queryKey: qk.departments(), queryFn: async () => DEPARTAMENTOS, staleTime: Infinity })
}
