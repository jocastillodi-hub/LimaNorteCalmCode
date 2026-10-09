"use client";

import Link from "next/link";
import { useState } from "react";
import { emergencia } from "@/lib/config";

// Botón flotante de apoyo inmediato. Abre un panel corto con pasos de calma
// y el contacto de emergencia. Está en la esquina, separado del contenido.
export default function BotonSOS() {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      {abierto && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="titulo-sos"
          className="panel fixed bottom-24 right-4 z-50 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-orange-200 bg-white p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-3">
            <h2 id="titulo-sos" className="text-lg font-bold text-orange-700">🌬️ Respira conmigo</h2>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="rounded-full px-2 text-slate-500 hover:bg-slate-100">✕</button>
          </div>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
            <li>Pon los pies firmes en el suelo.</li>
            <li>Exhala despacio, más largo que inhalas. Sin retener el aire.</li>
            <li>Nombra 5 cosas que ves a tu alrededor.</li>
          </ol>
          <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-900">
            <p className="font-medium">Si hay peligro ahora, busca ayuda inmediata.</p>
            <p className="mt-1">
              Contacta a los servicios de emergencia de tu zona{emergencia ? `: ${emergencia}` : ""} o a una persona cercana.
            </p>
          </div>
          <Link href="/apoyo" className="mt-4 block rounded-xl bg-teal-600 px-4 py-2 text-center font-medium text-white hover:bg-teal-700">
            Ver apoyo psicológico
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
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
