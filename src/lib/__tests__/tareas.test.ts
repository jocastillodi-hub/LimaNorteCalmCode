import { describe, expect, it } from "vitest";
import { hoyISO, urgencia, validarTarea } from "../tareas";

describe("validarTarea", () => {
  it("acepta una tarea válida y recorta espacios", () => {
    const r = validarTarea({ titulo: "  Leer capítulo 2 ", area: "tesis", fecha_limite: "" });
    expect(r).toEqual({ ok: true, valor: { titulo: "Leer capítulo 2", area: "tesis", fecha_limite: null } });
  });

  it("rechaza un título vacío o demasiado largo", () => {
    expect(validarTarea({ titulo: "   ", area: "otra", fecha_limite: "" }).ok).toBe(false);
    expect(validarTarea({ titulo: "x".repeat(121), area: "otra", fecha_limite: "" }).ok).toBe(false);
  });

  it("rechaza áreas y fechas inválidas", () => {
    expect(validarTarea({ titulo: "a", area: "cualquiera", fecha_limite: "" }).ok).toBe(false);
    expect(validarTarea({ titulo: "a", area: "otra", fecha_limite: "mañana" }).ok).toBe(false);
  });
});

describe("urgencia", () => {
  const hoy = "2026-10-09";
  it("clasifica según la fecha límite", () => {
    expect(urgencia({ hecha: false, fecha_limite: "2026-10-01" }, hoy)).toBe("vencida");
    expect(urgencia({ hecha: false, fecha_limite: hoy }, hoy)).toBe("hoy");
    expect(urgencia({ hecha: false, fecha_limite: "2026-10-20" }, hoy)).toBe("proxima");
    expect(urgencia({ hecha: false, fecha_limite: null }, hoy)).toBe("sin_fecha");
    expect(urgencia({ hecha: true, fecha_limite: "2026-10-01" }, hoy)).toBe("hecha");
  });

  it("formatea la fecha local como AAAA-MM-DD", () => {
    expect(hoyISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
