"use client";

import { useEffect, useState } from "react";
import { iniciarMusica } from "@/lib/musica";

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
      className={`fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 via-cyan-300 to-teal-200 transition-opacity duration-300 ${
        estado === "desvaneciendo" ? "opacity-0" : "opacity-100"
      }`}
    >
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
  );
}
