"use client";

import Link from "next/link";
import { useState } from "react";
import Respiracion from "@/components/Respiracion";
import Tarjeta from "@/components/Tarjeta";

const alternativas = [
  "Observa cinco cosas que ves a tu alrededor.",
  "Apoya los pies en el suelo y siente su peso.",
  "Pon una mano en el pecho y nota su movimiento, sin forzarlo.",
];

export default function Pausa() {
  const [paso1, setPaso1] = useState(false);
  const [paso2, setPaso2] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-800">🫧 Oasis de Calma</h1>
        <p className="mt-2 text-slate-600">Inhala con la mascota, suelta el aire despacio y tómate tu tiempo. Puedes parar cuando quieras.</p>
      </div>

      <Tarjeta>
        <Respiracion />
      </Tarjeta>

      <Tarjeta titulo="Si la respiración te incomoda">
        <ul className="list-disc space-y-1 pl-5 text-slate-700">
          {alternativas.map((a) => <li key={a}>{a}</li>)}
        </ul>
      </Tarjeta>

      <Tarjeta titulo="Antes de seguir, dos pasos">
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={paso1} onChange={(e) => setPaso1(e.target.checked)} className="mt-1 h-4 w-4 accent-teal-600" />
          <span>Reconozco cómo me siento en este momento.</span>
        </label>
        <div className="mt-4">
          <label htmlFor="accion" className="block text-slate-700">Elijo una pequeña acción de autocuidado:</label>
          <input
            id="accion"
            value={paso2}
            onChange={(e) => setPaso2(e.target.value.slice(0, 120))}
            placeholder="Por ejemplo: tomar agua, estirar el cuello, caminar 2 minutos"
            className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </Tarjeta>

      <div className="flex justify-center">
        <Link href="/evaluacion" className="rounded-xl bg-white px-5 py-3 font-medium text-teal-800 shadow-sm hover:bg-teal-50">
          Registrar cómo me siento ahora
        </Link>
      </div>
    </div>
  );
}
