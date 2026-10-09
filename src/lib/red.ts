// Catálogo de cursos FICTICIOS para la Red de materias. No corresponden a cursos reales
// de ninguna universidad. Solo contienen material educativo general: nada de exámenes,
// prácticas calificadas ni soluciones. Las ideas de ejemplo están marcadas como demostración.

export type Idea = { id: string; autor: string; texto: string; utiles: number; demo: boolean };

export type Curso = {
  clave: string;
  nombre: string;
  area: string;
  alias: string[];
  info: string[]; // ideas educativas generales
  ideas: Idea[];
};

export const CURSOS: Curso[] = [
  {
    clave: "estadistica-ludica",
    nombre: "Estadística Lúdica",
    area: "Datos",
    alias: ["estadistica", "estadística", "estadistica ludica"],
    info: [
      "La probabilidad condicional mide cómo cambia la chance de un evento cuando sabemos que otro ocurrió.",
      "Antes de analizar, revisa los valores atípicos: pueden mover la media más de lo que parece.",
      "Dibujar un diagrama de árbol ayuda a no confundir P(A|B) con P(B|A).",
    ],
    ideas: [
      { id: "e1", autor: "Compañera anónima", texto: "Dibujar primero el árbol de probabilidades me evitó confundir condicionales.", utiles: 12, demo: true },
    ],
  },
  {
    clave: "programacion-viajera",
    nombre: "Programación Viajera",
    area: "Tecnología",
    alias: ["programacion", "programación", "codigo", "código"],
    info: [
      "Divide el problema en funciones pequeñas que hagan una sola cosa; son más fáciles de probar.",
      "Antes de programar, escribe con tus palabras qué recibe y qué devuelve el programa.",
    ],
    ideas: [
      { id: "p1", autor: "Compañero anónimo", texto: "Probar con un caso pequeño a mano me ayudó a encontrar el error del bucle.", utiles: 6, demo: true },
    ],
  },
  {
    clave: "mente-y-aprendizaje",
    nombre: "Mente y Aprendizaje",
    area: "Ciencias del comportamiento",
    alias: ["psicologia", "psicología", "aprendizaje"],
    info: [
      "Resumir una lectura con tus propias palabras suele ayudar a recordar más que subrayar.",
      "Para una exposición, practica en voz alta con un temporizador: el tiempo real siempre es distinto a la idea.",
    ],
    ideas: [],
  },
  {
    clave: "matematica-de-mares",
    nombre: "Matemática de Mares",
    area: "Ciencias exactas",
    alias: ["matematica", "matemática", "mates"],
    info: [
      "Anota cada paso de un procedimiento: si algo falla, sabrás en cuál estabas.",
      "Verifica el resultado con un valor sencillo antes de darlo por bueno.",
    ],
    ideas: [],
  },
  {
    clave: "lenguaje-de-constelaciones",
    nombre: "Lenguaje de Constelaciones",
    area: "Comunicación",
    alias: ["lenguaje", "redaccion", "redacción"],
    info: [
      "Un párrafo, una idea: si no puedes resumirlo en una frase, probablemente tiene dos ideas.",
      "Lee tu texto en voz alta; los errores de ritmo suelen notarse al oído.",
    ],
    ideas: [],
  },
  {
    clave: "historia-de-mapas",
    nombre: "Historia de Mapas Antiguos",
    area: "Humanidades",
    alias: ["historia", "mapas"],
    info: [
      "Ubica cada hecho en una línea de tiempo: las relaciones entre causas y efectos se ven mejor así.",
      "Compara al menos dos fuentes antes de sacar una conclusión.",
    ],
    ideas: [],
  },
  {
    clave: "biologia-de-jardines",
    nombre: "Biología de Jardines",
    area: "Ciencias naturales",
    alias: ["biologia", "biología", "jardin", "jardín"],
    info: [
      "Dibuja los procesos como flechas con causa y efecto; el dibujo obliga a entender el orden.",
      "Relaciona cada término nuevo con un ejemplo cotidiano.",
    ],
    ideas: [],
  },
  {
    clave: "ciencia-de-burbujas",
    nombre: "Ciencia de Burbujas",
    area: "Ciencias exactas",
    alias: ["ciencia", "fisica", "física", "quimica", "química"],
    info: [
      "Antes de calcular, identifica qué magnitud buscas y qué datos tienes; así eliges la fórmula correcta.",
      "Revisa las unidades al final: detectan muchos errores antes de que sean grandes.",
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

// Búsqueda exacta por nombre o alias (usada para abrir un curso).
export function buscarCurso(consulta: string): Curso | null {
  const q = normalizar(consulta);
  if (!q) return null;
  return CURSOS.find((c) => normalizar(c.nombre) === q || c.alias.some((a) => normalizar(a) === q)) ?? null;
}

// Búsqueda parcial para el catálogo: coincide con nombre, área o alias.
export function filtrarCursos(consulta: string): Curso[] {
  const q = normalizar(consulta);
  if (!q) return CURSOS;
  return CURSOS.filter(
    (c) =>
      normalizar(c.nombre).includes(q) ||
      normalizar(c.area).includes(q) ||
      c.alias.some((a) => normalizar(a).includes(q)),
  );
}

// Rechaza datos personales y cualquier contenido que no sea material educativo.
const PATRONES_PERSONALES = [/[\w.+-]+@[\w-]+\.[\w.]+/, /\b\d{7,}\b/];
const PALABRAS_PROHIBIDAS = /examen resuelto|solucionario|respuestas del examen|parcial resuelto|practica calificada resuelta/i;

export function validarIdea(texto: string) {
  const t = texto.trim();
  if (t.length < 10) return { ok: false as const, error: "Escribe al menos 10 caracteres." };
  if (t.length > 300) return { ok: false as const, error: "Hasta 300 caracteres, por favor." };
  if (PATRONES_PERSONALES.some((p) => p.test(t))) return { ok: false as const, error: "No compartas correos ni números. Mantén tu idea sin datos personales." };
  if (PALABRAS_PROHIBIDAS.test(t)) return { ok: false as const, error: "Solo material educativo: no compartimos soluciones de exámenes ni prácticas calificadas." };
  return { ok: true as const, valor: t };
}
