"use client";

import Link from "next/link";
import { useState } from "react";
import { apoyoUCV, emergencia } from "@/lib/config";

const MENSAJE_CONTACTO = "No estoy bien. ¿Puedes venir o llamarme?";

// Botón flotante de apoyo inmediato. No guarda datos: todo vive en el estado de la página.
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
          aria-modal="false"
          aria-labelledby="titulo-sos"
          className="panel fixed bottom-24 right-4 z-50 max-h-[70dvh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-3xl border border-orange-200 bg-white p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id="titulo-sos" className="text-lg font-bold text-orange-700">🌬️ Estoy aquí contigo</h2>
            <button type="button" onClick={cerrar} aria-label="Cerrar" className="rounded-full px-2 text-slate-500 hover:bg-slate-100">✕</button>
          </div>

          {/* 1. Pregunta de seguridad primero */}
          {peligro === null && (
            <div className="mt-4">
              <p className="font-medium text-slate-800">¿Estás en peligro ahora mismo?</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setPeligro(true)} className="rounded-xl bg-rose-600 px-3 py-3 font-bold text-white hover:bg-rose-700">Sí</button>
                <button type="button" onClick={() => setPeligro(false)} className="rounded-xl bg-slate-100 px-3 py-3 font-medium text-slate-800 hover:bg-slate-200">No</button>
              </div>
            </div>
          )}

          {peligro === true && (
            <div role="alert" className="mt-4 rounded-2xl bg-rose-600 p-4 text-white">
              <p className="text-lg font-bold">Busca ayuda inmediata</p>
              <p className="mt-2">
                {emergencia ? (
                  <>Llama a emergencias: <strong>{emergencia}</strong></>
                ) : (
                  "Llama a los servicios de emergencia de tu país ahora mismo."
                )}
              </p>
              <p className="mt-2 text-sm">Aléjate de cualquier cosa con la que podrías hacerte daño y ve a un lugar con gente.</p>
            </div>
          )}

          {peligro !== null && (
            <>
              {/* 2. Calma en tres pasos */}
              <section className="mt-4">
                <h3 className="font-semibold text-slate-800">Calma en tres pasos</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
                  <li>Pon los pies firmes en el suelo.</li>
                  <li>Exhala más largo que inhalas. No aguantes el aire.</li>
                  <li>Nombra 5 cosas que ves a tu alrededor.</li>
                </ol>
                <p className="mt-2 text-sm text-slate-600">💧 Si puedes, pon agua fría en la cara o en las muñecas.</p>
              </section>

              {/* 3. Contactos */}
              <section className="mt-4 space-y-3">
                <h3 className="font-semibold text-slate-800">A quién contactar</h3>
                {emergencia && peligro === false && (
                  <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-900">
                    🚨 Emergencias: <strong>{emergencia}</strong>
                  </p>
                )}
                <div className="rounded-xl bg-teal-50 p-3">
                  <p className="text-sm text-teal-900">💬 Persona de confianza</p>
                  <p className="mt-1 text-sm italic text-slate-700">“{MENSAJE_CONTACTO}”</p>
                  <button type="button" onClick={copiarMensaje} className="mt-2 rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700">
                    Copiar mensaje
                  </button>
                  {copiado === "ok" && <span role="status" className="ml-2 text-sm text-teal-800">¡Copiado!</span>}
                  {copiado === "error" && <span role="status" className="ml-2 text-sm text-rose-700">No se pudo copiar. Escríbelo tú.</span>}
                </div>
                {apoyoUCV.url ? (
                  <Link href="/apoyo" className="block rounded-xl bg-white px-4 py-2 text-center font-medium text-teal-800 ring-1 ring-teal-200 hover:bg-teal-50">
                    Apoyo psicológico UCV
                  </Link>
                ) : (
                  <p className="text-sm text-slate-500">El apoyo psicológico UCV se añadirá cuando el canal oficial esté verificado.</p>
                )}
              </section>

              {/* 4. Recordatorio */}
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                Esta pausa pasa. No tienes que resolver todo ahora. Esta herramienta es automatizada y no reemplaza a una persona ni a un servicio de emergencia.
              </p>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        aria-expanded={abierto}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-3 font-bold text-white shadow-2xl ring-4 ring-white/50 transition hover:scale-105 active:scale-95"
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
