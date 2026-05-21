import { describe, it, expect } from "vitest";
import {
  validateMonto,
  validateDescuento,
  validateMetodoPago,
  validateEstadoPago,
  validatePagoCompleto,
  type PagoInput,
  type MetodoPago,
  type EstadoPago,
} from "../../validators/pago.validator.js";

describe("Validador de Pago (HU-PAG-001, RN-13, RN-14)", () => {
  describe("validateMonto - RN-13 chk_pago_monto", () => {
    it("acepta monto > 0", () => {
      expect(validateMonto(15000)).toBe(true);
    });

    it.each([0, -1, -100])("rechaza monto %s", (m) => {
      expect(validateMonto(m)).toBe(false);
    });
  });

  describe("validateDescuento - RN-14 chk_pago_dscto", () => {
    it("acepta descuento 0 sin descripción", () => {
      expect(validateDescuento({ descuento: 0, descripcion: null }).valid).toBe(true);
    });

    it("acepta descuento > 0 con descripción", () => {
      expect(
        validateDescuento({ descuento: 5000, descripcion: "Ref. amigo" }).valid,
      ).toBe(true);
    });

    it("rechaza descuento > 0 sin descripción", () => {
      const r = validateDescuento({ descuento: 5000, descripcion: null });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("descripcion_descuento_requerida");
    });

    it("rechaza descuento negativo", () => {
      const r = validateDescuento({ descuento: -1, descripcion: "x" });
      expect(r.valid).toBe(false);
      expect(r.error).toBe("descuento_negativo");
    });
  });

  describe("validateMetodoPago", () => {
    it.each<MetodoPago>([
      "TARJETA_CREDITO",
      "TARJETA_DEBITO",
      "PSE",
      "NEQUI",
      "DAVIPLATA",
    ])("acepta %s", (m) => {
      expect(validateMetodoPago(m)).toBe(true);
    });

    it("rechaza método desconocido", () => {
      expect(validateMetodoPago("EFECTIVO" as MetodoPago)).toBe(false);
    });
  });

  describe("validateEstadoPago", () => {
    it.each<EstadoPago>(["EXITOSO", "FALLIDO", "PENDIENTE", "REEMBOLSADO"])(
      "acepta %s",
      (e) => {
        expect(validateEstadoPago(e)).toBe(true);
      },
    );

    it("rechaza estado desconocido", () => {
      expect(validateEstadoPago("ANULADO" as EstadoPago)).toBe(false);
    });
  });

  describe("validatePagoCompleto", () => {
    const base: PagoInput = {
      id_usuario: 1,
      id_plan: 1,
      monto: 20000,
      metodo_pago: "PSE",
      estado_pago: "EXITOSO",
      descuento_aplicado: 0,
      descripcion_descuento: null,
    };

    it("acepta pago válido sin descuento", () => {
      expect(validatePagoCompleto(base).valid).toBe(true);
    });

    it("acepta pago con descuento + descripción", () => {
      const r = validatePagoCompleto({
        ...base,
        descuento_aplicado: 5000,
        descripcion_descuento: "Promo referido",
      });
      expect(r.valid).toBe(true);
    });

    it("rechaza si descuento >= monto (monto neto debe ser > 0)", () => {
      const r = validatePagoCompleto({
        ...base,
        monto: 5000,
        descuento_aplicado: 5000,
        descripcion_descuento: "x",
      });
      expect(r.valid).toBe(false);
      expect(r.errors).toContain("monto_neto_invalido");
    });
  });
});
