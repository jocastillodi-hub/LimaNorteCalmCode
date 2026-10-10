"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { evaluarCheckin, type Orientacion } from "@/lib/evaluacion";
import { climas, contextos, dificultades, emociones } from "@/lib/opciones";
import { useSesion } from "@/lib/session";
import type { Checkin } from "@/lib/types";

type Respuestas = Partial<Checkin>;

const emojiTension = ["😌", "🙂", "😐", "😣", "🥵"];
const emojiEnergia = ["🪫", "🔋", "🔋", "⚡", "🚀"];
const emojiConcentracion = ["🌫️", "🌤️", "🌤️", "🎯", "🧠"];

const colorNivel = {
  bajo: "from-emerald-100 to-teal-100 border-emerald-200 text-emerald-900",
  moderado: "from-amber-100 to-orange-100 border-amber-200 text-amber-900",
  alto: "from-rose-100 to-violet-100 border-rose-200 text-rose-900",
};
const emojiNivel = { bajo: "🌿", moderado: "🍂", alto: "🌧️" };

const pasosPracticos: Record<Orientacion["nivel"], string[]> = {
  bajo: ["🗓️ Elige una tarea para hoy", "🚶 Haz una pausa corta cada 45 minutos"],
  moderado: ["🫖 Tómate 3 minutos de pausa", "✂️ Divide la tarea más pesada en un paso pequeño"],
  alto: ["🫁 Haz la micro-pausa ahora", "🤝 Escribe a alguien de confianza", "🌱 Con que hagas una sola cosa hoy basta"],
};

// Subtítulos empáticos por paso (reemplazan a los textos de formulario).
const subtitulos = [
  "Nombrar lo que sientes ya es un gran paso.",
  "No hay respuestas correctas, solo la tuya.",
  "Así entendemos mejor el entorno en el que estás.",
  "Hay días en que el cuerpo avisa. Esta escala es tuya.",
  "¿Cómo está tu energía para el viaje de hoy?",
  "Selecciona tu nivel de batería mental antes de empezar.",
  "Ponle nombre a lo que más pesa; no hace falta que sea perfecto.",
];

function Opciones<T extends string>({
  opciones,
  valor,
  onElegir,
  etiqueta,
}: {
  opciones: [T, string, string][];
  valor: T | undefined;
  onElegir: (v: T) => void;
  etiqueta: string;
}) {
  return (
    <div role="radiogroup" aria-label={etiqueta} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {opciones.map(([v, t, e]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={valor === v}
          onClick={() => onElegir(v)}
          className={`esponja flex flex-col items-center gap-1 rounded-[1.75rem] border-2 p-4 text-sm font-semibold text-amber-950 ${
            valor === v ? "border-cyan-500 bg-cyan-100 shadow-md" : "border-transparent bg-amber-50 shadow-sm"
          }`}
        >
          <span className="text-4xl" aria-hidden="true">{e}</span>
          {t}
        </button>
      ))}
    </div>
  );
}

function EscalaEmoji({
  valor,
  onElegir,
  emojis,
  etiqueta,
  textos,
}: {
  valor: number | undefined;
  onElegir: (n: number) => void;
  emojis: string[];
  etiqueta: string;
  textos: [string, string];
}) {
  return (
    <div>
      <div role="radiogroup" aria-label={etiqueta} className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={valor === n}
            aria-label={`${n} de 5`}
            onClick={() => onElegir(n)}
            className={`esponja flex h-16 flex-1 flex-col items-center justify-center rounded-[1.5rem] border-2 ${
              valor === n ? "border-cyan-500 bg-cyan-100 shadow-md" : "border-transparent bg-amber-50 shadow-sm"
            }`}
          >
            <span className="text-3xl" aria-hidden="true">{emojis[n - 1]}</span>
            <span className="text-xs text-slate-500">{n}</span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{textos[0]}</span>
        <span>{textos[1]}</span>
      </div>
    </div>
  );
}

export default function CheckInFlow() {
  const { setCheckin, checkin, registrarActividad } = useSesion();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState<Respuestas>(checkin ?? {});
  const [resultado, setResultado] = useState<Orientacion | null>(null);
  const [cancelado, setCancelado] = useState(false);
  const router = useRouter();

  // Sobrecarga alta: después de un aviso breve, llevamos a un rato de juego (se puede cancelar).
  useEffect(() => {
    if (resultado?.nivel !== "alto" || cancelado) return;
    const id = setTimeout(() => router.push("/diversion"), 5000);
    return () => clearTimeout(id);
  }, [resultado, cancelado, router]);

  // El clima es opcional: se puede saltar sin que bloquee el flujo.
  const pasos = [
    { titulo: "¿Cómo te sientes hoy?", emoji: "💛", listo: r.emocion !== undefined },
    { titulo: "Si tu día fuera un clima, ¿cuál sería?", emoji: "🌤️", listo: true, opcional: true },
    { titulo: "¿Dónde estás ahora?", emoji: "📍", listo: r.contexto !== undefined },
    { titulo: "¿Cuánta tensión sientes?", emoji: "🌡️", listo: r.tension !== undefined },
    { titulo: "¿Cómo está tu energía?", emoji: "🔋", listo: r.energia !== undefined },
    { titulo: "¿Qué tan clara está tu mente?", emoji: "🧠", listo: r.concentracion !== undefined },
    { titulo: "¿Qué te pesa más hoy?", emoji: "🎒", listo: r.dificultad !== undefined },
  ];
  const actual = pasos[paso];
  const total = pasos.length;
  const ultimo = paso === total - 1;

  function siguiente() {
    if (!actual.listo) return;
    if (ultimo) {
      const datos = r as Checkin;
      setCheckin(datos);
      registrarActividad();
      setResultado(evaluarCheckin(datos));
      return;
    }
    setPaso((p) => p + 1);
  }

  function reiniciar() {
    setR({});
    setPaso(0);
    setResultado(null);
  }

  if (resultado) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        {resultado.nivel === "alto" && !cancelado && (
          <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sky-100 px-4 py-3 text-sky-900">
            <span>🎈 Te llevamos a un rato de juego en unos segundos.</span>
            <button type="button" onClick={() => setCancelado(true)} className="font-bold underline">Quedarme aquí</button>
          </div>
        )}
        <div className={`rounded-3xl border bg-gradient-to-br p-6 shadow-md sm:p-8 ${colorNivel[resultado.nivel]}`} role="status">
          <p className="text-6xl" aria-hidden="true">{emojiNivel[resultado.nivel]}</p>
          <h1 className="mt-3 text-2xl font-bold sm:text-3xl">{resultado.titulo}</h1>
          <p className="mt-3 text-lg">{resultado.mensaje}</p>
          <p className="mt-3 text-sm opacity-80">Esto se basa solo en tus respuestas. No es un diagnóstico.</p>
        </div>

        <div className="panel rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-teal-800">✨ Tus próximos pasos</h2>
          <ul className="flex flex-col gap-3">
            {pasosPracticos[resultado.nivel].map((p) => (
              <li key={p} className="rounded-xl bg-teal-50 px-4 py-3 text-teal-900">{p}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/pausa" className="rounded-xl bg-teal-600 px-5 py-3 font-medium text-white shadow hover:bg-teal-700">🫁 Hacer una pausa</Link>
          <Link href="/asistente" className="rounded-xl bg-white px-5 py-3 font-medium text-teal-800 shadow-sm hover:bg-teal-50">💬 Hablar con el asistente</Link>
          <button type="button" onClick={reiniciar} className="rounded-xl px-5 py-3 font-medium text-slate-600 underline">Repetir el check-in</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <section key={paso} className="cuadro-pina rounded-[2.5rem] p-6 sm:p-10" aria-labelledby="titulo-clima">
        <h1 id="titulo-clima" className="text-2xl font-extrabold text-amber-950 sm:text-3xl">Mi Clima Interno</h1>
        <p className="mt-6 text-5xl" aria-hidden="true">{actual.emoji}</p>
        <h2 className="mt-2 text-xl font-bold text-amber-950 sm:text-2xl">{actual.titulo}</h2>
        <p className="mt-1 text-sm text-amber-900/80">
          {subtitulos[paso]}
          {actual.opcional && " Opcional: puedes saltarla."}
        </p>

        <div className="mt-6">
          {paso === 0 && <Opciones opciones={emociones} valor={r.emocion} onElegir={(v) => setR({ ...r, emocion: v })} etiqueta="Emoción" />}
          {paso === 1 && <Opciones opciones={climas} valor={r.clima} onElegir={(v) => setR({ ...r, clima: v })} etiqueta="Clima del día" />}
          {paso === 2 && <Opciones opciones={contextos} valor={r.contexto} onElegir={(v) => setR({ ...r, contexto: v })} etiqueta="Contexto" />}
          {paso === 3 && (
            <EscalaEmoji valor={r.tension} onElegir={(n) => setR({ ...r, tension: n })} emojis={emojiTension} etiqueta="Nivel de tensión" textos={["Nada", "Mucha"]} />
          )}
          {paso === 4 && (
            <EscalaEmoji valor={r.energia} onElegir={(n) => setR({ ...r, energia: n })} emojis={emojiEnergia} etiqueta="Nivel de energía" textos={["Muy baja", "Alta"]} />
          )}
          {paso === 5 && (
            <EscalaEmoji valor={r.concentracion} onElegir={(n) => setR({ ...r, concentracion: n })} emojis={emojiConcentracion} etiqueta="Concentración" textos={["Nublada", "Clara"]} />
          )}
          {paso === 6 && <Opciones opciones={dificultades} valor={r.dificultad} onElegir={(v) => setR({ ...r, dificultad: v })} etiqueta="Dificultad" />}
        </div>
      </section>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setPaso((p) => Math.max(0, p - 1))}
          disabled={paso === 0}
          className="rounded-xl px-4 py-3 text-slate-600 underline disabled:invisible"
        >
          ← Atrás
        </button>
        <div className="flex items-center gap-2">
          {actual.opcional && (
            <button
              type="button"
              onClick={() => setPaso((p) => p + 1)}
              className="rounded-xl px-4 py-3 text-slate-600 underline"
            >
              Saltar
            </button>
          )}
          <button
            type="button"
            onClick={siguiente}
            disabled={!actual.listo}
            className="rounded-2xl border-b-4 border-sky-400 bg-sky-200 px-8 py-3 text-base font-extrabold text-sky-900 shadow-sm transition hover:bg-sky-300 active:translate-y-0.5 active:border-b-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ultimo ? "Ver mi orientación ✨" : "Siguiente →"}
          </button>
        </div>
      </div>
    </div>
  );
}
