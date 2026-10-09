import { describe, expect, it } from "vitest";
import { barajar, crearTablero, fraseAleatoria, FRASES_DESCANSO, PARES_CONCHAS } from "../diversion";

describe("barajar", () => {
  it("conserva todos los elementos y no modifica la lista original", () => {
    const original = [1, 2, 3, 4, 5];
    const mezclado = barajar(original, () => 0.42);
    expect([...mezclado].sort()).toEqual([1, 2, 3, 4, 5]);
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("crearTablero", () => {
  it("crea dos cartas por símbolo, todas ocultas", () => {
    const tablero = crearTablero(PARES_CONCHAS.slice(0, 4), () => 0.5);
    expect(tablero).toHaveLength(8);
    for (const simbolo of PARES_CONCHAS.slice(0, 4)) {
      expect(tablero.filter((c) => c.simbolo === simbolo)).toHaveLength(2);
    }
    expect(tablero.every((c) => !c.descubierta && !c.resuelta)).toBe(true);
  });
});

describe("fraseAleatoria", () => {
  it("siempre devuelve una frase de la lista", () => {
    expect(FRASES_DESCANSO).toContain(fraseAleatoria(() => 0.99));
  });
});
