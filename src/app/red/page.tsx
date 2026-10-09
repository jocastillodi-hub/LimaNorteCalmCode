"use client";

import { useState } from "react";
import Tarjeta from "@/components/Tarjeta";
import { filtrarCursos, validarIdea, type Curso, type Idea } from "@/lib/red";

type Propia = Idea;

export default function Red() {
  const [consulta, setConsulta] = useState("");
  const [abierto, setAbierto] = useState<Curso | null>(null);
  const [ideasPropias, setIdeasPropias] = useState<Record<string, Propia[]>>({});
  const [utiles, setUtiles] = useState<Record<string, number>>({});
  const [ocultas, setOcultas] = useState<Record<string, true>>({});
  const [borrador, setBorrador] = useState("");
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const resultados = filtrarCursos(consulta);

  function publicar(e: React.FormEvent) {
    e.preventDefault();
    if (!abierto) return;
    const r = validarIdea(borrador);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const nueva: Propia = { id: `propia-${Date.now()}`, autor: "Tú", texto: r.valor, utiles: 0, demo: false };
    setIdeasPropias((prev) => ({ ...prev, [abierto.clave]: [nueva, ...(prev[abierto.clave] ?? [])] }));
    setBorrador("");
    setError("");
    setAviso("Tu idea quedó solo en esta pantalla. Cuando haya cuentas, la verán tus compañeros.");
  }

  if (abierto) {
    const ideas = [...(ideasPropias[abierto.clave] ?? []), ...abierto.ideas];
    return (
      <div className="flex flex-col gap-6">
        <button type="button" onClick={() => { setAbierto(null); setAviso(""); setError(""); }} className="self-start rounded-2xl border-b-4 border-slate-300 bg-white px-4 py-2 font-bold text-slate-700">← Volver al catálogo</button>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-700">{abierto.area} · curso ficticio</p>
          <h1 className="text-3xl font-extrabold text-sky-900">{abierto.nombre}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Tarjeta titulo="📘 Ideas educativas">
            <ul className="flex flex-col gap-3">
              {abierto.info.map((t) => <li key={t} className="rounded-2xl bg-sky-50 px-4 py-3 text-slate-700">{t}</li>)}
            </ul>
          </Tarjeta>

          <Tarjeta titulo="💬 Lo que otros han compartido">
            <form onSubmit={publicar} className="mb-4 flex flex-col gap-2" noValidate>
              <label htmlFor="idea" className="text-sm font-semibold text-slate-700">Comparte tu método o una pista (sin respuestas de exámenes)</label>
              <textarea id="idea" value={borrador} onChange={(e) => setBorrador(e.target.value)} maxLength={300} rows={3} className="rounded-2xl border-2 border-slate-200 px-4 py-3 outline-none focus:border-sky-400" />
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-sky-900">🌐 Red de materias</h1>
        <p className="mt-2 text-slate-600">Explora cursos y mira qué ideas han compartido otros estudiantes.</p>
      </div>

      <p className="rounded-xl bg-amber-50 px-4 py-2 text-center text-xs text-amber-900">
        Demostración: todos los cursos son ficticios y el contenido es de ejemplo.
      </p>

      <div>
        <label htmlFor="buscar-curso" className="sr-only">Buscar curso</label>
        <input
          id="buscar-curso"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Busca por nombre, área o palabra clave"
          maxLength={60}
          className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-400"
        />
      </div>

      {resultados.length === 0 ? (
        <Tarjeta><p className="text-slate-700">No encontramos cursos con &quot;{consulta}&quot;. Prueba con otra palabra.</p></Tarjeta>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultados.map((c) => (
            <li key={c.clave}>
              <button type="button" onClick={() => setAbierto(c)} className="esponja flex h-full w-full flex-col gap-2 rounded-3xl border-2 border-b-4 border-sky-200 bg-white p-5 text-left shadow-sm hover:bg-sky-50">
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700">{c.area}</span>
                <span className="text-lg font-extrabold text-slate-800">{c.nombre}</span>
                <span className="mt-auto text-sm text-slate-500">{c.info.length} ideas educativas</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-xs text-slate-500">
        Los cursos están inventados. Todo el material es educativo y general.
      </p>
    </div>
  );
}
