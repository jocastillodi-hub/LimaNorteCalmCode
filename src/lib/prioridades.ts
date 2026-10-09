export type Tarea = {
  id: string;
  area: "practicas" | "tesis";
  texto: string;
  demostrativa: boolean;
};

export const tareasDemo: Tarea[] = [
  { id: "p1", area: "practicas", texto: "Revisar el informe semanal (ejemplo demostrativo)", demostrativa: true },
  { id: "t1", area: "tesis", texto: "Leer un artículo para el marco teórico (ejemplo demostrativo)", demostrativa: true },
];

export function recomendacion(tension: number, minutos: number) {
  if (tension >= 4) {
    return "Empieza con una pausa de 3 minutos y elige una sola tarea pequeña. No necesitas avanzar mucho hoy.";
  }
  if (minutos <= 30) {
    return "Tienes poco tiempo: trabaja solo en la acción más pequeña de cada área.";
  }
  return "Puedes avanzar con calma: dedica bloques cortos y haz una pausa entre ellos.";
}

// Acción pequeña y concreta para comenzar, según el área y la tensión.
export function accionInicial(area: "practicas" | "tesis", tension: number) {
  const suave = tension >= 4;
  if (area === "practicas") {
    return suave
      ? "Abre el documento de tus prácticas y escribe solo el título de la siguiente sección."
      : "Revisa una tarea de prácticas y anota el primer paso concreto.";
  }
  return suave
    ? "Abre tu documento de tesis y lee solo el último párrafo que escribiste."
    : "Escribe en una hoja el siguiente objetivo de tu capítulo en curso.";
}
