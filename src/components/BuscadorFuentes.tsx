"use client";

import { useState, type FormEvent } from "react";

const BUSCADOR = "https://scholar.google.com/scholar";

// Buscador directo: no genera respuestas. Abre Google Académico en una pestaña nueva.
export default function BuscadorFuentes() {
  const [consulta, setConsulta] = useState("");
  const [aviso, setAviso] = useState("");

  function buscar(e: FormEvent) {
    e.preventDefault();
    const texto = consulta.trim();
    if (!texto) {
      setAviso("Escribe un concepto o una duda para buscar.");
      return;
    }
    setAviso("");
    window.open(`${BUSCADOR}?q=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={buscar} className="flex flex-col gap-3" noValidate>
      <p className="text-sm text-slate-600">
        Escribe un concepto o una duda del curso. Tu búsqueda se abre en Google Académico, en una pestaña nueva.
      </p>
      <label htmlFor="consulta-academica" className="sr-only">Concepto o duda del curso</label>
      <input
        id="consulta-academica"
        type="text"
        value={consulta}
        onChange={(e) => {
          setConsulta(e.target.value);
          if (aviso) setAviso("");
        }}
        maxLength={300}
        placeholder="Ej.: probabilidad condicional"
        className="min-w-0 rounded-2xl border-2 border-slate-200 px-4 py-3 text-base outline-none focus:border-sky-400"
      />
      {aviso && <p role="alert" className="text-sm text-rose-700">{aviso}</p>}
      <button
        type="submit"
        className="self-start rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-sky-600 active:translate-y-1 active:border-b-0"
      >
        🔍 Buscar en fuentes seguras
      </button>
    </form>
  );
}
