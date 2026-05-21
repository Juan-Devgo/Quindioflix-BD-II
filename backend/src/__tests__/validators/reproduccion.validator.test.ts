import { describe, it, expect } from "vitest";
import {
  validateReproduccionXor,
  validateDispositivo,
  validateAvance,
  validateFechas,
  buildReproduccion,
  type ReproduccionInput,
  type Dispositivo,
} from "../../validators/reproduccion.validator.js";

describe("Validador de Reproducción (HU-CONS-001, RN-11)", () => {
  describe("validateReproduccionXor - RN-11", () => {
    it("acepta solo id_contenido", () => {
      expect(validateReproduccionXor({ id_contenido: 1, id_episodio: null }).valid).toBe(true);
    });

    it("acepta solo id_episodio", () => {
      expect(validateReproduccionXor({ id_contenido: null, id_episodio: 5 }).valid).toBe(true);
    });

    it("rechaza ambos poblados", () => {
      const r = validateReproduccionXor({ id_contenido: 1, id_episodio: 5 });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("chk_repr_xor");
    });

    it("rechaza ninguno poblado", () => {
      const r = validateReproduccionXor({ id_contenido: null, id_episodio: null });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("chk_repr_xor");
    });
  });

  describe("validateDispositivo", () => {
    it.each<Dispositivo>(["CELULAR", "TABLET", "TV", "COMPUTADOR"])("acepta %s", (d) => {
      expect(validateDispositivo(d)).toBe(true);
    });

    it("rechaza dispositivo desconocido", () => {
      expect(validateDispositivo("RADIO" as Dispositivo)).toBe(false);
    });
  });

  describe("validateAvance", () => {
    it.each([0, 25, 50, 100])("acepta %s", (v) => {
      expect(validateAvance(v)).toBe(true);
    });

    it.each([-1, 101, 150])("rechaza %s", (v) => {
      expect(validateAvance(v)).toBe(false);
    });
  });

  describe("validateFechas - chk_repr_fechas", () => {
    it("acepta fecha_fin >= fecha_inicio", () => {
      const inicio = new Date("2026-01-01T10:00:00Z");
      const fin = new Date("2026-01-01T11:00:00Z");
      expect(validateFechas(inicio, fin)).toBe(true);
    });

    it("acepta fecha_fin nula (reproducción en curso)", () => {
      expect(validateFechas(new Date(), null)).toBe(true);
    });

    it("rechaza fecha_fin < fecha_inicio", () => {
      const inicio = new Date("2026-01-01T11:00:00Z");
      const fin = new Date("2026-01-01T10:00:00Z");
      expect(validateFechas(inicio, fin)).toBe(false);
    });
  });

  describe("buildReproduccion", () => {
    it("crea registro inicial con avance 0", () => {
      const input: ReproduccionInput = {
        id_perfil: 1,
        id_contenido: 100,
        id_episodio: null,
        dispositivo: "TV",
      };
      const r = buildReproduccion(input);
      expect(r.porcentaje_avance).toBe(0);
      expect(r.fecha_inicio).toBeInstanceOf(Date);
      expect(r.fecha_fin).toBeNull();
    });

    it("lanza si viola xor (contenido y episodio juntos)", () => {
      expect(() =>
        buildReproduccion({
          id_perfil: 1,
          id_contenido: 1,
          id_episodio: 2,
          dispositivo: "TV",
        }),
      ).toThrow();
    });
  });
});
