import { describe, it, expect } from "vitest";
import {
  agregarFavorito,
  eliminarFavorito,
  ordenarFavoritos,
  type Favorito,
} from "../../validators/favorito.validator.js";

describe("Validador de Favoritos (HU-CONS-002)", () => {
  describe("agregarFavorito", () => {
    it("crea favorito si no existe (pk_favorito)", () => {
      const r = agregarFavorito({
        id_perfil: 1,
        id_contenido: 100,
        existentes: [],
      });
      expect(r.created).toBe(true);
      expect(r.favorito?.fecha_agregado).toBeInstanceOf(Date);
    });

    it("no duplica si ya existe", () => {
      const existentes: Favorito[] = [
        { id_perfil: 1, id_contenido: 100, fecha_agregado: new Date("2026-01-01") },
      ];
      const r = agregarFavorito({
        id_perfil: 1,
        id_contenido: 100,
        existentes,
      });
      expect(r.created).toBe(false);
      expect(r.error).toBe("pk_favorito");
    });
  });

  describe("eliminarFavorito", () => {
    it("elimina favorito existente", () => {
      const existentes: Favorito[] = [
        { id_perfil: 1, id_contenido: 100, fecha_agregado: new Date() },
      ];
      const r = eliminarFavorito({ id_perfil: 1, id_contenido: 100, existentes });
      expect(r.deleted).toBe(true);
    });

    it("retorna no encontrado si no existe", () => {
      const r = eliminarFavorito({ id_perfil: 1, id_contenido: 100, existentes: [] });
      expect(r.deleted).toBe(false);
    });
  });

  describe("ordenarFavoritos", () => {
    it("ordena por fecha_agregado descendente", () => {
      const lista: Favorito[] = [
        { id_perfil: 1, id_contenido: 1, fecha_agregado: new Date("2026-01-01") },
        { id_perfil: 1, id_contenido: 2, fecha_agregado: new Date("2026-03-01") },
        { id_perfil: 1, id_contenido: 3, fecha_agregado: new Date("2026-02-01") },
      ];
      const ord = ordenarFavoritos(lista);
      expect(ord.map((f) => f.id_contenido)).toEqual([2, 3, 1]);
    });
  });
});
