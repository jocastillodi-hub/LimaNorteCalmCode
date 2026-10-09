// Fuente única de las opciones del check-in y del autocuidado. Cada opción: [valor, texto, emoji].
import type { Contexto, Dificultad, Emocion } from "./types";

export const contextos: [Contexto, string, string][] = [
  ["transporte", "Transporte público", "🚌"],
  ["casa", "En casa", "🏡"],
  ["universidad", "En la universidad", "🎓"],
  ["practicas", "Prácticas preprofesionales", "💼"],
  ["tesis", "Estudiando para la tesis", "📚"],
  ["otro", "Otro lugar", "🌍"],
];

export const emociones: [Emocion, string, string][] = [
  ["tranquilidad", "Tranquilidad", "😌"],
  ["alegria", "Alegría", "😄"],
  ["tristeza", "Tristeza", "🌧️"],
  ["frustracion", "Frustración", "😤"],
  ["preocupacion", "Preocupación", "😟"],
  ["agotamiento", "Agotamiento", "🥱"],
  ["otra", "Otra", "🌀"],
];

export const dificultades: [Dificultad, string, string][] = [
  ["exceso_tareas", "Exceso de tareas", "📋"],
  ["falta_tiempo", "Falta de tiempo", "⏳"],
  ["presion_academica", "Presión académica", "🎯"],
  ["problemas_personales", "Problemas personales", "💭"],
  ["cansancio", "Cansancio", "😴"],
  ["otra", "Otra", "🌀"],
];
