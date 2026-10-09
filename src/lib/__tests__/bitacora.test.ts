import { describe, expect, it } from "vitest";
import { dividirEnPasos, estadoTiempo, migrarMisiones, misionesPorRecordar, mensajeCarga, nivelCarga, pendientesDelDia, progreso } from "../bitacora";
import { etiquetaDia, etiquetaFecha, lunesDe, sumarDias } from "../fechas";

const id = (() => {
  let n = 0;
  return () => `p${++n}`;
})();

const base = { titulo: "x", pasos: [], vence: null };

describe("nivelCarga", () => {
  it("pasa de libre a suave y llena según los pendientes del día", () => {
    expect(nivelCarga(2)).toBe("libre");
    expect(nivelCarga(3)).toBe("suave");
    expect(nivelCarga(5)).toBe("llena");
  });

  it("solo da un mensaje cuando el día está lleno o cargado", () => {
    expect(mensajeCarga("libre", "Martes")).toBeNull();
    expect(mensajeCarga("llena", "Martes")).toMatch(/Cuidado/);
  });
});

describe("dividirEnPasos", () => {
  it("separa por comas y 'y', descarta vacíos y limita la cantidad", () => {
    expect(dividirEnPasos("abrir el documento, escribir el título y guardar", id).map((p) => p.texto))
      .toEqual(["abrir el documento", "escribir el título", "guardar"]);
    expect(dividirEnPasos("a,,  ,b", id)).toHaveLength(2);
    expect(dividirEnPasos("1,2,3,4,5,6,7,8", id)).toHaveLength(6);
  });
});

describe("progreso y pendientes por fecha", () => {
  const misiones = [
    { ...base, id: "1", fecha: "2026-10-12", hecha: true },
    { ...base, id: "2", fecha: "2026-10-12", hecha: false },
    { ...base, id: "3", fecha: "2026-11-25", hecha: false },
  ];
  it("calcula el porcentaje completado", () => {
    expect(progreso(misiones)).toEqual({ total: 3, hechas: 1, porcentaje: 33 });
  });
  it("cuenta pendientes de una fecha exacta, no de un día de la semana", () => {
    expect(pendientesDelDia(misiones, "2026-10-12")).toBe(1);
    expect(pendientesDelDia(misiones, "2026-11-25")).toBe(1);
    expect(pendientesDelDia(misiones, "2026-10-19")).toBe(0);
  });
});

describe("estadoTiempo y recordatorios", () => {
  const ahora = new Date("2026-10-09T10:00:00");
  it("distingue lejos, pronto, esperando y sin hora", () => {
    expect(estadoTiempo({ hecha: false, vence: null }, ahora)).toBe("sin_hora");
    expect(estadoTiempo({ hecha: false, vence: new Date("2026-10-09T18:00:00").toISOString() }, ahora)).toBe("lejos");
    expect(estadoTiempo({ hecha: false, vence: new Date("2026-10-09T11:30:00").toISOString() }, ahora)).toBe("pronto");
    expect(estadoTiempo({ hecha: false, vence: new Date("2026-10-09T09:00:00").toISOString() }, ahora)).toBe("esperando");
  });
  it("solo recuerda las que vencen pronto y no están hechas", () => {
    const misiones = [
      { ...base, id: "a", fecha: "2026-10-09", hecha: false, vence: new Date("2026-10-09T11:00:00").toISOString() },
      { ...base, id: "b", fecha: "2026-10-09", hecha: true, vence: new Date("2026-10-09T11:00:00").toISOString() },
    ];
    expect(misionesPorRecordar(misiones, ahora).map((m) => m.id)).toEqual(["a"]);
  });
});

describe("fechas", () => {
  it("el lunes de una semana es el de cualquier día de esa semana", () => {
    expect(lunesDe("2026-10-05")).toBe("2026-10-05");
    expect(lunesDe("2026-10-11")).toBe("2026-10-05");
  });
  it("suma días cruzando meses", () => {
    expect(sumarDias("2026-10-28", 7)).toBe("2026-11-04");
  });
  it("muestra etiquetas en español", () => {
    expect(etiquetaDia("2026-10-12")).toBe("Lunes, 12 de octubre");
    expect(etiquetaFecha("2026-11-25")).toBe("25 de noviembre de 2026");
  });
});

describe("migrarMisiones", () => {
  it("convierte el día 1-7 antiguo a la fecha de esa semana", () => {
    const viejas = [{ id: "v", titulo: "examen", dia: 3, hecha: false, pasos: [], vence: null }];
    const nuevas = migrarMisiones(viejas, "2026-10-09");
    expect(nuevas[0].fecha).toBe("2026-10-07"); // miércoles de la semana del 5 de octubre
  });
  it("descarta datos que no son misiones", () => {
    expect(migrarMisiones("no es una lista", "2026-10-09")).toEqual([]);
    expect(migrarMisiones([{ titulo: "sin id" }], "2026-10-09")).toEqual([]);
  });
});
