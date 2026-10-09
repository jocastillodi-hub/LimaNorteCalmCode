"use client";

import { useEffect, useRef, useState } from "react";
import { useSesion } from "@/lib/session";

// Racha de la sesión: una hamburguesa dorada que brilla y hace "pop" al subir.
export default function Racha() {
  const { racha } = useSesion();
  const [animando, setAnimando] = useState(false);
  const previa = useRef(racha);

  useEffect(() => {
    if (racha > previa.current) {
      previa.current = racha;
      setAnimando(true);
      const id = setTimeout(() => setAnimando(false), 1200);
      return () => clearTimeout(id);
    }
    previa.current = racha;
  }, [racha]);

  return (
    <div
      className={`flex items-center gap-2 rounded-full bg-amber-300/90 px-3 py-1.5 text-sm font-bold text-amber-950 shadow ${animando ? "racha-pop" : ""}`}
      title="Racha de actividades completadas en esta sesión"
    >
      <span aria-hidden="true" className={`text-lg ${animando ? "racha-brilla" : ""}`}>🍔</span>
      <span aria-live="polite">Racha: {racha}</span>
    </div>
  );
}
