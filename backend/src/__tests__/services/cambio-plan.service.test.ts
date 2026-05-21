import { describe, it, expect } from "vitest";
import {
  evaluarCambioPlan,
  type Plan,
} from "../../services/cambio-plan.service.js";

describe("Servicio Cambio de Plan (HU-USR-003, RN-02)", () => {
  const basico: Plan = { id: 1, nombre: "Básico", max_pantallas: 2 };
  const estandar: Plan = { id: 2, nombre: "Estándar", max_pantallas: 3 };
  const premium: Plan = { id: 3, nombre: "Premium", max_pantallas: 5 };

  it("permite subir de plan sin restricciones", () => {
    const r = evaluarCambioPlan({
      plan_actual: basico,
      plan_destino: premium,
      perfiles_activos: 2,
    });
    expect(r.allowed).toBe(true);
  });

  it("permite bajar si perfiles_activos cabe en nuevo plan", () => {
    const r = evaluarCambioPlan({
      plan_actual: premium,
      plan_destino: estandar,
      perfiles_activos: 3,
    });
    expect(r.allowed).toBe(true);
  });

  it("bloquea bajar de plan si supera max_pantallas del destino", () => {
    const r = evaluarCambioPlan({
      plan_actual: premium,
      plan_destino: basico,
      perfiles_activos: 4,
    });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("supera_limite_perfiles_destino");
    expect(r.perfiles_a_desactivar).toBe(2);
  });

  it("rechaza si plan destino igual al actual", () => {
    const r = evaluarCambioPlan({
      plan_actual: basico,
      plan_destino: basico,
      perfiles_activos: 1,
    });
    expect(r.allowed).toBe(false);
    expect(r.reason).toBe("plan_sin_cambio");
  });
});
