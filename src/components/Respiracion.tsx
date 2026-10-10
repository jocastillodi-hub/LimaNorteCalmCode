"use client";

import { useEffect, useRef, useState } from "react";
import Boton from "@/components/Boton";
import MascotaInflable from "@/components/MascotaInflable";
import { useSesion } from "@/lib/session";

// Respiración guiada sincronizada con la mascota:
// inhala 4 s (se infla a 1.4) · exhala 8 s (vuelve a 1), soltando burbujas.
// La retención es opcional y viene desactivada (la guía original pide evitar retenciones forzadas).

const DURACION_TOTAL = 180;
const ESCALA_INFLADA = 1.4;

type Fase = { nombre: "inhala" | "retiene" | "exhala"; segundos: number; escala: number; texto: string };

function fasesCiclo(conRetencion: boolean): Fase[] {
  const fases: Fase[] = [{ nombre: "inhala", segundos: 4, escala: ESCALA_INFLADA, texto: "Inhala..." }];
  if (conRetencion) fases.push({ nombre: "retiene", segundos: 7, escala: ESCALA_INFLADA, texto: "Mantén..." });
  fases.push({ nombre: "exhala", segundos: 8, escala: 1, texto: "Exhala..." });
  return fases;
}

type Juego = {
  estado: "lista" | "activa" | "pausada" | "terminada";
  restante: number;
  idx: number;
  enFase: number;
  ciclos: number;
  detenida: boolean;
};

function avanzar(s: Juego, fases: Fase[]): Juego {
  if (s.restante <= 1) return { ...s, restante: 0, estado: "terminada" };
  const enFase = s.enFase - 1;
  if (enFase > 0) return { ...s, restante: s.restante - 1, enFase };
  const siguiente = (s.idx + 1) % fases.length;
  return {
    ...s,
    restante: s.restante - 1,
    idx: siguiente,
    enFase: fases[siguiente].segundos,
    ciclos: siguiente === 0 ? s.ciclos + 1 : s.ciclos,
  };
}

function formatear(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

const burbujas = [
  { x: 28, t: 1.4, d: 0 },
  { x: 40, t: 1.8, d: 0.3 },
  { x: 56, t: 1.6, d: 0.1 },
  { x: 68, t: 2.0, d: 0.5 },
  { x: 48, t: 1.7, d: 0.7 },
];

export default function Respiracion() {
  const { registrarActividad } = useSesion();
  const [conRetencion, setConRetencion] = useState(false);
  const fases = fasesCiclo(conRetencion);
  const [juego, setJuego] = useState<Juego>({ estado: "lista", restante: DURACION_TOTAL, idx: 0, enFase: fases[0].segundos, ciclos: 0, detenida: false });
  const [explotando, setExplotando] = useState(false);
  const contada = useRef(false);

  // Reloj: un tick por segundo mientras la sesión está activa.
  useEffect(() => {
    if (juego.estado !== "activa") return;
    const id = setInterval(() => setJuego((s) => avanzar(s, fases)), 1000);
    return () => clearInterval(id);
    // fases depende de conRetencion, que ya está en la lista de dependencias.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [juego.estado, conRetencion]);

  // Al llegar a cero: cuenta una vez para la racha y dispara el ¡POP!.
  useEffect(() => {
    if (juego.estado === "terminada" && juego.restante === 0 && !juego.detenida && !contada.current) {
      contada.current = true;
      registrarActividad();
      setExplotando(true);
    }
  }, [juego, registrarActividad]);

  useEffect(() => {
    if (!explotando) return;
    const id = setTimeout(() => setExplotando(false), 1800);
    return () => clearTimeout(id);
  }, [explotando]);

  function iniciar() {
    contada.current = false;
    setExplotando(false);
    setJuego({ estado: "activa", restante: DURACION_TOTAL, idx: 0, enFase: fases[0].segundos, ciclos: 0, detenida: false });
  }

  function detener() {
    setJuego((s) => ({ ...s, estado: "terminada", detenida: true }));
  }

  const activa = juego.estado === "activa" || juego.estado === "pausada";
  const fase = fases[juego.idx];
  const escala = juego.estado === "activa" || juego.estado === "pausada" ? fase.escala : 1;
  const transcurrido = (DURACION_TOTAL - juego.restante) / DURACION_TOTAL;
  const enExhalacion = juego.estado === "activa" && fase.nombre === "exhala";

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative flex w-full flex-col items-center">
        {enExhalacion && (
          <div aria-hidden="true" key={juego.ciclos} className="pointer-events-none absolute inset-0">
            {burbujas.map((b, i) => (
              <span
                key={i}
                className="burbuja-soltar absolute bottom-[30%] h-3 w-3 rounded-full border border-white/80 bg-white/40"
                style={{ left: `${b.x}%`, animationDelay: `${b.d}s`, animationDuration: `${b.t}s` }}
              />
            ))}
          </div>
        )}
        <MascotaInflable
          escala={escala}
          visible={!explotando}
          explotando={explotando}
          duracionMs={juego.estado === "activa" ? fase.segundos * 1000 : 800}
        />
      </div>

      <p className="text-center text-4xl font-extrabold text-sky-900 sm:text-5xl" aria-live="polite">
        {juego.estado === "activa" ? fase.texto : juego.estado === "pausada" ? "En pausa ⏸️" : juego.estado === "terminada" && !juego.detenida ? "¡Lo lograste! 🎉" : "Listo cuando quieras"}
      </p>

      <div className="text-center">
        <p className="text-3xl font-bold tabular-nums text-slate-700" aria-live="off">{formatear(juego.restante)}</p>
        {juego.ciclos > 0 && <p className="mt-1 text-sm text-slate-600">Ciclos completados: {juego.ciclos}</p>}
      </div>

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={DURACION_TOTAL}
        aria-valuenow={DURACION_TOTAL - juego.restante}
        aria-label="Progreso de la respiración"
        className="h-4 w-full max-w-md overflow-hidden rounded-full border-2 border-sky-200 bg-white"
      >
        <div className="h-full bg-sky-500 transition-all" style={{ width: `${transcurrido * 100}%` }} />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {(juego.estado === "lista" || juego.estado === "terminada") && (
          <Boton onClick={iniciar} className="border-b-4 border-sky-700 bg-sky-500 hover:bg-sky-600">
            {juego.estado === "lista" ? "Empezar" : "Otra ronda"}
          </Boton>
        )}
        {juego.estado === "activa" && <Boton onClick={() => setJuego((s) => ({ ...s, estado: "pausada" }))}>Pausar</Boton>}
        {juego.estado === "pausada" && <Boton onClick={() => setJuego((s) => ({ ...s, estado: "activa" }))}>Reanudar</Boton>}
        {activa && <Boton onClick={detener} className="bg-slate-600 hover:bg-slate-700">Detener</Boton>}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={conRetencion} disabled={activa} onChange={(e) => setConRetencion(e.target.checked)} className="h-4 w-4 accent-sky-600" />
        Añadir una pausa suave tras inhalar (opcional)
      </label>
    </div>
  );
}
