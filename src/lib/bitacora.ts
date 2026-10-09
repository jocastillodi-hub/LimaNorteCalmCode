// Bitácora semanal: misiones por día, límites de carga suaves y micro-pasos.
export const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

export type Paso = { id: string; texto: string; hecha: boolean };
export type Mision = { id: string; titulo: string; dia: number; hecha: boolean; pasos: Paso[] }; // dia: 1 = lunes ... 7 = domingo

export type Carga = "libre" | "suave" | "llena";

export const MAX_PASOS = 6;
const LIMITE_SUAVE = 3; // a partir de 3 pendientes el día se pone ámbar
const LIMITE_LLENA = 5; // a partir de 5 pendientes se avisa con calidez

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

export function progreso(misiones: Mision[]) {
  const total = misiones.length;
  const hechas = misiones.filter((m) => m.hecha).length;
  return { total, hechas, porcentaje: total === 0 ? 0 : Math.round((hechas / total) * 100) };
}

export function pendientesDelDia(misiones: Mision[], dia: number) {
  return misiones.filter((m) => m.dia === dia && !m.hecha).length;
}
