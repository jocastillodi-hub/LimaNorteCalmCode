import { describe, expect, it } from "vitest";
import { buscarMateria, validarIdea } from "../red";

describe("buscarMateria", () => {
  it("encuentra la materia sin importar tildes ni mayúsculas", () => {
    expect(buscarMateria("ESTADÍSTICA")?.clave).toBe("estadistica");
    expect(buscarMateria("programacion")?.clave).toBe("programacion");
    expect(buscarMateria("  psicologia ")?.clave).toBe("psicologia");
  });

  it("devuelve null si la materia no existe o la búsqueda está vacía", () => {
    expect(buscarMateria("química")).toBeNull();
    expect(buscarMateria("   ")).toBeNull();
  });
});

describe("validarIdea", () => {
  it("acepta una idea útil y recorta espacios", () => {
    expect(validarIdea("  Dibujar el árbol me ayudó mucho  ")).toEqual({ ok: true, valor: "Dibujar el árbol me ayudó mucho" });
  });

  it("rechaza ideas muy cortas o muy largas", () => {
    expect(validarIdea("hola").ok).toBe(false);
    expect(validarIdea("x".repeat(301)).ok).toBe(false);
  });

  it("bloquea correos, teléfonos y soluciones de examen", () => {
    expect(validarIdea("escríbeme a juan@correo.com para ayudarte").ok).toBe(false);
    expect(validarIdea("mi número es 987654321 llama").ok).toBe(false);
    expect(validarIdea("aquí está el solucionario del parcial").ok).toBe(false);
  });
});
