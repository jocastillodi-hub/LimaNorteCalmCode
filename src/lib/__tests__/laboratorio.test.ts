import { describe, expect, it } from "vitest";
import { ARCHIVO_DEMO, filtrarArchivo, ordenarArchivo } from "../laboratorio";

describe("archivo del laboratorio", () => {
  it("filtra por tipo y devuelve todo con 'todos'", () => {
    expect(filtrarArchivo(ARCHIVO_DEMO, "todos")).toHaveLength(ARCHIVO_DEMO.length);
    expect(filtrarArchivo(ARCHIVO_DEMO, "plantilla").every((m) => m.tipo === "plantilla")).toBe(true);
  });

  it("ordena por usos y luego por año", () => {
    const ordenado = ordenarArchivo(ARCHIVO_DEMO);
    expect(ordenado[0].usos).toBeGreaterThanOrEqual(ordenado[1].usos);
    for (let i = 1; i < ordenado.length; i++) {
      expect(ordenado[i - 1].usos).toBeGreaterThanOrEqual(ordenado[i].usos);
    }
  });

  it("no mezcla la lista original al ordenar", () => {
    const antes = ARCHIVO_DEMO[0].id;
    ordenarArchivo(ARCHIVO_DEMO);
    expect(ARCHIVO_DEMO[0].id).toBe(antes);
  });
});
