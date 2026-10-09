import Tarjeta from "@/components/Tarjeta";
import { apoyoUCV, emergencia } from "@/lib/config";

export default function Apoyo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-sky-900">🛟 Salvavidas</h1>
        <p className="mt-2 text-slate-600">Pedir ayuda profesional es un gesto de cuidado, no de debilidad.</p>
      </div>

      <Tarjeta titulo="Hablar con un profesional">
        <a
          href={apoyoUCV.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl border-b-4 border-sky-700 bg-sky-500 px-5 py-4 text-center text-lg font-bold text-white shadow hover:bg-sky-600 active:translate-y-0.5 active:border-b-0"
        >
          {apoyoUCV.nombre}
        </a>
        {apoyoUCV.contacto && <p className="mt-4 text-slate-700">Contacto: {apoyoUCV.contacto}</p>}
      </Tarjeta>

      <Tarjeta titulo="Si estás en peligro ahora">
        <p className="font-medium text-rose-800">
          Busca ayuda inmediata: llama a emergencias o acude a la persona más cercana.
        </p>
        <a
          href={`tel:${emergencia.numero}`}
          className="mt-4 block rounded-2xl border-b-4 border-red-700 bg-red-500 px-5 py-4 text-center text-lg font-bold text-white shadow hover:bg-red-600 active:translate-y-0.5 active:border-b-0"
        >
          {emergencia.etiqueta}
        </a>
      </Tarjeta>

      <Tarjeta titulo="Hablar con alguien de confianza">
        <p className="text-slate-700">
          No tienes que explicarlo perfecto. Basta con decir: “últimamente estoy muy cargado/a y quiero hablarlo”.
        </p>
      </Tarjeta>
    </div>
  );
}
