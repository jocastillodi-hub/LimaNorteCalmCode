"use client";

import { useEffect, useState } from "react";
import { DIAS, dividirEnPasos, mensajeCarga, nivelCarga, pendientesDelDia, progreso, type Mision } from "@/lib/bitacora";
import { useSesion } from "@/lib/session";

const COLOR_CARGA = {
  libre: "bg-emerald-300",
  suave: "bg-amber-300",
  llena: "bg-rose-300",
} as const;

function generarId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Modal con el planificador semanal. Se cierra con Escape o con el botón.
export default function Bitacora({ abierta, onCerrar }: { abierta: boolean; onCerrar: () => void }) {
  const { misiones, setMisiones, guardarBitacora, setGuardarBitacora } = useSesion();
  const [expandida, setExpandida] = useState<string | null>(null);
  const [borradores, setBorradores] = useState<Record<number, string>>({});
  const [pasosTexto, setPasosTexto] = useState("");

  useEffect(() => {
    if (!abierta) return;
    function alTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") onCerrar();
    }
    window.addEventListener("keydown", alTeclar);
    return () => window.removeEventListener("keydown", alTeclar);
  }, [abierta, onCerrar]);

  if (!abierta) return null;

  const resumen = progreso(misiones);
  const burbujas = 10;
  const llenas = Math.round((resumen.porcentaje / 100) * burbujas);

  function agregar(dia: number) {
    const titulo = (borradores[dia] ?? "").trim();
    if (!titulo) return;
    const nueva: Mision = { id: generarId(), titulo: titulo.slice(0, 120), dia, hecha: false, pasos: [] };
    setMisiones((prev) => [...prev, nueva]);
    setBorradores((b) => ({ ...b, [dia]: "" }));
  }

  function alternar(id: string) {
    setMisiones((prev) => prev.map((m) => (m.id === id ? { ...m, hecha: !m.hecha } : m)));
  }

  function moverAManana(id: string) {
    setMisiones((prev) => prev.map((m) => (m.id === id && m.dia < 7 ? { ...m, dia: m.dia + 1 } : m)));
  }

  function eliminar(id: string) {
    setMisiones((prev) => prev.filter((m) => m.id !== id));
  }

  function dividir(mision: Mision) {
    const pasos = dividirEnPasos(pasosTexto, generarId);
    if (pasos.length === 0) return;
    setMisiones((prev) => prev.map((m) => (m.id === mision.id ? { ...m, pasos: [...m.pasos, ...pasos].slice(0, 6) } : m)));
    setPasosTexto("");
  }

  function alternarPaso(misionId: string, pasoId: string) {
    setMisiones((prev) =>
      prev.map((m) =>
        m.id === misionId ? { ...m, pasos: m.pasos.map((p) => (p.id === pasoId ? { ...p, hecha: !p.hecha } : p)) } : m,
      ),
    );
  }

  function borrarTodo() {
    if (!window.confirm("¿Borrar toda la bitácora? No se puede deshacer.")) return;
    setMisiones([]);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-sky-950/40 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div role="dialog" aria-modal="true" aria-labelledby="titulo-bitacora" className="entrada flex max-h-[92dvh] w-full max-w-6xl flex-col gap-5 overflow-y-auto rounded-t-[2.5rem] bg-sky-50 p-5 shadow-2xl sm:rounded-[2.5rem] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="titulo-bitacora" className="text-2xl font-extrabold text-sky-900">📜 Bitácora de la semana</h2>
            <p className="text-sm text-slate-600">Un paso a la vez. Nada aquí es una obligación.</p>
          </div>
          <button type="button" onClick={onCerrar} className="rounded-2xl border-b-4 border-slate-300 bg-white px-3 py-1 font-bold text-slate-700">Cerrar</button>
        </div>

        <div className="flex flex-wrap items-center gap-4 rounded-3xl bg-white/80 p-4">
          <div className="flex gap-1" aria-hidden="true">
            {Array.from({ length: burbujas }, (_, i) => (
              <span
                key={i}
                className={`h-5 w-5 rounded-full border-2 transition-all duration-700 ${i < llenas ? "border-sky-400 bg-sky-300 shadow-inner" : "border-sky-200 bg-white"}`}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-700" aria-live="polite">
            {resumen.total === 0 ? "Agrega tu primera misión 🐚" : `${resumen.hechas} de ${resumen.total} listas (${resumen.porcentaje}%)`}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DIAS.map((nombre, i) => {
            const dia = i + 1;
            const pendientes = pendientesDelDia(misiones, dia);
            const nivel = nivelCarga(pendientes);
            const aviso = mensajeCarga(nivel, nombre);
            const delDia = misiones.filter((m) => m.dia === dia);
            return (
              <section
                key={dia}
                aria-label={nombre}
                className="esponja flex flex-col gap-3 rounded-3xl border-2 border-b-4 border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 p-4 shadow-sm"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="font-extrabold text-amber-950">{nombre}</h3>
                  <span className="text-xs font-semibold text-amber-900/70">{pendientes} pendiente(s)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/70" role="img" aria-label={`Carga del día: ${nivel}`}>
                  <div className={`h-full rounded-full transition-all duration-700 ${COLOR_CARGA[nivel]}`} style={{ width: `${Math.min(100, (pendientes / 5) * 100)}%` }} />
                </div>
                {aviso && <p role="status" className="rounded-2xl bg-white/80 px-3 py-2 text-xs text-amber-900">{aviso}</p>}

                <ul className="flex flex-col gap-2">
                  {delDia.map((m) => (
                    <li key={m.id} className="rounded-2xl bg-white p-3 shadow-sm">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={m.hecha} onChange={() => alternar(m.id)} aria-label={`Lista: ${m.titulo}`} className="h-5 w-5 shrink-0 accent-sky-600" />
                        <span className={`min-w-0 flex-1 text-sm font-semibold ${m.hecha ? "text-slate-400 line-through" : "text-slate-800"}`}>{m.titulo}</span>
                        <button type="button" onClick={() => setExpandida(expandida === m.id ? null : m.id)} className="text-xs font-bold text-sky-700" aria-expanded={expandida === m.id}>🐌 Pasos</button>
                      </div>

                      {expandida === m.id && (
                        <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                          {m.pasos.length > 0 && (
                            <p className="text-xs text-slate-500">{m.pasos.filter((p) => p.hecha).length} de {m.pasos.length} pasos</p>
                          )}
                          <ul className="flex flex-col gap-1">
                            {m.pasos.map((p) => (
                              <li key={p.id} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" checked={p.hecha} onChange={() => alternarPaso(m.id, p.id)} aria-label={`Paso: ${p.texto}`} className="h-4 w-4 accent-sky-600" />
                                <span className={p.hecha ? "text-slate-400 line-through" : "text-slate-700"}>{p.texto}</span>
                              </li>
                            ))}
                          </ul>
                          {m.pasos.length < 6 && (
                            <div className="flex gap-2">
                              <input
                                value={pasosTexto}
                                onChange={(e) => setPasosTexto(e.target.value)}
                                placeholder="abrir, escribir, revisar"
                                aria-label="Pasos separados por comas"
                                className="min-w-0 flex-1 rounded-xl border-2 border-slate-200 px-2 py-1 text-xs"
                              />
                              <button type="button" onClick={() => dividir(m)} className="rounded-xl bg-sky-500 px-2 py-1 text-xs font-bold text-white">Dividir</button>
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <button type="button" onClick={() => moverAManana(m.id)} disabled={m.dia === 7} className="font-bold text-sky-700 disabled:opacity-40">→ Mañana</button>
                            <button type="button" onClick={() => eliminar(m.id)} className="font-bold text-rose-700">Quitar</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    agregar(dia);
                  }}
                  className="mt-auto flex gap-2"
                >
                  <label htmlFor={`mision-${dia}`} className="sr-only">Nueva misión para {nombre}</label>
                  <input
                    id={`mision-${dia}`}
                    value={borradores[dia] ?? ""}
                    onChange={(e) => setBorradores((b) => ({ ...b, [dia]: e.target.value }))}
                    maxLength={120}
                    placeholder="+ Nueva misión"
                    className="min-w-0 flex-1 rounded-xl border-2 border-white bg-white/80 px-3 py-2 text-sm outline-none focus:border-sky-300"
                  />
                </form>
              </section>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/80 p-4 text-sm">
          <label className="flex items-center gap-2 text-slate-700">
            <input type="checkbox" checked={guardarBitacora} onChange={(e) => setGuardarBitacora(e.target.checked)} className="h-4 w-4 accent-sky-600" />
            Guardar en este navegador (apagado: se pierde al recargar)
          </label>
          <button type="button" onClick={borrarTodo} disabled={misiones.length === 0} className="font-bold text-rose-700 disabled:opacity-40">Borrar toda la bitácora</button>
        </div>
      </div>
    </div>
  );
}
