// Datos de DEMOSTRACIÓN del laboratorio. No son trabajos reales de estudiantes.
// En producción, el archivo se llenaría con material que sus autores hayan compartido
// (sin exámenes ni prácticas calificadas), y la presencia vendría de tiempo real con cuentas.

export type TipoMaterial = "plantilla" | "apuntes" | "guia";

export type MaterialArchivo = {
  id: string;
  titulo: string;
  tipo: TipoMaterial;
  año: number;
  usos: number; // cuántos compañeros lo han usado
  resumen: string;
  autor: string; // alias anónimo
};

export type Compañero = {
  id: string;
  alias: string;
  color: string; // clase de Tailwind
  estado: "resolviendo" | "buscando_ayuda" | "compartiendo";
};

export const ETIQUETAS_TIPO: Record<TipoMaterial, string> = {
  plantilla: "🧩 Plantilla",
  apuntes: "📝 Apuntes",
  guia: "🗺️ Guía",
};

export const ARCHIVO_DEMO: MaterialArchivo[] = [
  { id: "a1", titulo: "Plantilla de informe de regresión", tipo: "plantilla", año: 2025, usos: 34, resumen: "Estructura con secciones para datos, supuestos y conclusiones.", autor: "Compañera anónima" },
  { id: "a2", titulo: "Apuntes de probabilidad condicional", tipo: "apuntes", año: 2024, usos: 21, resumen: "Ejemplos resueltos paso a paso con diagramas de árbol.", autor: "Estudiante anónimo" },
  { id: "a3", titulo: "Guía para pruebas de hipótesis", tipo: "guia", año: 2025, usos: 17, resumen: "Cómo elegir la prueba y cómo leer el valor p.", autor: "Estudiante anónimo" },
  { id: "a4", titulo: "Checklist de datos atípicos", tipo: "plantilla", año: 2023, usos: 9, resumen: "Pasos para revisar valores extremos antes de analizar.", autor: "Compañero anónimo" },
];

export const COMPAÑEROS_DEMO: Compañero[] = [
  { id: "c1", alias: "Lila", color: "bg-violet-300", estado: "resolviendo" },
  { id: "c2", alias: "Tomás", color: "bg-sky-300", estado: "buscando_ayuda" },
  { id: "c3", alias: "Mía", color: "bg-emerald-300", estado: "compartiendo" },
  { id: "c4", alias: "Rubén", color: "bg-amber-300", estado: "resolviendo" },
];

export const ETIQUETAS_ESTADO: Record<Compañero["estado"], string> = {
  resolviendo: "resolviendo ahora",
  buscando_ayuda: "busca una mano",
  compartiendo: "compartiendo un archivo",
};

export function filtrarArchivo(materiales: MaterialArchivo[], tipo: TipoMaterial | "todos") {
  return tipo === "todos" ? materiales : materiales.filter((m) => m.tipo === tipo);
}

// Ordena por utilidad (usos) y, a igualdad, por el año más reciente.
export function ordenarArchivo(materiales: MaterialArchivo[]) {
  return [...materiales].sort((a, b) => b.usos - a.usos || b.año - a.año);
}
