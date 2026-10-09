import { describe, expect, it } from "vitest";
import { buscarCurso, CURSOS, filtrarCursos, validarIdea } from "../red";

describe("catálogo de cursos ficticios", () => {
  it("tiene cursos y cada uno ofrece material educativo", () => {
    expect(CURSOS.length).toBeGreaterThanOrEqual(8);
    expect(CURSOS.every((c) => c.info.length > 0)).toBe(true);
  });
});

describe("buscarCurso", () => {
  it("encuentra el curso sin importar tildes ni mayúsculas", () => {
    expect(buscarCurso("ESTADÍSTICA")?.clave).toBe("estadistica-ludica");
    expect(buscarCurso("  psicologia ")?.clave).toBe("mente-y-aprendizaje");
  });
  it("devuelve null si no existe o la búsqueda está vacía", () => {
    expect(buscarCurso("curso inexistente")).toBeNull();
    expect(buscarCurso("   ")).toBeNull();
  });
});

describe("filtrarCursos", () => {
  it("sin texto devuelve todo el catálogo", () => {
    expect(filtrarCursos("")).toHaveLength(CURSOS.length);
  });
  it("filtra por nombre o área parcial", () => {
    expect(filtrarCursos("prog").map((c) => c.clave)).toContain("programacion-viajera");
    expect(filtrarCursos("exactas").length).toBeGreaterThan(0);
    expect(filtrarCursos("zzz")).toEqual([]);
  });
});

describe("validarIdea", () => {
  it("acepta una idea educativa y recorta espacios", () => {
    expect(validarIdea("  Dibujar el árbol me ayudó mucho  ")).toEqual({ ok: true, valor: "Dibujar el árbol me ayudó mucho" });
  });
  it("rechaza ideas muy cortas o muy largas", () => {
    expect(validarIdea("hola").ok).toBe(false);
    expect(validarIdea("x".repeat(301)).ok).toBe(false);
  });
  it("bloquea correos, teléfonos y material que no es educativo", () => {
    expect(validarIdea("escríbeme a juan@correo.com para ayudarte").ok).toBe(false);
    expect(validarIdea("mi número es 987654321 llama").ok).toBe(false);
    expect(validarIdea("aquí está el solucionario del parcial").ok).toBe(false);
    expect(validarIdea("adjunto la practica calificada resuelta").ok).toBe(false);
  });
});
