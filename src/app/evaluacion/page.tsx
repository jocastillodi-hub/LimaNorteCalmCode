"use client";

import Link from "next/link";
import { useState } from "react";
import Boton from "@/components/Boton";
import Tarjeta from "@/components/Tarjeta";
import { diferenciaTension } from "@/lib/evaluacion";
import { useSesion } from "@/lib/session";

const sentimientos = ["😌 Más tranquilo/a", "😐 Igual", "🥱 Más cansado/a", "😟 Más preocupado/a", "✨ Con más claridad", "🌀 Otro"];

export default function Evaluacion() {
  const { tensionAntes, evaluacion, setEvaluacion, reiniciar } = useSesion();
  const [tension, setTension] = useState<number | null>(evaluacion?.tensionDespues ?? null);
  const [sentimiento, setSentimiento] = useState(evaluacion?.sentimiento ?? "");
  const [accion, setAccion] = useState(evaluacion?.accion ?? "");

  const guardada = evaluacion !== null;
  const comparacion =
    guardada && tensionAntes !== null ? diferenciaTension(tensionAntes, evaluacion.tensionDespues) : null;

  function guardar() {
    if (tension === null) return;
    setEvaluacion({ tensionDespues: tension, sentimiento, accion });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">💭 ¿Cómo te sientes ahora?</h1>
        <p className="mt-2 text-slate-600">Tus respuestas son una percepción tuya, no una medición clínica.</p>
      </div>

      <Tarjeta titulo="🌡️ Tensión ahora (1 = nada, 5 = mucha)">
        <div role="radiogroup" aria-label="Tensión ahora" className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={tension === n}
              onClick={() => setTension(n)}
              className={`h-12 w-12 rounded-xl border text-lg font-medium ${tension === n ? "border-teal-600 bg-teal-600 text-white" : "border-teal-200 bg-white hover:bg-teal-50"}`}
            >
              {n}
            </button>
          ))}
        </div>
      </Tarjeta>

      <Tarjeta titulo="¿Cómo te sientes en este momento?">
        <label htmlFor="sentimiento" className="sr-only">Cómo te sientes</label>
        <select
          id="sentimiento"
          value={sentimiento}
          onChange={(e) => setSentimiento(e.target.value)}
          className="w-full rounded-xl border border-teal-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
        >
          <option value="">Elige una opción (opcional)</option>
          {sentimientos.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Tarjeta>

      <Tarjeta titulo="¿Qué pequeña acción te ayudaría a continuar?">
        <label htmlFor="accion" className="sr-only">Pequeña acción</label>
        <input
          id="accion"
          value={accion}
          onChange={(e) => setAccion(e.target.value.slice(0, 120))}
          placeholder="Por ejemplo: tomar agua o escribir el primer paso"
          className="w-full rounded-xl border border-teal-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
        />
      </Tarjeta>

      <div className="flex flex-wrap items-center gap-3">
        <Boton onClick={guardar} disabled={tension === null}>Guardar mi respuesta</Boton>
        {tension === null && <p className="text-sm text-slate-500">Elige un nivel de tensión para guardar.</p>}
      </div>

      {guardada && (
        <div role="status" className="rounded-2xl bg-teal-100 p-5 text-teal-900">
          {comparacion ? (
            <>
              <p className="font-medium">Antes: {tensionAntes}/5 · Ahora: {evaluacion.tensionDespues}/5</p>
              <p className="mt-1">{comparacion.texto}</p>
            </>
          ) : (
            <p>
              Respuesta guardada.{" "}
              {tensionAntes === null && "Si haces el check-in, podremos comparar tu tensión antes y después. 🌱"}
            </p>
          )}
          {evaluacion.accion && <p className="mt-2">Tu siguiente paso: {evaluacion.accion}</p>}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/pausa" className="rounded-xl border border-teal-300 bg-white px-4 py-2 font-medium text-teal-800 hover:bg-teal-50">🫁 Otra pausa</Link>
        <Link href="/prioridades" className="rounded-xl border border-teal-300 bg-white px-4 py-2 font-medium text-teal-800 hover:bg-teal-50">Revisar prioridades</Link>
        <Link href="/" onClick={reiniciar} className="rounded-xl bg-slate-700 px-4 py-2 font-medium text-white hover:bg-slate-800">
          Finalizar sesión y volver al inicio
        </Link>
      </div>
    </div>
  );
}
