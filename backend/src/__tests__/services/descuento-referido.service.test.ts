import { describe, it, expect } from "vitest";
import {
  aplicarDescuentoReferidor,
  aplicarDescuentoNuevo,
  registrarReferido,
  type ReferidoState,
} from "../../services/descuento-referido.service.js";

describe("Servicio Descuento Referido (HU-PAG-002, RN-07, RN-08)", () => {
  describe("registrarReferido - RN-07, RN-08", () => {
    it("registra relación entre referidor y nuevo usuario", () => {
      const r = registrarReferido({
        id_referidor: 10,
        id_nuevo: 20,
        ya_referido: false,
      });
      expect(r.created).toBe(true);
    });

    it("rechaza si nuevo usuario ya fue referido (uq_referido_nuevo)", () => {
      const r = registrarReferido({
        id_referidor: 10,
        id_nuevo: 20,
        ya_referido: true,
      });
      expect(r.created).toBe(false);
      expect(r.error).toBe("uq_referido_nuevo");
    });

    it("rechaza autoreferencia (RN-08)", () => {
      const r = registrarReferido({
        id_referidor: 5,
        id_nuevo: 5,
        ya_referido: false,
      });
      expect(r.created).toBe(false);
      expect(r.error).toBe("autoreferencia_prohibida");
    });
  });

  describe("aplicarDescuentoReferidor", () => {
    const base: ReferidoState = {
      id_referido: 1,
      id_referidor: 10,
      id_nuevo: 20,
      beneficio_aplicado_referidor: "N",
      beneficio_aplicado_nuevo: "N",
    };

    it("aplica descuento al referidor si beneficio pendiente", () => {
      const r = aplicarDescuentoReferidor({
        referido: base,
        monto_pago: 20000,
        descuento_configurado: 5000,
      });
      expect(r.aplicado).toBe(true);
      expect(r.descuento).toBe(5000);
      expect(r.descripcion).toMatch(/refer/i);
      expect(r.marcar_beneficio_referidor).toBe("S");
    });

    it("no aplica si beneficio_aplicado_referidor = S", () => {
      const r = aplicarDescuentoReferidor({
        referido: { ...base, beneficio_aplicado_referidor: "S" },
        monto_pago: 20000,
        descuento_configurado: 5000,
      });
      expect(r.aplicado).toBe(false);
      expect(r.descuento).toBe(0);
    });

    it("asegura monto - descuento > 0", () => {
      const r = aplicarDescuentoReferidor({
        referido: base,
        monto_pago: 5000,
        descuento_configurado: 5000,
      });
      expect(r.aplicado).toBe(false);
      expect(r.error).toBe("monto_neto_invalido");
    });
  });

  describe("aplicarDescuentoNuevo", () => {
    const base: ReferidoState = {
      id_referido: 1,
      id_referidor: 10,
      id_nuevo: 20,
      beneficio_aplicado_referidor: "N",
      beneficio_aplicado_nuevo: "N",
    };

    it("aplica descuento al referido en su primer pago", () => {
      const r = aplicarDescuentoNuevo({
        referido: base,
        monto_pago: 20000,
        descuento_configurado: 3000,
        es_primer_pago: true,
      });
      expect(r.aplicado).toBe(true);
      expect(r.descuento).toBe(3000);
      expect(r.marcar_beneficio_nuevo).toBe("S");
    });

    it("no aplica si no es primer pago", () => {
      const r = aplicarDescuentoNuevo({
        referido: base,
        monto_pago: 20000,
        descuento_configurado: 3000,
        es_primer_pago: false,
      });
      expect(r.aplicado).toBe(false);
    });

    it("no aplica si beneficio_aplicado_nuevo = S", () => {
      const r = aplicarDescuentoNuevo({
        referido: { ...base, beneficio_aplicado_nuevo: "S" },
        monto_pago: 20000,
        descuento_configurado: 3000,
        es_primer_pago: true,
      });
      expect(r.aplicado).toBe(false);
    });
  });
});
