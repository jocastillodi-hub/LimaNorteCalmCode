// Fechas exactas (AAAA-MM-DD) para la bitácora. Todo se calcula en hora local.
export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

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

// Lunes de la semana que contiene la fecha dada (por defecto, hoy).
export function lunesDe(iso: string = aISO(new Date())) {
  const f = desdeISO(iso);
  return sumarDias(iso, -((f.getDay() + 6) % 7));
}

// Índice de día dentro de la semana: 0 = lunes ... 6 = domingo.
export function indiceDiaSemana(iso: string) {
  return (desdeISO(iso).getDay() + 6) % 7;
}

// "Lunes, 12 de octubre"
export function etiquetaDia(iso: string) {
  const f = desdeISO(iso);
  return `${DIAS_SEMANA[indiceDiaSemana(iso)]}, ${f.getDate()} de ${MESES[f.getMonth()]}`;
}

// "12 de octubre de 2026"
export function etiquetaFecha(iso: string) {
  const f = desdeISO(iso);
  return `${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
}
