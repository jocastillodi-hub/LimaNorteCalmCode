// Fuente única de las opciones de Mi Clima Interno y del autocuidado. Cada opción: [valor, texto, emoji].
import type { Clima, Contexto, Dificultad, Emocion } from "./types";

export const emociones: [Emocion, string, string][] = [
  ["tranquilidad", "Tranquilidad", "😌"],
  ["alegria", "Alegría", "😄"],
  ["tristeza", "Tristeza", "🌧️"],
  ["frustracion", "Frustración", "😤"],
  ["preocupacion", "Preocupación", "😟"],
  ["agotamiento", "Agotamiento", "🥱"],
];

export const climas: [Clima, string, string][] = [
  ["soleado", "Soleado", "☀️"],
  ["nublado", "Nublado", "☁️"],
  ["lluvia", "Lluvioso", "🌧️"],
  ["tormenta", "Tormenta por dentro", "⛈️"],
  ["arcoiris", "Arcoíris tras la lluvia", "🌈"],
];

export const contextos: [Contexto, string, string][] = [
  ["transporte", "En transporte", "🚌"],
  ["casa", "En casa", "🏡"],
  ["universidad", "En la universidad", "🎓"],
  ["practicas", "Prácticas", "💼"],
  ["tesis", "Estudiando la tesis", "📚"],
];

export const dificultades: [Dificultad, string, string][] = [
  ["exceso_tareas", "Exceso de tareas", "📋"],
  ["falta_tiempo", "Falta de tiempo", "⏳"],
  ["presion_academica", "Presión académica", "🎯"],
  ["problemas_personales", "Problemas personales", "💭"],
  ["cansancio", "Cansancio", "😴"],
];
