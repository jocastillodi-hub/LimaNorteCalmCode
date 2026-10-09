"use client";

import Link from "next/link";
import Tarjeta from "@/components/Tarjeta";
import { useSesion } from "@/lib/session";

export default function Inicio() {
  const { nombre, setNombre } = useSesion();

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teal-700 sm:text-5xl">Bienvenido</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Un espacio para reconocer cómo te sientes, bajar la tensión y ordenar tu estudio sin presión.
        </p>
        <p className="mx-auto mt-3 max-w-xl rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
          Esta herramienta apoya, no diagnostica.
        </p>
      </div>

      <Tarjeta titulo="¿Cómo te llamamos? (opcional)">
        <label htmlFor="nombre" className="sr-only">
          Nombre opcional
        </label>
        <input
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value.slice(0, 40))}
          placeholder="Puedes escribir un nombre o continuar como anónimo"
          className="w-full rounded-xl border border-teal-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
        />
        <p className="mt-2 text-sm text-slate-500">
          No pedimos registro, correo ni contraseña. El nombre solo se guarda mientras la página está abierta.
        </p>
      </Tarjeta>

      <div className="flex justify-center">
        <Link
          href="/check-in"
          className="rounded-xl bg-teal-600 px-8 py-4 text-lg font-medium text-white shadow transition hover:bg-teal-700"
        >
          Comenzar
        </Link>
      </div>
    </div>
  );
}
