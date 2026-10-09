import { describe, expect, it } from "vitest";
import { dividirEnPasos, estadoTiempo, misionesPorRecordar, mensajeCarga, nivelCarga, pendientesDelDia, progreso } from "../bitacora";

const id = (() => {
  let n = 0;
  return () => `p${++n}`;
})();

describe("nivelCarga", () => {
  it("pasa de libre a suave y llena según los pendientes del día", () => {
    expect(nivelCarga(0)).toBe("libre");
    expect(nivelCarga(2)).toBe("libre");
    expect(nivelCarga(3)).toBe("suave");
    expect(nivelCarga(4)).toBe("suave");
    expect(nivelCarga(5)).toBe("llena");
  });

  it("solo da un mensaje cuando el día está lleno o cargado", () => {
    expect(mensajeCarga("libre", "Martes")).toBeNull();
    expect(mensajeCarga("llena", "Martes")).toMatch(/Cuidado/);
  });
});

describe("dividirEnPasos", () => {
  it("separa por comas y 'y', descarta vacíos y limita la cantidad", () => {
    const pasos = dividirEnPasos("abrir el documento, escribir el título y guardar", id);
    expect(pasos.map((p) => p.texto)).toEqual(["abrir el documento", "escribir el título", "guardar"]);
    expect(dividirEnPasos("a,,  ,b", id)).toHaveLength(2);
    expect(dividirEnPasos("1,2,3,4,5,6,7,8", id)).toHaveLength(6);
  });
});

describe("progreso y pendientes", () => {
  const misiones = [
    { id: "1", titulo: "a", dia: 1, hecha: true, pasos: [], vence: null },
    { id: "2", titulo: "b", dia: 1, hecha: false, pasos: [], vence: null },
    { id: "3", titulo: "c", dia: 2, hecha: false, pasos: [], vence: null },
  ];
  it("calcula el porcentaje completado", () => {
    expect(progreso(misiones)).toEqual({ total: 3, hechas: 1, porcentaje: 33 });
    expect(progreso([])).toEqual({ total: 0, hechas: 0, porcentaje: 0 });
  });
  it("cuenta pendientes por día", () => {
    expect(pendientesDelDia(misiones, 1)).toBe(1);
    expect(pendientesDelDia(misiones, 2)).toBe(1);
  });
});

describe("estadoTiempo", () => {
  const ahora = new Date("2026-10-09T10:00:00");
  it("distingue lejos, pronto, esperando y sin hora", () => {
    expect(estadoTiempo({ hecha: false, vence: null }, ahora)).toBe("sin_hora");
    expect(estadoTiempo({ hecha: false, vence: new Date("2026-10-09T18:00:00").toISOString() }, ahora)).toBe("lejos");
    expect(estadoTiempo({ hecha: false, vence: new Date("2026-10-09T11:30:00").toISOString() }, ahora)).toBe("pronto");
    expect(estadoTiempo({ hecha: false, vence: new Date("2026-10-09T09:00:00").toISOString() }, ahora)).toBe("esperando");
  });

  it("una misión hecha nunca está pendiente de hora", () => {
    expect(estadoTiempo({ hecha: true, vence: new Date("2026-10-09T09:00:00").toISOString() }, ahora)).toBe("sin_hora");
  });

  it("solo recuerda las que vencen pronto y no están hechas", () => {
    const base = { titulo: "x", dia: 1, pasos: [] };
    const misiones = [
      { ...base, id: "a", hecha: false, vence: new Date("2026-10-09T11:00:00").toISOString() },
      { ...base, id: "b", hecha: true, vence: new Date("2026-10-09T11:00:00").toISOString() },
      { ...base, id: "c", hecha: false, vence: new Date("2026-10-09T18:00:00").toISOString() },
    ];
    expect(misionesPorRecordar(misiones, ahora).map((m) => m.id)).toEqual(["a"]);
  });
});
