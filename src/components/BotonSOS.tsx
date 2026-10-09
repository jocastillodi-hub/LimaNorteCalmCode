"use client";

import Link from "next/link";
import { useState } from "react";
import { apoyoUCV, emergencia } from "@/lib/config";

const MENSAJE_CONTACTO = "No estoy bien. ¿Puedes venir o llamarme?";

// Botón flotante de apoyo inmediato. No guarda datos.
export default function BotonSOS() {
  const [abierto, setAbierto] = useState(false);
  const [peligro, setPeligro] = useState<boolean | null>(null);
  const [copiado, setCopiado] = useState<"ok" | "error" | null>(null);

  function cerrar() {
    setAbierto(false);
    setPeligro(null);
    setCopiado(null);
  }

  async function copiarMensaje() {
    try {
      await navigator.clipboard.writeText(MENSAJE_CONTACTO);
      setCopiado("ok");
    } catch {
      setCopiado("error");
    }
  }

  return (
    <>
      {abierto && (
        <div
          role="dialog"
          aria-labelledby="titulo-sos"
          className="panel fixed bottom-28 right-4 z-50 max-h-[70dvh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border-2 border-b-4 border-orange-200 bg-white p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id="titulo-sos" className="text-lg font-extrabold text-orange-700">🌬️ Estoy aquí contigo</h2>
            <button type="button" onClick={cerrar} aria-label="Cerrar" className="rounded-full px-2 text-slate-500 hover:bg-slate-100">✕</button>
          </div>

          {peligro === null && (
            <div className="mt-4">
              <p className="font-medium text-slate-800">¿Estás en peligro ahora mismo?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPeligro(true)} className="rounded-2xl border-b-4 border-red-700 bg-red-500 px-3 py-3 font-bold text-white hover:bg-red-600">Sí</button>
                <button type="button" onClick={() => setPeligro(false)} className="rounded-2xl border-b-4 border-slate-300 bg-slate-100 px-3 py-3 font-medium text-slate-800 hover:bg-slate-200">No</button>
              </div>
            </div>
          )}

          {peligro === true && (
            <div role="alert" className="mt-4 rounded-2xl bg-red-500 p-4 text-white">
              <p className="text-lg font-bold">Busca ayuda inmediata</p>
              <p className="mt-2 text-sm">Aléjate de cualquier cosa con la que podrías hacerte daño y ve a un lugar con gente.</p>
              <a href={`tel:${emergencia.numero}`} className="mt-3 block rounded-xl bg-white px-4 py-2 text-center font-bold text-red-600">
                📞 Llamar al {emergencia.numero}
              </a>
            </div>
          )}

          {peligro !== null && (
            <>
              <section className="mt-4">
                <h3 className="font-semibold text-slate-800">Calma en tres pasos</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
                  <li>Pon los pies firmes en el suelo.</li>
                  <li>Exhala más largo que inhalas. No aguantes el aire.</li>
                  <li>Nombra 5 cosas que ves a tu alrededor.</li>
                </ol>
                <Link href="/pausa" onClick={cerrar} className="mt-3 block rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 text-center font-bold text-white hover:bg-sky-600">
                  🫧 Respirar conmigo
                </Link>
              </section>

              <section className="mt-4 space-y-3">
                <h3 className="font-semibold text-slate-800">A quién contactar</h3>
                {peligro === false && (
                  <a href={`tel:${emergencia.numero}`} className="block rounded-2xl border-b-4 border-red-700 bg-red-500 px-4 py-2 text-center font-bold text-white hover:bg-red-600">
                    📞 Llamar al {emergencia.numero}
                  </a>
                )}
                <div className="rounded-2xl border-2 border-teal-100 bg-teal-50 p-3">
                  <p className="text-sm font-semibold text-teal-900">💬 Persona de confianza</p>
                  <p className="mt-1 text-sm italic text-slate-700">“{MENSAJE_CONTACTO}”</p>
                  <button type="button" onClick={copiarMensaje} className="mt-2 rounded-xl border-b-4 border-teal-700 bg-teal-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-teal-700">
                    Copiar mensaje
                  </button>
                  {copiado === "ok" && <span role="status" className="ml-2 text-sm text-teal-800">¡Copiado!</span>}
                  {copiado === "error" && <span role="status" className="ml-2 text-sm text-rose-700">No se pudo copiar. Escríbelo tú.</span>}
                </div>
                <a
                  href={apoyoUCV.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 text-center font-bold text-white hover:bg-sky-600"
                >
                  {apoyoUCV.nombre}
                </a>
              </section>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        aria-expanded={abierto}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full border-b-4 border-rose-700 bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 font-extrabold text-white shadow-2xl ring-4 ring-white/50 transition hover:scale-105 active:translate-y-0.5"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M3 8h11a3 3 0 1 0-3-3" />
          <path d="M3 12h16a3 3 0 1 1-3 3" />
          <path d="M3 16h7" />
        </svg>
        Modo Pánico SOS
      </button>
    </>
  );
}
