"use client";

import { useEffect, useState } from "react";
import {
  ARCHIVO_DEMO,
  COMPAÑEROS_DEMO,
  ETIQUETAS_ESTADO,
  ETIQUETAS_TIPO,
  filtrarArchivo,
  ordenarArchivo,
  type MaterialArchivo,
  type TipoMaterial,
} from "@/lib/laboratorio";
import { useSesion } from "@/lib/session";

// Entorno de resolución: archivo vivo (izquierda), tu mesa (centro) y pulso en vivo (derecha).
// Todo el contenido de archivo y presencia es de demostración.
export default function Laboratorio() {
  const { laboratorioId, setLaboratorioId, misiones, setMisiones, setBitacoraAbierta } = useSesion();
  const mision = misiones.find((m) => m.id === laboratorioId) ?? null;
  const [filtro, setFiltro] = useState<TipoMaterial | "todos">("todos");
  const [seleccion, setSeleccion] = useState<MaterialArchivo | null>(null);
  const [pidiendoAyuda, setPidiendoAyuda] = useState(false);

  useEffect(() => {
    if (!mision) return;
    function alTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") setLaboratorioId(null);
    }
    window.addEventListener("keydown", alTeclar);
    return () => window.removeEventListener("keydown", alTeclar);
  }, [mision, setLaboratorioId]);

  if (!mision) return null;

  const archivo = ordenarArchivo(filtrarArchivo(ARCHIVO_DEMO, filtro));
  const notas = mision.notas ?? "";

  function escribirNotas(texto: string) {
    setMisiones((prev) => prev.map((m) => (m.id === mision!.id ? { ...m, notas: texto.slice(0, 2000) } : m)));
  }

  function usarComoBase(material: MaterialArchivo) {
    const base = `Base: ${material.titulo}. ${material.resumen}`;
    escribirNotas(notas ? `${notas}\n\n${base}` : base);
  }

  function alternarHecha() {
    setMisiones((prev) => prev.map((m) => (m.id === mision!.id ? { ...m, hecha: !m.hecha } : m)));
  }

  function volverABitacora() {
    setLaboratorioId(null);
    setBitacoraAbierta(true);
  }

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-gradient-to-b from-amber-50 via-rose-50 to-sky-100" role="dialog" aria-modal="true" aria-labelledby="titulo-lab">
      <div className="abrir-laboratorio mx-auto flex min-h-dvh max-w-7xl flex-col gap-4 p-4 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-700">Entorno de resolución</p>
            <h2 id="titulo-lab" className="text-2xl font-extrabold text-violet-950">🧪 El Laboratorio</h2>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={volverABitacora} className="rounded-2xl border-b-4 border-slate-300 bg-white px-4 py-2 font-bold text-slate-700">← Bitácora</button>
            <button type="button" onClick={() => setLaboratorioId(null)} className="rounded-2xl border-b-4 border-slate-300 bg-white px-4 py-2 font-bold text-slate-700">Salir</button>
          </div>
        </header>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1fr_1.2fr_0.9fr]">
          {/* Archivo vivo */}
          <section aria-labelledby="archivo-vivo" className="flex flex-col gap-3 rounded-[2rem] bg-white/80 p-4 shadow-sm">
            <h3 id="archivo-vivo" className="font-extrabold text-slate-800">📚 Archivo vivo</h3>
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">Demostración: material de ejemplo, no trabajos reales.</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
              {(["todos", "plantilla", "apuntes", "guia"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFiltro(t)}
                  aria-pressed={filtro === t}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${filtro === t ? "bg-violet-500 text-white" : "bg-white text-slate-600 hover:bg-violet-50"}`}
                >
                  {t === "todos" ? "Todos" : ETIQUETAS_TIPO[t]}
                </button>
              ))}
            </div>
            <ul className="flex flex-col gap-2">
              {archivo.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSeleccion(m)}
                    className={`w-full rounded-2xl p-3 text-left transition hover:-translate-y-0.5 ${seleccion?.id === m.id ? "bg-violet-100 ring-2 ring-violet-300" : "bg-white hover:shadow"}`}
                  >
                    <p className="text-xs font-semibold text-violet-700">{ETIQUETAS_TIPO[m.tipo]} · {m.año}</p>
                    <p className="font-bold text-slate-800">{m.titulo}</p>
                    <div className="mt-2 flex items-center gap-1" aria-label={`${m.usos} usos`}>
                      {Array.from({ length: Math.min(8, Math.ceil(m.usos / 5)) }, (_, i) => (
                        <span key={i} className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                      ))}
                      <span className="ml-1 text-xs text-slate-500">{m.usos} usos</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {seleccion && (
              <div className="rounded-2xl bg-violet-50 p-4">
                <p className="text-sm text-slate-700">{seleccion.resumen}</p>
                <p className="mt-1 text-xs text-slate-500">Por {seleccion.autor}</p>
                <button type="button" onClick={() => usarComoBase(seleccion)} className="mt-3 rounded-xl border-b-4 border-violet-600 bg-violet-400 px-3 py-2 text-sm font-bold text-white hover:bg-violet-500">
                  Usar como base en mi mesa
                </button>
              </div>
            )}
          </section>

          {/* Tu mesa */}
          <section aria-labelledby="mesa" className="flex flex-col gap-3 rounded-[2rem] bg-white p-5 shadow-md">
            <h3 id="mesa" className="font-extrabold text-slate-800">🔬 Tu mesa</h3>
            <p className="text-lg font-bold text-slate-900">{mision.titulo}</p>
            <label htmlFor="notas-mesa" className="sr-only">Notas de tu resolución</label>
            <textarea
              id="notas-mesa"
              value={notas}
              onChange={(e) => escribirNotas(e.target.value)}
              placeholder="Aquí resuelves. Escribe tus pasos, dudas y resultados…"
              className="min-h-72 flex-1 resize-none rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50/60 p-4 leading-relaxed text-slate-800 outline-none focus:border-violet-300"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-500">{notas.length}/2000 · se guarda con la bitácora</p>
              <button type="button" onClick={alternarHecha} className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600">
                {mision.hecha ? "Reabrir" : "Marcar como lista ✓"}
              </button>
            </div>
          </section>

          {/* Pulso en vivo */}
          <section aria-labelledby="pulso" className="flex flex-col gap-3 rounded-[2rem] bg-white/80 p-4 shadow-sm">
            <h3 id="pulso" className="font-extrabold text-slate-800">📡 Pulso en vivo</h3>
            <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">Demostración: presencia simulada.</p>
            <p className="text-sm text-slate-700" aria-live="polite">
              <span className="pulso-vivo mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              {COMPAÑEROS_DEMO.length} personas trabajan en algo parecido ahora
            </p>
            <ul className="flex flex-col gap-2">
              {COMPAÑEROS_DEMO.map((c, i) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                  <span className={`pulso-respira flex h-10 w-10 items-center justify-center rounded-full ${c.color} font-extrabold text-white`} style={{ animationDelay: `${i * 0.6}s` }} aria-hidden="true">
                    {c.alias[0]}
                  </span>
                  <div>
                    <p className="font-bold text-slate-800">{c.alias}</p>
                    <p className="text-xs text-slate-500">{ETIQUETAS_ESTADO[c.estado]}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setPidiendoAyuda((v) => !v)}
              aria-pressed={pidiendoAyuda}
              className={`mt-auto rounded-2xl border-b-4 px-4 py-3 font-bold transition ${pidiendoAyuda ? "border-emerald-700 bg-emerald-400 text-white" : "border-slate-300 bg-white text-slate-700"}`}
            >
              {pidiendoAyuda ? "🙋 Buscando una mano…" : "🙋 Busco una mano"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
