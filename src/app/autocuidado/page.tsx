"use client";

import { useState } from "react";
import Tarjeta from "@/components/Tarjeta";
import { emociones } from "@/lib/opciones";
import { useSesion } from "@/lib/session";

const ejercicios = [
  { titulo: "Respiración consciente", texto: "Respira por la nariz con calma y exhala más lento que inhalas. Repite 3 veces, sin forzar el aire." },
  { titulo: "Conexión con el presente", texto: "Nombra mentalmente 3 cosas que ves, 2 que oyes y 1 que sientes en el cuerpo." },
  { titulo: "Tareas en pasos pequeños", texto: "Divide la tarea más pesada en un paso que tome menos de 10 minutos. Empieza solo por ese." },
  { titulo: "Pausas académicas", texto: "Trabaja en bloques cortos y levántate, camina o toma agua entre ellos." },
  { titulo: "Descanso", texto: "Define una hora para dejar de estudiar. El descanso también es parte del trabajo." },
];

const reflexiones = [
  "¿Qué necesito en este momento: descansar, pedir ayuda o avanzar un poco?",
  "¿Qué me diría una amiga o un amigo si estuviera en mi lugar?",
  "¿Qué es algo pequeño que hoy me haría sentir un poco mejor?",
];

export default function Autocuidado() {
  const { emocionNota, setEmocionNota } = useSesion();
  const [abierto, setAbierto] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">🌷 Autocuidado y emociones</h1>
        <p className="mt-2 text-slate-600">Ninguna actividad es obligatoria. Elige lo que te sirva hoy.</p>
      </div>

      <Tarjeta titulo="💛 Identifica lo que sientes">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Emociones">
          {emociones.map(([v, t, e]) => (
            <button
              key={v}
              type="button"
              aria-pressed={emocionNota.emocion === v}
              onClick={() => setEmocionNota({ ...emocionNota, emocion: v })}
              className={`rounded-full border px-4 py-2 text-sm transition ${emocionNota.emocion === v ? "border-teal-600 bg-teal-600 text-white" : "border-teal-200 bg-white text-teal-800 hover:bg-teal-50"}`}
            >
              <span aria-hidden="true">{e} </span>{t}
            </button>
          ))}
        </div>
        {emocionNota.emocion && (
          <div className="mt-4">
            <label htmlFor="nota" className="block text-slate-700">¿Quieres anotar algo? (se borra al cerrar la sesión)</label>
            <textarea
              id="nota"
              value={emocionNota.nota}
              onChange={(e) => setEmocionNota({ ...emocionNota, nota: e.target.value.slice(0, 300) })}
              rows={2}
              className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
        )}
      </Tarjeta>

      <Tarjeta titulo="🧘 Ejercicios breves">
        <ul className="flex flex-col gap-2">
          {ejercicios.map((e, i) => (
            <li key={e.titulo} className="rounded-xl border border-teal-100">
              <button
                type="button"
                aria-expanded={abierto === i}
                onClick={() => setAbierto(abierto === i ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-left font-medium text-teal-900"
              >
                {e.titulo}
                <span aria-hidden="true">{abierto === i ? "−" : "+"}</span>
              </button>
              {abierto === i && <p className="px-4 pb-4 text-slate-700">{e.texto}</p>}
            </li>
          ))}
        </ul>
      </Tarjeta>

      <Tarjeta titulo="🪞 Preguntas para reflexionar">
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {reflexiones.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </Tarjeta>

      <Tarjeta titulo="🤍 Pedir apoyo">
        <p className="text-slate-700">
          Hablar con alguien de confianza puede aliviar mucho. Si lo necesitas, visita la sección de{" "}
          <a href="/apoyo" className="font-medium text-teal-700 underline">apoyo psicológico</a>.
        </p>
      </Tarjeta>
    </div>
  );
}
