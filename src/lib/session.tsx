"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ChatMensaje, Checkin } from "./types";

// Estado SOLO en memoria: se pierde al recargar la página. No usa localStorage ni cookies.
type Sesion = {
  nombre: string;
  setNombre: (n: string) => void;
  checkin: Checkin | null;
  setCheckin: (c: Checkin) => void;
  tensionAntes: number | null;
  setTensionAntes: (n: number) => void;
  tensionDespues: number | null;
  setTensionDespues: (n: number) => void;
  chat: ChatMensaje[];
  setChat: (m: ChatMensaje[]) => void;
  reiniciar: () => void;
};

const SesionContext = createContext<Sesion | null>(null);

export function SesionProvider({ children }: { children: ReactNode }) {
  const [nombre, setNombre] = useState("");
  const [checkin, setCheckinState] = useState<Checkin | null>(null);
  const [tensionAntes, setTensionAntes] = useState<number | null>(null);
  const [tensionDespues, setTensionDespues] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatMensaje[]>([]);

  const reiniciar = useCallback(() => {
    setNombre("");
    setCheckinState(null);
    setTensionAntes(null);
    setTensionDespues(null);
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
      setTensionAntes,
      tensionDespues,
      setTensionDespues,
      chat,
      setChat,
      reiniciar,
    }),
    [nombre, checkin, setCheckin, tensionAntes, tensionDespues, chat, reiniciar],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}
