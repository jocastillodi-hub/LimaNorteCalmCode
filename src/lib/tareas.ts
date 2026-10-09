export const AREAS = [
  { valor: "practicas", texto: "💼 Prácticas" },
  { valor: "tesis", texto: "📚 Tesis" },
  { valor: "otra", texto: "🗂️ Otra" },
] as const;

export type Area = (typeof AREAS)[number]["valor"];

export type Tarea = {
  id: string;
  titulo: string;
  area: Area;
  fecha_limite: string | null; // formato AAAA-MM-DD
  hecha: boolean;
  creada_en: string;
  hecha_en: string | null;
};

export type Urgencia = "hecha" | "vencida" | "hoy" | "proxima" | "sin_fecha";

const AREAS_VALIDAS: readonly string[] = AREAS.map((a) => a.valor);
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Valida lo que escribe el usuario antes de enviarlo a la base de datos.
export function validarTarea(entrada: { titulo: string; area: string; fecha_limite: string }) {
  const titulo = entrada.titulo.trim();
  if (titulo.length === 0) return { ok: false as const, error: "Escribe el nombre de la tarea." };
  if (titulo.length > 120) return { ok: false as const, error: "El nombre puede tener hasta 120 caracteres." };
  if (!AREAS_VALIDAS.includes(entrada.area)) return { ok: false as const, error: "Elige un área válida." };
  const fecha = entrada.fecha_limite.trim();
  if (fecha !== "" && !FECHA.test(fecha)) return { ok: false as const, error: "La fecha no es válida." };
  return {
    ok: true as const,
    valor: { titulo, area: entrada.area as Area, fecha_limite: fecha === "" ? null : fecha },
  };
}

// Clasifica una tarea según la fecha de hoy (AAAA-MM-DD). No usa lenguaje de castigo.
export function urgencia(t: Pick<Tarea, "hecha" | "fecha_limite">, hoy: string): Urgencia {
  if (t.hecha) return "hecha";
  if (!t.fecha_limite) return "sin_fecha";
  if (t.fecha_limite < hoy) return "vencida";
  if (t.fecha_limite === hoy) return "hoy";
  return "proxima";
}

export function hoyISO(fecha = new Date()) {
  const y = fecha.getFullYear();
  const m = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const d = fecha.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
