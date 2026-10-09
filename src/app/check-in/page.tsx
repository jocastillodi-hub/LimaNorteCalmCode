"use client";

import { useState } from "react";
import Link from "next/link";
import Boton from "@/components/Boton";
import Tarjeta from "@/components/Tarjeta";
import { evaluarCheckin, type Orientacion } from "@/lib/evaluacion";
import { useSesion } from "@/lib/session";
import { contextos, dificultades, emociones } from "@/lib/opciones";
import type { Checkin, Contexto, Dificultad, Emocion } from "@/lib/types";

const claseSelect = "w-full rounded-xl border border-teal-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400";

function Escala({ valor, onChange, etiqueta }: { valor: number; onChange: (n: number) => void; etiqueta: string }) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          onClick={() => onChange(n)}
          className={`h-12 w-12 rounded-xl border text-lg font-medium transition ${
            valor === n ? "border-teal-600 bg-teal-600 text-white" : "border-teal-200 bg-white hover:bg-teal-50"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

const colorNivel = {
  bajo: "bg-emerald-50 text-emerald-800 border-emerald-200",
  moderado: "bg-amber-50 text-amber-800 border-amber-200",
  alto: "bg-rose-50 text-rose-800 border-rose-200",
};

export default function CheckIn() {
  const { setCheckin, checkin } = useSesion();
  const [contexto, setContexto] = useState<Contexto>(checkin?.contexto ?? "universidad");
  const [tension, setTension] = useState(checkin?.tension ?? 0);
  const [emocion, setEmocion] = useState<Emocion>(checkin?.emocion ?? "tranquilidad");
  const [energia, setEnergia] = useState(checkin?.energia ?? 0);
  const [concentracion, setConcentracion] = useState(checkin?.concentracion ?? 0);
  const [dificultad, setDificultad] = useState<Dificultad>(checkin?.dificultad ?? "exceso_tareas");
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<Orientacion | null>(null);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!tension || !energia || !concentracion) {
      setError("Responde las escalas de tensión, energía y concentración para continuar.");
      return;
    }
    setError("");
    const datos: Checkin = { contexto, tension, emocion, energia, concentracion, dificultad };
    setCheckin(datos);
    setResultado(evaluarCheckin(datos));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">Check-in emocional</h1>
        <p className="mt-2 text-slate-600">Responde lo que quieras. Puedes dejar cualquier pregunta sin contestar.</p>
      </div>

      <form onSubmit={enviar} className="flex flex-col gap-5" noValidate>
        <Tarjeta titulo="¿Dónde estás ahora?">
          <label htmlFor="contexto" className="sr-only">Contexto</label>
          <select id="contexto" className={claseSelect} value={contexto} onChange={(e) => setContexto(e.target.value as Contexto)}>
            {contextos.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </Tarjeta>

        <Tarjeta titulo="¿Qué tan tensa te sientes? (1 = nada, 5 = mucha)">
          <Escala valor={tension} onChange={setTension} etiqueta="Nivel de tensión" />
        </Tarjeta>

        <Tarjeta titulo="¿Qué emoción predomina?">
          <label htmlFor="emocion" className="sr-only">Emoción predominante</label>
          <select id="emocion" className={claseSelect} value={emocion} onChange={(e) => setEmocion(e.target.value as Emocion)}>
            {emociones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </Tarjeta>

        <Tarjeta titulo="¿Cómo está tu energía? (1 = muy baja, 5 = alta)">
          <Escala valor={energia} onChange={setEnergia} etiqueta="Nivel de energía" />
        </Tarjeta>

        <Tarjeta titulo="¿Qué tan bien puedes concentrarte? (1 = nada, 5 = muy bien)">
          <Escala valor={concentracion} onChange={setConcentracion} etiqueta="Capacidad de concentración" />
        </Tarjeta>

        <Tarjeta titulo="¿Cuál es tu principal dificultad?">
          <label htmlFor="dificultad" className="sr-only">Principal dificultad</label>
          <select id="dificultad" className={claseSelect} value={dificultad} onChange={(e) => setDificultad(e.target.value as Dificultad)}>
            {dificultades.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        </Tarjeta>

        {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-rose-800">{error}</p>}

        <Boton type="submit" className="self-center sm:px-10">Ver mi orientación</Boton>
      </form>

      {resultado && (
        <div className={`rounded-2xl border p-6 ${colorNivel[resultado.nivel]}`} role="status">
          <h2 className="text-xl font-semibold">{resultado.titulo}</h2>
          <p className="mt-2">{resultado.mensaje}</p>
          <p className="mt-2 text-sm opacity-80">
            Esta orientación se basa solo en tus respuestas y no es un diagnóstico.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/pausa" className="rounded-xl bg-white px-4 py-2 font-medium text-teal-800 shadow-sm">Hacer una pausa</Link>
            <Link href="/prioridades" className="rounded-xl bg-white px-4 py-2 font-medium text-teal-800 shadow-sm">Ordenar prioridades</Link>
          </div>
        </div>
      )}
    </div>
  );
}
