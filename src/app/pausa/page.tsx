"use client";

import { useEffect, useRef, useState } from "react";
import Boton from "@/components/Boton";
import Tarjeta from "@/components/Tarjeta";
import Link from "next/link";

const DURACION = 180;
const FASE_MS = 4000; // inhalar y exhalar suave, sin retener el aire

const alternativas = [
  "Observa cinco cosas que ves a tu alrededor.",
  "Apoya los pies en el suelo y siente su peso.",
  "Pon una mano en el pecho y nota su movimiento, sin forzarlo.",
];

function formatear(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export default function Pausa() {
  const [restante, setRestante] = useState(DURACION);
  const [estado, setEstado] = useState<"lista" | "activa" | "pausada" | "terminada">("lista");
  const [audio, setAudio] = useState(false);
  const [fase, setFase] = useState<"inhala" | "exhala">("inhala");
  const [paso1, setPaso1] = useState(false);
  const [paso2, setPaso2] = useState("");
  const [detenida, setDetenida] = useState(false);
  const vozDisponible = typeof window !== "undefined" && "speechSynthesis" in window;
  const ultimaFase = useRef<string>("");

  useEffect(() => {
    if (estado !== "activa") return;
    const id = setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          clearInterval(id);
          setEstado("terminada");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [estado]);

  useEffect(() => {
    if (estado !== "activa") return;
    const id = setInterval(() => setFase((f) => (f === "inhala" ? "exhala" : "inhala")), FASE_MS);
    return () => clearInterval(id);
  }, [estado]);

  useEffect(() => {
    if (!audio || !vozDisponible || estado !== "activa") return;
    const texto = fase === "inhala" ? "Inhala suave" : "Exhala despacio";
    if (ultimaFase.current === texto) return;
    ultimaFase.current = texto;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(texto));
  }, [fase, audio, estado, vozDisponible]);

  useEffect(() => {
    return () => {
      if (vozDisponible) window.speechSynthesis.cancel();
    };
  }, [vozDisponible]);

  function detener() {
    setDetenida(true);
    setEstado("terminada");
    if (vozDisponible) window.speechSynthesis.cancel();
  }

  function reiniciar() {
    setRestante(DURACION);
    setEstado("lista");
    setDetenida(false);
    setPaso1(false);
    setPaso2("");
    ultimaFase.current = "";
  }

  const progreso = ((DURACION - restante) / DURACION) * 100;
  const completo = estado === "terminada" && !detenida;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">Micro-pausa de 3 minutos</h1>
        <p className="mt-2 text-slate-600">Respira a tu ritmo. Puedes detenerte en cualquier momento.</p>
      </div>

      <Tarjeta>
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-56 w-56 items-center justify-center">
            <div
              aria-hidden="true"
              className={`absolute h-full w-full rounded-full bg-teal-200 transition-transform ease-in-out ${
                estado === "activa" && fase === "inhala" ? "scale-100" : "scale-50"
              }`}
              style={{ transitionDuration: `${FASE_MS}ms` }}
            />
            <div className="relative text-center">
              <p className="text-4xl font-semibold tabular-nums text-teal-900" aria-live="polite">{formatear(restante)}</p>
              <p className="text-sm text-teal-800">
                {estado === "activa" ? (fase === "inhala" ? "Inhala suave" : "Exhala despacio") : "Listo cuando quieras"}
              </p>
            </div>
          </div>

          <div className="w-full">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={DURACION}
              aria-valuenow={DURACION - restante}
              aria-label="Progreso de la pausa"
              className="h-3 w-full overflow-hidden rounded-full bg-teal-100"
            >
              <div className="h-full bg-teal-600 transition-all" style={{ width: `${progreso}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {(estado === "lista" || estado === "terminada") && (
              <Boton onClick={() => { reiniciar(); setEstado("activa"); }}>
                {estado === "lista" ? "Iniciar" : "Empezar de nuevo"}
              </Boton>
            )}
            {estado === "activa" && <Boton onClick={() => setEstado("pausada")}>Pausar</Boton>}
            {estado === "pausada" && <Boton onClick={() => setEstado("activa")}>Reanudar</Boton>}
            {(estado === "activa" || estado === "pausada") && (
              <Boton onClick={detener} className="bg-slate-600 hover:bg-slate-700">Detener</Boton>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={audio}
              disabled={!vozDisponible}
              onChange={(e) => setAudio(e.target.checked)}
              className="h-4 w-4 accent-teal-600"
            />
            {vozDisponible ? "Guía de voz" : "Guía de voz no disponible en este navegador"}
          </label>
        </div>
      </Tarjeta>

      {estado !== "lista" && (
        <Tarjeta titulo="Si la respiración te incomoda">
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            {alternativas.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </Tarjeta>
      )}

      <Tarjeta titulo="Antes de seguir, dos pasos">
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={paso1} onChange={(e) => setPaso1(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-600" />
          <span>Reconozco cómo me siento en este momento.</span>
        </label>
        <div className="mt-4">
          <label htmlFor="accion" className="block text-slate-700">Elijo una pequeña acción de autocuidado:</label>
          <input
            id="accion"
            value={paso2}
            onChange={(e) => setPaso2(e.target.value.slice(0, 120))}
            placeholder="Por ejemplo: tomar agua, estirar el cuello, caminar 2 minutos"
            className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </Tarjeta>

      {(completo || detenida) && (
        <div className="rounded-2xl bg-teal-100 p-5 text-teal-900">
          <p className="font-medium">
            {completo ? "¡Terminaste la pausa!" : "Pausa detenida. Está bien, puedes volver cuando quieras."}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/evaluacion"
              className="rounded-xl bg-white px-4 py-2 font-medium text-teal-800 shadow-sm"
            >
              Registrar cómo me siento ahora
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
