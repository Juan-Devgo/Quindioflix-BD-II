import { describe, it, expect } from "vitest";
import {
  validateEstadoReporte,
  validateTransicionEstado,
  validateFechasReporte,
  buildReporte,
  resolverReporte,
  type EstadoReporte,
  type ReporteInput,
} from "../../validators/reporte.validator.js";

describe("Validador de Reporte (HU-CONS-004, HU-MOD-001)", () => {
  describe("validateEstadoReporte", () => {
    it.each<EstadoReporte>(["PENDIENTE", "EN_REVISION", "RESUELTO", "RECHAZADO"])(
      "acepta %s",
      (e) => {
        expect(validateEstadoReporte(e)).toBe(true);
      },
    );

    it("rechaza estado inválido", () => {
      expect(validateEstadoReporte("CERRADO" as EstadoReporte)).toBe(false);
    });
  });

  describe("validateTransicionEstado", () => {
    it("permite PENDIENTE -> EN_REVISION", () => {
      expect(validateTransicionEstado("PENDIENTE", "EN_REVISION").valid).toBe(true);
    });

    it("permite EN_REVISION -> RESUELTO", () => {
      expect(validateTransicionEstado("EN_REVISION", "RESUELTO").valid).toBe(true);
    });

    it("permite EN_REVISION -> RECHAZADO", () => {
      expect(validateTransicionEstado("EN_REVISION", "RECHAZADO").valid).toBe(true);
    });

    it("rechaza PENDIENTE -> RESUELTO (debe pasar por revisión)", () => {
      const r = validateTransicionEstado("PENDIENTE", "RESUELTO");
      expect(r.valid).toBe(false);
    });

    it("rechaza retroceso RESUELTO -> PENDIENTE", () => {
      expect(validateTransicionEstado("RESUELTO", "PENDIENTE").valid).toBe(false);
    });
  });

  describe("validateFechasReporte - chk_rep_fechas", () => {
    it("acepta fecha_resolucion >= fecha_reporte", () => {
      const reporte = new Date("2026-05-01T10:00:00Z");
      const resol = new Date("2026-05-02T08:00:00Z");
      expect(validateFechasReporte(reporte, resol)).toBe(true);
    });

    it("acepta fecha_resolucion nula (sin resolver)", () => {
      expect(validateFechasReporte(new Date(), null)).toBe(true);
    });

    it("rechaza fecha_resolucion anterior a fecha_reporte", () => {
      const reporte = new Date("2026-05-02T10:00:00Z");
      const resol = new Date("2026-05-01T08:00:00Z");
      expect(validateFechasReporte(reporte, resol)).toBe(false);
    });
  });

  describe("buildReporte - HU-CONS-004", () => {
    const input: ReporteInput = {
      id_perfil: 1,
      id_contenido: 100,
      motivo: "Contenido violento sin advertencia",
    };

    it("crea reporte en estado PENDIENTE", () => {
      const r = buildReporte(input);
      expect(r.estado).toBe("PENDIENTE");
      expect(r.fecha_reporte).toBeInstanceOf(Date);
      expect(r.id_empleado_moderador).toBeNull();
    });

    it("rechaza motivo vacío", () => {
      expect(() => buildReporte({ ...input, motivo: "" })).toThrow();
    });
  });

  describe("resolverReporte - HU-MOD-001", () => {
    it("resuelve con comentario y modera empleado", () => {
      const r = resolverReporte({
        estado_actual: "EN_REVISION",
        nuevo_estado: "RESUELTO",
        id_empleado_moderador: 42,
        comentario: "Contenido reclasificado",
        fecha_reporte: new Date("2026-05-01"),
        fecha_resolucion: new Date("2026-05-03"),
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza RESUELTO sin comentario", () => {
      const r = resolverReporte({
        estado_actual: "EN_REVISION",
        nuevo_estado: "RESUELTO",
        id_empleado_moderador: 42,
        comentario: "",
        fecha_reporte: new Date("2026-05-01"),
        fecha_resolucion: new Date("2026-05-03"),
      });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("comentario_requerido");
    });

    it("rechaza si moderador no asignado", () => {
      const r = resolverReporte({
        estado_actual: "EN_REVISION",
        nuevo_estado: "RECHAZADO",
        id_empleado_moderador: null,
        comentario: "No procede",
        fecha_reporte: new Date("2026-05-01"),
        fecha_resolucion: new Date("2026-05-03"),
      });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("moderador_requerido");
    });
  });
});
