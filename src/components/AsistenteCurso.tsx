"use client";

import { useState } from "react";

type Mensaje = { rol: "usuario" | "asistente"; texto: string };

// Asistente virtual de un curso ficticio. Orienta el estudio; no entrega respuestas de exámenes.
export default function AsistenteCurso({ curso }: { curso: string }) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [demo, setDemo] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const texto = entrada.trim();
    if (!texto || cargando) return;
    const nuevo: Mensaje[] = [...mensajes, { rol: "usuario", texto }];
    setMensajes(nuevo);
    setEntrada("");
    setError("");
    setCargando(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevo, curso }),
      });
      const datos = (await r.json()) as { respuesta?: string; demo?: boolean; error?: string };
      if (!r.ok || !datos.respuesta) {
        setError(datos.error ?? "No pudimos responder. Inténtalo de nuevo.");
        return;
      }
      setDemo(Boolean(datos.demo));
      setMensajes([...nuevo, { rol: "asistente", texto: datos.respuesta }]);
    } catch {
      setError("Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-600">Pregunta sobre el curso. Te guío con pistas y pasos; no te doy respuestas de exámenes.</p>
      {demo && <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">Modo demostrativo: sin IA externa conectada.</p>}
      <div className="flex max-h-72 min-h-40 flex-col gap-2 overflow-y-auto rounded-2xl bg-white p-3" aria-live="polite">
        {mensajes.length === 0 && <p className="m-auto text-center text-sm text-slate-500">🐚 ¿Qué concepto quieres repasar?</p>}
        {mensajes.map((m, i) => (
          <div key={i} className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm ${m.rol === "usuario" ? "self-end bg-sky-500 text-white" : "self-start bg-sky-50 text-slate-800"}`}>
            {m.texto}
          </div>
        ))}
        {cargando && <p className="animate-pulse text-sm text-slate-500">Pensando contigo…</p>}
      </div>
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      <form onSubmit={enviar} className="flex gap-2">
        <label htmlFor="pregunta-curso" className="sr-only">Tu pregunta sobre el curso</label>
        <input id="pregunta-curso" value={entrada} onChange={(e) => setEntrada(e.target.value)} maxLength={1500} placeholder="Escribe tu pregunta…" className="min-w-0 flex-1 rounded-2xl border-2 border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-400" />
        <button type="submit" disabled={cargando || !entrada.trim()} className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Enviar</button>
      </form>
    </div>
  );
}
