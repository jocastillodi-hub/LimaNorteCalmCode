"use client";

import { useState } from "react";
import Tarjeta from "@/components/Tarjeta";
import { buscarMateria, MATERIAS, validarIdea, type Idea, type Materia } from "@/lib/red";

type Propia = Idea & { ocultaReporte?: boolean };

export default function Red() {
  const [consulta, setConsulta] = useState("");
  const [buscada, setBuscada] = useState<string | null>(null);
  const [materia, setMateria] = useState<Materia | null>(null);
  const [ideasExtra, setIdeasExtra] = useState<Record<string, Propia[]>>({});
  const [utiles, setUtiles] = useState<Record<string, number>>({});
  const [ocultas, setOcultas] = useState<Record<string, true>>({});
  const [borrador, setBorrador] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  function buscar(e: React.FormEvent) {
    e.preventDefault();
    const m = buscarMateria(consulta);
    setBuscada(consulta.trim());
    setMateria(m);
    setBorrador("");
    setError("");
    setAviso("");
  }

  function publicar(e: React.FormEvent) {
    e.preventDefault();
    if (!materia) return;
    const r = validarIdea(borrador);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const nueva: Propia = {
      id: `propia-${Date.now()}`,
      autor: "Tú",
      texto: r.valor,
      utiles: 0,
      demo: false,
    };
    setIdeasExtra((prev) => ({ ...prev, [materia.clave]: [nueva, ...(prev[materia.clave] ?? [])] }));
    setBorrador("");
    setError("");
    setAviso("Tu idea quedó publicada solo en esta pantalla. Cuando haya cuentas, la verán tus compañeros.");
  }

  const ideas = materia ? [...(ideasExtra[materia.clave] ?? []), ...materia.ideas] : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-sky-900">🌐 Red de materias</h1>
        <p className="mt-2 text-slate-600">Busca una materia: te mostramos ideas clave y lo que otros han compartido.</p>
      </div>

      <form onSubmit={buscar} role="search" className="flex gap-2">
        <label htmlFor="materia" className="sr-only">Buscar materia</label>
        <input
          id="materia"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Ej.: Estadística, Programación, Psicología"
          maxLength={60}
          className="min-w-0 flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
        />
        <button type="submit" className="rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 font-bold text-white hover:bg-sky-600">Buscar</button>
      </form>

      <p className="rounded-xl bg-amber-50 px-4 py-2 text-xs text-amber-900">
        Demostración: las ideas de ejemplo no son de estudiantes reales. Lo que publiques solo se ve en tu pantalla.
      </p>

      {buscada !== null && !materia && (
        <Tarjeta>
          <p className="text-slate-700">
            Todavía no tenemos &quot;{buscada}&quot;. Prueba con: {MATERIAS.map((m) => m.nombre).join(", ")}.
          </p>
        </Tarjeta>
      )}

      {materia && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Tarjeta titulo={`📘 ${materia.nombre}: ideas clave`}>
            <ul className="flex flex-col gap-3">
              {materia.info.map((t) => (
                <li key={t} className="rounded-2xl bg-sky-50 px-4 py-3 text-slate-700">{t}</li>
              ))}
            </ul>
          </Tarjeta>

          <Tarjeta titulo="💬 Lo que otros han visto">
            <form onSubmit={publicar} className="mb-4 flex flex-col gap-2" noValidate>
              <label htmlFor="idea" className="text-sm font-semibold text-slate-700">Comparte tu idea (método o pista, sin respuestas de exámenes)</label>
              <textarea
                id="idea"
                value={borrador}
                onChange={(e) => setBorrador(e.target.value)}
                maxLength={300}
                rows={3}
                className="rounded-2xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
              />
              {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
              {aviso && <p role="status" className="text-sm text-emerald-800">{aviso}</p>}
              <button type="submit" className="self-start rounded-2xl border-b-4 border-emerald-700 bg-emerald-400 px-4 py-2 font-bold text-white hover:bg-emerald-500">Compartir idea</button>
            </form>

            <ul className="flex flex-col gap-3">
              {ideas.filter((i) => !ocultas[i.id]).map((i) => (
                <li key={i.id} className="rounded-2xl border-2 border-slate-200 bg-white p-4">
                  <p className="text-slate-800">{i.texto}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{i.autor}{i.demo && " · demostración"}</span>
                    <button type="button" onClick={() => setUtiles((u) => ({ ...u, [i.id]: 1 }))} disabled={!!utiles[i.id]} className="font-bold text-sky-700 disabled:opacity-60">
                      👍 Útil ({i.utiles + (utiles[i.id] ?? 0)})
                    </button>
                    <button type="button" onClick={() => setOcultas((o) => ({ ...o, [i.id]: true }))} className="text-slate-500 underline">Ocultar en mi pantalla</button>
                  </div>
                </li>
              ))}
            </ul>
          </Tarjeta>
        </div>
      )}
    </div>
  );
}
