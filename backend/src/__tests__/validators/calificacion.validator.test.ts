import { describe, it, expect } from "vitest";
import {
  validateEstrellas,
  canRateContent,
  upsertCalificacion,
  type CalificacionInput,
} from "../../validators/calificacion.validator.js";

describe("Validador de Calificación (HU-CONS-003, RN-04, RN-05)", () => {
  describe("validateEstrellas", () => {
    it.each([1, 2, 3, 4, 5])("acepta %i estrellas", (v) => {
      expect(validateEstrellas(v)).toBe(true);
    });

    it.each([0, 6, -1, 3.5, NaN])("rechaza valor inválido %s", (v) => {
      expect(validateEstrellas(v as number)).toBe(false);
    });
  });

  describe("canRateContent - RN-04 mínimo 50% reproducido", () => {
    it("permite calificar si avance >= 50%", () => {
      expect(canRateContent({ porcentaje_avance: 50 }).allowed).toBe(true);
      expect(canRateContent({ porcentaje_avance: 80 }).allowed).toBe(true);
    });

    it("bloquea si avance < 50%", () => {
      const r = canRateContent({ porcentaje_avance: 49 });
      expect(r.allowed).toBe(false);
      expect(r.reason).toBe("avance_insuficiente");
    });

    it("bloquea si nunca se ha reproducido", () => {
      const r = canRateContent({ porcentaje_avance: 0 });
      expect(r.allowed).toBe(false);
    });
  });

  describe("upsertCalificacion - RN-05 calificación única por perfil", () => {
    const input: CalificacionInput = {
      id_perfil: 1,
      id_contenido: 100,
      estrellas: 4,
      resena: "Buena",
    };

    it("crea registro si no existe previo", () => {
      const result = upsertCalificacion(input, { existing: null });
      expect(result.action).toBe("created");
    });

    it("actualiza si ya existe calificación previa", () => {
      const result = upsertCalificacion(
        { ...input, estrellas: 5 },
        { existing: { id_perfil: 1, id_contenido: 100, estrellas: 3, resena: "vieja" } },
      );
      expect(result.action).toBe("updated");
      expect(result.estrellas).toBe(5);
    });

    it("rechaza estrellas fuera de rango", () => {
      expect(() => upsertCalificacion({ ...input, estrellas: 9 }, { existing: null })).toThrow();
    });
  });
});
