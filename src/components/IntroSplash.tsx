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
        className={`flex h-64 w-64 items-center justify-center rounded-full border-2 border-white/70 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.95),rgba(186,230,253,0.35)_45%,rgba(56,189,248,0.25))] p-6 text-center text-xl font-extrabold text-sky-950 shadow-[inset_0_-18px_40px_rgba(255,255,255,0.6),inset_0_12px_30px_rgba(255,255,255,0.7),0_20px_50px_rgba(14,116,144,0.35)] sm:h-72 sm:w-72 sm:text-2xl ${
          iniciado ? "burbuja-estalla" : "burbuja-levita"
        }`}
      >
        Tocar para entrar
      </button>
    </div>
  );
}
