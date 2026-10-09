// Lógica de los juegos de descanso. Pura y probada.
export const PARES_CONCHAS = ["🐚", "🐠", "🦀", "🐙", "⭐", "🪸", "🐡", "🦑"] as const;

// Mezcla de Fisher-Yates. Recibe la fuente de aleatoriedad para poder probarla.
export function barajar<T>(items: readonly T[], aleatorio: () => number = Math.random): T[] {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export type Carta = { id: number; simbolo: string; descubierta: boolean; resuelta: boolean };

export function crearTablero(simbolos: readonly string[], aleatorio?: () => number): Carta[] {
  const dobles = simbolos.flatMap((s) => [s, s]);
  return barajar(dobles, aleatorio).map((simbolo, id) => ({ id, simbolo, descubierta: false, resuelta: false }));
}

// Frases amables para cerrar el juego. Nunca se usan para evaluar.
export const FRASES_DESCANSO = [
  "Lo que hiciste hoy ya cuenta. Descansar también es avanzar. 🌊",
  "Un paso pequeño sigue siendo un paso. 🐢",
  "Estás aprendiendo a cuidarte, y eso importa mucho. ⭐",
  "No necesitas resolverlo todo ahora. 🫧",
] as const;

export function fraseAleatoria(aleatorio: () => number = Math.random) {
  return FRASES_DESCANSO[Math.floor(aleatorio() * FRASES_DESCANSO.length)];
}
