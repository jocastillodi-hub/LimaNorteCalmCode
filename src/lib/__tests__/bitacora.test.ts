import { describe, expect, it } from "vitest";
import { dividirEnPasos, mensajeCarga, nivelCarga, pendientesDelDia, progreso } from "../bitacora";

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
    { id: "1", titulo: "a", dia: 1, hecha: true, pasos: [] },
    { id: "2", titulo: "b", dia: 1, hecha: false, pasos: [] },
    { id: "3", titulo: "c", dia: 2, hecha: false, pasos: [] },
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
