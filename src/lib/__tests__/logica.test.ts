import { describe, expect, it } from "vitest";
import { diferenciaTension, evaluarCheckin } from "../evaluacion";
import { haySenalDeRiesgo } from "../seguridad";
import type { Checkin } from "../types";

const base: Checkin = {
  contexto: "universidad",
  tension: 2,
  emocion: "alegre",
};

describe("evaluarCheckin", () => {
  it("clasifica una carga baja", () => {
    expect(evaluarCheckin(base).nivel).toBe("bajo");
  });

  it("clasifica una carga moderada", () => {
    expect(evaluarCheckin({ ...base, tension: 3, emocion: "triste" }).nivel).toBe("moderado");
  });

  it("clasifica una sobrecarga alta", () => {
    const alto = evaluarCheckin({ ...base, tension: 5, emocion: "agotado" });
    expect(alto.nivel).toBe("alto");
  });
});

describe("diferenciaTension", () => {
  it("indica si la tensión bajó, subió o se mantuvo", () => {
    expect(diferenciaTension(4, 2).tipo).toBe("bajo");
    expect(diferenciaTension(2, 4).tipo).toBe("subio");
    expect(diferenciaTension(3, 3).tipo).toBe("igual");
  });
});

describe("haySenalDeRiesgo", () => {
  it("detecta expresiones de riesgo, con y sin tildes", () => {
    expect(haySenalDeRiesgo("Estoy pensando en suicidarme")).toBe(true);
    expect(haySenalDeRiesgo("ya no quiero seguir viviendo")).toBe(true);
    expect(haySenalDeRiesgo("quiero hacerme daño")).toBe(true);
  });

  it("no marca frases cotidianas", () => {
    expect(haySenalDeRiesgo("Tengo que cortarme el pelo mañana")).toBe(false);
    expect(haySenalDeRiesgo("Estoy cansado por la tesis")).toBe(false);
  });
});
