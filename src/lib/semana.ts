// Utilidades de fechas para el organizador semanal. Trabaja con fechas locales.
export const DIAS = [
  { numero: 1, nombre: "Lunes" },
  { numero: 2, nombre: "Martes" },
  { numero: 3, nombre: "Miércoles" },
  { numero: 4, nombre: "Jueves" },
  { numero: 5, nombre: "Viernes" },
  { numero: 6, nombre: "Sábado" },
  { numero: 7, nombre: "Domingo" },
] as const;

export function aISO(fecha: Date) {
  const y = fecha.getFullYear();
  const m = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const d = fecha.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function desdeISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function sumarDias(iso: string, dias: number) {
  const f = desdeISO(iso);
  f.setDate(f.getDate() + dias);
  return aISO(f);
}

// Lunes de la semana que contiene la fecha dada.
export function lunesDe(fecha: Date = new Date()) {
  const desplazamiento = (fecha.getDay() + 6) % 7; // domingo = 6, lunes = 0
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() - desplazamiento);
  return aISO(lunes);
}

// Día de la semana (1 = lunes ... 7 = domingo) de una fecha.
export function diaDeLaSemana(fecha: Date = new Date()) {
  return ((fecha.getDay() + 6) % 7) + 1;
}
