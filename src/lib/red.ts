// Red de materias: prototipo. Los contenidos de ejemplo están marcados como demostración.
// Una red real necesita cuentas, base de datos compartida, moderación y reporte de contenido.

export type Idea = { id: string; autor: string; texto: string; utiles: number; demo: boolean };

export type Materia = {
  clave: string;
  nombre: string;
  alias: string[];
  info: string[];
  ideas: Idea[];
};

export const MATERIAS: Materia[] = [
  {
    clave: "estadistica",
    nombre: "Estadística",
    alias: ["estadistica", "estadística", "estadistica aplicada", "probabilidad"],
    info: [
      "La probabilidad condicional mide cómo cambia la chance de un evento cuando sabemos que otro ocurrió.",
      "Antes de analizar, revisa valores atípicos: pueden cambiar la media más de lo que parece.",
      "Un valor p bajo indica que los datos son poco probables si la hipótesis nula fuera cierta; no prueba nada por sí solo.",
    ],
    ideas: [
      { id: "e1", autor: "Compañera anónima", texto: "Dibujar primero el árbol de probabilidades me evitó confundir P(A|B) con P(B|A).", utiles: 12, demo: true },
      { id: "e2", autor: "Estudiante anónimo", texto: "Para la regresión, escribir los supuestos antes de correr el modelo hace más fácil defender el informe.", utiles: 8, demo: true },
    ],
  },
  {
    clave: "programacion",
    nombre: "Programación",
    alias: ["programacion", "programación", "codigo", "código"],
    info: [
      "Divide el problema en funciones pequeñas que hagan una sola cosa; es más fácil probarlas.",
      "Antes de programar, escribe con tus palabras qué debe recibir y devolver el programa.",
    ],
    ideas: [
      { id: "p1", autor: "Compañero anónimo", texto: "Probar con un caso pequeño a mano me ayudó a encontrar el error del bucle.", utiles: 6, demo: true },
    ],
  },
  {
    clave: "psicologia",
    nombre: "Psicología",
    alias: ["psicologia", "psicología"],
    info: [
      "Un resumen de lectura con tus propias palabras suele ayudarte a recordar más que subrayar.",
      "Para exposiciones, practica en voz alta con un temporizador: el tiempo real siempre es distinto a la idea.",
    ],
    ideas: [],
  },
];

export function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function buscarMateria(consulta: string): Materia | null {
  const q = normalizar(consulta);
  if (!q) return null;
  return MATERIAS.find((m) => m.alias.some((a) => normalizar(a) === q) || normalizar(m.nombre) === q) ?? null;
}

// Rechaza datos personales y contenidos que no deben publicarse en la red.
const PATRONES_PERSONALES = [/[\w.+-]+@[\w-]+\.[\w.]+/, /\b\d{7,}\b/];
const PALABRAS_PROHIBIDAS = /examen resuelto|solucionario|respuestas del examen/i;

export function validarIdea(texto: string) {
  const t = texto.trim();
  if (t.length < 10) return { ok: false as const, error: "Escribe al menos 10 caracteres." };
  if (t.length > 300) return { ok: false as const, error: "Hasta 300 caracteres, por favor." };
  if (PATRONES_PERSONALES.some((p) => p.test(t))) return { ok: false as const, error: "No compartas correos ni números. Mantén tu idea sin datos personales." };
  if (PALABRAS_PROHIBIDAS.test(t)) return { ok: false as const, error: "No compartimos soluciones de exámenes. Comparte tu método o una pista, no la respuesta." };
  return { ok: true as const, valor: t };
}
