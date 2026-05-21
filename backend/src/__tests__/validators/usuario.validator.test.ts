import { describe, it, expect } from "vitest";
import {
  validateEmailFormat,
  validateUsuarioRegistro,
  validateReferidor,
  type UsuarioRegistroInput,
} from "../../validators/usuario.validator.js";

describe("Validador de Usuario (HU-USR-001, RN-01, RN-07, RN-08)", () => {
  const baseInput: UsuarioRegistroInput = {
    nombre: "Juan Diego",
    email: "juan@example.com",
    telefono: "3001234567",
    fecha_nacimiento: "1995-05-12",
    id_ciudad: 1,
    id_plan: 1,
  };

  describe("validateEmailFormat", () => {
    it("acepta email con formato válido", () => {
      expect(validateEmailFormat("user@dominio.com")).toBe(true);
    });

    it("rechaza email sin @", () => {
      expect(validateEmailFormat("invalido.com")).toBe(false);
    });

    it("rechaza email vacío", () => {
      expect(validateEmailFormat("")).toBe(false);
    });

    it("rechaza email con espacios", () => {
      expect(validateEmailFormat("foo bar@x.com")).toBe(false);
    });
  });

  describe("validateUsuarioRegistro - RN-01 unicidad email", () => {
    it("acepta input válido sin referidor", () => {
      const result = validateUsuarioRegistro(baseInput);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("rechaza si falta nombre", () => {
      const result = validateUsuarioRegistro({ ...baseInput, nombre: "" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("nombre_requerido");
    });

    it("rechaza si email es inválido", () => {
      const result = validateUsuarioRegistro({ ...baseInput, email: "no-email" });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("email_invalido");
    });

    it("rechaza si id_plan es nulo o negativo", () => {
      const result = validateUsuarioRegistro({ ...baseInput, id_plan: 0 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("plan_invalido");
    });

    it("rechaza si fecha_nacimiento es futura", () => {
      const future = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
      const result = validateUsuarioRegistro({ ...baseInput, fecha_nacimiento: future });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("fecha_nacimiento_invalida");
    });
  });

  describe("validateReferidor - RN-08 autoreferencia prohibida", () => {
    it("acepta referidor distinto al nuevo usuario", () => {
      const result = validateReferidor({ id_referidor: 10, id_nuevo: 11 });
      expect(result.valid).toBe(true);
    });

    it("rechaza autoreferencia (id_referidor === id_nuevo)", () => {
      const result = validateReferidor({ id_referidor: 7, id_nuevo: 7 });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("autoreferencia_prohibida");
    });

    it("acepta cuando no hay referidor (registro sin referido)", () => {
      const result = validateReferidor({ id_referidor: null, id_nuevo: 7 });
      expect(result.valid).toBe(true);
    });
  });
});
