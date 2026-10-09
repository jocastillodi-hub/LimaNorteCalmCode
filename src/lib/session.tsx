"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ChatMensaje, Checkin, Emocion } from "./types";

export type Evaluacion = {
  tensionDespues: number;
  sentimiento: string;
  accion: string;
};

// Estado SOLO en memoria: se pierde al recargar la página. No usa localStorage ni cookies.
type Sesion = {
  checkin: Checkin | null;
  setCheckin: (c: Checkin) => void;
  tensionAntes: number | null;
  emocionNota: { emocion: Emocion | null; nota: string };
  setEmocionNota: (e: { emocion: Emocion | null; nota: string }) => void;
  evaluacion: Evaluacion | null;
  setEvaluacion: (e: Evaluacion | null) => void;
  chat: ChatMensaje[];
  setChat: (m: ChatMensaje[]) => void;
  nocturno: boolean;
  setNocturno: (v: boolean) => void;
  racha: number;
  registrarActividad: () => void;
  reiniciar: () => void;
};

const SesionContext = createContext<Sesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [checkin, setCheckinState] = useState<Checkin | null>(null);
  const [tensionAntes, setTensionAntes] = useState<number | null>(null);
  const [emocionNota, setEmocionNota] = useState<{ emocion: Emocion | null; nota: string }>({ emocion: null, nota: "" });
  const [evaluacion, setEvaluacion] = useState<Evaluacion | null>(null);
  const [chat, setChat] = useState<ChatMensaje[]>([]);
  const [nocturno, setNocturno] = useState(false);
  // Racha: actividades completadas en esta sesión (no se guarda entre visitas).
  const [racha, setRacha] = useState(0);
  const registrarActividad = useCallback(() => setRacha((n) => n + 1), []);

  const reiniciar = useCallback(() => {
    setCheckinState(null);
    setTensionAntes(null);
    setEmocionNota({ emocion: null, nota: "" });
    setEvaluacion(null);
    setChat([]);
    setRacha(0);
  }, []);

  const setCheckin = useCallback((c: Checkin) => {
    setCheckinState(c);
    setTensionAntes(c.tension);
  }, []);

  const valor = useMemo(
    () => ({
      checkin,
      setCheckin,
      tensionAntes,
      emocionNota,
      setEmocionNota,
      evaluacion,
      setEvaluacion,
      chat,
      setChat,
      nocturno,
      setNocturno,
      racha,
      registrarActividad,
      reiniciar,
    }),
    [checkin, setCheckin, tensionAntes, emocionNota, evaluacion, chat, nocturno, racha, registrarActividad, reiniciar],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}
