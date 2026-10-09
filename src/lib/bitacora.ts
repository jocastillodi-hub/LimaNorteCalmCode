import { lunesDe, sumarDias } from "./fechas";

// Bitácora semanal: misiones con fecha exacta, límites de carga suaves y micro-pasos.
export type Paso = { id: string; texto: string; hecha: boolean };

export type Mision = {
  id: string;
  titulo: string;
  fecha: string; // AAAA-MM-DD: el día exacto en que aparece
  hecha: boolean;
  pasos: Paso[];
  vence: string | null; // ISO 8601 con hora, opcional
  notas?: string; // lo que el estudiante escribe en su mesa de trabajo
};

export type EstadoTiempo = "sin_hora" | "lejos" | "pronto" | "esperando";
export type Carga = "libre" | "suave" | "llena";

export const MAX_PASOS = 6;
const LIMITE_SUAVE = 3; // a partir de 3 pendientes el día se pone ámbar
const LIMITE_LLENA = 5; // a partir de 5 pendientes se avisa con calidez
const DOS_HORAS_MS = 2 * 60 * 60 * 1000;

export function nivelCarga(pendientes: number): Carga {
  if (pendientes >= LIMITE_LLENA) return "llena";
  if (pendientes >= LIMITE_SUAVE) return "suave";
  return "libre";
}

export function mensajeCarga(nivel: Carga, dia: string): string | null {
  if (nivel === "llena") {
    return `¡Cuidado! Tu red está muy llena el ${dia.toLowerCase()}. ¿Qué tal si movemos algo para mañana?`;
  }
  if (nivel === "suave") return "Vas bien, pero este día ya tiene bastante. Puedes repartir algo.";
  return null;
}

// Divide una tarea grande en pasos cortos, separados por comas o " y ".
export function dividirEnPasos(texto: string, generarId: () => string): Paso[] {
  return texto
    .split(/,| y |;/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .slice(0, MAX_PASOS)
    .map((t) => ({ id: generarId(), texto: t.slice(0, 120), hecha: false }));
}

// Estado de la hora de vencimiento. Nunca usa lenguaje de atraso.
export function estadoTiempo(m: Pick<Mision, "hecha" | "vence">, ahora: Date = new Date()): EstadoTiempo {
  if (m.hecha || !m.vence) return "sin_hora";
  const diferencia = new Date(m.vence).getTime() - ahora.getTime();
  if (Number.isNaN(diferencia)) return "sin_hora";
  if (diferencia < 0) return "esperando";
  if (diferencia <= DOS_HORAS_MS) return "pronto";
  return "lejos";
}

// Misiones que conviene recordar fuera de la bitácora (pronto vencen y no están hechas).
export function misionesPorRecordar(misiones: Mision[], ahora: Date = new Date()) {
  return misiones.filter((m) => estadoTiempo(m, ahora) === "pronto");
}

export function progreso(misiones: Mision[]) {
  const total = misiones.length;
  const hechas = misiones.filter((m) => m.hecha).length;
  return { total, hechas, porcentaje: total === 0 ? 0 : Math.round((hechas / total) * 100) };
}

export function pendientesDelDia(misiones: Mision[], fecha: string) {
  return misiones.filter((m) => m.fecha === fecha && !m.hecha).length;
}

// Convierte datos guardados con el formato anterior (día 1-7 de la semana actual) al nuevo.
// Así no se pierden las misiones que ya estaban guardadas en el navegador.
export function migrarMisiones(datos: unknown, hoy: string): Mision[] {
  if (!Array.isArray(datos)) return [];
  const lunes = lunesDe(hoy);
  const salida: Mision[] = [];
  for (const d of datos as Record<string, unknown>[]) {
    if (!d || typeof d.titulo !== "string" || typeof d.id !== "string") continue;
    const fecha =
      typeof d.fecha === "string"
        ? d.fecha
        : typeof d.dia === "number" && d.dia >= 1 && d.dia <= 7
          ? sumarDias(lunes, d.dia - 1)
          : null;
    if (!fecha) continue;
    salida.push({
      id: d.id,
      titulo: d.titulo,
      fecha,
      hecha: d.hecha === true,
      pasos: Array.isArray(d.pasos) ? (d.pasos as Mision["pasos"]) : [],
      vence: typeof d.vence === "string" ? d.vence : null,
    });
  }
  return salida;
}
