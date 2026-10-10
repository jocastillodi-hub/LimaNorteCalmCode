"use client";

import { useEffect, useState } from "react";

// Música de fondo. El archivo debe estar en public/audio/bg-calma.mp3.
const RUTA_MUSICA = "/audio/bg-calma.mp3";
// Tiempos de la secuencia en globals.css (`.concha-abierta`, `.perla`).
const MS_ABRIR = 800;
const MS_DESVANECER = 300;

// Única instancia de audio: sobrevive al desmontaje del splash.
let musica: HTMLAudioElement | null = null;

// Debe llamarse dentro del gesto del usuario (onClick) para que el navegador permita reproducir.
function iniciarMusica() {
  try {
    musica ??= new Audio(RUTA_MUSICA);
    musica.loop = true;
    musica.volume = 0.35;
    // Si el archivo no existe o el navegador lo bloquea, la app sigue funcionando en silencio.
    void musica.play().catch(() => {});
  } catch {
    // Sin soporte de audio no hay nada que reproducir.
  }
}

// Concha de mar con perla. Las valvas se abren al tocarla y la perla sube a la superficie.
function ConchaConPerla() {
  return (
    <svg aria-hidden="true" viewBox="0 0 200 200" className="concha-mece h-64 w-64 overflow-visible drop-shadow-xl sm:h-80 sm:w-80">
      <defs>
        <radialGradient id="grad-valva" cx="50%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="55%" stopColor="#fbcfe8" />
          <stop offset="100%" stopColor="#f472b6" />
        </radialGradient>
        <radialGradient id="grad-perla" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </radialGradient>
      </defs>

      {/* Valva izquierda: gira desde la bisagra inferior */}
      <g className="valva valva-izq">
        <path d="M100 170 C55 172 18 140 14 96 C11 62 38 30 70 36 C86 39 96 52 100 68 Z" fill="url(#grad-valva)" stroke="#be185d" strokeWidth="3" strokeLinejoin="round" />
        <path d="M100 170 L40 62 M100 170 L66 42 M100 170 L22 110" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* Valva derecha: espejo de la izquierda */}
      <g className="valva valva-der">
        <path d="M100 170 C145 172 182 140 186 96 C189 62 162 30 130 36 C114 39 104 52 100 68 Z" fill="url(#grad-valva)" stroke="#be185d" strokeWidth="3" strokeLinejoin="round" />
        <path d="M100 170 L160 62 M100 170 L134 42 M100 170 L178 110" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      {/* Perla: visible sobre la concha cerrada, sube y brilla al abrirla */}
      <g className="perla">
        <circle cx="100" cy="125" r="22" fill="url(#grad-perla)" stroke="#bae6fd" strokeWidth="2" />
        <ellipse cx="92" cy="116" rx="6" ry="4" fill="#ffffff" opacity="0.9" />
      </g>
    </svg>
  );
}

export default function IntroSplash() {
  const [estado, setEstado] = useState<"visible" | "abriendo" | "desvaneciendo" | "oculto">("visible");

  // Secuencia tras el toque: abrir la concha, desvanecer el fondo y retirar el splash.
  useEffect(() => {
    if (estado === "abriendo") {
      const id = window.setTimeout(() => setEstado("desvaneciendo"), MS_ABRIR);
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
    iniciarMusica();
    setEstado("abriendo");
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
        aria-label="Tocar para entrar"
        className={`flex flex-col items-center gap-6 rounded-[3rem] p-4 ${iniciado ? "concha-abierta" : ""}`}
      >
        <ConchaConPerla />
        <span className="rounded-full bg-white/70 px-5 py-2 text-lg font-extrabold text-sky-950 shadow-md sm:text-xl">
          Tocar para entrar
        </span>
      </button>
    </div>
  );
}
