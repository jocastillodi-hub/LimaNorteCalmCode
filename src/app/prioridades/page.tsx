"use client";

import { useState } from "react";
import Tarjeta from "@/components/Tarjeta";
import { accionInicial, recomendacion, tareasDemo, type Tarea } from "@/lib/prioridades";
import { useSesion } from "@/lib/session";

export default function Prioridades() {
  const { checkin } = useSesion();
  const tension = checkin?.tension ?? 3;
  const [minutos, setMinutos] = useState(60);
  const [tareas, setTareas] = useState<Tarea[]>(tareasDemo);
  const [nueva, setNueva] = useState<Record<"practicas" | "tesis", string>>({ practicas: "", tesis: "" });

  const principal = (area: "practicas" | "tesis") => tareas.find((t) => t.area === area);

  function agregar(area: "practicas" | "tesis") {
    const texto = nueva[area].trim();
    if (!texto) return;
    setTareas((prev) => [...prev, { id: `${area}-${Date.now()}`, area, texto: texto.slice(0, 120), demostrativa: false }]);
    setNueva((prev) => ({ ...prev, [area]: "" }));
  }

  function quitar(id: string) {
    setTareas((prev) => prev.filter((t) => t.id !== id));
  }

  const areas: { clave: "practicas" | "tesis"; titulo: string }[] = [
    { clave: "practicas", titulo: "Prácticas preprofesionales" },
    { clave: "tesis", titulo: "Tesis" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-teal-800">Prioridades académicas</h1>
        <p className="mt-2 text-slate-600">Solo una prioridad por área y un primer paso pequeño. Reducir la carga es el objetivo.</p>
      </div>

      <Tarjeta titulo="¿Cuánto tiempo tienes hoy?">
        <label htmlFor="minutos" className="mb-2 block text-sm text-slate-600">Minutos disponibles: {minutos}</label>
        <input
          id="minutos"
          type="range"
          min={15}
          max={180}
          step={15}
          value={minutos}
          onChange={(e) => setMinutos(Number(e.target.value))}
          className="w-full accent-teal-600"
        />
      </Tarjeta>

      <div className="rounded-2xl bg-teal-100 p-5 text-teal-900">
        <p className="font-medium">{recomendacion(tension, minutos)}</p>
        {!checkin && (
          <p className="mt-2 text-sm">
            Aún no hiciste el <a href="/check-in" className="underline">check-in</a>; usamos una tensión media como referencia.
          </p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {areas.map(({ clave, titulo }) => {
          const p = principal(clave);
          return (
            <Tarjeta key={clave} titulo={titulo}>
              {p ? (
                <>
                  <p className="text-sm text-slate-500">Prioridad principal</p>
                  <p className="mt-1 text-lg font-medium">{p.texto}</p>
                  {p.demostrativa && <p className="mt-1 text-xs text-amber-700">Ejemplo demostrativo: reemplázalo por tu tarea real.</p>}
                  <div className="mt-4 rounded-xl bg-teal-50 p-4">
                    <p className="text-sm text-slate-500">Primer paso</p>
                    <p className="mt-1">{accionInicial(clave, tension)}</p>
                  </div>
                </>
              ) : (
                <p className="text-slate-500">No tienes tareas en esta área. Agrega una abajo si quieres.</p>
              )}

              <ul className="mt-5 flex flex-col gap-2">
                {tareas.filter((t) => t.area === clave).map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-2 rounded-lg border border-teal-100 px-3 py-2 text-sm">
                    <span>{t.texto}</span>
                    <button type="button" onClick={() => quitar(t.id)} className="shrink-0 text-rose-700 hover:underline">
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex gap-2">
                <label htmlFor={`nueva-${clave}`} className="sr-only">Nueva tarea de {titulo}</label>
                <input
                  id={`nueva-${clave}`}
                  value={nueva[clave]}
                  onChange={(e) => setNueva((prev) => ({ ...prev, [clave]: e.target.value }))}
                  placeholder="Escribe una tarea real"
                  className="min-w-0 flex-1 rounded-xl border border-teal-200 px-3 py-2 outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                  type="button"
                  onClick={() => agregar(clave)}
                  className="rounded-xl bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                >
                  Agregar
                </button>
              </div>
            </Tarjeta>
          );
        })}
      </div>
    </div>
  );
}
