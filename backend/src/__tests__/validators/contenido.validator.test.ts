import { describe, it, expect } from "vitest";
import {
  validateContenidoTipo,
  validateClasificacion,
  validateContenidoInput,
  validateTemporadaUnica,
  validateEpisodioUnico,
  validateRelacionContenido,
  type ContenidoInput,
  type TipoContenido,
  type ClasificacionEdad,
  type TipoRelacion,
} from "../../validators/contenido.validator.js";

describe("Validador de Contenido (HU-CONT-001..005, RN-15)", () => {
  describe("validateContenidoTipo", () => {
    it.each<TipoContenido>(["PELICULA", "SERIE", "DOCUMENTAL", "MUSICA", "PODCAST"])(
      "acepta %s",
      (t) => {
        expect(validateContenidoTipo(t)).toBe(true);
      },
    );

    it("rechaza tipo inválido", () => {
      expect(validateContenidoTipo("CORTO" as TipoContenido)).toBe(false);
    });
  });

  describe("validateClasificacion", () => {
    it.each<ClasificacionEdad>(["TP", "+7", "+13", "+16", "+18"])("acepta %s", (c) => {
      expect(validateClasificacion(c)).toBe(true);
    });

    it("rechaza clasificación inválida", () => {
      expect(validateClasificacion("+21" as ClasificacionEdad)).toBe(false);
    });
  });

  describe("validateContenidoInput - HU-CONT-001", () => {
    const base: ContenidoInput = {
      titulo: "Pelicula X",
      tipo: "PELICULA",
      anio_lanzamiento: 2024,
      sinopsis: "Resumen",
      clasificacion: "+13",
      original_quindioflix: "N",
      duracion_minutos: 120,
      id_empleado_responsable: 5,
    };

    it("acepta película con duración obligatoria", () => {
      expect(validateContenidoInput(base).valid).toBe(true);
    });

    it("rechaza película sin duración", () => {
      const r = validateContenidoInput({ ...base, duracion_minutos: null });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("duracion_requerida");
    });

    it("rechaza duración <= 0 en película", () => {
      const r = validateContenidoInput({ ...base, duracion_minutos: 0 });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("duracion_requerida");
    });

    it("permite serie sin duración (se calcula por episodios)", () => {
      const r = validateContenidoInput({
        ...base,
        tipo: "SERIE",
        duracion_minutos: null,
      });
      expect(r.valid).toBe(true);
    });

    it("permite podcast sin duración", () => {
      const r = validateContenidoInput({
        ...base,
        tipo: "PODCAST",
        duracion_minutos: null,
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza si título vacío", () => {
      const r = validateContenidoInput({ ...base, titulo: "" });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("titulo_requerido");
    });

    it("rechaza original_quindioflix con valor distinto de S/N", () => {
      const r = validateContenidoInput({
        ...base,
        original_quindioflix: "X" as "S" | "N",
      });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("original_invalido");
    });
  });

  describe("validateTemporadaUnica - HU-CONT-003", () => {
    it("acepta número de temporada no existente", () => {
      const r = validateTemporadaUnica({
        id_contenido: 1,
        numero_temporada: 2,
        existentes: [1, 3],
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza temporada duplicada (uq_temporada)", () => {
      const r = validateTemporadaUnica({
        id_contenido: 1,
        numero_temporada: 1,
        existentes: [1, 2],
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("uq_temporada");
    });
  });

  describe("validateEpisodioUnico - HU-CONT-004", () => {
    it("acepta número de episodio no existente", () => {
      const r = validateEpisodioUnico({
        id_temporada: 1,
        numero_episodio: 5,
        existentes: [1, 2, 3, 4],
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza episodio duplicado (uq_episodio)", () => {
      const r = validateEpisodioUnico({
        id_temporada: 1,
        numero_episodio: 2,
        existentes: [1, 2, 3],
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("uq_episodio");
    });
  });

  describe("validateRelacionContenido - HU-CONT-005, RN-15", () => {
    it.each<TipoRelacion>([
      "SECUELA",
      "PRECUELA",
      "REMAKE",
      "SPIN-OFF",
      "VERSION_EXTENDIDA",
      "OTRO",
    ])("acepta tipo_relacion %s", (t) => {
      const r = validateRelacionContenido({
        id_origen: 1,
        id_destino: 2,
        tipo_relacion: t,
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza autoreferencia (chk_cr_noself)", () => {
      const r = validateRelacionContenido({
        id_origen: 7,
        id_destino: 7,
        tipo_relacion: "SECUELA",
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("chk_cr_noself");
    });

    it("rechaza tipo_relacion inválido", () => {
      const r = validateRelacionContenido({
        id_origen: 1,
        id_destino: 2,
        tipo_relacion: "REBOOT" as TipoRelacion,
      });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("tipo_relacion_invalido");
    });
  });
});
