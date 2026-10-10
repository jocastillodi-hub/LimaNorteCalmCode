// Fuente única de las opciones del check-in y del autocuidado. Cada opción: [valor, texto, emoji].
import type { Contexto, Emocion } from "./types";

export const emociones: [Emocion, string, string][] = [
  ["alegre", "Alegre", "😄"],
  ["colera", "Cólera", "😡"],
  ["triste", "Triste", "😢"],
  ["estresado", "Estresado", "🤯"],
  ["nostalgico", "Nostálgico", "🥺"],
  ["agotado", "Agotado", "🥱"],
];

export const contextos: [Contexto, string, string][] = [
  ["transporte", "En transporte", "🚌"],
  ["casa", "En casa", "🏡"],
  ["universidad", "En la universidad", "🎓"],
  ["practicas", "Prácticas", "💼"],
  ["tesis", "Estudiando la tesis", "📚"],
];
