import { describe, it, expect } from "vitest";
import {
  validateEmpleadoRol,
  validateJefeDepartamento,
  validateSupervisorMismoDepto,
  validateModeradorSoporte,
  type RolEmpleado,
} from "../../validators/empleado.validator.js";

describe("Validador de Empleado (HU-EMP-001/002, RN-09, RN-10, RN-12)", () => {
  describe("validateEmpleadoRol", () => {
    it.each<RolEmpleado>(["EMPLEADO", "SUPERVISOR", "JEFE", "MODERADOR"])(
      "acepta rol %s",
      (r) => {
        expect(validateEmpleadoRol(r)).toBe(true);
      },
    );

    it("rechaza rol desconocido", () => {
      expect(validateEmpleadoRol("CEO" as RolEmpleado)).toBe(false);
    });
  });

  describe("validateJefeDepartamento - RN-09", () => {
    it("acepta jefe del mismo departamento", () => {
      const r = validateJefeDepartamento({
        id_empleado: 1,
        id_departamento_empleado: 10,
        id_departamento_destino: 10,
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza jefe de departamento ajeno", () => {
      const r = validateJefeDepartamento({
        id_empleado: 1,
        id_departamento_empleado: 10,
        id_departamento_destino: 20,
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("jefe_departamento_no_pertenece");
    });
  });

  describe("validateSupervisorMismoDepto - RN-10", () => {
    it("acepta supervisor en mismo departamento", () => {
      const r = validateSupervisorMismoDepto({
        id_departamento_supervisor: 5,
        id_departamento_empleado: 5,
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza supervisor cross-departamento", () => {
      const r = validateSupervisorMismoDepto({
        id_departamento_supervisor: 5,
        id_departamento_empleado: 6,
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("supervisor_departamento_distinto");
    });
  });

  describe("validateModeradorSoporte - RN-12", () => {
    const ID_SOPORTE = 3;

    it("acepta MODERADOR en departamento Soporte", () => {
      const r = validateModeradorSoporte({
        rol: "MODERADOR",
        id_departamento: ID_SOPORTE,
        id_departamento_soporte: ID_SOPORTE,
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza MODERADOR fuera de Soporte", () => {
      const r = validateModeradorSoporte({
        rol: "MODERADOR",
        id_departamento: 99,
        id_departamento_soporte: ID_SOPORTE,
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("moderador_fuera_de_soporte");
    });

    it("ignora regla si rol distinto a MODERADOR", () => {
      const r = validateModeradorSoporte({
        rol: "EMPLEADO",
        id_departamento: 99,
        id_departamento_soporte: ID_SOPORTE,
      });
      expect(r.valid).toBe(true);
    });
  });
});
