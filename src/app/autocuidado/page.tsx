"use client";

import Link from "next/link";
import Tarjeta from "@/components/Tarjeta";
import { emociones } from "@/lib/opciones";
import { useSesion } from "@/lib/session";

const ejercicios = [
  { titulo: "🫧 Respiración consciente", texto: "Sigue a la mascota: inhala mientras se infla y exhala mientras se desinfla.", enlace: "/pausa", enlaceTexto: "Abrir el Oasis" },
  { titulo: "🧩 Tareas en pasos pequeños", texto: "Divide la tarea más pesada en un paso que tome menos de 10 minutos. Empieza solo por ese.", enlace: null, enlaceTexto: "" },
  { titulo: "🌙 Pausas y descanso", texto: "Trabaja en bloques cortos, levántate entre ellos y define una hora para dejar de estudiar. El descanso también es parte del trabajo.", enlace: null, enlaceTexto: "" },
];

const reflexiones = [
  "¿Qué necesito en este momento: descansar, pedir ayuda o avanzar un poco?",
  "¿Qué me diría una amiga o un amigo si estuviera en mi lugar?",
  "¿Qué es algo pequeño que hoy me haría sentir un poco mejor?",
];

export default function Autocuidado() {
  const { emocionNota, setEmocionNota } = useSesion();

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-sky-900">🌷 Mimos para Mí</h1>
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
              className={`rounded-2xl border-2 border-b-4 px-4 py-2 text-sm font-bold transition active:translate-y-0.5 ${
                emocionNota.emocion === v ? "border-sky-500 bg-sky-500 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
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
              className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>
        )}
      </Tarjeta>

      <section aria-labelledby="ejercicios" className="flex flex-col gap-3">
        <h2 id="ejercicios" className="text-lg font-bold text-slate-800">🧘 Ejercicios breves</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ejercicios.map((e) => (
            <article key={e.titulo} className="panel rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-800">{e.titulo}</h3>
              <p className="mt-2 text-slate-700">{e.texto}</p>
              {e.enlace && (
                <Link href={e.enlace} className="mt-4 inline-block rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600">
                  {e.enlaceTexto}
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <Tarjeta titulo="🪞 Preguntas para reflexionar">
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          {reflexiones.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </Tarjeta>

      <Tarjeta titulo="🤍 Pedir apoyo">
        <p className="text-slate-700">
          Un rato de juego también ayuda. <Link href="/diversion" className="font-bold text-sky-700 underline">Ir a Rato de juego 🎈</Link>.
          <br />
          Hablar con alguien de confianza puede aliviar mucho. Si lo necesitas, visita{" "}
          <Link href="/apoyo" className="font-bold text-sky-700 underline">Salvavidas</Link>.
        </p>
      </Tarjeta>
    </div>
  );
}
