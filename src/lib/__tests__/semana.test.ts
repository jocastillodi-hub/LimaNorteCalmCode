import { describe, expect, it } from "vitest";
import { diaDeLaSemana, lunesDe, sumarDias } from "../semana";

describe("semana", () => {
  it("el lunes de una semana es el lunes de cualquier día de esa semana", () => {
    expect(lunesDe(new Date(2026, 9, 5))).toBe("2026-10-05"); // lunes
    expect(lunesDe(new Date(2026, 9, 9))).toBe("2026-10-05"); // viernes
    expect(lunesDe(new Date(2026, 9, 11))).toBe("2026-10-05"); // domingo
  });

  it("numera lunes como 1 y domingo como 7", () => {
    expect(diaDeLaSemana(new Date(2026, 9, 5))).toBe(1);
    expect(diaDeLaSemana(new Date(2026, 9, 11))).toBe(7);
  });

  it("suma días cruzando meses", () => {
    expect(sumarDias("2026-10-28", 7)).toBe("2026-11-04");
    expect(sumarDias("2026-10-05", -7)).toBe("2026-09-28");
  });
});
