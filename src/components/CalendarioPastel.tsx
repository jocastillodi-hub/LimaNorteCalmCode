"use client";

import { useState } from "react";
import { aISO, desdeISO, MESES } from "@/lib/fechas";

const LETRAS = ["L", "M", "X", "J", "V", "S", "D"];

// Calendario redondeado y cálido para elegir una fecha exacta (día, mes y año).
export default function CalendarioPastel({ valor, onElegir }: { valor: string; onElegir: (iso: string) => void }) {
  const base = desdeISO(valor);
  const [mes, setMes] = useState(() => new Date(base.getFullYear(), base.getMonth(), 1));
  const hoy = aISO(new Date());

  const desplazamiento = (mes.getDay() + 6) % 7;
  const diasEnMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celdas: (string | null)[] = [
    ...Array.from({ length: desplazamiento }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => aISO(new Date(mes.getFullYear(), mes.getMonth(), i + 1))),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  return (
    <div className="rounded-[2rem] bg-gradient-to-b from-rose-50 via-amber-50 to-sky-50 p-4 shadow-inner ring-2 ring-amber-200">
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))} aria-label="Mes anterior" className="rounded-full bg-white px-3 py-1 font-bold text-amber-800 shadow-sm">‹</button>
        <p className="font-extrabold capitalize text-amber-950">🐚 {MESES[mes.getMonth()]} {mes.getFullYear()}</p>
        <button type="button" onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))} aria-label="Mes siguiente" className="rounded-full bg-white px-3 py-1 font-bold text-amber-800 shadow-sm">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-amber-900/70" aria-hidden="true">
        {LETRAS.map((l) => <span key={l}>{l}</span>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {celdas.map((iso, i) =>
          iso ? (
            <button
              key={iso}
              type="button"
              onClick={() => onElegir(iso)}
              aria-label={`Elegir ${iso}`}
              aria-pressed={iso === valor}
              className={`aspect-square rounded-full text-sm font-semibold transition hover:scale-110 ${
                iso === valor
                  ? "bg-sky-400 text-white shadow"
                  : iso === hoy
                    ? "bg-amber-200 text-amber-950 ring-2 ring-amber-400"
                    : "bg-white/80 text-slate-700 hover:bg-white"
              }`}
            >
              {desdeISO(iso).getDate()}
            </button>
          ) : (
            <span key={`vacio-${i}`} aria-hidden="true" />
          ),
        )}
      </div>
    </div>
  );
}
