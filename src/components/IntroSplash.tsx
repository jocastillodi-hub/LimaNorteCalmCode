"use client";

import { useEffect, useState } from "react";

// Música de fondo. El archivo debe estar en public/audio/bg-calma.mp3.
const RUTA_MUSICA = "/audio/bg-calma.mp3";
// Duración del estallido en globals.css (`.splash-estalla`).
const DURACION_ESTALLIDO_MS = 200;

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

export default function IntroSplash() {
  const [estado, setEstado] = useState<"visible" | "estallando" | "oculto">("visible");

  // Tras el estallido, el splash se retira y deja ver la aplicación.
  useEffect(() => {
    if (estado !== "estallando") return;
    const id = window.setTimeout(() => setEstado("oculto"), DURACION_ESTALLIDO_MS);
    return () => window.clearTimeout(id);
  }, [estado]);

  if (estado === "oculto") return null;

  const estallando = estado === "estallando";

  function entrar() {
    if (estallando) return;
    iniciarMusica();
    setEstado("estallando");
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pantalla de entrada"
      className={`fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-gradient-to-b from-sky-400 via-cyan-300 to-teal-200 transition-opacity duration-200 ${estallando ? "opacity-0" : "opacity-100"}`}
    >
      <button
        type="button"
        onClick={entrar}
        disabled={estallando}
        aria-label="Tocar para entrar"
        className={`flex h-56 w-56 items-center justify-center rounded-full border-2 border-white/70 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.95),rgba(186,230,253,0.35)_45%,rgba(56,189,248,0.25))] text-center text-xl font-extrabold text-sky-950 shadow-[inset_0_-18px_40px_rgba(255,255,255,0.6),inset_0_12px_30px_rgba(255,255,255,0.7),0_20px_50px_rgba(14,116,144,0.35)] sm:h-72 sm:w-72 sm:text-2xl ${
          estallando ? "splash-estalla" : "splash-flota"
        }`}
      >
        <span>Tocar para entrar</span>
      </button>
    </div>
  );
}
