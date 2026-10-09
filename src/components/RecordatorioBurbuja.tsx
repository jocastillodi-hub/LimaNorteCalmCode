"use client";

import { useEffect, useState } from "react";
import { misionesPorRecordar } from "@/lib/bitacora";
import { useSesion } from "@/lib/session";

const MINUTOS_OCULTO = 30;

// Burbuja discreta que avisa cuando una misión vence pronto. Al tocarla abre la Bitácora.
export default function RecordatorioBurbuja() {
  const { misiones, setBitacoraAbierta } = useSesion();
  const [ahora, setAhora] = useState(() => new Date());
  const [ocultoHasta, setOcultoHasta] = useState(0);

  // Revisa cada minuto; no hace falta más precisión para un aviso suave.
  useEffect(() => {
    const id = setInterval(() => setAhora(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const proximas = misionesPorRecordar(misiones, ahora);
  if (proximas.length === 0 || Date.now() < ocultoHasta) return null;

  return (
    <div className="entrada fixed right-4 top-24 z-40 flex max-w-[16rem] items-center gap-2 rounded-full bg-white/95 py-2 pl-4 pr-2 text-sm font-semibold text-sky-900 shadow-lg ring-2 ring-sky-100">
      <button type="button" onClick={() => setBitacoraAbierta(true)} className="text-left">
        🐚 ¡Psst! Una de tus misiones te espera pronto
      </button>
      <button
        type="button"
        onClick={() => setOcultoHasta(Date.now() + MINUTOS_OCULTO * 60_000)}
        aria-label="Ocultar el aviso por un rato"
        className="rounded-full px-2 text-slate-500 hover:bg-slate-100"
      >
        ✕
      </button>
    </div>
  );
}
