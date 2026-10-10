"use client";

import { useEffect, useState } from "react";
import { Fredoka, Lilita_One } from "next/font/google";
import { iniciarMusica } from "@/lib/musica";

const marca = Lilita_One({ subsets: ["latin"], weight: "400" });
const eslogan = Fredoka({ subsets: ["latin"], weight: ["600"] });

// Campo de estrellas: posiciones y ritmos deterministas para que no cambien entre renderizados.
const estrellaCantidad = 70;

const estrellas = Array.from({ length: estrellaCantidad }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 23.17 + n * 61.3) * 43758.5453) % 1 + 1) % 1;
  return {
    id: i,
    izquierda: Math.round(r(1) * 1000) / 10,
    arriba: Math.round(r(2) * 1000) / 10,
    tamano: 1 + Math.round(r(3) * 2),
    duracion: Math.round((2 + r(4) * 3) * 10) / 10,
    retraso: Math.round(r(5) * -50) / 10,
  };
});

// Tiempos de la secuencia: estallido (globals.css `.burbuja-estalla`) y desvanecido del fondo.
const MS_ESTALLAR = 200;
const MS_DESVANECER = 300;

export default function IntroSplash() {
  const [estado, setEstado] = useState<"visible" | "estallando" | "desvaneciendo" | "oculto">("visible");

  // Tras el estallido, se desvanece el splash y luego se retira.
  useEffect(() => {
    if (estado === "estallando") {
      const id = window.setTimeout(() => setEstado("desvaneciendo"), MS_ESTALLAR);
      return () => window.clearTimeout(id);
    }
    if (estado === "desvaneciendo") {
      const id = window.setTimeout(() => setEstado("oculto"), MS_DESVANECER);
      return () => window.clearTimeout(id);
    }
  }, [estado]);

  if (estado === "oculto") return null;

  const iniciado = estado !== "visible";

  function entrar() {
    if (iniciado) return;
    // Dentro del gesto del usuario: así el navegador permite reproducir el audio.
    iniciarMusica();
    setEstado("estallando");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pantalla de entrada"
      className={`fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#06041a] via-[#14124a] to-[#2a0f5c] transition-opacity duration-300 ${
        estado === "desvaneciendo" ? "opacity-0" : "opacity-100"
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 top-[-10%] h-[50%] w-[150%] bg-gradient-to-r from-cyan-400/30 via-violet-500/20 to-transparent blur-3xl" />
        <div className="absolute -right-1/4 bottom-[-10%] h-[45%] w-[150%] bg-gradient-to-l from-fuchsia-500/25 via-indigo-400/20 to-transparent blur-3xl" />
        {estrellas.map((e) => (
          <span
            key={e.id}
            className="estrella absolute rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.5)]"
            style={{
              left: `${e.izquierda}%`,
              top: `${e.arriba}%`,
              width: e.tamano,
              height: e.tamano,
              animationDuration: `${e.duracion}s`,
              animationDelay: `${e.retraso}s`,
            }}
          />
        ))}
      </div>
      <div className="relative flex flex-col items-center gap-6">
        <h1 className="flex flex-col items-center gap-3 px-4 text-center">
          <span
            className={`${marca.className} text-7xl leading-none tracking-wide text-white drop-shadow-[0_5px_0_#4c1d95] drop-shadow-[0_0_24px_rgba(125,211,252,0.7)] sm:text-8xl`}
          >
            Nexum
          </span>
          <span
            className={`${eslogan.className} rounded-full bg-violet-600 px-5 py-1.5 text-lg tracking-wide text-white shadow-lg shadow-violet-900/60 sm:text-xl`}
          >
            Tu mejor opción
          </span>
        </h1>
        <button
          type="button"
          onClick={entrar}
          disabled={iniciado}
          className={`flex flex-col items-center gap-4 rounded-[3rem] p-4 ${iniciado ? "pulpo-estalla" : "pulpo-levita"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pulpita.png" alt="" aria-hidden="true" className="h-72 w-auto object-contain drop-shadow-xl sm:h-80" />
          <span className="rounded-full bg-white/70 px-5 py-2 text-lg font-extrabold text-sky-950 shadow-md sm:text-xl">
            Tocar para entrar
          </span>
        </button>
      </div>
    </div>
  );
}
