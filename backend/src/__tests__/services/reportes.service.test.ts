import { describe, it, expect } from "vitest";
import {
  agruparReproduccionesPorCiudad,
  filtrarPorRangoFechas,
  calcularIngresosNetos,
  rankingContenido,
  contarPorPlan,
  tasaConversionReferidos,
  productividadEmpleados,
  type Reproduccion,
  type Pago,
  type Referido,
  type Empleado,
  type Contenido,
} from "../../services/reportes.service.js";

describe("Servicio Reportes Analítica (HU-REP-001..005)", () => {
  const reproducciones: Reproduccion[] = [
    {
      id_perfil: 1,
      id_usuario: 10,
      id_ciudad: 1,
      id_contenido: 100,
      id_episodio: null,
      tipo_contenido: "PELICULA",
      dispositivo: "TV",
      fecha_inicio: new Date("2026-04-01"),
      porcentaje_avance: 80,
      id_plan: 1,
    },
    {
      id_perfil: 2,
      id_usuario: 11,
      id_ciudad: 1,
      id_contenido: 101,
      id_episodio: null,
      tipo_contenido: "SERIE",
      dispositivo: "CELULAR",
      fecha_inicio: new Date("2026-04-15"),
      porcentaje_avance: 50,
      id_plan: 2,
    },
    {
      id_perfil: 3,
      id_usuario: 12,
      id_ciudad: 2,
      id_contenido: 100,
      id_episodio: null,
      tipo_contenido: "PELICULA",
      dispositivo: "TV",
      fecha_inicio: new Date("2026-05-01"),
      porcentaje_avance: 100,
      id_plan: 3,
    },
  ];

  describe("HU-REP-001 - consumo por ciudad", () => {
    it("agrupa reproducciones por id_ciudad", () => {
      const r = agruparReproduccionesPorCiudad(reproducciones);
      expect(r.get(1)).toBe(2);
      expect(r.get(2)).toBe(1);
    });

    it("filtra por rango de fechas", () => {
      const r = filtrarPorRangoFechas(reproducciones, {
        desde: new Date("2026-04-10"),
        hasta: new Date("2026-04-30"),
      });
      expect(r).toHaveLength(1);
      expect(r[0]?.id_perfil).toBe(2);
    });

    it("rankea contenido más visto", () => {
      const r = rankingContenido(reproducciones);
      expect(r[0]?.id_contenido).toBe(100);
      expect(r[0]?.reproducciones).toBe(2);
    });
  });

  describe("HU-REP-002 - consumo por plan", () => {
    it("cuenta reproducciones por id_plan", () => {
      const r = contarPorPlan(reproducciones);
      expect(r.get(1)).toBe(1);
      expect(r.get(2)).toBe(1);
      expect(r.get(3)).toBe(1);
    });
  });

  describe("HU-REP-003 - ingresos netos", () => {
    const pagos: Pago[] = [
      {
        id_pago: 1,
        id_usuario: 10,
        id_plan: 1,
        monto: 20000,
        descuento_aplicado: 0,
        estado_pago: "EXITOSO",
        fecha_pago: new Date("2026-05-01"),
      },
      {
        id_pago: 2,
        id_usuario: 11,
        id_plan: 2,
        monto: 30000,
        descuento_aplicado: 5000,
        estado_pago: "EXITOSO",
        fecha_pago: new Date("2026-05-05"),
      },
      {
        id_pago: 3,
        id_usuario: 12,
        id_plan: 3,
        monto: 40000,
        descuento_aplicado: 0,
        estado_pago: "FALLIDO",
        fecha_pago: new Date("2026-05-10"),
      },
    ];

    it("suma monto - descuento solo de pagos EXITOSOS", () => {
      const r = calcularIngresosNetos(pagos);
      expect(r.ingresos_brutos).toBe(50000);
      expect(r.descuentos).toBe(5000);
      expect(r.ingresos_netos).toBe(45000);
      expect(r.transacciones).toBe(2);
    });

    it("ticket promedio = ingresos_netos / transacciones", () => {
      const r = calcularIngresosNetos(pagos);
      expect(r.ticket_promedio).toBe(22500);
    });

    it("retorna ceros si no hay pagos exitosos", () => {
      const r = calcularIngresosNetos([{ ...pagos[2]! }]);
      expect(r.ingresos_netos).toBe(0);
      expect(r.transacciones).toBe(0);
      expect(r.ticket_promedio).toBe(0);
    });
  });

  describe("HU-REP-004 - productividad empleados", () => {
    const empleados: Empleado[] = [
      { id_empleado: 1, id_departamento: 1, rol: "EMPLEADO", activo: "S" },
      { id_empleado: 2, id_departamento: 1, rol: "EMPLEADO", activo: "S" },
    ];

    const contenidos: Contenido[] = [
      { id_contenido: 100, id_empleado_responsable: 1, fecha_agregado_catalogo: new Date("2026-04-01") },
      { id_contenido: 101, id_empleado_responsable: 1, fecha_agregado_catalogo: new Date("2026-04-15") },
      { id_contenido: 102, id_empleado_responsable: 2, fecha_agregado_catalogo: new Date("2026-05-01") },
    ];

    it("cuenta contenidos publicados por empleado", () => {
      const r = productividadEmpleados({ empleados, contenidos });
      expect(r.get(1)).toBe(2);
      expect(r.get(2)).toBe(1);
    });

    it("filtra por rango de fechas", () => {
      const r = productividadEmpleados({
        empleados,
        contenidos,
        desde: new Date("2026-04-10"),
        hasta: new Date("2026-04-30"),
      });
      expect(r.get(1)).toBe(1);
      expect(r.get(2) ?? 0).toBe(0);
    });
  });

  describe("HU-REP-005 - efectividad referidos", () => {
    const referidos: Referido[] = [
      { id_referido: 1, id_referidor: 10, id_nuevo: 20, fecha_referido: new Date("2026-04-01"), beneficio_aplicado_referidor: "S", beneficio_aplicado_nuevo: "S" },
      { id_referido: 2, id_referidor: 10, id_nuevo: 21, fecha_referido: new Date("2026-04-10"), beneficio_aplicado_referidor: "S", beneficio_aplicado_nuevo: "N" },
      { id_referido: 3, id_referidor: 11, id_nuevo: 22, fecha_referido: new Date("2026-04-15"), beneficio_aplicado_referidor: "N", beneficio_aplicado_nuevo: "N" },
    ];

    it("calcula tasa de conversión = referidos activos / total", () => {
      const r = tasaConversionReferidos({
        referidos,
        usuarios_activos_ids: new Set([20, 22]),
      });
      expect(r.total).toBe(3);
      expect(r.activos).toBe(2);
      expect(r.tasa_conversion).toBeCloseTo(2 / 3);
    });

    it("retorna 0 si no hay referidos", () => {
      const r = tasaConversionReferidos({
        referidos: [],
        usuarios_activos_ids: new Set(),
      });
      expect(r.tasa_conversion).toBe(0);
    });
  });
});
