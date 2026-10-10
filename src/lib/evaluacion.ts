import type { Checkin } from "./types";

export type Orientacion = {
  nivel: "bajo" | "moderado" | "alto";
  titulo: string;
  mensaje: string;
};

// Señales ORIENTATIVAS a partir de respuestas voluntarias.
// No es un diagnóstico ni una medición clínica.
export function evaluarCheckin(c: Checkin): Orientacion {
  let puntaje = 0;
  if (c.tension >= 4) puntaje += 2;
  else if (c.tension === 3) puntaje += 1;
  if (c.emocion === "agotado" || c.emocion === "triste" || c.emocion === "colera") {
    puntaje += 1;
  }

  if (puntaje >= 3) {
    return {
      nivel: "alto",
      titulo: "Parece que llevas mucha carga ahora",
      mensaje:
        "Tus respuestas sugieren una sobrecarga importante. Antes de organizar tareas, conviene darte una pausa. Si esto se mantiene, hablar con alguien de confianza o con el servicio de apoyo puede ayudarte.",
    };
  }
  if (puntaje >= 2) {
    return {
      nivel: "moderado",
      titulo: "Tienes algo de tensión acumulada",
      mensaje:
        "Es normal sentir presión en esta etapa. Una pausa corta y ordenar una sola cosa a la vez pueden aliviar un poco la carga.",
    };
  }
  return {
    nivel: "bajo",
    titulo: "Te sientes con bastante estabilidad",
    mensaje:
      "Buen momento para organizar tus prioridades o cuidar tu descanso. Recuerda que estas señales son solo orientativas.",
  };
}

export function diferenciaTension(antes: number, despues: number) {
  const cambio = despues - antes;
  if (cambio < 0) return { tipo: "bajo" as const, texto: "Tu tensión bajó según tu percepción." };
  if (cambio > 0) return { tipo: "subio" as const, texto: "Tu tensión subió según tu percepción. Está bien; puedes volver a una pausa o pedir apoyo." };
  return { tipo: "igual" as const, texto: "Tu tensión se mantuvo igual según tu percepción." };
}
