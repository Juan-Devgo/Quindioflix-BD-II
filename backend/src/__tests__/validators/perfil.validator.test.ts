import { describe, it, expect } from "vitest";
import {
  canCreateProfile,
  canAccessContent,
  validatePerfilTipo,
  type Plan,
  type PerfilTipo,
  type ClasificacionEdad,
} from "../../validators/perfil.validator.js";

describe("Validador de Perfil (HU-USR-002, RN-02, RN-03)", () => {
  const planBasico: Plan = { id: 1, nombre: "Básico", max_pantallas: 2 };
  const planEstandar: Plan = { id: 2, nombre: "Estándar", max_pantallas: 3 };
  const planPremium: Plan = { id: 3, nombre: "Premium", max_pantallas: 5 };

  describe("canCreateProfile - RN-02 límite por plan", () => {
    it("permite crear cuando perfiles_activos < max del plan", () => {
      expect(canCreateProfile({ plan: planBasico, perfiles_activos: 1 }).allowed).toBe(true);
    });

    it("bloquea cuando perfiles_activos = max (Básico=2)", () => {
      const r = canCreateProfile({ plan: planBasico, perfiles_activos: 2 });
      expect(r.allowed).toBe(false);
      expect(r.reason).toBe("limite_perfiles_alcanzado");
    });

    it("permite hasta 3 perfiles en plan Estándar", () => {
      expect(canCreateProfile({ plan: planEstandar, perfiles_activos: 2 }).allowed).toBe(true);
      expect(canCreateProfile({ plan: planEstandar, perfiles_activos: 3 }).allowed).toBe(false);
    });

    it("permite hasta 5 perfiles en plan Premium", () => {
      expect(canCreateProfile({ plan: planPremium, perfiles_activos: 4 }).allowed).toBe(true);
      expect(canCreateProfile({ plan: planPremium, perfiles_activos: 5 }).allowed).toBe(false);
    });
  });

  describe("validatePerfilTipo", () => {
    it("acepta ADULTO e INFANTIL", () => {
      expect(validatePerfilTipo("ADULTO")).toBe(true);
      expect(validatePerfilTipo("INFANTIL")).toBe(true);
    });

    it("rechaza tipo desconocido", () => {
      expect(validatePerfilTipo("OTRO" as PerfilTipo)).toBe(false);
    });
  });

  describe("canAccessContent - RN-03 restricción infantil", () => {
    const cases: Array<[PerfilTipo, ClasificacionEdad, boolean]> = [
      ["INFANTIL", "TP", true],
      ["INFANTIL", "+7", true],
      ["INFANTIL", "+13", true],
      ["INFANTIL", "+16", false],
      ["INFANTIL", "+18", false],
      ["ADULTO", "+16", true],
      ["ADULTO", "+18", true],
      ["ADULTO", "TP", true],
    ];

    cases.forEach(([tipo, clasif, expected]) => {
      it(`${tipo} accede a ${clasif}: ${expected}`, () => {
        expect(canAccessContent({ tipo, clasificacion: clasif })).toBe(expected);
      });
    });
  });
});
