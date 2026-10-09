"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Tarea } from "./prioridades";
import { tareasDemo } from "./prioridades";
import type { ChatMensaje, Checkin, Emocion } from "./types";

export type Evaluacion = {
  tensionDespues: number;
  sentimiento: string;
  accion: string;
};

// Estado SOLO en memoria: se pierde al recargar la página. No usa localStorage ni cookies.
type Sesion = {
  nombre: string;
  setNombre: (n: string) => void;
  checkin: Checkin | null;
  setCheckin: (c: Checkin) => void;
  tensionAntes: number | null;
  tareas: Tarea[];
  setTareas: (t: Tarea[] | ((prev: Tarea[]) => Tarea[])) => void;
  emocionNota: { emocion: Emocion | null; nota: string };
  setEmocionNota: (e: { emocion: Emocion | null; nota: string }) => void;
  evaluacion: Evaluacion | null;
  setEvaluacion: (e: Evaluacion | null) => void;
  chat: ChatMensaje[];
  setChat: (m: ChatMensaje[]) => void;
  reiniciar: () => void;
};

const SesionContext = createContext<Sesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [nombre, setNombre] = useState("");
  const [checkin, setCheckinState] = useState<Checkin | null>(null);
  const [tensionAntes, setTensionAntes] = useState<number | null>(null);
  const [tareas, setTareas] = useState<Tarea[]>(tareasDemo);
  const [emocionNota, setEmocionNota] = useState<{ emocion: Emocion | null; nota: string }>({ emocion: null, nota: "" });
  const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
  const [chat, setChat] = useState<ChatMensaje[]>([]);

  const reiniciar = useCallback(() => {
    setNombre("");
    setCheckinState(null);
    setTensionAntes(null);
    setTareas(tareasDemo);
    setEmocionNota({ emocion: null, nota: "" });
    setEvaluacion(null);
    setChat([]);
  }, []);

  const setCheckin = useCallback((c: Checkin) => {
    setCheckinState(c);
    setTensionAntes(c.tension);
  }, []);

  const valor = useMemo(
    () => ({
      nombre,
      setNombre,
      checkin,
      setCheckin,
      tensionAntes,
      tareas,
      setTareas,
      emocionNota,
      setEmocionNota,
      evaluacion,
      setEvaluacion,
      chat,
      setChat,
      reiniciar,
    }),
    [nombre, checkin, setCheckin, tensionAntes, tareas, emocionNota, evaluacion, chat, reiniciar],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}
