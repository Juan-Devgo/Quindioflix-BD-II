import { describe, it, expect } from "vitest";
import {
  diasDesdeVencimiento,
  evaluarMorosidad,
  reactivarPorPagoExitoso,
  calcularNuevaFechaVencimiento,
  type EstadoUsuario,
} from "../../services/morosidad.service.js";

describe("Servicio de Morosidad (HU-USR-004, RN-06, HU-PAG-001)", () => {
  describe("diasDesdeVencimiento", () => {
    it("retorna 0 si fecha_vencimiento == hoy", () => {
      const hoy = new Date("2026-05-21T00:00:00Z");
      expect(diasDesdeVencimiento(hoy, hoy)).toBe(0);
    });

    it("retorna 30 si vencimiento fue hace 30 días", () => {
      const hoy = new Date("2026-05-21T00:00:00Z");
      const venc = new Date("2026-04-21T00:00:00Z");
      expect(diasDesdeVencimiento(venc, hoy)).toBe(30);
    });

    it("retorna negativo si vencimiento es futuro", () => {
      const hoy = new Date("2026-05-21T00:00:00Z");
      const venc = new Date("2026-06-01T00:00:00Z");
      expect(diasDesdeVencimiento(venc, hoy)).toBeLessThan(0);
    });
  });

  describe("evaluarMorosidad - RN-06 desactivación 30 días", () => {
    const hoy = new Date("2026-05-21T00:00:00Z");

    it("mantiene ACTIVO si <= 30 días sin pago exitoso", () => {
      const r = evaluarMorosidad({
        estado_actual: "ACTIVO",
        fecha_vencimiento: new Date("2026-05-01T00:00:00Z"),
        ultimo_pago_exitoso: null,
        hoy,
      });
      expect(r.nuevo_estado).toBe<EstadoUsuario>("ACTIVO");
    });

    it("cambia a INACTIVO si > 30 días sin pago exitoso", () => {
      const r = evaluarMorosidad({
        estado_actual: "ACTIVO",
        fecha_vencimiento: new Date("2026-04-15T00:00:00Z"),
        ultimo_pago_exitoso: null,
        hoy,
      });
      expect(r.nuevo_estado).toBe<EstadoUsuario>("INACTIVO");
      expect(r.razon).toBe("morosidad_30_dias");
    });

    it("mantiene ACTIVO si hay pago exitoso posterior a vencimiento", () => {
      const r = evaluarMorosidad({
        estado_actual: "ACTIVO",
        fecha_vencimiento: new Date("2026-04-01T00:00:00Z"),
        ultimo_pago_exitoso: new Date("2026-04-10T00:00:00Z"),
        hoy,
      });
      expect(r.nuevo_estado).toBe<EstadoUsuario>("ACTIVO");
    });

    it("no cambia si ya está INACTIVO", () => {
      const r = evaluarMorosidad({
        estado_actual: "INACTIVO",
        fecha_vencimiento: new Date("2026-04-01T00:00:00Z"),
        ultimo_pago_exitoso: null,
        hoy,
      });
      expect(r.nuevo_estado).toBe<EstadoUsuario>("INACTIVO");
      expect(r.cambio).toBe(false);
    });
  });

  describe("reactivarPorPagoExitoso", () => {
    it("reactiva usuario INACTIVO ante pago EXITOSO", () => {
      const r = reactivarPorPagoExitoso({
        estado_actual: "INACTIVO",
        estado_pago: "EXITOSO",
      });
      expect(r.nuevo_estado).toBe<EstadoUsuario>("ACTIVO");
      expect(r.cambio).toBe(true);
    });

    it("no reactiva si pago no es EXITOSO", () => {
      const r = reactivarPorPagoExitoso({
        estado_actual: "INACTIVO",
        estado_pago: "FALLIDO",
      });
      expect(r.cambio).toBe(false);
    });

    it("ignora si ya está ACTIVO", () => {
      const r = reactivarPorPagoExitoso({
        estado_actual: "ACTIVO",
        estado_pago: "EXITOSO",
      });
      expect(r.cambio).toBe(false);
    });
  });

  describe("calcularNuevaFechaVencimiento", () => {
    it("suma 30 días a partir de hoy si vencimiento ya pasó", () => {
      const hoy = new Date("2026-05-21T00:00:00Z");
      const venc = new Date("2026-04-01T00:00:00Z");
      const nueva = calcularNuevaFechaVencimiento({ fecha_vencimiento: venc, hoy });
      expect(nueva.toISOString()).toBe(new Date("2026-06-20T00:00:00Z").toISOString());
    });

    it("suma 30 días a partir de fecha_vencimiento si aún vigente", () => {
      const hoy = new Date("2026-05-21T00:00:00Z");
      const venc = new Date("2026-06-01T00:00:00Z");
      const nueva = calcularNuevaFechaVencimiento({ fecha_vencimiento: venc, hoy });
      expect(nueva.toISOString()).toBe(new Date("2026-07-01T00:00:00Z").toISOString());
    });
  });
});
