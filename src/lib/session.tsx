"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { migrarMisiones, type Mision } from "./bitacora";
import { aISO } from "./fechas";
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
  bitacoraAbierta: boolean;
  setBitacoraAbierta: (v: boolean) => void;
  misiones: Mision[];
  setMisiones: (m: Mision[] | ((prev: Mision[]) => Mision[])) => void;
  guardarBitacora: boolean;
  setGuardarBitacora: (v: boolean) => void;
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
  // Bitácora: en memoria por defecto. Solo se guarda en el navegador si el usuario lo activa.
  const [misiones, setMisiones] = useState<Mision[]>([]);
  const [guardarBitacora, setGuardarBitacora] = useState(false);
  const [bitacoraAbierta, setBitacoraAbierta] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("ucv-bitacora-guardar") !== "si") return;
      const bruto = window.localStorage.getItem("ucv-bitacora");
      setGuardarBitacora(true);
      if (bruto) setMisiones(migrarMisiones(JSON.parse(bruto), aISO(new Date())));
    } catch {
      // Sin acceso a localStorage, la bitácora funciona solo en memoria.
    }
  }, []);

  useEffect(() => {
    try {
      if (guardarBitacora) {
        window.localStorage.setItem("ucv-bitacora-guardar", "si");
        window.localStorage.setItem("ucv-bitacora", JSON.stringify(misiones));
      } else {
        window.localStorage.removeItem("ucv-bitacora-guardar");
        window.localStorage.removeItem("ucv-bitacora");
      }
    } catch {
      // Sin acceso a localStorage no hay nada que guardar.
    }
  }, [misiones, guardarBitacora]);

  const reiniciar = useCallback(() => {
    setCheckinState(null);
    setTensionAntes(null);
    setEmocionNota({ emocion: null, nota: "" });
    setEvaluacion(null);
    setChat([]);
    setRacha(0);
    setMisiones([]);
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
      bitacoraAbierta,
      setBitacoraAbierta,
      misiones,
      setMisiones,
      guardarBitacora,
      setGuardarBitacora,
      reiniciar,
    }),
    [checkin, setCheckin, tensionAntes, emocionNota, evaluacion, chat, nocturno, racha, registrarActividad, misiones, guardarBitacora, bitacoraAbierta, reiniciar],
  );

  return <SesionContext.Provider value={valor}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const ctx = useContext(SesionContext);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}
