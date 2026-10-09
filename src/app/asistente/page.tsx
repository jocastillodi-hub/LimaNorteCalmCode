"use client";

import { useRef, useState } from "react";
import Boton from "@/components/Boton";
import { haySenalDeRiesgo } from "@/lib/seguridad";
import { useSesion } from "@/lib/session";
import type { ChatMensaje } from "@/lib/types";
import { emergencia } from "@/lib/config";

const opciones = [
  { texto: "🫂 Quiero desahogarme", prompt: "Necesito desahogarme un momento." },
  { texto: "🧩 Ordenar mis ideas", prompt: "Tengo muchas ideas mezcladas y quiero ordenarlas." },
  { texto: "🧭 Buscar una estrategia", prompt: "¿Me ayudas a encontrar una estrategia para manejar mi carga académica?" },
  { texto: "🗓️ Planificar una acción", prompt: "Quiero planificar una acción pequeña para hoy." },
];

export default function Asistente() {
  const { chat, setChat } = useSesion();
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);
  const [alerta, setAlerta] = useState(false);
  const fin = useRef<HTMLDivElement>(null);

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (!limpio || cargando) return;
    setError("");
    if (haySenalDeRiesgo(limpio)) setAlerta(true);

    const nuevo: ChatMensaje[] = [...chat, { rol: "usuario", texto: limpio }];
    setChat(nuevo);
    setEntrada("");
    setCargando(true);

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevo }),
      });
      const data = (await r.json()) as { respuesta?: string; demo?: boolean; error?: string };
      if (!r.ok || !data.respuesta) {
        setError(data.error ?? "No pudimos obtener una respuesta. Inténtalo de nuevo.");
        return;
      }
      setDemo(Boolean(data.demo));
      setChat([...nuevo, { rol: "asistente", texto: data.respuesta }]);
      setTimeout(() => fin.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setError("Revisa tu conexión e inténtalo de nuevo. Tu mensaje no se perdió.");
      setChat(chat);
      setEntrada(limpio);
    } finally {
      setCargando(false);
    }
  }

  function borrar() {
    setChat([]);
    setError("");
    setAlerta(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">💬 Asistente de escucha</h1>
        <p className="mt-2 text-slate-600">
          Soy una herramienta automatizada. No soy psicólogo ni un servicio de emergencia.
        </p>
        {demo && (
          <p className="mt-2 rounded-xl bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Modo demostrativo: no hay una IA externa conectada. Las respuestas son de ejemplo.
          </p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Lo que escribes se envía a un proveedor externo de IA para generar la respuesta (si está configurado). No lo uses para datos sensibles de terceros.
        </p>
      </div>

      {alerta && (
        <div role="alert" className="rounded-2xl bg-rose-50 p-4 text-rose-900">
          <p className="font-medium">Lo que escribiste me preocupa. Tu seguridad es lo primero.</p>
          <p className="mt-1">Contacta de inmediato a los servicios de emergencia de tu zona{emergencia ? ` (${emergencia})` : ""} o a una persona de confianza que esté contigo.</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {opciones.map((o) => (
          <button
            key={o.texto}
            type="button"
            disabled={cargando}
            onClick={() => enviar(o.prompt)}
            className="rounded-full border border-teal-300 bg-white px-4 py-2 text-sm text-teal-800 hover:bg-teal-50 disabled:opacity-50"
          >
            {o.texto}
          </button>
        ))}
      </div>

      <div className="flex min-h-72 flex-col gap-3 rounded-3xl bg-white/85 p-4 shadow-sm" aria-live="polite">
        {chat.length === 0 && <p className="m-auto text-center text-slate-500">🌤️ Escribe lo que sientes, sin filtros. Puedes empezar con una de las opciones de arriba.</p>}
        {chat.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2 shadow-sm ${m.rol === "usuario" ? "self-end bg-teal-600 text-white" : "self-start bg-teal-50 text-slate-800"}`}>
            {m.texto}
          </div>
        ))}
        {cargando && <p className="self-start animate-pulse text-sm text-slate-500">🤔 Pensando contigo…</p>}
        <div ref={fin} />
      </div>

      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-rose-800">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(entrada);
        }}
        className="flex gap-2"
      >
        <label htmlFor="mensaje" className="sr-only">Escribe tu mensaje</label>
        <textarea
          id="mensaje"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value.slice(0, 1500))}
          rows={2}
          placeholder="Cuéntame lo que sientes… 💭"
          className="min-w-0 flex-1 resize-none rounded-xl border border-teal-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
        />
        <Boton type="submit" disabled={cargando || !entrada.trim()}>Enviar</Boton>
      </form>

      <div className="flex justify-end">
        <button type="button" onClick={borrar} className="text-sm text-slate-600 underline hover:text-slate-900">
          Borrar conversación y empezar de nuevo
        </button>
      </div>
    </div>
  );
}
